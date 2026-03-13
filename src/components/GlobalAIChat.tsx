import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Mic, Paperclip, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import {
  ExpandableChat,
  ExpandableChatBody,
  ExpandableChatFooter,
  ExpandableChatHeader,
} from '@/components/ui/expandable-chat';
import { AppView } from '@/types/navigation';

interface GlobalAIChatProps {
  currentView: AppView;
  contextMode: 'organization' | 'event';
  selectedEventName?: string | null;
}

type Sender = 'ai' | 'user';

interface ChatMessage {
  id: number;
  content: string;
  sender: Sender;
  attachments?: string[];
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly 0: {
    readonly transcript: string;
  };
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const viewTitles: Record<AppView, string> = {
  dashboard: 'dashboard overview',
  'create-event': 'event setup',
  'event-management': 'event operations',
  analytics: 'analytics',
  team: 'team management',
  finance: 'finance',
  'notification-center': 'notification center',
  settings: 'settings',
  help: 'help center',
};

const getIntroMessage = (currentView: AppView, contextMode: 'organization' | 'event', selectedEventName?: string | null) => {
  const pageLabel = viewTitles[currentView];
  const scopeLabel =
    contextMode === 'event' && selectedEventName ? ` for ${selectedEventName}` : '';

  return `You’re on ${pageLabel}${scopeLabel}. Ask for a summary, next step, or checklist and I’ll help from here.`;
};

export function GlobalAIChat({ currentView, contextMode, selectedEventName }: GlobalAIChatProps) {
  const introMessage = useMemo(
    () => getIntroMessage(currentView, contextMode, selectedEventName),
    [contextMode, currentView, selectedEventName]
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      content: introMessage,
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [composerNotice, setComposerNotice] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const inputBeforeListeningRef = useRef('');

  useEffect(() => () => {
    recognitionRef.current?.stop();
  }, []);

  const getSpeechRecognitionConstructor = (): SpeechRecognitionConstructor | null => {
    if (typeof window === 'undefined') return null;

    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };

    return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition || null;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedInput = input.trim();
    const attachmentNames = attachments.map((file) => file.name);

    if (!trimmedInput && attachmentNames.length === 0) return;

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: previousMessages.length + 1,
        content: trimmedInput || 'Attached files',
        sender: 'user',
        attachments: attachmentNames,
      },
    ]);
    setInput('');
    setAttachments([]);
    setComposerNotice(null);
    setIsLoading(true);

    window.setTimeout(() => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: previousMessages.length + 1,
          content:
            attachmentNames.length > 0
              ? `I can see ${attachmentNames.length} attachment${attachmentNames.length > 1 ? 's' : ''}: ${attachmentNames.join(', ')}. Next step is connecting this widget to a real assistant for ${viewTitles[currentView]}.`
              : `This AI entry point is wired globally. Next step is connecting it to a real assistant for ${viewTitles[currentView]}.`,
          sender: 'ai',
        },
      ]);
      setIsLoading(false);
    }, 700);
  };

  const handleAttachFile = () => {
    setComposerNotice(null);
    fileInputRef.current?.click();
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length === 0) return;

    setAttachments((currentFiles) => {
      const nextFiles = [...currentFiles];

      selectedFiles.forEach((selectedFile) => {
        const isDuplicate = nextFiles.some(
          (file) =>
            file.name === selectedFile.name &&
            file.size === selectedFile.size &&
            file.lastModified === selectedFile.lastModified
        );

        if (!isDuplicate) {
          nextFiles.push(selectedFile);
        }
      });

      return nextFiles;
    });
    setComposerNotice(`${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} ready to send.`);
    event.target.value = '';
  };

  const removeAttachment = (fileToRemove: File) => {
    setAttachments((currentFiles) =>
      currentFiles.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          )
      )
    );
  };

  const handleMicrophoneClick = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setComposerNotice('Voice capture stopped.');
      return;
    }

    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor) {
      setComposerNotice('Voice input is not supported in this browser.');
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcripts = Array.from(event.results)
          .slice(event.resultIndex)
          .map((result) => result[0]?.transcript?.trim() || '')
          .filter(Boolean);

        const transcript = transcripts.join(' ').trim();
        if (!transcript) return;

        const baseValue = inputBeforeListeningRef.current.trim();
        setInput(baseValue ? `${baseValue} ${transcript}`.trim() : transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setComposerNotice('Microphone permission was blocked. Allow microphone access and try again.');
          return;
        }

        if (event.error === 'no-speech') {
          setComposerNotice('No speech was detected. Try again.');
          return;
        }

        setComposerNotice('Voice input could not start. Try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    inputBeforeListeningRef.current = input;
    setComposerNotice('Listening… speak now.');
    setIsListening(true);

    try {
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
      setComposerNotice('Voice input is already active or unavailable right now.');
    }
  };

  return (
    <ExpandableChat
      size="lg"
      position="bottom-right"
      icon={(
        <span className="ai-chat-toggle__brand" aria-hidden="true">
          <img
            src="/images/Geo AI logo.png"
            alt=""
            className="ai-chat-toggle__brand-image"
          />
          <span className="ai-chat-toggle__brand-label">Geo</span>
        </span>
      )}
    >
      <ExpandableChatHeader className="ai-chat-header--stacked">
        <h2 className="ai-chat-title">Dashboard AI</h2>
        <p className="ai-chat-subtitle">{introMessage}</p>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble key={message.id} variant={message.sender === 'user' ? 'sent' : 'received'}>
              <ChatBubbleAvatar
                src={
                  message.sender === 'user'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop'
                    : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop'
                }
                fallback={message.sender === 'user' ? 'JD' : 'AI'}
              />
              <ChatBubbleMessage variant={message.sender === 'user' ? 'sent' : 'received'}>
                {message.content}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="ai-chat-bubble__attachments">
                    {message.attachments.map((attachment) => (
                      <span key={attachment} className="ai-chat-bubble__attachment-pill">
                        {attachment}
                      </span>
                    ))}
                  </div>
                )}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <form onSubmit={handleSubmit} className="ai-chat-composer">
          <input
            ref={fileInputRef}
            type="file"
            className="ai-chat-hidden-input"
            multiple
            onChange={handleFileSelection}
          />
          <ChatInput
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about this page..."
            className="ai-chat-composer__input"
          />
          {attachments.length > 0 && (
            <div className="ai-chat-composer__attachments">
              {attachments.map((file) => (
                <span
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  className="ai-chat-composer__attachment-pill"
                >
                  <span className="ai-chat-composer__attachment-name">{file.name}</span>
                  <button
                    type="button"
                    className="ai-chat-composer__attachment-remove"
                    onClick={() => removeAttachment(file)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X />
                  </button>
                </span>
              ))}
            </div>
          )}
          {composerNotice && <p className="ai-chat-composer__notice">{composerNotice}</p>}
          <div className="ai-chat-composer__actions">
            <div className="ai-chat-composer__secondary-actions">
              <Button variant="ghost" size="icon" type="button" onClick={handleAttachFile}>
                <Paperclip />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleMicrophoneClick}
                className={isListening ? 'ai-chat-mic-button ai-chat-mic-button--active' : 'ai-chat-mic-button'}
                aria-pressed={isListening}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                <Mic />
              </Button>
            </div>
            <Button type="submit" size="sm" className="ai-chat-composer__submit">
              Send
              <CornerDownLeft />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}

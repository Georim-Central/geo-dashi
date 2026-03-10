import { FormEvent, useMemo, useState } from 'react';
import { Bot, CornerDownLeft, Mic, Paperclip } from 'lucide-react';

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

type AppView =
  | 'dashboard'
  | 'create-event'
  | 'event-management'
  | 'analytics'
  | 'team'
  | 'finance'
  | 'profile'
  | 'help';

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
}

const viewTitles: Record<AppView, string> = {
  dashboard: 'dashboard overview',
  'create-event': 'event setup',
  'event-management': 'event operations',
  analytics: 'analytics',
  team: 'team management',
  finance: 'finance',
  profile: 'profile settings',
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: previousMessages.length + 1,
        content: trimmedInput,
        sender: 'user',
      },
    ]);
    setInput('');
    setIsLoading(true);

    window.setTimeout(() => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: previousMessages.length + 1,
          content: `This AI entry point is wired globally. Next step is connecting it to a real assistant for ${viewTitles[currentView]}.`,
          sender: 'ai',
        },
      ]);
      setIsLoading(false);
    }, 700);
  };

  const handleAttachFile = () => undefined;
  const handleMicrophoneClick = () => undefined;

  return (
    <ExpandableChat size="lg" position="bottom-right" icon={<Bot />}>
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
          <ChatInput
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about this page..."
            className="ai-chat-composer__input"
          />
          <div className="ai-chat-composer__actions">
            <div className="ai-chat-composer__secondary-actions">
              <Button variant="ghost" size="icon" type="button" onClick={handleAttachFile}>
                <Paperclip />
              </Button>

              <Button variant="ghost" size="icon" type="button" onClick={handleMicrophoneClick}>
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

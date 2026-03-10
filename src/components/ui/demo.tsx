"use client";

import { FormEvent, useState } from 'react';
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

export function ExpandableChatDemo() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: 'Hello! How can I help you today?',
      sender: 'ai',
    },
    {
      id: 2,
      content: 'I have a question about the dashboard.',
      sender: 'user',
    },
    {
      id: 3,
      content: 'Sure. Ask anything about the current page or your workflow.',
      sender: 'ai',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        id: previousMessages.length + 1,
        content: input,
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
          content: 'This is a demo AI response.',
          sender: 'ai',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleAttachFile = () => undefined;
  const handleMicrophoneClick = () => undefined;

  return (
    <ExpandableChat size="lg" position="bottom-right" icon={<Bot />}>
      <ExpandableChatHeader className="ai-chat-header--stacked">
        <h2 className="ai-chat-title">Chat with AI</h2>
        <p className="ai-chat-subtitle">Ask me anything about the dashboard.</p>
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
                fallback={message.sender === 'user' ? 'US' : 'AI'}
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
            placeholder="Type your message..."
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
              Send Message
              <CornerDownLeft />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}

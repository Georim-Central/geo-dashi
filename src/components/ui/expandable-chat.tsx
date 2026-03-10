"use client";

import React, { useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type ChatPosition = 'bottom-right' | 'bottom-left';
export type ChatSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ExpandableChatProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: ChatPosition;
  size?: ChatSize;
  icon?: React.ReactNode;
}

const ExpandableChat: React.FC<ExpandableChatProps> = ({
  className,
  position = 'bottom-right',
  size = 'md',
  icon,
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen((currentState) => !currentState);

  return (
    <div
      className={cn(
        'ai-chat-root',
        position === 'bottom-left' ? 'ai-chat-root--bottom-left' : 'ai-chat-root--bottom-right',
        className
      )}
      {...props}
    >
      <div
        ref={chatRef}
        className={cn(
          'ai-chat-panel',
          `ai-chat-panel--${size}`,
          position === 'bottom-left' ? 'ai-chat-panel--bottom-left' : 'ai-chat-panel--bottom-right',
          isOpen ? 'ai-chat-panel--open' : 'ai-chat-panel--closed'
        )}
      >
        {children}
        <Button
          variant="ghost"
          size="icon"
          className="ai-chat-mobile-close"
          onClick={toggleChat}
          aria-label="Close chat"
        >
          <X />
        </Button>
      </div>
      <ExpandableChatToggle icon={icon} isOpen={isOpen} toggleChat={toggleChat} />
    </div>
  );
};

ExpandableChat.displayName = 'ExpandableChat';

const ExpandableChatHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('ai-chat-header', className)} {...props} />
);

ExpandableChatHeader.displayName = 'ExpandableChatHeader';

const ExpandableChatBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('ai-chat-body', className)} {...props} />
);

ExpandableChatBody.displayName = 'ExpandableChatBody';

const ExpandableChatFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('ai-chat-footer', className)} {...props} />
);

ExpandableChatFooter.displayName = 'ExpandableChatFooter';

interface ExpandableChatToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  isOpen: boolean;
  toggleChat: () => void;
}

const ExpandableChatToggle: React.FC<ExpandableChatToggleProps> = ({
  className,
  icon,
  isOpen,
  toggleChat,
  ...props
}) => (
  <Button
    variant="default"
    onClick={toggleChat}
    className={cn('ai-chat-toggle', className)}
    aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
    {...props}
  >
    {isOpen ? <X /> : icon || <MessageCircle />}
  </Button>
);

ExpandableChatToggle.displayName = 'ExpandableChatToggle';

export {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
};

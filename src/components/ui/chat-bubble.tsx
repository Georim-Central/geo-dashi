"use client";

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageLoading } from '@/components/ui/message-loading';

interface ChatBubbleProps {
  variant?: 'sent' | 'received';
  layout?: 'default' | 'ai';
  className?: string;
  children: React.ReactNode;
}

export function ChatBubble({ variant = 'received', layout = 'default', className, children }: ChatBubbleProps) {
  return (
    <div
      className={cn(
        'ai-chat-bubble',
        variant === 'sent' && 'ai-chat-bubble--sent',
        layout === 'ai' && 'ai-chat-bubble--ai',
        className
      )}
    >
      {children}
    </div>
  );
}

interface ChatBubbleMessageProps {
  variant?: 'sent' | 'received';
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function ChatBubbleMessage({
  variant = 'received',
  isLoading,
  className,
  children,
}: ChatBubbleMessageProps) {
  return (
    <div
      className={cn(
        'ai-chat-bubble__message',
        variant === 'sent' ? 'ai-chat-bubble__message--sent' : 'ai-chat-bubble__message--received',
        className
      )}
    >
      {isLoading ? (
        <div className="ai-chat-bubble__loading">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

export function ChatBubbleAvatar({ src, fallback = 'AI', className }: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn('ai-chat-bubble__avatar', className)}>
      {src && <AvatarImage src={src} alt="" />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ChatBubbleAction({ icon, onClick, className }: ChatBubbleActionProps) {
  return (
    <Button variant="ghost" size="icon" className={cn('ai-chat-bubble__action', className)} onClick={onClick}>
      {icon}
    </Button>
  );
}

export function ChatBubbleActionWrapper({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('ai-chat-bubble__actions', className)}>{children}</div>;
}

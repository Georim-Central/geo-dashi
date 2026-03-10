import * as React from 'react';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type ChatInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(({ className, ...props }, ref) => (
  <Textarea autoComplete="off" ref={ref} name="message" className={cn('ai-chat-input', className)} {...props} />
));

ChatInput.displayName = 'ChatInput';

export { ChatInput };

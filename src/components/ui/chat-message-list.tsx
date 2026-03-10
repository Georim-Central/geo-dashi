import * as React from 'react';
import { ArrowDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAutoScroll } from '@/components/hooks/use-auto-scroll';
import { cn } from '@/lib/utils';

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, ...props }, _ref) => {
    const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } = useAutoScroll({
      smooth,
      content: children,
    });

    return (
      <div className="ai-chat-message-list-shell">
        <div
          className={cn('ai-chat-message-list', className)}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          {...props}
        >
          <div className="ai-chat-message-list__stack">{children}</div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={scrollToBottom}
            size="icon"
            variant="outline"
            className="ai-chat-scroll-button"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="ai-chat-scroll-button__icon" />
          </Button>
        )}
      </div>
    );
  }
);

ChatMessageList.displayName = 'ChatMessageList';

export { ChatMessageList };

"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { scrollTabPageToTop } from "@/components/ui/tab-scroll";

type TabsContextValue = {
  currentValue: string | null;
  hoveredValue: string | null;
  setHoveredValue: (value: string | null) => void;
  registerTrigger: (value: string, node: HTMLButtonElement | null) => void;
  getTriggerNode: (value: string | null) => HTMLButtonElement | null;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used within <Tabs />.");
  }

  return context;
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ value, defaultValue, onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = useState<string | null>(
    (typeof value === "string" ? value : undefined) ?? defaultValue ?? null
  );
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const triggerNodesRef = useRef(new Map<string, HTMLButtonElement | null>());

  useEffect(() => {
    if (typeof value === "string") {
      setInternalValue(value);
    }
  }, [value]);

  const contextValue = React.useMemo<TabsContextValue>(
    () => ({
      currentValue: internalValue,
      hoveredValue,
      setHoveredValue,
      registerTrigger: (triggerValue, node) => {
        triggerNodesRef.current.set(triggerValue, node);
      },
      getTriggerNode: (triggerValue) => (triggerValue ? triggerNodesRef.current.get(triggerValue) ?? null : null),
    }),
    [hoveredValue, internalValue]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(nextValue) => {
          setInternalValue(nextValue);
          onValueChange?.(nextValue);
        }}
        {...props}
      />
    </TabsContext.Provider>
  );
});
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, onPointerLeave, onMouseLeave, ...props }, ref) => {
  const { currentValue, hoveredValue, setHoveredValue, getTriggerNode } = useTabsContext();
  const [hoverStyle, setHoverStyle] = useState<React.CSSProperties>({});
  const [activeStyle, setActiveStyle] = useState<React.CSSProperties>({ left: "0px", width: "0px" });
  const listRef = useRef<React.ElementRef<typeof TabsPrimitive.List> | null>(null);

  useEffect(() => {
    const hoveredElement = getTriggerNode(hoveredValue);
    if (!hoveredElement) return;

    setHoverStyle({
      left: `${hoveredElement.offsetLeft}px`,
      width: `${hoveredElement.offsetWidth}px`,
    });
  }, [getTriggerNode, hoveredValue]);

  useEffect(() => {
    const activeElement = getTriggerNode(currentValue);
    if (!activeElement) return;

    setActiveStyle({
      left: `${activeElement.offsetLeft}px`,
      width: `${activeElement.offsetWidth}px`,
    });

    if (typeof activeElement.scrollIntoView === "function") {
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [currentValue, getTriggerNode]);

  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const updateIndicators = () => {
      const activeElement = getTriggerNode(currentValue);
      if (activeElement) {
        setActiveStyle({
          left: `${activeElement.offsetLeft}px`,
          width: `${activeElement.offsetWidth}px`,
        });
      }

      const hoveredElement = getTriggerNode(hoveredValue);
      if (hoveredElement) {
        setHoverStyle({
          left: `${hoveredElement.offsetLeft}px`,
          width: `${hoveredElement.offsetWidth}px`,
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => updateIndicators());
    resizeObserver.observe(listElement);
    window.addEventListener("resize", updateIndicators);
    requestAnimationFrame(updateIndicators);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateIndicators);
    };
  }, [currentValue, getTriggerNode, hoveredValue]);

  return (
    <div className="overflow-x-auto overflow-y-hidden pb-[8px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <TabsPrimitive.List
        ref={(node) => {
          listRef.current = node;
          if (typeof ref === "function") {
            ref(node);
            return;
          }
          if (ref) {
            ref.current = node;
          }
        }}
        className={cn("ui-tabs-list relative flex min-w-max items-center space-x-[6px]", className)}
        onPointerLeave={(event) => {
          setHoveredValue(null);
          onPointerLeave?.(event);
        }}
        onMouseLeave={(event) => {
          setHoveredValue(null);
          onMouseLeave?.(event);
        }}
        {...props}
      >
        <div
          className="pointer-events-none absolute transition-all duration-300 ease-out"
          style={{
            ...hoverStyle,
            top: "0px",
            height: "30px",
            borderRadius: "6px",
            backgroundColor: "rgba(118, 38, 198, 0.10)",
            opacity: hoveredValue !== null ? 1 : 0,
          }}
        />
        <div
          className="pointer-events-none absolute transition-all duration-300 ease-out"
          style={{
            ...activeStyle,
            bottom: "-6px",
            height: "2px",
            backgroundColor: "#7626c6",
          }}
        />
        {props.children}
      </TabsPrimitive.List>
    </div>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, children, onClick, ...props }, ref) => {
  const { currentValue, registerTrigger, setHoveredValue } = useTabsContext();
  const isActive = currentValue === value;

  return (
    <TabsPrimitive.Trigger
      ref={(node) => {
        registerTrigger(value, node);
        if (typeof ref === "function") {
          ref(node);
          return;
        }
        if (ref) {
          ref.current = node;
        }
      }}
      value={value}
      className={cn(
        "ui-tabs-trigger relative h-[30px] whitespace-nowrap px-3 py-2 text-sm font-medium leading-5 outline-none transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "text-[#7626c6]" : "text-[#0e0f1199] hover:text-[#5f1fa3]",
        className
      )}
      onClick={(event) => {
        scrollTabPageToTop(event.currentTarget);
        onClick?.(event);
      }}
      onPointerEnter={() => setHoveredValue(value)}
      onFocus={() => setHoveredValue(value)}
      onBlur={() => setHoveredValue(null)}
      {...props}
    >
      <div className="flex h-full items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-5">
        {children}
      </div>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 outline-none focus-visible:ring-2 focus-visible:ring-[#7626c6]/30",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };

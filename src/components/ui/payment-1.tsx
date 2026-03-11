"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

type PaymentMethod = {
  id: string | number;
  icon: React.ReactNode;
  label: string;
  description: string;
};

interface PaymentMethodSelectorProps {
  title: string;
  actionText: string;
  methods: PaymentMethod[];
  defaultSelectedId?: string | number;
  onActionClick?: () => void;
  onSelectionChange?: (id: string | number) => void;
  className?: string;
}

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export function PaymentMethodSelector({
  title,
  actionText,
  methods,
  defaultSelectedId,
  onActionClick,
  onSelectionChange,
  className,
}: PaymentMethodSelectorProps) {
  const [selectedId, setSelectedId] = React.useState(
    defaultSelectedId ?? (methods.length > 0 ? methods[0].id : null)
  );

  const handleSelect = (id: string | number) => {
    setSelectedId(id);
    onSelectionChange?.(id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const cardClasses = `w-full rounded-xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm ${className || ""}`;

  return (
    <div className={cardClasses}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <button
          type="button"
          onClick={onActionClick}
          className="flex items-center gap-1 text-sm font-medium text-[#7626c6] transition-colors hover:text-[#5f1fa3]"
        >
          <PlusIcon className="h-4 w-4" />
          {actionText}
        </button>
      </div>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="radiogroup"
      >
        {methods.map((method) => {
          const isSelected = selectedId === method.id;

          return (
            <motion.div
              key={method.id}
              variants={itemVariants}
              onClick={() => handleSelect(method.id)}
              onKeyDown={(event) =>
                (event.key === " " || event.key === "Enter") &&
                handleSelect(method.id)
              }
              className="flex cursor-pointer items-center rounded-lg border p-4 transition-all duration-300 hover:bg-gray-50"
              style={{
                borderColor: isSelected ? "#7626c6" : "#e5e7eb",
                boxShadow: isSelected
                  ? "0 0 0 2px rgba(118, 38, 198, 0.18)"
                  : "none",
              }}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
            >
              <div className="flex-shrink-0">{method.icon}</div>
              <div className="ml-4 flex-grow">
                <p className="font-medium text-gray-900">{method.label}</p>
                <p className="text-sm text-gray-500">
                  {method.description}
                </p>
              </div>
              <div
                className="ml-4 flex h-6 w-6 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: isSelected ? "#7626c6" : "#d1d5db",
                }}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="h-3 w-3 rounded-full bg-[#7626c6]"
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

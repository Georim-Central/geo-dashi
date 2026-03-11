"use client";

import { PasswordInput as ArkPasswordInput } from "@ark-ui/react/password-input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  label: string;
  placeholder?: string;
  hint?: string;
}

export function PasswordField({ label, placeholder, hint }: PasswordFieldProps) {
  return (
    <ArkPasswordInput.Root>
      <ArkPasswordInput.Label className="mb-2 block text-sm font-medium text-gray-500">
        {label}
      </ArkPasswordInput.Label>
      <ArkPasswordInput.Control className="relative h-14 overflow-hidden rounded-2xl border border-gray-200 bg-[#fafafa] shadow-sm transition-all focus-within:border-[#7626c6] focus-within:ring-4 focus-within:ring-[#7626c6]/10">
        <ArkPasswordInput.Input
          placeholder={placeholder}
          className="h-full w-full border-none bg-transparent px-4 pr-12 text-[1.02rem] text-gray-900 outline-none placeholder:text-gray-400"
        />
        <ArkPasswordInput.VisibilityTrigger
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
          aria-label={`Toggle ${label.toLowerCase()} visibility`}
        >
          <ArkPasswordInput.Indicator fallback={<EyeOff className="h-5 w-5" />}>
            <Eye className="h-5 w-5" />
          </ArkPasswordInput.Indicator>
        </ArkPasswordInput.VisibilityTrigger>
      </ArkPasswordInput.Control>
      {hint ? <p className="mt-2 text-sm text-gray-500">{hint}</p> : null}
    </ArkPasswordInput.Root>
  );
}

import * as React from "react";
import {
  Banknote,
  CreditCard,
  Landmark,
} from "lucide-react";

import { PaymentMethodSelector } from "@/components/ui/payment-1";

export default function PaymentMethodSelectorDemo() {
  const [selectedMethod, setSelectedMethod] = React.useState<string | number>(1);

  const paymentMethods = [
    {
      id: 1,
      icon: (
        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <CreditCard className="h-5 w-5" />
        </div>
      ),
      label: "Visa **** 0912",
      description: "Pay with your Visa card",
    },
    {
      id: 2,
      icon: (
        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          <Landmark className="h-5 w-5" />
        </div>
      ),
      label: "Mastercard **** 0912",
      description: "Pay with your Mastercard",
    },
    {
      id: 3,
      icon: (
        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Banknote className="h-5 w-5" />
        </div>
      ),
      label: "Pay with Wallet",
      description: "Split into 4 interest-free payments",
    },
  ];

  return (
    <div className="flex min-h-[450px] w-full items-center justify-center bg-muted/30 p-4">
      <PaymentMethodSelector
        title="Choose how to pay"
        actionText="Add new method"
        methods={paymentMethods}
        defaultSelectedId={selectedMethod}
        onActionClick={() => undefined}
        onSelectionChange={(id) => {
          setSelectedMethod(id);
        }}
      />
    </div>
  );
}

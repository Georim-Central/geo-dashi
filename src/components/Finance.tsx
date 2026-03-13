import * as React from 'react';
import type { ReactNode } from 'react';

import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CircleAlert,
  CreditCard,
  Landmark,
  Save,
  ShieldCheck,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import Interactive3DAnalyticsDashboardCard from '@/components/ui/interactive-3d-analytics-dashboard-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { downloadReportPdf } from '@/utils/reportExport';

type FinanceTab = 'payouts' | 'transactions' | 'withdrawals' | 'invoices';

type PayoutRecord = {
  id: string;
  date: string;
  destination: string;
  status: 'Paid' | 'In Transit' | 'Scheduled';
  amount: number;
};

type TransactionRecord = {
  id: string;
  buyer: string;
  ticket: string;
  date: string;
  status: 'Settled' | 'Pending' | 'Refunded';
  gross: number;
  fees: number;
  net: number;
};

type WithdrawalRecord = {
  id: string;
  requestedAt: string;
  destination: string;
  eta: string;
  status: 'Completed' | 'Processing' | 'Queued';
  amount: number;
};

type InvoiceRecord = {
  id: string;
  plan: string;
  period: string;
  issuedOn: string;
  status: 'Paid' | 'Due Soon' | 'Draft';
  total: number;
};

type WithdrawalRequestDraft = {
  amount: string;
  destination: string;
  contact: string;
  note: string;
};

const payoutHistory: PayoutRecord[] = [
  {
    id: 'PO-2026-0310',
    date: 'Mar 10, 2026',
    destination: 'Bank of America •••• 3812',
    status: 'Paid',
    amount: 8420.0,
  },
  {
    id: 'PO-2026-0303',
    date: 'Mar 3, 2026',
    destination: 'Bank of America •••• 3812',
    status: 'In Transit',
    amount: 3912.45,
  },
  {
    id: 'PO-2026-0225',
    date: 'Feb 25, 2026',
    destination: 'Stripe Treasury •••• 1149',
    status: 'Scheduled',
    amount: 2150.0,
  },
  {
    id: 'PO-2026-0218',
    date: 'Feb 18, 2026',
    destination: 'Bank of America •••• 3812',
    status: 'Paid',
    amount: 5175.3,
  },
  {
    id: 'PO-2026-0211',
    date: 'Feb 11, 2026',
    destination: 'Stripe Treasury •••• 1149',
    status: 'Paid',
    amount: 2894.2,
  },
  {
    id: 'PO-2026-0204',
    date: 'Feb 4, 2026',
    destination: 'Bank of America •••• 3812',
    status: 'Paid',
    amount: 4310.85,
  },
];

const transactions: TransactionRecord[] = [
  {
    id: 'Order #5847239',
    buyer: 'Ava Johnson',
    ticket: 'VIP Access',
    date: 'Mar 11, 2026',
    status: 'Settled',
    gross: 249.0,
    fees: 17.43,
    net: 231.57,
  },
  {
    id: 'Order #5847124',
    buyer: 'Marco Silva',
    ticket: 'General Admission',
    date: 'Mar 10, 2026',
    status: 'Pending',
    gross: 89.0,
    fees: 7.12,
    net: 81.88,
  },
  {
    id: 'Order #5847011',
    buyer: 'Nina Brooks',
    ticket: 'Backstage Bundle',
    date: 'Mar 9, 2026',
    status: 'Refunded',
    gross: 349.0,
    fees: 0,
    net: -349.0,
  },
  {
    id: 'Order #5846880',
    buyer: 'Theo Clarke',
    ticket: 'Vendor Booth',
    date: 'Mar 8, 2026',
    status: 'Settled',
    gross: 525.0,
    fees: 36.75,
    net: 488.25,
  },
  {
    id: 'Order #5846764',
    buyer: 'Sofia Patel',
    ticket: 'General Admission',
    date: 'Mar 7, 2026',
    status: 'Settled',
    gross: 129.0,
    fees: 10.32,
    net: 118.68,
  },
  {
    id: 'Order #5846641',
    buyer: 'Liam Turner',
    ticket: 'VIP Access',
    date: 'Mar 6, 2026',
    status: 'Pending',
    gross: 249.0,
    fees: 17.43,
    net: 231.57,
  },
];

const withdrawals: WithdrawalRecord[] = [
  {
    id: 'WD-1029',
    requestedAt: 'Mar 10, 2026 · 10:30 AM',
    destination: 'Chase Checking •••• 4408',
    eta: 'Expected Mar 12',
    status: 'Processing',
    amount: 6200.0,
  },
  {
    id: 'WD-1021',
    requestedAt: 'Mar 1, 2026 · 4:15 PM',
    destination: 'Bank of America •••• 3812',
    eta: 'Completed Mar 3',
    status: 'Completed',
    amount: 3800.0,
  },
  {
    id: 'WD-1017',
    requestedAt: 'Feb 24, 2026 · 9:00 AM',
    destination: 'Bank of America •••• 3812',
    eta: 'Queued for next payout cycle',
    status: 'Queued',
    amount: 1950.0,
  },
];

const invoices: InvoiceRecord[] = [
  {
    id: 'INV-2026-03',
    plan: 'Pro Organizer',
    period: 'Mar 1 - Mar 31, 2026',
    issuedOn: 'Mar 1, 2026',
    status: 'Paid',
    total: 149.0,
  },
  {
    id: 'INV-2026-02',
    plan: 'Pro Organizer',
    period: 'Feb 1 - Feb 29, 2026',
    issuedOn: 'Feb 1, 2026',
    status: 'Paid',
    total: 149.0,
  },
  {
    id: 'INV-2026-04',
    plan: 'Organizer Support Add-on',
    period: 'Apr 1 - Apr 30, 2026',
    issuedOn: 'Mar 24, 2026',
    status: 'Due Soon',
    total: 49.0,
  },
];

const tabLabels: Record<FinanceTab, string> = {
  payouts: 'Payout History',
  transactions: 'Transactions',
  withdrawals: 'Withdrawal History',
  invoices: 'Invoices & Billing',
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);

const getStatusBadgeClass = (status: string) =>
  cn(
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
    status === 'Paid' || status === 'Settled' || status === 'Completed'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'In Transit' || status === 'Pending' || status === 'Processing' || status === 'Due Soon'
        ? 'bg-amber-100 text-amber-700'
        : status === 'Refunded' || status === 'Queued' || status === 'Draft'
          ? 'bg-slate-200 text-slate-700'
          : 'bg-violet-100 text-violet-700'
  );

function FinanceCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm shadow-slate-200/60 sm:p-6 lg:p-7">
      <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:mb-6 sm:pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-950">{title}</h2>
          {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function TableShell({ children }: { children: React.ReactNode }) {
  return <div className="w-full overflow-x-auto">{children}</div>;
}

function FinanceRequestWithdrawalModal({
  draft,
  maxAmount,
  onChange,
  onClose,
  onSubmit,
  submitDisabled,
}: {
  draft: WithdrawalRequestDraft;
  maxAmount: number;
  onChange: (next: WithdrawalRequestDraft) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitDisabled: boolean;
}) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
          <div className="space-y-2">
            <h2 id={titleId} className="text-2xl font-semibold tracking-[-0.03em] text-gray-950">
              Request Withdrawal
            </h2>
            <p id={descriptionId} className="text-sm leading-6 text-gray-500">
              Submit a withdrawal request for admin review and payout approval. Available balance: {formatCurrency(maxAmount)}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-500">Withdrawal Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={draft.amount}
              onChange={(event) => onChange({ ...draft, amount: event.target.value })}
              placeholder="6200.00"
              className="h-14 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 text-[1.02rem] text-gray-900 shadow-sm outline-none transition focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-500">Destination Account</span>
            <select
              value={draft.destination}
              onChange={(event) => onChange({ ...draft, destination: event.target.value })}
              className="h-14 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 text-[1.02rem] text-gray-900 shadow-sm outline-none transition focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10"
            >
              <option>Chase Checking •••• 4408</option>
              <option>Bank of America •••• 3812</option>
              <option>Stripe Treasury •••• 1149</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-500">Admin Contact Email</span>
            <input
              type="email"
              value={draft.contact}
              onChange={(event) => onChange({ ...draft, contact: event.target.value })}
              placeholder="finance@georim.com"
              className="h-14 w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 text-[1.02rem] text-gray-900 shadow-sm outline-none transition focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-500">Request Note</span>
            <textarea
              value={draft.note}
              onChange={(event) => onChange({ ...draft, note: event.target.value })}
              placeholder="Include payout timing, event context, or any admin review details."
              className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-[#fafafa] px-4 py-3 text-[1.02rem] text-gray-900 shadow-sm outline-none transition focus:border-[#7626c6] focus:ring-4 focus:ring-[#7626c6]/10"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 sm:mt-8">
          <Button type="button" variant="outline" className="rounded-xl border-gray-200 bg-white px-5" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-xl bg-[#7626c6] px-5 text-white hover:bg-[#6420a7]"
            onClick={onSubmit}
            disabled={submitDisabled}
          >
            <Save className="h-4 w-4" />
            Send to Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Finance({ onOpenPaymentSettings }: { onOpenPaymentSettings?: () => void }) {
  const availableToWithdraw = 12450.0;
  const pendingBalance = 3280.5;
  const grossVolume = 52180.4;
  const monthlyFees = 1832.9;
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = React.useState(false);
  const [withdrawalDraft, setWithdrawalDraft] = React.useState<WithdrawalRequestDraft>({
    amount: '',
    destination: 'Chase Checking •••• 4408',
    contact: 'finance@georim.com',
    note: '',
  });

  React.useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const requestedAmount = Number(withdrawalDraft.amount);
  const withdrawalFormValid =
    Number.isFinite(requestedAmount) &&
    requestedAmount > 0 &&
    requestedAmount <= availableToWithdraw &&
    withdrawalDraft.contact.trim().length > 0 &&
    withdrawalDraft.note.trim().length > 0;

  const handleExportReport = () => {
    downloadReportPdf({
      fileName: 'finance-report.pdf',
      title: 'Finance Report',
      subtitle: 'Organization finance overview, payout activity, and billing history.',
      metadata: [
        `Gross Revenue: ${formatCurrency(grossVolume)}`,
        `Available to Withdraw: ${formatCurrency(availableToWithdraw)}`,
        `Pending Balance: ${formatCurrency(pendingBalance)}`,
        `Platform Fees: ${formatCurrency(monthlyFees)}`,
      ],
      sections: [
        {
          heading: 'Payment Summary',
          lines: [
            'Total Revenue: $136,820 across recent payout cycles',
            'Available Balance: $18,420 ready to withdraw',
            'Pending Payouts: $4,860 with 2 transfers in review',
            'Processing Fee: 2.9% standard domestic rate',
          ],
        },
        {
          heading: 'Payout History',
          lines: payoutHistory.map(
            (payout) =>
              `${payout.id} · ${payout.date} · ${payout.destination} · ${payout.status} · ${formatCurrency(payout.amount)}`
          ),
        },
        {
          heading: 'Recent Transactions',
          lines: transactions.map(
            (transaction) =>
              `${transaction.id} · ${transaction.buyer} · ${transaction.date} · ${transaction.status} · Gross ${formatCurrency(transaction.gross)} · Fees ${formatCurrency(transaction.fees)} · Net ${formatCurrency(transaction.net)}`
          ),
        },
        {
          heading: 'Withdrawal Requests',
          lines: withdrawals.map(
            (withdrawal) =>
              `${withdrawal.id} · ${withdrawal.requestedAt} · ${withdrawal.destination} · ${withdrawal.status} · ${formatCurrency(withdrawal.amount)}`
          ),
        },
        {
          heading: 'Invoice History',
          lines: invoices.map(
            (invoice) =>
              `${invoice.id} · ${invoice.plan} · ${invoice.period} · ${invoice.status} · ${formatCurrency(invoice.total)}`
          ),
        },
      ],
    });
  };

  const handleSubmitWithdrawalRequest = () => {
    if (!withdrawalFormValid) return;

    setFeedback(`Withdrawal request for ${formatCurrency(requestedAmount)} sent to admin for approval.`);
    setIsWithdrawalModalOpen(false);
    setWithdrawalDraft({
      amount: '',
      destination: 'Chase Checking •••• 4408',
      contact: 'finance@georim.com',
      note: '',
    });
  };

  return (
    <div className="min-h-full bg-[#f7f5fb] p-6 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Finance</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
              Monitor organizer cash flow, reconcile ticket revenue, and manage withdrawals without
              leaving the event workspace.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl border-gray-200 bg-white px-5"
              onClick={handleExportReport}
            >
              Export Report
            </Button>
            <Button
              type="button"
              className="rounded-2xl bg-[#7626c6] px-5 text-white hover:bg-[#6420a7]"
              onClick={() => setIsWithdrawalModalOpen(true)}
            >
              Request Withdrawal
            </Button>
          </div>
        </div>

        {feedback ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-[28px] border border-[#e7d8fa] bg-[#fbf7ff] px-5 py-4 text-sm font-medium text-[#5c2a99] sm:px-6 sm:py-5"
          >
            {feedback}
          </div>
        ) : null}

        <Interactive3DAnalyticsDashboardCard
          title="Payment Summary"
          subtitle="Settlement performance across recent payout cycles"
          data={[
            { label: 'Jan', value: 12400 },
            { label: 'Feb', value: 16800 },
            { label: 'Mar', value: 15200 },
            { label: 'Apr', value: 19100 },
            { label: 'May', value: 22400 },
            { label: 'Jun', value: 23800 },
            { label: 'Jul', value: 27120 },
          ]}
          stats={[
            { label: 'Total Revenue', value: '$136,820', detail: 'Across recent payout cycles' },
            { label: 'Available Balance', value: '$18,420', detail: 'Ready to withdraw', tone: 'positive' },
            { label: 'Pending Payouts', value: '$4,860', detail: '2 transfers in review', tone: 'warning' },
            { label: 'Processing Fee', value: '2.9%', detail: 'Standard domestic rate' },
          ]}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
          <FinanceCard
            title="Finance Activity"
            description="Review the full money movement history for payouts, orders, withdrawals, and plan invoices."
            action={
              <div className="rounded-full border-0 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7626c6] no-underline shadow-none">
                Organizer Ledger
              </div>
            }
          >
            <Tabs defaultValue="payouts" className="w-full">
              <TabsList className="mb-5 grid h-auto w-full grid-cols-2 gap-2 rounded-[28px] bg-[#f4ecfb] p-1 lg:grid-cols-4">
                <TabsTrigger
                  value="payouts"
                  className="px-4 py-2.5"
                >
                  Payout History
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="px-4 py-2.5"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="withdrawals"
                  className="px-4 py-2.5"
                >
                  Withdrawal History
                </TabsTrigger>
                <TabsTrigger
                  value="invoices"
                  className="px-4 py-2.5"
                >
                  Invoices & Billing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="payouts">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      {tabLabels.payouts}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Every completed transfer to your connected accounts.
                    </p>
                  </div>
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {payoutHistory.length} payouts
                  </div>
                </div>
                <TableShell>
                  <table className="w-full min-w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-[0.16em] text-gray-500">
                        <th className="px-4 py-3 font-medium">Payout ID</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Destination</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="pl-4 pr-6 py-3 text-right font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutHistory.map((payout) => (
                        <tr key={payout.id} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-4 py-4 text-sm font-semibold text-gray-900">{payout.id}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{payout.date}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{payout.destination}</td>
                          <td className="px-4 py-4">
                            <span className={getStatusBadgeClass(payout.status)}>{payout.status}</span>
                          </td>
                          <td className="pl-4 pr-6 py-4 text-right text-sm font-semibold text-gray-900">
                            {formatCurrency(payout.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </TabsContent>

              <TabsContent value="transactions">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Recent Transactions
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Order-level revenue, fees, and net proceeds from ticket sales.
                    </p>
                  </div>
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {transactions.length} transactions
                  </div>
                </div>
                <TableShell>
                  <table className="w-full min-w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-[0.16em] text-gray-500">
                        <th className="px-4 py-3 font-medium">Order</th>
                        <th className="px-4 py-3 font-medium">Buyer</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="pl-4 pr-6 py-3 text-right font-medium">Gross</th>
                        <th className="pl-4 pr-6 py-3 text-right font-medium">Fees</th>
                        <th className="pl-4 pr-6 py-3 text-right font-medium">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 last:border-b-0">
                          <td className="px-4 py-4">
                            <div className="text-sm font-semibold text-gray-900">{transaction.id}</div>
                            <div className="mt-1 text-xs text-gray-500">{transaction.ticket}</div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{transaction.buyer}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{transaction.date}</td>
                          <td className="px-4 py-4">
                            <span className={getStatusBadgeClass(transaction.status)}>{transaction.status}</span>
                          </td>
                          <td className="pl-4 pr-6 py-4 text-right text-sm font-medium text-gray-700">
                            {formatCurrency(transaction.gross)}
                          </td>
                          <td className="pl-4 pr-6 py-4 text-right text-sm font-medium text-gray-700">
                            {formatCurrency(transaction.fees)}
                          </td>
                          <td className="pl-4 pr-6 py-4 text-right text-sm font-semibold text-gray-900">
                            {formatCurrency(transaction.net)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableShell>
              </TabsContent>

              <TabsContent value="withdrawals">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Withdrawal Requests
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Cash-out requests and their expected settlement dates.
                    </p>
                  </div>
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    3 requests
                  </div>
                </div>
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex flex-col gap-4 rounded-[28px] border border-gray-200 p-4 sm:p-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{withdrawal.id}</span>
                          <span className={getStatusBadgeClass(withdrawal.status)}>{withdrawal.status}</span>
                        </div>
                        <p className="text-sm text-gray-600">{withdrawal.destination}</p>
                        <p className="text-xs text-gray-500">
                          Requested {withdrawal.requestedAt} · {withdrawal.eta}
                        </p>
                      </div>
                      <div className="pr-1 text-left sm:pr-2 md:text-right">
                        <div className="text-lg font-semibold text-gray-950">
                          {formatCurrency(withdrawal.amount)}
                        </div>
                        <button
                          type="button"
                          className="mt-2 text-sm font-medium text-[#7626c6] transition hover:text-[#6420a7]"
                        >
                          View transfer details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="invoices">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Invoice History
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Monthly plan charges, add-ons, and billing documents for your organizer account.
                    </p>
                  </div>
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    3 invoices
                  </div>
                </div>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex flex-col gap-4 rounded-[28px] border border-gray-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{invoice.id}</span>
                          <span className={getStatusBadgeClass(invoice.status)}>{invoice.status}</span>
                        </div>
                        <p className="text-sm text-gray-700">{invoice.plan}</p>
                        <p className="text-xs text-gray-500">
                          {invoice.period} · Issued {invoice.issuedOn}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pr-1 sm:pr-2">
                        <div className="text-left lg:text-right">
                          <div className="text-lg font-semibold text-gray-950">
                            {formatCurrency(invoice.total)}
                          </div>
                          <div className="text-xs text-gray-500">Auto-billed from primary card</div>
                        </div>
                        <Button variant="outline" className="rounded-2xl border-gray-200 bg-white">
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </FinanceCard>

          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FinanceCard
                title="Payout Schedule"
                description="Your next cash-out run and reserve breakdown."
              >
                <div className="space-y-5">
                  <div className="rounded-[28px] bg-[#f4ecfb] p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7626c6]">
                          Next payout
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-gray-950">March 14, 2026</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Estimated transfer of {formatCurrency(6200)} to Chase Checking •••• 4408.
                        </p>
                      </div>
                      <div className="rounded-[24px] bg-white p-3 text-[#7626c6] shadow-sm">
                        <Landmark className="h-5 w-5" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-[28px] border border-gray-200 p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Connected payout account</div>
                          <div className="text-xs text-gray-500">Chase Checking •••• 4408</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-[28px] border border-gray-200 p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <ArrowDownLeft className="h-4 w-4 text-amber-600" />
                        <div>
                          <div className="text-sm font-semibold text-gray-900">Reserve hold</div>
                          <div className="text-xs text-gray-500">5-7 business day protection window</div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(pendingBalance)}</span>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-dashed border-violet-200 bg-violet-50/60 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <CircleAlert className="mt-0.5 h-4 w-4 text-[#7626c6]" />
                      <p className="text-sm text-gray-600">
                        Withdrawals requested before 3:00 PM CT are bundled into the next available payout run.
                      </p>
                    </div>
                  </div>
                </div>
              </FinanceCard>

              <FinanceCard
                title="Finance Controls"
                description="Key organizer settings tied to payouts and billing."
              >
                <div className="space-y-4">
                  <div className="finance-subcard rounded-[28px] border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-[24px] bg-sky-100 p-2 text-sky-700">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">Primary payout method</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Visa ending in 0912 is used for account charges and bank verification.
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 self-start rounded-[24px] border-gray-200 bg-white px-4"
                        onClick={onOpenPaymentSettings}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="finance-subcard rounded-[28px] border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-[24px] bg-emerald-100 p-2 text-emerald-700">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">Tax documents on file</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            W-9 verified. Finance contact receives payout notices and invoice reminders.
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 self-start rounded-[24px] border-gray-200 bg-white px-4"
                        onClick={onOpenPaymentSettings}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="finance-subcard rounded-[28px] border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-[24px] bg-amber-100 p-2 text-amber-700">
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">Plan renewal</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Pro Organizer renews on April 1, 2026 for {formatCurrency(149)} unless changed first.
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 self-start rounded-[24px] border-gray-200 bg-white px-4"
                        onClick={onOpenPaymentSettings}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </FinanceCard>
            </div>
          </div>
        </div>
      </div>

      {isWithdrawalModalOpen ? (
        <FinanceRequestWithdrawalModal
          draft={withdrawalDraft}
          maxAmount={availableToWithdraw}
          onChange={setWithdrawalDraft}
          onClose={() => setIsWithdrawalModalOpen(false)}
          onSubmit={handleSubmitWithdrawalRequest}
          submitDisabled={!withdrawalFormValid}
        />
      ) : null}
    </div>
  );
}

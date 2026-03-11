import type { ReactNode } from 'react';

import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CircleAlert,
  Clock3,
  CreditCard,
  DollarSign,
  Landmark,
  Receipt,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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
    plan: 'Premium Subscriptions Add-on',
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
  invoices: 'Invoices & Subscription',
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

function MetricCard({
  icon: Icon,
  tone,
  label,
  value,
  helper,
}: {
  icon: typeof DollarSign;
  tone: string;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-5 flex items-start justify-between">
        <div className={cn('rounded-2xl p-3', tone)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">{value}</div>
      <p className="mt-2 text-sm text-gray-500">{helper}</p>
    </div>
  );
}

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
    <section className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm shadow-slate-200/60">
      <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-start md:justify-between">
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
  return <div className="overflow-x-auto">{children}</div>;
}

export function Finance() {
  const availableToWithdraw = 12450.0;
  const pendingBalance = 3280.5;
  const grossVolume = 52180.4;
  const monthlyFees = 1832.9;

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
            <Button variant="outline" className="rounded-2xl border-gray-200 bg-white px-5">
              Export Report
            </Button>
            <Button className="rounded-2xl bg-[#7626c6] px-5 text-white hover:bg-[#6420a7]">
              Request Withdrawal
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={DollarSign}
            tone="bg-violet-100 text-[#7626c6]"
            label="Gross Revenue"
            value={formatCurrency(grossVolume)}
            helper="Total organizer sales across published events this month."
          />
          <MetricCard
            icon={Wallet}
            tone="bg-emerald-100 text-emerald-700"
            label="Available to Withdraw"
            value={formatCurrency(availableToWithdraw)}
            helper="Funds ready to move into your connected payout account."
          />
          <MetricCard
            icon={Clock3}
            tone="bg-amber-100 text-amber-700"
            label="Pending Balance"
            value={formatCurrency(pendingBalance)}
            helper="Recent orders still inside the reserve and chargeback window."
          />
          <MetricCard
            icon={Receipt}
            tone="bg-sky-100 text-sky-700"
            label="Platform Fees"
            value={formatCurrency(monthlyFees)}
            helper="Processing fees and subscription costs billed this cycle."
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.95fr)]">
          <FinanceCard
            title="Finance Activity"
            description="Review the full money movement history for payouts, orders, withdrawals, and plan invoices."
            action={
              <div className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7626c6]">
                Organizer Ledger
              </div>
            }
          >
            <Tabs defaultValue="payouts" className="w-full">
              <TabsList className="mb-5 grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-[#f4ecfb] p-1 lg:grid-cols-4">
                <TabsTrigger value="payouts" className="rounded-xl py-2.5">
                  Payout History
                </TabsTrigger>
                <TabsTrigger value="transactions" className="rounded-xl py-2.5">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="withdrawals" className="rounded-xl py-2.5">
                  Withdrawal History
                </TabsTrigger>
                <TabsTrigger value="invoices" className="rounded-xl py-2.5">
                  Invoices & Subscription
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
                    3 payouts
                  </div>
                </div>
                <TableShell>
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-[0.16em] text-gray-500">
                        <th className="px-4 py-3 font-medium">Payout ID</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Destination</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 text-right font-medium">Amount</th>
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
                          <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
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
                    4 transactions
                  </div>
                </div>
                <TableShell>
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-[0.16em] text-gray-500">
                        <th className="px-4 py-3 font-medium">Order</th>
                        <th className="px-4 py-3 font-medium">Buyer</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 text-right font-medium">Gross</th>
                        <th className="px-4 py-3 text-right font-medium">Fees</th>
                        <th className="px-4 py-3 text-right font-medium">Net</th>
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
                          <td className="px-4 py-4 text-right text-sm font-medium text-gray-700">
                            {formatCurrency(transaction.gross)}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-medium text-gray-700">
                            {formatCurrency(transaction.fees)}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900">
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
                      className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 md:flex-row md:items-center md:justify-between"
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
                      <div className="text-left md:text-right">
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
                      Invoice & Subscription History
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
                      className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between"
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
                      <div className="flex items-center gap-3">
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
            <FinanceCard
              title="Payout Schedule"
              description="Your next cash-out run and reserve breakdown."
            >
              <div className="space-y-5">
                <div className="rounded-2xl bg-[#f4ecfb] p-4">
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
                    <div className="rounded-2xl bg-white p-3 text-[#7626c6] shadow-sm">
                      <Landmark className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
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
                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
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

                <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-4">
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
              description="Key organizer settings tied to payouts and subscriptions."
            >
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <div className="rounded-2xl bg-sky-100 p-2 text-sky-700">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">Primary payout method</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Visa ending in 0912 is used for subscription charges and bank verification.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <div className="rounded-2xl bg-emerald-100 p-2 text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">Tax documents on file</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      W-9 verified. Finance contact receives payout notices and invoice reminders.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 p-4">
                  <div className="rounded-2xl bg-amber-100 p-2 text-amber-700">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">Subscription renewal</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Pro Organizer renews on April 1, 2026 for {formatCurrency(149)} unless upgraded first.
                    </p>
                  </div>
                </div>
              </div>
            </FinanceCard>
          </div>
        </div>
      </div>
    </div>
  );
}

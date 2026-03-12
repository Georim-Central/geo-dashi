import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowDown, ArrowUp } from 'lucide-react';

type AnalyticsPoint = {
  label: string;
  value: number;
};

type AnalyticsStatCard = {
  label: string;
  value: string;
  detail: string;
  tone?: 'default' | 'positive' | 'warning';
  trendDirection?: 'up' | 'down';
};

interface Interactive3DAnalyticsDashboardCardProps {
  title?: string;
  subtitle?: string;
  data?: AnalyticsPoint[];
  stats?: AnalyticsStatCard[];
  isLoading?: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-24 w-24">
        <div className="absolute left-0 top-0 h-full w-full animate-spin rounded-full border-4 border-[#cfd7ff] border-t-transparent dark:border-[#3a4d88]" />
        <div className="absolute left-2 top-2 h-[calc(100%-16px)] w-[calc(100%-16px)] animate-[spin_1.8s_linear_infinite] rounded-full border-4 border-[#8ca4ff] border-t-transparent dark:border-[#5e78d7]" />
        <div className="absolute left-4 top-4 h-[calc(100%-32px)] w-[calc(100%-32px)] animate-[spin_2.4s_linear_infinite] rounded-full border-4 border-[#5b7cff] border-t-transparent dark:border-[#8a9cff]" />
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-red-600 dark:text-red-400">
      <AlertCircle className="h-16 w-16" />
      <p className="font-medium">Failed to load data</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:ring-offset-gray-900"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}

function AnimatedBar({
  value,
  index,
  maxValue,
  isDarkMode,
  valueFormatter,
}: {
  value: number;
  index: number;
  maxValue: number;
  isDarkMode: boolean;
  valueFormatter: (value: number) => string;
}) {
  const barHeight = `${(value / maxValue) * 100}%`;

  return (
    <motion.div
      className="group relative flex h-full w-full items-end"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <motion.div
        className={`relative w-full rounded-t-md ${
          isDarkMode
            ? 'bg-gradient-to-t from-indigo-600 to-violet-400'
            : 'bg-gradient-to-t from-blue-500 to-cyan-300'
        }`}
        initial={{ height: 0 }}
        animate={{ height: barHeight }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          delay: index * 0.08,
        }}
      >
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-transparent px-2.5 py-1 text-[11px] font-medium text-black transition-all duration-200 group-hover:bg-[#1f1f29] group-hover:text-white group-hover:shadow-sm dark:text-white dark:group-hover:bg-[#f3f4f6] dark:group-hover:text-gray-900">
          {valueFormatter(value)}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Interactive3DAnalyticsDashboardCard({
  title = 'Payment Summary',
  subtitle = 'Settlement performance',
  data = [
    { label: 'Jan', value: 12400 },
    { label: 'Feb', value: 16800 },
    { label: 'Mar', value: 15200 },
    { label: 'Apr', value: 19100 },
    { label: 'May', value: 22400 },
    { label: 'Jun', value: 23800 },
    { label: 'Jul', value: 27120 },
  ],
  stats = [
    { label: 'Available Balance', value: '$18,420', detail: 'Ready to withdraw', tone: 'positive' },
    { label: 'Pending Payouts', value: '$4,860', detail: '2 transfers in review', tone: 'warning' },
    { label: 'Processing Fee', value: '2.9%', detail: 'Standard domestic rate' },
  ],
  isLoading = false,
  hasError = false,
  onRetry,
}: Interactive3DAnalyticsDashboardCardProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const maxValue = React.useMemo(() => Math.max(...data.map((item) => item.value)), [data]);
  const totalValue = React.useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);
  const averageValue = React.useMemo(() => Math.round(totalValue / data.length), [data, totalValue]);
  const trend = React.useMemo(() => {
    if (data.length < 2 || data[0].value === 0) {
      return 0;
    }

    return ((data[data.length - 1].value - data[0].value) / data[0].value) * 100;
  }, [data]);

  const valueFormatter = (value: number) => `$${value.toLocaleString()}`;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) {
      return;
    }

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const cardCenterX = rect.left + rect.width / 2;
    const cardCenterY = rect.top + rect.height / 2;
    const mouseX = event.clientX - cardCenterX;
    const mouseY = event.clientY - cardCenterY;
    const rotationY = (mouseX / (rect.width / 2)) * 5;
    const rotationX = -(mouseY / (rect.height / 2)) * 5;

    setRotation({ x: rotationX, y: rotationY });
  };

  const resetRotation = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className={`font-sans ${isDarkMode ? 'dark' : ''}`}>
      <div
        className="
          group relative h-[28rem] w-full cursor-default overflow-hidden rounded-[28px]
          border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-[#d9c1f5] hover:shadow-[0_18px_42px_rgba(118,38,198,0.12)]
          dark:border-gray-700 dark:bg-gray-900 dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
          sm:p-6
        "
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.01 : 1})`,
          transition: isHovered ? 'none' : 'transform 0.5s ease-out',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={resetRotation}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[28px] opacity-20 dark:opacity-15">
          <div className="absolute -right-24 top-0 h-48 w-48 rounded-full bg-[#eef2ff] blur-3xl dark:bg-[#1f2b52]" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[#f5f3ff] blur-3xl dark:bg-[#25183f]" />
        </div>

        <div className="absolute inset-0 rounded-[28px] bg-white/92 backdrop-blur-sm dark:bg-gray-900/84" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            </div>
          </div>

          <div className="flex-1 overflow-hidden rounded-[28px] bg-[#fafafa] p-4 backdrop-blur-sm dark:bg-gray-800/50 sm:p-5">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <LoadingSpinner />
                </motion.div>
              ) : hasError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ErrorState onRetry={onRetry} />
                </motion.div>
              ) : (
                <motion.div
                  key="data"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full flex-col"
                >
                  <div className="group flex flex-1 items-end gap-3">
                    {data.map((item, index) => (
                      <div key={item.label} className="flex h-full flex-1 flex-col justify-end">
                        <AnimatedBar
                          value={item.value}
                          index={index}
                          maxValue={maxValue}
                          isDarkMode={isDarkMode}
                          valueFormatter={valueFormatter}
                        />
                        <div className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!isLoading && !hasError ? (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {stats.map((stat) => {
                const isPositive = stat.tone === 'positive';
                const isWarning = stat.tone === 'warning';
                const showTrend = stat.trendDirection === 'up' || stat.trendDirection === 'down';

                return (
                  <motion.div
                    key={stat.label}
                    className={`rounded-[28px] border border-gray-200 px-4 py-3 backdrop-blur-sm sm:px-5 ${
                      isPositive
                        ? 'bg-white dark:bg-green-900/20'
                        : isWarning
                          ? 'bg-white dark:bg-amber-900/20'
                          : 'bg-white dark:bg-gray-800/70'
                    }`}
                    whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  >
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <div
                      className={`mt-1 flex items-center gap-1 text-base font-bold ${
                        isPositive
                          ? 'text-green-600 dark:text-green-400'
                          : isWarning
                            ? 'text-amber-600 dark:text-amber-300'
                            : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {showTrend ? stat.trendDirection === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" /> : null}
                      <span>{stat.value}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-4 text-gray-500 dark:text-gray-400">{stat.detail}</p>
                  </motion.div>
                );
              })}
            </div>
          ) : null}

          {!isLoading && !hasError ? (
            <div className="mt-3 flex items-center justify-between rounded-[28px] bg-[#fafafa] px-4 py-3 text-xs text-gray-600 backdrop-blur-sm dark:bg-gray-800/60 dark:text-gray-300 sm:px-5">
              <span>Total settled: {valueFormatter(totalValue)}</span>
              <span>Average month: {valueFormatter(averageValue)}</span>
              <span className={trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {trend >= 0 ? '+' : '-'}
                {Math.abs(trend).toFixed(1)}% trend
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

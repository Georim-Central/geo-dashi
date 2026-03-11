"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MinimalToggle } from "@/components/ui/toggle";

export interface Plan {
  title: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  isFeatured?: boolean;
}

interface PricingTableProps {
  plans: Plan[];
}

const CONFETTI_PARTICLES = [
  { id: 1, x: -78, rotate: -18, color: "#7626c6", delay: 0 },
  { id: 2, x: -54, rotate: 8, color: "#38bdf8", delay: 0.04 },
  { id: 3, x: -28, rotate: 24, color: "#f97316", delay: 0.08 },
  { id: 4, x: 0, rotate: -10, color: "#22c55e", delay: 0.12 },
  { id: 5, x: 28, rotate: 18, color: "#facc15", delay: 0.16 },
  { id: 6, x: 54, rotate: -22, color: "#ec4899", delay: 0.2 },
  { id: 7, x: 80, rotate: 12, color: "#8b5cf6", delay: 0.24 },
];

const AnimatedDigit: React.FC<{ digit: string; index: number }> = ({ digit, index }) => {
  return (
    <div className="relative inline-block min-w-[1ch] overflow-hidden text-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={digit}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="block"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const ScrollingNumber: React.FC<{ value: number }> = ({ value }) => {
  const numberString = value.toString();

  return (
    <div className="flex items-center">
      {numberString.split("").map((digit, index) => (
        <AnimatedDigit key={`${value}-${index}`} digit={digit} index={index} />
      ))}
    </div>
  );
};

const PricingTable: React.FC<PricingTableProps> = ({ plans }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const getFeatureIcon = () => {
    return <Check className="size-3 text-gray-900" />;
  };

  useEffect(() => {
    if (!showConfetti) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowConfetti(false);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [showConfetti]);

  const updateBillingCycle = (nextIsYearly: boolean) => {
    if (nextIsYearly === isYearly) {
      return;
    }

    setIsYearly(nextIsYearly);
    setShowConfetti(false);
    window.setTimeout(() => {
      setShowConfetti(true);
    }, 20);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 p-6">
      <motion.div
        className="space-y-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="space-y-4">
          <motion.h1
            className="text-4xl font-bold text-gray-950 md:text-5xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            className="mx-auto max-w-2xl text-lg text-gray-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Select the perfect plan for your needs. All plans include our core features with different limits and capabilities.
          </motion.p>
        </div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="relative flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-4 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <button
                type="button"
                onClick={() => updateBillingCycle(false)}
                className={`text-base font-semibold transition ${
                  isYearly ? "text-gray-400" : "text-gray-950"
                }`}
                aria-pressed={!isYearly}
              >
                Monthly
              </button>

              <MinimalToggle
                role="switch"
                aria-label="Billing cycle"
                aria-checked={isYearly}
                checked={isYearly}
                onChange={(event) => updateBillingCycle(event.target.checked)}
              />

              <button
                type="button"
                onClick={() => updateBillingCycle(true)}
                className={`inline-flex items-center gap-2 text-base font-semibold transition ${
                  isYearly ? "text-gray-950" : "text-gray-400"
                }`}
                aria-pressed={isYearly}
              >
                <span>Yearly</span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Save 20%
                </span>
              </button>
            </div>

            <AnimatePresence>
              {showConfetti ? (
                <div className="pointer-events-none absolute left-1/2 top-2 h-20 w-48 -translate-x-1/2">
                  {CONFETTI_PARTICLES.map((particle) => (
                    <motion.span
                      key={`${particle.id}-${isYearly ? "yearly" : "monthly"}`}
                      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        x: [0, particle.x],
                        y: [0, -44, 24],
                        rotate: [0, particle.rotate, particle.rotate * 2],
                        scale: [0.6, 1, 0.9],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.9,
                        delay: particle.delay,
                        ease: "easeOut",
                      }}
                      className="absolute left-1/2 top-8 h-3 w-2 rounded-full"
                      style={{ backgroundColor: particle.color }}
                    />
                  ))}
                </div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan, index) => (
          <motion.div key={plan.title} variants={cardVariants} className="relative">
            {plan.isFeatured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform"
              >
                <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
                  <Star className="size-3 fill-current" />
                  Most Popular
                </div>
              </motion.div>
            )}

            <div
              className={`relative h-full rounded-xl border-2 p-8 transition-all duration-300 ${
                plan.isFeatured
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="mb-8 space-y-4 text-center">
                <h3 className="text-2xl font-bold text-gray-950">{plan.title}</h3>
                <p className="text-gray-500">{plan.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-center text-4xl font-bold text-gray-950">
                    $<ScrollingNumber value={isYearly ? Math.round(plan.price.yearly / 12) : plan.price.monthly} />
                    <span className="ml-1 text-lg font-normal text-gray-500">/month</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-sm text-gray-500"
                  >
                    <span>{isYearly ? "billed yearly" : "billed monthly"}</span>
                    {isYearly && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                      >
                        Save ${(plan.price.monthly * 12) - plan.price.yearly}
                      </motion.span>
                    )}
                  </motion.div>
                </div>
              </div>

              <div className="mb-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 + featureIndex * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      {getFeatureIcon()}
                    </div>
                    <span className="text-sm text-gray-900">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Button
                  asChild
                  variant={plan.isFeatured ? "default" : "outline"}
                  size="lg"
                  className="w-full"
                >
                  <a href={plan.ctaHref}>{plan.ctaText}</a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default PricingTable;

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { env } from "@movie-ticket-booking/env/web";
import { ShieldCheck, Ticket, ArrowLeft, Loader2 } from "lucide-react";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "Payment failed. Please try again.");
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Element */}
      <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-5 shadow-inner">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        id="checkout-pay-btn"
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <ShieldCheck className="h-4 w-4" />
            Confirm &amp; Pay
          </>
        )}
      </button>
    </form>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientSecret = searchParams.get("clientSecret");
  const orderId = searchParams.get("orderId");

  if (!clientSecret) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm font-semibold text-zinc-300">No payment session found.</p>
        <p className="text-xs text-zinc-500">Please go back and try again.</p>
        <button onClick={() => router.back()} className="mt-2 text-sm text-red-400 hover:underline">
          ← Go back
        </button>
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary: "#dc2626",
        colorBackground: "#18181b",
        colorText: "#f4f4f5",
        colorDanger: "#ef4444",
        fontFamily: "Archivo, system-ui, sans-serif",
        borderRadius: "10px",
        spacingUnit: "4px",
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-4 py-12">
      {/* Back button */}
      <div className="w-full max-w-md mb-6">
        <button
          id="checkout-back-btn"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-7 pb-5 border-b border-zinc-800">
          {/* Top gradient line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-orange-400" />
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/15 text-red-400">
              <Ticket className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                Secure Checkout
              </p>
              <h1 className="text-lg font-bold text-zinc-100 leading-tight">
                Complete your booking
              </h1>
              {orderId && (
                <p className="text-xs text-zinc-600 mt-0.5 font-mono">Order #{orderId.slice(-8)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stripe Payment Element */}
        <div className="px-6 py-6">
          <Elements stripe={stripePromise} options={stripeOptions}>
            <CheckoutForm />
          </Elements>
        </div>

        {/* Security footer */}
        <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-zinc-800 bg-zinc-900/50">
          <ShieldCheck className="h-3.5 w-3.5 text-zinc-600" />
          <p className="text-xs text-zinc-600">256-bit SSL encryption · Powered by Stripe</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

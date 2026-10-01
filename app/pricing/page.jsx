"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { useAuth } from "@/components/AuthProvider";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Create order
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      
      if (!data.success) {
        if (data.error === "Unauthorized") {
          router.push("/login");
        } else {
          alert(data.error || "Something went wrong");
        }
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "QR Code SaaS",
        description: "Premium Subscription",
        order_id: data.order.id,
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Subscription successful!");
            window.location.href = "/dashboard";
          } else {
            alert("Payment verification failed");
          }
        },
        theme: {
          color: "#0f172a",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Error initiating checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-muted-foreground">
          Choose the plan that fits your needs. Upgrade anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4 text-4xl font-bold">₹0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Static QR Codes</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Up to 2 Dynamic QR Codes</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 2-Month valid limit for Dynamic QRs</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Basic Analytics</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" onClick={() => router.push("/dashboard")}>
              Current Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="flex flex-col border-primary relative shadow-lg">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            RECOMMENDED
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">Premium</CardTitle>
            <CardDescription>For professionals and businesses</CardDescription>
            <div className="mt-4 text-4xl font-bold">₹499<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Static QR Codes</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Unlimited Dynamic QR Codes</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> No Expiration (while active)</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Advanced Analytics</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 2-Month Grace Period upon Cancellation</li>
            </ul>
          </CardContent>
          <CardFooter>
            {user?.role === "admin" ? (
              <Button className="w-full" variant="secondary" onClick={() => router.push("/dashboard")}>
                Admin Access (All Features Unlocked)
              </Button>
            ) : (
              <Button className="w-full" onClick={handleSubscribe} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Subscribe Now
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

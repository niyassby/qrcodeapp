"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  QrCode,
  Zap,
  RefreshCw,
  Download,
  BarChart3,
  Shield,
  Palette,
  Check,
  Sparkles,
  Clock,
  Layers,
  Globe,
  Sliders,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Interactive Live Demo in Hero
  const [demoUrl, setDemoUrl] = useState("https://mybrand.com/special-menu");
  const [demoQrSvg, setDemoQrSvg] = useState("");
  const [activeTab, setActiveTab] = useState("destination");
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function gen() {
      try {
        const svg = await QRCode.toString(demoUrl || "https://qrforge.io", {
          type: "svg",
          errorCorrectionLevel: "M",
          margin: 1,
          width: 220,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });
        setDemoQrSvg(svg);
      } catch (err) {
        console.error(err);
      }
    }
    gen();
  }, [demoUrl]);

  const faqs = [
    {
      q: "What is a Dynamic QR code?",
      a: "A dynamic QR code contains a short redirect URL. This means you can update the final destination website anytime from your dashboard without ever having to reprint the physical QR code.",
    },
    {
      q: "Will my already printed QR codes stop working?",
      a: "Never! All existing printed QR codes continue to redirect accurately. You can change where they redirect anytime from your dashboard.",
    },
    {
      q: "How does the 2-Month Grace Period work?",
      a: "On the Free plan, dynamic QR codes include a 2-month active period. For Premium subscribers, your dynamic QR codes never expire while active. If you pause or end your subscription, you receive a full 2-month grace period before any expiration.",
    },
    {
      q: "Can I generate static QR codes for free without limits?",
      a: "Yes! Static QR codes are 100% free and unlimited forever. You can style and download them in high-resolution SVG or PNG format.",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* 🌟 HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 border-b overflow-hidden min-h-screen">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="base grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs md:text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Dynamic QR Platform for Businesses</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
              Change Destinations in Seconds.{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Never Reprint
              </span>{" "}
              a QR Code Again.
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Launch smart dynamic QR codes for product packaging, menus, brochures, and billboard ads. Update where scans go on the fly without wasting thousands on reprints.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Button
                size="lg"
                onClick={() => router.push("/signup")}
                className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/20"
              >
                Create Dynamic QR Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/qr-builder")}
                className="gap-2 text-base px-8 h-12"
              >
                <Sliders className="h-4 w-4" />
                Live QR Styler
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Instant Activation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Unlimited Static Codes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Razorpay Secured
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Live Sandbox Simulator */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-2xl border bg-card/80 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono font-medium text-muted-foreground ml-2">
                    Dynamic QR Simulator
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Live Preview
                </span>
              </div>

              {/* URL Input Box */}
              <div className="space-y-2 mb-4">
                <label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                  <span>Current Target URL</span>
                  <span className="text-emerald-500 font-mono text-[11px] flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active Redirect
                  </span>
                </label>
                <div className="flex gap-2">
                  <Input
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>

              {/* Simulated QR Code Output */}
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border shadow-inner mb-4">
                {demoQrSvg ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: demoQrSvg }}
                    className="w-48 h-48 flex items-center justify-center transition-all duration-300"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                <span className="text-[11px] text-slate-500 font-mono mt-3">
                  Scan with your phone to test
                </span>
              </div>

              {/* Simulation Action Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDemoUrl("https://mybrand.com/new-promo-offer")}
                  className="text-xs h-8"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Change to Promo
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push("/dynamic-qr")}
                  className="text-xs h-8"
                >
                  Create for Real
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📊 STATS / PROOF BAR */}
      <section className="border-b bg-muted/20 py-8">
        <div className="base grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              &lt; 50ms
            </div>
            <p className="text-xs text-muted-foreground mt-1">Instant Scan Redirection</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              100%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Unlimited Static Codes</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              2-Month
            </div>
            <p className="text-xs text-muted-foreground mt-1">Grace Period Safeguard</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Razorpay
            </div>
            <p className="text-xs text-muted-foreground mt-1">Trusted Safe Payments</p>
          </div>
        </div>
      </section>

      {/* ⚖️ WHY DYNAMIC VS STATIC (Comparison Section) */}
      <section className="py-20 md:py-28 border-b">
        <div className="base">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Smart Advantage
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Why High-Performing Teams Choose Dynamic QR Codes
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Static QR codes are permanently locked once printed. Dynamic QR codes give you infinite adaptability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Static QR */}
            <div className="rounded-2xl border bg-muted/20 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                    <XCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Standard Static QR</h3>
                    <p className="text-xs text-muted-foreground">Traditional & rigid</p>
                  </div>
                </div>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Permanent URL hardcoded inside the pixels</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Any typo or expired link means reprinting everything</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Zero scan statistics or redirection flexibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Wastes printing budget and materials</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Dynamic QR */}
            <div className="rounded-2xl border-2 border-primary bg-primary/5 p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                SUPERIOR CHOICE
              </div>
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">QRForge Dynamic QR</h3>
                    <p className="text-xs text-primary font-medium">Smart & cloud-powered</p>
                  </div>
                </div>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Update destination URL at any time with 1 click</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Already printed flyers, menus, and stickers keep working</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Scoped 6-digit user IDs for clean, fast routing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Toggle redirect on/off anytime from dashboard</span>
                  </li>
                </ul>
              </div>
              <Button onClick={() => router.push("/dynamic-qr")} className="mt-8 gap-2">
                Generate Dynamic QR Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 CORE FEATURES GRID */}
      <section id="features" className="py-20 md:py-28 border-b">
        <div className="base">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              Full Suite
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Built for Speed, Reliability, and Scalability
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Everything your business requires to create, brand, manage, and monitor QR campaigns.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Live Destination Editing</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Change your landing page or promotional link in seconds without reprinting marketing collaterals.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Advanced Visual Styler</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Customize dot shapes, eye patterns, foreground/background color gradients, and embed brand logos.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-5">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Print-Ready Formats</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Export vector SVG for massive billboard prints, alongside PNG, JPEG, and WebP for websites and social media.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-5">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">2-Month Grace Protection</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Never fear sudden link breakage. Expiring links enter a safe 2-month grace window so your customers never hit dead ends.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-5">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Centralized Dashboard</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Track and organize your links with server-side pagination, real-time search, and bulk ZIP download.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-all">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-5">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Enterprise Security & Auth</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Protected by hashed credentials, JWT cookies, role-based controls, and seamless admin user administration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 💳 TRANSPARENT PRICING SECTION (Matches App Plans) */}
      <section id="pricing" className="py-20 md:py-28 border-b bg-muted/20">
        <div className="base">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
              SaaS Plans
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
              Simple, Predictable Pricing
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Start completely free, or unlock unlimited dynamic generation with monthly subscription.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl border bg-card p-8 flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">Free Starter</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Perfect for personal use and small projects
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">₹0</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Unlimited Static QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Up to 2 Dynamic QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>2-Month Grace Period for Dynamic QRs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>SVG & PNG Download Formats</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Live Destination Redirect Toggle</span>
                  </li>
                </ul>
              </div>

              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => router.push("/signup")}
              >
                Get Started Free
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="rounded-2xl border-2 border-primary bg-card p-8 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMMENDED
              </div>

              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">Premium Unlimited</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    For businesses, restaurants, agencies & brands
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">₹499</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 text-sm mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-semibold text-foreground">Unlimited Dynamic QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Unlimited Static QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>No Expiration (active while subscribed)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>2-Month Grace Period upon Cancellation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Bulk ZIP Batch Download</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Custom Color Gradients & Logo Upload</span>
                  </li>
                </ul>
              </div>

              <Button
                className="w-full h-11 shadow-lg shadow-primary/20 gap-2"
                onClick={() => router.push("/pricing")}
              >
                Upgrade to Premium
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <section className="py-20 md:py-28 border-b">
        <div className="base max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-base">
              Everything you need to know about dynamic QR codes and subscriptions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border bg-card p-5 cursor-pointer transition-colors"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between font-semibold text-base">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <p className="text-muted-foreground text-sm mt-3 pt-3 border-t leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📣 FINAL BOTTOM CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background text-center">
        <div className="base max-w-3xl mx-auto">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 shadow-inner">
            <QrCode className="h-8 w-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Ready to upgrade your QR codes?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Join thousands creating dynamic, flexible, and printable QR codes with zero maintenance headaches.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="gap-2 text-base px-8 h-12 shadow-xl shadow-primary/20"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/pricing")}
              className="gap-2 text-base px-8 h-12"
            >
              View SaaS Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* 🧭 FOOTER */}
      <footer className="border-t py-10 bg-card/50">
        <div className="base flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center">
              <QrCode className="h-3.5 w-3.5" />
            </div>
            <span>QRForge</span>
          </div>
          <p className="text-xs">
            © {new Date().getFullYear()} QRForge SaaS. Built with Next.js & Razorpay.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="/#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, Download, ArrowRight, Loader2, AlertCircle } from "lucide-react";

const DOWNLOAD_FORMATS = ["svg", "png", "jpeg", "webp"];

export default function DynamicQRPage() {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  const [qrId, setQrId] = useState("");
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("svg");

  async function generateQR() {
    if (!url) return setError("Please enter a valid URL");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: url }),
      });
      const data = await res.json();
      if (data.success) {
        const qrImage = await QRCode.toString(data.shortUrl, {
          type: "svg",
          errorCorrectionLevel: "M",
          margin: 1,
          width: 300,
        });
        setQr(qrImage);
        setQrId(data.id);
      } else {
        setError(data.error || "Failed to generate QR code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function svgToCanvas(svgString, size, callback) {
    const svg = new Blob([svgString], { type: "image/svg+xml" });
    const blobUrl = URL.createObjectURL(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(blobUrl);
      callback(canvas);
    };
    img.src = blobUrl;
  }

  function downloadQR() {
    if (!qr) return;
    if (downloadFormat === "svg") {
      const blob = new Blob([qr], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `Qrcode-${qrId}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } else {
      svgToCanvas(qr, 600, (canvas) => {
        canvas.toBlob(
          (blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `Qrcode-${qrId}.${downloadFormat}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
          },
          `image/${downloadFormat}`,
          0.92
        );
      });
    }
  }

  return (
    <div className="base py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        <span>/</span>
        <span>Create Dynamic QR</span>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
            <QrCode className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Dynamic QR Code</h1>
          <p className="text-muted-foreground">
            Enter a destination URL. You can change it anytime from your dashboard
            without reprinting the QR code.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Destination URL</CardTitle>
            <CardDescription>
              The URL your QR code will redirect to when scanned
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url-input">URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateQR()}
                  className="flex-1"
                />
                <Button onClick={generateQR} disabled={isLoading} className="gap-2 shrink-0">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Result */}
        {qr && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                QR Code Generated!
              </CardTitle>
              <CardDescription>
                ID: <span className="font-mono font-medium text-foreground">{qrId}</span>{" "}
                — your QR code is ready to use
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div
                className="border rounded-xl p-6 bg-white"
                dangerouslySetInnerHTML={{ __html: qr }}
                aria-label="Generated QR Code"
              />

              <p className="text-sm text-muted-foreground text-center">
                Scan or share this QR code. Update its destination anytime from your{" "}
                <Link href="/dashboard" className="text-primary hover:underline">
                  dashboard
                </Link>
                .
              </p>

              {/* Download with format selector */}
              <div className="flex gap-2 w-full max-w-xs">
                <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                  <SelectTrigger className="w-28 uppercase text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Format</SelectLabel>
                      {DOWNLOAD_FORMATS.map((f) => (
                        <SelectItem key={f} value={f} className="uppercase text-xs">
                          {f}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Button onClick={downloadQR} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Download QR
                </Button>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setQr("");
                    setUrl("");
                    setQrId("");
                  }}
                >
                  Create Another
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

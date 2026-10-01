"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QrCode, X, Download } from "lucide-react";

const DOWNLOAD_FORMATS = ["svg", "png", "jpeg", "webp"];

function QRImg({ qrImage, id = "" }) {
  const [isOpen, setOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("svg");

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
    if (!qrImage) return;
    if (downloadFormat === "svg") {
      const blob = new Blob([qrImage], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Qrcode-${id}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      svgToCanvas(qrImage, 600, (canvas) => {
        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Qrcode-${id}.${downloadFormat}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          },
          `image/${downloadFormat}`,
          0.92
        );
      });
    }
  }

  return (
    <div className="inline-flex">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-7 text-xs gap-1"
      >
        <QrCode className="h-3 w-3" />
        <span className="hidden sm:inline">View</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 w-full flex items-center justify-center h-screen bg-black/70 backdrop-blur-sm z-50">
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="absolute w-full h-full inset-0 z-0"
          />
          {/* Modal */}
          <div className="relative z-10 flex flex-col items-center rounded-2xl bg-card border shadow-2xl p-8 w-full max-w-xs mx-4">
            <button
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-sm font-medium text-muted-foreground mb-1">QR Code</h2>
            <p className="text-lg font-bold mb-4 font-mono">ID: {id}</p>

            <div
              className="border rounded-lg p-3 bg-white"
              dangerouslySetInnerHTML={{ __html: qrImage }}
              aria-label={`QR Code for ${id}`}
            />

            {/* Download with format */}
            <div className="flex gap-2 w-full mt-5">
              <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                <SelectTrigger className="w-24 text-xs uppercase">
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
              <Button onClick={downloadQR} className="flex-1 gap-2 text-xs" size="sm">
                <Download className="h-3 w-3" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRImg;

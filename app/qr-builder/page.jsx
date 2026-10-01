"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import ClientQR from "@/components/qrcode/ClientQR";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ColorNSelect from "@/components/qrcode/ColorNSelect";
import ModeQr from "@/components/qrcode/ModeQr";
import { QRmodels } from "@/components/qrcode/options";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function QRBuilderPage() {
  const [dataURL, setDataUrl] = useState("https://qrcodeapp-seven.vercel.app/");
  const [logo, setLogo] = useState(null);
  const [options, setOptions] = useState({
    width: 200,
    height: 200,
    type: "svg",
    data: "https://qrcodeapp-seven.vercel.app/",
    image:
      "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 5,
      crossOrigin: "anonymous",
      saveAsBlob: true,
    },
    dotsOptions: {
      color: "#212121",
      type: "square",
    },
    cornersSquareOptions: {
      color: "#212121",
      type: "extra-rounded",
    },
    cornersDotOptions: {
      color: "#212121",
      type: "dot",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  });

  const onDataChange = (event) => {
    setDataUrl(event.target.value);
  };

  useEffect(() => {
    const timr = setTimeout(() => {
      setOptions((options) => ({
        ...options,
        data: dataURL,
      }));
    }, 1000);
    return () => clearTimeout(timr);
  }, [dataURL]);

  useEffect(() => {
    setOptions((options) => ({
      ...options,
      image: logo ? URL.createObjectURL(logo) : "",
    }));
  }, [logo]);

  const handleChange = (number, min, max, setValue) => {
    const newValue = parseFloat(number) || 0;
    const clampedValue = Math.min(max, Math.max(min, newValue));
    setValue(clampedValue);
  };

  return (
    <div className="base py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span>QR Builder</span>
        </div>
        <h1 className="text-3xl font-bold">QR Code Builder</h1>
        <p className="text-muted-foreground mt-1">
          Design a fully custom QR code with colors, gradients, and logo embedding.
        </p>
      </div>

      <div className="grid md:grid-cols-6 gap-6">
        {/* Left Panel - Options */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Customize QR Code</CardTitle>
            <CardDescription>
              Enter your text or URL and customize the appearance below
            </CardDescription>
            <CardAction>
              <QrCode className="h-5 w-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 w-full">
              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url-input">URL or Text</Label>
                <Textarea
                  id="url-input"
                  onChange={onDataChange}
                  value={dataURL}
                  className="h-28 resize-none"
                  placeholder="Enter your URL or text here..."
                />
              </div>

              {/* QR Options */}
              <div className="space-y-3">
                <Label>QR Code Options</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Shape</Label>
                    <Select
                      onValueChange={(value) =>
                        setOptions((options) => ({
                          ...options,
                          shape: value,
                        }))
                      }
                      defaultValue={options.shape || "square"}
                    >
                      <SelectTrigger className="capitalize text-xs">
                        <SelectValue placeholder="Shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Shape</SelectLabel>
                          {["square", "circle"].map((item) => (
                            <SelectItem
                              className="capitalize"
                              value={item}
                              key={item}
                            >
                              {item}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Size (px)</Label>
                    <Input
                      max={10000}
                      type="number"
                      value={options.width}
                      placeholder="Size"
                      onChange={(e) =>
                        handleChange(e.target.value, 0, 10000, (value) =>
                          setOptions((options) => ({
                            ...options,
                            width: value,
                            height: value,
                          }))
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Margin</Label>
                    <Input
                      max={40}
                      min={0}
                      type="number"
                      value={options.margin}
                      placeholder="Margin"
                      onChange={(e) =>
                        handleChange(e.target.value, 0, 40, (value) =>
                          setOptions((options) => ({ ...options, margin: value }))
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Background</Label>
                    <label
                      className="w-full h-9 rounded-md border flex items-center justify-center text-xs text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors"
                      htmlFor="backgroundOptions"
                      style={{ backgroundColor: options.backgroundOptions.color }}
                    >
                      {options.backgroundOptions.color}
                    </label>
                    <input
                      className="sr-only"
                      onChange={(e) =>
                        setOptions((options) => ({
                          ...options,
                          backgroundOptions: {
                            ...options.backgroundOptions,
                            color: e.target.value,
                          },
                        }))
                      }
                      id="backgroundOptions"
                      type="color"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Options */}
              <div className="space-y-3">
                <Label>Logo / Image</Label>
                <div className="flex gap-3 items-center">
                  <Input
                    onChange={(e) => setLogo(e.target.files[0])}
                    id="picture"
                    type="file"
                    accept="image/*"
                    className="flex-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">Logo Margin</Label>
                    <Slider
                      defaultValue={[5]}
                      onValueChange={(value) => {
                        setOptions((options) => ({
                          ...options,
                          imageOptions: {
                            ...options.imageOptions,
                            margin: value,
                          },
                        }));
                      }}
                      min={0}
                      max={20}
                      step={2}
                    />
                  </div>
                </div>
              </div>

              {/* Color & Style Options */}
              <div className="space-y-2">
                <Label>Style Options</Label>
                <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
                  <ColorNSelect
                    options={options}
                    setOptions={setOptions}
                    changeItems="dotsOptions"
                    id="Dots Options"
                  />
                  <ColorNSelect
                    options={options}
                    setOptions={setOptions}
                    changeItems="cornersSquareOptions"
                    id="Corners Square Options"
                  />
                  <ColorNSelect
                    options={options}
                    setOptions={setOptions}
                    changeItems="cornersDotOptions"
                    id="Corners Dot Options"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Preview & Download */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Your QR code live preview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <ClientQR options={options} setOptions={setOptions} />
            </div>

            {/* Style Presets */}
            <div className="mt-6 space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Style Presets</Label>
              <div className="grid grid-cols-2 gap-3">
                {QRmodels.map((item, i) => (
                  <ModeQr key={i} options={item} setOptions={setOptions} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default QRBuilderPage;

"use client";
import { useEffect, useState, useCallback } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRImg from "@/components/QRImg";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Download,
  Search,
  QrCode,
  PencilLine,
  Check,
  X,
  Archive,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Shield,
} from "lucide-react";

const DOWNLOAD_FORMATS = ["svg", "png", "jpeg", "webp"];
const PAGE_SIZE = 20;

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newDestination, setNewDestination] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [downloadFormat, setDownloadFormat] = useState("svg");
  const [zipFormat, setZipFormat] = useState("svg");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [stats, setStats] = useState({ totalAll: 0, totalRedirects: 0, totalStatic: 0 });
  const [fetching, setFetching] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Fetch links with server-side pagination
  const fetchLinks = useCallback(async (p = page, s = searchTerm) => {
    setFetching(true);
    try {
      const params = new URLSearchParams({
        page: p.toString(),
        limit: PAGE_SIZE.toString(),
      });
      if (s.trim()) params.set("search", s);

      const res = await fetch(`/api/links?${params}`);
      const data = await res.json();
      if (data.success) {
        const withQR = await Promise.all(
          data.links.map(async (link) => {
            const shortUrl = user?.shortUserId
              ? `${process.env.NEXT_PUBLIC_BASE_URL}/${user.shortUserId}/${link.shortId}`
              : `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortId}`;
            const qrImage = await QRCode.toString(
              shortUrl,
              { type: "svg", errorCorrectionLevel: "M", margin: 1, width: 200 }
            );
            return { ...link, qrImage };
          })
        );
        setLinks(withQR);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch links:", err);
    } finally {
      setFetching(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    if (user) fetchLinks(page, searchTerm);
  }, [user, page, searchTerm]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchTerm(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  async function handleUpdate(id) {
    await fetch(`/api/links/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination: newDestination }),
    });
    setEditing(null);
    setNewDestination("");
    fetchLinks(page, searchTerm);
  }

  async function handleDelete(id) {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    fetchLinks(page, searchTerm);
  }

  function downloadSvg(qr, id, format = "svg") {
    if (!qr) return;
    if (format === "svg") {
      const blob = new Blob([qr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Qrcode-${id}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      svgToCanvas(qr, 400, (canvas) => {
        canvas.toBlob(
          (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Qrcode-${id}.${format}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
          },
          `image/${format === "jpeg" ? "jpeg" : format === "webp" ? "webp" : "png"}`,
          0.92
        );
      });
    }
  }

  function svgToCanvas(svgString, size, callback) {
    const svg = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      callback(canvas);
    };
    img.src = url;
  }

  const handleDlZip = async () => {
    const zip = new JSZip();
    const promises = links.map(
      (link) =>
        new Promise((resolve) => {
          if (zipFormat === "svg") {
            zip.file(`qr-${link.shortId}.svg`, link.qrImage);
            resolve();
          } else {
            svgToCanvas(link.qrImage, 400, (canvas) => {
              canvas.toBlob(
                (blob) => {
                  zip.file(`qr-${link.shortId}.${zipFormat}`, blob);
                  resolve();
                },
                `image/${zipFormat}`,
                0.92
              );
            });
          }
        })
    );
    await Promise.all(promises);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `qrcodes-${zipFormat}.zip`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const startIdx = (pagination.page - 1) * PAGE_SIZE;

  return (
    <div className="base py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your dynamic QR codes
          </p>
        </div>
        {user?.role === "admin" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin")}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Admin Panel
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Total QR Codes</p>
            <p className="text-2xl font-bold">{stats.totalAll}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Active Redirects</p>
            <p className="text-2xl font-bold text-primary">
              {stats.totalRedirects}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Static Pages</p>
            <p className="text-2xl font-bold">
              {stats.totalStatic}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Current Plan</p>
            <div className="flex flex-col gap-1">
              <p className="text-xl font-bold capitalize">
                {user?.role === "admin" ? "Admin (Unlimited)" : (user?.plan || "Free")}
              </p>
              {user?.role === "admin" ? (
                <span className="text-[10px] text-primary font-medium">Lifetime Free Access</span>
              ) : (
                <>
                  {user?.plan === "premium" && user?.subscriptionEndDate && (
                    <p className="text-[10px] text-muted-foreground">
                      Valid until {new Date(user.subscriptionEndDate).toLocaleDateString()}
                    </p>
                  )}
                  {user?.plan !== "premium" && (
                    <Link href="/pricing" className="text-[10px] text-primary hover:underline">
                      Upgrade Plan
                    </Link>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Welcome</p>

            <p className="text-sm font-semibold truncate">{user?.name}</p>
            {user?.role === "admin" && (
              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                Admin
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by ID or destination..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1">
            <Select value={zipFormat} onValueChange={setZipFormat}>
              <SelectTrigger className="w-24 text-xs uppercase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>ZIP Format</SelectLabel>
                  {DOWNLOAD_FORMATS.map((f) => (
                    <SelectItem key={f} value={f} className="uppercase text-xs">
                      {f}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleDlZip} className="gap-2 text-sm">
              <Archive className="h-4 w-4" />
              Download All
            </Button>
          </div>
          <Button onClick={() => router.push("/dynamic-qr")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create QR
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">QR Codes</CardTitle>
          <CardDescription>
            Showing {links.length} of {pagination.total} results
            {searchTerm && ` for "${searchTerm}"`}
            {` — Page ${pagination.page} of ${pagination.totalPages || 1}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Short URL</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Destination</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Redirect</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className={fetching ? "opacity-50 pointer-events-none" : ""}>
                {links.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <QrCode className="h-10 w-10 opacity-30" />
                        <p>{searchTerm ? "No results found" : "No QR codes yet. Create your first one!"}</p>
                        {!searchTerm && (
                          <Button size="sm" onClick={() => router.push("/dynamic-qr")} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create QR Code
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  links.map((link, i) => (
                    <tr
                      key={link._id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {startIdx + i + 1}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={user?.shortUserId ? `/${user.shortUserId}/${link.shortId}` : `/${link.shortId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono text-xs"
                        >
                          {process.env.NEXT_PUBLIC_BASE_URL}/{user?.shortUserId ? `${user.shortUserId}/${link.shortId}` : link.shortId}
                        </a>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        {editing === link._id ? (
                          <Input
                            className="h-8 text-xs"
                            value={newDestination}
                            onChange={(e) => setNewDestination(e.target.value)}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground truncate block max-w-[240px]" title={link.destination}>
                            {link.destination}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="inline-flex items-center gap-1 text-xs"
                          onClick={async () => {
                            const newValue = !link.isRedirect;
                            setLinks((prev) =>
                              prev.map((l) =>
                                l._id === link._id ? { ...l, isRedirect: newValue } : l
                              )
                            );
                            try {
                              const res = await fetch(`/api/links/${link._id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ isRedirect: newValue }),
                              });
                              if (!res.ok) throw new Error("Failed");
                            } catch {
                              setLinks((prev) =>
                                prev.map((l) =>
                                  l._id === link._id ? { ...l, isRedirect: link.isRedirect } : l
                                )
                              );
                            }
                          }}
                        >
                          {link.isRedirect ? (
                            <ToggleRight className="h-5 w-5 text-primary" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                          )}
                          <span className={link.isRedirect ? "text-primary font-medium" : "text-muted-foreground"}>
                            {link.isRedirect ? "On" : "Off"}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {editing === link._id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdate(link._id)}
                                className="h-7 text-xs gap-1"
                              >
                                <Check className="h-3 w-3" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditing(null)}
                                className="h-7 text-xs gap-1"
                              >
                                <X className="h-3 w-3" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <QRImg qrImage={link.qrImage} id={link.shortId} />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditing(link._id);
                                  setNewDestination(link.destination);
                                }}
                                className="h-7 text-xs gap-1"
                              >
                                <PencilLine className="h-3 w-3" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              <div className="flex gap-0.5">
                                <Select
                                  value={downloadFormat}
                                  onValueChange={setDownloadFormat}
                                >
                                  <SelectTrigger size="sm" className=" w-16 px-1 ps-1.5 text-xs uppercase rounded-r-none border-r-0">
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
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    downloadSvg(link.qrImage, link.shortId, downloadFormat)
                                  }
                                  className="h-7 text-xs gap-1 rounded-l-none"
                                >
                                  <Download className="h-3 w-3" />
                                  <span className="hidden sm:inline">DL</span>
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={page <= 1}
                  onClick={() => setPage(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page number buttons */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      size="icon"
                      variant={pageNum === page ? "default" : "outline"}
                      className="h-8 w-8 text-xs"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(pagination.totalPages)}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

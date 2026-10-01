import CopyToClipboard from "@/components/copyButton";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import User from "@/models/User";
import { isLinkExpired } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { QrCode, AlertTriangle } from "lucide-react";

export default async function DynamicQRRedirectPage(props) {
  const params = await props.params;
  const slug = params?.slug;

  if (!slug || !Array.isArray(slug) || slug.length === 0 || slug.length > 2) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold mb-2">QR Not Found</h1>
        <p className="text-muted-foreground">
          This QR code link is invalid or has been removed.
        </p>
      </div>
    );
  }

  await connectDB();

  let link = null;
  let user = null;
  let displayUrl = "";

  if (slug.length === 1) {
    // Old printed format: /[shortId]
    const shortId = slug[0];
    link = await Link.findOne({ shortId });

    if (!link) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold mb-2">QR Not Found</h1>
          <p className="text-muted-foreground">
            This QR code does not exist or has been removed.
          </p>
        </div>
      );
    }

    if (link.userId) {
      user = await User.findById(link.userId);
    }
    displayUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.shortId}`;
  } else if (slug.length === 2) {
    // New format: /[userId]/[shortId]
    const [shortUserId, shortId] = slug;
    user = await User.findOne({ shortUserId });

    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold mb-2">QR Not Found</h1>
          <p className="text-muted-foreground">
            Invalid user or QR code.
          </p>
        </div>
      );
    }

    link = await Link.findOne({ shortId, userId: user._id });

    if (!link) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold mb-2">QR Not Found</h1>
          <p className="text-muted-foreground">
            This QR code does not exist or has been removed.
          </p>
        </div>
      );
    }

    displayUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${user.shortUserId}/${link.shortId}`;
  }

  // Check redirection & expiration
  if (link.isRedirect) {
    if (user && isLinkExpired(link, user)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-2">QR Expired</h1>
          <p className="text-muted-foreground">
            This QR code has expired and is no longer active.
          </p>
        </div>
      );
    }
    // Perform redirect to destination
    redirect(link.destination);
  }

  // If isRedirect is false, render info/copy page
  return (
    <div className="fixed inset-0 z-[9999] w-full h-screen bg-background">
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
          <QrCode className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold mb-1">QR Link</h1>
        <p className="text-muted-foreground mb-2 text-sm">
          ID:{" "}
          <span className="font-mono font-semibold text-foreground">
            {link.shortId}
          </span>
        </p>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm">
          Redirect is currently disabled for this QR code. Copy the link below.
        </p>
        <CopyToClipboard Link={displayUrl} />
      </div>
    </div>
  );
}

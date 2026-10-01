import User from "@/models/User";

export function isLinkExpired(link, user) {
  if (!user) return false;

  // Admin users never expire
  if (user.role === "admin") {
    return false;
  }

  const now = new Date();

  if (user.plan === "free") {
    // For free plan, dynamic QR codes expire 2 months after creation
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);
    if (new Date(link.createdAt) < twoMonthsAgo) {
      return true;
    }
  } else if (user.plan === "premium") {
    // If premium, but subscription has ended
    if (user.subscriptionEndDate && new Date(user.subscriptionEndDate) < now) {
      // Check if past grace period (2 months after end date)
      const expirationDate = new Date(user.subscriptionEndDate);
      expirationDate.setMonth(expirationDate.getMonth() + 2);
      if (now > expirationDate) {
        return true;
      }
    }
  }

  return false;
}

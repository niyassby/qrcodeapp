import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import { requireAuth } from "@/lib/auth";

import User from "@/models/User";

export async function POST(req) {
  try {
    const authUser = await requireAuth();
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Get full user to have latest plan and shortUserId
    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { destination } = await req.json();

    const isAdmin = user.role === "admin";
    const now = new Date();
    const isPremiumActive = isAdmin || (user.plan === "premium" && (!user.subscriptionEndDate || new Date(user.subscriptionEndDate) > now));

    // Check limits for free plan (or expired premium) - admin is completely exempt
    if (!isAdmin && !isPremiumActive) {
      user.plan = "free"; // Downgrade to free if premium expired
      await user.save();
      const dynamicCount = await Link.countDocuments({ userId: user._id, isRedirect: true });
      if (dynamicCount >= 2) {
        return NextResponse.json(
          { success: false, error: "You have reached the limit of 2 dynamic QR codes. Please upgrade your plan to create more." },
          { status: 403 }
        );
      }
    }

    let id = 1101;
    const lastLink = await Link.findOne().sort({ createdAt: -1 });

    if (lastLink && !isNaN(Number(lastLink.shortId))) {
      id = Number(lastLink.shortId) + 1;
    }
    
    const newLink = await Link.create({
      shortId: id.toString(),
      destination,
      userId: user._id,
      isRedirect: true, // It's a dynamic QR
    });

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${user.shortUserId}/${id}`;

    return NextResponse.json({
      success: true,
      id: newLink.shortId,
      shortUrl,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// GET with server-side pagination + search, scoped to authenticated user
export async function GET(req) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";

    // Build query — user can only see their own links
    const query = { userId: user.userId };

    // Add search filter if provided
    if (search.trim()) {
      query.$or = [
        { shortId: { $regex: search, $options: "i" } },
        { destination: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [links, total] = await Promise.all([
      Link.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Link.countDocuments(query),
    ]);

    // Also get user's aggregate counts (unfiltered by search)
    const userQuery = { userId: user.userId };
    const [totalAll, totalRedirects] = await Promise.all([
      Link.countDocuments(userQuery),
      Link.countDocuments({ ...userQuery, isRedirect: true }),
    ]);

    return NextResponse.json({
      success: true,
      links,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        totalAll,
        totalRedirects,
        totalStatic: totalAll - totalRedirects,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

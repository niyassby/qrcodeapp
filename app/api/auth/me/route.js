// app/api/auth/me/route.js
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  // Fetch latest user data from DB (in case role/isActive changed)
  try {
    await connectDB();
    const user = await User.findById(authUser.userId).select("-passwordHash");
    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }
    return NextResponse.json({
      success: true,
      user: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        shortUserId: user.shortUserId,
        plan: user.plan,
        subscriptionEndDate: user.subscriptionEndDate,
      },
    });
  } catch {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}

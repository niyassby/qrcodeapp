// app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Link from "@/models/Link";
import { requireAdmin } from "@/lib/auth";

// PATCH - update user role or isActive
export async function PATCH(req, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    // Don't allow admin to deactivate themselves
    if (id === admin.userId && body.isActive === false) {
      return NextResponse.json(
        { success: false, error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (body.role !== undefined) updateData.role = body.role;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-passwordHash");
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

// GET - get user details with their QR count
export async function GET(req, { params }) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).select("-passwordHash");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const qrCount = await Link.countDocuments({ userId: id });

    return NextResponse.json({
      success: true,
      user,
      qrCount,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

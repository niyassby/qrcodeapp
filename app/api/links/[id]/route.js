import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Link from "@/models/Link";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { destination, isRedirect } = await req.json();
    const { id } = await params;

    // Ensure the link belongs to the user (or user is admin)
    const link = await Link.findById(id);
    if (!link) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }
    if (link.userId?.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const updateData = {};
    if (destination !== undefined) updateData.destination = destination;
    if (isRedirect !== undefined) updateData.isRedirect = isRedirect;

    const updated = await Link.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const { id } = await params;

    // Ensure the link belongs to the user (or user is admin)
    const link = await Link.findById(id);
    if (!link) {
      return NextResponse.json(
        { success: false, error: "Link not found" },
        { status: 404 }
      );
    }
    if (link.userId?.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    await Link.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

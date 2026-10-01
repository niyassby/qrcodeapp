// lib/auth.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "qrapp-secret-key-change-in-prod";
const COOKIE_NAME = "qrapp_token";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

// Helper for API routes - returns user or throws 401 response
export async function requireAuth() {
  const tokenUser = await getAuthUser();
  if (!tokenUser?.userId) {
    return null;
  }
  try {
    await connectDB();
    const dbUser = await User.findById(tokenUser.userId);
    if (!dbUser || !dbUser.isActive) {
      return null;
    }
    return {
      userId: dbUser._id.toString(),
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      shortUserId: dbUser.shortUserId,
      plan: dbUser.plan,
      subscriptionEndDate: dbUser.subscriptionEndDate,
    };
  } catch (err) {
    console.error("Auth DB error:", err);
    return null;
  }
}

// Helper for admin-only routes
export async function requireAdmin() {
  const user = await requireAuth();
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

export function setAuthCookie(res, token) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export function clearAuthCookie(res) {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authOptions, isAuthConfigured } from "@/auth";

const handler = NextAuth(authOptions);

export async function GET(request: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  if (!isAuthConfigured()) return NextResponse.json({ error: "Editor access is not configured." }, { status: 503 });
  return handler(request, context);
}

export async function POST(request: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  if (!isAuthConfigured()) return NextResponse.json({ error: "Editor access is not configured." }, { status: 503 });
  return handler(request, context);
}

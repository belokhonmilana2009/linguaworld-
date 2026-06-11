import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const levels = await prisma.level.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(levels);
  } catch (error) {
    console.error("GET /api/levels error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

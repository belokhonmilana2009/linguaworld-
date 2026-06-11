import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const errors = await prisma.userError.findMany({
      where: { userId: session.user.id, resolved: false },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(errors);
  } catch (error) {
    console.error("GET /api/errors error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { errorId } = await request.json();

    await prisma.userError.update({
      where: { id: errorId },
      data: { resolved: true, resolvedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/errors error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

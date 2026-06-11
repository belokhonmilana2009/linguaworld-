import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        progress: true,
        streak: true,
        statistics: true,
        settings: true,
        certificates: {
          orderBy: { issuedAt: "desc" },
        },
        achievements: {
          where: { unlocked: true },
          orderBy: { unlockedAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { name, avatarUrl, bio } = body;

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: { name: name || undefined, avatarUrl: avatarUrl || undefined, bio: bio || undefined },
      create: { userId, name: name || session.user.name || "User", avatarUrl, bio },
    });

    if (name && name !== session.user.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("PATCH /api/profile error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

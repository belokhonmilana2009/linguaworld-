import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get("levelId");
    const search = searchParams.get("search");

    const where: any = {};

    if (levelId) {
      where.levelId = levelId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { searchTags: { has: search.toLowerCase() } },
      ];
    }

    const articles = await prisma.grammarArticle.findMany({
      where,
      orderBy: [{ levelId: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET /api/grammar error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

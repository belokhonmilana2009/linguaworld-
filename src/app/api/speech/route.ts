import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, language = "en-US" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Use browser's built-in speech synthesis (client-side)
    // Server-side we return the text and let client handle it
    return NextResponse.json({ text, language, message: "Use client-side SpeechSynthesis" });
  } catch (error) {
    console.error("POST /api/speech error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

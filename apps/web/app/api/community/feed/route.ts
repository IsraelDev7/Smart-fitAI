import { NextRequest, NextResponse } from "next/server";
import { communityPosts } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get("type") ?? "global";

  return NextResponse.json({
    mode,
    items: communityPosts,
    pagination: {
      cursor: null,
      hasMore: false
    }
  });
}

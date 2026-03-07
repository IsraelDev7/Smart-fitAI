import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  if (!payload?.userId || !payload?.goal || !payload?.sourceImageUrl) {
    return NextResponse.json({ error: "userId, goal, sourceImageUrl are required" }, { status: 400 });
  }

  return NextResponse.json({
    jobId: "mock-avatar-job-id",
    status: "queued",
    stages: [0, 20, 40, 60, 100],
    note: "Connect this route to queue worker + Supabase Storage pipeline"
  });
}

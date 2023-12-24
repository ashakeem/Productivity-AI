import { db } from "@/lib/db";
import { $workspaces } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { workspaceId } = await req.json();
  await db.delete($workspaces).where(eq($workspaces.id, parseInt(workspaceId)));
  return new NextResponse("ok", { status: 200 });
}
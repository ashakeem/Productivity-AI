import { db } from "@/lib/db";
import { $workspaces } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { workspaceId, editorState } = body;
    if (!editorState || !workspaceId) {
      return new NextResponse("Missing editorState or workspaceId", {
        status: 400,
      });
    }

    workspaceId = parseInt(workspaceId);
    const workspaces = await db
      .select()
      .from($workspaces)
      .where(eq($workspaces.id, workspaceId));
    if (workspaces.length != 1) {
      return new NextResponse("failed to update", { status: 500 });
    }

    const workspace = workspaces[0];
    if (workspace.editorState !== editorState) {
      await db
        .update($workspaces)
        .set({
          editorState,
        })
        .where(eq($workspaces.id, workspaceId));
    }
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}

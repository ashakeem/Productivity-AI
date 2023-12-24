// Api to create notebook
import { generateImagePrompt, generateImage } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { $workspaces } from "@/lib/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  const body = await req.json();
  const { name } = body;
  const image_description = await generateImagePrompt(name);
  if (!image_description) {
    return new NextResponse("Image description generation failed", {
      status: 500,
    });
  }
  const image_url = await generateImage(image_description);
  if (!image_url) {
    return new NextResponse("failed to generate image ", {
      status: 500,
    });
  }

  const workspace_ids = await db
    .insert($workspaces)
    .values({
      name,
      userId,
      imageUrl: image_url,
    })
    .returning({
      insertedId: $workspaces.id,
    });

  return NextResponse.json({
    workspace_id: workspace_ids[0].insertedId,
  });
}

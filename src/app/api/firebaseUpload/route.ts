import { db } from "@/lib/db";
import { $workspaces } from "@/lib/db/schema";
import { uploadFileToFirebase } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { workspaceId } = await req.json();
    // extract out the dalle imageurl
    // save it to firebase
    const workspaces = await db
      .select()
      .from($workspaces)
      .where(eq($workspaces.id, parseInt(workspaceId)));
    if (!workspaces[0].imageUrl) {
      return new NextResponse("no image url", { status: 400 });
    }
    const firebase_url = await uploadFileToFirebase(
      workspaces[0].imageUrl,
      workspaces[0].name
    );
    // update the note with the firebase url
    await db
      .update($workspaces)
      .set({
        imageUrl: firebase_url,
      })
      .where(eq($workspaces.id, parseInt(workspaceId)));
    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("error", { status: 500 });
  }
}

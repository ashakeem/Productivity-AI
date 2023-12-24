import DeleteButton from "@/components/DeleteButton";
// import AiSchedule from "@/components/AiSchedule";
import TipTapEditor from "@/components/TipTapEditor";
import { Button } from "@/components/ui/button";
import { clerk } from "@/lib/clerk-server";
import { db } from "@/lib/db";
import { $workspaces } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    workspaceId: string;
  };
};

const WorkspacePage = async ({ params: { workspaceId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/dashboard");
  }
  const user = await clerk.users.getUser(userId);
  const workspaces = await db
    .select()
    .from($workspaces)
    .where(
      and(
        eq($workspaces.id, parseInt(workspaceId)),
        eq($workspaces.userId, userId)
      )
    );

  if (workspaces.length != 1) {
    return redirect("/dashboard");
  }
  const workspace = workspaces[0];

  return (
    <div className=" bg-gradient-to-r  min-h-screen from-zinc-900 to-stone-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-zinc-700 rounded-lg p-4 flex items-center">
          <Link href="/dashboard">
            <Button className="bg-purple-700" size="sm">
              Return
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold text-gray-300">
            {user.firstName} {user.lastName}
          </span>
          <span className="inline-block mx-1 text-gray-400">/</span>
          <span className="text-purple-500 font-semibold">
            {workspace.name}
          </span>
          <div className="ml-auto">
            <DeleteButton workspaceId={workspace.id} />
          </div>
        </div>

        <div className="h-4"></div>
        <div className="border-zinc-700 shadow-xl border rounded-lg px-16 py-8 w-full">
          <TipTapEditor workspace={workspace} />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default WorkspacePage;

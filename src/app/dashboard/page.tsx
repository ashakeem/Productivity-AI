import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import CreateWorkspaceDialog from "@/components/CreateWorkspaceDialog";
import { $workspaces } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import Image from "next/image";

type Props = {};

const DashboardPage = async (props: Props) => {
  const { userId } = auth();
  const workspaces = await db
    .select()
    .from($workspaces)
    .where(eq($workspaces.userId, userId!));

  return (
    <div className="text-gray-300 bg-gradient-to-r  min-h-screen from-zinc-900 to-stone-900">
      <div className="max-w-7xl mx-auto p-10">
        <div className="h-14"></div>
        <div className="flex justify-between items-center md:flex-row flex-col">
          <div className="flex items-center">
            <Link href="/">
              <Button className="bg-purple-700" size="sm">
                <ArrowLeft className="mr-1 w-4 h-4" />
                Return
              </Button>
            </Link>
            <div className="w-4"></div>
            <h1 className="text-3xl font-bold text-gray-300">My Workspaces</h1>
            <div className="w-4"></div>
            <UserButton />
          </div>
        </div>

        <div className="h-8"></div>
        <Separator />
        {/* list all the notes */}
        {/* if no notes, display this */}
        {workspaces.length === 0 && (
          <div className="text-center">
            <h2 className="text-xl text-gray-500">No workspace yet? Let's get Started!!</h2>
          </div>
        )}

        {/* display all the notes */}
        <div className="grid sm:grid-cols-3 md:grid-cols-5 grid-cols-1 gap-3">
          <CreateWorkspaceDialog />
          {workspaces.map((workspace) => {
            return (
              <a href={`/workspace/${workspace.id}`} key={workspace.id}>
                <div className="border border-stone-300 rounded-lg overflow-hidden flex flex-col hover:shadow-xl transition hover:-translate-y-1">
                  <Image
                    width={400}
                    height={200}
                    alt={workspace.name}
                    src={workspace.imageUrl || ""}
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-300">
                      {workspace.name}
                    </h3>
                    <div className="h-1"></div>
                    <p className="text-sm text-gray-500">
                      {new Date(workspace.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

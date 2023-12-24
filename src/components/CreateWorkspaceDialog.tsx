"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Briefcase, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

const CreateWorkspaceDialog = () => {
  const router = useRouter();
  const [input, setInput] = React.useState("");
  const uploadToFirebase = useMutation({
    mutationFn: async (workspaceId: string) => {
      const response = await axios.post("/api/firebaseUpload", {
        workspaceId,
      });
      return response.data;
    },
  });
  const createWorkspace = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createWorkspace", {
        name: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("Please enter a name for your workspace");
      return;
    }
    createWorkspace.mutate(undefined, {
      onSuccess: ({ workspace_id }) => {
        console.log("created new workspace:", { workspace_id });
        // hit end point to store dalle image in firebase
        uploadToFirebase.mutate(workspace_id);
        router.push(`/workspace/${workspace_id}`);
      },
      onError: (error) => {
        console.log(error);
        window.alert("failed to create workspace, try a different name");
      },
    });
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-purple-700 mt-3 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Briefcase className="w-6 mr-2 h-6 text-purple-700" strokeWidth={3} />
          <h2 className="font-semibold text-purple-700 sm:mt-2">
            New Workspace
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-zinc">
        <DialogHeader>
          <DialogTitle className="text-gray-300">New Workspace</DialogTitle>
          <DialogDescription className="text-gray-500">
            To create a new workspace with an AI generated thumbnail, click the
            button below!.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className=" bg-inherit text-gray-300"
            placeholder="Title..."
          />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-700"
              disabled={createWorkspace.isPending}
            >
              {createWorkspace.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;

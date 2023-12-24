"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  workspaceId: number;
};

const DeleteButton = ({ workspaceId }: Props) => {
  const router = useRouter();
  const deleteWorkspace = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteWorkspace", {
        workspaceId,
      });
      return response.data;
    },
  });
  return (
    <Button
      variant={"destructive"}
      className="py-2 px-2"
      disabled={deleteWorkspace.isPending}
      onClick={() => {
        const confirm = window.confirm(
          "⚠️ Hold up! Are you certain about parting ways with this workspace? 🤔"
        );
        if (!confirm) return;
        deleteWorkspace.mutate(undefined, {
          onSuccess: () => {
            router.push("/dashboard");
          },
          onError: (err) => {
            console.error(err);
          },
        });
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
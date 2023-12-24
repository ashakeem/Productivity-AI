"use client";

import React from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenuBar from "./TipTapMenuBar";
import { Button } from "./ui/button";
import { useDebounce } from "@/lib/useDebounce";
import { NoteType } from "@/lib/db/schema";
import Text from "@tiptap/extension-text";
import { useCompletion } from "ai/react";

type Props = {
  workspace: NoteType;
};

const TipTapEditor = ({ workspace }: Props) => {
  const saveWorkspace = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveWorkspace", {
        workspaceId: workspace.id,
        editorState,
      });
      return response.data;
    },
  });

  // auto complete and Ai message using vercel ai sdk
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-n": () => {
          // take the last 30 words
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          complete(prompt);
          return true;
        },
      };
    },
  });

  const aiHandleSubmit = () => {
    const prompt = editor.getText().split(" ").slice(-30).join(" ");
    complete(prompt);
    return true;
  };

  const [editorState, setEditorState] = React.useState(
    workspace.editorState || `<h1>${workspace.name}</h1>`
  );
  const { complete, completion } = useCompletion({
    api: "/api/aicompletion",
  });
  // const [isSaving, setIsSaving] = React.useState(false)
  const debouncedEditorState = useDebounce(editorState, 500);
  React.useEffect(() => {
    if (debouncedEditorState === "") return;
    saveWorkspace.mutate(undefined, {
      onSuccess: (data) => {
        console.log("success update!", data);
      },
      onError: (err) => {
        console.error(err);
      },
    });
  }, [debouncedEditorState]);

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],

    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const lastCompletion = React.useRef("");

  React.useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
  }, [completion, editor]);

  return (
    <>
      <div className="flex flex-wrap mt-1">
        {editor && <TipTapMenuBar editor={editor} />}

        <div className="flex justify-center  flex-row mt-3 ">
          <Button disabled className="bg-purple-700 px-2 py-1">
            {saveWorkspace.isPending ? "Saving...." : "Saved🫡"}
          </Button>
          <Button
            onClick={aiHandleSubmit}
            className="bg-purple-700 ml-2 px-2 py-1"
          >
            AI autocomplete 👨‍💼
          </Button>
        </div>
      </div>
      <div className="prose prose-invert prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
      <span className="text-sm px-3 py-3 ">
        Hint: Press
        <kbd className="px-1 py-1 text-xs font-semibold mr-1 ml-1 text-purple-400 ">
          Shift + N
        </kbd>{" "}
        for AI autocomplete 👀
      </span>
    </>
  );
};

export default TipTapEditor;

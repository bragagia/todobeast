import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import dayjs from "dayjs";
import { rep } from "../../App";
import { IconPlus } from "../../utils/Icons";

export function TaskCreator() {
  const placeholder = "Add task. Press enter to create.";

  const editor = useEditor(
    {
      extensions: [
        Document,
        Paragraph,
        Text,
        History,
        Extension.create({
          addKeyboardShortcuts(this) {
            return {
              Enter: () => onEnterPressed(this.editor),
            };
          },
        }),
        Placeholder.configure({
          placeholder: placeholder,
        }),
      ],

      autofocus: false,
    },
    []
  );

  function onEnterPressed(editor: Editor) {
    rep.mutate.taskCreate({
      title: editor?.getText() || "",
      date: dayjs().toISOString(),
      projectId: 0,
      done_at: null,
    });

    editor.commands.setContent(null);

    return true;
  }

  return (
    <div className="flex flex-row items-center w-full mb-4 button-visible bg-gray-50 focus-within:bg-gray-100 ">
      <span className="text-gray-500">
        <IconPlus />
      </span>

      {editor ? (
        <EditorContent
          key="task-creator"
          className="w-full p-1"
          editor={editor}
        />
      ) : null}
    </div>
  );
}

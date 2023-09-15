import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import { useCallback, useRef } from "react";
import { TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";

export function TaskTitle({ task }: { task: TaskType }) {
  const rep = useReplicache();

  const editingTaskIdRef = useRef<string | null>(task.id);

  const updateTaskTitle = useCallback(
    (title: string) => {
      if (!editingTaskIdRef.current) {
        return;
      }

      let newTitle = title.trim();

      if (newTitle === "") {
        rep.mutate.taskRemove(editingTaskIdRef.current);
      } else {
        rep.mutate.taskUpdate({
          id: editingTaskIdRef.current,
          title: newTitle,
        });
      }

      editingTaskIdRef.current = null;
    },
    [rep]
  );

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
              Enter: () => {
                updateTaskTitle(this.editor.getText());
                return true;
              },
            };
          },
        }),
      ],
      autofocus: false,
      content: task.title,

      onFocus({ editor, event }) {
        editingTaskIdRef.current = task.id;
      },

      onBlur({ editor, event }) {
        updateTaskTitle(editor.getText());
      },
    },
    [task]
  );

  return (
    <div className="fld-not-visible cursor-text w-full">
      {editor ? <EditorContent editor={editor} /> : <p>{task.title}</p>}
    </div>
  );
}

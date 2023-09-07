import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import { TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";

export function TaskTitle({ task }: { task: TaskType }) {
  const rep = useReplicache();

  function updateTaskTitle(id: string, title: string) {
    let newTitle = title.trim();

    if (newTitle === "") {
      rep.mutate.taskRemove(task.id);
    } else {
      rep.mutate.taskUpdate({
        id: task.id,
        title: newTitle,
      });
    }
  }

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
                updateTaskTitle(task.id, this.editor.getText());
                return true;
              },
            };
          },
        }),
      ],
      autofocus: false,
      content: task.title,
      onBlur({ editor, event }) {
        updateTaskTitle(task.id, editor.getText());
      },
    },
    [task]
  );

  return (
    <div className="button">
      {editor ? <EditorContent editor={editor} /> : <p>{task.title}</p>}
    </div>
  );
}

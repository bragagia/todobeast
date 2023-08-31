import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import { TaskType } from "../../FakeData";

export function TaskTitle({ task }: { task: TaskType }) {
  const editor = useEditor(
    {
      extensions: [Document, Paragraph, Text, History],
      autofocus: false,
      content: task.title,
    },
    [task]
  );

  return (
    <div className="button">
      {editor ? <EditorContent editor={editor} /> : <p>{task.title}</p>}
    </div>
  );
}

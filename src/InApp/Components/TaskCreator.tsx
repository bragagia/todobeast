import { Editor } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { rep } from "../../App";
import { IconPlus } from "../../utils/Icons";
import { DayjsDate } from "../../utils/PlainDate";
import useDate from "../../utils/UseDate";

export function TaskCreator({
  date,
  projectId,
}: {
  date?: DayjsDate;
  projectId?: number;
}) {
  const placeholder = "Add task. Press enter to create.";

  const today = useDate();
  const disabled = useMemo(() => date?.isBefore(today), [today, date]);

  const onEnterPressed = useMemo(() => {
    return (editor: Editor) => {
      rep.mutate.taskCreate({
        created_at: dayjs().toISOString(),
        title: editor?.getText() || "",
        date: date ? date.toString() : null,
        projectId: projectId ? projectId : 0,
        done_at: null,
      });

      return editor.commands.setContent(null);
    };
  }, [date, projectId]);

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
    [onEnterPressed]
  );

  if (disabled) {
    return null;
  }

  return (
    <div className="flex flex-row items-center w-full button-visible ">
      <span className="text-gray-500">
        <IconPlus />
      </span>

      {editor ? (
        <EditorContent
          key="task-creator-editor"
          className="w-full p-1"
          editor={editor}
        />
      ) : (
        <p className="p-1 text-gray-400">{placeholder}</p>
      )}
    </div>
  );
}

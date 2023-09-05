import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useSubscribe } from "replicache-react";
import { useReplicache } from "../../ReplicacheProvider";
import { getProjectInbox } from "../../db/projects";
import { newTaskId } from "../../db/tasks";
import { IconPlus } from "../../utils/Icons";
import { DayjsDate } from "../../utils/PlainDate";
import useDate from "../../utils/UseDate";

export function TaskCreator({
  date,
  projectId,
}: {
  date?: DayjsDate;
  projectId?: string;
}) {
  const rep = useReplicache();

  const placeholder = "Add task. Press enter to create.";

  const today = useDate();

  const creationDate = useMemo(() => {
    if (!date) {
      return null;
    }

    if (date.isBefore(today)) {
      return today.toString();
    }

    return date.toString();
  }, [today, date]);

  const [content, setContent] = useState("");

  const projectInbox = useSubscribe(rep, getProjectInbox(), null, [rep]);

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
                if (!projectId) {
                  if (!projectInbox) {
                    return true;
                  }
                  projectId = projectInbox.id;
                }

                let title = this.editor.getText();
                if (title === "") {
                  return true;
                }

                rep.mutate.taskCreate({
                  id: newTaskId(),
                  created_at: dayjs().toISOString(),
                  title: title,
                  date: creationDate,
                  projectId: projectId,
                  done_at: null,
                });

                return this.editor.commands.setContent(null);
              },
            };
          },
        }),

        Placeholder.configure({
          placeholder: placeholder,
        }),
      ],

      onBlur({ editor, event }) {
        setContent(editor.getText());
      },

      content: content,
      autofocus: false,
    },
    [creationDate, projectId, projectInbox]
  );

  return (
    <div className="flex flex-row items-center w-full button-visible ">
      <span className="text-gray-500">
        <IconPlus />
      </span>

      {editor ? (
        <EditorContent className="w-full p-1" editor={editor} />
      ) : (
        <p className="p-1 text-gray-400">{placeholder}</p>
      )}
    </div>
  );
}
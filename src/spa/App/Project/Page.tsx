import Document from "@tiptap/extension-document";
import History from "@tiptap/extension-history";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { EditorContent, Extension, useEditor } from "@tiptap/react";
import classNames from "classnames";
import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSubscribe } from "replicache-react";
import { getProject, projectIdPrefix } from "../../../db/projects";
import { getTasksOfProject } from "../../../db/tasks";
import { UrlPlanner } from "../../AppRouter";
import { useReplicache } from "../../ReplicacheProvider";
import { IconTrash, projectIconMap } from "../../utils/Icons";
import { PageHeader } from "../Components/PageHeader";
import { ProjectIcon } from "../Components/ProjectIcon";
import { TaskCreator } from "../Components/TaskCreator";
import { TaskList } from "../Components/TaskList";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../Components/ui/popover";
import { PageContainer } from "../Components/PageContainer";
import { PageContent } from "../Components/PageContent";

export const ProjectIconColors = [
  "text-black",
  "text-gray-500",
  "text-pink-500",
  //"text-rose-500",
  "text-red-500",
  "text-orange-500",
  //"text-amber-500",
  "text-yellow-500",
  //"text-lime-500",
  "text-green-500",
  //"text-emerald-500",
  //"text-teal-500",
  "text-cyan-500",
  //"text-sky-500",
  "text-blue-500",
  //"text-indigo-500",
  "text-violet-500",
  //"text-purple-500",
  //"text-fuchsia-500",
];

export function ProjectPage() {
  const rep = useReplicache();

  let { id } = useParams();

  const navigate = useNavigate();

  let projectId = useMemo(() => (id ? projectIdPrefix + id : ""), [id]);

  const editingProjectIdRef = useRef<string | null>(projectId);

  const project = useSubscribe(rep, getProject(projectId), null, [
    rep,
    projectId,
  ]);

  const tasksofProject = useSubscribe(
    rep,
    getTasksOfProject(projectId),
    [],
    [rep, projectId]
  );

  const tasksTodoCount = useMemo(() => {
    return tasksofProject
      ? tasksofProject.filter((task) => !task.done_at).length
      : 0;
  }, [tasksofProject]);

  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  const setProjectIcon = useCallback(
    (iconKey: string) => {
      return async () => {
        if (!project) return;

        await rep.mutate.projectUpdate({
          id: project.id,
          icon: iconKey,
        });
      };
    },
    [project, rep]
  );

  const setProjectIconColor = useCallback(
    (color: string) => {
      return async () => {
        if (!project) return;

        await rep.mutate.projectUpdate({
          id: project.id,
          icon_color: color,
        });
      };
    },
    [project, rep]
  );

  const setProjectName = useCallback(
    async (name: string) => {
      if (!editingProjectIdRef.current) {
        return;
      }

      await rep.mutate.projectUpdate({
        id: editingProjectIdRef.current,
        name: name,
      });

      // clear the ref once the editing is done
      editingProjectIdRef.current = null;
    },
    [rep]
  );

  const deleteProject = useCallback(async () => {
    if (!project) return;

    await rep.mutate.projectRemove(project.id);

    navigate(UrlPlanner());
  }, [project, navigate, rep]);

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
                setProjectName(this.editor.getText());
                return true;
              },
            };
          },
        }),
        Placeholder.configure({
          placeholder: "New project",
        }),
      ],

      autofocus: project?.name == "",

      editable: project?.special ? false : true,

      content: project?.name,

      onFocus({ editor, event }) {
        editingProjectIdRef.current = projectId;
      },

      onBlur({ editor, event }) {
        setProjectName(editor.getText());
      },
    },
    [project, setProjectName]
  );

  if (!projectId || !project) {
    return null;
  }

  return (
    <PageContainer>
      <PageHeader>
        <div className="flex flex-row items-center justify-normal w-full py-3 page-padding">
          <div className="flex flex-row items-center">
            <Popover
              open={iconPickerOpen}
              onOpenChange={project.special ? () => {} : setIconPickerOpen}
            >
              <PopoverTrigger asChild>
                <button
                  disabled={project.special ? true : false}
                  className={classNames("-mr-2 button")}
                >
                  <ProjectIcon project={project} />
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-56">
                <div className="flex flex-row flex-wrap justify-around p-3 border-b border-gray-200">
                  {Object.keys(projectIconMap).map((projectIconKey) => {
                    let Icon = projectIconMap[projectIconKey];

                    return (
                      <button
                        key={projectIconKey}
                        className={classNames(
                          "flex w-9 h-9 button",
                          project.icon_color,
                          { "button-active": project.icon == projectIconKey }
                        )}
                        onClick={setProjectIcon(projectIconKey)}
                      >
                        <Icon />
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-row flex-wrap justify-around p-3">
                  {ProjectIconColors.map((iconColor) => {
                    let Icon = projectIconMap[project.icon];

                    return (
                      <button
                        key={iconColor}
                        className={classNames(
                          "flex w-9 h-9 button",
                          iconColor,
                          {
                            "button-active": project.icon_color == iconColor,
                          }
                        )}
                        onClick={setProjectIconColor(iconColor)}
                      >
                        <Icon />
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>

            <div
              className={classNames(
                {
                  "fld-disabled": project.special,
                },
                {
                  "fld-not-visible": !project.special,
                }
              )}
            >
              <EditorContent className="text-xl" editor={editor} />
            </div>
          </div>

          {tasksTodoCount > 0 ? (
            <div className="ml-1 text-xl font-light text-gray-400">
              {tasksTodoCount}
            </div>
          ) : null}

          <button
            onClick={deleteProject}
            className={classNames(
              "button text-gray-400",
              { invisible: project.special },
              { "pointer-fine:invisible group-hover:visible": !project.special }
            )}
          >
            <IconTrash />
          </button>
        </div>

        <TaskCreator projectId={projectId} />
      </PageHeader>

      <PageContent>
        <div className="page-padding">
          {project.special === "archive" ? (
            <p className="mt-4 italic text-gray-500 text-sm">
              Tasks assigned to this project will be hidden from every other
              views.
            </p>
          ) : null}
        </div>

        <TaskList
          key={"list/" + projectId}
          tasks={tasksofProject}
          hideProjectBar
          className="mb-32"
        />
      </PageContent>
    </PageContainer>
  );
}

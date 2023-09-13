import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  ResponderProvided,
} from "@hello-pangea/dnd";
import classNames from "classnames";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSubscribe } from "replicache-react";
import { ProjectType, getAllProjects } from "../../../db/projects";
import { PriorityType, TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { IconCollapsed, IconCollapsible } from "../../utils/Icons";
import { dragAndDropGeneric as dragAndDropMultidropableGeneric } from "../../utils/Orderring";
import { ProjectName } from "./ProjectName";
import { Task } from "./Task";

export function TaskList({
  tasks: uncachedTasks,
  hideProjectBar = false,
  mode = "default",
  className = "",
}: {
  tasks: TaskType[];
  hideProjectBar?: boolean;
  mode?: "default" | "priority-peek";
  className?: string;
}) {
  const [tasks, setTasks] = useState(uncachedTasks);
  useEffect(() => setTasks(uncachedTasks ?? []), [uncachedTasks]);

  const rep = useReplicache();

  const allProjects = useSubscribe(rep, getAllProjects(), null, [rep]);

  const allProjectsById = useMemo(() => {
    if (!allProjects) return null;

    let allProjectsById: { [key: string]: ProjectType } = {};

    allProjects.forEach((project) => {
      allProjectsById[project.id] = project;
    });

    return allProjectsById;
  }, [allProjects]);

  const sortedTasks = useMemo(() => {
    if (!allProjectsById || !tasks) return null;

    return tasks.sort((a, b) => {
      if (!a.done_at && b.done_at) return -1;
      if (a.done_at && !b.done_at) return 1;

      if (
        allProjectsById[a.projectId].order < allProjectsById[b.projectId].order
      )
        return -1;
      if (
        allProjectsById[a.projectId].order > allProjectsById[b.projectId].order
      )
        return 1;

      const priorityOrder: PriorityType[] = [
        null,
        "low",
        "medium",
        "high",
        "urgent",
      ];

      if (priorityOrder.indexOf(a.priority) < priorityOrder.indexOf(b.priority))
        return 1;
      if (priorityOrder.indexOf(a.priority) > priorityOrder.indexOf(b.priority))
        return -1;

      return a.order - b.order;
    });
  }, [allProjectsById, tasks]);

  // tasksPerProject also include done tasks under a virtual project "done"
  const doneProjectKey = "done";
  const sortedTasksPerProjectAndDone = useMemo(() => {
    if (!sortedTasks) return null;

    return sortedTasks.reduce((prev, current, i, arr) => {
      let projectId = current.done_at ? doneProjectKey : current.projectId;

      (prev[projectId] ??= []).push(current);

      return prev;
    }, {} as { [key: string]: TaskType[] });
  }, [sortedTasks]);

  const displayedTasksList = useMemo(() => {
    if (!sortedTasksPerProjectAndDone) return null;

    if (mode === "default") return sortedTasksPerProjectAndDone;

    // mode = "priority-peek"

    let displayedList: { [key: string]: TaskType[] } = {};
    Object.keys(sortedTasksPerProjectAndDone)
      .filter((key) => key !== doneProjectKey)
      .forEach((key) => {
        displayedList[key] = sortedTasksPerProjectAndDone[key].slice(0, 4);
      });

    console.log(displayedList);

    return displayedList;
  }, [mode, sortedTasksPerProjectAndDone]);

  const [doneCollapsed, setDoneCollapsed] = useState(true);

  // Auto uncollapse done tasks if only done tasks in list
  useEffect(() => {
    if (!displayedTasksList) return;

    if (
      Object.keys(displayedTasksList).length == 1 &&
      displayedTasksList[doneProjectKey]
    ) {
      // There is only done tasks
      setDoneCollapsed(false);
    }
  }, [displayedTasksList]);

  const onDragTask = useCallback(
    ({ source, destination }: DropResult, provided: ResponderProvided) => {
      // dropped outside the list or at the same position
      if (!displayedTasksList) {
        return;
      }

      dragAndDropMultidropableGeneric(
        { source, destination },
        displayedTasksList,
        {
          projectId: (task) => task.projectId,
          priority: (task) => task.priority,
        },
        (source, destination, sourceItem, newOrder, newSubvalues) => {
          // We create the task update instruction with only the required valeus
          let taskUpdate: Required<Pick<TaskType, "id">> & Partial<TaskType> = {
            id: sourceItem.id,
            order: newOrder,
          };

          // If task is moving from not done to the done bucket, we don't update project and priority (but we do if moving from done to done)
          if (
            source.droppableId !== doneProjectKey &&
            destination.droppableId === doneProjectKey
          ) {
            taskUpdate = { ...taskUpdate, done_at: dayjs().toString() };
          } else if (
            source.droppableId === doneProjectKey &&
            destination.droppableId !== doneProjectKey
          ) {
            taskUpdate = { ...taskUpdate, done_at: null };
          }

          // We do not want to change projectId and priority if moving inside the done category
          if (destination.droppableId !== doneProjectKey) {
            if (newSubvalues["projectId"] !== sourceItem.projectId) {
              taskUpdate = {
                ...taskUpdate,
                projectId: newSubvalues["projectId"],
              };
            }

            if (newSubvalues["priority"] !== sourceItem.priority) {
              taskUpdate = {
                ...taskUpdate,
                priority: newSubvalues["priority"],
              };
            }
          }

          // We update the task in cache in order to prevent blinking during the time when replicache update its state
          setTasks(
            tasks.map((task) =>
              task.id === sourceItem.id ? { ...task, ...taskUpdate } : task
            )
          );

          rep.mutate.taskUpdate(taskUpdate);
        }
      );
    },
    [displayedTasksList, tasks, rep]
  );

  if (!allProjectsById || !displayedTasksList) {
    return null;
  }

  if (tasks.length === 0) {
    return (
      <p className="pt-10 font-bold text-center text-gray-400">
        Task list is empty!
      </p>
    );
  }

  return (
    <div
      className={classNames(
        {
          "border-b border-gray-200": tasks.length > 0,
        },
        className
      )}
    >
      <DragDropContext onDragEnd={onDragTask}>
        {Object.keys(displayedTasksList).map((projectAndDoneId) => {
          return (
            <div key={"project-container/" + projectAndDoneId}>
              {!hideProjectBar && projectAndDoneId !== doneProjectKey ? (
                <div className="py-1 task-padding bg-gray-100 border-t border-gray-300 flex flex-row items-center">
                  <span>
                    <ProjectName
                      project={allProjectsById[projectAndDoneId]}
                      className="text-sm ml-1 gap-2"
                      iconClassName="w-4 h-4"
                    />
                  </span>
                  <span className="ml-2 text-sm font-light text-gray-400">
                    {displayedTasksList[projectAndDoneId].length}
                  </span>
                </div>
              ) : null}

              {projectAndDoneId === doneProjectKey ? (
                <>
                  <div className="border-t border-gray-200"></div>
                  <button
                    className="py-1 mt-6 task-padding flex flex-row items-center text-gray-500 text-sm hover:bg-gray-50 w-full border-t border-transparent hover:border-gray-200"
                    onClick={() => setDoneCollapsed(!doneCollapsed)}
                  >
                    <span>
                      <div className="flex flex-row items-center gap-2">
                        <span className="flex items-center justify-center w-4 h-4">
                          {doneCollapsed ? (
                            <IconCollapsed />
                          ) : (
                            <IconCollapsible />
                          )}
                        </span>
                        Done
                      </div>
                    </span>
                    <span className="ml-2 text-sm font-light text-gray-400">
                      {displayedTasksList[projectAndDoneId].length}
                    </span>
                  </button>
                </>
              ) : null}

              {projectAndDoneId !== doneProjectKey || !doneCollapsed ? (
                <Droppable
                  key={projectAndDoneId}
                  droppableId={projectAndDoneId}
                >
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {displayedTasksList[projectAndDoneId].map((task, id) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={id}
                        >
                          {(provided, snapshot) => (
                            <div
                              key={task.id}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Task task={task} mode={mode} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : null}
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

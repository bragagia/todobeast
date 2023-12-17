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
import { UrlProject } from "../../AppRouter";
import { useReplicache } from "../../ReplicacheProvider";
import { IconCollapsed, IconCollapsible } from "../../utils/Icons";
import { dragAndDropGeneric as dragAndDropMultidropableGeneric } from "../../utils/Orderring";
import { ListHeader } from "./ListHeader";
import { ProjectName } from "./ProjectName";
import { Task } from "./Task";

const doneProjectKey = "done";
const dailyPlanProjectKey = "dailyPlan";

export function TaskList({
  tasks: uncachedTasks,
  hideProjectBar = false,
  mode = "default",
  className = "",
  autoUncollapseDone = false,
  dailyViewDate,
}: {
  tasks: TaskType[];
  hideProjectBar?: boolean;
  mode?: "default" | "priority-peek";
  className?: string;
  autoUncollapseDone?: boolean;
  dailyViewDate?: string;
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

  // tasksPerCategory may or may not contain additional category "done" and "dailyPlan" depending on component input parameters
  const tasksPerCategory = useMemo(() => {
    if (!allProjectsById || !tasks) return null;

    let tasksPerCategory: {
      [key: string]: TaskType[];
    } = {};

    let remainingTasks = tasks;

    // Daily view category
    if (dailyViewDate) {
      let dailyPlanProject: TaskType[] = []; // We always want dailyPlan, even if empty

      remainingTasks = remainingTasks.filter((task) => {
        // If a task has an orderInDay but its date is not the current dailyViewDate, it means it is late and need to be displayed in project list
        if (task.orderInDay && task.date === dailyViewDate) {
          dailyPlanProject.push(task);
          return false;
        }

        return true;
      });

      dailyPlanProject = dailyPlanProject.sort((a, b) => {
        if (a.orderInDay && b.orderInDay) return a.orderInDay - b.orderInDay;

        return 0;
      });

      tasksPerCategory[dailyPlanProjectKey] = dailyPlanProject;
    }

    // Done category
    const hasSeparateDoneCategory = !dailyViewDate;
    let doneProject: TaskType[] = [];
    if (hasSeparateDoneCategory) {
      remainingTasks = remainingTasks.filter((task) => {
        if (task.done_at) {
          doneProject.push(task);
          return false;
        }

        return true;
      });

      doneProject = doneProject.sort((a, b) =>
        dayjs(a.done_at).isBefore(b.done_at) ? 1 : -1
      );
    }

    // Project categories
    remainingTasks
      .sort((a, b) => {
        if (
          allProjectsById[a.projectId].order !==
          allProjectsById[b.projectId].order
        ) {
          return (
            allProjectsById[a.projectId].order -
            allProjectsById[b.projectId].order
          );
        }

        const priorityOrder: PriorityType[] = [
          null,
          "low",
          "medium",
          "high",
          "urgent",
        ];

        if (
          priorityOrder.indexOf(a.priority) < priorityOrder.indexOf(b.priority)
        )
          return 1;
        if (
          priorityOrder.indexOf(a.priority) > priorityOrder.indexOf(b.priority)
        )
          return -1;

        return a.order - b.order;
      })
      .forEach((task) => {
        (tasksPerCategory[task.projectId] ??= []).push(task);
      });

    // We had the done project at the end to display it below everyting else
    if (doneProject.length > 0) {
      tasksPerCategory[doneProjectKey] = doneProject;
    }

    return tasksPerCategory;
  }, [tasks, dailyViewDate, allProjectsById]);

  const displayedTasksList = useMemo(() => {
    if (!tasksPerCategory) return null;

    if (mode === "default") return tasksPerCategory;

    // if mode = "priority-peek"
    let displayedList: { [key: string]: TaskType[] } = {};
    Object.keys(tasksPerCategory)
      .filter((key) => key !== doneProjectKey)
      .forEach((key) => {
        displayedList[key] = tasksPerCategory[key].slice(0, 4);
      });

    return displayedList;
  }, [mode, tasksPerCategory]);

  const [doneCollapsed, setDoneCollapsed] = useState(true);

  // Auto uncollapse done tasks if only done tasks in list
  useEffect(() => {
    if (!displayedTasksList || !autoUncollapseDone) return;

    if (
      Object.keys(displayedTasksList).length == 1 &&
      displayedTasksList[doneProjectKey]
    ) {
      // There is only done tasks
      setDoneCollapsed(false);
    }
  }, [displayedTasksList, autoUncollapseDone]);

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
          projectId: (task) => {
            if (task.done_at) return doneProjectKey;
            if (task.orderInDay) return dailyPlanProjectKey;

            return task.projectId;
          },
          priority: (task) => {
            if (task.done_at) return null;
            if (task.orderInDay) return null;

            return task.priority;
          },
        },

        (item: TaskType) => {
          if (item.done_at) return 0;
          if (item.orderInDay) return item.orderInDay;

          return item.order;
        },

        (source, destination, sourceItem, newOrder, newSubvalues) => {
          // We do not allow removing a task from daily plan with d&d
          if (
            source.droppableId === dailyPlanProjectKey &&
            destination.droppableId !== dailyPlanProjectKey
          )
            return;

          // We do not allow moving in/out done
          if (
            source.droppableId === doneProjectKey ||
            destination.droppableId === doneProjectKey
          )
            return;

          // We create the task update instruction with only the required valeus
          let taskUpdate: Required<Pick<TaskType, "id">> & Partial<TaskType> = {
            id: sourceItem.id,
          };

          if (destination.droppableId === dailyPlanProjectKey) {
            taskUpdate = {
              ...taskUpdate,
              orderInDay: newOrder,
              date: dailyViewDate,
            };
          } else {
            taskUpdate = { ...taskUpdate, order: newOrder };

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
    [displayedTasksList, tasks, rep, dailyViewDate]
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
    <div className={classNames(className)}>
      <DragDropContext onDragEnd={onDragTask}>
        <div>
          {Object.keys(displayedTasksList).map((projectOrDoneId) => {
            const isDailyPlan = projectOrDoneId === dailyPlanProjectKey;
            const isDoneProject = projectOrDoneId === doneProjectKey;
            const isStandardProject = !isDailyPlan && !isDoneProject;

            const isCollapsed = isDoneProject && doneCollapsed;

            return (
              <div key={"project-container/" + projectOrDoneId}>
                {!hideProjectBar && isStandardProject ? (
                  <ListHeader
                    to={UrlProject(
                      projectOrDoneId,
                      allProjectsById[projectOrDoneId].name
                    )}
                    chip={displayedTasksList[projectOrDoneId].length}
                  >
                    <ProjectName
                      project={allProjectsById[projectOrDoneId]}
                      className="gap-2"
                      iconClassName="w-4 h-4"
                    />
                  </ListHeader>
                ) : null}

                {isDoneProject && (
                  <button
                    className={classNames(
                      "py-1 page-padding flex flex-row mt-3 items-center text-gray-500 text-sm w-full sticky top-0 z-10",
                      { "bg-gray-100 border-gray-200": !doneCollapsed }
                    )}
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
                      {displayedTasksList[projectOrDoneId].length}
                    </span>
                  </button>
                )}

                {isDailyPlan && <ListHeader>Daily plan</ListHeader>}

                {!isCollapsed ? (
                  <Droppable
                    key={projectOrDoneId}
                    droppableId={projectOrDoneId}
                  >
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="pb-6"
                      >
                        {isDailyPlan &&
                          displayedTasksList[dailyPlanProjectKey].length ===
                            0 && (
                            <div className="h-16 p-2">
                              <div className="rounded-xl bg-gray-50 flex flex-row items-center justify-center h-full">
                                <p className="text-sm font-medium text-gray-400">
                                  Drag your tasks here in the order you plan to
                                  do them
                                </p>
                              </div>
                            </div>
                          )}

                        {displayedTasksList[projectOrDoneId].map((task, id) => (
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
                              >
                                <Task
                                  task={task}
                                  mode={mode}
                                  dragHandleProps={provided.dragHandleProps}
                                />
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
        </div>
      </DragDropContext>
    </div>
  );
}

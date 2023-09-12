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
import { dragAndDropGeneric as dragAndDropMultidropableGeneric } from "../../utils/Orderring";
import { ProjectName } from "./ProjectName";
import { Task } from "./Task";

export function TaskList({ tasks: uncachedTasks }: { tasks: TaskType[] }) {
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

  // tasksPerProject also include done tasks under a virtual project ""
  const sortedTasksPerProjectAndDone = useMemo(() => {
    if (!sortedTasks) return null;

    return sortedTasks.reduce((prev, current, i, arr) => {
      let projectId = current.done_at ? "done" : current.projectId;

      if (!prev[projectId]) {
        prev[projectId] = [];
      }

      prev[projectId].push(current);

      return prev;
    }, {} as { [key: string]: TaskType[] });
  }, [sortedTasks]);

  const onDragTask = useCallback(
    ({ source, destination }: DropResult, provided: ResponderProvided) => {
      // dropped outside the list or at the same position
      if (!sortedTasksPerProjectAndDone) {
        return;
      }

      dragAndDropMultidropableGeneric(
        { source, destination },
        sortedTasksPerProjectAndDone,
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
            source.droppableId !== "done" &&
            destination.droppableId === "done"
          ) {
            taskUpdate = { ...taskUpdate, done_at: dayjs().toString() };
          } else if (
            source.droppableId === "done" &&
            destination.droppableId !== "done"
          ) {
            taskUpdate = { ...taskUpdate, done_at: null };
          }

          // We do not want to change projectId and priority if moving inside the done category
          if (destination.droppableId !== "done") {
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
    [sortedTasksPerProjectAndDone, tasks, rep]
  );

  if (!allProjectsById || !sortedTasksPerProjectAndDone) {
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
      className={classNames("pt-4", {
        "border-b border-gray-200 mb-32": tasks.length > 0,
      })}
    >
      <DragDropContext onDragEnd={onDragTask}>
        {Object.keys(sortedTasksPerProjectAndDone).map((projectId) => {
          return (
            <div key={"project-container/" + projectId}>
              <div className="py-2 task-padding bg-gray-100 border-t border-gray-300 flex flex-row items-center">
                <span>
                  {projectId !== "done" ? (
                    <ProjectName
                      project={allProjectsById[projectId]}
                      className="text-sm ml-1"
                      iconClassName="w-4 h-4"
                    />
                  ) : (
                    "Done"
                  )}
                </span>
                <span className="ml-2 text-sm font-light text-gray-400">
                  {sortedTasksPerProjectAndDone[projectId].length}
                </span>
              </div>

              <Droppable key={projectId} droppableId={projectId}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {sortedTasksPerProjectAndDone[projectId].map((task, id) => (
                      <Draggable key={task.id} draggableId={task.id} index={id}>
                        {(provided, snapshot) => (
                          <div
                            key={task.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Task task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

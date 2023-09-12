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
import { calcNewOrder } from "../../utils/Orderring";
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

    for (let i = 0; i < allProjects.length; i++) {
      allProjectsById[allProjects[i].id] = allProjects[i];
    }

    return allProjectsById;
  }, [allProjects]);

  const sortedTasks = useMemo(() => {
    if (!allProjectsById) return null;

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
      console.log(source, destination);
      // dropped outside the list or at the same position
      if (
        !sortedTasksPerProjectAndDone ||
        !allProjectsById ||
        !destination ||
        (destination.droppableId == source.droppableId &&
          destination.index == source.index)
      ) {
        return;
      }
      console.log("dragging");

      // note: in this context: id = database id, index = draggable area index position

      let sourceTask =
        sortedTasksPerProjectAndDone[source.droppableId][source.index];

      let destinationProjectSortedTasks =
        sortedTasksPerProjectAndDone[destination.droppableId];
      // If we move a task to the last position of a perProjectAndDone, the destination task will not exist, so we use the last task as a reference
      let destinationIsEndOfDraggable =
        destination.index >=
        sortedTasksPerProjectAndDone[destination.droppableId].length;

      let destinationTask = destinationIsEndOfDraggable
        ? sortedTasksPerProjectAndDone[destination.droppableId][
            sortedTasksPerProjectAndDone[destination.droppableId].length - 1
          ]
        : sortedTasksPerProjectAndDone[destination.droppableId][
            destination.index
          ];

      console.log("source and dest task: ", sourceTask, destinationTask);

      let sourceProjectAndDoneIndex = Object.keys(allProjectsById).findIndex(
        (key) => key === source.droppableId
      );
      let destinationProjectAndDoneIndex = Object.keys(
        allProjectsById
      ).findIndex((key) => key === destination.droppableId);

      // TODO: ...AndInSameDraggable
      let sourceIsBeforeDestination =
        sourceProjectAndDoneIndex == destinationProjectAndDoneIndex &&
        source.index < destination.index;

      // TODO: simplify
      // We get the taskId surrounding or "englobing" the destination position
      let TaskEnglobingDestinationTaskIndex = destinationIsEndOfDraggable
        ? sortedTasksPerProjectAndDone[destination.droppableId].length - 1
        : sourceIsBeforeDestination
        ? destination.index + 1
        : destination.index - 1;

      let TaskEnglobingDestinationTask =
        TaskEnglobingDestinationTaskIndex >= 0 &&
        TaskEnglobingDestinationTaskIndex < destinationProjectSortedTasks.length
          ? destinationProjectSortedTasks[TaskEnglobingDestinationTaskIndex]
          : destinationProjectSortedTasks[destination.index]; // If this is the first or last task, we consider englobing task to be = destination task

      // We deduce the priority to which we must assign the task, we try to preserve original priority if possible
      let destinationPriority = sourceTask.priority;
      if (
        TaskEnglobingDestinationTask.priority !== sourceTask.priority &&
        destinationTask.priority !== sourceTask.priority
      ) {
        destinationPriority = destinationTask.priority;
      }

      // We identify the "bucket" of cachedTasks where the task is going, and then we map the initials ids to the new bucket
      let destinationProjectPriorityBucketIdStart =
        destinationProjectSortedTasks.findIndex(
          (task) => task.priority == destinationPriority
        );

      let inBucketDestinationIndex =
        destination.index - destinationProjectPriorityBucketIdStart;

      let destinationBucket = destinationProjectSortedTasks.filter(
        (task) => task.priority == destinationPriority
      );

      let orders = destinationBucket.map((task) => task.order);
      let newOrder = calcNewOrder(
        sourceIsBeforeDestination,
        inBucketDestinationIndex,
        orders
      );

      // CUSTOM

      // We create the task update instruction with only the required valeus
      let taskUpdate: Required<Pick<TaskType, "id">> & Partial<TaskType> = {
        id: sourceTask.id,
        order: newOrder,
      };

      // If task is moving from not done to the done bucket, we don't update project and priority (but we do if moving from done to done)
      if (source.droppableId !== "done" && destination.droppableId === "done") {
        taskUpdate = { ...taskUpdate, done_at: dayjs().toString() };
      } else if (
        source.droppableId === "done" &&
        destination.droppableId !== "done"
      ) {
        taskUpdate = { ...taskUpdate, done_at: null };
      }

      let destinationProjectId =
        destination.droppableId !== "done"
          ? destination.droppableId
          : destinationTask.projectId; // TODO: use calculated destinationProjectId like for priority
      if (destinationProjectId !== sourceTask.projectId) {
        taskUpdate = { ...taskUpdate, projectId: destinationProjectId };
      }

      if (destinationPriority !== sourceTask.priority) {
        taskUpdate = { ...taskUpdate, priority: destinationPriority };
      }

      // We update the task in cache in order to prevent blinking during the time when replicache update its state
      setTasks(
        tasks.map((task) =>
          task.id === sourceTask.id ? { ...sourceTask, ...taskUpdate } : task
        )
      );

      rep.mutate.taskUpdate(taskUpdate);
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
        "border-b border-gray-200": tasks.length > 0,
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

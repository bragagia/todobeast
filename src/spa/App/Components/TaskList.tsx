import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
  ResponderProvided,
} from "@hello-pangea/dnd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSubscribe } from "replicache-react";
import { ProjectType, getAllProjects } from "../../../db/projects";
import { PriorityType, TaskType } from "../../../db/tasks";
import { useReplicache } from "../../ReplicacheProvider";
import { calcNewOrder } from "../../utils/Orderring";
import { Task } from "./Task";

export function TaskList({ tasks }: { tasks: TaskType[] }) {
  const rep = useReplicache();

  const [cachedTasks, setCachedTasks] = useState(tasks);
  useEffect(() => setCachedTasks(tasks), [tasks]);

  const allProjects = useSubscribe(rep, getAllProjects(), null, [rep]);

  const allProjectsById = useMemo(() => {
    if (!allProjects) return null;

    let allProjectsById: { [key: string]: ProjectType } = {};

    for (let i = 0; i < allProjects.length; i++) {
      allProjectsById[allProjects[i].id] = allProjects[i];
    }

    return allProjectsById;
  }, [allProjects]);

  const onDragTask = useCallback(
    (result: DropResult, provided: ResponderProvided) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      let draggedId = result.source.index;
      let draggedTask = cachedTasks[draggedId];

      let destinationId = result.destination.index;
      let destinationTask = cachedTasks[destinationId];

      // We get the taskId surrounding or "englobing" the destination position
      let TaskSurroundingDestinationTaskId =
        draggedId < destinationId ? destinationId + 1 : destinationId - 1;

      let TaskSurroundingDestinationTask =
        TaskSurroundingDestinationTaskId >= 0 &&
        TaskSurroundingDestinationTaskId < cachedTasks.length
          ? cachedTasks[TaskSurroundingDestinationTaskId]
          : cachedTasks[destinationId]; // If this is the first task, prev = destination to keep the following code simple

      // We deduce the project and priority to which we must assign the task, we try to preserve original project/priority if possible
      let destinationProjectId = draggedTask.projectId;
      if (
        TaskSurroundingDestinationTask.projectId !== draggedTask.projectId &&
        destinationTask.projectId !== draggedTask.projectId
      ) {
        destinationProjectId = destinationTask.projectId;
      }

      let destinationPriority = draggedTask.priority;
      if (
        TaskSurroundingDestinationTask.priority !== draggedTask.priority &&
        destinationTask.priority !== draggedTask.priority
      ) {
        destinationPriority = destinationTask.priority;
      }

      // We identify the "bucket" of cachedTasks where the task is going, and then we map the initials ids to the new bucket
      let destinationTaskBucket = cachedTasks.filter(
        (task) =>
          task.projectId === destinationProjectId &&
          task.priority == destinationPriority
      );

      let inBucketDestinationId = destinationTaskBucket.findIndex(
        (task) => task.id === destinationTask.id
      );
      if (inBucketDestinationId == -1) {
        // It means that the task is moving downward and because prevOfDestination has been used
        inBucketDestinationId = 0;
      }

      let orders = destinationTaskBucket.map((task) => task.order);
      let newOrder = calcNewOrder(
        draggedId < destinationId,
        inBucketDestinationId,
        orders
      );

      // We create the task update instruction with only the required valeus
      let taskUpdate: Required<Pick<TaskType, "id">> & Partial<TaskType> = {
        id: draggedTask.id,
        order: newOrder,
      };

      if (destinationProjectId !== draggedTask.projectId) {
        taskUpdate = { ...taskUpdate, projectId: destinationProjectId };
      }

      if (destinationPriority !== draggedTask.priority) {
        taskUpdate = { ...taskUpdate, priority: destinationPriority };
      }

      // We update the task in cache in order to prevent blinking during the time when replicache update its state
      setCachedTasks(
        cachedTasks.map((task) =>
          task.id === draggedTask.id ? { ...draggedTask, ...taskUpdate } : task
        )
      );

      rep.mutate.taskUpdate(taskUpdate);
    },
    [cachedTasks, rep]
  );

  if (!allProjectsById) {
    return null;
  }

  if (!cachedTasks || cachedTasks.length === 0) {
    return (
      <p className="pt-10 font-bold text-center text-gray-400">
        Task list is empty!
      </p>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragTask}>
      <Droppable droppableId="task-list-orderable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="pt-4"
          >
            {cachedTasks
              .sort((a, b) => {
                if (!a.done_at && b.done_at) return -1;
                if (a.done_at && !b.done_at) return 1;

                if (
                  allProjectsById[a.projectId].order <
                  allProjectsById[b.projectId].order
                )
                  return -1;
                if (
                  allProjectsById[a.projectId].order >
                  allProjectsById[b.projectId].order
                )
                  return 1;

                const priorityOrder: PriorityType[] = [
                  null,
                  "low",
                  "medium",
                  "high",
                  "urgent",
                ];

                if (
                  priorityOrder.indexOf(a.priority) <
                  priorityOrder.indexOf(b.priority)
                )
                  return 1;
                if (
                  priorityOrder.indexOf(a.priority) >
                  priorityOrder.indexOf(b.priority)
                )
                  return -1;

                return a.order - b.order;

                return 0;
              })
              .map((task, id) => {
                return (
                  <Draggable
                    key={"task-list/task/" + task.id}
                    draggableId={"task-list/task/" + task.id}
                    index={id}
                  >
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
                );
              })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

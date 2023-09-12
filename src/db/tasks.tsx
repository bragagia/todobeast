import { Partial } from "@react-spring/web";
import { nanoid } from "nanoid";
import { ReadTransaction, WriteTransaction } from "replicache";
import { OrderIncrement } from "../spa/utils/Orderring";
import { DayjsDate } from "../spa/utils/PlainDate";
import { isProjectIdArchive } from "./projects";

export const taskIdPrefix = "tasks/";

export function newTaskId() {
  return taskIdPrefix + nanoid();
}

export type PriorityType = "urgent" | "high" | "medium" | "low" | null;

export type DurationType =
  | "zero"
  | "sixteenth"
  | "eighth"
  | "quarter"
  | "half"
  | "full"
  | "double"
  | "quadruple"
  | "longer"
  | null;

export type TaskType = {
  readonly id: string;
  readonly created_at: string;
  readonly date: string | null;
  readonly projectId: string;
  readonly title: string;
  readonly done_at: string | null;
  readonly priority: PriorityType;
  readonly duration: DurationType;
  readonly order: number;
};

export const tasksMutators = {
  taskCreate: async (tx: WriteTransaction, task: Omit<TaskType, "order">) => {
    let allTasks = await getAllTasks()(tx);

    let lastTask = allTasks.reduce((prev, current) => {
      return prev.order > current.order ? prev : current;
    });

    await tx.put(task.id, { ...task, order: lastTask.order + OrderIncrement });
  },

  taskUpdate: async (
    tx: WriteTransaction,
    task: Required<Pick<TaskType, "id">> & Partial<TaskType>
  ) => {
    const prev = (await tx.get(task.id)) as TaskType;
    const next = { ...prev, ...task };

    await tx.put(task.id, next);
  },

  taskUpdatePriorityAndReorder: async (
    tx: WriteTransaction,
    args: {
      task: Required<Pick<TaskType, "id" | "priority">>;
      projectId: string;
    }
  ) => {
    let allTasks = await getTasksOfProject(args.projectId)(tx);
    let maxOrder = allTasks.reduce(
      (prev, current) => (current.order > prev ? current.order : prev),
      1
    );

    let newOrder = maxOrder + OrderIncrement;

    const prev = (await tx.get(args.task.id)) as TaskType;
    const next = { ...prev, ...args.task, order: newOrder };

    await tx.put(args.task.id, next);
  },

  taskRemove: async (tx: WriteTransaction, taskId: string) => {
    await tx.del(taskId);
  },

  migrationAddTasksOrder: async (tx: WriteTransaction) => {
    let allTasks = await getAllTasks()(tx);

    if (allTasks && allTasks.length > 0 && !allTasks[0].order) {
      console.log("migrate -> AddTasksOrder");
      allTasks.forEach((task) => {
        tx.put(task.id, {
          ...task,
          order: Math.floor(Math.random() * 1000000),
        });
      });
    }
  },
};

export function getTask(taskId: string) {
  return async function (tx: ReadTransaction) {
    return (await tx.get(taskId)) as TaskType;
  };
}

export function getAllTasks() {
  return async function (tx: ReadTransaction) {
    let allTasks = (await tx
      .scan({ prefix: taskIdPrefix })
      .values()
      .toArray()) as TaskType[];

    return allTasks;
  };
}

export function getAllNonArchivedTasks() {
  return async function (tx: ReadTransaction) {
    let allTasks = (await tx
      .scan({ prefix: taskIdPrefix })
      .values()
      .toArray()) as TaskType[];

    allTasks = allTasks.filter(
      (task) => !(task.projectId ? isProjectIdArchive(task.projectId) : false)
    );

    return allTasks;
  };
}

export function getTasksByDays(today: DayjsDate) {
  return async function (tx: ReadTransaction) {
    let allTasks = await getAllNonArchivedTasks()(tx);

    let tasksByDays: { [key: string]: TaskType[] } = {};

    if (!allTasks) return tasksByDays;

    allTasks.forEach((task) => {
      if (task.done_at) {
        // Done tasks are displayed on the day they are done
        (tasksByDays[new DayjsDate(task.done_at).toString()] ??= []).push(task);
      } else {
        if (!task.date) {
          // Non planned and not done tasks are not displayed
          return;
        }

        let taskDate = new DayjsDate(task.date);
        if (taskDate.isBefore(today)) {
          // Late tasks are displayed today
          (tasksByDays[today.toString()] ??= []).push(task);
        } else {
          // Planned and not done tasks are displayed on their planned day
          (tasksByDays[taskDate.toString()] ??= []).push(task);
        }
      }
    });

    return tasksByDays;
  };
}

export function getTasksOfProject(projectId: string) {
  return async function (tx: ReadTransaction) {
    let allTasks = await getAllTasks()(tx);

    if (!allTasks) return [];
    return allTasks.filter((task) => task.projectId == projectId);
  };
}

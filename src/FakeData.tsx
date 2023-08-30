import dayjs from "dayjs";
import { ReadTransaction } from "replicache";
import { taskIdPrefix } from "./App";

export type ProjectType = {
  id: number;
  icon: string;
  icon_color?: string;
  name: string;
  special?: "inbox" | "archive";
};

export var dataProjects: ProjectType[] = [
  {
    id: 0,
    icon: "inbox",
    icon_color: "text-blue-600",
    name: "Inbox",
    special: "inbox",
  },
  {
    id: 1,
    icon: "archive",
    icon_color: "text-gray-700",
    name: "Archive",
    special: "archive",
  },
  { id: 2, icon: "computer", name: "Pro" },
  { id: 3, icon: "😄", name: "Perso" },
];

export type TaskType = {
  readonly id: string;
  readonly date: string;
  readonly projectId: number;
  readonly title: string;
  readonly done_at: string | null;
};

export function getTask(taskId: string) {
  return async function (tx: ReadTransaction) {
    return (await tx.get(taskId)) as TaskType;
  };
}

export function getAllTasks() {
  return async function (tx: ReadTransaction) {
    return (await tx
      .scan({ prefix: taskIdPrefix })
      .values()
      .toArray()) as TaskType[];
  };
}

export var dataTasks: TaskType[] = [
  {
    id: "0",
    date: dayjs().toISOString(),
    projectId: 0,
    title:
      "Le voyageur contemplant une mer de nuages https://image.jimcdn.com/app/cms/image/transf/none/path/s2fd05c04c76e678d/image/i0a0b157e58d083d2/version/1428491099/image.jpg",
    done_at: null,
  },
  {
    id: "1",
    date: dayjs().toISOString(),
    projectId: 2,
    title: "Improve SunriseBriefing",
    done_at: null,
  },
  {
    id: "2",
    date: dayjs().toISOString(),
    projectId: 3,
    title: "Organiser un chalet pour le nouvel an",
    done_at: dayjs().toISOString(),
  },
  {
    id: "3",
    date: dayjs().toISOString(),
    projectId: 2,
    title: "Design Todobeast tasks",
    done_at: null,
  },
  {
    id: "4",
    date: dayjs().add(-1, "day").toISOString(),
    projectId: 2,
    title: "Test 1",
    done_at: dayjs().add(-1, "day").toISOString(),
  },
  {
    id: "5",
    date: dayjs().add(-2, "day").toISOString(),
    projectId: 2,
    title: "Test 2",
    done_at: null,
  },
  {
    id: "6",
    date: dayjs().add(-2, "day").toISOString(),
    projectId: 2,
    title: "Test 3",
    done_at: dayjs().add(-2, "day").toISOString(),
  },
];

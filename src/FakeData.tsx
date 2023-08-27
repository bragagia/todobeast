import dayjs, { Dayjs } from "dayjs";

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
  id: number;
  date: Dayjs;
  projectId: number;
  title: string;
  done_at: Dayjs | null;
};

export var dataTasks: TaskType[] = [
  {
    id: 0,
    date: dayjs(),
    projectId: 0,
    title:
      "Le voyageur contemplant une mer de nuages https://image.jimcdn.com/app/cms/image/transf/none/path/s2fd05c04c76e678d/image/i0a0b157e58d083d2/version/1428491099/image.jpg",
    done_at: null,
  },
  {
    id: 1,
    date: dayjs(),
    projectId: 2,
    title: "Improve SunriseBriefing",
    done_at: null,
  },
  {
    id: 2,
    date: dayjs(),
    projectId: 3,
    title: "Organiser un chalet pour le nouvel an",
    done_at: dayjs(),
  },
  {
    id: 3,
    date: dayjs(),
    projectId: 2,
    title: "Design Todobeast tasks",
    done_at: null,
  },
  {
    id: 4,
    date: dayjs().add(-1, "day"),
    projectId: 2,
    title: "Test 1",
    done_at: dayjs().add(-1, "day"),
  },
  {
    id: 5,
    date: dayjs().add(-2, "day"),
    projectId: 2,
    title: "Test 2",
    done_at: null,
  },
  {
    id: 6,
    date: dayjs().add(-2, "day"),
    projectId: 2,
    title: "Test 3",
    done_at: dayjs().add(-2, "day"),
  },
];

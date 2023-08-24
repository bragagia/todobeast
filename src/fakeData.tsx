import dayjs from "dayjs";

export var dataProjects = [
  { icon: "🤷", name: "Inbox" },
  { icon: "", name: "Archive" },
  { icon: "🏛️", name: "Pro" },
  { icon: "😄", name: "Perso" },
];

export var dataTasks = [
  {
    date: dayjs(),
    projectId: 0,
    title:
      "Le voyageur contemplant une mer de nuages https://image.jimcdn.com/app/cms/image/transf/none/path/s2fd05c04c76e678d/image/i0a0b157e58d083d2/version/1428491099/image.jpg",
    done: false,
  },
  {
    date: dayjs(),
    projectId: 2,
    title: "Improve SunriseBriefing",
    done: false,
  },
  {
    date: dayjs(),
    projectId: 3,
    title: "Organiser un chalet pour le nouvel an",
    done: true,
  },
  {
    date: dayjs(),
    projectId: 2,
    title: "Design Todobeast tasks",
    done: false,
  },
  {
    date: dayjs().add(-1, "day"),
    projectId: 2,
    title: "Design Todobeast tasks",
    done: true,
  },
  {
    date: dayjs().add(-2, "day"),
    projectId: 2,
    title: "Design Todobeast tasks",
    done: false,
  },
  {
    date: dayjs().add(-2, "day"),
    projectId: 2,
    title: "Design Todobeast tasks",
    done: true,
  },
];

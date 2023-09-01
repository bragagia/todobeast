import { nanoid } from "nanoid";
import { WriteTransaction } from "replicache";
import { ProjectType, getAllProjects, projectIdPrefix } from "./projects";

export const initDataMutators = {
  createInitData: async (tx: WriteTransaction) => {
    let currentProjects = await getAllProjects()(tx);

    if (currentProjects && currentProjects.length > 0) {
      return;
    }

    async function projectCreate(
      tx: WriteTransaction,
      project: Omit<ProjectType, "id">
    ) {
      let projectID = projectIdPrefix + nanoid();

      console.log(projectID, { id: projectID, ...project });

      await tx.put(projectID, { id: projectID, ...project });

      return projectID;
    }

    initProjects.forEach((project) => {
      projectCreate(tx, project);
    });
  },
};

export var initProjects: Omit<ProjectType, "id">[] = [
  {
    order: 0,
    icon: "inbox",
    icon_color: "text-blue-600",
    name: "Inbox",
    special: "inbox",
  },
  {
    order: 1,
    icon: "archive",
    icon_color: "text-gray-700",
    name: "Archive",
    special: "archive",
  },
  {
    order: 2,
    icon: "computer",
    icon_color: "text-gray-700",
    name: "Pro",
    special: null,
  },
  {
    order: 3,
    icon: "😄",
    icon_color: "text-gray-700",
    name: "Perso",
    special: null,
  },
];

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
    icon_color: "text-blue-500",
    name: "Inbox",
    special: "inbox",
  },
  {
    order: -1,
    icon: "trash",
    icon_color: "text-gray-500",
    name: "Archive",
    special: "archive",
  },
];

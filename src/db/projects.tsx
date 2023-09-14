import { nanoid } from "nanoid";
import { ReadTransaction, WriteTransaction } from "replicache";
import { OrderIncrement } from "../spa/utils/Orderring";
import { getTasksOfProject } from "./tasks";

export const projectIdPrefix = "projects/";
export const projectInboxId = projectIdPrefix + "inbox";
export const projectArchiveId = projectIdPrefix + "archive";

export function newProjectId() {
  return projectIdPrefix + nanoid();
}

export function projectIdRemovePrefix(projectId: string) {
  return projectId.replaceAll(projectIdPrefix, "");
}

export type ProjectType = {
  readonly id: string;
  readonly order: number;
  readonly icon: string;
  readonly icon_color: string;
  readonly name: string;
  readonly special: "inbox" | "archive" | null;
};

export const projectInbox: ProjectType = {
  id: projectInboxId,
  order: 1,
  icon: "inbox",
  icon_color: "text-blue-500",
  name: "Inbox",
  special: "inbox",
};

export const projectArchive: ProjectType = {
  id: projectArchiveId,
  order: 0,
  icon: "trash",
  icon_color: "text-gray-500",
  name: "Archive",
  special: "archive",
};

const staticProjects: ProjectType[] = [projectInbox, projectArchive];

export const projectsMutators = {
  projectCreate: async (
    tx: WriteTransaction,
    project: Omit<ProjectType, "order">
  ) => {
    let allProjects = await getAllProjects()(tx);

    let lastProject = allProjects.reduce((prev, current) => {
      return prev.order > current.order ? prev : current;
    });

    await tx.put(project.id, {
      ...project,
      order: lastProject.order + OrderIncrement,
    });
  },

  projectUpdate: async (
    tx: WriteTransaction,
    project: Required<Pick<ProjectType, "id">> & Partial<ProjectType>
  ) => {
    const prev = (await tx.get(project.id)) as ProjectType;
    const next = { ...prev, ...project };

    await tx.put(project.id, next);
  },

  projectRemove: async (tx: WriteTransaction, projectId: string) => {
    let allProjectTasks = await getTasksOfProject(projectId)(tx);

    allProjectTasks.forEach((task) =>
      tx.put(task.id, { ...task, projectId: projectInboxId })
    );

    await tx.del(projectId);
  },
};

export function getProject(projectId: string) {
  return async function (tx: ReadTransaction) {
    let staticProject = staticProjects.find(
      (project) => project.id === projectId
    );

    if (staticProject) {
      return staticProject;
    }

    return (await tx.get(projectId)) as ProjectType;
  };
}

export function getAllNonSpecialProjects() {
  return async function (tx: ReadTransaction) {
    let dbProjects = (await tx
      .scan({ prefix: projectIdPrefix })
      .values()
      .toArray()) as ProjectType[];

    let sortedProjects = dbProjects.sort((a, b) => a.order - b.order);

    return sortedProjects;
  };
}

// getAllProjects return all project sorted by their order
export function getAllProjects() {
  return async function (tx: ReadTransaction) {
    let dbProjects = (await tx
      .scan({ prefix: projectIdPrefix })
      .values()
      .toArray()) as ProjectType[];

    let allProjects = staticProjects
      .concat(dbProjects)
      .sort((a, b) => a.order - b.order);

    let archive = allProjects.shift();
    if (archive) allProjects.push(archive);

    return allProjects;
  };
}

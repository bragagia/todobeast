import { nanoid } from "nanoid";
import { ReadTransaction, WriteTransaction } from "replicache";
import { getTasksOfProject } from "./tasks";
import { OrderIncrement } from "../spa/utils/Orderring";

export const projectIdPrefix = "projects/";

export function newProjectId() {
  return projectIdPrefix + nanoid();
}

export function newProjectIdSpecial(specialName: string, userId: string) {
  return projectIdPrefix + specialName + "-" + userId;
}

export function projectIdRemovePrefix(projectId: string) {
  return projectId.replaceAll(projectIdPrefix, "");
}

export function isProjectIdArchive(projectId: string) {
  return projectId.startsWith(projectIdPrefix + "archive");
}

export type ProjectType = {
  readonly id: string;
  readonly order: number;
  readonly icon: string;
  readonly icon_color: string;
  readonly name: string;
  readonly special: "inbox" | "archive" | null;
};

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

  projectCreateSpecial: async (tx: WriteTransaction, project: ProjectType) => {
    if (!project.special) {
      throw Error(
        "Trying to create a non-special project with special mutator"
      );
    }

    let allProjects = await getAllProjects()(tx);
    let projectAlreadyExist = allProjects.some(
      (p) => p.special === project.special
    );
    if (projectAlreadyExist) return;

    await tx.put(project.id, project);
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
    let inbox = await getProjectInbox()(tx);

    // Shitty condition to prevent typescript from complaining
    let inboxId = "";
    if (inbox) {
      inboxId = inbox.id;
    } else {
      return;
    }

    let allProjectTask = await getTasksOfProject(projectId)(tx);

    allProjectTask.forEach((task) =>
      tx.put(task.id, { ...task, projectId: inboxId })
    );

    await tx.del(projectId);
  },
};

export function getProject(projectId: string) {
  return async function (tx: ReadTransaction) {
    return (await tx.get(projectId)) as ProjectType;
  };
}

// getAllProjects return all project sorted by their order
export function getAllProjects() {
  return async function (tx: ReadTransaction) {
    let allProject = (
      (await tx
        .scan({ prefix: projectIdPrefix })
        .values()
        .toArray()) as ProjectType[]
    ).sort((a, b) => a.order - b.order);

    let archive = allProject.shift();
    if (archive) allProject.push(archive);

    return allProject;
  };
}

export function getProjectInbox() {
  return async function (tx: ReadTransaction) {
    let allProjects = await getAllProjects()(tx);

    return allProjects.find((project) => project.special === "inbox");
  };
}

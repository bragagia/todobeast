import { nanoid } from "nanoid";
import { ReadTransaction, WriteTransaction } from "replicache";

export const projectIdPrefix = "projects/";

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

export const projectsMutators = {
  projectCreate: async (tx: WriteTransaction, project: ProjectType) => {
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
    return (
      (await tx
        .scan({ prefix: projectIdPrefix })
        .values()
        .toArray()) as ProjectType[]
    ).sort((a, b) => a.order - b.order);
  };
}

export function getProjectInbox() {
  return async function (tx: ReadTransaction) {
    let allProjects = await getAllProjects()(tx);

    return allProjects.find((project) => project.special === "inbox");
  };
}

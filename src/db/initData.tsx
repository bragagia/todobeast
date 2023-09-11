import { Replicache } from "replicache";
import { ReplicacheMutators } from "./mutators";
import { ProjectType, newProjectIdSpecial } from "./projects";

export function createInitData(
  rep: Replicache<typeof ReplicacheMutators>,
  userId: string
) {
  // createInitData is called on every new replicache instanciation, so
  // all mutators used here must check for existing entities

  initProjects.forEach((project) => {
    rep.mutate.projectCreateSpecial({
      id: newProjectIdSpecial(project.special ?? "", userId),
      ...project,
    });
  });

  // Migrations

  rep.mutate.migrationAddTasksOrder();
}

export var initProjects: Omit<ProjectType, "id">[] = [
  {
    order: 1,
    icon: "inbox",
    icon_color: "text-blue-500",
    name: "Inbox",
    special: "inbox",
  },
  {
    order: 0,
    icon: "trash",
    icon_color: "text-gray-500",
    name: "Archive",
    special: "archive",
  },
];

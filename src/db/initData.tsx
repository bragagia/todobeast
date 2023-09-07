import { Replicache } from "replicache";
import { ReplicacheMutators } from "./mutators";
import { ProjectType, newProjectId } from "./projects";

export function createInitData(rep: Replicache<typeof ReplicacheMutators>) {
  // createInitData is called on every new replicache instanciation, so
  // all mutators used here must check for existing entities

  initProjects.forEach((project) => {
    rep.mutate.projectCreateSpecial({ id: newProjectId(), ...project });
  });
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

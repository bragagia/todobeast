import { projectsMutators } from "./projects";
import { tasksMutators } from "./tasks";

export const ReplicacheMutators = {
  ...tasksMutators,
  ...projectsMutators,
};

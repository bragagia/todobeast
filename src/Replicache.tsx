import { Replicache } from "replicache";
import { initDataMutators } from "./db/initData";
import { projectsMutators } from "./db/projects";
import { tasksMutators } from "./db/tasks";

export const rep = new Replicache({
  licenseKey: "le17c8453f94e462e92cae4e1797cd24b",
  name: "mathias.bragagia.pro+test2@gmail.com",
  mutators: {
    ...tasksMutators,
    ...projectsMutators,
    ...initDataMutators,
  },
});

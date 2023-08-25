import { IconPlus } from "../../utils/Icons";

export function TaskCreator() {
  return (
    <div className="flex flex-row items-center w-full my-4 button bg-gray-50 focus-within:bg-gray-100 ">
      <span className="text-gray-500">
        <IconPlus />
      </span>

      <input
        id="task-creation-field"
        className="w-full placeholder-gray-400 bg-transparent border-0 without-ring"
        placeholder="Add task. Press enter to create."
      ></input>
    </div>
  );
}

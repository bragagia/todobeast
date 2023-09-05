import { IconSettings } from "../../utils/Icons";
import { PageTitle } from "../Components/PageTitle";

export function SettingsPage() {
  return (
    <>
      <PageTitle>
        <div className="flex flex-row items-center gap-2">
          <IconSettings />
          <p className="text-xl">Settings</p>
        </div>
      </PageTitle>

      {/* TODO: */}
      <p className="text-center">No settings yet 🤷‍♂️</p>
    </>
  );
}

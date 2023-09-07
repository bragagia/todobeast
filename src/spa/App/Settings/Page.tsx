import { useSupabase } from "../../SupabaseProvider";
import { IconSettings } from "../../utils/Icons";
import { PageTitle } from "../Components/PageTitle";

export function SettingsPage() {
  const supabase = useSupabase();

  async function signout() {
    await supabase.auth.signOut();
  }

  return (
    <>
      <PageTitle>
        <div className="flex flex-row justify-between w-full">
          <button className="button-visible invisible">Sign out</button>
          <div className="flex flex-row items-center gap-2">
            <IconSettings />
            <p className="text-xl">Settings</p>
          </div>
          <button className="button-visible bg-gray-100" onClick={signout}>
            Sign out
          </button>
        </div>
      </PageTitle>

      {/* TODO: */}
      <div className="page-padding">
        <p className="text-center">No settings yet 🤷‍♂️</p>
      </div>
    </>
  );
}

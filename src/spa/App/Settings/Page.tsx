import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "../../SupabaseProvider";
import { IconSettings } from "../../utils/Icons";
import { PageHeader } from "../Components/PageTitle";

export function SettingsPage() {
  const supabase = useSupabase();
  const navigate = useNavigate();

  async function signout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader className="page-container py-4 task-padding">
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
      </PageHeader>

      <div className="page-padding page-container">
        <div>
          <label className="font-bold">Theme</label>

          <p className="text-gray-500 text-sm">
            Will you fear seeing the beast in the dark?
          </p>

          <fieldset className="mt-3">
            <div className="flex flex-row items-center gap-8">
              <div className="flex flex-row items-center gap-2">
                <input
                  id="theme-auto"
                  name="theme"
                  type="radio"
                  className="h-4 w-4"
                  checked={theme === "system"}
                  onClick={() => setTheme("system")}
                />
                <label htmlFor="theme-auto" className="text-sm">
                  Auto
                </label>
              </div>

              <div className="flex flex-row items-center gap-2">
                <input
                  id="theme-light"
                  name="theme"
                  type="radio"
                  className="h-4 w-4"
                  checked={theme === "light"}
                  onClick={() => setTheme("light")}
                />
                <label htmlFor="theme-light" className="text-sm">
                  Light
                </label>
              </div>

              <div className="flex flex-row items-center gap-2">
                <input
                  id="theme-dark"
                  name="theme"
                  type="radio"
                  className="h-4 w-4"
                  checked={theme === "dark"}
                  onClick={() => setTheme("dark")}
                />
                <label htmlFor="theme-dark" className="text-sm">
                  Dark
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}

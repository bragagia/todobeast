import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UrlSettings } from "../../../AppRouter";
import { useSupabase } from "../../../SupabaseProvider";
import { IconChevronLeft } from "../../../utils/Icons";
import { PageContainer } from "../../Components/PageContainer";
import { PageContent } from "../../Components/PageContent";
import { PageHeader } from "../../Components/PageHeader";

export function SettingsUpdatePasswordPage() {
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const [smallLoading, setSmallLoading] = useState(false);

  const supabase = useSupabase();

  const navigate = useNavigate();

  const [helperText, setHelperText] = useState<{
    error: boolean;
    text: string;
  } | null>(null);

  const handleResetPassword = useCallback(async () => {
    if (!supabase) return;

    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    if (
      !password ||
      !passwordConfirm ||
      password === "" ||
      passwordConfirm === ""
    ) {
      setHelperText({
        error: true,
        text: "Please fill all the required fields.",
      });
      return;
    }

    if (password.length < 8) {
      setHelperText({
        error: true,
        text: "Password should be at least 8 characters.",
      });
      return;
    }

    if (password !== passwordConfirm) {
      setHelperText({
        error: true,
        text: "Passwords are not the same.",
      });
      return;
    }

    setSmallLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password });
    setSmallLoading(false);

    if (error) {
      setHelperText({
        error: true,
        text: error.message,
      });

      return;
    }

    navigate("/");
  }, [supabase, navigate]);

  return (
    <PageContainer>
      <PageHeader className="page-container py-4 page-padding">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <Link to={UrlSettings()} className="button">
              <IconChevronLeft />
            </Link>

            <div className="flex flex-row items-center gap-2">
              <p className="text-xl">Change password</p>
            </div>
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <div className="page-padding page-container gap-2 flex flex-col">
          <div className="self-stretch max-w-sm">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              ref={passwordRef}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus-visible:border-red-500  block w-full p-2.5 without-ring"
              required
            />
          </div>

          <div className="self-stretch max-w-sm">
            <label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900 "
            >
              Confirm password
            </label>

            <input
              type="password"
              id="confirm_password"
              ref={passwordConfirmRef}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus-visible:border-red-500  block w-full p-2.5 without-ring"
              required
            />
          </div>

          {helperText && (
            <p
              className={classNames("font-bold text-sm", {
                "text-red-600": helperText.error,
              })}
            >
              {helperText.text}
            </p>
          )}

          <div>
            <button className="button-full-red" onClick={handleResetPassword}>
              {smallLoading ? "Loading..." : "Set password"}
            </button>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  );
}

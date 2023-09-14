import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import { UrlSettingsUpdatePassword } from "./AppRouter";
import { LoaderPage } from "./Loader";
import { useSupabase } from "./SupabaseProvider";

type modeType = "LOGIN" | "CREATE" | "RESET";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [smallLoading, setSmallLoading] = useState(false);
  const [mode, setMode] = useState<modeType>("LOGIN");
  const [helperText, setHelperText] = useState<{
    error: boolean;
    text: string;
  } | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const supabase = useSupabase();

  const handleLogin = useCallback(async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password || email === "" || password === "") {
      setHelperText({
        error: true,
        text: "Please fill all the required fields.",
      });
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email ?? "",
      password: password ?? "",
    });
    setLoading(false);

    if (error) {
      setHelperText({ error: true, text: error.message });
    } else if (!data.user && !error) {
      setHelperText({
        error: false,
        text: "An email has been sent to you for verification!",
      });
    }

    // AuthProvider will automatically be informed on the updated login state by supabase
  }, [emailRef, passwordRef, supabase]);

  const handleCreateAccount = useCallback(async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    if (
      !email ||
      !password ||
      !passwordConfirm ||
      email === "" ||
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
    const { data, error } = await supabase.auth.signUp({
      email: email ?? "",
      password: password ?? "",
    });
    setSmallLoading(false);

    if (error) {
      setHelperText({ error: true, text: error.message });
      return;
    }

    setHelperText({
      error: false,
      text: "We've sent you an email for verification ;) Welcome aboard!",
    });

    setMode("LOGIN");
  }, [emailRef, passwordRef, passwordConfirmRef, supabase]);

  const handleResetPassword = useCallback(async () => {
    const email = emailRef.current?.value;

    if (!email || email === "") {
      setHelperText({
        error: true,
        text: "Please fill all the required fields.",
      });
      return;
    }

    setSmallLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "") +
        "/a" +
        UrlSettingsUpdatePassword(),
    });
    setSmallLoading(false);

    if (error) {
      setHelperText({ error: true, text: error.message });
      return;
    }

    setHelperText({
      error: false,
      text: "We've sent you an email for verification ;)",
    });
  }, [supabase]);

  function setModeAndResetHelper(mode: modeType) {
    setMode(mode);
    setHelperText(null);
  }

  if (loading) {
    return <LoaderPage />;
  }

  return (
    <div className="flex flex-row items-center justify-center w-screen h-screen bg-red-100">
      <div className="flex flex-col items-center justify-between gap-6 p-8 bg-white border border-gray-500 rounded-lg w-96">
        <h1
          className="text-5xl text-center text-red-500 align-middle josefin-sans"
          style={{ textShadow: "1px 1px black" }}
        >
          Todobeast
        </h1>

        <div className="self-stretch">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email address
          </label>

          <input
            type="email"
            id="email"
            ref={emailRef}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-red-500 focus-visible:border-red-500  block w-full p-2.5 without-ring"
            required
          />
        </div>

        {(mode === "LOGIN" || mode === "CREATE") && (
          <div className="self-stretch">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 "
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
        )}

        {mode === "CREATE" && (
          <div className="self-stretch">
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
        )}

        {helperText && (
          <p
            className={classNames("font-bold text-sm", {
              "text-red-600": helperText.error,
            })}
          >
            {helperText.text}
          </p>
        )}

        {mode === "LOGIN" && (
          <div className="flex flex-col gap-2 self-stretch">
            <button
              type="submit"
              className="button-full-red"
              onClick={handleLogin}
            >
              Login
            </button>

            <button
              className="button-full-gray"
              onClick={() => setModeAndResetHelper("CREATE")}
            >
              Create account
            </button>

            <button
              className="text-sm font-bold underline"
              onClick={() => setModeAndResetHelper("RESET")}
            >
              Reset password
            </button>
          </div>
        )}

        {mode === "CREATE" && (
          <div className="flex flex-col gap-2 self-stretch">
            <button
              type="submit"
              className="button-full-red"
              onClick={smallLoading ? undefined : handleCreateAccount}
            >
              {smallLoading ? "Loading..." : "Create account"}
            </button>

            <button
              className="text-sm font-bold underline"
              onClick={() => setModeAndResetHelper("LOGIN")}
            >
              Or login to your account
            </button>
          </div>
        )}

        {mode === "RESET" && (
          <div className="flex flex-col gap-2 self-stretch">
            <button
              type="submit"
              className="button-full-red"
              onClick={smallLoading ? undefined : handleResetPassword}
            >
              {smallLoading ? "Loading..." : "Reset password"}
            </button>

            <button
              className="text-sm font-bold underline"
              onClick={() => setModeAndResetHelper("LOGIN")}
            >
              Or login to your account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

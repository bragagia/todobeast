import classNames from "classnames";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "src/utils/Supabase";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"LOGIN" | "CREATE">("LOGIN");
  const [helperText, setHelperText] = useState<{
    error: boolean;
    text: string;
  } | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = async () => {
      const {
        data: { session, user },
        error,
      } = await supabase.auth.refreshSession();

      setUser(user?.id);
    };
    fn();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser?.id);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [user]);

  const handleLogin = useCallback(async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email ?? "",
      password: password ?? "",
    });

    if (error) {
      setHelperText({ error: true, text: error.message });
    } else if (!user && !error) {
      setHelperText({
        error: false,
        text: "An email has been sent to you for verification!",
      });
    }
  }, [emailRef, passwordRef]);

  const handleCreateAccount = useCallback(async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const passwordConfirm = passwordConfirmRef.current?.value;

    if (!email || !password || !passwordConfirm) {
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

    const { data, error } = await supabase.auth.signUp({
      email: email ?? "",
      password: password ?? "",
    });

    if (error) {
      setHelperText({ error: true, text: error.message });
    } else if (!user && !error) {
      setHelperText({
        error: false,
        text: "An email has been sent to you for verification!",
      });
    }
  }, [emailRef, passwordRef, passwordConfirmRef]);

  if (user) {
    return <>{children}</>;
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
            placeholder="john.doe@company.com"
            required
          />
        </div>

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
            placeholder="••••"
            required
          />
        </div>

        {mode === "CREATE" ? (
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
              placeholder="••••"
              required
            />
          </div>
        ) : null}

        {helperText ? (
          <p
            className={classNames("font-bold text-sm", {
              "text-red-600": helperText.error,
            })}
          >
            {helperText.text}
          </p>
        ) : null}

        {mode === "LOGIN" ? (
          <>
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm self-stretch px-5 py-2.5 text-center"
              onClick={handleLogin}
            >
              Login
            </button>

            <button
              className="text-sm font-bold underline"
              onClick={() => setMode("CREATE")}
            >
              Or create an account
            </button>
          </>
        ) : (
          <>
            <button
              type="submit"
              className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm self-stretch px-5 py-2.5 text-center"
              onClick={handleCreateAccount}
            >
              Create account
            </button>

            <button
              className="text-sm font-bold underline"
              onClick={() => setMode("LOGIN")}
            >
              Or login to your account
            </button>
          </>
        )}
      </div>
    </div>
  );
}

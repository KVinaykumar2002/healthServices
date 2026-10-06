import { useState, type FormEvent } from "react";
import { Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import { login, type AdminSession } from "./api";

export function LoginPage({ notice, onSignedIn }: { notice: string; onSignedIn: (session: AdminSession) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      onSignedIn(await login(username, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/brand/bhsk-symbol.svg" alt="" className="mb-4 h-14 w-14" />
          <h1 className="m-0 text-2xl">BHSK Admin</h1>
          <p className="mt-1 mb-0 text-sm text-[var(--color-text-tertiary)]">Sign in to manage enquiries</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-1)]"
        >
          {notice && !error ? (
            <p className="mt-0 mb-4 rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-900" role="status">
              {notice}
            </p>
          ) : null}
          {error ? (
            <p className="mt-0 mb-4 rounded-lg bg-[var(--color-error-bg)] px-3 py-2 text-sm text-[var(--color-error)]" role="alert">
              {error}
            </p>
          ) : null}

          <label className="mb-1.5 block text-sm font-semibold" htmlFor="admin-username">
            Username
          </label>
          <input
            id="admin-username"
            className="mb-4 h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 outline-none transition focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30"
            autoComplete="username"
            autoFocus
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <label className="mb-1.5 block text-sm font-semibold" htmlFor="admin-password">
            Password
          </label>
          <div className="relative mb-6">
            <input
              id="admin-password"
              className="h-11 w-full rounded-xl border border-[var(--color-border)] bg-white pr-11 pl-3 outline-none transition focus:border-[var(--bhsk-blue)] focus:ring-3 focus:ring-[var(--bhsk-sky)]/30"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center border-0 bg-transparent text-[var(--color-text-tertiary)] hover:text-[var(--bhsk-ink)]"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-[var(--bhsk-blue-text)] font-semibold text-white transition hover:bg-[var(--bhsk-blue-deep)] disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? <LoaderCircle className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <a href="/" className="text-[var(--bhsk-blue-text)] hover:underline">
            ← Back to website
          </a>
        </p>
      </div>
    </main>
  );
}

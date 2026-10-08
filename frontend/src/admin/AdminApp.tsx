import { useCallback, useEffect, useState } from "react";
import { clearSession, fetchMe, loadSession, onUnauthorized, type AdminSession } from "./api";
import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";

function useAdminDocument() {
  useEffect(() => {
    document.title = "Admin | BHSK for Health Services";
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
  }, []);
}

export default function AdminApp() {
  useAdminDocument();
  const [session, setSession] = useState<AdminSession | null>(() => loadSession());
  const [notice, setNotice] = useState("");

  const signOut = useCallback((message = "") => {
    clearSession();
    setSession(null);
    setNotice(message);
  }, []);

  useEffect(() => {
    onUnauthorized(() => signOut("Your session has expired. Please sign in again."));
    return () => onUnauthorized(null);
  }, [signOut]);

  // Confirm a stored session is still accepted (e.g. the password may have changed since).
  useEffect(() => {
    if (session) fetchMe().catch(() => undefined);
  }, [session]);

  // Sign out on the client when the token's expiry passes.
  useEffect(() => {
    if (!session) return;
    const remaining = new Date(session.expiresAt).getTime() - Date.now();
    const id = window.setTimeout(
      () => signOut("Your session has expired. Please sign in again."),
      Math.min(Math.max(remaining, 0), 2 ** 31 - 1),
    );
    return () => window.clearTimeout(id);
  }, [session, signOut]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-page)] text-[var(--bhsk-ink)]">
      {session ? (
        <Dashboard username={session.username} onSignOut={() => signOut()} onSessionChange={setSession} />
      ) : (
        <LoginPage
          notice={notice}
          onSignedIn={(next) => {
            setNotice("");
            setSession(next);
          }}
        />
      )}
    </div>
  );
}

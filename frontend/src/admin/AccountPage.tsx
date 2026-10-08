import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { AdminApiError, fetchAccount, updateAccount, type AdminAccount, type AdminSession } from "./api";
import { formatDateTime } from "./format";
import { Card, DisplayRow, EditDialog, Field, LoadError, LoadingCards, borderFor, inputClass } from "./settingsForm";

type Editing = "username" | "password";
type FieldErrors = Partial<Record<"username" | "password", string[]>>;

const USERNAME_PATTERN = /^[a-z0-9._-]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validate(editing: Editing, value: string, account: AdminAccount): FieldErrors {
  if (editing === "username") {
    const username = value.trim().toLowerCase();
    if (username.length < 3) return { username: ["Use at least 3 characters"] };
    if (!USERNAME_PATTERN.test(username))
      return { username: ["Use letters, numbers, dots, dashes or underscores only"] };
    if (username === account.username) return { username: ["This is already your username"] };
    return {};
  }
  if (value.length < MIN_PASSWORD_LENGTH) return { password: [`Use at least ${MIN_PASSWORD_LENGTH} characters`] };
  if (value === account.password) return { password: ["This is already your password"] };
  return {};
}

function RevealButton({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-[var(--color-text-tertiary)] hover:bg-[var(--color-surface-page)] hover:text-[var(--bhsk-ink)]"
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

export function AccountPage({ onSessionChange }: { onSessionChange: (session: AdminSession) => void }) {
  const [account, setAccount] = useState<AdminAccount | null>(null);
  const [loadError, setLoadError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState<Editing | null>(null);
  // Kept after closing so the popup's content doesn't vanish during its close animation.
  const [lastEdited, setLastEdited] = useState<Editing>("username");
  const [value, setValue] = useState("");
  const [showDraftPassword, setShowDraftPassword] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const savedTimer = useRef<number | undefined>(undefined);

  const load = useCallback(async () => {
    setLoadError("");
    try {
      setAccount(await fetchAccount());
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to load your account");
    }
  }, []);

  useEffect(() => {
    void load();
    return () => window.clearTimeout(savedTimer.current);
  }, [load]);

  function startEdit(next: Editing) {
    if (!account) return;
    setValue(next === "username" ? account.username : account.password);
    setShowDraftPassword(true);
    setFieldErrors({});
    setError("");
    setEditing(next);
    setLastEdited(next);
  }

  async function save() {
    if (!editing || !account) return;
    const errors = validate(editing, value, account);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setError("Please fix the highlighted field");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const update = editing === "username" ? { username: value.trim().toLowerCase() } : { password: value };
      const session = await updateAccount(update);
      onSessionChange(session);
      setAccount({ ...account, ...update, updatedAt: new Date().toISOString() });
      setEditing(null);
      setSavedMessage(editing === "username" ? "Username updated" : "Password updated");
      window.clearTimeout(savedTimer.current);
      savedTimer.current = window.setTimeout(() => setSavedMessage(""), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save. Please try again.");
      if (err instanceof AdminApiError) setFieldErrors(err.fieldErrors as FieldErrors);
    } finally {
      setSaving(false);
    }
  }

  if (loadError) return <LoadError title="Couldn't load your account" message={loadError} onRetry={() => void load()} />;
  if (!account) return <LoadingCards />;

  const shown = editing ?? lastEdited;
  const fieldError = fieldErrors[shown];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm shadow-[var(--shadow-1)] sm:px-5">
        {savedMessage ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700" role="status">
            <Check className="size-4" /> {savedMessage}. Use the new details next time you sign in.
          </span>
        ) : (
          <span className="text-[var(--color-text-tertiary)]">Last changed {formatDateTime(account.updatedAt)}</span>
        )}
      </div>

      <Card title="Sign-in details" description="The username and password you use to sign in to this dashboard.">
        <DisplayRow label="Username" onEdit={() => startEdit("username")}>
          {account.username}
        </DisplayRow>
        <DisplayRow label="Password" onEdit={() => startEdit("password")}>
          <span className="inline-flex items-center gap-1">
            <span className={showPassword ? "font-mono" : ""}>{showPassword ? account.password : "••••••••"}</span>
            <RevealButton visible={showPassword} onToggle={() => setShowPassword((current) => !current)} />
          </span>
        </DisplayRow>
      </Card>

      <EditDialog
        open={editing !== null}
        title={shown === "username" ? "Change username" : "Change password"}
        saving={saving}
        error={error}
        saveLabel={shown === "username" ? "Save username" : "Save password"}
        onClose={() => setEditing(null)}
        onSave={() => void save()}
      >
        {shown === "username" ? (
          <Field
            label="New username"
            htmlFor="account-username"
            hint="Letters, numbers, dots, dashes or underscores. Not case-sensitive."
            errors={fieldError}
          >
            <input
              id="account-username"
              autoComplete="username"
              autoFocus
              required
              minLength={3}
              maxLength={40}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                setFieldErrors({});
              }}
              className={`${inputClass} ${borderFor(fieldError)}`}
            />
          </Field>
        ) : (
          <Field
            label="New password"
            htmlFor="account-password"
            hint={`At least ${MIN_PASSWORD_LENGTH} characters. It stays visible on this page, so you can look it up later.`}
            errors={fieldError}
          >
            <div className="relative">
              <input
                id="account-password"
                type={showDraftPassword ? "text" : "password"}
                autoComplete="new-password"
                autoFocus
                required
                maxLength={200}
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  setFieldErrors({});
                }}
                className={`${inputClass} pr-11 ${borderFor(fieldError)}`}
              />
              <span className="absolute inset-y-0 right-1.5 flex items-center">
                <RevealButton visible={showDraftPassword} onToggle={() => setShowDraftPassword((current) => !current)} />
              </span>
            </div>
          </Field>
        )}
      </EditDialog>
    </div>
  );
}

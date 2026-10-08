import { useEffect, useRef, useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { AdminApiError, updateAccount, type AdminSession } from "./api";
import { Card, DisplayRow, EditDialog, Field, borderFor, inputClass } from "./settingsForm";

type Editing = "username" | "password";
type Draft = { username: string; currentPassword: string; newPassword: string; confirmPassword: string };
type FieldErrors = Partial<Record<keyof Draft, string[]>>;

const USERNAME_PATTERN = /^[a-z0-9._-]+$/;
const MIN_PASSWORD_LENGTH = 8;

function PasswordInput({
  id,
  value,
  autoComplete,
  autoFocus,
  errors,
  onChange,
}: {
  id: string;
  value: string;
  autoComplete: "current-password" | "new-password";
  autoFocus?: boolean;
  errors?: string[];
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required
        maxLength={200}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} pr-11 ${borderFor(errors)}`}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center border-0 bg-transparent text-[var(--color-text-tertiary)] hover:text-[var(--bhsk-ink)]"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

function validate(editing: Editing, draft: Draft, currentUsername: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!draft.currentPassword) errors.currentPassword = ["Enter your current password"];
  if (editing === "username") {
    const username = draft.username.trim().toLowerCase();
    if (username.length < 3) errors.username = ["Use at least 3 characters"];
    else if (!USERNAME_PATTERN.test(username))
      errors.username = ["Use letters, numbers, dots, dashes or underscores only"];
    else if (username === currentUsername) errors.username = ["This is already your username"];
  } else {
    if (draft.newPassword.length < MIN_PASSWORD_LENGTH)
      errors.newPassword = [`Use at least ${MIN_PASSWORD_LENGTH} characters`];
    else if (draft.newPassword === draft.currentPassword)
      errors.newPassword = ["Choose a password different from your current one"];
    if (draft.confirmPassword !== draft.newPassword) errors.confirmPassword = ["The passwords don't match"];
  }
  return errors;
}

export function AccountPage({
  username,
  onSessionChange,
}: {
  username: string;
  onSessionChange: (session: AdminSession) => void;
}) {
  const [editing, setEditing] = useState<Editing | null>(null);
  // Kept after closing so the popup's content doesn't vanish during its close animation.
  const [lastEdited, setLastEdited] = useState<Editing>("username");
  const [draft, setDraft] = useState<Draft>({ username: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const savedTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(savedTimer.current), []);

  function startEdit(next: Editing) {
    setDraft({ username: next === "username" ? username : "", currentPassword: "", newPassword: "", confirmPassword: "" });
    setFieldErrors({});
    setError("");
    setEditing(next);
    setLastEdited(next);
  }

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function save() {
    if (!editing) return;
    const errors = validate(editing, draft, username);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setError("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const session = await updateAccount(
        editing === "username"
          ? { currentPassword: draft.currentPassword, username: draft.username.trim().toLowerCase() }
          : { currentPassword: draft.currentPassword, newPassword: draft.newPassword },
      );
      onSessionChange(session);
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

  const shown = editing ?? lastEdited;

  return (
    <div className="grid gap-6">
      {savedMessage ? (
        <p
          className="m-0 inline-flex items-center gap-1.5 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-[var(--shadow-1)]"
          role="status"
        >
          <Check className="size-4" /> {savedMessage}. Use the new details next time you sign in.
        </p>
      ) : null}

      <Card title="Sign-in details" description="The username and password you use to sign in to this dashboard.">
        <DisplayRow label="Username" onEdit={() => startEdit("username")}>
          {username}
        </DisplayRow>
        <DisplayRow label="Password" onEdit={() => startEdit("password")}>
          <span aria-label="Hidden">••••••••</span>
        </DisplayRow>
      </Card>

      <EditDialog
        open={editing !== null}
        title={shown === "username" ? "Change username" : "Change password"}
        description="Enter your current password to confirm it's you."
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
            errors={fieldErrors.username}
          >
            <input
              id="account-username"
              autoComplete="username"
              autoFocus
              required
              minLength={3}
              maxLength={40}
              value={draft.username}
              onChange={(event) => update("username", event.target.value)}
              className={`${inputClass} ${borderFor(fieldErrors.username)}`}
            />
          </Field>
        ) : (
          <>
            <Field
              label="New password"
              htmlFor="account-new-password"
              hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
              errors={fieldErrors.newPassword}
            >
              <PasswordInput
                id="account-new-password"
                autoComplete="new-password"
                autoFocus
                value={draft.newPassword}
                errors={fieldErrors.newPassword}
                onChange={(value) => update("newPassword", value)}
              />
            </Field>
            <Field label="Confirm new password" htmlFor="account-confirm-password" errors={fieldErrors.confirmPassword}>
              <PasswordInput
                id="account-confirm-password"
                autoComplete="new-password"
                value={draft.confirmPassword}
                errors={fieldErrors.confirmPassword}
                onChange={(value) => update("confirmPassword", value)}
              />
            </Field>
          </>
        )}
        <Field label="Current password" htmlFor="account-current-password" errors={fieldErrors.currentPassword}>
          <PasswordInput
            id="account-current-password"
            autoComplete="current-password"
            value={draft.currentPassword}
            errors={fieldErrors.currentPassword}
            onChange={(value) => update("currentPassword", value)}
          />
        </Field>
      </EditDialog>
    </div>
  );
}

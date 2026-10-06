import { DEFAULT_SITE_SETTINGS, normalizeSiteSettings, type SiteSettings } from "../../shared/siteSettings";
import { getDb, isDatabaseConfigured } from "./db";

const SETTINGS_ID = "site";

type SiteSettingsDocument = SiteSettings & { _id: string; updatedAt: Date };

export type SiteSettingsRecord = SiteSettings & { updatedAt: string | null };

async function settingsCollection() {
  return (await getDb()).collection<SiteSettingsDocument>("settings");
}

export async function getSiteSettings(): Promise<SiteSettingsRecord> {
  if (!isDatabaseConfigured()) return { ...DEFAULT_SITE_SETTINGS, updatedAt: null };
  const document = await (await settingsCollection()).findOne({ _id: SETTINGS_ID });
  if (!document) return { ...DEFAULT_SITE_SETTINGS, updatedAt: null };
  const { _id, updatedAt, ...fields } = document;
  return { ...normalizeSiteSettings(fields), updatedAt: updatedAt.toISOString() };
}

export async function saveSiteSettings(settings: SiteSettings): Promise<SiteSettingsRecord> {
  const updatedAt = new Date();
  await (await settingsCollection()).updateOne(
    { _id: SETTINGS_ID },
    { $set: { ...settings, updatedAt } },
    { upsert: true },
  );
  return { ...settings, updatedAt: updatedAt.toISOString() };
}

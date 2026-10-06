import { DEFAULT_HOME_HERO, normalizeHomeHero, referencedMediaIds, type HomeHero } from "../../shared/homeHero";
import { getDb, isDatabaseConfigured } from "./db";
import { deleteMediaExcept } from "./media";

const HERO_ID = "hero";

type HomeHeroDocument = HomeHero & { _id: string; updatedAt: Date };

export type HomeHeroRecord = HomeHero & { updatedAt: string | null };

async function heroCollection() {
  return (await getDb()).collection<HomeHeroDocument>("settings");
}

export async function getHomeHero(): Promise<HomeHeroRecord> {
  if (!isDatabaseConfigured()) return { ...DEFAULT_HOME_HERO, updatedAt: null };
  const document = await (await heroCollection()).findOne({ _id: HERO_ID });
  if (!document) return { ...DEFAULT_HOME_HERO, updatedAt: null };
  const { _id, updatedAt, ...fields } = document;
  return { ...normalizeHomeHero(fields), updatedAt: updatedAt.toISOString() };
}

export async function saveHomeHero(hero: HomeHero): Promise<HomeHeroRecord> {
  const updatedAt = new Date();
  await (await heroCollection()).updateOne({ _id: HERO_ID }, { $set: { ...hero, updatedAt } }, { upsert: true });

  // Uploads are only used by the hero, so anything it no longer shows can go.
  try {
    await deleteMediaExcept(referencedMediaIds(hero));
  } catch (error) {
    console.error("[media] cleanup failed", error);
  }

  return { ...hero, updatedAt: updatedAt.toISOString() };
}

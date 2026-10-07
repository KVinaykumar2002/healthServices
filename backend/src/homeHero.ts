import { DEFAULT_HOME_HERO, normalizeHomeHero, type HomeHero } from "../../shared/homeHero";
import { getDb, isDatabaseConfigured } from "./db";

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
  return { ...hero, updatedAt: updatedAt.toISOString() };
}

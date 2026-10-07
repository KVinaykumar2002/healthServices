import { referencedMediaIds } from "../../shared/homeHero";
import { serviceMediaIds } from "../../shared/services";
import { getHomeHero } from "./homeHero";
import { deleteMediaExcept } from "./media";
import { listServices } from "./services";

/** Removes uploads that neither the hero nor any service shows any more. */
export async function cleanupUnusedMedia() {
  try {
    const [hero, services] = await Promise.all([getHomeHero(), listServices({ includeHidden: true })]);
    await deleteMediaExcept([...referencedMediaIds(hero), ...serviceMediaIds(services)]);
  } catch (error) {
    console.error("[media] cleanup failed", error);
  }
}

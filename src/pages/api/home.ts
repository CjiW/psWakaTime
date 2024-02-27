import { BasicInstance } from ".";

export async function getList(language?: string) {
  if (language) {
    return await BasicInstance.get(
      `leaders?lang=${language}`
    );
  } else {
    return await BasicInstance.get("leaders");
  }
}

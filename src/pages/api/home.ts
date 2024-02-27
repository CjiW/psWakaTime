import { BasicInstance } from ".";

export async function getList(language?: string) {
  if (language) {
    return await BasicInstance.get(
      `listdata?lang=${language}`
    );
  } else {
    return await BasicInstance.get("listdata");
  }
}

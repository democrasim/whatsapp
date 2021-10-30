import { MessageId, MessageTypes } from "@open-wa/wa-automate";
import { findSourceMap } from "module";
import { AskCall, Response } from ".";

export async function askOptional(
  ask: AskCall,
  content: string,
  optionChoiseText: string
): Promise<Partial<Response>> {
  const choice = (await askBoolean(ask, optionChoiseText)).choice;
  if (!choice) {
    return {
      text: undefined,
    };
  }
  const response = await ask(content, MessageTypes.TEXT);
  const { text } = response;
  return {
    ...response,
    text,
  };
}

export async function askBoolean(
  ask: AskCall,
  content: string
): Promise<Response & { choice: boolean }> {
  const response = await ask(
    content,
    MessageTypes.BUTTONS_RESPONSE,
    undefined,
    undefined,
    ["כן", "לא"],
    "",
    ""
  );

  if (response.text === "כן")
    return {
      ...response,
      choice: true,
    };
  if (response.text === "לא")
    return {
      ...response,
      choice: false,
    };
  throw new Error("check did not go well.");
}

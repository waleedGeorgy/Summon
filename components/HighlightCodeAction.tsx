"use server";
import { codeToHtml } from "shiki";

export async function HighlightCodeAction(code: string, lang = "javascript") {
  return codeToHtml(code, { lang, theme: "one-dark-pro" });
}
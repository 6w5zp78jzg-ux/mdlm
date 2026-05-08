import es from "@/messages/es.json";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import ru from "@/messages/ru.json";

const messages = { es, en, fr, ru } as const;

type Locale = "es" | "en" | "fr" | "ru";

export function getT(locale: string) {
  const lang = (["es","en","fr","ru"].includes(locale) ? locale : "en") as Locale;
  return messages[lang];
}

import { Language } from "./i18n";

export function swap(original: string, replacements: string[]): string {
    let string = original;
    for (const replacement of replacements)
        string = string.replace("%s", replacement)
    string = string.replaceAll("%s", ""); // Remove all leftovers.
    return string;
}
export function list(items: string[]): string {
    return items.length <= 1 ? items[0] :
        (items.length >= 3 ? items.slice(0, -1).join(", ") : items[0])
            + ` & ${items[items.length - 1]}`
}

export enum Game {
    Chunithm = "chu3", Maimai = "mai2",
    Ongeki = "ongeki", ProjectDiva = "diva",
    CardMaker = "cm", Wacca = "wacca"
}
export const gameMap: Record<Game, Partial<Record<Language, string>>> = {
    [Game.Chunithm]: {
        [Language.en]: "CHUNITHM",
        [Language.ja]: "チュウニズム"
    },
    [Game.Maimai]: {
        [Language.en]: "maimai DX",
        [Language.ja]: "maimai でらくす"
    },
    [Game.Ongeki]: {
        [Language.en]: "O.N.G.E.K.I.",
        [Language.ja]: "オンゲキ"
    },
    [Game.ProjectDiva]: {
        [Language.en]: "Project DIVA",
        [Language.ja]: "Project DIVA"
    },
    [Game.CardMaker]: {
        [Language.en]: "Card Maker",
        [Language.ja]: "Card Maker"
    },
    [Game.Wacca]: {
        [Language.en]: "WACCA",
        [Language.ja]: "WACCA"
    }
}
export function simplifyGameName(name: string) : string {
    // TODO: Learn Regex for once :sob:
    return name.replaceAll(" ", "").replaceAll(".", "").toLowerCase();
}
export function getGameFromName(name: string) : Game | undefined {
    for (const gameEnum of Object.keys(gameMap)) {
        const gameStrings = gameMap[gameEnum as Game];
        // TODO: Create proper game aliases instead of relying on an unreliable .includes
        for (const languageEnum of Object.keys(gameStrings)) {
            if (simplifyGameName(gameStrings[languageEnum as Language] ?? "").includes(simplifyGameName(name)) 
                || simplifyGameName(name).includes(simplifyGameName(gameStrings[languageEnum as Language] ?? ""))
            )
                return gameEnum as Game;
        }
    }
    return;
}

export function disableUrlEmbeds(text: string) {
    return text.replace(/(?<!<)https?:\/\/[^\s<>)]+/g, '<$&>');
}
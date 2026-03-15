// NOTE: Create a copy of this file and rename it to `config.ts`

import { ColorResolvable } from "discord.js";
import { Game } from "./utility/general";
import { Language } from "./utility/i18n";

export const config: Config = {
    discord: {
        guildId: "",
        moderationRoleId: "",
        gameEmojis: {
            [Game.Chunithm]: "",
            [Game.Maimai]: "",
            [Game.Ongeki]: "",
            [Game.ProjectDiva]: "",
            [Game.CardMaker]: "",
            [Game.Wacca]: ""
        },
        supportChannelLanguages: {
            // NOTE: This must be specified for it to be marked as a support channel
            "": Language.en,
        }
    },
    embedColor: "#6a5bb0",
    // NOTE: Bot pulls from this repository for information, 
    //       make sure the README matches the one for AquaDX or it will not work as intended
    githubRepository: ["MewoLab", "AquaDX", "v1-dev"] 
};

/************************************/

interface Config {
    discord: {
        guildId: string,
        moderationRoleId: string,
        gameEmojis: Record<Game, string>,
        supportChannelLanguages: Record<string, Language>
    },
    embedColor: ColorResolvable,
    githubRepository: string[]
}
import { Client, ForumChannel, Locale, ThreadChannel } from "discord.js";
import { getAppropriateString, getDiscordLocale, Language } from "../utility/i18n";
import { Game, getGameFromName, simplifyGameName, swap, list, gameMap } from "../utility/general";

import fs from "fs";
import { config } from "../config";

const headerMessage: Partial<Record<Language, string>> = {
    [Language.en]: "Hello.\nYour ticket for **%s** support has been received and a staff member will assist you as soon as possible. Please be patient.\n%s"
}
const headerSelfResourcesAvailable: Partial<Record<Language, string>> = {
    [Language.en]: "Please refer to the following for %s:"
}

let articles: Partial<Record<Game, Partial<Record<Language, string>>>> = {};

// https://www.answeroverflow.com/m/1372917640078819472
async function waitStarterMessage(thread: ThreadChannel, maxTries: number = 15) {
    for (let i = 0; i < maxTries; i++) {
        try {
            return await thread.fetchStarterMessage();
        } catch (e: any) {
            if (e.code !== 10008) throw e;               
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    throw new Error("Starter message never arrived");
}

export async function onThreadCreation(thread: ThreadChannel) {
    if (Object.keys(articles).length == 0) {
        const supportArticleFiles = fs.readdirSync("./md/support")
        for (const articleName of supportArticleFiles) {
            const [gameName, languageCode] = articleName.split(".");

            const game = getGameFromName(gameName);
            const language = languageCode as Language;

            if (!game) continue;
            if (!articles[game])
                articles[game] = {};

            articles[game][language] = fs.readFileSync(`./md/support/${articleName}`, 'utf-8').toString();
        }
    }
    
    let forumChannel = thread.parent as ForumChannel | undefined;
    if (!forumChannel) return;
    let tags: string[] = thread.appliedTags
        .map(v => forumChannel.availableTags.find(t => t.id == v)?.name ?? "")
        .filter(v => v.length > 0);

    let language = config.discord.supportChannelLanguages[forumChannel.id];
    if (!language) return;
    let locale = getDiscordLocale(language)

    let includedArticles: Game[] = [];
    for (let tag of tags) {
        const game = getGameFromName(tag);
        if (game && articles[game]) 
            includedArticles.push(game);
    }
    
    await waitStarterMessage(thread);
    await thread.send({
        content: swap(getAppropriateString(locale, headerMessage), [
                list(tags), (Object.keys(includedArticles).length > 0 ? 
                    swap(getAppropriateString(locale, headerSelfResourcesAvailable), [list(includedArticles)]) : ''
                )
            ]) + `\n` + includedArticles.map(game => `# ${getAppropriateString(locale, gameMap[game])}\n${
                    articles[game as Game] ? getAppropriateString(locale, articles[game as Game] as Partial<Record<Language, string>>) : ""
                }`)
    })
}
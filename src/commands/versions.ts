import { ChatInputCommandInteraction, EmbedBuilder, Locale } from "discord.js";
import { botCommandGenericIssueStates, BotCommandLanguageState, getAppropriateString, Language } from "../utility/i18n";
import { BotCommand } from "../bot";

import { marked, type Tokens } from "marked";
import { gameMap, getGameFromName, swap } from "../utility/general";
import { config } from "../config";

const commandName: Partial<Record<Language, string>> = {
    [Language.en]: "Supported Games List",
    [Language.ja]: "遊べるゲーム"
}
const embedFooter: Partial<Record<Language, string>> = {
    [Language.en]: "Pulled from %s Repository",
    [Language.ja]: "%sのリポジトリから"
}
const codeString: Partial<Record<Language, string>> = {
    [Language.en]: "Game ID",
    [Language.ja]: "ゲームコード"
}

async function getFormattedChart(locale: Locale): Promise<EmbedBuilder | undefined> {
    let readme = await fetch(`https://raw.githubusercontent.com/${config.githubRepository[0]}/${config.githubRepository[1]}/refs/heads/${config.githubRepository[2]}/README.md`)
        .then(resp => resp.text());
    let tokens = marked.lexer(readme);

    let markdownTable = tokens.find(t => t.type == "table") as Tokens.Table | undefined;
    if (!markdownTable) return;
    
    let embedBuilder = new EmbedBuilder();
    embedBuilder.setColor(config.embedColor);
    embedBuilder.setFooter({
        text: `${swap(getAppropriateString(locale, embedFooter), [config.githubRepository[1]])} ・ https://github.com/${config.githubRepository[0]}/${config.githubRepository[1]}`
    });
    embedBuilder.setTitle(getAppropriateString(locale, commandName));
    for (let row of markdownTable.rows) {
        let [ gameIdentifier, newestVersion, initialVersion, additionalNotes ] = row.map(r => r.text);
        let [ code, name ] = gameIdentifier.split(":").map(v => v.trim());
        let versions = (initialVersion != "N/A" && initialVersion) 
            ? `Ver ${initialVersion} → ${newestVersion}` : `Ver ${newestVersion}`;

        let game = getGameFromName(name);

        embedBuilder.addFields({
            name: `${game ? getAppropriateString(locale, gameMap[game]) : name} ${game ? `<:game:${config.discord.gameEmojis[game]}>` : ""} (${getAppropriateString(locale, codeString)} ${code})`,
            // NOTE: We check for links and don't include them so it doesn't show a massive embed of the person's Github profile
            value: `・ ${versions} ${additionalNotes.includes("https://") || !additionalNotes ? "" : `・ ${additionalNotes}`}`
        })
    }
    return embedBuilder;
}

export const command: BotCommand = {
    name: commandName,
    arguments: [],
    requiresPrivilege: false,
    internationalizationStatus: {
        [Language.en]: BotCommandLanguageState.Complete,
        [Language.ja]: BotCommandLanguageState.Complete,
        [Language.zh]: BotCommandLanguageState.Missing
    },
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const table = await getFormattedChart(interaction.locale);
        
        if (table) {
            await interaction.reply({
                embeds: [table.toJSON()]
            });
        } else
            await interaction.reply(
                getAppropriateString(interaction.locale, botCommandGenericIssueStates)
            );
    }
}
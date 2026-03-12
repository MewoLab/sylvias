import { ChatInputCommandInteraction, EmbedBuilder, formatEmoji, Locale } from "discord.js";
import { BotCommand } from "../bot";
import { botCommandGenericIssueStates, BotCommandLanguageState, getAppropriateString, Language } from "../utility/i18n";

import { marked, type Tokens } from "marked";
import { botEmbedColor } from "../utility/general";

// NOTE: This sucks!
const emojiMap: Record<string, string> = {
    "CHUNITHM": "1324885575056228392",
    "maimai DX": "1319575907228323941",
    "maimai DX (Intl)": "1319575907228323941",
    "O.N.G.E.K.I.": "1324885395946733691",
    "Project DIVA": "1324886954281537607",
    "Card Maker": "1481464229377609830",
    "Wacca": "1324885847371288737"
}

const commandName: Partial<Record<Language, string>> = {
    [Language.en]: "Supported Games List",
    [Language.ja]: "遊べるゲーム"
}
const embedFooter: Partial<Record<Language, string>> = {
    [Language.en]: "Pulled from AquaDX Repository",
    [Language.ja]: "AquaDXのリポジトリから"
}
const codeString: Partial<Record<Language, string>> = {
    [Language.en]: "Game Code",
    [Language.ja]: "ゲームコード"
}

async function getFormattedChart(locale: Locale): Promise<EmbedBuilder | undefined> {
    let readme = await fetch(`https://raw.githubusercontent.com/MewoLab/AquaDX/refs/heads/v1-dev/README.md`)
        .then(resp => resp.text());
    let tokens = marked.lexer(readme);

    let markdownTable = tokens.find(t => t.type == "table") as Tokens.Table | undefined;
    if (!markdownTable) return;
    
    let embedBuilder = new EmbedBuilder();
    embedBuilder.setColor(botEmbedColor);
    embedBuilder.setFooter({
        text: `${getAppropriateString(locale, embedFooter)} ・ https://github.com/MewoLab/AquaDX`
    });
    embedBuilder.setTitle(getAppropriateString(locale, commandName));
    for (let row of markdownTable.rows) {
        let [ gameIdentifier, newestVersion, initialVersion, additionalNotes ] = row.map(r => r.text);
        let [ code, name ] = gameIdentifier.split(":").map(v => v.trim());
        let versions = (initialVersion != "N/A" && initialVersion) 
            ? `Ver ${initialVersion} → ${newestVersion}` : `Ver ${newestVersion}`;

        embedBuilder.addFields({
            name: `${name} <:game:${(emojiMap[name] ?? emojiMap["CHUNITHM"])}> (${getAppropriateString(locale, codeString)} ${code})`,
            // NOTE: We check for links and don't include them so it doesn't show a massive embed of the person's Github profile
            value: `・ ${versions} ${additionalNotes.includes("https://") || !additionalNotes ? "" : `・ ${additionalNotes}`}`
        })
    }
    return embedBuilder;
}

export const command: BotCommand = {
    name: commandName,
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
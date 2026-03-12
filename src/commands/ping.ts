import { ChatInputCommandInteraction } from "discord.js";
import { BotCommand } from "../bot";
import { BotCommandLanguageState, getAppropriateString, Language } from "../utility/i18n";

export const command: BotCommand = {
    name: {
        [Language.en]: "ping",
        [Language.ja]: "ピン"
    },
    arguments: [
        {name: "test", required: false}
    ],
    requiresPrivilege: false,
    internationalizationStatus: {
        [Language.en]: BotCommandLanguageState.Complete,
        [Language.ja]: BotCommandLanguageState.IncompleteMachineTranslation,
        [Language.zh]: BotCommandLanguageState.Missing
    },
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        await interaction.reply(
            `${getAppropriateString(interaction.locale, {
                [Language.en]: "Pong.",
                [Language.ja]: "ポン"
            })} ${JSON.stringify(interaction.options.data)}`
        );
    }
}
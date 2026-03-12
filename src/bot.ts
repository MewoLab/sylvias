import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits, Interaction, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from "discord.js";
import { BotCommandLanguageState, botCommandPrivilegeRejectionStates, getAppropriateString, getBotLocaleAsDiscordLocale, getLanguageStatesAsDiscordLocales, Language, tweakLanguagesForCommand, tweakStringForCommand } from "./utility/i18n";
import fs from "fs";

export interface BotCommand {
    name: Partial<Record<Language, string>>,
    requiresPrivilege: boolean,
    internationalizationStatus: Record<Language, BotCommandLanguageState>,
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>
};

export class Bot {
    constructor() {
        this.client = new Client({
            intents: [ 
                GatewayIntentBits.Guilds,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildModeration
            ]
        });
        this.client.once(Events.ClientReady, this.ready.bind(this));
        this.client.on(Events.InteractionCreate, this.interaction.bind(this));
        this.client.login(process.env.DISCORD_BOT_TOKEN);
    }
    async ready(readyClient: Client<true>) {
        await this.registerCommands();

        console.log(`Ready! Authenticated as ${readyClient.user.tag}`);
    }
    async interaction(interaction: Interaction): Promise<void> {
        if (!interaction.isChatInputCommand())
            return;

        for (let command of this.commands) {
            if (tweakStringForCommand(command.name[Language.en] ?? "") == interaction.commandName) {
                // TODO: check roles
                if (command.requiresPrivilege) {
                    await interaction.reply(
                        getAppropriateString(interaction.locale, botCommandPrivilegeRejectionStates)
                    )
                    return;
                }
                await command.execute(interaction); break;
            }
        };
    }
    async registerCommands() {
        this.commands = [];
        let restSlashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

        // NOTE: Ugh, why are these different ???
        const commandFiles = fs.readdirSync("./src/commands");
        for (const commandFile of commandFiles) {
            const { command } = await import(`./commands/${commandFile}`);
            if (command) {
                this.commands.push(command as BotCommand);
                restSlashCommands.push(
                    new SlashCommandBuilder()
                        .setName(tweakStringForCommand(command.name[Language.en]))
                        .setDescription(command.name[Language.en])
                        .setNameLocalizations(
                            getBotLocaleAsDiscordLocale(tweakLanguagesForCommand(command.name))
                        )
                        .setDescriptionLocalizations(
                            getLanguageStatesAsDiscordLocales(command.internationalizationStatus, command.name)
                        )
                        .toJSON()
                );
            }
        }

        console.log(restSlashCommands);
        
        this.commandRest.setToken(process.env.DISCORD_BOT_TOKEN ?? "");
        await this.commandRest.put(Routes.applicationGuildCommands(
            (process.env.DISCORD_BOT_CLIENT_ID ?? "").toString(),
            (process.env.DISCORD_GUILD_ID ?? "").toString()
        ), { body: restSlashCommands });
    }

    commandRest: REST = new REST();
    commands: BotCommand[] = [];
    commandsSetupPromise: Promise<void> | undefined;

    client: Client | undefined;
}
import { Locale } from "discord.js"

export enum Language {
    // NOTE: zh is concerning Simplified Chinese, as there seems to be prominently simplified than traditional
    en, ja, zh
}
export enum BotCommandLanguageState {
    Complete,
    IncompleteMachineTranslation,
    Incomplete,
    Missing
}

// NOTE: Complete is unused. All statements are wrapped in parenthesis.
export const botCommandLanguageStates: Record<
    Language, Record<BotCommandLanguageState, string>
> = {
    [Language.en]: {
        [BotCommandLanguageState.Complete]: "This command is available in your language.",
        [BotCommandLanguageState.IncompleteMachineTranslation]: "Some portions of this command may be localized via Machine Translation.",
        [BotCommandLanguageState.Incomplete]: "This command has incomplete localization for your language.",
        [BotCommandLanguageState.Missing]: "This command is not localized for your language."
    },
    // TODO: Google Translate
    [Language.ja]: {
        [BotCommandLanguageState.Complete]: "このコマンドはあなたの言語で利用可能です。",
        [BotCommandLanguageState.IncompleteMachineTranslation]: "このコマンドの一部は、機械翻訳によってローカライズされる場合があります。",
        [BotCommandLanguageState.Incomplete]: "このコマンドは、あなたの言語へのローカライズが不完全です。",
        [BotCommandLanguageState.Missing]: "このコマンドはあなたの言語にローカライズされていません。"
    },
    // TODO: Google Translate
    [Language.zh]: {
        [BotCommandLanguageState.Complete]: "此命令支持您的语言。",
        [BotCommandLanguageState.IncompleteMachineTranslation]: "此命令的部分内容可能通过机器翻译进行本地化。",
        [BotCommandLanguageState.Incomplete]: "此命令对您的语言尚不完全支持。",
        [BotCommandLanguageState.Missing]: "此命令尚未本地化为您的语言。"
    },
}

export const botCommandPrivilegeRejectionStates: Record<Language, string> = {
    [Language.en]: "You do not have permission to execute this command.",
    // TODO: Google Translate
    [Language.ja]: "このコマンドを実行する権限がありません。",
    // TODO: Google Translate
    [Language.zh]: "您没有执行此命令的权限。"
}

export const botCommandGenericIssueStates: Record<Language, string> = {
    [Language.en]: "An issue has occurred.",
    // TODO: Google Translate
    [Language.ja]: "問題が発生しました。",
    // TODO: Google Translate
    [Language.zh]: "出现问题。"
}

export function getAppropriateString(language: Locale, strings: Partial<Record<Language, string>>) {
    switch (language) {
        case "en-US":
        case "en-GB":
            if (strings[Language.en])
                return strings[Language.en]
            break;
        case "ja":
            if (strings[Language.ja])
                return strings[Language.ja]
            break;
        case "zh-CN":
        case "zh-TW":
            if (strings[Language.zh])
                return strings[Language.zh]
            break;
    }
    return strings[
        (((Object.keys(strings) as string[])
            .map(k => parseInt(k))
            .filter(k => !isNaN(k)) ?? [Language.en]) as Language[]
        )[0]
    ] ?? ":exclamation:";
}

export function tweakStringForCommand(text: string) {
    return text.split(" ").join("-").toLowerCase()
}
export function tweakLanguagesForCommand(strings: Partial<Record<Language, string>>): Partial<Record<Language, string>> {
    return Object.fromEntries(
        Object.entries(strings).map((k: any[]) => {
            k[0] = parseInt(k[0] as unknown as string);
            k[1] = tweakStringForCommand(k[1] as unknown as string)
            return k;
        }).filter(k => !isNaN(k[0] as unknown as number))
    )
}

export function getLanguageStatesAsDiscordLocales(states: Record<Language, BotCommandLanguageState>, prefix?: Record<Language, string>) {
    return getBotLocaleAsDiscordLocale( 
        Object.fromEntries(
            Object.entries(states).map((k: any[]) => {
                k[0] = parseInt(k[0] as unknown as string);
                return k;
            }).filter(k => !isNaN(k[0] as unknown as number))
              .map(s => [s[0], (s[1] as unknown as BotCommandLanguageState) != BotCommandLanguageState.Complete ? `${
                (prefix ? prefix[s[0] as unknown as Language] ?? prefix[Language.en] : "")
              } (${
                    botCommandLanguageStates
                        [s[0] as unknown as Language]
                        [s[1] as unknown as BotCommandLanguageState]
                })` : (prefix ? prefix[s[0] as unknown as Language] ?? prefix[Language.en] : "")
            ])
        ) as Record<Language, string>
    );
}

export function getBotLocaleAsDiscordLocale(locales: Partial<Record<Language, string>>): Partial<Record<Locale, string>> {
    let discordLocales: Partial<Record<Locale, string>> = {};

    for (let locale of Object.keys(locales)
        .map(k => parseInt(k)).filter(k => !isNaN(k))
    ) {
        switch (locale) {
            case Language.en:
                discordLocales["en-US"] = locales[locale];
                discordLocales["en-GB"] = locales[locale]; break;
            case Language.ja:
                discordLocales["ja"] = locales[locale]; break;
            // NOTE: I am aware they are distinct, but I don't think we have the resources to handle both.
            //       (should we default to English for Taiwan...? Would that be better?)
            case Language.zh:
                discordLocales["zh-CN"] = locales[locale];
                discordLocales["zh-TW"] = locales[locale]; break;
            default: break;
        }
    }

    return discordLocales;
}
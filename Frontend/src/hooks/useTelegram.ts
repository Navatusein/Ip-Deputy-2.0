// @ts-ignore
const telegram = window.Telegram.WebApp;

export function useTelegram() {
    return {
        telegram,
        theme: telegram.themeParams,
        telegramUser: telegram.initDataUnsafe?.user,
        telegramQueryId: telegram.initDataUnsafe?.query_id,
    }
}
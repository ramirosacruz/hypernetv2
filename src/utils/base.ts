import axios from "axios"

export const sendTGMessage = (msgResult) => {
    const token = process.env.TELEGRAM_BOT_TOKEN

    const tz = 'America/Argentina/Buenos_Aires'
    const d = new Date()
    return axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {}, {
        params: {
            'chat_id': process.env.TELEGRAM_CHAT_ID,
            'text': msgResult
        }
    })

}
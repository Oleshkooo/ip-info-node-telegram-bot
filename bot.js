// requirements
import dotenv from 'dotenv'
import { Telegraf } from 'Telegraf'
import axios from 'axios'

dotenv.config()
const TOKEN = process.env.TOKEN
const bot = new Telegraf(TOKEN)



// start
bot.start(async tg => {
    await tg.replyWithHTML(`<strong>Hello, ${tg.message.from.first_name}👋🏼</strong>`)
    await tg.reply('You can get information from IP-adress here')
    await tg.reply('Just send me the IP to start')
    await tg.replyWithHTML('If you don`t know how to get an IP, press <strong>/help</strong>')
})



// help
bot.command('help', async tg => {
    await tg.reply('Send me the IP-adress to start')
    await tg.reply('How to get IP-adress?')
    await tg.replyWithHTML('<a href="https://iplogger.org/invisible/"><strong>Click here</strong></a> and follow my steps', {disable_web_page_preview: true})
    await tg.reply('Firstly, you have to generate your IPLogger')
    await tg.replyWithPhoto({source: './static/img1.png'})
    await tg.reply('Just click the blue button here')
    await tg.reply('Then you can customize your link or send it to the victim, the choice is yours')
    await tg.replyWithPhoto({source: './static/img2.png'})
    await tg.reply('After someone clicks on your link, an IP address will appear in the Logged IP`s tab')
    await tg.replyWithPhoto({source: './static/img3.png'})
    await tg.reply('Send me that IP-adress and I`ll give you more information')
})



// on text
bot.on('text', async tg => {
    try {
        let message = tg.message.text
        let response = await axios.get(`http://ip-api.com/json/${message}?fields=status,message,continent,country,regionName,city,district,zip,lat,lon,timezone,offset,mobile,proxy,hosting,query`)
        let info = response.data

        if (info.status === 'fail')
            return tg.reply(`Fail, ${info.message}`)

        // information
        tg.replyWithHTML(`
<strong>Location:</strong> ${info.continent}, ${info.country}, ${info.city}, ${info.regionName}${info.district ? ',' : ''} ${info.district}\n
<strong>Zip-code:</strong> ${info.zip}\n
<strong>Latitude:</strong> ${info.lat}\n
<strong>Longitute:</strong> ${info.lon}\n
<strong>Timezone:</strong> ${info.timezone}, ${+info.offset/3600 >= 0 ? '+' : '-'}${+info.offset/3600}\n
<strong>Mobile connection:</strong> ${info.mobile ? 'Yes' : 'No'}\n
<strong>Proxy:</strong> ${info.proxy ? 'Yes' : 'No'}\n
<strong>Hosting:</strong> ${info.hosting ? 'Yes' : 'No'}\n
        `)

        // google maps
        tg.replyWithHTML(`<a href="https://www.google.com/maps/search/${info.lat},${info.lon}"><strong>View location on Google Maps</strong></a>`, {disable_web_page_preview: true})
    }
    catch (e) {
        console.error(e)
        return tg.reply('An error occurred, please try again later...')
    }
})



// check ip
// const checkIp = (ip) => {
//     ip = ip.split('.')

//     if (ip.length !== 4) return false

//     for (let e of ip)
//         if (!e || isNaN(e) || +e < 0 || +e > 255) return false

//     return true
// }



// launch
bot.launch()
console.log('[BOT] Bot launched\n')
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
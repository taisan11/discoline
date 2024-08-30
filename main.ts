import "@std/dotenv/load";
import { createBot, Intents } from '@discordeno/bot'
import {lineNotify} from "./linenotify.ts"

const bot = createBot({
  token: Deno.env.get("DISCOED_TOKEN")!,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent, // Or other intents that you might needs.
  events: {
    ready: data => {
      console.log(`The shard ${data.shardId} is ready!`)
    },
  },
})

// You can add events after the createBot call if you prefer
bot.transformers.desiredProperties.message.guildId = true
bot.transformers.desiredProperties.message.channelId = true
bot.transformers.desiredProperties.message.content = true

bot.events.messageCreate = message => {
  console.log("messageCreate")
  if (!(message.guildId == BigInt(Deno.env.get("DISCORD_GUILD")!))) {
    return
  }
  if (!(message.channelId === BigInt(Deno.env.get("DISCORD_CHANNEL")!))) {
    return
  }
  console.log("送信!!")
  console.log(message.content)
  lineNotify({message: message.content, token: Deno.env.get("LINE_Notification_Token")!})
}

await bot.start()

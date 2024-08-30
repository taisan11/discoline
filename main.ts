import "@std/dotenv/load";
import { createBot, Intents } from '@discordeno/bot'
import {lineNotify} from "./linenotify.ts"

const bot = createBot({
  token: Deno.env.get("DISCOED_TOKEN")!,
  intents: Intents.Guilds | Intents.GuildMessages, // Or other intents that you might needs.
  events: {
    ready: data => {
      console.log(`The shard ${data.shardId} is ready!`)
    },
  },
})

// You can add events after the createBot call if you prefer

bot.events.messageCreate = message => {
  if (!(message.guildId == BigInt(Deno.env.get("DISCORD_GUILD")!))) {
    return
  }
  if (!(message.channelId === BigInt(Deno.env.get("DISCORD_CHANNEL")!))) {
    return
  }
  lineNotify({message: message.content, token: Deno.env.get("LINE_NOTIFY")!})
}

await bot.start()

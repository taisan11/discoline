import {
  MessageAPIResponseBase,
  WebhookEvent,
} from "@line/bot-sdk";
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
  if (message.author.id === bot.id) {
    return
  }
  console.log(message.content)
  lineNotify({message: message.content, token: Deno.env.get("LINE_Notification_Token")!})
}

import {Hono} from "hono"

const app = new Hono()

app.post("/api/webhook", async (c) => {
  const data = await c.req.json();
  const events: WebhookEvent[] = (data as any).events;

  await Promise.all(
    events.map(async (event: WebhookEvent) => {
      try {
        await textEventHandler(event);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err);
        }
        return c.json({
          status: "error",
        });
      }
    })
  );
  return c.json({ message: "ok" });
})

const textEventHandler = async (
  event: WebhookEvent,
): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== "message" || event.message.type !== "text" || event.source.type !== "user") {
    return;
  }
  await bot.helpers.sendMessage(BigInt(Deno.env.get("DISCORD_CHANNEL")!), { content: event.message.text })
};

Deno.serve(app.fetch)

await bot.start()

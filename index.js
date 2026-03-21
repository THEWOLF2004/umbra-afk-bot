const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const AFK_CHANNEL_ID = process.env.AFK_CHANNEL_ID;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;

client.on('voiceStateUpdate', (oldState, newState) => {
  if (newState.channelId === AFK_CHANNEL_ID && oldState.channelId !== AFK_CHANNEL_ID) {
    const logChannel = newState.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (logChannel) {
      logChannel.send(`☣ SIGNAL LOST — Subject ${newState.member.user.username} presumed deceased. Transferred to AFK.`);
    }
  }
});

client.login(process.env.TOKEN);

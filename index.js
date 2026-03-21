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
      const { EmbedBuilder } = require('discord.js');

// messaggi sistema
const messages = [
  "SIGNAL LOST",
  "NO VITAL SIGNS DETECTED",
  "INFECTION DETECTED",
  "SUBJECT TERMINATED",
  "CRITICAL STATUS",
  "CONNECTION LOST"
];

// glitch effect
function glitchText(text) {
  return text.split('').map(char => {
    return Math.random() < 0.2 ? char + "̷" : char;
  }).join('');
}

// colori random
const colors = [0xff0000, 0xff6600, 0x9900ff];

// random
const randomMessage = messages[Math.floor(Math.random() * messages.length)];
const randomColor = colors[Math.floor(Math.random() * colors.length)];
const glitched = glitchText(randomMessage);

// embed
const embed = new EmbedBuilder()
  .setColor(randomColor)
  .setTitle('☣ UMBRELLA AI SYSTEM')
  .setDescription(`**${glitched}**\n\nSubject: ${newState.member.user.username}\nStatus: DECEASED\nLocation: AFK ZONE`)
  .setFooter({ text: 'Biohazard Sanctum Core' })
  .setTimestamp();

logChannel.send({ embeds: [embed] });
    }
  }
});

client.login(process.env.TOKEN);

const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
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

const VERIFY_CHANNEL_ID = process.env.VERIFY_CHANNEL_ID;
const UNVERIFIED_ROLE = process.env.UNVERIFIED_ROLE;
const VERIFIED_ROLE = process.env.VERIFIED_ROLE;

client.on('messageReactionAdd', async (reaction, user) => {
  console.log("EMOJI:", reaction.emoji.name); // 👈 QUI

  if (user.bot) return;

  if (reaction.message.channel.id === VERIFY_CHANNEL_ID) {
    if (reaction.emoji.name.includes('☣')) {
      const member = await reaction.message.guild.members.fetch(user.id);

      if (member) {
        await member.roles.remove(UNVERIFIED_ROLE);
        await member.roles.add(VERIFIED_ROLE);
      }
    }
  }
});
client.on('guildMemberAdd', async (member) => {
    const role = member.guild.roles.cache.get(process.env.UNVERIFIED_ROLE);

    if (role) {
        await member.roles.add(role);
        console.log(`Utente ${member.user.username} aggiunto come Unverified`);
    } else {
        console.log("Ruolo Unverified non trovato");
    }
});
client.login(process.env.TOKEN);

const { PermissionFlagsBits } = require("discord.js");
const client = global.client;

module.exports = {
  name: "lock",
  usage: "lock",
  category: "moderasyon",
  aliases: ["kilit", "kanalkilit"],
  execute: async (client, message, args, beş_embed) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Kanalı kilitlemek için yetkin yok!**")] }).sil(5);
    }

    const everyoneRole = message.guild.roles.cache.find(r => r.name === "@everyone");
    if (!everyoneRole) {
      return message.reply({ embeds: [beş_embed.setDescription("> **@everyone rolü bulunamadı!**")] }).sil(5);
    }

    if (!message.channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.SendMessages)) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Kanal zaten kilitli!**")] }).sil(5);
    }

    await message.channel.permissionOverwrites.edit(everyoneRole.id, {
      SendMessages: false,
    });

    message.reply({ embeds: [beş_embed.setDescription(`> **Kanal başarıyla kilitlendi! 🔒**`)] });
  },
};

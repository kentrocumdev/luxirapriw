const { PermissionFlagsBits } = require("discord.js");
const client = global.client;

module.exports = {
  name: "lock",
  usage: "lock [#kanal]",
  category: "moderasyon",
  aliases: ["kilit", "kanalkilit"],
  execute: async (client, message, args, beş_embed) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [beş_embed.setDescription("> > **Kanalları kitlemek için `Kanalları Yönet` yetkisi gerek!**")] }).sil(5);
    }

    const kanal = message.mentions.channels.first() || message.channel;
    const everyoneRole = message.guild.roles.cache.find(r => r.name === "@everyone");

    if (!everyoneRole) {
      return message.reply({ embeds: [beş_embed.setDescription("> **@everyone rolü bulunamadı!**")] }).sil(5);
    }

    if (!kanal.permissionsFor(everyoneRole).has(PermissionFlagsBits.SendMessages)) {
      return message.reply({ embeds: [beş_embed.setDescription(`> **${kanal} zaten kilitli!**`)] }).sil(5);
    }

    await kanal.permissionOverwrites.edit(everyoneRole.id, {
      SendMessages: false,
    });

    message.reply({ embeds: [beş_embed.setDescription(`> **${kanal} başarıyla kilitlendi! 🔒**`)] });
  },
};

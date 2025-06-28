const { PermissionFlagsBits } = require("discord.js");
const client = global.client;

module.exports = {
  name: "unlock",
  usage: "unlock [#kanal]",
  category: "moderasyon",
  aliases: ["kilitaç", "kanalkilitaç"],
  execute: async (client, message, args, beş_embed) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Kiliti açmak için `Kanalları Yönet` yetkisi gerek!**")] });
    }

    const kanal = message.mentions.channels.first() || message.channel;
    const everyoneRole = message.guild.roles.cache.find(r => r.name === "@everyone");

    if (!everyoneRole) {
      return message.reply({ embeds: [beş_embed.setDescription("> **@everyone rolü bulunamadı!**")] });
    }

    if (kanal.permissionsFor(everyoneRole).has(PermissionFlagsBits.SendMessages)) {
      return message.reply({ embeds: [beş_embed.setDescription(`> **${kanal} zaten açık!**`)] });
    }

    await kanal.permissionOverwrites.edit(everyoneRole.id, {
      SendMessages: true,
    });

    message.reply({ embeds: [beş_embed.setDescription(`> **${kanal} kilidi başarıyla açıldı! 🔓**`)] });
  },
};

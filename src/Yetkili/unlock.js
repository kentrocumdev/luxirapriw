const { PermissionFlagsBits } = require("discord.js");
const client = global.client;

module.exports = {
  name: "unlock",
  usage: "unlock",
  category: "moderasyon",
  aliases: ["kilitaç", "kanalkilitaç"],
  execute: async (client, message, args, beş_embed) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Kilit açmak için yetkin yok!**")] }).sil(5);
    }

    const everyoneRole = message.guild.roles.cache.find(r => r.name === "@everyone");
    if (!everyoneRole) {
      return message.reply({ embeds: [beş_embed.setDescription("> **@everyone rolü bulunamadı!**")] }).sil(5);
    }

    if (message.channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.SendMessages)) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Kanal zaten kilitli değil!**")] }).sil(5);
    }

    await message.channel.permissionOverwrites.edit(everyoneRole.id, {
      SendMessages: true,
    });

    message.reply({ embeds: [beş_embed.setDescription(`> **Kanal kilidi başarıyla açıldı! 🔓**`)] });
  },
};

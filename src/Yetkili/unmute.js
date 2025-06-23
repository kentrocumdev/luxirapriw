const { PermissionFlagsBits } = require("discord.js");
const client = global.client;

module.exports = {
  name: "unmute",
  usage: "unmute [@user / ID]",
  category: "moderasyon",
  aliases: ["unmute", "unsustur"],
  execute: async (client, message, args, beş_embed) => {
    // Yetki kontrolü: Zaman aşımı kaldırma yetkisi (ModerateMembers)
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Unmute yapmak için yetkin yok!**")] });
    }

    // Hedef kullanıcı (reply varsa oradan, yoksa mention veya ID)
    let member;
    if (message.reference) {
      const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
      member = message.guild.members.cache.get(repliedMessage.author.id);
    } else {
      member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    }

    if (!member) 
      return message.reply({ embeds: [beş_embed.setDescription("> **Unmute yapmak için geçerli kullanıcı belirt!**")] });

    try {
      await member.timeout(null, "Unmute işlemi");
      message.reply({ embeds: [beş_embed.setDescription(`> **${member.user.tag} kullanıcısının mutesi kaldırıldı!**`)] });
    } catch (error) {
      message.reply({ embeds: [beş_embed.setDescription("> **Unmute işlemi başarısız oldu!**")] });
    }
  }
};

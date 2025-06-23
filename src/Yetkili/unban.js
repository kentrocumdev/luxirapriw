const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "unban",
  usage: "unban <ID>",
  category: "moderasyon",
  aliases: ["yasaklamakaldır", "yasaklamakaldırma", "unban"],
  execute: async (client, message, args, beş_embed) => {
    if (
      !message.member.permissions.has(PermissionFlagsBits.BanMembers) &&
      !message.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Unban yetkin yok!**")] });
    }

    const userId = args[0];
    if (!userId) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Lütfen unban yapılacak kullanıcı ID'sini belirt!**")] });
    }

    try {
      // Kullanıcının banlı olup olmadığını kontrol et
      const banList = await message.guild.bans.fetch();
      const bannedUser = banList.get(userId);
      if (!bannedUser) {
        return message.reply({ embeds: [beş_embed.setDescription("> **Bu ID'ye sahip kullanıcı banlı değil!**")] });
      }

      // Ban kaldır
      await message.guild.bans.remove(userId);
      return message.reply({
        embeds: [beş_embed.setDescription(`> **${bannedUser.user.tag} kullanıcısının banı kaldırıldı!**`)],
      });
    } catch (err) {
      console.error(err);
      return message.reply({ embeds: [beş_embed.setDescription("> **Ban kaldırma sırasında bir hata oluştu!**")] });
    }
  },
};

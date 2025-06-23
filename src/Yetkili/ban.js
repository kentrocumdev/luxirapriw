const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "ban",
  usage: "ban [@user / ID / reply] <sebep>",
  category: "moderasyon",
  aliases: ["bans", "yasakla", "yasaklama"],
  execute: async (client, message, args, beş_embed) => {
    if (
      !message.member.permissions.has(PermissionFlagsBits.BanMembers) &&
      !message.member.permissions.has(PermissionFlagsBits.Administrator)
    ) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Ban yetkin yok!**")] });
    }

    // Banlanacak kullanıcıyı belirleme sırası:
    // 1. Eğer komut mesajına reply yapılmışsa, reply edilen kullanıcıyı al
    // 2. Yoksa mention edilen kullanıcı
    // 3. Yoksa args[0] ID olarak al
    let member;
    if (message.reference) {
      try {
        const repliedMsg = await message.channel.messages.fetch(message.reference.messageId);
        member = repliedMsg.member || (await message.guild.members.fetch(repliedMsg.author.id));
      } catch {
        return message.reply({ embeds: [beş_embed.setDescription("> **Reply yapılan mesaj bulunamadı!**")] });
      }
    } else {
      member = message.mentions.members.first() || (args[0] ? await message.guild.members.fetch(args[0]).catch(() => null) : null);
    }

    if (!member) return message.reply({ embeds: [beş_embed.setDescription("> **Geçerli bir kullanıcı belirt!**")] });

    if (member.id === message.author.id)
      return message.reply({ embeds: [beş_embed.setDescription("> **Kendini banlayamazsın!**")] });

    if (member.user.bot)
      return message.reply({ embeds: [beş_embed.setDescription("> **Botları banlayamazsın!**")] });

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply({
        embeds: [beş_embed.setDescription("> **Kendinle aynı veya üst roldeki kişiye işlem yapamazsın!**")],
      });

    // Sebep yoksa "Sebep belirtilmedi" olarak ayarla
    let reason = args.slice(message.reference ? 0 : 1).join(" ") || "Sebep belirtilmedi";

    if (!member.bannable)
      return message.reply({ embeds: [beş_embed.setDescription("> **Bu kullanıcıyı banlamaya yetkim yetmiyor!**")] });

    try {
      await member.send(`> **${message.guild.name} sunucusundan, "${reason}" sebebiyle banlandın.**`).catch(() => {});
      await member.ban({ reason });
      return message.reply({
        embeds: [beş_embed.setDescription(`> **${member.user.tag} başarıyla banlandı! Sebep: ${reason}**`)],
      });
    } catch (err) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Ban işlemi sırasında bir hata oluştu!**")] });
    }
  },
};

const { PermissionFlagsBits } = require("discord.js");
const ms = require("ms");
const client = global.client;

module.exports = {
  name: "mute",
  usage: "mute [@user / ID] <süre> <sebep>",
  category: "moderasyon",
  aliases: ["mute", "chatmute", "sustur"],
  execute: async (client, message, args, beş_embed) => {
    // Yetki kontrolü: Zaman aşımı uygulama yetkisi (ModerateMembers)
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Mute atmak için yeterli yetkin yok!**")] });
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
      return message.reply({ embeds: [beş_embed.setDescription("> **Mute atmak için geçerli bir kullanıcı belirt!**")] });

    if (member.user.bot)
      return message.reply({ embeds: [beş_embed.setDescription("> **Botlara mute atamazsın!**")] });

    if (member.id === message.author.id)
      return message.reply({ embeds: [beş_embed.setDescription("> **Kendini muteleyemezsin!**")] });

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply({ embeds: [beş_embed.setDescription("> **Kendinden üst veya aynı pozisyondaki kişiye mute atamazsın!**")] });

    // Süre kontrolü
    const time = args[1];
    if (!time || !["s", "m", "h", "d", "w"].some(t => time.includes(t))) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Geçerli bir süre belirt! Örnek: 10m, 2h**")] });
    }

    // Sebep kontrolü
    const reason = args.slice(2).join(" ");
    if (!reason) {
      return message.reply({ embeds: [beş_embed.setDescription("> **Mute sebebi belirt!**")] });
    }

    // Zaman aşımı uygulama (Discord API üzerinden)
    try {
      await member.timeout(ms(time), reason);
      message.reply({ embeds: [beş_embed.setDescription(`> **${member.user.tag} kullanıcısı ${time} boyunca mutelendi! Sebep:** ${reason}`)] });
    } catch (error) {
      message.reply({ embeds: [beş_embed.setDescription("> **Mute işlemi başarısız oldu!**")] });
    }
  }
};

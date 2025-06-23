const {
  PermissionFlagsBits,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  Events,
  EmbedBuilder
} = require("discord.js");
const beş_config = require("../../config.json");

module.exports = {
  name: "cihaz",
  usage: "cihaz [@Kullanıcı / ID]",
  category: "genel",
  aliases: ["chz", "durum", "client"],
  execute: async (client, message, args, beş_embed) => {
    beş_embed.setColor("#2f3136");

    let user = message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    if (!user)
      return message.reply({
        embeds: [beş_embed.setDescription("> Geçerli bir kullanıcı belirt!")]
      }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));

    if (!user.presence)
      return message.reply({
        embeds: [beş_embed.setDescription("> Belirtilen kullanıcı **çevrimdışı** olduğu için cihaz bilgisi alınamıyor!")]
      }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));

    let cihazlar = Object.keys(user.presence.clientStatus);

    let cihazTuru = {
      desktop: "<:macbook:1386492023393091646> Bilgisayar / Uygulama",
      mobile: "<:phone:1386492339542954115> Mobil / Uygulama",
      web: "🌐 Web Tarayıcı / İnternet"
    };

    let durumTuru = {
      online: "<:luxiraaktif:1386476988218347651> Çevrimiçi",
      dnd: "<:luxiradnd:1386477019168116906> Rahatsız Etme",
      idle: "<:luxirabosta:1386477008556654775> Boşta",
      offline: "<:luxiaoffline:1386476962062794874> Çevrimdışı"
    };

    message.reply({
      embeds: [
        beş_embed
          .setDescription(
            "> " + user.toString() + " kullanıcısının aktif cihaz bilgileri:\n\n" +
            "**Durum:** \n" + (durumTuru[user.presence.status] || "Bilinmiyor") + "\n\n" +
            "**Cihazlar:**\n" + cihazlar.map(x => "- " + (cihazTuru[x] || x)).join("\n")
          )
          .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
      ]
    });
  }
};

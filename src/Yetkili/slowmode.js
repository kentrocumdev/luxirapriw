const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const config = require("../../config.json"); // config yolunu projene göre ayarla

module.exports = {
  name: "slowmode",
  description: "Kanal için yavaş mod süresi ayarlar.",
  usage: ".slowmode <saniye>",
  category: "moderasyon",
  aliases: ["yavaşmod", "slow", "slow-mode"],

  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("⛔ Yetki Hatası")
        .setDescription("Bu komutu kullanmak için **Kanalları Yönet** yetkisine sahip olmalısın.")
        .setFooter({ text: config.footer });

      return message.reply({ embeds: [embed] });
    }

    const süre = parseInt(args[0]);
    if (isNaN(süre) || süre < 0 || süre > 21600) {
      const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("⚠️ Geçersiz Süre")
        .setDescription("Lütfen **0 ile 21600** saniye (6 saat) arasında geçerli bir sayı gir.")
        .setFooter({ text: config.footer });

      return message.reply({ embeds: [embed] });
    }

    try {
      await message.channel.setRateLimitPerUser(süre);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("✅ Yavaş Mod Ayarlandı")
        .setDescription(`Kanal için yavaş mod süresi ${süre === 0 ? "**kapatıldı**" : `**${süre} saniye** olarak ayarlandı.`}`)
        .setFooter({ text: config.footer });

      message.reply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Hata")
        .setDescription("Bir hata oluştu, lütfen tekrar dene.")
        .setFooter({ text: config.footer });

      message.reply({ embeds: [embed] });
    }
  }
};

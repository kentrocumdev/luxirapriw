const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
const moment = require("moment");
const mongoose = require("mongoose");
require("moment/locale/tr");
moment.locale("tr");

// Mongo modeli
const JoinModel = mongoose.model("joinLogs", new mongoose.Schema({
  userId: String,
  guildId: String,
  joinedAt: Date
}));

module.exports = {
  name: "sb",
  description: "Sunucu bilgilerini detaylı şekilde gösterir.",
  category: "genel",
  aliases: ["sunucubilgi", "serverinfo"],

  execute: async (client, message) => {
    const guild = message.guild;

    // Join sayılarını çek
    const katılımVerisi = async (gün) => {
      const tarih = new Date(Date.now() - gün * 24 * 60 * 60 * 1000);
      return await JoinModel.countDocuments({
        guildId: guild.id,
        joinedAt: { $gte: tarih }
      });
    };

    const [
      son1,
      son7,
      son14,
      son30,
      son90,
      son150
    ] = await Promise.all([
      katılımVerisi(1),
      katılımVerisi(7),
      katılımVerisi(14),
      katılımVerisi(30),
      katılımVerisi(90),
      katılımVerisi(150)
    ]);

    const channels = guild.channels.cache;
    const kanalSayısı = {
      toplam: channels.size,
      yazı: channels.filter(c => c.type === 0).size,
      ses: channels.filter(c => c.type === 2).size,
      kategori: channels.filter(c => c.type === 4).size,
      haber: channels.filter(c => c.type === 5).size
    };

    const roller = guild.roles.cache.filter(r => r.name !== "@everyone").size;
    const emojiler = guild.emojis.cache;
    const animatedEmoji = emojiler.filter(e => e.animated).size;
    const staticEmoji = emojiler.size - animatedEmoji;

    const üyeler = await guild.members.fetch();
    const botlar = üyeler.filter(m => m.user.bot).size;
    const insanlar = üyeler.size - botlar;

    const durumlar = {
      online: üyeler.filter(m => m.presence?.status === "online").size,
      idle: üyeler.filter(m => m.presence?.status === "idle").size,
      dnd: üyeler.filter(m => m.presence?.status === "dnd").size,
      offline: üyeler.filter(m => !m.presence || m.presence.status === "offline").size,
    };
    const toplamOnline = durumlar.online + durumlar.idle + durumlar.dnd;
    const sesdeki = üyeler.filter(m => m.voice.channel).size;

    // Banlı sayısı
    const bans = await guild.bans.fetch();
    const banSayısı = bans.size;

    // Timeout’lu kullanıcılar
    const timeoutlular = üyeler.filter(m => m.communicationDisabledUntilTimestamp && m.communicationDisabledUntilTimestamp > Date.now()).size;

    // Jail sayısı (örnek "Jail" isimli rol varsa)
    const jailRolü = guild.roles.cache.find(r => r.name.toLowerCase() === "jail");
    const jaildeki = jailRolü ? üyeler.filter(m => m.roles.cache.has(jailRolü.id)).size : 0;

    const embed = new EmbedBuilder()
      .setColor("Blurple")
      .setTitle("🌐 LUNİRA Sunucu Bilgileri")
      .addFields(
        {
          name: "📑 Kanallar",
          value: `Toplam: **${kanalSayısı.toplam}**\n📝 Yazı: **${kanalSayısı.yazı}** | 🔊 Ses: **${kanalSayısı.ses}** | 📂 Kategori: **${kanalSayısı.kategori}** | 📰 Haber: **${kanalSayısı.haber}**`,
        },
        {
          name: "👑 Sunucu Sahibi",
          value: `<@${guild.ownerId}>`,
        },
        {
          name: "🏷 Takma Adlı Üye Sayısı",
          value: `**${üyeler.filter(m => m.nickname).size}**`
        },
        {
          name: "📆 Sunucu Kuruluş",
          value: moment(guild.createdAt).format("D MMMM YYYY HH:mm"),
        },
        {
          name: "🚫 Yasaklı & Susturulmuş",
          value: `⛔ Ban: **${banSayısı}** | ⏱️ Timeout: **${timeoutlular}** | 🔐 Jail: **${jaildeki}**`,
        },
        {
          name: "🌐 Shard Bilgisi",
          value: `🟢 Aktif: **${toplamOnline}** (Ping: **${client.ws.ping}ms**)`,
        },
        {
          name: "🚀 Boost Bilgisi",
          value: `Seviye: **${guild.premiumTier}** | 🎁 Boost: **${guild.premiumSubscriptionCount}**`,
        },
        {
          name: "🔊 Sesteki Üye",
          value: `🎧 **${sesdeki}**`,
        },
        {
          name: "🧱 Roller",
          value: `Toplam: **${roller}**`,
        },
        {
          name: "😄 Emojiler",
          value: `Toplam: **${emojiler.size}** | Statik: **${staticEmoji}** | Animasyonlu: **${animatedEmoji}**`,
        },
        {
          name: "👥 Üyeler",
          value:
            `🟢 Online: **${durumlar.online}** | 🌙 Boşta: **${durumlar.idle}** | ⛔ Rahatsız: **${durumlar.dnd}**\n🔘 Aktif: **${toplamOnline}** | ⚪ Offline: **${durumlar.offline}** | 🤖 Bot: **${botlar}**`,
        },
        {
          name: "📦 Katılım İstatistikleri",
          value:
            `📦 150 Gün: **${son150}** kişi\n📦 90 Gün: **${son90}** kişi\n📦 30 Gün: **${son30}** kişi\n📦 14 Gün: **${son14}** kişi\n📦 7 Gün: **${son7}** kişi\n📦 1 Gün: **${son1}** kişi`,
        },
        {
          name: "🔍 Sorgulayan",
          value: `${message.member}`,
        }
      )
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setFooter({ text: config.footer });

    message.reply({ embeds: [embed] });
  },
};

const {
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  name: "say",
  usage: "say",
  category: "moderasyon",
  aliases: ["sayy", "says", "bilgi"],
  execute: async (client, message, args, beş_embed) => {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply({
        embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)]
      }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
    }

    const getEmbed = () => {
      const aktif = message.guild.members.cache.filter(m => m.presence && m.presence.status !== "offline").size;
      const uye = message.guild.memberCount;
      const bot = message.guild.channels.cache
        .filter(c => c.type === ChannelType.GuildVoice)
        .map(c => c.members.filter(m => m.user.bot).size)
        .reduce((a, b) => a + b, 0);
      const sesli = message.guild.members.cache.filter(x => !x.user.bot && x.voice.channel).size;
      const boost = message.guild.premiumSubscriptionCount;

      return beş_embed
        .setTitle("İstatistik")
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(
          `> **Toplam Üye:** ${uye}\n` +
          `> **Aktif Üye:** ${aktif}\n` +
          `> **Seste Üye:** ${sesli} \`(+${bot} Bot)\`\n` +
          `> **Boost Sayısı:** ${boost}`
        );
    };

    const getDetayEmbed = () => {
      const members = message.guild.members.cache;

      const uye = message.guild.memberCount;
      const botlar = members.filter(m => m.user.bot).size;
      const insanlar = uye - botlar;

      const aktif = members.filter(m => m.presence && m.presence.status === "online").size;
      const rahatsiz = members.filter(m => m.presence && m.presence.status === "dnd").size;
      const bosta = members.filter(m => m.presence && m.presence.status === "idle").size;
      const offline = members.filter(m => !m.presence || m.presence.status === "offline").size;

      const sesli = members.filter(m => !m.user.bot && m.voice.channel).size;
      const boost = message.guild.premiumSubscriptionCount;
      const kanalSayisi = message.guild.channels.cache.size;
      const kategori = message.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;

      return new EmbedBuilder()
        .setTitle("📊 Detaylı Sunucu İstatistikleri")
        .setColor("Blurple")
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .addFields(
          { name: "<:luxiruye:1386477037576912976> Toplam Üye", value: `${uye}`, inline: true },
          { name: "<:luxirabot:1386477136138997934> Bot Sayısı", value: `${botlar}`, inline: true },
          { name: "<:luxiramember:1386476998456508527> İnsan Sayısı", value: `${insanlar}`, inline: true },
          { name: "<:luxiraaktif:1386476988218347651> Çevrimiçi", value: `${aktif}`, inline: true },
          { name: "<:luxiradnd:1386477019168116906> Rahatsız Etmeyin", value: `${rahatsiz}`, inline: true },
          { name: "<:luxirabosta:1386477008556654775> Boşta", value: `${bosta}`, inline: true },
          { name: "<:luxiaoffline:1386476962062794874>Çevrimdışı", value: `${offline}`, inline: true },
          { name: "<:luxiravoice:1386477168955232286> Seste Üye", value: `${sesli}`, inline: true },
          { name: "<:luxirabooster:1386476976537337956> Boost", value: `${boost}`, inline: true },
          { name: "<:luxirakanal:1386477093168087151> Kanal Sayısı", value: `${kanalSayisi}`, inline: true },
          { name: "<:luxiracategory:1386477154648461414> Kategori Sayısı", value: `${kategori}`, inline: true }
        )
        .setFooter({
          text: `${message.guild.name} | ${message.guild.id}`,
          iconURL: message.guild.iconURL({ dynamic: true })
        });
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("yenile_say")
        .setLabel("Yenile")
        .setEmoji("♻️")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("detay_say")
        .setLabel("Detaylı")
        .setEmoji("📊")
        .setStyle(ButtonStyle.Primary)
    );

    const msg = await message.reply({
      embeds: [getEmbed()],
      components: [row]
    });

    const collector = msg.createMessageComponentCollector({
      filter: i => ["yenile_say", "detay_say"].includes(i.customId) && i.user.id === message.author.id,
      time: 45_000
    });

    collector.on("collect", async interaction => {
      await interaction.deferUpdate();
      if (interaction.customId === "yenile_say") {
        await interaction.editReply({ embeds: [getEmbed()], components: [row] });
      } else if (interaction.customId === "detay_say") {
        await interaction.followUp({ embeds: [getDetayEmbed()], ephemeral: true });
      }
    });

    collector.on("end", async () => {
      row.components.forEach(b => b.setDisabled(true));
      await msg.edit({ components: [row] }).catch(() => {});
    });
  }
};

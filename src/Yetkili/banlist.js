const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionsBitField
} = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: "banlist",
  description: "Sunucudaki banlı üyeleri detaylı ve sayfalı şekilde listeler.",
  aliases: ["banlar", "bans"],

  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').Message} message
   * @param {Array<string>} args
   */
  async execute(client, message, args) {
    // 1. Yetki kontrolü: Ban yapma yetkisi yoksa iptal et
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply({
        content: "❌ Bu komutu kullanmak için `Üyeleri Yasakla` yetkisine sahip olmalısın!"
      });
    }

    try {
      // 2. Ban listesini çekiyoruz
      const bans = await message.guild.bans.fetch();

      // 3. Banlı yoksa bilgi ver
      if (!bans.size) {
        return message.reply("🚫 Sunucuda banlanmış üye bulunmamaktadır.");
      }

      // 4. Banlıları 10'ar 10'ar sayfalara bölüyoruz
      const pageSize = 10;
      const banList = bans.map(ban => ({
        tag: ban.user.tag,
        id: ban.user.id,
        reason: ban.reason || "Sebep yok"
      }));

      const totalPages = Math.ceil(banList.length / pageSize);
      let currentPage = 0;

      // Fonksiyon: Sayfa embed'i oluştur
      const generateEmbed = (page) => {
        const start = page * pageSize;
        const current = banList.slice(start, start + pageSize);

        // Listeyi embed'e dönüştür
        const description = current
          .map((ban, index) => `\`${start + index + 1}.\` **${ban.tag}** (ID: \`${ban.id}\`)\nSebep: *${ban.reason}*`)
          .join('\n\n');

        return new EmbedBuilder()
          .setTitle(`🚫 ${message.guild.name} Ban Listesi`)
          .setColor('Red')
          .setDescription(description)
          .setFooter({ text: `Sayfa ${page + 1} / ${totalPages} • ${config.footer || "Kentrocum Bot"}` })
          .setTimestamp();
      };

      // 5. Butonlar - başta ilk sayfadayız, geri kapalı
      const backButton = new ButtonBuilder()
        .setCustomId('back')
        .setLabel('Geri')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('◀️')
        .setDisabled(true);

      const nextButton = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('İleri')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('▶️')
        .setDisabled(totalPages === 1);

      const actionRow = new ActionRowBuilder().addComponents(backButton, nextButton);

      // 6. Mesajı gönder
      const embedMessage = await message.reply({
        embeds: [generateEmbed(currentPage)],
        components: [actionRow]
      });

      // 7. Collector: sadece komutu kullanan izinli kişi tıklayabilir, 2dk sonra biter
      const collector = embedMessage.createMessageComponentCollector({
        filter: i => i.user.id === message.author.id,
        time: 120000,
      });

      collector.on('collect', async i => {
        if (!i.isButton()) return;

        // 8. Butonlara göre sayfa değiştir
        if (i.customId === 'back') {
          if (currentPage > 0) currentPage--;
        } else if (i.customId === 'next') {
          if (currentPage < totalPages - 1) currentPage++;
        }

        // 9. Buton disable güncelle
        backButton.setDisabled(currentPage === 0);
        nextButton.setDisabled(currentPage === totalPages - 1);

        // 10. Embed güncelle
        await i.update({
          embeds: [generateEmbed(currentPage)],
          components: [actionRow]
        });
      });

      collector.on('end', async () => {
        // 11. Süre dolunca butonları devre dışı bırak
        backButton.setDisabled(true);
        nextButton.setDisabled(true);
        const disabledRow = new ActionRowBuilder().addComponents(backButton, nextButton);
        await embedMessage.edit({ components: [disabledRow] }).catch(() => { });
      });

    } catch (error) {
      // 12. Hata logu ve kullanıcıya hata mesajı
      console.error("Ban listesi hatası:", error);
      return message.reply("❌ Ban listesi alınırken bir hata oluştu!");
    }
  }
};

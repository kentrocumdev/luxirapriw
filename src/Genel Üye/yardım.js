const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  name: "y",
  description: "Yardım menüsü",

  execute: async (client, message, args) => {
    const options = [
      { label: "Genel Üye", description: "Genel üye komutları", value: "general", emoji: "👥" },
      { label: "Yetkili", description: "Yetkili komutları", value: "moderation", emoji: "🔧" },
      { label: "Owner", description: "Sadece Owner kullanabilir", value: "owner", emoji: "👑" }
    ];

    const menu = new StringSelectMenuBuilder()
      .setCustomId(`help-menu-${message.author.id}`)
      .setPlaceholder("Bir kategori seçin")
      .addOptions(options);

    const row = new ActionRowBuilder().addComponents(menu);

   const embed = new EmbedBuilder()
  .setColor("#000000") // siyah
  .setAuthor({ name: `• ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
  .setThumbnail(message.guild.iconURL({ dynamic: true })) // sunucu iconu
  .setDescription(`
Merhaba ${message.author.username} 

🗽 Yardım panelinden tüm komutları görmek için aşağıdaki menüyü kullanabilirsin.
Hangi komutları arıyorsan, uygun kategoriyi seçerek detayları görüntüleyebilirsin. 🚀

❗ **Unutma!** Yetkin olmadığı komutları kullanamazsın.
🆘 **Yardıma ihtiyacın olursa** yetkililere ulaşabilirsin.

> **Kentro 🤍**
`);



    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = message.channel.createMessageComponentCollector({
  filter: i => i.user.id === message.author.id
});


    collector.on('collect', async interaction => {
      if (!interaction.isStringSelectMenu()) return;
      if (interaction.customId !== `help-menu-${message.author.id}`) return;

      let replyEmbed = new EmbedBuilder().setColor("#000000");

      switch (interaction.values[0]) {
        case "general":
          replyEmbed
            .setTitle("Genel Üye Komutları")
            .setDescription("`.yardım` Komutları Listeler.\n`.avatar` Avatarını gösterir.\n`.banner` Bannerini gösterir.\n`.çek` Kullanıcıyı ses kanalına çeker\n`.cihaz` Hangi cihazdan girdiğini gösterir\n`.git` Kullanıcının sesine gidersin\n`.nerede` Hangi seste olduğunu gösterir\n`.ping` Bot gecikmesini gösterir\n`.ship` Ship yapar\n`.spotify` Spotify dinleneni resimli atar\n`.tweet` Tweet yazar\n`.havadurumu şehir` İstenen şehrin hava durumunu gösteririr.\n`.tts [yazı]` Yazılan yazıyı sese dönüştürür");
          break;

        case "moderation":
          replyEmbed
            .setTitle("Yetkili Komutları")
            .setDescription("`.ban` Banlar\n`.unban` Ban kaldırır\n`.mute` Süreli mute atar\n`.unmute` Mute'yi kaldırır\n`.lock` Kanal kilitler\n`.unlock` Kanal açar\n`.say` Say bilgisi gösterir\n`.sil` Mesaj siler\n`.banlist`Yasaklıları Listeler\n`.dağıt`Ses kanalını dağıtma işlemi yapar.\n`.forceban`Kalıcı Yasaklama Yapar.\n`.slowmode` Kanalın yavaş modunu ayarlar.");
          break;

        case "owner":
          replyEmbed
            .setTitle("Owner Komutları")
            .setDescription("`.emojiekle` Emoji ekler\n`.yaz` Yazı yazdırır\n`.ytsay` Yetkili sayar\n`.otorol` Sunucuya katılanlara belirlenen rolü verir\n`.pinkur`Kanallar açar ve üyelerin avatar güncellemesi hakkında bilgi verir");
          break;

        default:
          replyEmbed.setDescription("Geçersiz seçim.");
      }

      await interaction.update({ embeds: [replyEmbed], components: [row] });
    });

    collector.on('end', () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  }
};

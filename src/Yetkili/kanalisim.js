const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'yeniisim',
  description: 'Kanal ismini değiştirir. (Yönetici yetkisi gerekir)',
  usage: '.yeniisim Yeni Kanal İsmi',
  async execute(client, message, args) {
    const embed = new EmbedBuilder().setColor('Blurple');

    // Yetki kontrolü
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      embed.setDescription('❌ Bu komutu kullanmak için **Kanalı Yönet** yetkisine sahip olmalısın!');
      return message.reply({ embeds: [embed] });
    }

    // Yeni isim kontrolü
    const yeniIsim = args.join(' ');
    if (!yeniIsim) {
      embed.setDescription('⚠️ Lütfen yeni kanal ismini yaz! Örnek: `.yeniisim Sohbet Odası`');
      return message.reply({ embeds: [embed] });
    }

    try {
      await message.channel.setName(yeniIsim);
      embed
        .setColor('Green')
        .setDescription(`✅ Kanal ismi başarıyla **${yeniIsim}** olarak değiştirildi!`);
      return message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      embed
        .setColor('Red')
        .setDescription('❌ Kanal ismini değiştiremiyorum. Yetkim olmayabilir veya başka bir sorun var.');
      return message.reply({ embeds: [embed] });
    }
  }
};

const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: 'unbanall',
  description: 'Sunucudaki tüm banları kaldırır.',
  aliases: ['unbanall', 'unbanallusers'],

  async execute(client, message, args) {
    // Yetki kontrolü
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply({ content: 'Bu komutu kullanmak için yeterli yetkiniz yok!' });
    }

    try {
      const bans = await message.guild.bans.fetch();

      if (bans.size === 0) {
        return message.reply({ content: 'Sunucuda banlı kullanıcı bulunmamaktadır.' });
      }

      // Banları kaldırma işlemi
      let unbannedCount = 0;

      for (const [userId, banInfo] of bans) {
        await message.guild.members.unban(userId);
        unbannedCount++;
      }

      const embed = new EmbedBuilder()
        .setTitle('Unban All İşlemi Tamamlandı')
        .setDescription(`Başarıyla **${unbannedCount}** kullanıcının banı kaldırıldı.`)
        .setColor('Green')
        .setTimestamp();

      return message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error('UnbanAll Komut Hatası:', error);
      return message.reply({ content: 'Banları kaldırırken bir hata oluştu.' });
    }
  }
};

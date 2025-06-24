const config = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Kullanıcının avatarını gösterir.',
  
  async execute(client, message, args) {
    let user;

    // 1. Öncelik: mesaj bir yanıta yazıldıysa, yanıtlanan kişinin avatarı
    if (message.reference?.messageId) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        user = repliedMessage.author;
      } catch {
        user = null;
      }
    }

    // 2. Etiket veya ID ile kullanıcıyı al
    if (!user && args[0]) {
      user = message.mentions.users.first();
      if (!user) {
        user = await client.users.fetch(args[0]).catch(() => null);
      }

      if (!user) {
        return message.channel.send("Kullanıcı bulunamadı veya geçersiz bir ID girildi.");
      }
    }

    // 3. Hiçbir şey yoksa komutu yazan kişi
    if (!user) {
      user = message.author;
    }

    const avatarURL = user.displayAvatarURL({ size: 4096, dynamic: true });

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} adlı kullanıcının avatarı`)
      .setImage(avatarURL)
      .setColor('#2f3136')
      .setFooter({
        text: config.footer || client.user.username,
        iconURL: client.user.displayAvatarURL()
      });

    message.channel.send({ embeds: [embed] });
  }
};

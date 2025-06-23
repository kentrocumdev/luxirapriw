const config = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Kullanıcının avatarını gösterir.',
  async execute(message, args) {
    let user;

    // Eğer mesaj reply'si varsa reply edilen kullanıcıyı al
    if (message.reference) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        user = repliedMessage.author;
      } catch {
        // Eğer fetch başarısızsa kullanıcıyı mesaj sahibi yaparız
        user = message.author;
      }
    }
    // Eğer argüman varsa (etiket veya id)
    else if (args[0]) {
      // Öncelikle mention kontrolü
      user = message.mentions.users.first();

      // Eğer mention yoksa, ID den dene
      if (!user) {
        user = await message.client.users.fetch(args[0]).catch(() => null);
      }

      if (!user) user = message.author; // Bulamazsa mesaj sahibi olsun
    } 
    else {
      // Hiç argüman yoksa mesaj sahibini al
      user = message.author;
    }

    const avatarURL = user.displayAvatarURL({ size: 4096, dynamic: true });

    const embed = new EmbedBuilder()
      .setTitle(`${user.username} adlı kullanıcının avatarı`)
      .setImage(avatarURL)
      .setColor('#2f3136')
      .setFooter({
        text: config.footer || message.client.user.username,
        iconURL: message.client.user.displayAvatarURL()
      });

    message.reply({ embeds: [embed] });
  }
};

const config = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'banner',
  description: 'Kullanıcının bannerını gösterir.',
  async execute(message, args) {
    let user;

    if (message.reference) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        user = repliedMessage.author;
      } catch {
        user = message.author;
      }
    } else if (args[0]) {
      user = message.mentions.users.first();
      if (!user) {
        user = await message.client.users.fetch(args[0]).catch(() => null);
      }
      if (!user) user = message.author;
    } else {
      user = message.author;
    }

    try {
      // Full fetch to get banner data
      const fetchedUser = await message.client.users.fetch(user.id, { force: true });
      if (!fetchedUser.banner) {
        return message.reply('Bu kullanıcının bannerı yok.');
      }

      const bannerURL = fetchedUser.bannerURL({ size: 4096, dynamic: true });

      const embed = new EmbedBuilder()
        .setTitle(`${user.username} adlı kullanıcının bannerı`)
        .setImage(bannerURL)
        .setColor('#2f3136')
        .setFooter({
          text: config.footer || message.client.user.username,
          iconURL: message.client.user.displayAvatarURL()
        });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply('Banner alınırken bir hata oluştu.');
    }
  }
};

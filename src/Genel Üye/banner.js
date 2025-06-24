const config = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'banner',
  description: 'Kullanıcının bannerını gösterir.',

  async execute(client, message, args) {
    let user;

    // Yanıt varsa önce ona bak
    if (message.reference?.messageId) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        user = repliedMessage.author;
      } catch {
        user = null;
      }
    }

    // Argüman varsa mention ya da ID
    if (!user && args[0]) {
      user = message.mentions.users.first();
      if (!user) {
        user = await client.users.fetch(args[0]).catch(() => null);
      }
    }

    // Hâlâ kullanıcı yoksa mesaj sahibi
    if (!user) {
      user = message.author;
    }

    try {
      const fetchedUser = await client.users.fetch(user.id, { force: true });

      if (!fetchedUser.banner) {
        return message.channel.send("Bu kullanıcının bannerı yok.");
      }

      const bannerURL = `https://cdn.discordapp.com/banners/${fetchedUser.id}/${fetchedUser.banner}.${fetchedUser.banner.startsWith("a_") ? "gif" : "png"}?size=4096`;

      const embed = new EmbedBuilder()
        .setTitle(`${fetchedUser.username} adlı kullanıcının bannerı`)
        .setImage(bannerURL)
        .setColor('#2f3136')
        .setFooter({
          text: config.footer || client.user.username,
          iconURL: client.user.displayAvatarURL()
        });

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.send("Banner alınırken bir hata oluştu.");
    }
  }
};

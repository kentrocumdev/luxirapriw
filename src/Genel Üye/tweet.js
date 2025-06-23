const canvafy = require('canvafy');

module.exports = {
  name: 'tweet',
  description: 'Kendi mesajını yazan tweet kartı oluşturur. Kullanım: `.tweet mesaj`',
  async execute(client, message, args, beş_embed) {
    if (!message.guild) 
      return message.reply('Bu komut sadece sunucularda kullanılabilir.');

    const displayName = (message.member && message.member.nickname) || message.author.username;
    const username = message.author.username;
    const comment = args.join(' ') || "Bu bir test tweet'idir!";

    try {
      const tweetCard = await new canvafy.Tweet()
        .setTheme('dim')
        .setUser({ displayName, username })
        .setVerified(true)
        .setComment(comment)
        .setAvatar(message.author.displayAvatarURL({ extension: 'png', size: 256 }))
        .build();

      return message.reply({
        files: [{
          attachment: tweetCard,
          name: `tweet-${message.author.id}.png`
        }]
      });
    } catch (err) {
      console.error('Tweet kartı oluşturulurken hata:', err);
      return message.reply('🚨 Tweet kartı oluşturulurken bir hata oluştu.');
    }
  }
};

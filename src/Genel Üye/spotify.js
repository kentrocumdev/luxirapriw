const { ActivityType } = require('discord.js');
const canvafy = require('canvafy');

module.exports = {
  name: 'spotify',
  description: 'Belirtilen kullanıcının Spotify şarkısını görsel olarak yollar.',
  aliases: ['sp'],
  async execute(client, message, args, embed) {
    if (!message.guild) {
      return message.reply({ embeds: [embed.setDescription('Bu komut sadece sunucu kanallarında kullanılabilir.')] });
    }

    let targetUser = message.author;

    // Eğer mesaj bir mesaja yanıt ise
    if (message.reference) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        targetUser = repliedMessage.author;
      } catch {
        return message.reply({ embeds: [embed.setDescription('Yanıtladığın mesajı bulamadım.')] });
      }
    }
    // Eğer mesajda kullanıcı etiketi varsa
    else if (message.mentions && message.mentions.users && message.mentions.users.size > 0) {
      targetUser = message.mentions.users.first();
    }
    // Eğer argüman olarak kullanıcı ID'si verilmişse
    else if (args.length > 0) {
      try {
        const fetchedUser = await client.users.fetch(args[0]);
        if (fetchedUser) targetUser = fetchedUser;
      } catch {
        return message.reply({ embeds: [embed.setDescription('Geçerli bir kullanıcı ID’si girmelisin.')] });
      }
    }

    const member = await message.guild.members.fetch(targetUser.id).catch(() => null);
    if (!member) return message.reply({ embeds: [embed.setDescription('Kullanıcı sunucuda bulunamadı.')] });

    const activities = member.presence?.activities || [];
    const spotifyActivity = activities.find(a => a.type === ActivityType.Listening && a.name === 'Spotify');

    if (!spotifyActivity) {
      return message.reply({ embeds: [embed.setDescription(`${targetUser.username} şu anda Spotify’da bir şey dinlemiyor.`)] });
    }

    const { details: title, state: artist, assets, timestamps } = spotifyActivity;
    const album = assets?.largeText || 'Bilinmeyen Albüm';
    const imageURL = assets?.largeImage ? `https://i.scdn.co/image/${assets.largeImage.slice(8)}` : null;

    if (!imageURL) {
      return message.reply({ embeds: [embed.setDescription('Spotify albüm resmi alınamadı.')] });
    }

    const startMs = timestamps?.start?.valueOf() || 0;
    const endMs = timestamps?.end?.valueOf() || 0;
    const now = Date.now();
    const elapsed = now - startMs;
    const total = endMs - startMs;

    const spotifyCard = await new canvafy.Spotify()
      .setAuthor(`${targetUser.username} • ${artist}`)
      .setAlbum(album)
      .setTimestamp(elapsed, total)
      .setImage(imageURL)
      .setTitle(title)
      .setBlur(5)
      .setOverlayOpacity(0.7)
      .build();

    return message.reply({
      files: [{
        attachment: spotifyCard,
        name: `spotify-${targetUser.id}.png`
      }]
    });
  }
};

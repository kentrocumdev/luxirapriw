const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'avatar',
  description: 'Kullanıcının avatarını ve bannerını gösterir.',
  
  async execute(client, message, args) {
    let user;

    if (message.reference?.messageId) {
      try {
        const repliedMessage = await message.channel.messages.fetch(message.reference.messageId);
        user = repliedMessage.author;
      } catch {
        user = null;
      }
    }

    if (!user && args[0]) {
      user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
      if (!user) return message.channel.send("Kullanıcı bulunamadı veya geçersiz bir ID girildi.");
    }

    if (!user) user = message.author;

    let userBannerURL = null;
    try {
      const fetchedUser = await client.users.fetch(user.id, { force: true });
      if (fetchedUser.banner) {
        userBannerURL = `https://cdn.discordapp.com/banners/${fetchedUser.id}/${fetchedUser.banner}.${fetchedUser.banner.startsWith("a_") ? "gif" : "png"}?size=4096`;
      }
    } catch (err) {
      console.error(err);
    }

    const avatarURL = user.displayAvatarURL({ size: 4096, dynamic: true });

    // Başlangıç embed avatar gösteriyor
    const embed = new EmbedBuilder()
      .setTitle(`${user.username} adlı kullanıcının avatarı`)
      .setColor('#2f3136')
      .setFooter({ text: config.footer || client.user.username, iconURL: client.user.displayAvatarURL() })
      .setImage(avatarURL);

    const options = [
      {
        label: 'Avatarı Göster',
        description: 'Kullanıcının avatarını gösterir.',
        value: 'avatar',
        emoji: '🖼️',
      },
      {
        label: 'Bannerı Göster',
        description: 'Kullanıcının bannerını gösterir.',
        value: 'banner',
        emoji: '🖼️',
      }
    ];

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_avatar_banner')
        .setPlaceholder('Birini seç...')
        .addOptions(options)
    );

    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60000 });

    collector.on('collect', async interaction => {
      if (interaction.user.id !== message.author.id) {
        return interaction.reply({ content: 'Bu menüyü sadece komutu kullanan kişi kullanabilir.', ephemeral: true });
      }

      if (interaction.values[0] === 'avatar') {
        embed.setTitle(`${user.username} adlı kullanıcının avatarı`)
          .setImage(avatarURL);
      } else if (interaction.values[0] === 'banner') {
        if (userBannerURL) {
          embed.setTitle(`${user.username} adlı kullanıcının bannerı`)
            .setImage(userBannerURL);
        } else {
          return interaction.reply({ content: 'Bu kullanıcının bannerı yok.', ephemeral: true });
        }
      }

      await interaction.update({ embeds: [embed] });
    });

    collector.on('end', () => {
      row.components[0].setDisabled(true);
      msg.edit({ components: [row] }).catch(() => {});
    });
  }
};

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'userUpdate',

  async execute(oldUser, newUser) {
    try {
      newUser.client.guilds.cache.forEach(async guild => {
        const oldMember = guild.members.cache.get(oldUser.id);
        const newMember = guild.members.cache.get(newUser.id);
        if (!oldMember || !newMember) return;

        const category = guild.channels.cache.find(c => c.name === 'Pinterest Room' && c.type === 4);
        if (!category) return;

        const avatarChannel = guild.channels.cache.find(c => c.name === 'avatar' && c.parentId === category.id);
        if (!avatarChannel) return;

        // Avatar değiştiyse
        if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
          const avatarURL = newUser.displayAvatarURL({ dynamic: true, size: 512 });

          const avatarEmbed = new EmbedBuilder()
            .setTitle('🖼️ Kullanıcı Avatarı Güncellendi')
            .addFields(
              { name: 'Kullanıcı', value: newUser.tag, inline: true },
              { name: 'Kullanıcı ID', value: newUser.id, inline: true }
            )
            .setImage(avatarURL)
            .setColor('Random')
            .setTimestamp()
            .setFooter({ text: 'Kentrocum 🗽', iconURL: newUser.displayAvatarURL() });

          const avatarButton = new ButtonBuilder()
            .setLabel('Tıkla Aç 💻')
            .setStyle(ButtonStyle.Link)
            .setURL(avatarURL);

          const avatarRow = new ActionRowBuilder().addComponents(avatarButton);

          await avatarChannel.send({ embeds: [avatarEmbed], components: [avatarRow] }).catch(() => {});
        }
      });
    } catch (err) {
      console.error('[userUpdate] Avatar güncelleme hatası:', err);
    }
  }
};

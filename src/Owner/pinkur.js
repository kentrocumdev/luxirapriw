const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'pinkur',
  description: 'Pinterest Room kategorisi ve avatarı oluşturur.',
  aliases: [],
  usage: '.pinkur',
  cooldown: 5,
  async execute(client, message, args) {
    if (!message.guild || message.guild.id !== message.channel.guild.id) return;

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('❌ Bu komutu kullanmak için **Yönetici** yetkin olmalı.')
        .setFooter({ text: config.footer || 'Kentrocum 🗽' });
      return message.channel.send({ embeds: [embed] });
    }

    // Sadece mesajın atıldığı sunucuda işlem yap
    const guild = message.guild;

    let category = guild.channels.cache.find(c => c.name === 'Pinterest Room' && c.type === ChannelType.GuildCategory);
    if (!category) {
      category = await guild.channels.create({
        name: 'Pinterest Room ❤️',
        type: ChannelType.GuildCategory,
        reason: 'Pinterest Room kategorisi oluşturuluyor.',
      });
    }

    let avatarChannel = guild.channels.cache.find(c => c.name === 'avatar' && c.parentId === category.id);
    if (!avatarChannel) {
      avatarChannel = await guild.channels.create({
        name: 'avatar',
        type: ChannelType.GuildText,
        parent: category.id,
        reason: 'Avatar kanalı oluşturuluyor.',
      });
    }


    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('✅ Kurulum Tamamlandı')
      .setDescription('Pinterest Room kategorisi ve altındaki avatar kanalı başarıyla oluşturuldu.')
      .setFooter({ text: config.footer || 'Kentrocum 🗽' });

    message.channel.send({ embeds: [embed] });
  }
};

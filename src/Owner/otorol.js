const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

// Map ile sunucu bazında rol saklama (basit, kalıcı değil)
const otorolMap = new Map();

module.exports = {
  name: 'otorol',
  description: 'Yeni gelenlere otomatik rol verir.',
  usage: '.otorol @rol',

  async execute(client, message, args) {
    if (!message.guild) return;

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const embed = new EmbedBuilder()
        .setColor('Red')
        .setDescription('Bu komutu kullanmak için Yönetici yetkin olmalı.')
        .setFooter({ text: config.footer || 'Kentrocum 🗽' });
      return message.channel.send({ embeds: [embed] });
    }

    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if (!role) {
      const embed = new EmbedBuilder()
        .setColor('Yellow')
        .setDescription('Lütfen bir rol etiketle veya ID gir.')
        .setFooter({ text: config.footer || 'Kentrocum 🗽' });
      return message.channel.send({ embeds: [embed] });
    }

    otorolMap.set(message.guild.id, role.id);

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setDescription(`Otorol başarıyla ayarlandı: ${role.name}`)
      .setFooter({ text: config.footer || 'Kentrocum 🗽' });
    return message.channel.send({ embeds: [embed] });
  },

  async onGuildMemberAdd(member) {
    const roleId = otorolMap.get(member.guild.id);
    if (!roleId) return;

    const role = member.guild.roles.cache.get(roleId);
    if (!role) return;

    try {
      await member.roles.add(role);
      console.log(`${member.user.tag} kullanıcısına otomatik olarak ${role.name} rolü verildi.`);
    } catch (error) {
      console.error('Otorol verirken hata oluştu:', error);
    }
  },
};

const { PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const client = global.client;

module.exports = {
  name: "git",
  usage: "git [@Kentro / ID]",
  category: "genel",
  aliases: ["go", "git", "ışınlan"],
  
  execute: async (client, message, args, beş_embed) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!message.member.voice.channel) 
      return message.reply({ embeds: [beş_embed.setDescription(`> **Öncelikle Bir Ses Kanalında Bulunman Gerekli!**`).setColor("#000000")] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));

    if (!member || !member.voice.channel || member.id === message.author.id) 
      return message.reply({ embeds: [beş_embed.setDescription(`> **Seste Bulunan Geçerli Bir User Belirt!**`).setColor("#000000")] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));

    if (member.voice.channel.id === message.member.voice.channel.id) 
      return message.reply({ embeds: [beş_embed.setDescription(`> **Zaten Aynı Kanaldasınız!**`).setColor("#000000")] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));

    const beş_dropdown = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('tasıma')
          .setPlaceholder(`${member.displayName} Onayla / Reddet`)
          .addOptions([
            { label: `Onayla`, description: `Taşıma İşlemini Onayla`, value: `onay`, emoji: "✅" },
            { label: `Reddet`, description: `Taşıma İşlemini Reddet`, value: `red`, emoji: "❌" }
          ])
      );

    // Onay ve red işlemleri için basit fonksiyonlar (kendine göre genişlet)
    const onay = (message) => console.log(`İşlem onaylandı: ${message.author.tag}`);
    const red = (message) => console.log(`İşlem reddedildi: ${message.author.tag}`);

    if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      if (message.member.voice.channel && member.voice.channel) 
        await message.member.voice.setChannel(member.voice.channel);

      return message.reply({ embeds: [beş_embed.setDescription(`> **Başarıyla Kullanıcının Kanalına Taşındınız!**`).setColor("#00ff00")] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
    } else {
      let mesajbeş = await message.reply({ 
        content: `> **${member}, ${message.author} \`${member.voice.channel.name}\` adlı kanala gelmek istiyor, kabul ediyor musun?**`, 
        components: [beş_dropdown] 
      });

      const filter = i => i.user.id === member.id;
      const collector = mesajbeş.createMessageComponentCollector({ filter, time: 30000, max: 1 });

      collector.on('end', async collected => {
        if (collected.size === 0) {
          beş_dropdown.components[0].setDisabled(true);
          mesajbeş.edit({ content: `> **İşlem süresi doldu! Menü devre dışı bırakıldı.**`, components: [beş_dropdown] });
          red(message);
        }
      });

      collector.on('collect', async interaction => {
        if (!interaction.isStringSelectMenu()) return;
        const value = interaction.values[0];

        if (value === "onay") {
          onay(message);
          await interaction.reply({ embeds: [beş_embed.setDescription(`> **Taşıma işlemi onaylandı!**`).setColor("#00ff00")], ephemeral: true });
          if (message.member.voice.channel && member.voice.channel)
            await message.member.voice.setChannel(member.voice.channel);
        } else if (value === "red") {
          red(message);
          await interaction.reply({ embeds: [beş_embed.setDescription(`> **Taşıma işlemi reddedildi!**`).setColor("#ff0000")], ephemeral: true });
        }
        collector.stop();
        try { await mesajbeş.delete(); } catch {}
      });
    }
  }
};

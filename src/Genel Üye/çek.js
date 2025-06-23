const { PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  name: "çek",
  usage: "çek [Kentro / ID]",
  category: "genel",
  aliases: ["pull", "çek", "yanıma-çek"],

  execute: async (client, message, args, beş_embed) => {
    const onaylandi = (message) => {
      console.log(`${message.author.tag} işlemi ONAYLADI.`);
    };
    const reddedildi = (message) => {
      console.log(`${message.author.tag} işlemi REDDETTİ veya İPTAL OLDU.`);
    };

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    
    if (!message.member.voice.channel) 
      return message.reply({ embeds: [beş_embed.setDescription(`> **Öncelikle Bir Ses Kanalında Bulunman Gerekli!**`).setColor("#000000")] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
    
    if (!member || !member.voice.channel || member.id === message.author.id) 
      return message.reply({ embeds: [beş_embed.setDescription(`> **Seste Bulunan Geçerli Bir User Belirt!**`).setColor("#000000")] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
    
    if(member.voice.channel.id == message.member.voice.channel.id) 
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
    
    if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      if (message.member.voice.channel && member.voice.channel) 
        member.voice.setChannel(message.member.voice.channel);

      return message.reply({ embeds: [beş_embed.setDescription(`> **Başarıyla Kullanıcıyı Kanalınıza Çektiniz!**`).setColor("#000000")] })
        .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
    } else {
      message.reply({ content: `> **${member}, ${message.author} \`${member.voice.channel.name}\` Adlı Kanala Sizi Çekmek İstiyor, Kabul Ediyomusun?**`, components: [beş_dropdown] })
      .then(b2 => {
        const filter = i => i.user.id === member.id;
        const collector = b2.createMessageComponentCollector({ filter, time: 30000, max: 1 });

        collector.on('end', async (bes) => {
          if (bes.size !== 0) return;
          beş_dropdown.components[0].setDisabled(true);
          b2.edit({ content: `> **İşlem Süresi Doldu!** *Menu Deaktif Kılındı!*`, components: [beş_dropdown] });
          reddedildi(message);
        });

        collector.on('collect', async b => {
          if (!b.isStringSelectMenu()) return;
          const value = b.values[0];

          if (value === "onay") {
            onaylandi(message);
            message.reply({ embeds: [beş_embed.setDescription(`> **Taşıma İşlemi Onaylandı!**`).setColor("#000000")] })
              .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
            if (message.member.voice.channel && member.voice.channel) 
              member.voice.setChannel(message.member.voice.channel);
          }

          if (value === "red") {
            reddedildi(message);
            message.reply({ embeds: [beş_embed.setDescription(`> **Taşıma İşlemi Reddedildi!**`).setColor("#000000")] })
              .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
          }

          collector.stop();
          b.message.delete().catch(() => {});
        });
      });
    }
  }
};

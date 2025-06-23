const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const beş_config = require("../../config.json");
const canvafy = require('canvafy');

module.exports = {
    name: "ship",
    usage: "ship [@Kentro / ID / Random]",
    category:"genel",
    aliases: ["ships", "kalp"],
    execute: async (client, message, args, beş_embed) => {
        if(!["ship","cmd"].some(bes => message.channel.name.includes(bes))) {
            return message.channel.send({ embeds: [beş_embed.setDescription(`> **Ship Komudunu Sadece Adında "ship","cmd" adlı Kanallarda Kullanabilirsin!**`)] })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.random();
        if(!user) {
            return message.channel.send({ embeds: [beş_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const ship = await new canvafy.Ship()
            .setAvatars(message.author.displayAvatarURL({ dynamic: true, extension: "png" }), user.user.displayAvatarURL({ dynamic: true, extension: "png" }))
            .setBackground("image", `${message.guild.bannerURL({extension:"png",size:2048}) !== null ? message.guild.bannerURL({extension:"png",size:2048}) : beş_config.shipArkaplan}`)
            .setBorder("#f0f0f0")
            .setOverlayOpacity(0.5)
            .build();

        // Başarı mesajı gönder
        message.channel.send({ embeds: [beş_embed.setDescription("✅ İşlem başarılı!").setColor("Green")] })
            .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));

        message.reply({
            content:`> **     ${message.author.tag} ❓ ${user.user.tag}**`,
            files: [{
                attachment: ship,
                name: `ship-${message.member.id}.png`
            }]
        });
    }
}

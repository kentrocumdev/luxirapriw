const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const config = require("../../config.json");
const canvafy = require('canvafy');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "ship",
    usage: "ship [@Kentro / ID / Random]",
    category: "genel",
    aliases: ["ships", "kalp"],
    execute: async (client, message, args, embed) => {
        if (!["ship", "cmd"].some(ch => message.channel.name.includes(ch))) {
            return message.channel.send({ embeds: [embed.setDescription(`> **Ship Komudunu Sadece Adında "ship","cmd" adlı Kanallarda Kullanabilirsin!**`)] })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.random();
        if (!user) {
            return message.channel.send({ embeds: [embed.setDescription(`> **Geçerli Bir Kullanıcı Belirt!**`)] })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        // Sunucunun banner URL'sini al
        let bgImage = message.guild.bannerURL({ extension: "png", size: 2048 });

        // Eğer sunucu banner yoksa config'den arka plan al (URL veya dosya yolu olabilir)
        if (!bgImage) {
            const shipBg = config.shipArkaplan || "";

            if (shipBg.startsWith("http://") || shipBg.startsWith("https://")) {
                // URL ise direkt kullan
                bgImage = shipBg;
            } else {
                // Yerel dosya yolu ise kontrol et
                const localPath = path.join(__dirname, "../../", shipBg);
                if (fs.existsSync(localPath)) {
                    bgImage = localPath;
                } else {
                    bgImage = null;
                }
            }
        }

        const ship = new canvafy.Ship()
            .setAvatars(
                message.author.displayAvatarURL({ dynamic: true, extension: "png" }),
                user.user.displayAvatarURL({ dynamic: true, extension: "png" })
            )
            .setBorder("#f0f0f0")
            .setOverlayOpacity(0.5);

        if (bgImage) {
            ship.setBackground("image", bgImage);
        }

        const buffer = await ship.build();

        message.reply({
            content: `> **${message.author.tag} ❓ ${user.user.tag}**`,
            files: [{
                attachment: buffer,
                name: `ship-${message.member.id}.png`
            }]
        });
    }
};

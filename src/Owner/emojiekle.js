const { PermissionFlagsBits } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    name: "emoji-ekle",
    usage: "emoji-ekle [emoji]",
    category: "sahip",
    aliases: ["emojiekle", "eekle", "emote-ekle", "emoteekle", "emoji-yükle"],
    execute: async (client, message, args, beş_embed) => {
        // Yetki kontrolü
        if (
            !message.member.permissions.has(PermissionFlagsBits.Administrator) 
           
        ) {
            return message.reply({
                embeds: [
                    beş_embed.setDescription("> **Bu komutu kullanmak için yetkiniz yok!**")
                ]
            }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        if (!args.length) {
            return message.reply({
                embeds: [
                    beş_embed.setDescription("> **Lütfen eklenecek emojiyi belirtin!**")
                ]
            }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        if (args.length > 5) {
            return message.reply({
                embeds: [
                    beş_embed.setDescription("> **Tek seferde en fazla `5` emoji ekleyebilirsin!**")
                ]
            }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        for (let raw of args) {
            const parsed = parseEmoji(raw);
            if (parsed.id) {
                const ext = parsed.animated ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${parsed.id}${ext}`;
                try {
                    const emoji = await message.guild.emojis.create({ name: parsed.name, attachment: url });
                    message.reply({
                        embeds: [
                            beş_embed
                                .setThumbnail(emoji.url)
                                .setColor("#00ff00")
                                .setDescription(`> **\`${emoji.name}\` adlı emoji sunucuya eklendi!**`)
                        ]
                    });
                } catch (err) {
                    message.reply({
                        content: `> **Bir hata oluştu:** \`${err.message}\``
                    });
                }
            }
        }
    }
};

function parseEmoji(text) {
    if (text.includes('%')) text = decodeURIComponent(text);
    if (!text.includes(':')) return { animated: false, name: text, id: undefined };
    const match = text.match(/<?(?:(a):)?(\w{1,32}):(\d{17,19})>?/);
    return match && {
        animated: Boolean(match[1]),
        name: match[2],
        id: match[3]
    };
}

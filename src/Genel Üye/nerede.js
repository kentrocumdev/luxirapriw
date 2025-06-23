const { EmbedBuilder } = require("discord.js");
const beş_config = require("../../config.json");

module.exports = {
    name: "nerede",
    usage: "nerede [@Kentro / ID]",
    category: "moderasyon",
    aliases: ["n", "nerde", "where"],
    execute: async (client, message, args, beş_embed) => {
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        let kanal = user.voice.channel;
        if (!kanal) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Belirtilen Kullanıcı Bir Ses Kanalında Bulunmamakta!**`)] })
                .then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        let microphone = user.voice.selfMute ? "Kapalı" : "Açık";
        let headphones = user.voice.selfDeaf ? "Kapalı" : "Açık";
        let sestekiler = kanal.members.size >= 20
            ? "Kanalda 20 Kişiden Fazla User Bulunmakta!"
            : kanal.members.map(x => x.user.tag).join(", ");

        let davet = await kanal.createInvite();

        message.reply({
            embeds: [
                beş_embed.setDescription(
                    `> **${user} Kullanıcısı ${kanal} Adlı Kanalda!**\n` +
                    `> **Mikrofon; \`${microphone}\`**\n` +
                    `> **Kulaklık; \`${headphones}\`**\n` +
                    `> **Sesteki Kullanıcılar; ${sestekiler}**\n\n` +
                    `> **[Kanala Katıl!](https://discord.gg/${davet.code})**`
                ).setThumbnail(user.user.avatarURL({ dynamic: true }))
            ]
        });
    }
}

const { PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    name: "dağıt",
    usage: "dağıt [Kategori ID]",
    category: "moderasyon",
    aliases: ["boşalt", "topludağıt"],

    execute: async (client, message, args, beş_embed) => {

        // Yetki kontrolü (sadece yönetici veya ban yetkisi)
        const hasPermission = message.member.permissions.has(PermissionFlagsBits.Administrator) 
                              

        if (!hasPermission) {
            const reply = await message.reply({
                embeds: [beş_embed.setDescription("> **Komutu kullanmak için yetkin yok!**")]
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Kullanıcı ses kanalında değilse
        if (!message.member.voice.channel) {
            const reply = await message.reply({
                embeds: [beş_embed.setDescription("> **Bir ses kanalında değilsin!**")]
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Kategori kontrolü
        const kategori = message.guild.channels.cache.get(args[0]);
        if (!args[0] || !kategori || kategori.type !== ChannelType.GuildCategory) {
            const reply = await message.reply({
                embeds: [beş_embed.setDescription("> **Geçerli bir kategori ID'si belirtmelisin!**")]
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Dağıtılacak üyeler
        const üyeler = message.member.voice.channel.members.filter(u => !u.user.bot && u.id !== message.author.id);
        if (üyeler.size === 0) {
            const reply = await message.reply({
                embeds: [beş_embed.setDescription("> **Kanalda dağıtılabilecek kullanıcı yok!**")]
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Hedef ses kanallarını çek
        const hedefKanallar = message.guild.channels.cache.filter(ch => ch.parentId === kategori.id && ch.type === ChannelType.GuildVoice);
        if (hedefKanallar.size === 0) {
            return message.reply({
                embeds: [beş_embed.setDescription("> **Belirtilen kategoride ses kanalı bulunamadı!**")]
            });
        }

        // Dağıtım
        üyeler.forEach((üye, index) => {
            setTimeout(() => {
                const hedefKanal = hedefKanallar.random();
                if (!hedefKanal) return;

                if (üye.voice.channelId === message.member.voice.channelId) {
                    üye.voice.setChannel(hedefKanal).catch(() => {});
                }
            }, index * 1000); // 1 saniye aralıklarla
        });

        // Bilgilendirme
        return message.reply({
            embeds: [beş_embed.setDescription(`> **\`${üyeler.size}\` kullanıcı, \`${kategori.name}\` kategorisindeki ses kanallarına dağıtılıyor!**`)]
        });
    }
};

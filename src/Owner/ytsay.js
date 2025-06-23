const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "ytsay",
    usage: "ytsay",
    category: "üstyt",
    aliases: ["yetkili-say", "yetkilisay", "anons", "yetkili-duyuru"],
    execute: async (client, message, args, beş_embed) => {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({
                embeds: [beş_embed.setDescription("> **Bu komutu kullanmak için `Yönetici` yetkisine sahip olmalısın!**")]
            }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const yetkiliRolID = "1377376794696482901"; // <--- Buraya yetkili rol ID gir

        const üyeler = message.guild.members.cache.filter(m =>
            m.roles.cache.has(yetkiliRolID) && !m.user.bot
        );

        const toplam = üyeler.size;
        const seste = üyeler.filter(m => m.voice.channel).size;
        const sesteOlmayan = üyeler.filter(m => !m.voice.channel).size;
        const aktif = üyeler.filter(m => m.presence && m.presence.status !== "offline").size;

        const sesteOlmayanListe = üyeler
            .filter(m => !m.voice.channel)
            .map(m => `<@${m.id}>`)
            .join(", ") || "Yok";

        const aktifSesteOlmayanListe = üyeler
            .filter(m => !m.voice.channel && m.presence && m.presence.status !== "offline")
            .map(m => `<@${m.id}>`)
            .join(", ") || "Yok";

       beş_embed
    .setColor("#000000") // <--- Embed rengini siyah yapar
    .setTitle("Yetkili Anons")
    .addFields([
        { name: "Toplam Yetkili", value: `${toplam}`, inline: true },
        { name: "Seste Olan", value: `${seste}`, inline: true },
        { name: "Seste Olmayan", value: `${sesteOlmayan}`, inline: true },
        { name: "Aktif Yetkili", value: `${aktif}`, inline: true }
    ])
    .setThumbnail(message.guild.iconURL({ dynamic: true }));


        await message.reply({ embeds: [beş_embed] });

        // Seste olmayanlar
        await message.channel.send("> **Seste Olmayan Yetkililer:**");
        const parça1 = splitByLength(sesteOlmayanListe, 1500);
        for (const parça of parça1) {
            await message.channel.send({ content: parça });
        }

        // Aktif olup seste olmayanlar
        await message.channel.send("> **Aktif Olup Seste Olmayan Yetkililer:**");
        const parça2 = splitByLength(aktifSesteOlmayanListe, 1500);
        for (const parça of parça2) {
            await message.channel.send({ content: parça });
        }
    }
};

function splitByLength(text, length) {
    const chunks = [];
    for (let i = 0; i < text.length; i += length) {
        chunks.push(text.slice(i, i + length));
    }
    return chunks;
}

const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "yaz",
    usage: "yaz <mesaj>",
    category: "üstyt",
    aliases: ["yazı", "söyle", "yazdır"],
    execute: async (client, message, args, beş_embed) => {
        // Yetki kontrolü: Sadece Yönetici
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({
                embeds: [
                    beş_embed.setDescription("> **Bu komutu kullanmak için `Yönetici` yetkisine sahip olmalısın!**")
                ]
            }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        const mesaj = args.join(" ");
        if (!mesaj) {
            return message.reply({
                embeds: [
                    beş_embed.setDescription("> **Lütfen gönderilecek mesajı belirtin!**")
                ]
            }).then(msg => setTimeout(() => msg.delete().catch(() => {}), 5000));
        }

        await message.delete().catch(() => {});
        message.channel.send({ content: mesaj });
    }
};

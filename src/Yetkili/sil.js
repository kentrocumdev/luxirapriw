const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const beş_config = require("../../config.json");

module.exports = {
    name: "sil",
    usage: "sil <0-100>",
    category: "moderasyon",
    aliases: ["delete", "kaldır", "temizle", "sils"],
    execute: async (client, message, args, beş_embed) => {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages) && !message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply({ embeds: [beş_embed.setDescription("> **Bu komutu kullanmak için yetkiniz yok!**")] });
        }

        let buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setLabel("10").setStyle(ButtonStyle.Danger).setEmoji("🗑️").setCustomId(`${message.author.id}_delete_10`),
                new ButtonBuilder().setLabel("25").setStyle(ButtonStyle.Danger).setEmoji("🗑️").setCustomId(`${message.author.id}_delete_25`),
                new ButtonBuilder().setLabel("50").setStyle(ButtonStyle.Danger).setEmoji("🗑️").setCustomId(`${message.author.id}_delete_50`),
                new ButtonBuilder().setLabel("100").setStyle(ButtonStyle.Danger).setEmoji("🗑️").setCustomId(`${message.author.id}_delete_100`),
                new ButtonBuilder().setLabel("İptal").setStyle(ButtonStyle.Danger).setEmoji("❌").setCustomId(`${message.author.id}_delete_iptal`)
            );

        if (!args[0]) {
            return message.reply({ 
                components: [buttons], 
                embeds: [beş_embed.setDescription(`> **Silinecek Mesaj Adedini Seçiniz!**`).setThumbnail(message.guild.iconURL({ forceStatic: true, dynamic: true }))] 
            });
        }

        if (isNaN(args[0]) || Number(args[0]) < 1 || Number(args[0]) > 100) {
            return message.reply({ embeds: [beş_embed.setDescription(`> **Geçersiz sayı girdiniz!** *${beş_config.prefix}sil <1-100>*`)] });
        }

        const deleteAmount = Math.min(Number(args[0]) + 1, 100);
        await message.channel.bulkDelete(deleteAmount, true).catch(err => {
            console.error(err);
            return message.channel.send("> **Mesajlar silinirken hata oluştu!**");
        });

        const confirmation = await message.channel.send(`> **${args[0]}** adet mesaj silindi!`);
        setTimeout(() => confirmation.delete().catch(() => {}), 5000);
    }
};

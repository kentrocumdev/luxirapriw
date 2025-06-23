const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: "forceban",
    usage: "forceban [@Kullanıcı / ID] <sebep>",
    category: "moderasyon",
    aliases: ["forcebans", "forceyasakla", "forceyasaklama", "kalkmazban", "kalkmaz-ban"],

    execute: async (client, message, args, beş_embed) => {
        // Yetki kontrolü
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            const reply = await message.reply({ 
                embeds: [beş_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] 
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Kullanıcı belirtilmemişse
        if (!args[0]) {
            const reply = await message.reply({ 
                embeds: [beş_embed.setDescription(`> **Bir kullanıcı belirtmelisin!**`)] 
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Kullanıcıyı bul
        let member;
        try {
            member = message.mentions.users.first() || await client.users.fetch(args[0]);
        } catch (err) {
            const reply = await message.reply({ 
                embeds: [beş_embed.setDescription(`> **Geçerli bir kullanıcı ID'si girilmedi.**`)] 
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Kullanıcı hâlâ bulunamadıysa
        if (!member) {
            const reply = await message.reply({ 
                embeds: [beş_embed.setDescription(`> **Kullanıcı bulunamadı. Lütfen geçerli bir kullanıcı belirt.**`)] 
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Kendine veya bota işlem engeli
        if (member.id === message.author.id) {
            const reply = await message.reply({ 
                embeds: [beş_embed.setDescription(`> **Kendine işlem uygulayamazsın!**`)] 
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        if (member.bot) {
            const reply = await message.reply({ 
                embeds: [beş_embed.setDescription(`> **Botlara işlem uygulayamazsın!**`)] 
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Sebep kontrolü
        const reason = args.slice(1).join(" ");
        if (!reason || reason.length < 1) {
            const reply = await message.reply({ 
                embeds: [beş_embed.setDescription(`> **Bir sebep belirtmelisin!**`)] 
            });
            return setTimeout(() => reply.delete().catch(() => {}), 5000);
        }

        // Banla
        try {
            await message.guild.members.ban(member.id, { reason });
            await message.reply({ 
                embeds: [beş_embed.setDescription(`✅ ${member.tag} adlı kullanıcı başarıyla **kalıcı olarak** banlandı.\n**Sebep:** ${reason}`)] 
            });
        } catch (err) {
            console.error(err);
            await message.reply({ 
                embeds: [beş_embed.setDescription(`❌ **Ban işlemi sırasında bir hata oluştu.**\n\`\`\`${err.message}\`\`\``)] 
            });
        }
    }
};

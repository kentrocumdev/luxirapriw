const fs = require("fs");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "unjail",
  description: "Kullanıcıyı jail'den çıkarır ve rollerini geri verir.",
  execute: async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("Red")
          .setDescription("❌ Bu komutu kullanmak için yetkin yok!")
          .setFooter({ text: config.footer, iconURL: client.user.displayAvatarURL() })
        ]
      });
    }

    const dataPath = "./jailData.json";
    if (!fs.existsSync(dataPath)) return message.reply({
      embeds: [new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ Jail sistemi daha önce ayarlanmamış.")
        .setFooter({ text: config.footer, iconURL: client.user.displayAvatarURL() })
      ]
    });

    const data = JSON.parse(fs.readFileSync(dataPath));
    const jailRoleId = data[message.guild.id]?.jailRole;
    const jailed = data[message.guild.id]?.jailedUsers || {};

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.reply({
      embeds: [new EmbedBuilder()
        .setColor("Red")
        .setDescription("❌ Kullanıcı bulunamadı!")
        .setFooter({ text: config.footer, iconURL: client.user.displayAvatarURL() })
      ]
    });

    const roles = jailed[member.id];
    if (!roles) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("Orange")
          .setDescription("⚠️ Bu kullanıcıya ait kayıtlı rol bulunamadı.")
          .setFooter({ text: config.footer, iconURL: client.user.displayAvatarURL() })
        ]
      });
    }

    try {
      await member.roles.set(roles);
      delete jailed[member.id];
      data[message.guild.id].jailedUsers = jailed;
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Jail'den Çıkarıldı")
          .setDescription(`${member} kullanıcısı jail'den çıkarıldı ve eski rolleri geri verildi.`)
          .setFooter({ text: config.footer, iconURL: client.user.displayAvatarURL() })
          .setTimestamp()
        ]
      });
    } catch {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setColor("Red")
          .setDescription("❌ Roller geri verilirken bir hata oluştu.")
          .setFooter({ text: config.footer, iconURL: client.user.displayAvatarURL() })
        ]
      });
    }
  }
};

const fs = require('fs');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const AYAR_PATH = './durumrolAyar.json';

// JSON'dan ayarları yükle veya boş oluştur
let durumRolAyar = {};
if (fs.existsSync(AYAR_PATH)) {
  durumRolAyar = JSON.parse(fs.readFileSync(AYAR_PATH, 'utf8'));
}

// Ayarları kaydetme fonksiyonu
function kaydetAyar() {
  fs.writeFileSync(AYAR_PATH, JSON.stringify(durumRolAyar, null, 2));
}

module.exports = {
  name: "durumrol",
  description: "Kullanıcının custom status durumuna göre otomatik rol verir.",
  usage: ".durumrol [yazı] <rol_id>",
  category: "moderasyon",

  execute: async (client, message, args) => {
    const embed = new EmbedBuilder().setColor("#2f3136");

    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      embed.setDescription("> > **Bu komutu kullanmak için `Rolleri Yönet` yetkin olmalı!**");
      return message.reply({ embeds: [embed] });
    }

    const text = args[0];
    const roleId = args[1];

    if (!text || !roleId) {
      embed.setDescription("> > **Kullanım:** `.durumrol [yazı] <rol_id>`");
      return message.reply({ embeds: [embed] });
    }

    const role = message.guild.roles.cache.get(roleId);
    if (!role) {
      embed.setDescription("> > **Geçerli bir rol ID'si girmen gerekiyor!**");
      return message.reply({ embeds: [embed] });
    }

    if (role.position >= message.guild.members.me.roles.highest.position) {
      embed.setDescription("> > **Rolüm, vermek istediğin rolden daha yüksek veya aynı pozisyonda olmalı!**");
      return message.reply({ embeds: [embed] });
    }

    durumRolAyar[message.guild.id] = {
      text: text.toLowerCase(),
      roleId: role.id
    };

    kaydetAyar();

    embed.setDescription(`> > **Durumunda "${text}" geçen kullanıcılara otomatik olarak ${role} rolü verilecek.**`);
    message.reply({ embeds: [embed] });
  }
};

const {
  Client,
  GatewayIntentBits,
  ActivityType,
  EmbedBuilder,
  Events,
  PermissionFlagsBits
} = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
  ],
});

client.commands = new Map();

// Komutları yükle
const categories = ['Genel Üye', 'Owner', 'Yetkili'];
for (const category of categories) {
  const commandsPath = path.join(__dirname, 'src', category);
  if (!fs.existsSync(commandsPath)) continue;

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandsPath, file));
      if (!command.name) {
        console.warn(`[UYARI] ${file} dosyasında 'name' export edilmemiş.`);
        continue;
      }
      client.commands.set(command.name, command);
    } catch (err) {
      console.error(`[HATA] Komut yüklenirken hata oluştu: ${file}`, err);
    }
  }
}

// MongoDB bağlantısı
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ | MongoDB bağlantısı sağlandı."))
.catch(err => console.error("❌ | MongoDB bağlantı hatası:", err));

// Eventleri yükle
const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));
  for (const file of eventFiles) {
    try {
      const event = require(path.join(eventsPath, file));
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } catch (err) {
      console.error(`[HATA] Event yüklenirken hata oluştu: ${file}`, err);
    }
  }
}

client.on('ready', () => {
  console.log(`🗽 ${client.user.tag} olarak giriş yapıldı!`);

  const durumlar = Array.isArray(config.botDurum)
    ? config.botDurum.filter(d => typeof d === 'string')
    : [config.botDurum];

  if (durumlar.length === 0) {
    console.warn("⚠️ config.json'da geçerli hiçbir botDurum yok.");
    return;
  }

  let i = 0;
  setInterval(() => {
    client.user.setPresence({
      status: 'dnd',
      activities: [{
        name: durumlar[i],
        type: ActivityType.Playing
      }]
    });
    i = (i + 1) % durumlar.length;
  }, 10000); // 10 saniyede bir durum değiştir

  if (config.voiceChannelID) {
    const channel = client.channels.cache.get(config.voiceChannelID);
    if (!channel || channel.type !== 2) {
      console.warn('Ses kanalı ID geçersiz veya kanal ses kanalı değil!');
      return;
    }

    joinVoiceChannel({
  channelId: config.voiceChannelID,
  guildId: channel.guild.id,
  adapterCreator: channel.guild.voiceAdapterCreator,
  selfMute: false, // Mikrofon açık
  selfDeaf: true   // Kulak sağır (ses duymayacak)
});

    console.log('🔉 Ses kanalına başarıyla katıldı!');
  }
});

// Komut sistemi
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) ||
    [...client.commands.values()].find(cmd => cmd.aliases?.includes(commandName));
  if (!command) return;

  const embed = new EmbedBuilder()
    .setColor("Random")
    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

  try {
    await command.execute(client, message, args, embed);
  } catch (error) {
    console.error('Komut çalıştırılırken hata oluştu:', error);
    message.reply('Komut çalıştırılırken bir hata oluştu!');
  }
});

// Butonla mesaj silme
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith(interaction.member.id)) return;

  if (!interaction.member.permissions.has([
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.Administrator
  ])) {
    return interaction.reply({ content: "> **Bu işlemi yapmak için yetkiniz yok!**", ephemeral: true });
  }

  switch (interaction.customId) {
    case `${interaction.member.id}_delete_10`:
    case `${interaction.member.id}_delete_25`:
    case `${interaction.member.id}_delete_50`:
    case `${interaction.member.id}_delete_100`: {
      const amount = parseInt(interaction.customId.split('_')[2]);
      if (isNaN(amount)) {
        return interaction.reply({ content: '> Geçersiz silme miktarı.', ephemeral: true });
      }
      await interaction.reply({ content: `> **İşlem Başarılı!** ${amount} mesaj silindi.`, ephemeral: true });
      await interaction.message.delete().catch(() => {});
      await interaction.channel.bulkDelete(amount).catch(() => {});
      break;
    }
    case `${interaction.member.id}_delete_iptal`:
      await interaction.reply({ content: `> **İşlem İptal Edildi!**`, ephemeral: true });
      await interaction.message.delete().catch(() => {});
      break;
  }
});

// Otorol sistemi tetikleyici
client.on('guildMemberAdd', async (member) => {
  const otorol = client.commands.get('otorol');
  if (otorol && typeof otorol.onGuildMemberAdd === 'function') {
    await otorol.onGuildMemberAdd(member);
  }
});

// Botu başlat
client.login(config.token);

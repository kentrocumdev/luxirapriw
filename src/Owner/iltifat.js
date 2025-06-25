const { Events, PermissionFlagsBits } = require('discord.js');

let recentMessages = [];
let intervalStarted = false;

const compliments = [
  "Sen bu sunucunun en parlak yıldızısın! ✨",
  "Varlığın bile moral kaynağı 💜",
  "Senin yazdıkların içimizi ısıtıyor 🔥",
  "Bu mesaj tam bir sanat eseri 🎨",
  "Her şey seninle güzel 😇",
  "Senin enerjinle dönüyor bu dünya ⚡",
  "Yüzünü görmek bile yeterli 😍",
  "Senin gibi biri iyi ki var 💖",
  "Aklın da kalbin kadar güzel 🧠❤️",
  "Sen bir tanesin 🫶",
  // ... listeyi yukarıdan tamamladık zaten, burada kesiyorum
  "Sen hep mutlu ol emi 🎈"
];

module.exports = {
  name: "iltifat",
  description: "Sadece yöneticilerin çalıştırabileceği 30 dakikada bir rastgele iltifat reply komutu.",
  async execute(client, message) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("Bu komutu sadece yöneticiler kullanabilir ❌");
    }

    if (intervalStarted) return message.reply("Zaten çalışıyor güzel kardeşim 😎");

    message.reply("İltifat sistemi başlatıldı, her 30 dakikada bir aktif olacak 💌");

    client.on(Events.MessageCreate, (msg) => {
      if (msg.author.bot || msg.channel.id !== message.channel.id) return;
      recentMessages.push(msg);
      if (recentMessages.length > 150) recentMessages.shift();
    });

    setInterval(() => {
      if (recentMessages.length === 0) return;

      const randomMsg = recentMessages[Math.floor(Math.random() * recentMessages.length)];
      const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];

      randomMsg.reply(randomCompliment).catch(() => {});
    }, 1000 * 60 * 30); // 30 dakikada bir

    intervalStarted = true;
  }
};

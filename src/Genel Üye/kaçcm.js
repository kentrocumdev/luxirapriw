const config = require("../../config.json");

module.exports = {
  name: "kaçcm",
  description: "Rastgele 10-30 cm arasında bir uzunluk söyler.",
  aliases: ["kaçcm", "kaç"],
  execute: async (client, message, args) => {
    const min = 10;
    const max = 30;
    const cm = Math.floor(Math.random() * (max - min + 1)) + min;

    const embed = {
      color: 0x00ffff,
      title: "📏 Kaç cm?",
      description: `${message.author}, uzunluğun: **${cm} cm**!`,
      timestamp: new Date(),
      footer: { text: config.footer || "Kentro Developer" }
    };

    message.reply({ embeds: [embed] });
  }
};

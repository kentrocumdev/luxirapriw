const axios = require("axios");
const config = require("../../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "havadurumu",
  description: "Belirtilen şehrin hava durumunu gösterir.",
  usage: ".havadurumu [şehir]",
  aliases: ["weather", "hava"],

  execute: async (client, message, args) => {
    if (!args[0]) return message.reply("Lütfen bir şehir ismi yazınız.");

    const city = args.join(" ");
    const apiKey = config.weatherApiKey;

    try {
      const { data } = await axios.get(`http://api.weatherapi.com/v1/current.json`, {
        params: {
          key: apiKey,
          q: city,
          lang: "tr"
        }
      });

      const embed = new EmbedBuilder()
        .setTitle(`${data.location.name}, ${data.location.country} Hava Durumu`)
        .setDescription(data.current.condition.text)
        .addFields(
          { name: "🌡️ Sıcaklık", value: `${data.current.temp_c} °C`, inline: true },
          { name: "💨 Rüzgar Hızı", value: `${data.current.wind_kph} km/h`, inline: true },
          { name: "💧 Nem", value: `${data.current.humidity}%`, inline: true }
        )
        .setThumbnail(`https:${data.current.condition.icon}`)
        .setColor("Blue")
        .setFooter({ text: config.footer });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply("Şehir bulunamadı veya API hatası oluştu.");
    }
  },
};

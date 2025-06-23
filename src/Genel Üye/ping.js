const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: "ping",
  description: "Botun gecikmesini gösterir.",
  
  execute(client, message, args) {
    const ping = Date.now() - message.createdTimestamp;
    const apiPing = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor('Blurple')
      .setTitle('🏓 Ping Pong!')
      .addFields(
        { name: 'Mesaj Gecikmesi', value: `${ping}ms`, inline: true },
        { name: 'API Gecikmesi', value: `${apiPing}ms`, inline: true }
      )
      .setFooter({ text: config.footer })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};

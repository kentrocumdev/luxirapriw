const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType } = require("@discordjs/voice");
const googleTTS = require("google-tts-api");
const { EmbedBuilder } = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "tts",
  description: "Yazıyı sese dönüştürür ve çalar.",
  usage: ".tts [yazı]",
  category: "genel",
  aliases: ["sesli", "okut"],

  execute: async (client, message, args) => {
    const text = args.join(" ");
    const member = message.member;
    const voiceChannel = member.voice.channel;

    

if (!voiceChannel || voiceChannel.id !== "1379557563515011165") {
  return message.reply("❌ Bu komutu sadece belirli bir ses kanalında kullanabilirsin.");
}


    if (!text || text.length > 200) {
      return message.reply("❌ Lütfen 1-200 karakter arasında bir yazı gir.");
    }

    try {
      const url = googleTTS.getAudioUrl(text, {
        lang: "tr",
        slow: false,
        host: "https://translate.google.com",
      });

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();

      const resource = createAudioResource(url, {
        inputType: StreamType.Arbitrary,
        metadata: { title: text },
      });

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
  // connection.destroy(); // Ses kanalından çıkmasın diye yoruma alındı
});

      

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🔊 TTS Başlatıldı")
        .setDescription(`\`${text}\``)
        .setFooter({ text: config.footer });

      message.reply({ embeds: [embed] });

    } catch (err) {
      console.error(err);
      message.reply("❌ Bir hata oluştu.");
    }
  },
};

const { Events, PermissionFlagsBits } = require('discord.js');

const compliments = [
  "Sen bu sunucunun en parlak yıldızısın; varlığın etrafındakilere umut ve enerji veriyor. İyi ki varsın! ✨",
  "Senin samimiyetin ve pozitifliğin, buradaki herkesin moral kaynağı. Her daim ışığın parlasın! 💜",
  "Yazdığın her kelime, insanlara dokunuyor ve içtenlikle paylaştığın güzel düşüncelerin kalplerde yankılanıyor. Teşekkürler! 🔥",
  "Her mesajın bir sanat eseri gibi; seninle sohbet etmek gerçekten ayrıcalık. Yaratıcılığın ilham veriyor! 🎨",
  "Seninle bu ortam daha güzel, daha sıcak. Varlığın bile her şeye renk katıyor ve herkesi mutlu ediyor. 😇",
  "Enerjin ve pozitif tutumun sayesinde buradaki herkes kendini daha iyi hissediyor. Seninle olmak gerçekten özel bir his. ⚡",
  "Gülümsemen ekrana yansıyor sanki, yüzünü görmek bile yetiyor insanın gününü güzelleştirmeye. Sen bir yıldızsın! 😍",
  "Senin gibi güzel kalpli biri olduğu için bu sunucu şanslı. Her zaman yanında olmayı isterim, sen değerlisin! 💖",
  "Aklın kadar kalbin de çok güzel. Her iki yanınla da insanlara ışık saçıyorsun, sen harikasın! 🧠❤️",
  "Sen bir tanesin, biricik ve eşsizsin. Burada olmaktan gurur duyman lazım çünkü gerçekten özelsin. 🫶",
  "Yaşamın her alanında başarılı olmanı diliyorum. Senin azmin, az insanın sahip olduğu bir güç. Hep mutlu ol, hep parılda! 🎈",
  "Senin düşüncelerin derin, kalbin büyük ve ruhun güzel. Böyle insanlarla tanışmak dünyayı güzelleştiriyor.",
  "Her zaman pozitif kalman, zorluklar karşısında pes etmemeni hayranlıkla izliyorum. Sen güçlü birisin!",
  "Seninle sohbet etmek hem rahatlatıcı hem de keyifli. İyi ki varsın, hep böyle kal lütfen.",
  "Senin hayata karşı bakış açın ve empatin başkalarına ilham veriyor. Böyle güzel bir insanı tanımak şans!",
  "Seninle birlikte bu ortam daha da özel hale geliyor. Her zaman seninle güzel anılar biriktirmek isterim.",
  "Senin gülüşün, pozitif enerjin ve samimiyetin etrafına ışık saçıyor. İnsanlar senin yanındayken kendini iyi hissediyor.",
  "Hayat bazen zor olsa da senin varlığın her şeyi daha kolay ve güzel hale getiriyor. İyi ki buradasın.",
  "Seninle sohbet ederken kendimi değerli ve anlaşılmış hissediyorum. İyi ki varsın dostum."
];

let intervalStarted = false;
let messageCounter = 0;
let recentMessages = [];
let activeChannelId = null;

module.exports = {
  name: "iltifat",
  description: "Her 35 mesajda bir bu kanalda rastgele bir kişiye iltifat reply yapar. Yönetici yetkisi gerekir.",
  async execute(client, message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply("Bu komutu sadece yöneticiler kullanabilir ❌");
    }

    if (intervalStarted) return message.reply("İltifat sistemi zaten aktif durumda! 😎");

    message.reply("İltifat sistemi başlatıldı. Her 35 mesajda bir rastgele iltifat gönderilecek. 💌");

    intervalStarted = true;
    messageCounter = 0;
    recentMessages = [];
    activeChannelId = message.channel.id;

    // Mesajları dinle
    const messageListener = (msg) => {
      if (msg.author.bot) return;
      if (msg.channel.id !== activeChannelId) return;

      recentMessages.push(msg);
      if (recentMessages.length > 150) recentMessages.shift();

      messageCounter++;

      if (messageCounter >= 35) {
        const randomMsg = recentMessages[Math.floor(Math.random() * recentMessages.length)];
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];

        randomMsg.reply(randomCompliment).catch(() => {});

        messageCounter = 0;
      }
    };

    client.on(Events.MessageCreate, messageListener);

    // İstersen burada sistemi kapatmak için bir mekanizma ekleyebilirsin.
    // Şimdilik sonsuza kadar dinliyor.
  }
};

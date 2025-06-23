const JoinLogs = require("../models/JoinModel");
const mongoose = require("mongoose");

module.exports = {
  name: "guildMemberAdd",
  once: false,
  async execute(member) {
    if (!mongoose.connection.readyState) return;

    // Katılım kaydı oluştur
    try {
      await JoinLogs.create({
        userId: member.id,
        guildId: member.guild.id,
        joinedAt: new Date(),
      });
      console.log(`🟢 ${member.user.tag} için katılım kaydı oluşturuldu.`);
    } catch (err) {
      console.error("❌ Katılım kaydı oluşturulamadı:", err);
    }

    // Otorol için kayıtlı rolü bul
    try {
      const data = await JoinLogs.findOne({ guildId: member.guild.id });
      if (!data || !data.autoRoleId) return;

      const role = member.guild.roles.cache.get(data.autoRoleId);
      if (!role) return;

      await member.roles.add(role);
      console.log(`🟢 ${member.user.tag} kullanıcısına otomatik olarak ${role.name} rolü verildi.`);
    } catch (error) {
      console.error("❌ Otorol verirken hata oluştu:", error);
    }
  },
};

const mongoose = require("mongoose");

const joinSchema = new mongoose.Schema({
  userId: String,
  guildId: String,
  joinedAt: Date,
  autoRoleId: String, // Opsiyonel, hangi rol verildiğini tutmak için
});

module.exports = mongoose.models.JoinLogs || mongoose.model("JoinLogs", joinSchema);

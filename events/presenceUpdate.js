client.on("presenceUpdate", async (oldPresence, newPresence) => {
  if (!newPresence.guild) return;

  const ayar = durumRolAyar[newPresence.guild.id];
  if (!ayar) return;

  const role = newPresence.guild.roles.cache.get(ayar.roleId);
  if (!role) return;

  const member = newPresence.member;
  if (!member) return;

  // Custom Status (type 4) kontrolü
  const customStatus = newPresence.activities.find(a => a.type === 4);
  const hasText = customStatus && customStatus.state && customStatus.state.toLowerCase().includes(ayar.text);

  const hasRole = member.roles.cache.has(role.id);

  if (hasText && !hasRole) {
    try {
      await member.roles.add(role);
      console.log(`Rol verildi: ${member.user.tag}`);
    } catch (err) {
      console.error("Rol verilemedi:", err);
    }
  } else if (!hasText && hasRole) {
    try {
      await member.roles.remove(role);
      console.log(`Rol alındı: ${member.user.tag}`);
    } catch (err) {
      console.error("Rol alınamadı:", err);
    }
  }
});

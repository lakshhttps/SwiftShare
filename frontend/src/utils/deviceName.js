export function getDeviceName() {
  const existing = localStorage.getItem("deviceName");
  if (existing) return existing;

  const name = `Device-${Math.floor(1000 + Math.random() * 9000)}`;
  localStorage.setItem("deviceName", name);
  return name;
}

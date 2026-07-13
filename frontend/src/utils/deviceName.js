export function getDeviceName() {
  const existing = sessionStorage.getItem("deviceName");
  if (existing) return existing;

  const name = `Device-${Math.floor(1000 + Math.random() * 9000)}`;
  sessionStorage.setItem("deviceName", name);
  return name;
}

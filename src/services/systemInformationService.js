import systemInformation from 'systeminformation';

export async function getChassis() {
  const chassisInformation = await systemInformation.chassis();
  return {
    manufacturer: chassisInformation.manufacturer,
    model: chassisInformation.model,
    sku: chassisInformation.sku,
    version: chassisInformation.version,
  };
}

export async function getComputerInformation() {
  const computerInformation = await systemInformation.system();
  return {
    manufacturer: computerInformation.manufacturer,
    model: computerInformation.model,
    sku: computerInformation.sku,
    version: computerInformation.version,
  };
}

export async function getCpuInformation() {
  const cpuInformation = await systemInformation.cpu();
  return {
    brand: cpuInformation.brand,
    cores: cpuInformation.cores,
    manufacturer: cpuInformation.manufacturer,
    physicalCores: cpuInformation.physicalCores,
    socket: cpuInformation.socket,
    speed: cpuInformation.speed,
  };
}

export async function getDiskInformation() {
  const disksLayout = await systemInformation.diskLayout();
  return disksLayout.map(diskInformation => ({
    device: diskInformation.device,
    interface: diskInformation.interfaceType,
    name: diskInformation.name,
    size: diskInformation.size,
    type: diskInformation.type,
    vendor: diskInformation.vendor,
  }));
}

export async function getGraphicsInformation() {
  const graphics = await systemInformation.graphics();
  return [
    graphics.controllers.map(graphicInformation => ({
      manufacturer: graphicInformation.vendor,
      model: graphicInformation.model,
      vram: graphicInformation.vram,
    })),
    graphics.displays.map(displayInformation => ({
      builtin: displayInformation.builtin,
      connection: displayInformation.connection,
      main: displayInformation.main,
      manufacturer: displayInformation.vendor,
      model: displayInformation.model,
      resolution: `${displayInformation.resolutionx}x${displayInformation.resolutiony}`,
    })),
  ];
}

export async function getMemoryInformation() {
  const memoryLayout = await systemInformation.memLayout();
  const layout = memoryLayout.map(memoryInformation => ({
    bank: memoryInformation.bank,
    manufacturer: memoryInformation.manufacturer,
    partNumber: memoryInformation.partNum,
    size: memoryInformation.size,
    type: memoryInformation.type,
  }));
  return {
    layout,
    total: layout.map(ram => ram.size).reduce((r1, r2) => r1 + r2),
  };
}

export async function getMotherInformation() {
  const motherInformation = await systemInformation.baseboard();
  return {
    manufacturer: motherInformation.manufacturer,
    model: motherInformation.model,
    version: motherInformation.version,
  };
}

export async function getOsInformation() {
  const osInformation = await systemInformation.osInfo();
  return {
    architecture: osInformation.arch,
    distro: osInformation.distro,
    hostname: osInformation.hostname,
    kernel: osInformation.kernel,
    logoFile: osInformation.logofile,
    osBuild: osInformation.build,
    platform: osInformation.platform,
    release: osInformation.release,
    servicepack: osInformation.servicepack,
    uefi: osInformation.uefi,
  };
}

export function getTimeInformation() {
  const timeInfo = systemInformation.time();
  return {
    current: timeInfo.current,
    timezone: timeInfo.timezone,
    uptime: timeInfo.uptime,
  };
}

export async function getSystemInformation() {
  const [graphics, displays] = await getGraphicsInformation();
  return {
    chassis: await getChassis(),
    computer: await getComputerInformation(),
    cpu: await getCpuInformation(),
    disk: await getDiskInformation(),
    displays,
    graphics,
    memory: await getMemoryInformation(),
    mother: await getMotherInformation(),
    os: await getOsInformation(),
    time: getTimeInformation(),
  };
}

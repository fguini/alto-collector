export function getUsageData(current, newData) {
  return {
    cpu: {
      load: getDataCounters(
        current && current.cpu && current.cpu.load ? current.cpu.load : null,
        newData && newData.cpu && newData.cpu.currentLoad
          ? newData.cpu.currentLoad
          : 0,
      ),
      userLoad: getDataCounters(
        current && current.cpu && current.cpu.userLoad
          ? current.cpu.userLoad
          : null,
        newData && newData.cpu && newData.cpu.currentUserLoad
          ? newData.cpu.currentUserLoad
          : 0,
      ),
      systemLoad: getDataCounters(
        current && current.cpu && current.cpu.systemLoad
          ? current.cpu.systemLoad
          : null,
        newData && newData.cpu && newData.cpu.currentSystemLoad
          ? newData.cpu.currentSystemLoad
          : 0,
      ),
      temperature: getDataCounters(
        current && current.cpu && current.cpu.temperature
          ? current.cpu.temperature
          : null,
        newData && newData.cpu && newData.cpu.temperature
          ? newData.cpu.temperature
          : 0,
      ),
    },
    disk: {
      reads: getDataCounters(
        current && current.disk && current.disk.reads
          ? current.disk.reads
          : null,
        newData && newData.disk && newData.disk.readPerSecond
          ? newData.disk.readPerSecond
          : 0,
      ),
      writes: getDataCounters(
        current && current.disk && current.disk.writes
          ? current.disk.writes
          : null,
        newData && newData.disk && newData.disk.writePerSecond
          ? newData.disk.writePerSecond
          : 0,
      ),
    },
    network: {
      received: getDataCounters(
        current && current.network && current.network.received
          ? current.network.received
          : null,
        newData && newData.network && newData.network.receivedPerSecond
          ? newData.network.receivedPerSecond
          : 0,
      ),
      transfered: getDataCounters(
        current && current.network && current.network.transfered
          ? current.network.transfered
          : null,
        newData && newData.network && newData.network.transferedPerSecond
          ? newData.network.transferedPerSecond
          : 0,
      ),
    },
    ram: {
      cached: getDataCounters(
        current && current.ram && current.ram.cached
          ? current.ram.cached
          : null,
        newData && newData.ram && newData.ram.cached ? newData.ram.cached : 0,
      ),
      free: getDataCounters(
        current && current.ram && current.ram.free ? current.ram.free : null,
        newData && newData.ram && newData.ram.free ? newData.ram.free : 0,
      ),
      used: getDataCounters(
        current && current.ram && current.ram.used ? current.ram.used : null,
        newData && newData.ram && newData.ram.used ? newData.ram.used : 0,
      ),
      total: getDataCounters(
        current && current.ram && current.ram.total ? current.ram.total : null,
        newData && newData.ram && newData.ram.total ? newData.ram.total : 0,
      ),
    },
    process: {
      total: getDataCounters(
        current && current.process && current.process.total
          ? current.process.total
          : null,
        newData && newData.process && newData.process.total
          ? newData.process.total
          : 0,
      ),
      running: getDataCounters(
        current && current.process && current.process.running
          ? current.process.running
          : null,
        newData && newData.process && newData.process.running
          ? newData.process.running
          : 0,
      ),
      blocked: getDataCounters(
        current && current.process && current.process.blocked
          ? current.process.blocked
          : null,
        newData && newData.process && newData.process.blocked
          ? newData.process.blocked
          : 0,
      ),
      sleeping: getDataCounters(
        current && current.process && current.process.sleeping
          ? current.process.sleeping
          : null,
        newData && newData.process && newData.process.sleeping
          ? newData.process.sleeping
          : 0,
      ),
      list: [],
    },
  };
}

function getDataCounters(current, newData) {
  current = current || {};
  newData = newData || 0;
  const currentMax = current.max || 0;
  const currentMin = current.min || 0;
  const list = current.list || [];
  if (!isNaN(newData)) list.push(newData);

  const quantity = list.length;

  return {
    quantity,
    average: ((current.average || 0) + newData) / quantity,
    max: currentMax < newData ? newData : currentMax,
    min: currentMin > newData ? newData : currentMin,
    median: getMedian(list),
    list,
  };
}

function getMedian(values) {
  if (values.length === 0) return 0;
  values.sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
}

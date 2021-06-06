import systemInformation from 'systeminformation';
import moment from 'moment';
import { getDb } from '../plugins/persistence';

export async function cleanUsageInformation(db = null) {
  db = db || getDb();
  const aWeekAgo = moment().subtract(7, 'd');
  return await db('usage').where('createdAt', '<', aWeekAgo.toDate());
}

export async function getCpuInformation() {
  const currentLoad = await systemInformation.currentLoad();
  const cpuTemperature = await systemInformation.cpuTemperature();
  return {
    currentLoad: currentLoad.currentload,
    currentUserLoad: currentLoad.currentload_user,
    currentSystemLoad: currentLoad.currentload_system,
    temperature: cpuTemperature.main,
  };
}

export async function getDiskInformation() {
  const fileSystemStats = await systemInformation.fsStats();
  if (fileSystemStats) {
    return {
      readPerSecond: fileSystemStats.rx_sec,
      writePerSecond: fileSystemStats.tx_sec,
    };
  }
}

export async function getNetworkInformation() {
  const networkStats = await systemInformation.networkStats();
  const defaultNetworkStats = networkStats[0];
  if (defaultNetworkStats) {
    return {
      receivedPerSecond: defaultNetworkStats.rx_sec,
      transferedPerSecond: defaultNetworkStats.tx_sec,
    };
  }
}

export async function getRamInformation() {
  const memoryStats = await systemInformation.mem();
  return {
    free: memoryStats.free,
    used: memoryStats.used,
    cached: memoryStats.cached,
    total: memoryStats.total,
  };
}

export async function getProcessInformation() {
  const processes = await systemInformation.processes();
  return {
    total: processes.all,
    running: processes.running,
    blocked: processes.blocked,
    sleeping: processes.sleeping,
    list: processes.list.map(process => ({
      id: process.pid,
      name: process.name,
      cpuUsage: process.pcpu,
      memoryUsage: process.pmem,
      started: process.started,
      state: process.state,
    })),
  };
}

export async function getUsageInformation() {
  return {
    cpu: await getCpuInformation(),
    disk: await getDiskInformation(),
    network: await getNetworkInformation(),
    ram: await getRamInformation(),
    process: await getProcessInformation(),
  };
}

export async function getSavedUsageData() {
  const db = getDb();
  return await db
    .select('*')
    .from('usage')
    .orderBy('createdAt');
}

export async function saveUsageData(createdAt, data) {
  const db = getDb();
  await db('usage').insert({
    createdAt,
    data: JSON.stringify(data),
  });
}

export async function deleteUsageData(ids = []) {
  const db = getDb();
  await db('usage')
    .where(builder => builder.whereIn('id', ids))
    .delete();
}

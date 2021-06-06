import axios from 'axios';
import { getDeviceInfo } from './deviceService';

export async function systemStart(systemInformation) {
  try {
    const { id, machineId } = await getDeviceInfo();
    const res = await axios.post('http://localhost:3000/system/start', {
      id,
      machineId,
      systemInformation,
    });

    if (res.status >= 300) throw Error(`${res.statusText}: ${res.data}`);

    return res.data;
  } catch (error) {
    console.error(`Error on system start push data: ${error}`);
    throw error;
  }
}

export async function usageStatistics(usageInformation) {
  try {
    const { id, machineId } = await getDeviceInfo();
    const res = await axios.post('http://localhost:3000/statistics/usage', {
      id,
      machineId,
      usageInformation,
    });

    if (res.status >= 300) throw Error(`${res.statusText}: ${res.data}`);

    return res.data;
  } catch (error) {
    console.error(`Error on system start push data: ${error}`);
    throw error;
  }
}

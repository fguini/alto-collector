import Axios from 'axios';
import { getDb } from '../plugins/persistence';

export async function getDeviceInfo(db = null) {
  db = db || getDb();
  return await db('device').first();
}

export async function getDevice() {
  try {
    const deviceInfo = await getDeviceInfo();
    const uri = `http://localhost:3000/device/${deviceInfo.id}?machineId=${deviceInfo.machineId}`;
    const res = await Axios.get(uri);
    return res.data.id
      ? res.data
      : {
          ...deviceInfo,
          companyId: 'n1u2n912n91n2912n',
          companyName: 'Morosaurio S.A.',
          image:
            'https://www.kingstonvetclinic.com/wp-content/uploads/sites/50/2020/01/bernese.jpg',
          name: 'La PC de Facu',
        };
  } catch (error) {
    console.error(`Error getting device info: ${error}`); // TODO handle logs
    throw error;
  }
}

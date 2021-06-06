import moment from 'moment';
import Observer from '../observer';
import {
  deleteUsageData,
  getUsageInformation,
  getSavedUsageData,
  saveUsageData,
} from '../../services/usageService';
import { getUsageData } from '../../utils/statisticsUtils';
import { usageStatistics } from '../../services/pushService';
import { getSetting } from '../../services/settingService';

const observer = new Observer();
export const once = observer.once;
export const subscribe = observer.subscribe;
export const unsubscribe = observer.unsubscribe;

const m = Math.random();

export async function handler(currentTime) {
  // for the UI subscription
  let usage = null;
  if (observer.hasSubscribers()) {
    usage = await getUsageInformation();
    observer.publish({ usage, m });
  }

  // the data is saved for creating statistics
  if (await itsTimeToCollect(currentTime))
    await collectData(currentTime, usage);
  // the data is pushed
  if (await itsTimeToPush(currentTime)) await pushData();
}

async function collectData(currentTime, usageInformation = null) {
  const usage = usageInformation || (await getUsageInformation());
  await saveUsageData(currentTime, usage);
}

async function pushData() {
  const savedData = await getSavedUsageData();
  let currentData = null;
  let idsToDelete = [];
  for (let usage of savedData) {
    currentData = getUsageData(currentData, JSON.parse(usage.data));
    idsToDelete.push(usage.id);
    if (await itsTimeToPush(usage.createdAt)) {
      try {
        await usageStatistics(currentData);
        await deleteUsageData(idsToDelete);
      } catch (error) {
        console.error('Error pushing data: ', error);
        // TODO save calculated data
      }
      currentData = null;
      idsToDelete = [];
    }
  }
}

async function itsTimeToPush(time) {
  return await itsTime('pushTime', time, 1800000);
}

async function itsTimeToCollect(time) {
  return await itsTime('collectTime', time, 5000);
}

async function itsTime(settingKey, time, defaultTime) {
  const timeTo = (await getSetting(settingKey)).value || defaultTime;
  let timeToInUnits = moment.duration(timeTo).asSeconds();
  let currentTimeInUnits = moment(time).second();
  if (timeToInUnits >= 60) {
    if (currentTimeInUnits !== 0) return false;
    timeToInUnits = moment.duration(timeTo).asMinutes();
    currentTimeInUnits = moment(time).minute();
  }
  return currentTimeInUnits % timeToInUnits === 0;
}

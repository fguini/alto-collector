import { ipcRenderer } from 'electron';
import { getDb } from '../plugins/persistence';

export async function setStartWithSystem(value) {
  await ipcRenderer.invoke('set-start-with-system', value);
  await upsertSetting('startWithSystem', value);
}

export async function getSettings() {
  const db = getDb();
  const settings = await db.select('*').from('setting');
  return settings.map(setting => {
    setting.value = JSON.parse(setting.value);
    return setting;
  });
}

export async function getSetting(key) {
  const db = getDb();
  const setting = await db
    .select('*')
    .from('setting')
    .where('key', key)
    .first();
  if (setting) setting.value = JSON.parse(setting.value);
  return setting;
}

export async function updateSetting(key, value) {
  const db = getDb();
  await db('setting')
    .where('key', key)
    .update({ key, value: JSON.stringify(value) });
}

export async function addSetting(key, value) {
  const db = getDb();
  await db('setting').insert({ key, value: JSON.stringify(value) });
}

export async function upsertSetting(key, value) {
  const setting = await getSetting(key);
  if (!setting) await addSetting(key, value);
  else await updateSetting(key, value);
}

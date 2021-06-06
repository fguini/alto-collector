import Observer from '../observer';
import { getSystemInformation } from '../../services/systemInformationService';
import { systemStart } from '../../services/pushService';

const observer = new Observer();
export const once = observer.once;
export const subscribe = observer.subscribe;
export const unsubscribe = observer.unsubscribe;

export async function handler() {
  const systemInformation = await getSystemInformation();
  observer.publish(systemInformation, true);
  await systemStart(systemInformation);
}

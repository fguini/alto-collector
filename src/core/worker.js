import { scheduleJob } from 'node-schedule';
import Observer from './observer';

const observer = new Observer();
function loopHandler(currentTime) {
  try {
    observer.publish(currentTime);
  } catch (error) {
    console.error('Fatal error in main loop: ', error);
    stop();
  }
}
let appLoop = null;

export const once = observer.once;
export const subscribe = observer.subscribe;
export const unsubscribe = observer.unsubscribe;

export function run() {
  appLoop = scheduleJob('*/5 * * * * *', loopHandler);
}

export function stop() {
  if (appLoop) {
    appLoop.cancel();
    appLoop = null;
  }
}

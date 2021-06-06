import { getDb } from '../plugins/persistence';
import { cleanUsageInformation } from './usageService';
import { getDeviceInfo } from './deviceService';
import { getServerStatus, checkInternetConnection } from './healthService';

const CHECKS_INIT = 'INIT';
const CHECK_START = 'START';
const CHECK_END = 'END';
const CHECKS_DONE = 'DONE';

export const checkDatabase = async () => {
  try {
    const db = getDb();
    await db.migrate.latest();
    await db.seed.run();
    await cleanUsageInformation();
    return await getDeviceInfo(db);
  } catch (error) {
    console.error(error); // TODO error logs
    throw error;
  }
};

export const checkNetwork = async () => {
  try {
    await checkInternetConnection();
    return await getServerStatus();
  } catch (error) {
    console.error('Error in network connection: ', error); // TODO error logs
    throw error;
  }
};

const INITIAL_CHECKS = [{ checkDatabase }, { checkNetwork }];

export async function runInitialChecks(init, startCheck, endCheck, done) {
  const checks = [...INITIAL_CHECKS];

  if (init)
    await init({
      checks: checks.map(c => Object.keys(c)[0]),
      status: CHECKS_INIT,
    });

  for (let check of checks) {
    const name = Object.keys(check)[0];
    try {
      if (startCheck) await startCheck({ check: name, status: CHECK_START });
      await check[name]();
    } catch (error) {
      console.error('Error in checks: ', error); // TODO error logs
      check.error = error;
    }
    if (endCheck)
      await endCheck({ check: name, status: CHECK_END, error: check.error });
  }

  if (done)
    await done({
      checks: checks.map(c => Object.keys(c)[0]),
      status: CHECKS_DONE,
    });
}

/*
 * For testing the splashscreen
 *
  const INITIAL_CHECKS = [
    { checkDatabase },
    { dummyCheck1: dummyCheck },
    { dummyCheck2: dummyCheck },
    { dummyCheck3: dummyCheck },
    { dummyCheck4: dummyCheck },
    { dummyCheck5: dummyCheck },
  ];

  function dummyCheck() {
    return new Promise(resolve => setTimeout(() => resolve(), 3000));
  }
 *
*/

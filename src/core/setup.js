import { runInitialChecks } from '../services/setupService';

export const setup = () =>
  runInitialChecks().catch(error => `Error in setup: ${error}`);

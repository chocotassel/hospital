import { configure, getLogger } from 'log4js';
import config from '../../config';

configure(config.loggerConfig);

export const fileLogger = getLogger('file');
export const consoleLogger = getLogger('console');
export const accessLogger = getLogger('access');
export const dbLogger = getLogger('db');

export default getLogger();
export const logger = {
  info: (msg: string, ...args: any[]): void => {
    console.log(`[INFO] ${new Date().toISOString()}: ${msg}`, ...args);
  },
  warn: (msg: string, ...args: any[]): void => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${msg}`, ...args);
  },
  error: (msg: string, err?: any, ...args: any[]): void => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`, err || '', ...args);
  }
};

export default logger;

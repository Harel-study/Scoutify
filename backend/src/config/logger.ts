/**
 * @module logger
 *
 * Standardized logging utility for application-wide logging.
 * Formats log messages with severity levels and ISO timestamp metadata.
 */

/**
 * Logger utility object wrapping standard console output with timestamps and severity prefixes.
 */
export const logger = {
  /**
   * Logs an informational message.
   *
   * @param  {string}   msg   Log message.
   * @param  {...any[]} args  Optional additional context arguments or objects.
   */
  info: (msg: string, ...args: any[]): void => {
    console.log(`[INFO] ${new Date().toISOString()}: ${msg}`, ...args);
  },
  /**
   * Logs a warning message.
   *
   * @param  {string}   msg   Warning description.
   * @param  {...any[]} args  Optional context arguments.
   */
  warn: (msg: string, ...args: any[]): void => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${msg}`, ...args);
  },
  /**
   * Logs an error message and optional error object or stack trace.
   *
   * @param  {string}   msg   Error description.
   * @param  {any}      [err] Error instance or diagnostic details.
   * @param  {...any[]} args  Additional parameters.
   */
  error: (msg: string, err?: any, ...args: any[]): void => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`, err || '', ...args);
  }
};

export default logger;

/**
 * Prints a keep-alive message every 13 seconds to keep the server log active.
 *
 * @param interval The interval in milliseconds (default: 13000ms)
 */
export const startKeepAlive = (interval: number = 13000) => {
  console.log(`📡 Keep-alive service initialized. Logs will print every ${interval / 1000} seconds.`);

  // Periodic log message
  setInterval(() => {
    console.log(`⏱️ Keep-alive: Server is still active at ${new Date().toLocaleTimeString()}`);
  }, interval);
};

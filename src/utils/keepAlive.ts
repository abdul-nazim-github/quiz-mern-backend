import http from 'http';
import https from 'https';

/**
 * Keeps the server active by either logging or pinging the URL.
 *
 * @param url The URL to ping (optional)
 * @param interval The interval in milliseconds (default: 13000ms)
 */
export const startKeepAlive = (url?: string, interval: number = 13000) => {
  const isProd = process.env.NODE_ENV === 'production';

  console.log(`📡 Keep-alive service active. Mode: ${isProd ? 'HTTP Ping' : 'Log only'}`);

  setInterval(() => {
    const time = new Date().toLocaleTimeString();

    if (isProd && url) {
      const protocol = url.startsWith('https') ? https : http;
      protocol.get(url, (res) => {
        // Ping success
      }).on('error', (err: Error) => {
        console.error(`❌ Keep-alive: Ping failed: ${err.message}`);
      });
    } else {
      console.log(`⏱️ Keep-alive: Server is active at ${time}`);
    }
  }, interval);
};

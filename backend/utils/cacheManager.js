import NodeCache from 'node-cache';

// Create a new cache instance with default settings
// stdTTL: time to live in seconds for every generated cache element (default: 0 - unlimited)
// checkperiod: time in seconds to check for expired keys (default: 600)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

export default cache;

// clear-cache.js
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

async function clearCache() {
    try {
        console.log('🗑️ Clearing Redis cache...');
        
        // Clear all keys
        await redis.flushall();
        
        console.log('✅ Redis cache cleared successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to clear cache:', error);
        process.exit(1);
    }
}

clearCache();
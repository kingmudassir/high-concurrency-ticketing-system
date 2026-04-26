// worker.ts (at root level)
import 'dotenv/config';
import '../lib/queue/reservation-worker';
import '../lib/queue/purchase-worker';
import '../lib/queue/cleanup-worker';

console.log('🚀 BullMQ workers started...');
console.log('✅ Reservation worker running');
console.log('✅ Purchase worker running');
console.log('✅ Cleanup worker running');

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down workers...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down workers...');
    process.exit(0);
});
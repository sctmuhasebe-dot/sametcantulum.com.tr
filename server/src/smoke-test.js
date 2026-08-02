// server/src/smoke-test.js
import app from './app.js';

const testServer = app.listen(0, () => {
  console.log('✅ Smoke test başarılı: app.js ve tüm route/middleware import zinciri sorunsuz yükleniyor.');
  testServer.close(() => process.exit(0));
});

testServer.on('error', (err) => {
  console.error('❌ Smoke test BAŞARISIZ:', err.message);
  process.exit(1);
});
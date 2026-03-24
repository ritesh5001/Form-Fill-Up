const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const startEmailWorker = require('./workers/emailWorker');

const startServer = async () => {
  try {
    await connectDB();
    if (env.ENABLE_EMAIL_WORKER) {
      startEmailWorker();
    }

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed', error);
    process.exit(1);
  }
};

startServer();

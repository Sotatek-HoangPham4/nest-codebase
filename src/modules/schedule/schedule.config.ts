import { registerAs } from '@nestjs/config';

export default registerAs('schedule', () => ({
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD ?? undefined,
  },
  bull: {
    // optional global options
    defaultJobOptions: {
      attempts: Number(process.env.JOB_ATTEMPTS ?? 3),
      backoff: {
        type: 'exponential',
        delay: Number(process.env.JOB_BACKOFF_MS ?? 1000),
      },
    },
  },
}));

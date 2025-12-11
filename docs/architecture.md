src/
├─ config/
│ ├─ database.config.ts
│ ├─ ormconfig.ts
│ ├─ auth.config.ts
│ ├─ cache.config.ts
│ ├─ app.config.ts
│ └─ logging.config.ts
│
├─ infrastructure/
│ ├─ database/
│ │ ├─ entities/
│ │ ├─ migrations/
│ │ ├─ repositories/
│ │ ├─ seeds/
│ │ └─ database.module.ts
│ │
│ ├─ cache/
│ │ ├─ redis.module.ts
│ │ ├─ redis.service.ts
│ │ └─ redis.config.ts
│ │
│ ├─ http-client/
│ │ ├─ axios.module.ts
│ │ ├─ axios.service.ts
│ │ └─ interceptors/
│ │ └─ axios-logging.interceptor.ts
│ │
│ ├─ messaging/
│ │ ├─ kafka/
│ │ │ ├─ kafka.module.ts
│ │ │ ├─ kafka.producer.ts
│ │ │ ├─ kafka.consumer.ts
│ │ │ └─ kafka.config.ts
│ │ ├─ rabbitmq/
│ │ │ └─ rabbitmq.module.ts
│ │ └─ events/
│ │ ├─ event-bus.module.ts
│ │ ├─ event.publisher.ts
│ │ └─ event.subscriber.ts
│ │
│ ├─ storage/
│ │ ├─ s3.module.ts
│ │ ├─ s3.service.ts
│ │ ├─ local-storage.service.ts
│ │ └─ storage.interface.ts
│ │
│ ├─ monitoring/
│ │ ├─ metrics.module.ts
│ │ ├─ prometheus.service.ts
│ │ └─ opentelemetry/
│ │ ├─ otel.module.ts
│ │ └─ otel.tracer.ts
│ │
│ ├─ security/
│ │ ├─ rate-limit.module.ts
│ │ ├─ throttler.module.ts
│ │ ├─ cors.config.ts
│ │ ├─ helmet.config.ts
│ │ └─ csrf.config.ts
│ │
│ └─ health/
│ ├─ health.module.ts
│ ├─ health.controller.ts
│ └─ indicators/
│ ├─ db.indicator.ts
│ ├─ redis.indicator.ts
│ └─ kafka.indicator.ts
│
├─ modules/
│ ├─ auth/...
│ ├─ session/...
│ ├─ user/...
│ │
│ ├─ notification/
│ │ ├─ application/
│ │ │ ├─ use-cases/
│ │ │ │ ├─ send-email.use-case.ts
│ │ │ │ ├─ send-sms.use-case.ts
│ │ │ │ └─ send-push.use-case.ts
│ │ │ └─ dtos/
│ │ │ └─ send-notification.dto.ts
│ │ ├─ infrastructure/
│ │ │ ├─ email/
│ │ │ │ └─ mail.service.ts
│ │ │ ├─ sms/
│ │ │ │ └─ sms.service.ts
│ │ │ └─ push/
│ │ │ └─ push.service.ts
│ │ └─ notification.module.ts
│ │
│ ├─ permission/
│ │ ├─ application/
│ │ ├─ domain/
│ │ ├─ infrastructure/
│ │ └─ permission.module.ts
│ │
│ ├─ organization/ (tổ chức / team)
│ │ ├─ application/
│ │ ├─ domain/
│ │ ├─ infrastructure/
│ │ └─ organization.module.ts
│ │
│ ├─ key-management/
│ │ ├─ application/
│ │ │ └─ use-cases/
│ │ │ ├─ rotate-key.use-case.ts
│ │ │ ├─ decrypt.use-case.ts
│ │ │ └─ encrypt.use-case.ts
│ │ ├─ domain/
│ │ │ ├─ key.entity.ts
│ │ │ └─ key.repository.interface.ts
│ │ ├─ infrastructure/
│ │ │ ├─ kms.service.ts
│ │ │ └─ key.repository.ts
│ │ └─ key-management.module.ts
│ │
│ └─ search/
│ ├─ application/
│ ├─ infrastructure/
│ │ ├─ elasticsearch.module.ts
│ │ └─ elasticsearch.service.ts
│ └─ search.module.ts
│
├─ shared/
│ ├─ constants/
│ ├─ dto/
│ ├─ exceptions/
│ ├─ filters/
│ │ └─ http-exception.filter.ts
│ ├─ interceptors/
│ │ ├─ response.interceptor.ts
│ │ └─ logging.interceptor.ts
│ ├─ guards/
│ │ ├─ auth.guard.ts
│ │ └─ roles.guard.ts
│ ├─ decorators/
│ │ ├─ roles.decorator.ts
│ │ ├─ user.decorator.ts
│ │ └─ public.decorator.ts
│ ├─ interfaces/
│ │ ├─ response.interface.ts
│ │ ├─ pagination.interface.ts
│ │ └─ base-repository.interface.ts
│ ├─ middleware/
│ │ └─ request-logger.middleware.ts
│ ├─ utils/
│ ├─ validators/
│ └─ app.module.ts
│
├─ create-module.ts
└─ main.ts

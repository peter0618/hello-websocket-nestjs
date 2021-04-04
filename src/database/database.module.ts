import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const appEnv = configService.get<string>('APP_ENV');

        const databaseHost = configService.get<string>('POSTGRE_HOST') || 'localhost';
        const databasePort = configService.get<string>('POSTGRE_PORT') || '5432';
        const databaseUser = configService.get<string>('POSTGRE_USER') || 'root';
        const databaseUserPassword = configService.get<string>('POSTGRE_PASS') || '';
        const databaseName = configService.get<string>('POSTGRE_DATABASE_NAME') || 'peter_chat';

        const isDevelopment = appEnv === 'dev';

        return {
          // dbms 유형
          type: 'postgres',
          synchronize: isDevelopment,
          debug: false,
          logging: isDevelopment ? ['query', 'log', 'error', 'warn', 'info'] : ['info'],
          // TODO timezone (Asia/Seoul) 을 아래처럼 offset (+09:00) 으로 변경할 수 있는지 확인해보자.
          // timezone: '+09:00',
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          host: databaseHost,
          port: Number.parseInt(databasePort, 10),
          username: databaseUser,
          password: databaseUserPassword,
          database: databaseName,
          extra: {
            // The maximum number of connections to create at once. (Default: 10)
            // TODO 이게 적용되는지 확인해봐야합니다.
            connectionLimit: 10,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}

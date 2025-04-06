import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { InfrastructureModule } from "./infrastructure/InfrastructureModule";

/**
 * アプリケーション全体のモジュール定義
 * - 各レイヤーモジュールを統合
 * - アプリケーションのエントリーポイント
 * @author Fullness
 * @date 2025-03-10
 * @date 2025-03-24
 * @version 1.1.0
 */
@Module({
    imports: [
        // JWTで利用
        ConfigModule.forRoot({ isGlobal: true }), // 環境変数を読み込む
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: {
                expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
              },
            }),
            inject: [ConfigService],
        }),
        InfrastructureModule    ,// インフラストラクチャ層のモジュール定義
    ],
    exports: [JwtModule],
})
export class AppModule {}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CategoryModel } from "./typeorm/model/CategoryModel";
import { ProductModel } from "./typeorm/model/ProductModel";
import { CategoryModelConverter } from "./typeorm/adapter/CategoryModelConverter";
import { CategoryModelRestorer } from "./typeorm/adapter/CategoryModelRestorer";
import { ProductModelConverter } from "./typeorm/adapter/ProductModelConverter";
import { ProductModelRestorer } from "./typeorm/adapter/ProductModelRestorer";

/**
 * インフラストラクチャ層のモジュール定義
 * - データベース接続情報
 * - TypeORMエンティティおよびリポジトリ
 * - データモデルアダプタの登録
 * @author Fullness
 * @date 2025-03-10
 * @version 1.0.0
 */
@Module({
    imports: [
        // 環境変数を利用するために ConfigModule をロード
        ConfigModule.forRoot({
            isGlobal: true, // アプリケーション全体で利用可能にする
            envFilePath: ".env",
        }),
        // データベース接続情報を環境変数から設定 (TypeORM設定)
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: configService.get<string>("DB_TYPE") as any, // データベースの種類
                host: configService.get<string>("DB_HOST"),// ホスト名
                port: configService.get<number>("DB_PORT"),// ポート番号
                username: configService.get<string>("DB_USERNAME"),// ユーザー名
                password: configService.get<string>("DB_PASSWORD"),// パスワード
                database: configService.get<string>("DB_DATABASE"),// データベース名
                // 利用するエンティティ
                entities: [
                    ProductModel, 
                    CategoryModel,
                ],
                synchronize: configService.get<boolean>("DB_SYNCHRONIZE"),// 本番環境では必ずfalseに設定
                logging: configService.get<boolean>("DB_LOGGING"),// SQLログの出力を有効化
            }), 
        }),
        
        /*
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST, // MySQLサービス名 'mysql'
            port: parseInt(process.env.DB_PORT || '3306', 10), // DB_PORTがundefinedの場合は3306を使用
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [CategoryModel, ProductModel],  // 使っているエンティティを追加
            synchronize: process.env.DB_SYNCHRONIZE === 'true', 
            logging: process.env.DB_LOGGING === 'true',
        }),
        */
        // TypeORMエンティティをモジュールに登録
        TypeOrmModule.forFeature([
            ProductModel, 
            CategoryModel,
        ]),
    ],
    providers: [
        // CategoryエンティティからCategoryModelへの変換
        {
            provide: 'CategoryModelConverter',
            useClass: CategoryModelConverter,
        },
        // CategoryModelからCategoryエンティティを復元
        {
            provide: 'CategoryModelRestorer',
            useClass: CategoryModelRestorer,
        },
        // ProductエンティティからProductModelへの変換
        {
            provide: 'ProductModelConverter',
            useClass: ProductModelConverter,
        },
        // ProductModelからProductエンティティを復元
        {
            provide: 'ProductModelRestorer',
            useClass: ProductModelRestorer,
        },
    ],
    exports: [
        'CategoryModelConverter'        ,
        'CategoryModelRestorer'         ,
        'ProductModelConverter'         ,
        'ProductModelRestorer'          ,
    ]
})
export class InfrastructureModule {}
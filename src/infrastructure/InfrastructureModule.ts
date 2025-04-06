import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CategoryModel } from "./typeorm/model/CategoryModel";
import { ProductModel } from "./typeorm/model/ProductModel";
import { CategoryModelConverter } from "./typeorm/adapter/CategoryModelConverter";
import { CategoryModelRestorer } from "./typeorm/adapter/CategoryModelRestorer";
import { ProductModelConverter } from "./typeorm/adapter/ProductModelConverter";
import { ProductModelRestorer } from "./typeorm/adapter/ProductModelRestorer";
import { CategoryRepositoryImpl } from "./typeorm/repository/CategoryRepositoryImpl";
import { ProductRepositoryImpl } from "./typeorm/repository/ProductRepositoryImpl";

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
        // 商品カテゴリリポジトリ
        {
            provide: 'CategoryRepository' ,
            useClass: CategoryRepositoryImpl,
        },
        // 商品リポジトリ
        {
            provide: 'ProductRepository' ,
            useClass: ProductRepositoryImpl,
        },
    ],
    exports: [
        'CategoryModelConverter'        ,
        'CategoryModelRestorer'         ,
        'ProductModelConverter'         ,
        'ProductModelRestorer'          ,
        'CategoryRepository'            ,
        'ProductRepository'             ,
    ]
})
export class InfrastructureModule {}
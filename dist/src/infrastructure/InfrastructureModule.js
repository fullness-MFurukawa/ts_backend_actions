"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const CategoryModel_1 = require("./typeorm/model/CategoryModel");
const ProductModel_1 = require("./typeorm/model/ProductModel");
const CategoryModelConverter_1 = require("./typeorm/adapter/CategoryModelConverter");
const CategoryModelRestorer_1 = require("./typeorm/adapter/CategoryModelRestorer");
const ProductModelConverter_1 = require("./typeorm/adapter/ProductModelConverter");
const ProductModelRestorer_1 = require("./typeorm/adapter/ProductModelRestorer");
/**
 * インフラストラクチャ層のモジュール定義
 * - データベース接続情報
 * - TypeORMエンティティおよびリポジトリ
 * - データモデルアダプタの登録
 * @author Fullness
 * @date 2025-03-10
 * @version 1.0.0
 */
let InfrastructureModule = class InfrastructureModule {
};
exports.InfrastructureModule = InfrastructureModule;
exports.InfrastructureModule = InfrastructureModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // 環境変数を利用するために ConfigModule をロード
            config_1.ConfigModule.forRoot({
                isGlobal: true, // アプリケーション全体で利用可能にする
                envFilePath: ".env",
            }),
            // データベース接続情報を環境変数から設定 (TypeORM設定)
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: configService.get("DB_TYPE"), // データベースの種類
                    host: configService.get("DB_HOST"), // ホスト名
                    port: configService.get("DB_PORT"), // ポート番号
                    username: configService.get("DB_USERNAME"), // ユーザー名
                    password: configService.get("DB_PASSWORD"), // パスワード
                    database: configService.get("DB_DATABASE"), // データベース名
                    // 利用するエンティティ
                    entities: [
                        ProductModel_1.ProductModel,
                        CategoryModel_1.CategoryModel,
                    ],
                    synchronize: configService.get("DB_SYNCHRONIZE"), // 本番環境では必ずfalseに設定
                    logging: configService.get("DB_LOGGING"), // SQLログの出力を有効化
                }),
            }),
            // TypeORMエンティティをモジュールに登録
            typeorm_1.TypeOrmModule.forFeature([
                ProductModel_1.ProductModel,
                CategoryModel_1.CategoryModel,
            ]),
        ],
        providers: [
            // CategoryエンティティからCategoryModelへの変換
            {
                provide: 'CategoryModelConverter',
                useClass: CategoryModelConverter_1.CategoryModelConverter,
            },
            // CategoryModelからCategoryエンティティを復元
            {
                provide: 'CategoryModelRestorer',
                useClass: CategoryModelRestorer_1.CategoryModelRestorer,
            },
            // ProductエンティティからProductModelへの変換
            {
                provide: 'ProductModelConverter',
                useClass: ProductModelConverter_1.ProductModelConverter,
            },
            // ProductModelからProductエンティティを復元
            {
                provide: 'ProductModelRestorer',
                useClass: ProductModelRestorer_1.ProductModelRestorer,
            },
        ],
        exports: [
            'CategoryModelConverter',
            'CategoryModelRestorer',
            'ProductModelConverter',
            'ProductModelRestorer',
        ]
    })
], InfrastructureModule);

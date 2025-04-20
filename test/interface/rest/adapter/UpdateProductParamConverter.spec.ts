import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/AppModule";
import { Converter } from "@src/shared/adapter/Converter";
import { UpdateProductParam } from "@src/interface/rest/param/UpdateProductParam";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";

/**
 * UpdateProductParamConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/interface/rest/adapter/UpdateProductParamConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-04-20
 * @version 1.0.0
 */
describe('UpdateProductParamConverterの単体テスト', () => {
    let app: INestApplication; // NestJSアプリケーションインスタンス
    let converter: Converter<UpdateProductParam, ProductDTO>; // テスト対象のConverter

    /**
     * すべてのテストの前処理
     * - AppModuleを使用してNestJSアプリを初期化
     * - DIコンテナからUpdateProductParamConverterを取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        converter = app.get<Converter<UpdateProductParam, ProductDTO>>('UpdateProductParamConverter');
    });

    /**
     * テスト後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    /**
     * convert() メソッドのテスト
     */
    describe('convert() メソッド', () => {
        it('UpdateProductParam を ProductDTO に正しく変換できる', async () => {
            const param: UpdateProductParam = {
                productId: '123e4567-e89b-12d3-a456-426614174000',
                name: '修正商品',
                price: 999,
            };

            const dto = await converter.convert(param);

            expect(dto).toBeDefined();
            expect(dto.id).toBe(param.productId);
            expect(dto.name).toBe(param.name);
            expect(dto.price).toBe(param.price);
            expect(dto.category).toBeNull(); // このConverterではcategoryはnull固定
        });
    });

    /**
     * convertAll() メソッドの例外確認テスト
     */
    describe('convertAll() メソッド', () => {
        it('convertAll() を呼び出すと未実装エラーになる', async () => {
            const paramList: UpdateProductParam[] = [];

            await expect(async () => {
                await converter.convertAll(paramList);
            }).rejects.toThrow('Method not implemented.');
        });
    });
});

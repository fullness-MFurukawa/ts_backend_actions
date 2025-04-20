import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "@src/AppModule";
import { RegisterProductParamConverter } from "@src/interface/rest/adapter/RegisterProductParamConverter";
import { RegisterProductParam } from "@src/interface/rest/param/RegisterProductParam";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { Converter } from "@src/shared/adapter/Converter";

/**
 * RegisterProductParamConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/interface/rest/adapter/RegisterProductParamConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-04-20
 * @version 1.0.0
 */
describe('RegisterProductParamConverterの単体テスト', () => {
    let app: INestApplication; // NestJSアプリケーションインスタンス
    let converter: Converter<RegisterProductParam, ProductDTO>; // テスト対象のConverter

    /**
     * すべてのテストの前処理
     * - AppModuleからテスト用アプリケーションを生成
     * - RegisterProductParamConverterをDIで取得
     */
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();

        // RegisterProductParamConverterをDIコンテナから取得
        converter = app.get<Converter<RegisterProductParam, ProductDTO>>('RegisterProductParamConverter');
    });

    /**
     * すべてのテストの後処理
     * - NestJSアプリケーションをクリーンアップ
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    /**
     * convert()メソッドのテスト
     * - RegisterProductParamからProductDTOへの変換が正しく行われるかを検証
     */
    describe('convert() メソッド', () => {
        it('RegisterProductParam を ProductDTO に正しく変換できる', async () => {
            // テスト用の入力データ
            const param: RegisterProductParam = {
                name: 'ボールペン',
                price: 150,
                categoryId: '123e4567-e89b-12d3-a456-426614174000',
            };

            // 変換処理を実行
            const dto = await converter.convert(param);

            // 結果の検証
            expect(dto).toBeDefined();
            expect(dto.id).toBeNull(); // idはnullで固定
            expect(dto.name).toBe(param.name);
            expect(dto.price).toBe(param.price);

            expect(dto.category).toBeDefined();
            expect(dto.category!.id).toBe(param.categoryId);
            expect(dto.category!.name).toBe('dummy'); // nameは固定で 'dummy'
        });
    });

    /**
     * convertAll()メソッドのテスト
     * - 未実装なのでエラーが投げられることを検証
     */
    describe('convertAll() メソッド', () => {
        it('convertAll() を呼び出すと未実装エラーになる', async () => {
            const paramList: RegisterProductParam[] = [];
            await expect(converter.convertAll(paramList))
                .rejects.toThrow('Method not implemented.');
        });
    });
});

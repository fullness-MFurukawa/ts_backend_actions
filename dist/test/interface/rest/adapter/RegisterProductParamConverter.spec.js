"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const AppModule_1 = require("../../../../src/AppModule");
const RegisterProductParamConverter_1 = require("../../../../src/interface/rest/adapter/RegisterProductParamConverter");
/**
 * RegisterProductParamConverterの単体テストドライバ
 * [テスト実行コマンド]
 * npx jest test/interface/rest/converter/RegisterProductParamConverter.spec.ts
 * @author Fullness,Inc.
 * @date 2025-04-20
 * @version 1.0.0
 */
describe('RegisterProductParamConverterの単体テスト', () => {
    let app; // NestJSアプリケーションインスタンス
    let converter; // テスト対象のConverter
    /**
     * すべてのテストの前処理
     * - AppModuleからテスト用アプリケーションを生成
     * - RegisterProductParamConverterをDIで取得
     */
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [AppModule_1.AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // RegisterProductParamConverterをDIコンテナから取得
        converter = app.get(RegisterProductParamConverter_1.RegisterProductParamConverter);
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
            const param = {
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
            expect(dto.category.id).toBe(param.categoryId);
            expect(dto.category.name).toBe('dummy'); // nameは固定で 'dummy'
        });
    });
    /**
     * convertAll()メソッドのテスト
     * - 未実装なのでエラーが投げられることを検証
     */
    describe('convertAll() メソッド', () => {
        it('convertAll() を呼び出すと未実装エラーになる', async () => {
            const paramList = [];
            await expect(converter.convertAll(paramList))
                .rejects.toThrow('Method not implemented.');
        });
    });
});

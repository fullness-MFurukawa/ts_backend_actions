import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing/test";
import { ProductDTO } from "@src/application/in/dto/ProductDTO";
import { UpdateProductUsecase } from "@src/application/in/usecase/UpdateProductUsecase";
import { AppModule } from "@src/AppModule";
import { NotFoundException } from "@src/shared/exception/NotFoundException";


/**
 * UpdateProductInteractorのテストドライバ
 * [テスト実行コマンド]
 * npx jest test/application/in/interactor/UpdateProductInteractor.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-15
 * @version 1.0.0
 */
describe('UpdateProductInteractorの単体テスト', () => {
    let app: INestApplication;// NestJSアプリケーションインスタンス
    let usecase: UpdateProductUsecase; // 商品更新ユースケース

    /**
     * すべてのテストの前処理
     * - AppModuleを基にテスト用のNestJSアプリケーションを作成
     * - ProductUsecaseをDIコンテナから取得
     */
     beforeAll(async () => {
        // テストモジュールの準備
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule], // 実際のモジュールを使用
        }).compile();
        app = moduleRef.createNestApplication();
        await app.init();
        // ユースケースを取得
        usecase = app.get<UpdateProductUsecase>('UpdateProductUsecase');
    });
    /**
     * すべてのテストの後処理
     */
    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    describe('getByProductId()メソッドのテスト', () => {
        it('存在する商品Idで商品を正常に取得できる', async () => {
            const id = 'ac413f22-0cf1-490a-9635-7e9ca810e544';
            const product = await usecase.getByProductId(id);
            // 取得した商品データを検証
            expect(product.id)
                .toBe('ac413f22-0cf1-490a-9635-7e9ca810e544');
            expect(product.name).toBe('水性ボールペン(黒)'); 
            expect(product.price).toBe(120); 
            expect(product.category!.id)
                .toBe('b1524011-b6af-417e-8bf2-f449dd58b5c0'); 
        });
    });

    it('存在しない商品Idの場合、NotFoundExceptionがスローされる', async () => {
        const id = 'ac413f22-0cf1-490a-9635-7e9ca810e545';
        // エラーをスローすることを検証
        await expect(usecase.getByProductId(id)).rejects.toThrow(NotFoundException);
        await expect(usecase.getByProductId(id)).rejects.toThrow(
        `商品Id:(ac413f22-0cf1-490a-9635-7e9ca810e545)の商品は存在しません。`);
    });

    describe('()メソchangeッドのテスト', () => {
        it('商品が存在する場合、商品を変更できる', async () => {
            const updateProduct: ProductDTO = {
                id: 'ac413f22-0cf1-490a-9635-7e9ca810e544', 
                name: '更新後のボールペン',
                price: 150,
                category: null,
            };
            await usecase.change(updateProduct);
            const result = await usecase.getByProductId('ac413f22-0cf1-490a-9635-7e9ca810e544');
            // 更新結果を検証
            expect(result.name).toBe(updateProduct.name);
            expect(result.price).toBe(updateProduct.price);
            // データを復元する
            const restoreProduct: ProductDTO = {
                id: 'ac413f22-0cf1-490a-9635-7e9ca810e544', 
                name: '水性ボールペン(黒)',
                price: 120,
                category: null,
            };
            await usecase.change(restoreProduct);
        });
        it('存在しない商品を変更した場合、NotFoundExceptionがスローされる', async () => {
            const updateProduct: ProductDTO = {
                id: 'ac413f22-0cf1-490a-9635-7e9ca810e545', 
                name: '更新後のボールペン',
                price: 150,
                category: null,
            };
            await expect(usecase.change(updateProduct)).rejects.toThrow(NotFoundException);
            await expect(usecase.change(updateProduct)).rejects.toThrow(
            `商品Id:(${updateProduct.id})の商品は存在しないため変更できませんでした。`);
        })
    });
});
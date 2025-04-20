"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const DomainException_1 = require("../../../src/application/domain/exception/DomainException");
const HttpExceptionFilter_1 = require("../../../src/interface/filter/HttpExceptionFilter");
/**
 * HttpExceptionFilterの単体テスト
 * - ArgumentsHostをモック化し、RESTフィルタとしての振る舞いを検証
 * [テスト実行コマンド]
 * npx jest test/interface/filter/HttpExceptionFilter.mock.spec.ts
 * @author Fullness,Inc.
 * @date 2025-03-16
 * @version 1.0.0
 */
describe('HttpExceptionFilterのテスト', () => {
    let filter; // テスト対象のフィルタ
    let mockResponse; // モック化されたレスポンスオブジェクト
    let mockRequest; // モック化されたリクエストオブジェクト
    let mockContext; // モック化されたNestJSの実行コンテキスト
    /**
     * 各テストケース前に共通のモックを準備
     */
    beforeEach(() => {
        filter = new HttpExceptionFilter_1.HttpExceptionFilter();
        // モックのリクエストオブジェクト（パスを固定）
        mockRequest = { url: '/test-endpoint' };
        // モックのレスポンスオブジェクト（status().json()の呼び出しを追跡）
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        // switchToHttp() が返すオブジェクトを定義
        const mockSwitchToHttp = () => ({
            getRequest: () => mockRequest,
            getResponse: () => mockResponse,
        });
        // ArgumentsHostのモックを作成
        mockContext = {
            switchToHttp: mockSwitchToHttp,
        };
    });
    /**
     * ドメイン層の例外（DomainException）を処理し、400が返ることを検証
     */
    it('DomainExceptionを処理してステータス400を返す', () => {
        const exception = new DomainException_1.DomainException('ドメインエラー発生');
        filter.catch(exception, mockContext);
        expect(mockResponse.status).toHaveBeenCalledWith(common_1.HttpStatus.BAD_REQUEST);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 400,
            message: 'ドメインエラー発生',
            path: '/test-endpoint',
            timestamp: expect.any(String),
        }));
    });
    /**
     * 想定外の標準エラー（Error）を処理し、500が返ることを検証
     */
    it('予期しないエラーを処理してステータス500を返す', () => {
        const exception = new Error('未知のエラー');
        filter.catch(exception, mockContext);
        expect(mockResponse.status).toHaveBeenCalledWith(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 500,
            message: '未知のエラー',
            path: '/test-endpoint',
            timestamp: expect.any(String),
        }));
    });
    /**
     * NestJSの標準例外（InternalServerErrorException）を処理し、500が返ることを検証
     */
    it('InternalServerErrorExceptionを適切に処理している', () => {
        const exception = new common_1.InternalServerErrorException('内部エラー');
        filter.catch(exception, mockContext);
        expect(mockResponse.status).toHaveBeenCalledWith(common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 500,
            message: '内部エラー',
            path: '/test-endpoint',
            timestamp: expect.any(String),
        }));
    });
});

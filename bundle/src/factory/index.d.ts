/**
 * 값 노드 팩토리 & 유틸리티
 */
import { ValueNode } from '../core/types';
export declare class ValueFactory {
    static createTypedNode<T extends string, U>(typeName: T, value: U): Promise<ValueNode<T, U>>;
    static createStringNode(value: string): Promise<ValueNode<'string', string>>;
    static createNumberNode(value: number): Promise<ValueNode<'number', number>>;
    static createBooleanNode(value: boolean): Promise<ValueNode<'boolean', boolean>>;
    static tryCreateNode<T extends string, U>(typeName: T, value: U): Promise<{
        success: true;
        node: ValueNode<T, U>;
    } | {
        success: false;
        error: string;
    }>;
}
export declare function validateTypeValue(typeName: string, value: unknown): Promise<string[]>;
export declare function inspectType(typeName: string): void;
export declare function listAllTypes(): void;

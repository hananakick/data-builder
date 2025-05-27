/**
 * 값 노드 팩토리 & 유틸리티
 */
import { ValueNode } from '../core/types';
export declare class ValueNodeFactory {
    static createTypedNode<T extends string, U>(typeName: T, value: U): ValueNode<T, U>;
    static createStringNode(value: string): ValueNode<'string', string>;
    static createNumberNode(value: number): ValueNode<'number', number>;
    static createBooleanNode(value: boolean): ValueNode<'boolean', boolean>;
    static tryCreateNode<T extends string, U>(typeName: T, value: U): {
        success: true;
        node: ValueNode<T, U>;
    } | {
        success: false;
        error: string;
    };
}
export declare function validateTypeValue(typeName: string, value: unknown): string[];
export declare function inspectType(typeName: string): void;
export declare function listAllTypes(): void;

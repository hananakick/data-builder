/**
 * 핵심 타입 정의
 */

// 값 노드 인터페이스
export interface ValueNode<T extends string = string, V = unknown> {
    readonly type: T;
    readonly value: V;
}

// 타입 정의 인터페이스
export interface TypeDefinition<T extends string = string> {
    readonly name: T;
    readonly schema: Schema;
    readonly description?: string;
}

// 스키마 타입들
export interface Schema {
    readonly kind: 'primitive' | 'array' | 'object' | 'custom';
}

export interface PrimitiveSchema extends Schema {
    readonly kind: 'primitive';
    readonly type: 'string' | 'number' | 'boolean';
}

export interface ArraySchema extends Schema {
    readonly kind: 'array';
    readonly items: Schema[];
    readonly minItems?: number;
    readonly maxItems?: number;
}

export interface ObjectSchema extends Schema {
    readonly kind: 'object';
    readonly properties: Record<string, Schema>;
    readonly required?: string[];
    readonly additionalProperties?: boolean;
}

export interface CustomSchema extends Schema {
    readonly kind: 'custom';
    readonly typeName: string;
    readonly validator?: (value: any) => Promise<boolean>;
    readonly innerSchema?: Schema;
}

// 검증 결과 타입
export interface ValidationResult {
    readonly isValid: boolean;
    readonly errors: string[];
}

// 호환성 결과 타입
export interface CompatibilityResult {
    readonly isCompatible: boolean;
    readonly reason?: string;
}

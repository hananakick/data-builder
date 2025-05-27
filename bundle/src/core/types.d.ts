/**
 * 핵심 타입 정의
 */
export interface ValueNode<T extends string = string, V = unknown> {
    readonly type: T;
    readonly value: V;
}
export interface TypeDefinition<T extends string = string> {
    readonly name: T;
    readonly schema: Schema;
    readonly description?: string;
}
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
    readonly validator?: (value: any) => boolean;
    readonly innerSchema?: Schema;
}
export interface ValidationResult {
    readonly isValid: boolean;
    readonly errors: string[];
}
export interface CompatibilityResult {
    readonly isCompatible: boolean;
    readonly reason?: string;
}

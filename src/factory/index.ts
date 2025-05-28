/**
 * 값 노드 팩토리 & 유틸리티
 */

import { ValueNode } from '../core/types';
import { TypeRegistry } from '../core/registry';
import { SchemaValidator } from '../validation/index';

// 값 노드 팩토리
export class ValueNodeFactory {
    static async createTypedNode<T extends string, U>(typeName: T, value: U): Promise<ValueNode<T, U>> {
        const typeDefinition = TypeRegistry.getType(typeName);
        if (!typeDefinition) {
            throw new Error(`Unknown type: ${typeName}. Available types: ${TypeRegistry.getTypeNames().join(', ')}`);
        }
        
        const validation = await SchemaValidator.validateValue(value, typeDefinition.schema);
        if (!validation.isValid) {
            throw new Error(`Schema validation failed for type '${typeName}': ${validation.errors.join('; ')}`);
        }
        
        return { type: typeName, value };
    }
    
    static async createStringNode(value: string): Promise<ValueNode<'string', string>> {
        return await this.createTypedNode('string', value);
    }
    
    static async createNumberNode(value: number): Promise<ValueNode<'number', number>> {
        return await this.createTypedNode('number', value);
    }
    
    static async createBooleanNode(value: boolean): Promise<ValueNode<'boolean', boolean>> {
        return await this.createTypedNode('boolean', value);
    }
    
    static async tryCreateNode<T extends string, U>(
        typeName: T,
        value: U
    ): Promise<{ success: true; node: ValueNode<T, U> } | { success: false; error: string }> {
        try {
            const node = await this.createTypedNode(typeName, value);
            return { success: true, node };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }
}

// 유틸리티 함수들
export async function validateTypeValue(typeName: string, value: unknown): Promise<string[]> {
    const typeDefinition = TypeRegistry.getType(typeName);
    if (!typeDefinition) {
        return [`Unknown type: ${typeName}`];
    }
    
    const validation = await SchemaValidator.validateValue(value, typeDefinition.schema);
    return validation.errors;
}

export function inspectType(typeName: string): void {
    const typeDefinition = TypeRegistry.getType(typeName);
    if (!typeDefinition) {
        console.log(`Type '${typeName}' not found`);
        return;
    }
    
    console.log(`=== Type: ${typeName} ===`);
    console.log(`Description: ${typeDefinition.description || 'No description'}`);
    console.log(`Schema:`, JSON.stringify(typeDefinition.schema, null, 2));
}

export function listAllTypes(): void {
    const allTypes = TypeRegistry.getAllTypes();
    
    console.log('=== Registered Types ===');
    for (const [name, definition] of allTypes) {
        console.log(`${name}: ${definition.description || 'No description'}`);
    }
}

/**
 * 스키마 검증 & 타입 호환성 검사
 */

import { 
    Schema, 
    PrimitiveSchema, 
    ArraySchema, 
    ObjectSchema, 
    CustomSchema,
    ValidationResult,
    CompatibilityResult,
    ValueNode
} from '../core/types';
import { TypeRegistry } from '../core/registry';

/**
 * Provides static methods for validating values against schema definitions.
 */
export class SchemaValidator {
    /**
     * Validates a given value against a specified schema.
     *
     * @param {unknown} value - The value to validate.
     * @param {Schema} schema - The schema to validate against.
     * @returns {ValidationResult} An object indicating whether the validation was successful and a list of errors if not.
     * @example
     * ```typescript
     * const stringSchema = SchemaBuilder.string();
     * const result = SchemaValidator.validateValue("hello", stringSchema);
     * // result = { isValid: true, errors: [] }
     * ```
     */
    static validateValue(value: unknown, schema: Schema): ValidationResult {
        const errors: string[] = [];
        
        switch (schema.kind) {
            case 'primitive':
                this.validatePrimitive(value, schema as PrimitiveSchema, errors);
                break;
            case 'array':
                this.validateArray(value, schema as ArraySchema, errors);
                break;
            case 'object':
                this.validateObject(value, schema as ObjectSchema, errors);
                break;
            case 'custom':
                this.validateCustom(value, schema as CustomSchema, errors);
                break;
            default:
                const _exhaustiveCheck = schema;
                throw new Error(`Unknown schema kind: ${(_exhaustiveCheck as any).kind}`);
        }
        
        return { isValid: errors.length === 0, errors };
    }
    
    /**
     * Validates a value against a primitive schema.
     * @internal
     * @param {unknown} value - The value to validate.
     * @param {PrimitiveSchema} schema - The primitive schema.
     * @param {string[]} errors - An array to collect validation errors.
     */
    private static validatePrimitive(value: unknown, schema: PrimitiveSchema, errors: string[]): void {
        const expectedType = schema.type;
        const actualType = typeof value;
        
        if (expectedType === 'number' && actualType === 'number' && isNaN(value as number)) {
            errors.push('Number value cannot be NaN');
            return;
        }
        
        if (actualType !== expectedType) {
            errors.push(`Expected ${expectedType}, got ${actualType}`);
        }
    }
    
    /**
     * Validates a value against an array schema.
     * Handles both homogeneous arrays and tuples.
     * @internal
     * @param {unknown} value - The value to validate.
     * @param {ArraySchema} schema - The array schema.
     * @param {string[]} errors - An array to collect validation errors.
     */
    private static validateArray(value: unknown, schema: ArraySchema, errors: string[]): void {
        if (!Array.isArray(value)) {
            errors.push('Expected array');
            return;
        }
        
        // Overall array length constraints
        if (schema.minItems !== undefined && value.length < schema.minItems) {
            errors.push(`Array must have at least ${schema.minItems} items, got ${value.length}`);
        }
        if (schema.maxItems !== undefined && value.length > schema.maxItems) {
            errors.push(`Array must have at most ${schema.maxItems} items, got ${value.length}`);
        }

        // Item validation based on schema.items structure
        if (schema.items && schema.items.length > 0) {
            if (schema.items.length === 1) {
                // Homogeneous array: all items conform to schema.items[0]
                const itemSchema = schema.items[0];
                value.forEach((item, index) => {
                    const itemValidation = this.validateValue(item, itemSchema);
                    if (!itemValidation.isValid) {
                        const itemErrors = itemValidation.errors.map(error => `Item[${index}]: ${error}`);
                        errors.push(...itemErrors);
                    }
                });
            } else {
                // Tuple: value[i] conforms to schema.items[i]
                // For tuples, the length of the data array should match the length of the schema.items array.
                if (value.length !== schema.items.length) {
                    errors.push(`Expected tuple of ${schema.items.length} elements, but got ${value.length} elements`);
                }
                // Validate elements up to the defined length of the tuple schema.
                // If value.length is shorter, previous error handles it.
                // If value.length is longer, previous error handles it.
                // We iterate through schema.items to ensure each defined tuple element is checked.
                schema.items.forEach((itemSchema, index) => {
                    if (index < value.length) { // Check if value has an element at this index
                        const itemValidation = this.validateValue(value[index], itemSchema);
                        if (!itemValidation.isValid) {
                            const itemErrors = itemValidation.errors.map(error => `Item at index ${index}: ${error}`);
                            errors.push(...itemErrors);
                        }
                    } // If index >= value.length, the length mismatch error already covers missing elements.
                });
            }
        } else if (schema.items && schema.items.length === 0 && value.length > 0) {
            // Schema defines an empty tuple (e.g. `[]`), but data array is not empty.
            errors.push("Array schema defines an empty tuple, but received a non-empty array.");
        }
    }
    
    /**
     * Validates a value against an object schema.
     * @internal
     * @param {unknown} value - The value to validate.
     * @param {ObjectSchema} schema - The object schema.
     * @param {string[]} errors - An array to collect validation errors.
     */
    private static validateObject(value: unknown, schema: ObjectSchema, errors: string[]): void {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            errors.push('Expected object');
            return;
        }
        
        const obj = value as Record<string, unknown>;
        
        if (schema.required) {
            for (const requiredKey of schema.required) {
                if (!(requiredKey in obj)) {
                    errors.push(`Missing required property: '${requiredKey}'`);
                }
            }
        }
        
        for (const [key, propSchema] of Object.entries(schema.properties)) {
            if (key in obj) {
                const propValidation = this.validateValue(obj[key], propSchema);
                if (!propValidation.isValid) {
                    const propErrors = propValidation.errors.map(error => `Property '${key}': ${error}`);
                    errors.push(...propErrors);
                }
            }
        }
        
        if (!schema.additionalProperties) {
            const allowedKeys = new Set(Object.keys(schema.properties));
            for (const key of Object.keys(obj)) {
                if (!allowedKeys.has(key)) {
                    errors.push(`Unexpected property: '${key}'`);
                }
            }
        }
    }
    
    /**
     * Validates a value against a custom schema.
     * @internal
     * @param {unknown} value - The value to validate.
     * @param {CustomSchema} schema - The custom schema.
     * @param {string[]} errors - An array to collect validation errors.
     */
    private static validateCustom(value: unknown, schema: CustomSchema, errors: string[]): void {
        if (schema.validator && !schema.validator(value)) {
            errors.push(`Custom validation failed for type: ${schema.typeName}`);
        }
        
        if (schema.innerSchema) {
            const innerValidation = this.validateValue(value, schema.innerSchema);
            if (!innerValidation.isValid) {
                errors.push(...innerValidation.errors);
            }
        }
    }
}

/**
 * Provides static methods for checking type compatibility based on their schemas.
 */
export class TypeCompatibility {
    /**
     * Checks if a source type is compatible with a target type by their names.
     * Compatibility is determined by their underlying schemas.
     * @param {string} sourceTypeName - The name of the source type.
     * @param {string} targetTypeName - The name of the target type.
     * @returns {boolean} True if the types are compatible, false otherwise.
     * @example
     * ```typescript
     * TypeCompatibility.areCompatible('string', 'string'); // true
     * ```
     */
    static areCompatible(sourceTypeName: string, targetTypeName: string): boolean {
        if (sourceTypeName === targetTypeName) {
            return true;
        }
        
        const sourceType = TypeRegistry.getType(sourceTypeName);
        const targetType = TypeRegistry.getType(targetTypeName);
        
        if (!sourceType || !targetType) {
            return false;
        }
        
        return this.areSchemasCompatible(sourceType.schema, targetType.schema);
    }
    
    /**
     * Checks compatibility between a source type and a target type, providing a reason if not compatible.
     * @param {string} sourceTypeName - The name of the source type.
     * @param {string} targetTypeName - The name of the target type.
     * @returns {CompatibilityResult} An object indicating compatibility and a reason if not compatible.
     * @example
     * ```typescript
     * const result = TypeCompatibility.checkCompatibility('number', 'string');
     * // result = {
     * //   isCompatible: false,
     * //   reason: "Type mismatch: number is not compatible with string"
     * // }
     * ```
     */
    static checkCompatibility(sourceTypeName: string, targetTypeName: string): CompatibilityResult {
        if (sourceTypeName === targetTypeName) {
            return { isCompatible: true };
        }
        
        const sourceType = TypeRegistry.getType(sourceTypeName);
        const targetType = TypeRegistry.getType(targetTypeName);
        
        if (!sourceType) {
            return { 
                isCompatible: false, 
                reason: `Unknown source type: ${sourceTypeName}` 
            };
        }
        
        if (!targetType) {
            return { 
                isCompatible: false, 
                reason: `Unknown target type: ${targetTypeName}` 
            };
        }
        
        if (!this.areSchemasCompatible(sourceType.schema, targetType.schema)) {
            return { 
                isCompatible: false, 
                reason: `Type mismatch: ${sourceTypeName} is not compatible with ${targetTypeName}` 
            };
        }
        
        return { isCompatible: true };
    }
    
    /**
     * Checks if a given ValueNode is compatible with a target type name.
     * @param {ValueNode} node - The ValueNode to check.
     * @param {string} targetTypeName - The name of the target type.
     * @returns {CompatibilityResult} An object indicating compatibility and a reason if not compatible.
     * @example
     * ```typescript
     * const stringNode = ValueNodeFactory.createStringNode("test");
     * const result = TypeCompatibility.isNodeCompatible(stringNode, 'string');
     * // result = { isCompatible: true }
     * ```
     */
    static isNodeCompatible(node: ValueNode, targetTypeName: string): CompatibilityResult {
        return this.checkCompatibility(node.type, targetTypeName);
    }
    
    /**
     * @internal
     */
    private static areSchemasCompatible(sourceSchema: Schema, targetSchema: Schema): boolean {
        if (sourceSchema.kind !== targetSchema.kind) {
            return false;
        }
        
        switch (sourceSchema.kind) {
            case 'primitive':
                if (targetSchema.kind !== 'primitive') return false;
                return (sourceSchema as PrimitiveSchema).type === (targetSchema as PrimitiveSchema).type;
                
            case 'array':
                if (targetSchema.kind !== 'array') return false;
                const sourceArraySchema = sourceSchema as ArraySchema;
                const targetArraySchema = targetSchema as ArraySchema;

                if (!sourceArraySchema.items || !targetArraySchema.items) {
                     // Undefined items arrays are not compatible unless both are undefined (or specific rule)
                    return !sourceArraySchema.items && !targetArraySchema.items;
                }
                if (sourceArraySchema.items.length === 0 || targetArraySchema.items.length === 0) {
                    return sourceArraySchema.items.length === targetArraySchema.items.length; // Compatible if both are empty
                }

                // Both are homogeneous array definitions
                if (sourceArraySchema.items.length === 1 && targetArraySchema.items.length === 1) {
                    return this.areSchemasCompatible(sourceArraySchema.items[0], targetArraySchema.items[0]);
                } 
                // Both are tuple definitions
                else if (sourceArraySchema.items.length === targetArraySchema.items.length) { // Lengths must match for tuples
                    for (let i = 0; i < sourceArraySchema.items.length; i++) {
                        if (!this.areSchemasCompatible(sourceArraySchema.items[i], targetArraySchema.items[i])) {
                            return false;
                        }
                    }
                    return true;
                }
                return false; // Mixed types (tuple vs homogeneous) or different length tuples
                
            case 'object':
                if (targetSchema.kind !== 'object') return false;
                return this.areObjectSchemasCompatible(
                    sourceSchema as ObjectSchema, 
                    targetSchema as ObjectSchema
                );
                
            case 'custom':
                if (targetSchema.kind !== 'custom') return false;
                return (sourceSchema as CustomSchema).typeName === (targetSchema as CustomSchema).typeName;
                
            default:
                return false;
        }
    }
    
    /**
     * @internal
     */
    private static areObjectSchemasCompatible(source: ObjectSchema, target: ObjectSchema): boolean {
        const targetRequiredKeys = new Set(target.required || []);
        const sourceKeys = new Set(Object.keys(source.properties));
        
        for (const requiredKey of targetRequiredKeys) {
            if (!sourceKeys.has(requiredKey)) {
                return false;
            }
        }
        
        for (const [key, targetPropSchema] of Object.entries(target.properties)) {
            if (key in source.properties) {
                if (!this.areSchemasCompatible(source.properties[key], targetPropSchema)) {
                    return false;
                }
            }
        }
        
        return true;
    }
}

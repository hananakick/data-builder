/**
 * 스키마 검증 & 타입 호환성 검사
 */
import { Schema, ValidationResult, CompatibilityResult, ValueNode } from '../core/types';
/**
 * Provides static methods for validating values against schema definitions.
 */
export declare class SchemaValidator {
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
    static validateValue(value: unknown, schema: Schema): Promise<ValidationResult>;
    /**
     * Validates a value against a primitive schema.
     * @internal
     * @param {unknown} value - The value to validate.
     * @param {PrimitiveSchema} schema - The primitive schema.
     * @param {string[]} errors - An array to collect validation errors.
     */
    private static validatePrimitive;
    /**
     * Validates a value against an array schema.
     * Handles both homogeneous arrays and tuples.
     * @internal
     * @param {unknown} value - The value to validate.
     * @param {ArraySchema} schema - The array schema.
     * @param {string[]} errors - An array to collect validation errors.
     */
    private static validateArray;
    /**
     * Validates a value against an object schema.
     * @internal
     * @param {unknown} value - The value to validate.
     * @param {ObjectSchema} schema - The object schema.
     * @param {string[]} errors - An array to collect validation errors.
     */
    private static validateObject;
    /**
     * Validates a value against a custom schema.
     * @internal
     * @param {unknown} value - The value to validate.
     * @param {CustomSchema} schema - The custom schema.
     * @param {string[]} errors - An array to collect validation errors.
     */
    private static validateCustom;
}
/**
 * Provides static methods for checking type compatibility based on their schemas.
 */
export declare class TypeCompatibility {
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
    static areCompatible(sourceTypeName: string, targetTypeName: string): boolean;
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
    static checkCompatibility(sourceTypeName: string, targetTypeName: string): CompatibilityResult;
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
    static isNodeCompatible(node: ValueNode, targetTypeName: string): CompatibilityResult;
    /**
     * @internal
     */
    private static areSchemasCompatible;
    /**
     * @internal
     */
    private static areObjectSchemasCompatible;
}

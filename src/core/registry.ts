/**
 * 스키마 빌더 & 타입 레지스트리
 */

import { 
    Schema, 
    PrimitiveSchema, 
    ArraySchema, 
    ObjectSchema, 
    CustomSchema,
    TypeDefinition 
} from './types';


/**
 * A utility object for creating different kinds of schema definitions.
 * Each method in this builder corresponds to a specific schema type.
 */
export const SchemaBuilder = {
    /**
     * Creates a schema definition for a primitive 'string' type.
     * @returns {PrimitiveSchema} A schema object representing a string.
     * @example
     * ```typescript
     * const nameSchema = SchemaBuilder.string();
     * // Result: { kind: 'primitive', type: 'string' }
     * ```
     */
    string(): PrimitiveSchema {
        return { kind: 'primitive', type: 'string' };
    },
    
    /**
     * Creates a schema definition for a primitive 'number' type.
     * @returns {PrimitiveSchema} A schema object representing a number.
     * @example
     * ```typescript
     * const ageSchema = SchemaBuilder.number();
     * // Result: { kind: 'primitive', type: 'number' }
     * ```
     */
    number(): PrimitiveSchema {
        return { kind: 'primitive', type: 'number' };
    },
    
    /**
     * Creates a schema definition for a primitive 'boolean' type.
     * @returns {PrimitiveSchema} A schema object representing a boolean.
     * @example
     * ```typescript
     * const isActiveSchema = SchemaBuilder.boolean();
     * // Result: { kind: 'primitive', type: 'boolean' }
     * ```
     */
    boolean(): PrimitiveSchema {
        return { kind: 'primitive', type: 'boolean' };
    },
    
    /**
     * Creates a schema definition for an 'array' type.
     * If `items` contains a single schema, it defines a homogeneous array where all elements must conform to that schema.
     * If `items` contains multiple schemas, it defines a tuple where elements at each position must conform to the corresponding schema.
     * @param {Schema[]} items - An array of schema definitions.
     *                         - For a homogeneous array (e.g., array of strings), pass a single-element array: `[SchemaBuilder.string()]`.
     *                         - For a tuple (e.g., `[string, number]`), pass an array with schemas for each element: `[SchemaBuilder.string(), SchemaBuilder.number()]`.
     * @param {object} [options] - Optional configuration for the array.
     * @param {number} [options.minItems] - The minimum number of items the array must contain.
     * @param {number} [options.maxItems] - The maximum number of items the array can contain.
     * @returns {ArraySchema} A schema object representing an array.
     * @example
     * ```typescript
     * // Homogeneous array of strings
     * const tagsSchema = SchemaBuilder.array([SchemaBuilder.string()], { minItems: 1 });
     * // Result: { kind: 'array', items: [{ kind: 'primitive', type: 'string' }], minItems: 1 }
     *
     * // Tuple of a string and a number
     * const pairSchema = SchemaBuilder.array([
     *   SchemaBuilder.string(),
     *   SchemaBuilder.number()
     * ]);
     * // Result: { kind: 'array', items: [{ kind: 'primitive', type: 'string' }, { kind: 'primitive', type: 'number' }] }
     *
     * // Array of numbers with min and max items (homogeneous)
     * const scoresSchema = SchemaBuilder.array(
     *   [SchemaBuilder.number()], // Note: items is an array
     *   { minItems: 1, maxItems: 5 }
     * );
     * // Result: { kind: 'array', items: [{ kind: 'primitive', type: 'number' }], minItems: 1, maxItems: 5 }
     * ```
     */
    array(items: Schema[], options?: { minItems?: number; maxItems?: number }): ArraySchema {
        return {
            kind: 'array',
            items,
            ...options
        };
    },
    
    /**
     * Creates a schema definition for an 'object' type.
     * @param {Record<string, Schema>} properties - An object where keys are property names and values are their schema definitions.
     * @param {object} [options] - Optional configuration for the object.
     * @param {string[]} [options.required] - An array of property names that are required for this object.
     * @param {boolean} [options.additionalProperties=false] - Whether to allow properties not defined in the schema. Defaults to false.
     * @returns {ObjectSchema} A schema object representing an object.
     * @example
     * ```typescript
     * // Simple object
     * const pointSchema = SchemaBuilder.object({
     *   x: SchemaBuilder.number(),
     *   y: SchemaBuilder.number()
     * });
     * // Result: { kind: 'object', properties: { x: { kind: 'primitive', type: 'number' }, y: { kind: 'primitive', type: 'number' } }, additionalProperties: false }
     *
     * // Object with required properties and allowing additional properties
     * const userProfileSchema = SchemaBuilder.object(
     *   {
     *     id: SchemaBuilder.string(),
     *     username: SchemaBuilder.string(),
     *     email: SchemaBuilder.custom('email') // Assumes 'email' custom type is defined
     *   },
     *   { required: ['id', 'username'], additionalProperties: true }
     * );
     * // Result: {
     * //   kind: 'object',
     * //   properties: { id: ..., username: ..., email: ... },
     * //   required: ['id', 'username'],
     * //   additionalProperties: true
     * // }
     * ```
     */
    object(
        properties: Record<string, Schema>, 
        options?: { required?: string[]; additionalProperties?: boolean }
    ): ObjectSchema {
        return {
            kind: 'object',
            properties,
            required: options?.required,
            additionalProperties: options?.additionalProperties ?? false
        };
    },
    
    /**
     * Creates a schema definition for a 'custom' type.
     * Custom types allow for user-defined validation logic and can optionally wrap an existing schema.
     * @param {string} typeName - The unique name identifying this custom type. This name is used for registration and lookup.
     * @param {object} [options] - Optional configuration for the custom type.
     * @param {(value: any) => boolean | Promise<boolean>} [options.validator] - A function to validate the value of this custom type. Should return true if valid, false otherwise. Can be async.
     * @param {Schema} [options.innerSchema] - An underlying schema that this custom type is based on or extends.
     * @returns {CustomSchema} A schema object representing a custom type.
     * @example
     * ```typescript
     * // Custom type with a validator
     * const emailSchema = SchemaBuilder.custom('email', {
     *   validator: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
     * });
     * // Result: { kind: 'custom', typeName: 'email', validator: [Function] }
     *
     * // Custom type based on an inner schema (e.g., a positive number)
     * const positiveNumberSchema = SchemaBuilder.custom('positiveNumber', {
     *   innerSchema: SchemaBuilder.number(),
     *   validator: (value) => typeof value === 'number' && value > 0
     * });
     * // Result: { kind: 'custom', typeName: 'positiveNumber', innerSchema: { kind: 'primitive', type: 'number' }, validator: [Function] }
     *
     * // Custom type that just references another registered type (validation handled by the registered type)
     * const userIdSchema = SchemaBuilder.custom('UUID');
     * // Result: { kind: 'custom', typeName: 'UUID' }
     * // (Assumes a 'UUID' type is registered elsewhere with its own schema and/or validator)
     *
     * // Custom type with only an inner schema (useful for aliasing or adding semantic meaning)
     * const productCodeSchema = SchemaBuilder.custom('ProductCode', { innerSchema: SchemaBuilder.string() });
     * // Result: { kind: 'custom', typeName: 'ProductCode', innerSchema: { kind: 'primitive', type: 'string' } }
     * ```
     */
    custom(
        typeName: string,
        options?: { validator?: (value: any) => boolean | Promise<boolean>; innerSchema?: Schema }
    ): CustomSchema {
        return {
            kind: 'custom',
            typeName,
            validator: options?.validator
                ? (value: any) => {
                    if (!options.validator) {
                        return Promise.resolve(false);
                    }
                    const result = options.validator(value);
                    return result instanceof Promise ? result : Promise.resolve(result);
                  }
                : undefined,
            innerSchema: options?.innerSchema
        };
    }
};


export const STRING_TYPE: TypeDefinition<'string'> = {
    name: 'string',
    schema: SchemaBuilder.string(),
    description: 'Text string value'
} as const;

export const NUMBER_TYPE: TypeDefinition<'number'> = {
    name: 'number',
    schema: SchemaBuilder.number(),
    description: 'Numeric value'
} as const;

export const BOOLEAN_TYPE: TypeDefinition<'boolean'> = {
    name: 'boolean',
    schema: SchemaBuilder.boolean(),
    description: 'True or false value'
} as const;


/**
 * Manages the registration and retrieval of type definitions.
 * This class acts as a central store for all defined types within the system,
 * ensuring that each type name is unique and providing easy access to type information.
 */
export class TypeRegistry {
    /** @internal */
    private static types = new Map<string, TypeDefinition>();
    
    /**
     * Initializes the TypeRegistry with predefined basic types (string, number, boolean).
     * @internal
     */
    static {
        this.registerType(STRING_TYPE);
        this.registerType(NUMBER_TYPE);
        this.registerType(BOOLEAN_TYPE);
    }
    
    /**
     * Registers a new type definition.
     * Throws an error if a type with the same name is already registered.
     * @template T - The literal string type of the type name.
     * @param {TypeDefinition<T>} typeDefinition - The type definition object to register.
     * @throws {Error} If the type name is already registered.
     */
    static registerType<T extends string>(typeDefinition: TypeDefinition<T>): void {
        if (this.types.has(typeDefinition.name)) {
            throw new Error(`Type '${typeDefinition.name}' is already registered`);
        }
        this.types.set(typeDefinition.name, typeDefinition);
    }
    
    /**
     * Retrieves a type definition by its name.
     * @param {string} typeName - The name of the type to retrieve.
     * @returns {TypeDefinition | undefined} The type definition if found, otherwise undefined.
     */
    static getType(typeName: string): TypeDefinition | undefined {
        return this.types.get(typeName);
    }
    
    /**
     * Checks if a type with the given name is registered.
     * @param {string} typeName - The name of the type to check.
     * @returns {boolean} True if the type is registered, false otherwise.
     */
    static hasType(typeName: string): boolean {
        return this.types.has(typeName);
    }
    
    /**
     * Retrieves all registered type definitions.
     * @returns {ReadonlyMap<string, TypeDefinition>} A read-only map of all type definitions.
     */
    static getAllTypes(): ReadonlyMap<string, TypeDefinition> {
        return this.types;
    }
    
    /**
     * Retrieves the names of all registered types.
     * @returns {string[]} An array of registered type names.
     */
    static getTypeNames(): string[] {
        return Array.from(this.types.keys());
    }
}

/**
 * Creates a new type definition and registers it with the TypeRegistry.
 *
 * @template T - 타입 이름의 문자열 리터럴 타입
 * @param {T} name - The unique name of the type to register.
 * @param {Schema} schema - The schema defining the structure of the type.
 * @param {string} [description] - An optional description for the type.
 * @returns {TypeDefinition<T>} The created type definition object.
 * @throws {Error} If a type with the same name is already registered.
 *
 * @example
 * ```typescript
 * // Simple custom type definition
 * const EmailType = defineType(
 *   'email',
 *   SchemaBuilder.custom('email', {
 *     validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
 *   }),
 *   'Represents an email address format'
 * );
 *
 * // Object type definition
 * const UserType = defineType(
 *   'user',
 *   SchemaBuilder.object({
 *     id: SchemaBuilder.number(),
 *     name: SchemaBuilder.string(),
 *     email: SchemaBuilder.custom('email')
 *   }, { required: ['id', 'name'] }),
 *   'Represents a user entity'
 * );
 * ```
 */
export function defineType<T extends string>(
    name: T, 
    schema: Schema, 
    description?: string
): TypeDefinition<T> {
    const typeDefinition: TypeDefinition<T> = {
        name,
        schema,
        description
    };
    
    TypeRegistry.registerType(typeDefinition);
    return typeDefinition;
}

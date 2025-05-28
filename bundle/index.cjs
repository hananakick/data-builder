"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BOOLEAN_TYPE: () => BOOLEAN_TYPE,
  NUMBER_TYPE: () => NUMBER_TYPE,
  STRING_TYPE: () => STRING_TYPE,
  SchemaBuilder: () => SchemaBuilder,
  SchemaValidator: () => SchemaValidator,
  TypeCompatibility: () => TypeCompatibility,
  TypeRegistry: () => TypeRegistry,
  ValueNodeFactory: () => ValueNodeFactory,
  defineType: () => defineType,
  inspectType: () => inspectType,
  listAllTypes: () => listAllTypes,
  validateTypeValue: () => validateTypeValue
});
module.exports = __toCommonJS(index_exports);

// src/core/registry.ts
var SchemaBuilder = {
  /**
   * Creates a schema definition for a primitive 'string' type.
   * @returns {PrimitiveSchema} A schema object representing a string.
   * @example
   * ```typescript
   * const nameSchema = SchemaBuilder.string();
   * // Result: { kind: 'primitive', type: 'string' }
   * ```
   */
  string() {
    return { kind: "primitive", type: "string" };
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
  number() {
    return { kind: "primitive", type: "number" };
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
  boolean() {
    return { kind: "primitive", type: "boolean" };
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
  array(items, options) {
    return {
      kind: "array",
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
  object(properties, options) {
    return {
      kind: "object",
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
  custom(typeName, options) {
    return {
      kind: "custom",
      typeName,
      validator: options?.validator ? (value) => {
        if (!options.validator) {
          return Promise.resolve(false);
        }
        const result = options.validator(value);
        return result instanceof Promise ? result : Promise.resolve(result);
      } : void 0,
      innerSchema: options?.innerSchema
    };
  }
};
var STRING_TYPE = {
  name: "string",
  schema: SchemaBuilder.string(),
  description: "Text string value"
};
var NUMBER_TYPE = {
  name: "number",
  schema: SchemaBuilder.number(),
  description: "Numeric value"
};
var BOOLEAN_TYPE = {
  name: "boolean",
  schema: SchemaBuilder.boolean(),
  description: "True or false value"
};
var TypeRegistry = class {
  /** @internal */
  static types = /* @__PURE__ */ new Map();
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
  static registerType(typeDefinition) {
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
  static getType(typeName) {
    return this.types.get(typeName);
  }
  /**
   * Checks if a type with the given name is registered.
   * @param {string} typeName - The name of the type to check.
   * @returns {boolean} True if the type is registered, false otherwise.
   */
  static hasType(typeName) {
    return this.types.has(typeName);
  }
  /**
   * Retrieves all registered type definitions.
   * @returns {ReadonlyMap<string, TypeDefinition>} A read-only map of all type definitions.
   */
  static getAllTypes() {
    return this.types;
  }
  /**
   * Retrieves the names of all registered types.
   * @returns {string[]} An array of registered type names.
   */
  static getTypeNames() {
    return Array.from(this.types.keys());
  }
};
function defineType(name, schema, description) {
  const typeDefinition = {
    name,
    schema,
    description
  };
  TypeRegistry.registerType(typeDefinition);
  return typeDefinition;
}

// src/validation/index.ts
var SchemaValidator = class {
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
  static async validateValue(value, schema) {
    const errors = [];
    switch (schema.kind) {
      case "primitive":
        this.validatePrimitive(value, schema, errors);
        break;
      case "array":
        await this.validateArray(value, schema, errors);
        break;
      case "object":
        await this.validateObject(value, schema, errors);
        break;
      case "custom":
        await this.validateCustom(value, schema, errors);
        break;
      default:
        const _exhaustiveCheck = schema;
        throw new Error(`Unknown schema kind: ${_exhaustiveCheck.kind}`);
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
  static validatePrimitive(value, schema, errors) {
    const expectedType = schema.type;
    const actualType = typeof value;
    if (expectedType === "number" && actualType === "number" && isNaN(value)) {
      errors.push("Number value cannot be NaN");
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
  static async validateArray(value, schema, errors) {
    if (!Array.isArray(value)) {
      errors.push("Expected array");
      return;
    }
    if (schema.minItems !== void 0 && value.length < schema.minItems) {
      errors.push(`Array must have at least ${schema.minItems} items, got ${value.length}`);
    }
    if (schema.maxItems !== void 0 && value.length > schema.maxItems) {
      errors.push(`Array must have at most ${schema.maxItems} items, got ${value.length}`);
    }
    if (schema.items && schema.items.length > 0) {
      if (schema.items.length === 1) {
        const itemSchema = schema.items[0];
        for (let i = 0; i < value.length; i++) {
          const item = value[i];
          const itemValidation = await this.validateValue(item, itemSchema);
          if (!itemValidation.isValid) {
            const itemErrors = itemValidation.errors.map((error) => `Item[${i}]: ${error}`);
            errors.push(...itemErrors);
          }
        }
      } else {
        if (value.length !== schema.items.length) {
          errors.push(`Expected tuple of ${schema.items.length} elements, but got ${value.length} elements`);
        }
        for (let i = 0; i < schema.items.length; i++) {
          const itemSchema = schema.items[i];
          if (i < value.length) {
            const itemValidation = await this.validateValue(value[i], itemSchema);
            if (!itemValidation.isValid) {
              const itemErrors = itemValidation.errors.map((error) => `Item at index ${i}: ${error}`);
              errors.push(...itemErrors);
            }
          }
        }
      }
    } else if (schema.items && schema.items.length === 0 && value.length > 0) {
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
  static async validateObject(value, schema, errors) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      errors.push("Expected object");
      return;
    }
    const obj = value;
    if (schema.required) {
      for (const requiredKey of schema.required) {
        if (!(requiredKey in obj)) {
          errors.push(`Missing required property: '${requiredKey}'`);
        }
      }
    }
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      if (key in obj) {
        const propValidation = await this.validateValue(obj[key], propSchema);
        if (!propValidation.isValid) {
          const propErrors = propValidation.errors.map((error) => `Property '${key}': ${error}`);
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
  static async validateCustom(value, schema, errors) {
    if (schema.validator) {
      const result = schema.validator(value);
      const isValid = await result;
      if (!isValid) {
        errors.push(`Custom validation failed for type: ${schema.typeName}`);
      }
    }
    if (schema.innerSchema) {
      const innerValidation = await this.validateValue(value, schema.innerSchema);
      if (!innerValidation.isValid) {
        errors.push(...innerValidation.errors);
      }
    }
  }
};
var TypeCompatibility = class {
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
  static areCompatible(sourceTypeName, targetTypeName) {
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
  static checkCompatibility(sourceTypeName, targetTypeName) {
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
  static isNodeCompatible(node, targetTypeName) {
    return this.checkCompatibility(node.type, targetTypeName);
  }
  /**
   * @internal
   */
  static areSchemasCompatible(sourceSchema, targetSchema) {
    if (sourceSchema.kind !== targetSchema.kind) {
      return false;
    }
    switch (sourceSchema.kind) {
      case "primitive":
        if (targetSchema.kind !== "primitive") return false;
        return sourceSchema.type === targetSchema.type;
      case "array":
        if (targetSchema.kind !== "array") return false;
        const sourceArraySchema = sourceSchema;
        const targetArraySchema = targetSchema;
        if (!sourceArraySchema.items || !targetArraySchema.items) {
          return !sourceArraySchema.items && !targetArraySchema.items;
        }
        if (sourceArraySchema.items.length === 0 || targetArraySchema.items.length === 0) {
          return sourceArraySchema.items.length === targetArraySchema.items.length;
        }
        if (sourceArraySchema.items.length === 1 && targetArraySchema.items.length === 1) {
          return this.areSchemasCompatible(sourceArraySchema.items[0], targetArraySchema.items[0]);
        } else if (sourceArraySchema.items.length === targetArraySchema.items.length) {
          for (let i = 0; i < sourceArraySchema.items.length; i++) {
            if (!this.areSchemasCompatible(sourceArraySchema.items[i], targetArraySchema.items[i])) {
              return false;
            }
          }
          return true;
        }
        return false;
      // Mixed types (tuple vs homogeneous) or different length tuples
      case "object":
        if (targetSchema.kind !== "object") return false;
        return this.areObjectSchemasCompatible(
          sourceSchema,
          targetSchema
        );
      case "custom":
        if (targetSchema.kind !== "custom") return false;
        return sourceSchema.typeName === targetSchema.typeName;
      default:
        return false;
    }
  }
  /**
   * @internal
   */
  static areObjectSchemasCompatible(source, target) {
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
};

// src/factory/index.ts
var ValueNodeFactory = class {
  static async createTypedNode(typeName, value) {
    const typeDefinition = TypeRegistry.getType(typeName);
    if (!typeDefinition) {
      throw new Error(`Unknown type: ${typeName}. Available types: ${TypeRegistry.getTypeNames().join(", ")}`);
    }
    const validation = await SchemaValidator.validateValue(value, typeDefinition.schema);
    if (!validation.isValid) {
      throw new Error(`Schema validation failed for type '${typeName}': ${validation.errors.join("; ")}`);
    }
    return { type: typeName, value };
  }
  static async createStringNode(value) {
    return await this.createTypedNode("string", value);
  }
  static async createNumberNode(value) {
    return await this.createTypedNode("number", value);
  }
  static async createBooleanNode(value) {
    return await this.createTypedNode("boolean", value);
  }
  static async tryCreateNode(typeName, value) {
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
};
async function validateTypeValue(typeName, value) {
  const typeDefinition = TypeRegistry.getType(typeName);
  if (!typeDefinition) {
    return [`Unknown type: ${typeName}`];
  }
  const validation = await SchemaValidator.validateValue(value, typeDefinition.schema);
  return validation.errors;
}
function inspectType(typeName) {
  const typeDefinition = TypeRegistry.getType(typeName);
  if (!typeDefinition) {
    console.log(`Type '${typeName}' not found`);
    return;
  }
  console.log(`=== Type: ${typeName} ===`);
  console.log(`Description: ${typeDefinition.description || "No description"}`);
  console.log(`Schema:`, JSON.stringify(typeDefinition.schema, null, 2));
}
function listAllTypes() {
  const allTypes = TypeRegistry.getAllTypes();
  console.log("=== Registered Types ===");
  for (const [name, definition] of allTypes) {
    console.log(`${name}: ${definition.description || "No description"}`);
  }
}
//# sourceMappingURL=index.cjs.map

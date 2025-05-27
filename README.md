# data-builder

`data-builder` is a TypeScript library that provides a schema builder and a type registry. Its primary purpose is to facilitate the definition and management of various data types in a structured and type-safe manner. The library offers key features such as schema building, type registration, value node creation, validation, and type compatibility checking.

## Library Purpose

`data-builder` is a TypeScript library that provides a schema builder and a type registry. Its primary purpose is to facilitate the definition and management of various data types in a structured and type-safe manner. The library offers the following key features and benefits:

### Main Features

1. **Schema Builder**: Create schemas for different data types including:
   - Primitive types (string, number, boolean)
   - Arrays (homogeneous arrays and tuples)
   - Objects with nested properties
   - Custom types with validation logic

2. **Type Registry**: A centralized registry to manage and retrieve type definitions, ensuring type names are unique and easily accessible.

3. **Value Node Factory**: Create strongly-typed value nodes that encapsulate both the type information and the actual value, with built-in validation.

4. **Schema Validation**: Comprehensive validation system that checks values against their schemas, providing detailed error messages.

5. **Type Compatibility**: Tools to check compatibility between different types based on their schemas.

### Benefits

- **Type Safety**: Ensures data conforms to defined schemas at runtime
- **Extensibility**: Easily add custom types with specific validation logic
- **Reusability**: Centralized type registry promotes code reuse
- **Clear Error Reporting**: Detailed validation errors help in debugging

### When to Use

Use this library when you need to:
- Validate complex data structures in a type-safe way
- Manage and reuse type definitions across your application
- Ensure data conforms to specific schemas before processing
- Create custom validation logic for specific data formats

This library is particularly useful in applications that require strict data validation and type management, such as APIs, data processing pipelines, or configuration management systems.

## Usage Examples

This section provides clear, concise examples of how to use the `data-builder` library. Each example demonstrates a common use case and explains its purpose.

### 1. Creating and Registering Custom Types

The library allows you to define and register custom types with specific validation logic. This is useful for ensuring data conforms to specific formats.

#### Example 1: Basic Type Creation

Create a simple custom type with validation logic:

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// Define a custom email type with validation
const EmailType = defineType(
  'email',
  SchemaBuilder.custom('email', {
    validator: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }),
  'Represents an email address format'
);
```

#### Example 2: Nested Types

Define a type with nested properties:

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// Define a user type with nested properties
const UserType = defineType(
  'user',
  SchemaBuilder.object({
    id: SchemaBuilder.number(),
    name: SchemaBuilder.string(),
    email: SchemaBuilder.custom('email') // Use the custom email type
  }, { required: ['id', 'name'] }),
  'Represents a user entity'
);
```

#### Example 3: Advanced Usage

Create a more complex type with nested objects and arrays:

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// Define an address type
const AddressType = defineType(
  'address',
  SchemaBuilder.object({
    street: SchemaBuilder.string(),
    city: SchemaBuilder.string(),
    zip: SchemaBuilder.string().pattern(/^\d{5}$/)
  }),
  'Represents a mailing address'
);

// Define a company type with nested objects and arrays
const CompanyType = defineType(
  'company',
  SchemaBuilder.object({
    name: SchemaBuilder.string(),
    address: SchemaBuilder.custom('address'),
    employees: SchemaBuilder.array(SchemaBuilder.custom('user'))
  }),
  'Represents a company entity'
);
```

### 2. Creating Value Nodes with Validation

The library provides a factory to create strongly-typed value nodes that encapsulate both the type information and the actual value, with built-in validation.

```typescript
import { ValueNodeFactory } from 'data-builder';

// Create a string value node
const nameNode = ValueNodeFactory.createStringNode('John Doe');
console.log(nameNode); // { type: 'string', value: 'John Doe' }

// Create a number value node
const ageNode = ValueNodeFactory.createNumberNode(25);
console.log(ageNode); // { type: 'number', value: 25 }

// Create a custom email value node
const emailNode = ValueNodeFactory.createTypedNode('email', 'john@example.com');
console.log(emailNode); // { type: 'email', value: 'john@example.com' }

// Attempt to create an invalid email node (will throw an error)
try {
  ValueNodeFactory.createTypedNode('email', 'invalid-email');
} catch (error) {
  console.error(error.message); // "Schema validation failed for type 'email': Custom validation failed for type: email"
}
```

**Purpose**: This example demonstrates how to create value nodes for different types, including custom types, and shows how validation works.

### 3. Checking Type Compatibility

The library can check compatibility between different types based on their schemas, which is useful for type validation and conversion.

```typescript
import { TypeCompatibility } from 'data-builder';

// Check if two types are compatible
const areCompatible = TypeCompatibility.areCompatible('string', 'string');
console.log(areCompatible); // true

// Check compatibility with a reason
const compatibilityResult = TypeCompatibility.checkCompatibility('number', 'string');
console.log(compatibilityResult);
// {
//   isCompatible: false,
//   reason: "Type mismatch: number is not compatible with string"
// }

// Check if a value node is compatible with a target type
const stringNode = ValueNodeFactory.createStringNode('test');
const nodeCompatibility = TypeCompatibility.isNodeCompatible(stringNode, 'string');
console.log(nodeCompatibility); // { isCompatible: true }
```

**Purpose**: This example shows how to check type compatibility, which is useful for validating data types and ensuring type safety.

### 4. Using the Schema Builder for Complex Types

The schema builder allows you to define complex data structures, including arrays, objects, and custom types.

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// Define a schema for a homogeneous array of strings
const tagsSchema = SchemaBuilder.array([SchemaBuilder.string()], { minItems: 1 });
console.log(tagsSchema);
// {
//   kind: 'array',
//   items: [{ kind: 'primitive', type: 'string' }],
//   minItems: 1
// }

// Define a schema for a tuple (array with fixed elements)
const pairSchema = SchemaBuilder.array([
  SchemaBuilder.string(),
  SchemaBuilder.number()
]);
console.log(pairSchema);
// {
//   kind: 'array',
//   items: [
//     { kind: 'primitive', type: 'string' },
//     { kind: 'primitive', type: 'number' }
//   ]
// }

// Define a schema for a complex object with nested properties
const productSchema = SchemaBuilder.object({
  id: SchemaBuilder.number(),
  name: SchemaBuilder.string(),
  price: SchemaBuilder.number(),
  tags: tagsSchema,
  details: SchemaBuilder.object({
    description: SchemaBuilder.string(),
    dimensions: pairSchema
  })
});
console.log(productSchema);
// {
//   kind: 'object',
//   properties: {
//     id: { kind: 'primitive', type: 'number' },
//     name: { kind: 'primitive', type: 'string' },
//     price: { kind: 'primitive', type: 'number' },
//     tags: { ... },
//     details: { ... }
//   },
//   additionalProperties: false
// }
```

**Purpose**: This example demonstrates how to use the schema builder to define complex data structures, including arrays, tuples, and nested objects.

## API Documentation

This section provides a comprehensive overview of the library's API, documenting all major classes, functions, and methods with type information, parameter descriptions, and usage examples.

### Table of Contents

1. [SchemaBuilder](#schemabuilder)
2. [TypeRegistry](#typeregistry)
3. [ValueNodeFactory](#valuenodefactory)
4. [SchemaValidator](#schemavalidator)
5. [TypeCompatibility](#typecompatibility)
6. [Utility Functions](#utility-functions)

### SchemaBuilder

The `SchemaBuilder` object provides methods for creating different kinds of schema definitions.

#### Methods

##### string()

Creates a schema definition for a primitive 'string' type.

```typescript
SchemaBuilder.string(): PrimitiveSchema
```

**Returns:**
- `PrimitiveSchema`: A schema object representing a string.

**Example:**
```typescript
const nameSchema = SchemaBuilder.string();
// Result: { kind: 'primitive', type: 'string' }
```

##### number()

Creates a schema definition for a primitive 'number' type.

```typescript
SchemaBuilder.number(): PrimitiveSchema
```

**Returns:**
- `PrimitiveSchema`: A schema object representing a number.

**Example:**
```typescript
const ageSchema = SchemaBuilder.number();
// Result: { kind: 'primitive', type: 'number' }
```

##### boolean()

Creates a schema definition for a primitive 'boolean' type.

```typescript
SchemaBuilder.boolean(): PrimitiveSchema
```

**Returns:**
- `PrimitiveSchema`: A schema object representing a boolean.

**Example:**
```typescript
const isActiveSchema = SchemaBuilder.boolean();
// Result: { kind: 'primitive', type: 'boolean' }
```

##### array(items: Schema[], options?: { minItems?: number; maxItems?: number }): ArraySchema

Creates a schema definition for an 'array' type.

**Parameters:**
- `items` (Schema[]): An array of schema definitions.
  - For a homogeneous array (e.g., array of strings), pass a single-element array: `[SchemaBuilder.string()]`.
  - For a tuple (e.g., `[string, number]`), pass an array with schemas for each element: `[SchemaBuilder.string(), SchemaBuilder.number()]`.
- `options` (object, optional):
  - `minItems` (number, optional): The minimum number of items the array must contain.
  - `maxItems` (number, optional): The maximum number of items the array can contain.

**Returns:**
- `ArraySchema`: A schema object representing an array.

**Example:**
```typescript
// Homogeneous array of strings
const tagsSchema = SchemaBuilder.array([SchemaBuilder.string()], { minItems: 1 });
// Result: { kind: 'array', items: [{ kind: 'primitive', type: 'string' }], minItems: 1 }

// Tuple of a string and a number
const pairSchema = SchemaBuilder.array([
  SchemaBuilder.string(),
  SchemaBuilder.number()
]);
// Result: { kind: 'array', items: [{ kind: 'primitive', type: 'string' }, { kind: 'primitive', type: 'number' }] }

// Array of numbers with min and max items (homogeneous)
const scoresSchema = SchemaBuilder.array(
  [SchemaBuilder.number()], // Note: items is an array
  { minItems: 1, maxItems: 5 }
);
// Result: { kind: 'array', items: [{ kind: 'primitive', type: 'number' }], minItems: 1, maxItems: 5 }
```

##### object(properties: Record<string, Schema>, options?: { required?: string[]; additionalProperties?: boolean }): ObjectSchema

Creates a schema definition for an 'object' type.

**Parameters:**
- `properties` (Record<string, Schema>): An object where keys are property names and values are their schema definitions.
- `options` (object, optional):
  - `required` (string[], optional): An array of property names that are required for this object.
  - `additionalProperties` (boolean, optional): Whether to allow properties not defined in the schema. Defaults to false.

**Returns:**
- `ObjectSchema`: A schema object representing an object.

**Example:**
```typescript
// Simple object
const pointSchema = SchemaBuilder.object({
  x: SchemaBuilder.number(),
  y: SchemaBuilder.number()
});
// Result: { kind: 'object', properties: { x: { kind: 'primitive', type: 'number' }, y: { kind: 'primitive', type: 'number' } }, additionalProperties: false }

// Object with required properties and allowing additional properties
const userProfileSchema = SchemaBuilder.object(
  {
    id: SchemaBuilder.string(),
    username: SchemaBuilder.string(),
    email: SchemaBuilder.custom('email') // Assumes 'email' custom type is defined
  },
  { required: ['id', 'username'], additionalProperties: true }
);
// Result: {
//   kind: 'object',
//   properties: { id: ..., username: ..., email: ... },
//   required: ['id', 'username'],
//   additionalProperties: true
// }
```

##### custom(typeName: string, options?: { validator?: (value: any) => boolean; innerSchema?: Schema }): CustomSchema

Creates a schema definition for a 'custom' type.

**Parameters:**
- `typeName` (string): The unique name identifying this custom type.
- `options` (object, optional):
  - `validator` ((value: any) => boolean, optional): A function to validate the value of this custom type. Should return true if valid, false otherwise.
  - `innerSchema` (Schema, optional): An underlying schema that this custom type is based on or extends.

**Returns:**
- `CustomSchema`: A schema object representing a custom type.

**Example:**
```typescript
// Custom type with a validator
const emailSchema = SchemaBuilder.custom('email', {
  validator: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
});
// Result: { kind: 'custom', typeName: 'email', validator: [Function] }

// Custom type based on an inner schema (e.g., a positive number)
const positiveNumberSchema = SchemaBuilder.custom('positiveNumber', {
  innerSchema: SchemaBuilder.number(),
  validator: (value) => typeof value === 'number' && value > 0
});
// Result: { kind: 'custom', typeName: 'positiveNumber', innerSchema: { kind: 'primitive', type: 'number' }, validator: [Function] }

// Custom type that just references another registered type
const userIdSchema = SchemaBuilder.custom('UUID');
// Result: { kind: 'custom', typeName: 'UUID' }
// (Assumes a 'UUID' type is registered elsewhere with its own schema and/or validator)

// Custom type with only an inner schema (useful for aliasing or adding semantic meaning)
const productCodeSchema = SchemaBuilder.custom('ProductCode', { innerSchema: SchemaBuilder.string() });
// Result: { kind: 'custom', typeName: 'ProductCode', innerSchema: { kind: 'primitive', type: 'string' } }
```

### TypeRegistry

The `TypeRegistry` class manages the registration and retrieval of type definitions.

#### Methods

##### registerType<T extends string>(typeDefinition: TypeDefinition<T>): void

Registers a new type definition.

**Parameters:**
- `typeDefinition` (TypeDefinition<T>): The type definition object to register.

**Throws:**
- `Error`: If the type name is already registered.

**Example:**
```typescript
import { defineType } from './core/registry';
import { SchemaBuilder } from './core/registry';

const EmailType = defineType(
  'email',
  SchemaBuilder.custom('email', {
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }),
  'Represents an email address format'
);
```

##### getType(typeName: string): TypeDefinition | undefined

Retrieves a type definition by its name.

**Parameters:**
- `typeName` (string): The name of the type to retrieve.

**Returns:**
- `TypeDefinition | undefined`: The type definition if found, otherwise undefined.

##### hasType(typeName: string): boolean

Checks if a type with the given name is registered.

**Parameters:**
- `typeName` (string): The name of the type to check.

**Returns:**
- `boolean`: True if the type is registered, false otherwise.

##### getAllTypes(): ReadonlyMap<string, TypeDefinition>

Retrieves all registered type definitions.

**Returns:**
- `ReadonlyMap<string, TypeDefinition>`: A read-only map of all type definitions.

##### getTypeNames(): string[]

Retrieves the names of all registered types.

**Returns:**
- `string[]`: An array of registered type names.

### ValueNodeFactory

The `ValueNodeFactory` class provides methods for creating value nodes with type validation.

#### Methods

##### createTypedNode<T extends string, U>(typeName: T, value: U): ValueNode<T, U>

Creates a typed value node with validation.

**Parameters:**
- `typeName` (T): The name of the type.
- `value` (U): The value to create a node for.

**Returns:**
- `ValueNode<T, U>`: A value node with the specified type and value.

**Throws:**
- `Error`: If the type is unknown or validation fails.

**Example:**
```typescript
import { ValueNodeFactory } from './factory/index';

const stringNode = ValueNodeFactory.createStringNode("hello");
// Result: { type: 'string', value: 'hello' }
```

##### createStringNode(value: string): ValueNode<'string', string>

Creates a string value node.

**Parameters:**
- `value` (string): The string value.

**Returns:**
- `ValueNode<'string', string>`: A string value node.

##### createNumberNode(value: number): ValueNode<'number', number>

Creates a number value node.

**Parameters:**
- `value` (number): The number value.

**Returns:**
- `ValueNode<'number', number>`: A number value node.

##### createBooleanNode(value: boolean): ValueNode<'boolean', boolean>

Creates a boolean value node.

**Parameters:**
- `value` (boolean): The boolean value.

**Returns:**
- `ValueNode<'boolean', boolean>`: A boolean value node.

##### tryCreateNode<T extends string, U>(typeName: T, value: U): { success: true; node: ValueNode<T, U> } | { success: false; error: string }

Attempts to create a typed value node with validation.

**Parameters:**
- `typeName` (T): The name of the type.
- `value` (U): The value to create a node for.

**Returns:**
- `{ success: true; node: ValueNode<T, U> }` if successful, otherwise `{ success: false; error: string }`.

### SchemaValidator

The `SchemaValidator` class provides methods for validating values against schemas.

#### Methods

##### validateValue(value: unknown, schema: Schema): ValidationResult

Validates a value against a schema.

**Parameters:**
- `value` (unknown): The value to validate.
- `schema` (Schema): The schema to validate against.

**Returns:**
- `ValidationResult`: An object indicating whether the value is valid and any validation errors.

**Example:**
```typescript
import { SchemaValidator } from './validation/index';
import { SchemaBuilder } from './core/registry';

const schema = SchemaBuilder.object({
  name: SchemaBuilder.string(),
  age: SchemaBuilder.number()
});

const result = SchemaValidator.validateValue({ name: 'John', age: 30 }, schema);
console.log(result);
// { isValid: true, errors: [] }

const invalidResult = SchemaValidator.validateValue({ name: 'John' }, schema);
console.log(invalidResult);
// { isValid: false, errors: ['Property "age" is required'] }
```

### TypeCompatibility

The `TypeCompatibility` class provides methods for checking type compatibility.

#### Methods

##### areCompatible(sourceTypeName: string, targetTypeName: string): boolean

Checks if two types are compatible.

**Parameters:**
- `sourceTypeName` (string): The name of the source type.
- `targetTypeName` (string): The name of the target type.

**Returns:**
- `boolean`: True if the types are compatible, false otherwise.

**Example:**
```typescript
import { TypeCompatibility } from './core/registry';

const areCompatible = TypeCompatibility.areCompatible('string', 'string');
console.log(areCompatible); // true
```

##### checkCompatibility(sourceTypeName: string, targetTypeName: string): CompatibilityResult

Checks if two types are compatible and provides a reason if they are not.

**Parameters:**
- `sourceTypeName` (string): The name of the source type.
- `targetTypeName` (string): The name of the target type.

**Returns:**
- `CompatibilityResult`: An object indicating whether the types are compatible and a reason if they are not.

**Example:**
```typescript
import { TypeCompatibility } from './core/registry';

const compatibilityResult = TypeCompatibility.checkCompatibility('number', 'string');
console.log(compatibilityResult);
// {
//   isCompatible: false,
//   reason: "Type mismatch: number is not compatible with string"
// }
```

##### isNodeCompatible(node: ValueNode, targetTypeName: string): CompatibilityResult

Checks if a value node is compatible with a target type.

**Parameters:**
- `node` (ValueNode): The value node to check.
- `targetTypeName` (string): The name of the target type.

**Returns:**
- `CompatibilityResult`: An object indicating whether the node is compatible with the target type and a reason if it is not.

**Example:**
```typescript
import { TypeCompatibility } from './core/registry';
import { ValueNodeFactory } from './factory/index';

const stringNode = ValueNodeFactory.createStringNode('test');
const nodeCompatibility = TypeCompatibility.isNodeCompatible(stringNode, 'string');
console.log(nodeCompatibility); // { isCompatible: true }
```

### Utility Functions

The library provides several utility functions to assist with common tasks.

#### validateTypeValue(typeName: string, value: unknown): string[]

Validates a value against a registered type and returns an array of validation errors.

**Parameters:**
- `typeName` (string): The name of the type to validate against.
- `value` (unknown): The value to validate.

**Returns:**
- `string[]`: An array of validation error messages, or an empty array if the value is valid.

**Example:**
```typescript
import { validateTypeValue } from './validation/index';

const errors = validateTypeValue('email', 'invalid-email');
console.log(errors); // ["Custom validation failed for type: email"]
```

#### inspectType(typeName: string): void

Inspects a registered type and logs its details to the console.

**Parameters:**
- `typeName` (string): The name of the type to inspect.

**Example:**
```typescript
import { inspectType } from './core/registry';

inspectType('email');
// Logs details about the 'email' type to the console
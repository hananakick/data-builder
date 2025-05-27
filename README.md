# data-builder

## Library Overview
`data-builder` is a library that provides a schema builder and a type registry. It offers functionalities to define and manage various data types. Its main features include the ability to create schemas for basic types (string, number, boolean), arrays, objects, and custom types.

## Usage
To use the library, follow the steps below:

### Installation
Install the library using npm:

```bash
npm install data-builder
```

```typescript
import { SchemaBuilder, TypeRegistry, defineType } from 'data-builder';

// 기본 타입 사용 예제
const stringSchema = SchemaBuilder.string();
const numberSchema = SchemaBuilder.number();
const booleanSchema = SchemaBuilder.boolean();

// 배열 타입 사용 예제
const stringArraySchema = SchemaBuilder.array([SchemaBuilder.string()]);

// 객체 타입 사용 예제
const userSchema = SchemaBuilder.object({
  id: SchemaBuilder.number(),
  name: SchemaBuilder.string(),
  email: SchemaBuilder.custom('email')
}, { required: ['id', 'name'] });

// 사용자 정의 타입 정의 및 등록
const EmailType = defineType(
  'email',
  SchemaBuilder.custom('email', {
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }),
  'Represents an email address format'
);
```
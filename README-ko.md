# data-builder

`data-builder`는 스키마 빌더와 타입 레지스트리를 제공하는 TypeScript 라이브러리입니다. 주요 목적은 다양한 데이터 타입을 구조화되고 타입 안전하게 정의하고 관리하는 데 있습니다. 이 라이브러리는 스키마 빌딩, 타입 등록, 값 노드 생성, 검증 및 타입 호환성 검사 등 주요 기능을 제공합니다.

## 라이브러리 목적

`data-builder`는 스키마 빌더와 타입 레지스트리를 제공하는 TypeScript 라이브러리입니다. 주요 목적은 다양한 데이터 타입을 구조화되고 타입 안전하게 정의하고 관리하는 데 있습니다. 이 라이브러리는 다음과 같은 주요 기능과 이점을 제공합니다:

### 주요 기능

1. **스키마 빌더**: 다양한 데이터 타입의 스키마를 생성할 수 있습니다:
   - 기본 타입(문자열, 숫자, 불리언)
   - 배열(동질 배열 및 튜플)
   - 중첩된 속성을 가진 객체
   - 검증 로직이 있는 사용자 정의 타입

2. **타입 레지스트리**: 타입 정의 관리를 위한 중앙 집중식 레지스트리로, 타입 이름이 고유하고 쉽게 접근할 수 있도록 합니다.

3. **값 노드 팩토리**: 타입 정보와 실제 값을 캡슐화하는 강하게 타입화된 값 노드를 생성하며, 내장된 검증이 있습니다.

4. **스키마 검증**: 값이 스키마에 맞는지 확인하는 포괄적인 검증 시스템으로, 자세한 오류 메시지를 제공합니다.

5. **타입 호환성**: 스키마를 기반으로 다양한 타입 간의 호환성을 확인하는 도구.

### 이점

- **타입 안전성**: 정의된 스키마에 데이터가 런타임에 맞는지 보장
- **확장성**: 특정 검증 로직을 가진 사용자 정의 타입을 쉽게 추가
- **재사용성**: 중앙 집중식 타입 레지스트리가 코드 재사용을 촉진
- **명확한 오류 보고**: 자세한 검증 오류가 디버깅에 도움이 됨

### 사용 시점

이 라이브러리를 사용할 때는 다음과 같은 경우입니다:
- 복잡한 데이터 구조를 타입 안전하게 검증해야 할 때
- 애플리케이션 전체에서 타입 정의 관리를 해야 할 때
- 데이터가 특정 스키마에 맞는지 확인하기 전에 처리해야 할 때
- 특정 데이터 형식에 대한 사용자 정의 검증 로직을 생성해야 할 때

이 라이브러리는 API, 데이터 처리 파이프라인 또는 구성 관리 시스템과 같은 엄격한 데이터 검증 및 타입 관리가 필요한 애플리케이션에 특히 유용합니다.

## 사용 예제

이 섹션에서는 `data-builder` 라이브러리를 사용하는 방법을 명확하고 간결한 예제를 통해 설명합니다. 각 예제는 일반적인 사용 사례를 보여주고 그 목적을 설명합니다.

### 1. 사용자 정의 타입 생성 및 등록

이 라이브러리는 특정 검증 로직을 가진 사용자 정의 타입을 정의하고 등록할 수 있게 합니다. 이는 데이터가 특정 형식에 맞는지 보장하는 데 유용합니다.

#### 예제 1: 기본 타입 생성

검증 로직이 있는 간단한 사용자 정의 타입을 생성합니다:

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// 검증 로직이 있는 사용자 정의 이메일 타입 정의
const EmailType = defineType(
  'email',
  SchemaBuilder.custom('email', {
    validator: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }),
  '이메일 주소 형식을 나타냄'
);
```

#### 예제 2: 중첩된 타입

중첩된 속성을 가진 타입을 정의합니다:

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// 중첩된 속성을 가진 사용자 타입 정의
const UserType = defineType(
  'user',
  SchemaBuilder.object({
    id: SchemaBuilder.number(),
    name: SchemaBuilder.string(),
    email: SchemaBuilder.custom('email') // 사용자 정의 이메일 타입 사용
  }, { required: ['id', 'name'] }),
  '사용자 엔티티를 나타냄'
);
```

#### 예제 3: 고급 사용

중첩된 객체와 배열이 있는 더 복잡한 타입을 생성합니다:

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// 주소 타입 정의
const AddressType = defineType(
  'address',
  SchemaBuilder.object({
    street: SchemaBuilder.string(),
    city: SchemaBuilder.string(),
    zip: SchemaBuilder.string().pattern(/^\d{5}$/)
  }),
  '우편 주소를 나타냄'
);

// 중첩된 객체와 배열이 있는 회사 타입 정의
const CompanyType = defineType(
  'company',
  SchemaBuilder.object({
    name: SchemaBuilder.string(),
    address: SchemaBuilder.custom('address'),
    employees: SchemaBuilder.array(SchemaBuilder.custom('user'))
  }),
  '회사 엔티티를 나타냄'
);
```

### 2. 검증이 있는 값 노드 생성

이 라이브러리는 타입 정보와 실제 값을 캡슐화하는 강하게 타입화된 값 노드를 생성하는 팩토리를 제공하며, 내장된 검증이 있습니다.

```typescript
import { ValueNodeFactory } from 'data-builder';

// 문자열 값 노드 생성
const nameNode = ValueNodeFactory.createStringNode('John Doe');
console.log(nameNode); // { type: 'string', value: 'John Doe' }

// 숫자 값 노드 생성
const ageNode = ValueNodeFactory.createNumberNode(25);
console.log(ageNode); // { type: 'number', value: 25 }

// 사용자 정의 이메일 값 노드 생성
const emailNode = ValueNodeFactory.createTypedNode('email', 'john@example.com');
console.log(emailNode); // { type: 'email', value: 'john@example.com' }

// 무효한 이메일 노드를 생성하려는 시도 (오류 발생)
try {
  ValueNodeFactory.createTypedNode('email', 'invalid-email');
} catch (error) {
  console.error(error.message); // "Schema validation failed for type 'email': Custom validation failed for type: email"
}
```

**목적**: 이 예제는 다양한 타입, 포함 사용자 정의 타입의 값 노드를 생성하는 방법을 보여주고 검증이 어떻게 작동하는지 보여줍니다.

### 3. 타입 호환성 확인

이 라이브러리는 스키마를 기반으로 다양한 타입 간의 호환성을 확인할 수 있으며, 이는 타입 검증 및 변환에 유용합니다.

```typescript
import { TypeCompatibility } from 'data-builder';

// 두 타입이 호환되는지 확인
const areCompatible = TypeCompatibility.areCompatible('string', 'string');
console.log(areCompatible); // true

// 호환성 확인 및 이유
const compatibilityResult = TypeCompatibility.checkCompatibility('number', 'string');
console.log(compatibilityResult);
// {
//   isCompatible: false,
//   reason: "Type mismatch: number is not compatible with string"
// }

// 값 노드가 대상 타입과 호환되는지 확인
const stringNode = ValueNodeFactory.createStringNode('test');
const nodeCompatibility = TypeCompatibility.isNodeCompatible(stringNode, 'string');
console.log(nodeCompatibility); // { isCompatible: true }
```

**목적**: 이 예제는 타입 호환성을 확인하는 방법을 보여주며, 이는 데이터 타입을 검증하고 타입 안전성을 보장하는 데 유용합니다.

### 4. 복잡한 타입을 위한 스키마 빌더 사용

스키마 빌더는 배열, 객체 및 사용자 정의 타입을 포함한 복잡한 데이터 구조를 정의할 수 있습니다.

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// 동질 문자열 배열의 스키마 정의
const tagsSchema = SchemaBuilder.array([SchemaBuilder.string()], { minItems: 1 });
console.log(tagsSchema);
// {
//   kind: 'array',
//   items: [{ kind: 'primitive', type: 'string' }],
//   minItems: 1
// }

// 고정된 요소로 구성된 튜플(배열)의 스키마 정의
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

// 중첩된 속성을 가진 복잡한 객체의 스키마 정의
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

**목적**: 이 예제는 스키마 빌더를 사용하여 배열, 튜플 및 중첩된 객체를 포함한 복잡한 데이터 구조를 정의하는 방법을 보여줍니다.

## API 문서

이 섹션에서는 라이브러리의 API에 대한 포괄적인 개요를 제공하며, 모든 주요 클래스, 함수 및 메서드에 대한 타입 정보, 매개변수 설명 및 사용 예제를 문서화합니다.

### 목차

1. [SchemaBuilder](#schemabuilder)
2. [TypeRegistry](#typeregistry)
3. [ValueNodeFactory](#valuenodefactory)
4. [SchemaValidator](#schemavalidator)
5. [TypeCompatibility](#typecompatibility)
6. [유틸리티 함수](#utility-functions)
7. [defineType](#defineType)

### SchemaBuilder

`SchemaBuilder` 객체는 다양한 종류의 스키마 정의 생성 메서드를 제공합니다.

#### 메서드

##### string()

기본 '문자열' 타입의 스키마 정의 생성.

```typescript
SchemaBuilder.string(): PrimitiveSchema
```

**반환:**
- `PrimitiveSchema`: 문자열을 나타내는 스키마 객체.

**예제:**
```typescript
const nameSchema = SchemaBuilder.string();
// 결과: { kind: 'primitive', type: 'string' }
```

##### number()

기본 '숫자' 타입의 스키마 정의 생성.

```typescript
SchemaBuilder.number(): PrimitiveSchema
```

**반환:**
- `PrimitiveSchema`: 숫자를 나타내는 스키마 객체.

**예제:**
```typescript
const ageSchema = SchemaBuilder.number();
// 결과: { kind: 'primitive', type: 'number' }
```

##### boolean()

기본 '불리언' 타입의 스키마 정의 생성.

```typescript
SchemaBuilder.boolean(): PrimitiveSchema
```

**반환:**
- `PrimitiveSchema`: 불리언을 나타내는 스키마 객체.

**예제:**
```typescript
const isActiveSchema = SchemaBuilder.boolean();
// 결과: { kind: 'primitive', type: 'boolean' }
```

##### array(items: Schema[], options?: { minItems?: number; maxItems?: number }): ArraySchema

'배열' 타입의 스키마 정의 생성.

**매개변수:**
- `items` (Schema[]): 스키마 정의 배열.
  - 동질 배열(예: 문자열 배열)의 경우 단일 요소 배열을 전달합니다: `[SchemaBuilder.string()]`.
  - 튜플(예: `[문자열, 숫자]`)의 경우 각 요소의 스키마가 있는 배열을 전달합니다: `[SchemaBuilder.string(), SchemaBuilder.number()]`.
- `options` (객체, 선택 사항):
  - `minItems` (숫자, 선택 사항): 배열이 포함해야 하는 최소 항목 수.
  - `maxItems` (숫자, 선택 사항): 배열이 포함할 수 있는 최대 항목 수.

**반환:**
- `ArraySchema`: 배열을 나타내는 스키마 객체.

**예제:**
```typescript
// 동질 문자열 배열
const tagsSchema = SchemaBuilder.array([SchemaBuilder.string()], { minItems: 1 });
// 결과: { kind: 'array', items: [{ kind: 'primitive', type: 'string' }], minItems: 1 }

// 문자열과 숫자로 구성된 튜플
const pairSchema = SchemaBuilder.array([
  SchemaBuilder.string(),
  SchemaBuilder.number()
]);
// 결과: { kind: 'array', items: [{ kind: 'primitive', type: 'string' }, { kind: 'primitive', type: 'number' }] }

// 최소 및 최대 항목이 있는 숫자 배열(동질)
const scoresSchema = SchemaBuilder.array(
  [SchemaBuilder.number()], // 참고: items는 배열입니다
  { minItems: 1, maxItems: 5 }
);
// 결과: { kind: 'array', items: [{ kind: 'primitive', type: 'number' }], minItems: 1, maxItems: 5 }
```

##### object(properties: Record<string, Schema>, options?: { required?: string[]; additionalProperties?: boolean }): ObjectSchema

'객체' 타입의 스키마 정의 생성.

**매개변수:**
- `properties` (Record<string, Schema>): 키가 속성 이름이고 값이 해당 스키마 정의인 객체.
- `options` (객체, 선택 사항):
  - `required` (string[], 선택 사항): 이 객체에 대해 필요한 속성 이름 배열.
  - `additionalProperties` (불리언, 선택 사항): 스키마에 정의되지 않은 속성을 허용할지 여부. 기본값은 false입니다.

**반환:**
- `ObjectSchema`: 객체를 나타내는 스키마 객체.

**예제:**
```typescript
// 간단한 객체
const pointSchema = SchemaBuilder.object({
  x: SchemaBuilder.number(),
  y: SchemaBuilder.number()
});
// 결과: { kind: 'object', properties: { x: { kind: 'primitive', type: 'number' }, y: { kind: 'primitive', type: 'number' } }, additionalProperties: false }

// 필요한 속성과 추가 속성을 허용하는 객체
const userProfileSchema = SchemaBuilder.object(
  {
    id: SchemaBuilder.string(),
    username: SchemaBuilder.string(),
    email: SchemaBuilder.custom('email') // 'email' 사용자 정의 타입이 정의되어 있다고 가정
  },
  { required: ['id', 'username'], additionalProperties: true }
);
// 결과: {
//   kind: 'object',
//   properties: { id: ..., username: ..., email: ... },
//   required: ['id', 'username'],
//   additionalProperties: true
// }
```

##### custom(typeName: string, options?: { validator?: (value: any) => boolean; innerSchema?: Schema }): CustomSchema

'사용자 정의' 타입의 스키마 정의 생성.

**매개변수:**
- `typeName` (문자열): 이 사용자 정의 타입을 식별하는 고유 이름.
- `options` (객체, 선택 사항):
  - `validator` ((value: any) => boolean, 선택 사항): 이 사용자 정의 타입의 값을 검증하는 함수. 유효한 경우 true, 그렇지 않은 경우 false를 반환해야 합니다.
  - `innerSchema` (Schema, 선택 사항): 이 사용자 정의 타입이 기반으로 하거나 확장하는 기본 스키마.

**반환:**
- `CustomSchema`: 사용자 정의 타입을 나타내는 스키마 객체.

**예제:**
```typescript
// 검증기가 있는 사용자 정의 타입
const emailSchema = SchemaBuilder.custom('email', {
  validator: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
});
// 결과: { kind: 'custom', typeName: 'email', validator: [Function] }

// 기본 스키마(예: 양수)에 기반한 사용자 정의 타입
const positiveNumberSchema = SchemaBuilder.custom('positiveNumber', {
  innerSchema: SchemaBuilder.number(),
  validator: (value) => typeof value === 'number' && value > 0
});
// 결과: { kind: 'custom', typeName: 'positiveNumber', innerSchema: { kind: 'primitive', type: 'number' }, validator: [Function] }

// 다른 등록된 타입을 참조하는 사용자 정의 타입
const userIdSchema = SchemaBuilder.custom('UUID');
// 결과: { kind: 'custom', typeName: 'UUID' }
// (다른 곳에서 'UUID' 타입이 스키마 및/또는 검증기로 등록되어 있다고 가정)

// 기본 스키마만 있는 사용자 정의 타입(별칭 지정 또는 의미 부여에 유용)
const productCodeSchema = SchemaBuilder.custom('ProductCode', { innerSchema: SchemaBuilder.string() });
// 결과: { kind: 'custom', typeName: 'ProductCode', innerSchema: { kind: 'primitive', type: 'string' } }
```

### TypeRegistry

`TypeRegistry` 클래스는 타입 정의의 등록 및 검색을 관리합니다.

#### 메서드

##### registerType<T extends string>(typeDefinition: TypeDefinition<T>): void

새 타입 정의 등록.

**매개변수:**
- `typeDefinition` (TypeDefinition<T>): 등록할 타입 정의 객체.

**예외:**
- `Error`: 타입 이름이 이미 등록된 경우.

**예제:**
```typescript
import { defineType } from './core/registry';
import { SchemaBuilder } from './core/registry';

const EmailType = defineType(
  'email',
  SchemaBuilder.custom('email', {
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }),
  '이메일 주소 형식을 나타냄'
);
```

##### getType(typeName: string): TypeDefinition | undefined

이름으로 타입 정의 검색.

**매개변수:**
- `typeName` (문자열): 검색할 타입 이름.

**반환:**
- `TypeDefinition | undefined`: 타입 정의가 있는 경우 해당 타입 정의, 그렇지 않은 경우 undefined.

##### hasType(typeName: string): boolean

주어진 이름의 타입이 등록되어 있는지 확인.

**매개변수:**
- `typeName` (문자열): 확인할 타입 이름.

**반환:**
- `boolean`: 타입이 등록된 경우 true, 그렇지 않은 경우 false.

##### getAllTypes(): ReadonlyMap<string, TypeDefinition>

모든 등록된 타입 정의 검색.

**반환:**
- `ReadonlyMap<string, TypeDefinition>`: 모든 타입 정의의 읽기 전용 맵.

##### getTypeNames(): string[]

모든 등록된 타입 이름 검색.

**반환:**
- `string[]`: 등록된 타입 이름 배열.

### ValueNodeFactory

`ValueNodeFactory` 클래스는 타입 검증이 있는 값 노드 생성 메서드를 제공합니다.

#### 메서드

##### createTypedNode<T extends string, U>(typeName: T, value: U): ValueNode<T, U>

검증이 있는 타입화된 값 노드 생성.

**매개변수:**
- `typeName` (T): 타입 이름.
- `value` (U): 노드를 생성할 값.

**반환:**
- `ValueNode<T, U>`: 지정된 타입과 값이 있는 값 노드.

**예외:**
- `Error`: 타입이 알려지지 않거나 검증에 실패한 경우.

**예제:**
```typescript
import { ValueNodeFactory } from './factory/index';

const stringNode = ValueNodeFactory.createStringNode("hello");
```

##### createStringNode(value: string): ValueNode<'string', string>

문자열 값 노드 생성.

**매개변수:**
- `value` (문자열): 문자열 값.

**반환:**
- `ValueNode<'string', string>`: 문자열 값이 있는 값 노드.

**예제:**
```typescript
const nameNode = ValueNodeFactory.createStringNode("John Doe");
```

##### createNumberNode(value: number): ValueNode<'number', number>

숫자 값 노드 생성.

**매개변수:**
- `value` (숫자): 숫자 값.

**반환:**
- `ValueNode<'number', number>`: 숫자 값이 있는 값 노드.

**예제:**
```typescript
const ageNode = ValueNodeFactory.createNumberNode(25);
```

##### createBooleanNode(value: boolean): ValueNode<'boolean', boolean>

불리언 값 노드 생성.

**매개변수:**
- `value` (불리언): 불리언 값.

**반환:**
- `ValueNode<'boolean', boolean>`: 불리언 값이 있는 값 노드.

**예제:**
```typescript
const isActiveNode = ValueNodeFactory.createBooleanNode(true);
```

##### tryCreateNode<T extends string, U>(typeName: T, value: U): { success: true; node: ValueNode<T, U> } | { success: false; error: string }

검증이 있는 타입화된 값 노드를 생성하려는 시도를 하며, 결과 객체를 반환합니다.

**매개변수:**
- `typeName` (T): 타입 이름.
- `value` (U): 노드를 생성할 값.

**반환:**
- `{ success: true; node: ValueNode<T, U> }`: 성공한 경우 생성된 값 노드를 포함합니다.
- `{ success: false; error: string }`: 실패한 경우 오류 메시지를 포함합니다.

**예제:**
```typescript
const result = ValueNodeFactory.tryCreateNode('email', 'test@example.com');
if (result.success) {
  console.log(result.node);
} else {
  console.error(result.error);
}
```

### SchemaValidator

`SchemaValidator` 클래스는 스키마에 대해 값을 검증하는 메서드를 제공합니다.

#### 메서드

##### validateValue(value: unknown, schema: Schema): ValidationResult

값을 스키마에 대해 검증합니다.

**매개변수:**
- `value` (unknown): 검증할 값.
- `schema` (Schema): 검증할 스키마.

**반환:**
- `ValidationResult`: 검증 결과가 포함된 객체.

**예제:**
```typescript
import { SchemaValidator } from './validation/index';
import { SchemaBuilder } from './core/registry';

const schema = SchemaBuilder.string();
const result = SchemaValidator.validateValue("hello", schema);
console.log(result.isValid); // true
```

### TypeCompatibility

`TypeCompatibility` 클래스는 타입 호환성을 확인하는 메서드를 제공합니다.

#### 메서드

##### areCompatible(sourceTypeName: string, targetTypeName: string): boolean

두 타입이 호환되는지 확인합니다.

**매개변수:**
- `sourceTypeName` (문자열): 소스 타입 이름.
- `targetTypeName` (문자열): 대상 타입 이름.

**반환:**
- `boolean`: 타입이 호환되는 경우 true, 그렇지 않은 경우 false.

**예제:**
```typescript
import { TypeCompatibility } from './core/types';

const areCompatible = TypeCompatibility.areCompatible('string', 'string');
console.log(areCompatible); // true
```

##### checkCompatibility(sourceTypeName: string, targetTypeName: string): CompatibilityResult

두 타입이 호환되는지 확인하고 자세한 결과를 반환합니다.

**매개변수:**
- `sourceTypeName` (문자열): 소스 타입 이름.
- `targetTypeName` (문자열): 대상 타입 이름.

**반환:**
- `CompatibilityResult`: 호환성 결과 및 이유를 포함하는 객체.

**예제:**
```typescript
const result = TypeCompatibility.checkCompatibility('number', 'string');
console.log(result.isCompatible); // false
console.log(result.reason); // "Type mismatch: number is not compatible with string"
```

##### isNodeCompatible(node: ValueNode, targetTypeName: string): CompatibilityResult

값 노드가 대상 타입과 호환되는지 확인합니다.

**매개변수:**
- `node` (ValueNode): 확인할 값 노드.
- `targetTypeName` (문자열): 대상 타입 이름.

**반환:**
- `CompatibilityResult`: 호환성 결과 및 이유를 포함하는 객체.

**예제:**
```typescript
const stringNode = ValueNodeFactory.createStringNode('test');
const result = TypeCompatibility.isNodeCompatible(stringNode, 'string');
console.log(result.isCompatible); // true
```

### 유틸리티 함수

#### validateTypeValue(typeName: string, value: unknown): string[]

값을 등록된 타입에 대해 검증하고 오류 메시지 배열을 반환합니다.

**매개변수:**
- `typeName` (문자열): 검증할 타입 이름.
- `value` (unknown): 검증할 값.

**반환:**
- `string[]`: 오류 메시지 배열 또는 값이 유효한 경우 빈 배열.

**예제:**
```typescript
import { validateTypeValue } from './core/registry';

const errors = validateTypeValue('email', 'invalid-email');
console.log(errors); // ["Schema validation failed for type 'email': Custom validation failed for type: email"]
```

#### inspectType(typeName: string): void

등록된 타입을 검사하고 콘솔에 세부 정보를 로그로 출력합니다.

**매개변수:**
- `typeName` (문자열): 검사할 타입 이름.

**예제:**
```typescript
import { inspectType } from './core/registry';

inspectType('email');
// 출력: {
//   name: 'email',
//   schema: { kind: 'custom', typeName: 'email', validator: [Function] },
//   description: '이메일 주소 형식을 나타냄'
// }
```

### defineType

스키마와 선택적 설명이 있는 새 타입 정의 및 등록.

```typescript
defineType<T extends string>(
  name: T,
  schema: Schema,
  description?: string
): TypeDefinition<T>
```

**매개변수:**

- `name` (T): 타입 이름. 이는 타입을 고유하게 식별하는 고유 문자열이어야 합니다.
- `schema` (Schema): 타입의 스키마 정의. 이는 `SchemaBuilder`를 사용하여 생성할 수 있습니다.
- `description` (문자열, 선택 사항): 타입의 목적이나 사용법을 설명하는 설명.

**반환:**

- `TypeDefinition<T>`: 등록된 타입 정의, 이름, 스키마 및 설명이 포함됩니다.

**예제:**

```typescript
import { SchemaBuilder, defineType } from 'data-builder';

// 검증 로직이 있는 사용자 정의 이메일 타입 정의
const EmailType = defineType(
  'email',
  SchemaBuilder.custom('email', {
    validator: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }),
  '이메일 주소 형식을 나타냄'
);
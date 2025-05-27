# data-builder

## 라이브러리 역할
`data-builder`는 스키마 빌더와 타입 레지스트리를 제공하는 라이브러리입니다. 이 라이브러리는 다양한 데이터 타입을 정의하고 관리할 수 있는 기능을 제공합니다. 주요 기능으로는 기본 타입(문자열, 숫자, 불리언), 배열, 객체, 그리고 사용자 정의 타입의 스키마를 생성할 수 있는 기능이 있습니다.

## 사용 방법
라이브러리를 사용하려면 다음과 같이 설치하고 임포트할 수 있습니다:

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

## 라이브러리 개발 방법
라이브러리를 개발하려면 다음과 같은 단계를 따릅니다:

1. `package.json` 파일을 통해 프로젝트를 초기화합니다.
2. `src/core/registry.ts` 파일을 통해 스키마 빌더와 타입 레지스트리를 구현합니다.
3. `src/index.ts` 파일을 통해 모듈을 내보냅니다.
4. `npm run build` 명령어를 통해 프로젝트를 빌드합니다.
5. `npm run start` 명령어를 통해 프로젝트를 실행합니다.
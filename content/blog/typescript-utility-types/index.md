---
title: "남들은 잘 쓰는 Utility types"
date: "2022-06-04T20:19:00"
categories: [typescript]
description: "나는 잘 안 쓰고 있는데 다른 개발자들은 잘 쓰고 있는 것들을 간단히 모아 보았다."
comments: true
---
나는 잘 안 쓰고 있는데 다른 개발자들은 잘 쓰고 있는 것들을 간단히 모아 보았다.

### Exclude<UnionType, ExcludedMembers>

ExcludedMembers에 할당 가능한 멤버가 UnionType에 있으면 제외 (여집합)

```tsx
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
// type T1 = "c"
```

### Extract<Type, Union>

Union에 할당 가능한 멤버가 Type에 있으면 추출 (교집합)

```tsx
type T1 = Extract<string | number | (() => void), Function>;
// type T1 = () => void
```

### Parameters<Type>

함수 타입의 인자를 튜플 타입으로 생성

```tsx
type T0 = Parameters<() => string>; // type T0 = []
type T1 = Parameters<(s: string) => void>; // type T1 = [s: string]
type T2 = Parameters<<T>(arg: T) => T>; // type T2 = [arg: unknown]
```

### ConstructorParameters<Type>

생성자 함수 타입의 인자를 tuple이나 array로 생성

- 생성자 함수 타입: `new (...args: any): any`

```tsx
type T0 = ConstructorParameters<ErrorConstructor>; // type T0 = [message?: string]
type T1 = ConstructorParameters<FunctionConstructor>; // type T1 = string[]
```

### ReturnType<Type>

함수 타입의 return 타입을 생성

```tsx
declare function f1(): { a: number; b: string };
type T4 = ReturnType<typeof f1>; // type T4 = { a: number; b: string; }
```

### InstanceType<Type>

생성자 함수의 인스턴스 타입으로 구성된 타입을 생성

```tsx
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>; // type T0 = C
```


## Reference
[TypeScript 공식문서](https://www.typescriptlang.org/ko/docs/handbook/utility-types.html)
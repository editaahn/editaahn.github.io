---
title: "TypeScript의 Decorators"
date: "2022-06-12T22:00:00"
categories: [typescript]
description: "데코레이터가 어떤 용도로 쓰이고 어떤 타입이 있는 지 알아본다."
comments: true
---

## Decorator

- Class와 Class 멤버에 대한 설명이나 수정을 지원하는 기능을 제공할 때 사용
- 아직은 실험적인 기능
- `@expression` 과 같은 형식으로 사용
    - 런타임에 `expression` 함수 호출

```tsx
function sealed(target) {
    // 'target' 변수와 함께 무언가를 수행합니다.
}
```

### Decorator Factories

데코레이터가 선언 시 적용되는 방식을 바꾸고 싶을 때 쓴다. 단순히 runtime에 데코레이터에 의해 호출될 표현식을 리턴하는 함수다.

```tsx
function color(value: string) { // 데코레이터 팩토리
  return function (target) {
    // 데코레이터
    // do something with 'target' and 'value'...
  };
}
```

## 데코레이터 합성

수학의 합성함수 방식과 비슷

```tsx
@f
@g
x
```

위처럼 코드가 있는 경우 `f(g(x))`

- 위 함수부터 평가됨
- 아래에서 위로 결과가 전달됨

### 예시

```tsx
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}
 
function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}
 
class ExampleClass {
  @first()
  @second()
  method() {}
}
```

### 실행 결과

```
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

## Class 데코레이터

- Class 선언 직전에 선언
- 런타임에 함수로 호출
- Class의 생성자를 유일한 인수로 받는다

```tsx
@sealed
class BugReport {
  type = "report";
  title: string;
 
  constructor(t: string) {
    this.title = t;
  }
}

function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

- 타입 시스템에 정해진 Class의 타입을 데코레이터를 통해 바꿀 수 없음

```tsx
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www...";
  };
}
 
@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;
 
  constructor(t: string) {
    this.title = t;
  }
}
 
const bug = new BugReport("Needs dark mode");
console.log(bug.title); // Prints "Needs dark mode"
console.log(bug.type); // Prints "report"
 
// 데코레이터는 타입스크립트로 정의된 Class의 타입을 바꾸지 않음
// 그래서 데코레이터에서 새로 정의된 프로퍼티인 `reportingURL`는 타입 시스템에서는 알지 못함
bug.reportingURL;
Property 'reportingURL' does not exist on type 'BugReport'.
```
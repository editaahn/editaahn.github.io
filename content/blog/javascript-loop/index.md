---
title: "JavaScript에서 가장 빠른 loop은?"
date: "2022-05-31T00:10:00"
categories: [javascript]
description: "어떤 loop이 퍼포먼스를 해치지 않으면서 니즈를 충족할 수 있을까?"
comments: true
---

- Reference: [https://medium.com/@Bigscal-Technologies/which-type-of-loop-is-fastest-in-javascript-55cc1845f5de](https://medium.com/@Bigscal-Technologies/which-type-of-loop-is-fastest-in-javascript-55cc1845f5de)

어떤 loop이 퍼포먼스를 해치지 않으면서 니즈를 충족할 수 있을까?

modern JS는 값을 반복하는 것에 꽤나 많은 선택지들이 있다. for, for(reverse), for…of , foreach , for…in , and for…await 등 다양한 옵션이 존재한다.

### 뭐가 제일 빠른가?

답: **for (회수 감산 방식 - reverse)** 

- for (reverse) 는 모든 for loop 중에서 가장 빠르다. 100만 개의 값을 가진 배열을 한 번 돌려보라.

```jsx
const million = 1000000;
const arr = Array(million);
console.time(‘⏳’);

for (let i = arr.length; i > 0; i--) {} // for(reverse) :- 1.5ms
for (let i = 0; i < arr.length; i++) {} // for :- 1.6ms
arr.foreach(v => v) // foreach :- 2.1ms
for (const v of arr) {} // for…of :- 11.7ms

console.timeEnd(‘⏳’);
```

- for 회수 *forward*(가산) 방식과 *reverse*(감산) 방식은 소요시간에 큰 차이는 나지 않는다. reverse 방식은 초기 변수 `let i = arr.length` 딱 1회만 연산하기 때문에 0.1ms 차이가 있다. forward 방식에서 가산을 할 때마다 `i < arr.length` 조건을 검증한다. 큰 차이 없으므로 무시해도 된다.
- 반면, *forEach*는 array 프로토타입의 메서드다. 일반적인 for loop과 비교한다면 *forEach*나 *for…of*는 배열을 순회하기에 더 오래 걸린다.

### 각각의 loop을 언제 사용하면 좋을까?

1. For loop (forward & reverse)
    - 특정한 카운트가 필요할 때
    - 전통적으로 for loop은 가장 빠르지만 꼭 이걸 써야하는 것은 아니다. 고려해야할 요소가 성능 만 있는 게 아니기 때문이다. 일반적으로 코드 가독성이 더 중요하므로, application에 더욱 잘 맞는 스타일을 고르면 된다.
2. forEach
    - *forEach*의 callback 함수는 현재 값과 index를 받으며, 함수 안에서 쓰일 this를 optional parameter로 허용
    - 위와 같이, iteration에 대한 값이 필요하거나 this 등을 설정하는 등 제어가 필요할 때
3. For …of
    - 가독성 있는 반복문이 필요할 때
    - array, map, set, string 같은 iterable한 object를 순회할 수 있다.
4. For …in
    - 유저가 property를 직접 정의한 object를 순회할 때
    - 왜 느린가?
        - Object의 모든 property에 숫자 index를 부여하고 그 순서로 순회한다.
        - 이런 이유로 애초에 숫자 index가 key인 array를 도는 게 더 빠르다.

### 결론..

- *for* loop : 가장 빠름. 가독성 낮음.
- *foreach :* 빠름. 반복을 쉽게 제어할 수 있음.
- *for…of* : 오래 걸림. 가독성 좋음.
- *for…in* : 오래 걸림. 간편하지 않음.

가독성을 제일 우선시하되, 성능도 무시하지 말고 application에 맞는 반복문을 선택하자.

### Next step

Array object의 메서드인 reduce, map, filter, some 등의 속도 비교 해보기
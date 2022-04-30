---
title: "브라우저 preload, prefetch"
date: "2022-04-30T23:50:00"
categories: [browser]
description: "link의 rel 속성값인 preload, prefetch에 대해 알아보자."
comments: true
---

브라우저가 내가 원하는 순서로 resource를 가져올 수 있게 하는 방법이 있다. 현재 문서와 외부 리소스와의 관계를 정의하는 link 태그를 사용하는 것이다.

```tsx
<link 
	rel="preload" 
	href="myFont.woff2" 
	as="font" 
	type="font/woff2" 
	crossorigin="anonymous"
>
```

link의 rel 속성값인 `preload`, `prefetch`에 대해 알아보자. (+두 속성값과 함께 쓰이는 `as`)

- `as`
    - preload 또는 prefetch 특성을 지정했을 때만 사용. `<link>` 요소가 불러오는 콘텐츠의 유형을 지정
    - [사용 가능한 값들](https://developer.mozilla.org/ko/docs/Web/HTML/Element/link#attr-as)

## `rel="preload"` vs `rel="prefetch"`

- `preload`: 브라우저가 as 속성 및 우선순위에 따라 **현재 페이지** 탐색에 사용할 대상 리소스를 미리 가져와 캐시
- `prefetch`: 사용자가 현재 페이지 **다음에 이동할 페이지**에서 리소스를 요청할 가능성이 있으므로, 브라우저가 대상 리소스를 미리 가져와 캐시

## Preload

preload를 통해 명시된 리소스가 우선적으로 요청된다. 이 때 진행되는 요청은 document의 onload의 진행을 blocking하지 않는다.

```html
<link rel="preload" href="myFont.woff2" as="font" type="font/woff2" crossorigin="anonymous">
```

## Prefetch

리소스가 추후 필요하게 될 수 있다는 힌트를 브라우저에게 제공한다. 로딩을 해야할지, 또 언제 할지 결정한다.
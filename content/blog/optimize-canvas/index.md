---
title: "Canvas API 최적화하기"
date: "2022-05-09T23:46:00"
categories: [animation]
description: "HTML5의 Canvas API를 잘 쓰는 방법을 찾아보기"
comments: true
---

### 이미지 좌표에 소수점보다는 정수 쓰기

```jsx
ctx.drawImage(myImage, 0.3, 0.5);
```

drawImage를 할 때 소수점을 쓰면 이미지를 부드럽게 보여주기 위해 브라우저가 부가적인 연산을 한다.

이를 피하기 위해 좌표값을 반올림하자.

### 배경 이미지를 넣고 싶을 때는 plain CSS 이용하기

움직이지 않는 background image가 있다면, canvas 밑에 CSS background가 적용된 `<div>` element를 넣는다. 이러면 배경을 canvas에 매번 그릴 필요가 없어진다.

### CSS transforms를 사용해 크기 조정하기

CSS Transforms는 GPU를 사용하기 때문에 빠르다. 사실 canvas를 키우려고 하지 않는 게 가장 좋다.

### 투명도를 적용하지 않기

애플리케이션이 canvas를 사용하고 있고 투명한 배경이 필요하지 않다면, context를 생성할 때 `alpha` 옵션을 `false`로 주도록 한다. 브라우저가 내부적으로 렌더링을 최적화하는 데에 도움을 주는 정보이다.

```jsx
const ctx = canvas.getContext('2d', { alpha: false });
```

### 고해상도 display에 맞게 크기 조정하기

고해상도 display에서 캔버스 내 요소들이 흐릿해질 수 있다. 해결 방법은 많긴 하지만, 쉽게 접근 가능한 방법은 캔버스의 크기를 조정하기 위해 attribute나 styling, context의 scale을 이용하는 것이다.

```jsx
// devicePixelRatio 및 canvas 사이즈를 구한다
var dpr = window.devicePixelRatio;
var rect = canvas.getBoundingClientRect();

// 캔버스를 디바이스의 현재 리얼 사이즈에 맞춘다
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

// 컨텍스트의 크기를 주정한다
ctx.scale(dpr, dpr);

// '그려진' 사이즈를 설정한다
canvas.style.width = rect.width + 'px';
canvas.style.height = rect.height + 'px';
```
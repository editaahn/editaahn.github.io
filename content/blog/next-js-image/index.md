---
title: "Next.js : Image"
date: "2022-03-03T23:49:00"
description: "Next.js에서 제공하는 Image 컴포넌트에 대해서 알아보자."
categories: [nextjs]
comments: true
---

Next.js에서 제공하는 `Image` 컴포넌트에 대해서 알아보자.

아래처럼 일반적인 HTML `img` element를 쓴다면, 직접 다뤄야할 것들이 많다.
- 반응형 구현하기
- third-party 툴이나 라이브러리를 사용하여 최적화하기
- viewport에 나타났을 때만 불러오기

```jsx
<img src="/images/profile.jpg" alt="Your Name" />
```

Next.js는 이런 수고로움을 해결해줄 수 있는 `Image` 컴포넌트를 제공한다.

## 이미지 최적화

next/image는 default로 **이미지 최적화** 기능을 지원한다. 

resizing, 최적화, WebP 지원(가능한 브라우저에서) 등이 있다. 이 기능은 작은 viewport에서 큰 이미지를 가져오는 것을 지양한다. Next.js가 자동으로 최신(=점점 더 많이 쓰게 될) 이미지 포맷들을 채택하고 해당 포맷을 지원하는 브라우저들에게 serve하도록 한다.

최적화는 어떤 이미지에도 작용한다. 이미지가 외부 자원에서 host된 것이더라도 최적화한다.

## Image 컴포넌트

- Build time에 이미지를 최적화하는 대신에, user 요청에 의해서 최적화한다. 일반적인 정적 사이트 생성 툴이나 static-only 솔루션과는 다르게, 이미지 개수를 늘려도 build time에 영향을 주지 않는다.
- 이미지는 default로 lazy load 된다. Page 속도가 viewport 바깥의 이미지 때문에 느려지지 않는다는 것이다. Viewport에 보일 때만 이미지를 로드한다.
- 이미지는 항상 [Cumulative Layout Shift](https://web.dev/cls/)(화면요소 별 노출 시점이 달라서 layout이 흔들리는 것. Google의 [Core Web Vital](https://web.dev/vitals/#core-web-vitals) 평가 기준에 들어감)을 피하도록 렌더링된다.

아래처럼 사용하면 된다.

```jsx
import Image from 'next/image'

const YourComponent = () => (
  <Image
    src="/images/profile.jpg" // Route of the image file
    height={144} // Desired size with correct aspect ratio
    width={144} // Desired size with correct aspect ratio
    alt="Your Name"
  />
)
```


next/Image는 추가적인 attribute 들도 많이 제공한다. ( ex. 로딩 시 blur 처리를 할 수 있음: `placeholder` )
- [More details](https://nextjs.org/docs/api-reference/next/image)
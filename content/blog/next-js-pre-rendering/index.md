---
title: "Next.js : pre-rendering"
date: "2022-03-05T23:50:00"
categories: [nextjs]
comments: true
---
## Pre-rendering

Next.js는 기본적으로 모든 페이지를 미리 렌더(pre-render)한다. Next.js는 각 페이지에 대한 HTML을 미리 만든다는 뜻이다. Client-side에서 자바스크립트가 모든것을 다 하도록 하는 것이 아니다. Pre-rendering 시 성능과 SEO에서 좋은 성과를 얻을 수 있다.

각 생성된 HTML은 페이지에 최소한으로 필요한 JavaScript 코드와 함께한다. 페이지가 browser에 의해 로드 됐을 때, 페이지의 JavaScript 코드가 동작하고 페이지를 상호작용이 가능한 상태로 만든다. (이 과정을 **hydration**이라고 한다.)

### Pre-rendering 작동 확인하기

다음의 스텝을 따라 pre-rendering이 작동하는 것을 확인해보자.

- JavaScript를 browser에서 disable시킨다. [크롬에서 하는 법 참고](https://developer.chrome.com/docs/devtools/javascript/disable/)
- [Next.js 튜토리얼 페이지](https://next-learn-starter.vercel.app/)에 접근해보자.

JavaScript 없이 앱이 잘 렌더링 되는 것을 볼 수 있다. Next.js가 앱을 static HTML로 pre-render하기 때문이다.

순정 React.js app(Next.js 없는)을 만들게 되면 pre-rendering이 없고, JavaScript를 disable 시키면 앱을 사용할 수 없다.

- [Create React App](https://create-react-template.vercel.app/)으로 만든 순정 React.js 앱 페이지를 보자.
- JavaScript를 disable한 후 다시 접근한다.

### Pre-rendering 작동 vs 비작동

가볍게 비교해보자.

- Pre-rendering 작동 시 (Next.js)
    1. 페이지 초기 로드 시점에 pre-render된 HTML이 보여짐
    2. JS 로드 후 hydration
- Pre-rendering 비작동 시 (순수 React.js)
    1. 페이지 초기 로드 시점에 App이 렌더되지 않음
    2. JS 로드 후 최초 렌더 및 hydration
    

## 두 가지 Pre-rendering 방식

Next.js가 pre-rendering을 하는 방식은 두 가지이다. **정적 생성**과 **서버사이드 렌더링**이다. 둘은 페이지에 대한 **HTML을 언제 생성하느냐**에 차이점이 있다.

- 정적 생성: 빌드할 때 HTML 생성
- 서버사이드 렌더링: 사용자에 의한 요청을 받았을 때 HTML 생성

중요한 것은, Next.js가 각 페이지마다 pre-rendering 방식을 당신이 직접 선택할 수 있도록 한다는 것이다. 대부분의 페이지에서 정적 생성 방식을 사용하고 나머지에서 서버사이드 렌더링 방식을 사용하도록 hybrid하게 앱을 만들 수 있다.
### 어느 상황에 각 방식을 써야할까?

가능하다면 정적 생성 방식이 권장된다. 페이지는 한 번 빌드되고 CDN에 의해 제공될 수 있는데, 요청에 따라 서버가 페이지를 렌더하는 것보다 훨씬 빠르기 때문이다.

아래처럼, 다양한 유형의 페이지를 정적 생성할 수 있다.

- 마케팅 페이지
- 블로그 포스팅
- E-commerce 상품 목록
- 도움말 및 문서

"이 페이지를 사용자가 요청하기 전에 pre-render할 수 있는가?" 직접 자문을 해봐야 한다. yes라고 답할 수 있다면 정적 생성을 선택해야 한다.

다르게 보면, 사용자 요청 전에 페이지를 pre-render할 수 없다면 정적 생성은 좋지 않다. 페이지가 자주 업데이트되는 데이터를 보여준다면, 페이지 컨텐츠는 매번 요청에 따라 바뀌어야 한다.

이런 케이스에서는 서버사이드 렌더링을 사용할 수 있다. 느려질 순 있지만 pre-render된 페이지가 항상 최신을 유지할 것이다. 아니면, pre-rendering을 건너 뛰고 client-side JavaScript를 이용해 자주 바뀌는 데이터를 덧붙일 수 있다.
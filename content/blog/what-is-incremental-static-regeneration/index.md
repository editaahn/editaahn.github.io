---
title: "[Next.js] What is Incremental Static Regeneration(ISR)"
date: "2023-05-02T17:52:00"
description: "Next.js의 Incremental Static Regeneration의 등장 배경, 성능상 이점, 사용법에 대해서 알아보았다."
categories: [nextjs]
comments: true
---

Next.js 프레임워크 사용 시 Static Site Generation(SSG)과 Server-Side Rendering(SSR)이 주된 서빙 방식으로 사용되고 있는데, 추후 릴리즈된 Incremental Static Regeneration(ISR)은 이 둘을 융합시킨 방식이다.

## Background

### Static Site Generation vs. Server-Side Rendering

이 두 방식의 차이는 **HTML를 생성하는 시점**이다.

`SSG`를 사용하면 HTML은 **빌드타임**에 생성된다. 캐시하기 쉽고, 빠르게 전달이 가능하다. Static(정적)이라는 단어는 HTML이 정적이라는 사실에 입각해서 온 것이긴 하지만, 페이지 자체가 단순히 정적이라서 이름에 들어간 건 아니다. 우리가 자주 볼 수 있는 일반적인 페이지들과 같이, 데이터를 fetch하고 클라이언트 사이드에서 Javascript를 통해 인터랙션을 제공한다. HTML을 미리 만든다는 데에서 static이라는 용어가 쓰인 것으로 이해하면 될 것 같다. 

Next.js 팀은 가능하면 SSG를 적용하도록 권장하고 있다. 블로그, 포트폴리오 사이트, 공식문서 등에 사용하기 좋다.

`SSR`은 **매 요청마다** 동ㅓ으 HTML을 생성한다. SSG보다는 훨씬 flexible한 방식이다. 매 요청 시에 새롭게 fetch한 데이터로 HTML을 만들어서 주기 때문에, 애플리케이션을 빌드해서 HTML 파일을 바꾸지 않아도 된다.

계속 업데이트되는 데이터가 있으면 SSG는 좋은 선택이 아니다. 피드가 계속 변하는 Twitter 홈 페이지인데 빌드 시에만 HTML을 만든다고 가정해보면 느낌이 올 것이다.

---

## Detail of ISR

ISR은 **미리 만들어둔 페이지 캐시를 런타임에 지속적으로 업데이트**하는 방식으로, 위 방식들의 이점을 충족시킨다.

### ISR은 어떻게 진행될까?

ISR의 서빙 과정은 아래와 같다.

1. ISR을 적용한 페이지에 첫 유저의 요청이 발생한다.
2. 저장되어있는 페이지 캐시가 없다면, 페이지가 최초 생성된다. 
    - 이 과정에 fallback 페이지(ex.스켈레톤)를 보여줄 수 있다.
3. 최초 생성된 페이지는 캐시된다.
4. 이 캐시가 유지되는 시간 동안, 두번째 유저 요청부터는 캐시된 버전을 즉시 받아볼 수 있다. 
5. 기존 캐시의 유효기간이 만료되면 Next.js는 백그라운드에서 페이지 재생성을 진행한다. 재생성이 끝나기 전까지 기존 캐시를 사용한다.
6. 새 페이지가 생성되면 기존 캐시를 무효화한 후 새 페이지를 보여준다.

### 캐시는 어디에 저장될까?

Next.js는 파일 시스템 캐시에 HTML 결과물을 저장한다. ; 프로젝트 루트 디렉터리의 **`.next/cache/`**

- 어플리케이션이 ISR을 사용하지 않으면 이 캐시 디렉터리는 생성되지 않는다. (SSG 페이지 HTML 아웃풋은 별도의 디렉터리에 저장됨)
- 빌드 과정에서도 캐시가 생성되며, 이 캐시는 런타임에도 사용될 수 있다.

### 기대 효과

SSG에서 얻을 수 있는 퍼포먼스나 pre-render의 이점을 누리면서, 거의 실시간에 가까운 컨텐츠 업데이트를 실현할 수 있다.
<br>
→ SSR 페이지를 ISR로 진화시키면 서버에서의 작업이 줄어들기 때문에 Blocking time(TTFB) 개선에 효과가 있다. 유저에게 빠른 사용경험을 제공할 수 있고, Lighthouse 등 성능 측정 시 좋은 점수를 얻을 수 있어 SEO도 긍정적이다.

### stale-while-revalidation(SWR)

ISR이 사용하는 캐싱 전략은 `stale-while-revalidate` 으로도 알려져 있는데, ISR이 처음 사용한 것이 아니지만 쉽게 적용할 수 있도록 한 것이다. 이 전략은 퍼포먼스를 다룬다면 알아야할 내용이라 간단히 더 설명하겠다.

캐시된 컨텐츠(stale)를 즉시 로드해 보여주고, 백그라운드에서 최신화(revalidate)한 뒤 다음 요청에 사용하는 전략이다.

브라우저 캐시에 도입해서 주로 쓰인다. 아래처럼 컨텐츠 response의 `Cache-Control` 헤더 내에서 설정할 수 있다. max-age 종료(2s) 후 revalidation(58s)을 설정할 수 있다.

```
Cache-Control: max-age=2, stale-while-revalidate=58
```

만약 max-age=60 만 사용하게 된다면, 캐시가 유지되는 기간(age) 내에 재요청 시 네트워크 요청을 보내지 않는다. 그러나 위 예시처럼 쓰는 경우, max-age 적용 기간이 끝나고 stale-while-revalidate 기간 내에는 백그라운드에서 네트워크 요청을 보내 데이터를 최신화시켜두고 60초가 끝나면 이를 가지고 캐시를 생성한다.

ISR라는 용어의 구성을 보면, 점진적인(Incremental) 정적(Static) 재생성(Regeneration)이다. 이 전략에 단어들을 대입해서 이해해 보면…

- 정적인 = HTML을 캐시해서 먼저 보여줌
- 점진적인 재생성 = 캐싱된 리소스를 보여주는 사이 revalidation을 요청해 재생성

---

## 적용 방법

### ISR 적용

ISR은 아주 쉽게 적용할 수 있다. 

SSG의 경우 페이지에서 `getStaticProps` 함수를 export하면서 실행이 되는데,

```tsx
// SSG
export async function getStaticProps() {
  const res = await fetch('https://...');
  const data = await res.json();

  return { props: { data } };
}
```

ISR도 동일하게 `getStaticProps`를 쓰고, property를 반환해줄 때 revalidate 값을 추가하면 된다.

```tsx
// ISR
export async function getStaticProps() {
  const res = await fetch('https://...');
  const data = await res.json();

  return { props: { data }, revalidate: 60 };
}
```

위 코드 예시에 따르면 Next.js 서버에서는 60초마다 revalidate를 한다.
<br>
이 값은 캐시의 Time-To-Live(캐시 유지기간)처럼 동작하는데, 다만 60초가 지나서 stale이 된 후에도 바로 없어지지 않고, 다음 버전 페이지가 재생성되는 기간 동안 사용된다.

Fallback 페이지를 적용하려면, Next.js 라우터에서 제공하는 useRouter 훅에서 제공하는 fallback 모드 상태를 사용하면 된다.

```tsx
import { useRouter } from 'next/router';

export default function Page(props) {
    const { isFallback } = useRouter();

    if (isFallback) {
        return <></>;
    }

    return <div>
        <h1>{props.name}</h1>
        <Content1 />
				<Content2 />
    </div>;
}
```

### On-demand ISR 적용

On-demand ISR 기능도 Next.js v12부터 도입되었다. 정해둔 revalidation 시간이 남았어도, 필요한 경우에 매뉴얼하게 트리거할 수 있다. (ex. E-commerce 어드민에서 정보를 바꾼 경우, 다음 revalidation을 기다릴 필요 없이 바로 업데이트된 페이지를 보여주고 싶을 때)

적용하려면 먼저 secret token 하나를 환경 변수(process.env)에 추가한다. 아래처럼 revalidation을 요청하는 API 루트를 페이지로 추가한다.

```
https://<your-site.com>/api/revalidate?secret=<token>
```

```tsx
// pages/api/revalidate.js

export default async function handler(req, res) {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    await res.revalidate('/path-to-revalidate');
    return res.json({ revalidated: true });
  } catch (err) {
    // 여기서 에러가 난 경우 가장 마지막으로 정상 생성한 페이지를 보여줄 것임
    return res.status(500).send('Error revalidating');
  }
};
```

---

## Ref.

[[LogRocket] ISR with Next.js](https://blog.logrocket.com/incremental-static-regeneration-next-js/)

[[공식 문서] Incremental Static Generation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)

[[Web.dev] Keeping things fresh with stale-with-validate](https://web.dev/stale-while-revalidate/)

캐시 저장 위치에 대한 디테일은 ChatGPT의 도움을 받음
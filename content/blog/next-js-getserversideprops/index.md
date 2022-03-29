---
title: "Next.js : getServerSideProps"
date: "2022-03-29T23:50:00"
categories: [nextjs]
comments: true
---

페이지에서 getServerSideProps 함수를 export하면, 요청이 올 때마다 해당 함수에서 반환하는 데이터를 이용해 이 페이지를 pre-render한다.

```jsx
export async function getServerSideProps(context) {
  return {
    props: {}, // 페이지 컴포넌트에 props로 전달
  }
}
```

## 언제 실행될까?

server-side에서만 실행되며 browser에서는 절대 실행되지 않는다. getServerSideProps를 사용하는 페이지가 있다면,

- 페이지를 직접 호출할 때, getServerSideProps는 request를 받는 시점에 실행되고 페이지는 반환된 props와 함께 pre-rendered된다.
- next/link, next/router 등 client-side 페이지 전환으로 해당 페이지를 요청 시, Next.js는 API 요청을 서버에 보내고, 서버는 getServerSideProps를 실행한다.

JSON이 반환되고, 페이지를 렌더링할 때 사용된다. 모든 작업이 Next.js에서 자동으로 이뤄지며 getServerSideProps 함수를 정의하는 것 외에는 개발자가 할 일은 없다.

getServerSideProps는 페이지 파일에서만 export되어야 한다.

또한, 독립적인 함수로 export되어야 한다. 페이지 컴포넌트의 property로써 추가하는 것이 아니다.

## 언제 써야할까?

반드시 리퀘스트 타임에 data를 가져와야하는 페이지를 pre-render하는 경우에만 사용해야 한다. Time to First Byte(TTFB)이 getStaticProps보다 느리기 때문이다. 서버는 매 요청마다 result를 연산해야만 하고, result는 CDN에 cache-control 헤더를 통해 (추가적인 설정이 필요) 캐싱된다.

data를 pre-render할 필요는 없다면 [client-side](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#fetching-data-on-the-client-side)에서 data를 fetching해야 한다.

## ****getServerSideProps or API Routes****

getServerSideProps에서 API 라우트(ex. `/api/*`)를 호출하고 싶을 수 있다. 그러나 이는 불필요하고 비효율적인 접근이다. getServerSideProps와 API Routes가 둘 다 서버에서 실행되면 중복으로 요청이 생성된다.

CMS에서 데이터를 요청할 때 API 라우트를 사용한다고 가정하자. getServerSideProps에서 바로 호출된다. 이는 추가적인 호출을 발생시키고 성능을 떨어뜨린다.

대신에, logic을 바로 import하자. CMS, database, 및 다른 API들을 직접 getServerSideProps 내에서 호출한다는 의미이다.

## Client-side의 데이터를 가져오기

데이터가 자주 업데이트되는 페이지에서는 pre-render를 할 필요가 없다. client side에서 fetch하면 된다. 각 유저 별 데이터를 예시로 보자.

- 첫 째로, 데이터 없이 페이지를 바로 보여준다. 페이지의 일부는 Static Generation을 통해 pre-render된다. 일부 데이터가 도착하지 않았다면 loading 상태를 보여줄 수 있다.
- 그 다음, client side에서 fetch하고 데이터가 준비되면 노출한다.

이런 접근은 사용자 대시보드 페이지 등에 잘 맞는다. 대시보드는 private하고 유저 별 화면이 다르기 때문에 SEO와 관계가 없고 pre-render될 필요가 없다. 데이터가 자주 업데이트되면 request에 따른 data fetching이 필요하다.

## Request time에 getServerSideProps를 이용해 data 불러오기

```jsx
function Page({ data }) {
  // 데이터 렌더링
}

// 요청 시마다 함수 호출
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // props를 통해 page에 데이터를 전달
  return { props: { data } }
}

export default Page
```
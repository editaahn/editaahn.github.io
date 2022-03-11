---
title: "Next.js : getStaticProps"
date: "2022-03-10T23:45:00"
categories: [nextjs]
comments: true
---

`getStaticProps`(Static Site Generation)라는 이름의 함수를 페이지에서 export하면, Next.js는 빌드타임에 `getStaticProps`에서 반환하는 props를 사용해 이 페이지를 pre-render한다.

```jsx
export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```

## 언제 써야할까?

- 페이지를 렌더하는 데에 필요한 data가 사용자 request 이전 빌드 타임 시에 준비되어 있는 경우
- headless CMS로부터 데이터를 받는 경우
- 데이터가 각 user별이 아니라 전체에 대해 캐싱될 수 있는 경우
- 페이지가 SEO를 위해 pre-rendered되어야 하거나 엄청 빨라야 하는 경우
    - `getStaticProps`는 성능 향상을 위해 HTML과 JSON file을 생성해서 CDN에 캐싱

## 언제 실행될까?

`getStaticProps`는 서버에서만 실행된다. 절대 클라이언트에서는 실행되지 않는다. 

- 항상 ‘next build’ 처리 중에만 실행
- `revalidate`를 사용하면 백그라운드에서 실행
- `unstable_revalidate`를 사용하면 요청에 의해 백그라운드에서 실행

[Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)와 함께 사용하면, 오래된 페이지가 다시 유효성 검증을 하고 있는 동안 `getStaticProps`가 백그라운드에서 실행되고, 새로운 페이지가 브라우저에 제공된다.

`getStaticProps`는 나중에 들어올 request에 관련한 것은 알지 못한다.(query parameters나 HTTP headers 같은..) Static HTML을 생성하는 함수이기 때문이다. request 정보에 대해 알아야 한다면 [미들웨어](https://nextjs.org/docs/middleware)를 추가해 사용해보자.

## CMS로부터 data를 fetching할 때

```jsx
// getStaticProps()에 의해, 빌드타임에 post들이 생성된다.
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// 이 함수는 server-side 빌드타임에 호출된다.
// client-side에서는 호출되지 않을 것이고
// 데이터베이스 쿼리를 바로 사용할 수도 있다.
export async function getStaticProps() {
  // 외부 API 엔드포인트를 호출해서 posts를 가져오자.
  // data fetching library 아무거나 쓰면 된다.
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // { props: { posts } }를 반환하면서, 
  // Blog 컴포넌트는 `posts`라는 prop을 빌드타임에 받게 된다.
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```

- 사용 가능한 paremeter와 props 전체 보기: [getStaticProps API reference](https://nextjs.org/docs/api-reference/data-fetching/get-static-props)

## server-side 코드 직접 쓰기

`getStaticProps`가 server-side에서만 실행되므로, 브라우저에 사용될 JS bundle은 포함하지 않는다. 브라우저를 거치지 않고 데이터베이스에 쿼리를 바로 보낼 수 있다. server-side 코드를 `getStaticProps`에서 바로 쓸 수 있다는 의미이다.

예를 들어보자. 어떤 API route가 CMS에서 데이터를 가져오는 데에 사용된다. `getStaticProps`에서 이 API route를 직접 호출한다. 추가적인 호출로 인해 성능을 저하시킨다. 

이렇게 하는 대신에, `lib/` 디렉터리를 사용하여 CMS에서 데이터를 가져오는 로직을 `getStaticProps`와 공유할 수 있다.

```jsx
// lib/fetch-posts.js

// 다음 함수는 `lib/` 디렉터리로부터
// getStaticProps 및 API route에 공유된다.
export async function loadPosts() {
  // 외부 API 엔드포인트를 호출해서 posts를 가져오자.
  const res = await fetch('https://.../posts/')
  const data = await res.json()

  return data
}
```

```jsx
// pages/blog.js
import { loadPosts } from '../lib/load-posts'

// Server-side에서만 실행
export async function getStaticProps() {
  // `/api` route를 호출하지 않고 같은 함수를 바로 쓸 수 있다.
  const posts = await loadPosts()

  // page component에 props 전달
  return { props: { posts } }
}
```

### HTML과 JSON 정적 생성

빌드타임에 `getStaticProps`를 통해 페이지가 pre-rendered되었을 때, Next.js는 HTML 뿐 아니라 JSON file을 생성한다. 이 JSON은 `getStaticProps`를 실행한 result 데이터를 가지고 있다.

이 JSON file은 [next/link](https://nextjs.org/docs/api-reference/next/link) 또는 [next/router](https://nextjs.org/docs/api-reference/next/router)를 통해 client-side routing에 이용이 된다. `getStaticProps`를 사용하여 pre-rendered된 페이지로 이동하면, Next.js는 이 JSON file을 가져와 page component의 props로 사용한다. 즉, 클라이언트에서 페이지 전환 시에는, export된 JSON만 사용되므로 getStaticProps를 호출하지 않는다.
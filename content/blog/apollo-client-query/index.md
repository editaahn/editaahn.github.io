---
title: "(번역) Apollo Client 2. 쿼리"
date: "2022-02-15T23:47:00"
description: "Apollo Client 공식문서 - Query"
categories: [code]
comments: true
---

## Query 실행하기

useQuery React hook은 Apollo 어플리케이션에서 쿼리를 실행하는 기본 API이다. 리액트 컴포넌트 안에서 쿼리를 실행하려면 useQuery를 호출하고 GraphQL query 스트링을 전달해야한다. 컴포넌트가 렌더링 될 때, useQuery는 Apollo Client로부터 object 하나를 반환한다. 이 object는 UI 렌더링에 사용할 수 있는 `loading`, `error`, `data` 프로퍼티를 포함한다.

예시를 보자. 일단 `GET_DOGS`라는 이름의 GraphQL 쿼리를 만들자. 쿼리 스트링을 `gql` function으로 감싸서 query document 형태로 parse하는 것을 잊지 말자.

```tsx
import { gql, useQuery } from '@apollo/client';

const GET_DOGS = gql`
  query GetDogs {
    dogs {
      id
      breed
    }
  }
`;
```

다음은, Dogs라는 이름의 컴포넌트를 만들 것이다. 이 컴포넌트 안에서, `useQuery` 훅에 `GET_DOGS` 쿼리를 전달하자.

```tsx
function Dogs({ onDogSelected }) {
  const { loading, error, data } = useQuery(GET_DOGS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <select name="dog" onChange={onDogSelected}>
      {data.dogs.map(dog => (
        <option key={dog.id} value={dog.breed}>
          {dog.breed}
        </option>
      ))}
    </select>
  );
}
```

쿼리가 실행되고 loading, error, data 값이 바뀌면 Dogs 컴포넌트는 쿼리 상태에 따라 UI 엘리먼트를 다르게 렌더한다.

- `loading`이 `true`일 때, 컴포넌트는 Loading... 안내를 띄운다.
- `loading`이 `false`이고 `error`가 없을 때 쿼리는 완료된다. 컴포넌트는 서버에서 dog breeds 목록을 받아 드롭다운을 채운다.

유저가 드롭다운에서 선택한 값은 `onDogSelected`를 통해 부모 컴포넌트로 보내진다.

다음 단계에서 GrahpQL variables를 이용하는 더 정교한 쿼리를 사용해 드롭다운 기능을 다뤄보자.

## 쿼리 결과 캐싱하기

Apollo Client는 쿼리 결과를 서버에서 받아올 때마다 로컬에 결과를 자동으로 캐시한다. 이로 인해, 이후에 같은 쿼리가 실행될 때 매우 빨라지게 된다.

캐싱을 직접 보려면 `DogPhoto`라는 새로운 컴포넌트를 만들어보자. 

```tsx
const GET_DOG_PHOTO = gql`
  query Dog($breed: String!) {
    dog(breed: $breed) {
      id
      displayImage
    }
  }
`;

function DogPhoto({ breed }) {
  const { loading, error, data } = useQuery(GET_DOG_PHOTO, {
    variables: { breed },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
  );
}
```

useQuery에서 설정 옵션(`variables`)을 제공을 하는 점에 주목하자. 이 옵션에 우리가 GraphQL 쿼리에 전달하고자하는 모든 변수를 넣는다. 위 같은 경우, 최근 드롭다운으로 선택된 breed를 전달하고자 한다.

`bulldog`을 드롭다운에서 선택하여 사진을 띄운다. 다른 종(breed)로 바꾼 다음 다시 `bulldog`으로 바꿔보자. bulldog의 사진이 바로 로드되는 것을 볼 수 있을 것이다. Apollo cache가 만들어낸 결과이다!

다음은 캐시된 데이터를 최신으로 유지하는 테크닉에 대해 알아보자.

## 캐시된 쿼리 결과를 업데이트하기

때때로, 쿼리에 캐시된 데이터가 서버의 최신 값인지 확인하고자 할 때가 있다. Apollo Client는 두가지의 전략을 지원한다. **Polling** 그리고 **refetching**이다.

### Polling

폴링은 주기적으로 쿼리를 실행하여 서버와 거의 real time으로 동기화하는 방식이다. 쿼리에 폴링을 세팅하려면 `pollInterval` 설정 옵션에 millisecond 단위로 `useQuery` 훅에 넣어준다.

```tsx
function DogPhoto({ breed }) {
  const { loading, error, data } = useQuery(GET_DOG_PHOTO, {
    variables: { breed },
    pollInterval: 500,
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
  );
}
```

`pollInterval` 을 500으로 설정하면 서버에서 0.5초 간격으로 최신 이미지를 받아올 수 있는 것이다. 0으로 설정하면 쿼리는 폴링을 하지 않는다.

> `startPolling`, `stopPolling` 함수를 `useQuery` 훅에서 반환 받아, 동적으로 polling을 시작하거나 멈출 수 있다.
> 

### Refetching

Refetching은 사용자의 특정 액션에 반응해 쿼리 결과를 refresh 할 수 있도록 해준다. 주기적인 간격마다 refresh 시키는 방식과 반대된다.

`DogPhoto` 컴포넌트에 버튼 하나를 추가하여, 클릭 시 쿼리의 `refetch` 함수를 호출해보자.

선택적으로 새로운 `variables` object를 `refech` 함수에 제공할 수도 있다. 원치 않는다면, 기존 실행에 쓰인 variables를 그대로 사용한다.

```jsx
function DogPhoto({ breed }) {

  const { loading, error, data, refetch } = useQuery(GET_DOG_PHOTO, {
    variables: { breed }
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <div>
      <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
      <button onClick={() => refetch()}>Refetch!</button>
    </div>
  );
}
```

버튼을 클릭 후 새로운 dog 사진으로 UI가 업데이트되는지 확인해보자. Refetching은 데이터가 최신임을 보장하는 탁월한 방법이다. 그러나 loading state를 도입할 때 조금 까다롭다. 다음 주제에서 loading, error state를 다루는 전략을 알아볼 것이다.

`refetch`를 새로운 변수와 함께 호출해보자.

```jsx
<button onClick={() => refetch({
  breed: 'dalmatian' // 기존 요청한 종이 아닌 dalmatian으로 계속 refetch된다
})}>
	Refetch!
</button>
```

모든 변수가 아니라 일부만 새로운 값으로 넣어주면, `refetch`는 생략된 변수에 대해서는 기존에 썼던 값을 사용한다.

## loading 상태 점검

`useQuery` 훅이 쿼리의 최신 loading state를 나타내는 것은 알고 있을 것이다. 쿼리 첫 로드 시에는 잘 쓰이지만, refetching이나 polling을 할 땐 loading state에 무슨 일이 일어날까?

위에서 본 refetching 예시로 돌아가 보자. refetch 버튼을 클릭했을 때, 새 데이터가 도착하기 전까지 컴포넌트는 re-render되지 않는다. 우리가 이미지를 refetching 하는 중이란 걸 사용자에게 알리고 싶다면 어떻게 할까?

`useQuery` 결과 object는 `networkStatus` 프로퍼티 내에 쿼리의 상태와 관련한 세부 정보를 제공한다. 이 정보를 얻으려면 `notifyOnNetworkStatusChange` 라는 옵션을 `true`로 세팅한다. 이에 따라서 refetch가 진행되고 있을 때 컴포넌트를 re-render하게 된다.

```jsx
import { NetworkStatus } from '@apollo/client';

function DogPhoto({ breed }) {
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_DOG_PHOTO,
    {
      variables: { breed },
      notifyOnNetworkStatusChange: true,
    },
  );

  if (networkStatus === NetworkStatus.refetch) return 'Refetching!';
  if (loading) return null;
  if (error) return `Error! ${error}`;

  return (
    <div>
      <img src={data.dog.displayImage} style={{ height: 100, width: 100 }} />
      <button onClick={() => refetch()}>Refetch!</button>
    </div>
  );
}
```

이 옵션을 설정하면, `networkStatus`로 제공 받는 세부 정보를 쓰지 않더라도, `loading` 값까지 업데이트 시켜준다.

`networkStatus` 프로퍼티는 `NetworkStatus` enum으로 로딩 상태를 나타낸다. 
Refetch는 `NetworkStatus.refetch`로 나타내고, polling 및 pagination을 나타내는 값들도 있다. 얻을 수 있는 loading 상태 리스트를 전부 보려면 이 [소스](https://github.com/apollographql/apollo-client/blob/main/src/core/networkStatus.ts)를 참고하면 된다.

### Error 상태 점검

`useQuery` 훅에 `errorPolicy`라는 설정 옵션을 추가하면 쿼리의 에러 핸들링을 직접 다룰 수 있다. 기본 값은 `none`이고, Apollo Client는 모든 GraphQL 런타임 에러를 다루게 된다. 이 케이스에서는 Apollo Client가 서버에서 오는 모든 쿼리 결과를 버리고 `useQuery` 결과 object 안에 `error` 프로퍼티를 설정한다.

`errorPolicy`를 `all`로 세팅하면 `useQuery`는 쿼리 결과를 버리지 않고, 결과의 일부를 렌더링하게 해준다.

[오퍼레이션 에러 다루기](https://www.apollographql.com/docs/react/data/error-handling/) 에서 더 자세히 볼 수 있다.

- 위 글에서 errorPolicy 부분을 조금 자세히 보면
    - none: `error.graphQLErrors`에 리턴. response의 `data`는 서버가 값을 반환하더라도 `undefined`로 반환된다. 네트워크 에러와 GraphQL 에러는 비슷한 응답 형태를 가진다는 것을 볼 수 있다.
    - ignore: `graphQLErrors`들이 무시되며 `error.graphQLErrors`는 생성되지 않는다. 반환된 `data`는 캐싱되고, 에러가 없는 것처럼 렌더된다.
    - all: data와 `error.graphQLErrors` 모두 생성되며, 일부 결과와 error 정보를 모두 렌더할 수 있도록 해준다.

## useLazyQuery - 선택적 실행

useQuery를 호출하는 컴포넌트를 리액트가 렌더할 때, Apollo Client는 자동으로 쿼리를 실행한다. 그러나 유저가 버튼을 클릭하는 것처럼, 각기 다른 이벤트에 반응하여 쿼리를 실행하고 싶다면 어떻게 할까?

useLazyQuery 훅이 완벽한 답이다. useQuery와는 다르게, useLazyQuery를 호출할 때 쿼리를 바로 실행하지 않는다. 그 대신, 쿼리를 실행할 준비가 되었을 때 호출 가능한 쿼리 함수를 result 튜플 안에 반환한다.

```jsx
import React from 'react';

import { useLazyQuery } from '@apollo/client';

function DelayedQuery() {

  const [getDog, { loading, error, data }] = useLazyQuery(GET_DOG_PHOTO);

  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error}`;

  return (
    <div>
      {data?.dog && <img src={data.dog.displayImage} />}

      <button onClick={() => getDog({ variables: { breed: 'bulldog' } })}>
        Click me!
      </button>
    </div>
  );
}
```

`useLazyQuery`에 반환된 tuple의 첫 아이템이 쿼리 함수이다. 두 번째 아이템은 `useQuery`에서 반환하는 object와 같다.

위에서 본 것 처럼, option들을 `useLazyQuery` 자체에 줄 수 있는 것처럼 쿼리 함수에도 넣을 수 있다. 특정 옵션을 두 군데에 다 넣었을 경우, 쿼리 함수에 넣은 값이 더 우선된다. default 옵션들은 `useLazyQuery`에 넣고, 쿼리 함수에서 그 옵션들을 커스텀하는 방법도 편리하게 사용할 수 있다.

지원하는 옵션 전체 목록을 보려면 [API reference](https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery)를 확인하자.

## Fetch Policy 세팅하기

`useQuery` 훅은 요청된 모든 데이터가 로컬에서 사용 가능한 상태인지 보기 위해 Apollo Client 캐시를 확인한다. 모든 데이터가 사용 가능한 상태이면, `useQuery`는 해당 데이터를 반환하고 GraphQL server에 쿼리를 요청하지 않는다. `cache-first` policy는 Apollo Client의 기본 **fetch policy**이다.

주어진 쿼리에 대해 각각 다른 fetch policy를 적용할 수 있다. 그러려면, `fetchPolicy` option을 useQuery 호출 시 넣어야 한다.

```jsx
const { loading, error, data } = useQuery(GET_DOGS, {

  fetchPolicy: "network-only" 
	// network 요청 생성 전에 캐시를 체크하지 않는다.
});
```

### `nextFetchPolicy`

쿼리의 다음 fetch policy(`nextFetchPolicy`)도 특정할 수 있다. fetchPolicy는 쿼리의 첫 실행에 사용되고, nextFetchPolicy는 쿼리가 그 이후 캐시 업데이트에 어떻게 반응할지 결정하는 데에 사용한다.

```jsx
const { loading, error, data } = useQuery(GET_DOGS, {
  fetchPolicy: "network-only",   // 첫 실행 시 사용
  nextFetchPolicy: "cache-first" // 이후 실행 시 사용
});
```

예를 들면, 쿼리가 항상 처음에 네트워크 요청을 보내지만 그 이후에 캐시를 쉽게 읽을 수 있도록 하려면 이 방법이 유용하다.

### 지원되는 fetch policy

- cache-first
- cache-only
- cache-and-network
- network-only
- no-cache
- standby

---
title: "(번역) 아폴로 클라이언트를 쓰는 이유"
date: "2022-02-10T23:44:00"
description: "공식문서를 번역합니다."
categories: [code]
comments: true
---


[https://www.apollographql.com/docs/react/why-apollo/](https://www.apollographql.com/docs/react/why-apollo/)

## 왜 Apollo Client를 쓸까?

데이터 관리는 어려우면 안된다. 원격 및 로컬 데이터를 리액트 애플리케이션에서 쉽게 관리하는 방법을 궁금해하고 있다면, 잘 찾아오셨다. 이 문서를 통해 아폴로의 똑똑한 캐싱 방법을 배울 수 있고, 데이터 fetching에 대한 명확한 접근으로 당신이 코드를 더 적게 쓰고 성능을 개선하도록 도울 것이다.

### 명확한 data fetching

데이터 가져오기, 로딩 및 에러 상태 추적, UI 업데이트 등의 모든 로직은 useQuery Hook에 캡슐화된다. 이러한 캡슐화는 쿼리 결과를 아주 쉽게 컴포넌트에 주입한다. Apollo Client & React 용례를 보자.

```jsx
function Feed() {
  const { loading, error, data } = useQuery(GET_DOGS);
  if (error) return <Error />;
  if (loading) return <Fetching />;

  return <DogList dogs={data.dogs} />;
}
```

`useQuery` 훅을 사용해 dog 데이터를 GraphQL server에서 받아와서 리스트로 보여주고 있다. useQuery는 React's [Hooks API](https://reactjs.org/docs/hooks-intro.html)를 사용하여 쿼리와 컴포넌트를 연결하고, 쿼리 결과에 따라 렌더되도록 한다. 데이터가 전달되면, `<DogList />` 컴포넌트는 필요한 데이터에 따라 업데이트된다.

Apollo Client는 request의 사이클과 로딩 및 에러 상태를 관리한다. 미들웨어나 보일러플레이트를 준비할 필요가 없다. 데이터 변경이나 캐싱에 대해서도 걱정할 필요 없다. 사용자는 그저 컴포넌트에 필요한 데이터를 잘 구체화하기만 하면 된다. 어려운 일은 Apollo Client가 한다.

Apollo Client로 갈아타는 순간, data managing에 대한 불필요한 코드들을 지워도 된다. 애플리케이션에 따라 그런 코드의 양은 달라지겠지만 어떤 팀은 몇 천 줄의 코드를 지웠다고 한다. Apollo와 함께하는 동안은, feature를 만들 때 타협하지 않아도 된다. Optimistic UI, refetching, pagination 같은 고급 기능들을 전부 쉽게 사용할 수 있다. 

### 설정이 필요 없는 Caching

Apollo Client의 독보적인 feature는 정규화된 Cache이다. Apollo Client는 틀을 벗어난, 똑똑한 캐싱 방법을 지원한다. 아주 적은 설정으로 시작할 수 있다.

```jsx
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache()
});
```

그래프를 캐싱하는 것은 쉬운 일은 아니다. 하지만 우리는 이를 해내기 위해 2년이라는 시간을 썼다. 같은 데이터를 다양한 곳에서 요청할 수 있기 때문에, 정규화는 여러 컴포넌트에서 사용되는 data의 일관성을 지키는 데에 기본적인 요소이다. 예시를 보자.

```jsx
const GET_ALL_DOGS = gql`
  query GetAllDogs {
    dogs {
      id
      breed
      displayImage
    }
  }
`;

const UPDATE_DISPLAY_IMAGE = gql`
  mutation UpdateDisplayImage($id: String!, $displayImage: String!) {
    updateDisplayImage(id: $id, displayImage: $displayImage) {
      id
      displayImage
    }
  }
`;
```

`GET_ALL_DOGS` query는 dogs list와 내부에 있는 displayImage을 불러온다. `UPDATE_DISPLAY_IMAGE` 라는 mutation은 dog 하나의 displayImage를 업데이트한다. dog 하나를 바꾼 데이터를 반영한 전체 dogs의 목록이 필요하다. Apollo Client는 각 GraphQL 결과의 object들을 `__typename`과 `id` property를 이용해 고유한 entry로 만들어 캐시에 저장한다. `id`를 동반한 mutation으로부터 반환된 값은, 같은 `id`가 포함된 object를 fetch하는 다른 query들을 확실하게 자동 업데이트한다. 또한, 같은 data를 반환하는 여러 query들은 항상 sync되어 있다.

실행이 복잡한 feature들은 아폴로 캐시로 구축하면 간단하다. `GET_ALL_DOGS` query 예시를 다시 보자. 특정 dog를 위한 상세 페이지로 이동 시키고 싶다면 어떻게 할 것인가? 각 dog 정보를 이미 불러왔기에, 서버에서 같은 정보를 또다시 불러오기는 좀 그렇다. Apollo Client의 cache API에 기반해, dogs와 두 쿼리는 연결되어 있고, 이미 정보를 갖고 있다.

dog 하나를 불러오는 query는 아래와 같다.

```jsx
const GET_DOG = gql`
  query GetDog {
    dog(id: "abc") {
      id
      breed
      displayImage
    }
  }
`;
```

위 쿼리가 사용할, cache된 dog 데이터의 참조값을 반환하는 FieldPolicy를 직접 만들어 정의해보자.

```jsx
import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        dog(_, { args, toReference }) {
          return toReference({
            __typename: 'Dog',
            id: args.id,
          });
        }
      }
    }
  }
});

const client = new ApolloClient({ cache });
```

### 로컬 & 원격 데이터 결합

많은 개발자들은 필요한 데이터의 80% 정도인 원격 데이터를 매니징하는 데에 Apollo Client의 도움을 받는다고 한다. 하지만 20%를 차지하는 로컬 데이터(전역 플래그나 디바이스 API 결과)에 대해선 어떤가? 아폴로 클라이언트는 틀에 벗어난 방식으로 로컬 state를 관리한다. Apollo cache를 앱 내에서 single source of truth로 사용하는 것이다. 

모든 데이터를 Apollo Client로 관리하면 GraphQL을 모든 데이터의 공통 양식으로 사용하는 이점이 있다. 로컬, 원격 스키마 모두를 [GraphiQL](https://github.com/graphql/graphiql)을 통해 Apollo Client 개발자 도구로 살펴 볼 수 있다.

```jsx
const GET_DOG = gql`
  query GetDogByBreed($breed: String!) {
    dog(breed: $breed) {
      images {
        url
        id
        isLiked @client
      }
    }
  }
`;
```

Apollo Client의 로컬 state 기능을 기반으로, client-side에서만 쓰는 필드를 추가해 자유롭게 원격 데이터를 다루고 컴포넌트에서 불러올 수 있다. 위 예시에서는 client에서만 쓰는 필드인 isLiked를 서버 데이터와 함께 사용하여 쿼리를 보내고 있다. 컴포넌트가 로컬과 원격 데이터로 만들어지는 것처럼, 쿼리도 그렇게 할 수 있다.

### 활발한 생태계

Apollo Client는 쉽게 시작할 수 있지만, 더 발전시키고자 할 때 확장성이 높다. 앱에 특화된 미들웨어나 캐시 영속 기능처럼 `@apollo/client`로 커버되지 않는 커스텀 기능이 필요하다면, Apollo Link 구조를 새로운 네트워크 스택에 연결할 수 있다.

이런 유연함은 아폴로를 확장해가면서 당신이 꿈꾸던 client를 쉽게 만들 수 있도록 해준다. 
(후략: 유용한 확장 패키지들이 많고 아폴로 커뮤니티는 아주 크다...!)
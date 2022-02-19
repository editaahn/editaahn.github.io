---
title: "(번역) Apollo Client - useQuery의 option 및 result"
date: "2022-02-20T01:38:00"
categories: [code]
comments: true
---

`useQuery` 훅이 지원하는 option 및 result 필드는 아래에 정리되어 있다.<br>
대부분의 `useQuery` 호출은 이런 옵션들을 거의 생략해도 괜찮지만 이런 것들이 존재한다는 것을 알면 좋다.

`useQuery` 훅 API에 대해 더 자세한 사용 예시를 보고 싶다면 이 [API reference](https://www.apollographql.com/docs/react/api/react/hooks/#usequery)를 참고하길 바란다.

### Options

`useQuery` 훅은 아래의 옵션들을 받는다.

#### - 오퍼레이션 관련
| 옵션명/타입 | 설명 |
| --- | --- |
| query<br>`DocumentNode` | AST로 파싱되는, gql 템플릿 리터럴과 함께 사용되는 GraphQL 쿼리 스트링 |
| variables<br>`{ [key: string]: any }` | • 쿼리 실행을 위해 요구되는 GraphQL 변수 전체를 포함하는 object<br>• object의 각 key, value는 변수의 이름과 값 |
| errorPolicy<br>`ErrorPolicy` | • 쿼리가 응답(GraphQL 에러 및 결과값)을 다루는 방식을 규정함 <br>• 기본값은 none 이고, 쿼리 결과에 특정한 result가 아닌 에러 상세 정보가 담긴다는 것을 의미 |
| onCompleted<br>`(data: TData | {}) => void` | • 쿼리가 에러 없이 (또는 errorPolicy가 ignore이거나, 데이터가 반환되었을 때) 성공적으로 완료되었을 때 콜백 함수<br>• 쿼리 result의 data가 인자에 전달된다. |
| onError<br>`(error: ApolloError) => void` | • 쿼리 실행 중 하나 이상의 에러가 발생하면 불리는 콜백 함수 (errorPolicy가 ignore가 아닐 때)<br>• ApolloError 객체가 인자에 전달된다. 발생한 에러에 따라 networkError 객체 또는 graphQLErrors 배열을 포함한다. |
| skip<br>``boolean`` | • true이면 쿼리는 실행되지 않는다. useLazyQuery와는 함께 쓸수 없다.<br>• Apollo Client의 React 결합 기능으로 존재하는 속성이다. [core ApolloClient API](https://www.apollographql.com/docs/react/api/core/ApolloClient/)에서는 사용할 수 없다.<br>• 기본값은 false |

#### - 네트워킹 관련

| 옵션명/타입 | 설명 |
| --- | --- |
| pollInterval<br>`number` | • 쿼리가 폴링될 때의 인터벌 (milliseconds 단위). <br>• 기본값은 0 (폴링 없음) |
| notifyOnNetworkStatusChange<br>`boolean` | • true이면, network 상태가 바뀌거나 에러 발생 시, 요청 진행 중인 쿼리가 들어 있는 컴포넌트가 리렌더된다.<br>• 기본값은 false |
| context<br>`Record<string, any>` | Apollo Link를 사용한다면, link 내부로 전달되는 context 객체의 초기값이 된다. |
| ssr<br>`boolean` | false이면 server-side rendering 시에 쿼리 실행을 건너뛴다. |
| client<br>`ApolloClient` | • ApolloClient의 instance이다. 쿼리를 실행하기 위해 사용된다.<br>• 기본으로 context를 통해 전달되는 instance가 사용되지만, 다른 instance를 이 속성을 통해 제공할 수 있다. |

#### - 캐싱 관련

| 옵션명/타입 | 설명 |
| --- | --- |
| fetchPolicy<br>`FetchPolicy` | • 쿼리 실행 중에 Apollo Client 캐시와 인터랙팅하는 방식을 정할 수 있다.<br>(예를 들면, 서버에 요청하기 전에 캐시를 먼저 확인할 지 여부)<br>• 기본값은 cache-first |
| nextFetchPolicy<br>`FetchPolicy` | 첫 쿼리 실행 후 재실행 시의 fetchPolicy를 정할 수 있다. <br>예를 들면, cache-and-network 또는 network-only를 첫 실행에 사용하고 다음부터 cache-first로 바꿀 수 있다. |
| returnPartialData<br>`boolean` | • true이면, 캐시에 모든 쿼리 필드에 대한 값을 갖고 있지 않은 경우, 쿼리가 캐시에서 일부 필드만을 가져와 결과를 반환할 수 있다.<br>• 기본값은 false |

### Result

...[More Detail](https://www.apollographql.com/docs/react/data/queries/#options)
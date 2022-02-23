---
title: "(번역) Apollo Client - useQuery의 option 및 result"
date: "2022-02-20T01:38:00"
categories: [apollo]
comments: true
---
<br>`useQuery` 훅이 지원하는 option 및 result 필드는 아래에 정리되어 있다.<br>
대부분의 `useQuery` 호출은 이런 옵션들을 거의 생략해도 괜찮지만 이런 것들이 존재한다는 것을 알면 좋다.
<br>`useQuery` 훅 API에 대해 더 자세한 사용 예시를 보고 싶다면 이 [API reference](https://www.apollographql.com/docs/react/api/react/hooks/#usequery)를 참고하길 바란다.

### Options
<br>`useQuery` 훅은 아래의 옵션들을 받는다.

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

`useQuery` 훅은 호출된 후에 result object에 아래 property들을 넣어 반환한다. 이 object는 쿼리 결과를 포함하고 refetching, 동적 polling, pagination을 위한 유용한 기능들을 제공한다.

**- 오퍼레이션 관련**

| 옵션명/타입 | 설명 |
| --- | --- |
| data<br>`TData` | • GraphQL 쿼리 완료 후 result 객체<br>• 쿼리 result에 에러가 있는 경우 undefined를 반환한다. (쿼리의 errorPolicy를 적용받음) |
| previousData<br>`TData` | • 해당 쿼리의 바로 이전 result 객체<br>• 첫 실행엔 undefined |
| error<br>`ApolloError` | • 쿼리에 에러가 발생하면 graphQLError 배열 또는 networkError을 포함하는 객체. 발생하지 않았으면 undefined |
| variables<br>`{ [key: string]: any }` | 쿼리에 제공한 변수를 포함하는 객체 |

**- 네트워크 정보**

| 옵션명/타입 | 설명 |
| --- | --- |
| loading<br>`boolean` | true면 쿼리는 진행 중이며 result는 반환되지 않은 상태 |
| networkStatus<br>`NetworkStatus` | • 해당 쿼리의 바로 이전 result 객체<br>• 첫 실행엔 undefined |
| error<br>`ApolloError` | • 쿼리에 에러가 발생하면 graphQLError 배열 또는 networkError을 포함하는 객체. 발생하지 않았으면 undefined |
| variables<br>`{ [key: string]: any }` | 쿼리에 제공된 변수를 포함하는 객체 |
| networkStatus<br>`NetworkStatus` | • 쿼리에 연동된 요청의 최신 네트워크 상태를 가리키는 number<br>• [가능한 값 확인](https://github.com/apollographql/apollo-client/blob/d96f4578f89b933c281bb775a39503f6cdb59ee8/src/core/networkStatus.ts#L4) (ex.loading = 1, setVariables = 2)<br>• notifyOnNetworkStatusChange 옵션을 설정하면 확인할 수 있다. |
| client<br>`ApolloClient` | • ApolloClient의 instance이다. 쿼리를 실행하기 위해 사용된다.<br>• 쿼리 실행하거나 캐시에 데이터를 추가할 때 유용하다 |
| called<br>`boolean` | • true면 lazy query가 실행된 것이다.<br>• 해당 필드는 useLazyQuery가 반환한 result 객체로만 제공된다. |

**- 헬퍼 함수**

| 옵션명/타입 | 설명 |
| --- | --- |
| refetch<br>`(variables?: Partial<TVariables>) => Promise<ApolloQueryResult>` | • 쿼리를 재실행할 수 있게 해주는 함수. 원하면 새로운 variables를 전달할 수 있다.<br>• refetch가 네트워크 요청을 수행하는 것을 확실히 보장하려면fetchPolicy를 network-only로 세팅해야 한다. (최초 쿼리의 fetchPolicy가 no-cache나 cache-and-network가 아니라면 기본적으로 네트워크 요청 수행을 보장) |
| fetchMore<br>`({ query?: DocumentNode, variables?: TVariables, updateQuery: Function}) => Promise<ApolloQueryResult>` | paginated 목록의 다음 결과값을 불러오는 함수 |
| startPolling<br>`(interval: number) => void` | 쿼리를 정해진 interval마다 재실행시키도록 시작하는 함수 | 
| stopPolling<br>`() => void` | startPolling 후 실행된 polling을 멈추도록 하는 함수 |
| subscribeToMore<br>`(options: { document: DocumentNode, variables?: TVariables, updateQuery?: Function, onError?: Function}) => () => void` | subscription을 실행하도록 하는 함수. 주로 쿼리에 포함된 특정 필드를 구독하는 데에 사용한다.<br>이 함수는 구독을 끝낼 수 있는 함수를 리턴한다. |
| updateQuery<br>`(previousResult: TData, options: { variables: TVariables }) => TData` | 후속 GraphQL 오퍼레이션을 실행하지 않고 쿼리의 cache된 결과값을 업데이트해주는 함수 |
---
title: "Apollo Client - Query - Fetch policies"
date: "2022-02-22T00:30:00"
description: "Apollo Client 쿼리에서 지원하는 fetch Policy들을 상세하게 살펴보자."
categories: [code]
comments: true
---

Apollo Client 쿼리에서 지원하는 fetch Policy들을 상세하게 살펴보자.

| 이름 | 설명 |
| --- | --- |
| cache-first | • 먼저 cache에 대해 쿼리를 실행<br>• 요청한 모든 데이터가 cache에 이미 있다면, 해당 데이터 리턴.<br>• 그렇지 않으면 GraphQL 서버에 대해 쿼리를 실행하고, 캐싱한 후 데이터를 반환<br>• 네트워크 요청 횟수를 최소한으로 줄이는 것을 우선으로 함<br>• fetch policy의 기본값 |
| cache-only | • Cache에 대해서만 쿼리를 실행<br>• 이 값을 적용하면, 요청한 모든 필드를 cache가 갖고 있지 않을 때 에러를 발생시킴 |
| cache-and-network | • Cache와 GraphQL 서버 모두에 대해 쿼리 전체를 실행<br>• 서버측 쿼리의 result가 cached된 필드를 업데이트하면 쿼리는 자동으로 업데이트됨<br>• 캐시된 데이터를 서버 데이터에 일치시켜주면서도 빠른 응답을 제공 |
| network-only | • GraphQL 서버에 대해 쿼리 전체를 실행하되, cache를 먼저 체크하지 않음<br>• 쿼리 결과는 cache에 저장됨<br>• 서버 데이터와의 일관성을 우선시. 그러나 캐시 데이터를 사용할 수 있을 때에는 즉각에 가까운 응답을 제공하지는 못함 |
| no-cache | network-only랑 비슷하지만, 쿼리의 결과가 cache를 남기지 않음 |
| standby | • cache-first와 같은 로직이지만, 내부 필드값이 바뀌었을 때 쿼리가 자동으로 업데이트되지 않음<br>• refetch와 updateQueries를 써서 수동으로 쿼리 업데이트 필요 |

### 자의적 해석 (동료들한테 cross check 예정~)
- 번역 관련
  - 쿼리를 업데이트한다 (Query updates) = `useQuery`의 반환값을 업데이트하는 것으로 추정
- `cache-and-network`는 서버와 캐시 모두에 쿼리를 보내서 비교를 하고, 다르면 server 데이터를 기준으로 캐시, 쿼리 result까지 싱크를 맞춰주는 것이 목적으로 보임
  - `cache-first`는 요청된 모든 필드가 캐시에 있음을 먼저 보고 하나라도 없으면 서버에 쿼리를 보내기 때문에, 필드가 많거나 해서 캐싱 상태가 매번 달라질 수 있는 경우에는 `cache-and-network`를 때리는 게 나은 것 같음
- 이전에 Query에 대해 다룬 글 예제에 나온 것처럼, fetchPolicy → nextFetchPolicy 를 다르게 사용하는 경우 캐싱을 유연하게 다루기 좋아 보인다. 예를 들면,
  1. 첫 실행에서는 캐시를 먼저 체크하지 않고 `network-only`로 서버에 대해 쿼리를 실행하고, (해당 쿼리로 인한 캐시는 생성된다)
  2. 캐시를 먼저 사용할 수 있도록 `cache-first`로 바꿔준다.

```jsx
const { loading, error, data } = useQuery(GET_DOGS, {
  fetchPolicy: "network-only",   // Used for first execution
  nextFetchPolicy: "cache-first" // Used for subsequent executions
});
```

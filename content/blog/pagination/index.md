---
title: "Pagination"
date: "2022-10-21T20:00:00"
categories: [apollo]
comments: true
---

널리 사용되던 offset-based pagination의 한계를 보완해 cursor-based pagination을 사용하는 이유는 무엇일까?

## Offset-based Pagination의 문제점

시작 시점의 순서(offset)로부터 limit만큼 레코드를 잘라 제공하는 방식이다.

1. **퍼포먼스**
    
    대부분 RDBMS의 경우, limit+offset을 넣어 쿼리를 치면, 모든 결과값을 먼저 찾아놓고 앞에서부터 순회하면서 자르는 방식. offset 값이 커질수록 느려짐
    (ex. 20개 단위일 때 유저가 1,000번째 페이지를 바로 요청한 경우 2,000개의 상품을 색인하게 됨)
    
2. **유연성**
    
    offset(개수) 기반이기 때문에 페이지 탐색 중 데이터가 변경되면 중복된 데이터를 보여주거나 스킵된 데이터가 발생할 수 있음
    

## Cursor-based Pagination은 언제 필요할까?

Offset-based Pagination의 단점을 극복해야할 때 사용한다. 아래 측면에서 비교를 해보자.

1. **퍼포먼스**
    
    고유한 기준점(cursor)을 조건(WHERE)으로 limit만큼만 색인한 다음, 결과값을 만들어 바로 반환함
    
2. **유연성**
    
    데이터가 바뀌더라도 마지막 불러온 커서를 기억하기 때문에 유연성 있게 실시간 데이터를 제공
    

### Cursor

- 페이지네이션 기능에서 목록의 각 node를 구분하여 페이지 기준점으로 사용하기 위한 고유한 값
- cursor의 기준
    
    각 값이 고유하면서도 정렬이 가능한 컬럼이 1개 이상 들어가는 것이 좋음. 그렇지 않으면 복잡한 추가 작업이 들어갈 수도 있음
    
- 왜 cursor의 존재가 필요할까?
    
    상품 목록을 `products` 쿼리로 불러오고 싶은데, 상품을 구현하는 데에 쓰일 필요 없지만 정렬을 위해서 product 모델에 없는 `recommendationId`라는 필드가 필요한 경우가 있다고 하자. 이 필드를 그래프에 추가하게 될 경우 product의 모델과 그와 관련된 모든 것을 바꿔줘야하는 이슈가 생긴다. 이런 문제를 겪지 않기 위해 cursor라는 존재가 고안되었다.
    
- cursor는 아이템마다 넣어줘야할까?
    - [GraphQL Cursor Connections Specification 문서](https://relay.dev/graphql/connections.htm#sec-Cursor)에 보면 cursor 필드를 must contain 으로 강조하고 있음
    - 해결하지 못한 의문: 클라이언트에선 next cursor나 previous cursor만 알면 되지 않나 생각이 드는데, item 그래프마다 포함이 되어야 할 이유는 뭘까?

### Tradeoffs

특정 페이지로 이동할 수 없다.

## Relay Style Pagination

### **Relay**?

React application을 위해 고안된, GraphQL 서버로부터 데이터를 얻고 캐싱하는 프레임워크

### Relay Cursor Connections

- GraphQL 서버가 어떻게 데이터 리스트를 나타내야하는지 정해서 페이지네이션을 가능하게 함
- 그래프의 구성
    
    ```graphql
    query Query {
    	products() @relayPagination {
    		edges {
    			node {
    				id
    				title
    				isHidden
    				...	
    			}
    			cursor
    		}
    		pageInfo {
    			totalCount
    			endCursor
    			hasNextPage
    		}
    	}
    }
    ```
    
    - connection: 페이지네이팅된 데이터를 감싸는 wrapper이며 `edges`, `pageInfo` 두 필드를 가짐
        - pageInfo: 페이지네이션에 대한 정보
        - edges: `pageInfo` 필드가 들어오면서 edge(데이터와 cursor) 목록을 담을 필드
            - cursor: 특정 edge를 대표하는 고유한 string 필드
            - node: 우리가 원하는 아이템 값
- cursor는 왜 string일까?
    
    : cursor value를 난독화하도록 장려하기 위해
    
    - Base64로 인코딩된 ID를 커서 value로 사용함
    - 왜 encode하는걸까?
        - cursor에 어떤 값이 오는지 클라이언트가 굳이 알 필요는 없기 때문에
        - 서버가 cursor에 추가적인 정보를 넣어 유연하게 사용할 수 있도록 하기 위해
- 인코딩된 커서
    - 서버에 유연성을 부여할 수 있는 아이디어
    - API를 사용하는 쪽에는 일관된 인터페이스를 제공하면서도, endpoint에 따라서는 페이지네이션을 다르게 구현할 수 있게 해줌

## Reference

[https://uxdesign.cc/why-facebook-says-cursor-pagination-is-the-greatest-d6b98d86b6c0](https://uxdesign.cc/why-facebook-says-cursor-pagination-is-the-greatest-d6b98d86b6c0)

[https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32](https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32)

[https://velog.io/@minsangk/커서-기반-페이지네이션-Cursor-based-Pagination-구현하기](https://velog.io/@minsangk/%EC%BB%A4%EC%84%9C-%EA%B8%B0%EB%B0%98-%ED%8E%98%EC%9D%B4%EC%A7%80%EB%84%A4%EC%9D%B4%EC%85%98-Cursor-based-Pagination-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)

[https://graphql.org/learn/pagination/](https://graphql.org/learn/pagination/)

[https://slack.engineering/evolving-api-pagination-at-slack/](https://slack.engineering/evolving-api-pagination-at-slack/)
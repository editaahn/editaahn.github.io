---
title: "Apollo Client : Mutation 후 캐시 수동 vs 자동 업데이트"
date: "2022-04-01T00:21:00"
description: "mutation 후, source는 같지만 fragment가 다른 캐시를 업데이트할 떄 대처한 방법"
categories: [apollo]
comments: true
---

아폴로 클라이언트는 기본적으로 fragment 단위로 캐시 업데이트를 해준다.

### 오늘 내가 겪었던 문제

같은 source를 참조하고 있지만 다른 `__typename`을 사용하고 있는 mutation, query가 각각 있다. `__typename`이 다르다보니, mutation이 일어나도 같은 source를 쓰고 있는 query 캐시 업데이트가 안 된다는 거였다. Apollo Server 리졸버 쿼리와 API의 응답값에서 두 타입의 접점이 없었다.

### 처음에 시도한 방법 : 직접 수정

mutation에 update 함수를 사용해 직접 캐시를 수정했다.

```jsx
// Client

const itemId = 'm124sg12aa';

const addItem = () => {
	addItemMutation({
		update: (cache, { data }) => {
			id: cache.identify(itemId),
			fields: {
				skuId: itemId // 이 부분을 더미로 넣어주게 되어 찝찝함
			}
		},
	});
};
```

위 클라이언트에서 뭔가를 조작하는 방법은.. 한계가 있었다. 저 `someField` 부분 캐시를 아무거라도 채워 넣으면 동작은 가능한 기능이었지만, 캐시에 수동으로 업데이트 해줘야 할 필드를 mutation의 반환값으로 받을 수가 없어 더미로 캐시 업데이트를 해줘야 하는 상황이었다. 

### 개선된 방법 : 쿼리 새로 만들기

리졸버 쿼리를 개선했다. (나는 V2로 새로 만들었다.)

mutation 실행 후 return값 내에, query에서 쓰는 것과 같은 타입의 객체를 반환해주는 방법이다.

```tsx
// Apollo Server Resolver

@Mutation(returns => SomethingResult)
async addItemV2(
	@Ctx() context, 
	@DataSource(Source) source: Source, 
	@Arg('token') token: string, 
	@Arg('itemId') id: string ) { 
		const userId = getSessionUserId(context); 

		const subscriptionTicket = 
			await this.service.add({ itemId, userId, source, token }); 
		
		// 이 부분이 추가되었다.
		const item = await this.service.getItemById(new ObjectId(itemId));

		return { ticket, item };
} 
```

위 mutation 함수에서 return하는 item 필드를 client에서 mutation 처리 후 결과 필드로 요청하게 했다. query에서 받은 것과 동일한 `__typename`을 바라보기 때문에 해당 fragment의 캐시가 정상 업데이트된다.

### 느낀 점

`update`는 캐시를 다이렉트로 적용해주지만, manually 바꿔주는 방법은 비교적 자연스럽지 못하다. Apollo Client 캐싱의 이점을 잘 누리려면 Apollo Server의 쿼리를 디자인할 때도 캐시를 염두에 두어야 할 것이다.
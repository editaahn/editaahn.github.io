
---
title: "Noindex, Nofollow & Disallow"
date: "2022-04-23T23:46:00"
categories: [seo]
description: "헷갈리는 SEO 블락 기능들을 명확히 구분해보자."
comments: true
---

- 참고 원문: [https://www.deepcrawl.com/blog/best-practice/noindex-disallow-nofollow/](https://www.deepcrawl.com/blog/best-practice/noindex-disallow-nofollow/)

---

 이 3개의 단어는 SEO와 관련된 외계어 같이 들리기도 한다. 하지만 이 세 단어를 가려 쓸 줄 알면 구글봇에게 이래라 저래라 하는 재미가 있다는 점에서 알아둘 가치가 있다.

기초부터 시작해보자. 사이트의 어떤 파트를 검색 엔진이 크롤링해갈지 컨트롤하는 세 개의 방법이 있다.

1. Noindex: 이 페이지를 검색 결과에 포함하지 않도록 함*
2. Disallow: 이 페이지를 크롤링(탐색)하지 않도록 함*
3. Nofollow: 이 페이지 내에 연결된 링크들을 따라가지 않도록 함

*페이지를 검색 결과에 포함시키는 것과 크롤링하는 것은 다르다. 크롤링은 구글이 해당 페이지에 대한 수집 개념이고, 검색 결과 포함은 노출의 개념이다.

## Noindex Meta Tag?

‘noindex’ 태그는 검색 엔진들이 해당 페이지를 검색 결과에 포함하지 말라고 지시한다.

페이지를 noindexing하는 가장 흔한 방법은 HTML의 head 영역이나 응답 headers에 이 태그를 넣는 것이다. 검색 엔진이 이 정보를 보게 허용하려면 페이지는 robots.txt 파일에서 disallow를 사용해 블로킹되면 안된다. 페이지가 robots.txt에 의해 블락되면, 구글은 noindex 태그를 아예 보지 못하고, 그 페이지는 검색 결과에 여전히 노출된다.

검색 엔진이 페이지에 대해 찾지 못하게 하려면 head 내에 아래처럼 추가한다.

```html
<meta name=”robots” content=”noindex, follow”>
```

`content`의 두번째 파트는 페이지의 모든 링크들을 추적하지 말라는 것을 의미하는데, 자세한 건 밑에서 설명할 예정이다.

HTTP header에서 X-Robots-Tag를 넣음으로서 위 방법을 대체할 수도 있다.

```html
X-Robots-Tag: noindex
```

## Noindex를 robots.txt 파일에서 사용하기

noindex 태그를 robots.txt 파일에 넣는 방법도 검색 결과에서 페이지를 제외시킬 수 있다. 더욱 빠르고 쉽게 많은 페이지들을 noindex 시키는 방법이다.

```html
Noindex: /robots-txt-noindexed-page/
```

그러나, 구글에서는 이 방법에 대해선 전적으로 의존하면 안 된다고 선을 그었다. [언급 정보](https://www.youtube.com/watch?v=yIIRyBMSPUk&t=3s) 

## Disallow 지시어

robots.txt를 통해 페이지를 disallow한다는 것은 검색 엔진에게 페이지를 크롤링하지 말라고 하는 것이다. 읽는 사람들 또는 검색 트래픽에 필요가 없는 페이지들이나 파일이 많다면 유용한 방법이다. 검색 엔진이 이런 페이지들을 크롤링하는 데에 시간을 낭비하지 않게 되기 때문이다.

disallow를 넣으려면 robots.txt에 아래와 같이 추가한다.

```html
Disallow: /your-page-url/
```

외부에 해당 페이지로 연결된 링크가 있거나, 이 페이지를 가리키는 canonical 태그가 있다면, 여전히 색인되고 랭크될 수 있다. 그래서 **disallow와 noindex를 결합해 사용**하는 것이 중요하다.

- 경고: disallow를 사용하면, 사실상 페이지를 사이트에서 지우게 되는 것이다.
    
    disallow된 페이지들은 PageRank**를 다른 곳으로 전달할 수 없다. 따라서 이런 페이지들에 대한 링크는 SEO 관점에서는 사실상 쓸모가 없다. 포함되어야할 페이지들을 disallowing하는 것은 트래픽에 안좋은 결과를 초래할 수 있어서 disallow를 사용하는 데에는 각별히 주의해야한다.
    
    **[PageRank](https://ko.wikipedia.org/wiki/%ED%8E%98%EC%9D%B4%EC%A7%80%EB%9E%AD%ED%81%AC): 문서에 상대적 중요도에 따라 가중치를 부여하여 페이지의 중요도를 측정하는 구글 검색 알고리즘. 다른 사이트로부터 얼만큼 연결이 많이 되는지 관찰하여 측정.
    

## Noindex랑 disallow를 결합하기

1. **Noindex (page) + Disallow**: disallow는 페이지 내에서 noindex랑 결합될수는 없다. 페이지가 차단되어 있으므로 검색 엔진이 크롤링을 하지 않게 되고, 검색 결과에서 해당 페이지를 지워버려야 한다는 것을 알지 못하기 때문이다.
2. **Noindex (robots.txt) + Disallow**: 이 방법은 페이지를 검색 결과에 등장하지 못하게 막으면서, 크롤링도 되지 않도록 한다. PageRank가 이 페이지를 통할 수 없다는 것은 알아두자.

robots.txt 두 번째 방법을 적용하는 방법은 아래와 같다.

```html
Disallow: /example-page-1/
Disallow: /example-page-2/

Noindex: /example-page-1/
Noindex: /example-page-2/
```

## Nofollow Tag?

검색 엔진이 페이지 내부에 링크된 페이지들의 중요도를 결정하지 못하게 하고 해당 사이트 내 다른 URL을 더 탐색하지 못하도록 한다.

nofollow를 쓰는 대부분의 경우를 보면, 댓글 내 링크, 직접 컨트롤하지 않는 다른 컨텐츠, 광고 링크나 위젯/인포그래픽 같은 embed, 방문자 글 내부의 링크, 주제에서 벗어난 link들이다.

역사적으로 SEO는 내부 PageRank를 더 중요한 페이지로 이동시키기 위해 선별적으로 nofollow하는 링크를 가지고 있다.

Nofollow 태그는 2곳 중 하나에 넣을 수 있다.

1. HTML <head> : 페이지 내부의 모든 링크에 대해 nofollow

```html
<meta name=”robots” content=”nofollow” />
```

1. 링크 코드 : 개별 링크에 대해 nofollow

```html
<a href=”example.html” rel=”nofollow”>example page</a>
```

nofollow는 링크된 페이지를 크롤링되지 않도록 완전히 막는 방법이 아니다. 그저 특정 링크를 통해서 크롤링되지 않도록 막는 방법이다. 구글은 nofollowed된 링크에 있는 URL을 크롤링하지 않는다.

다른 사이트가 nofollow 태그를 사용하지 않고 페이지를 링크하거나 Sitemap에 해당 페이지가 들어가 있으면 여전히 검색 결과에 나타날 수 있다.

비슷한 얘기로, 검색 엔진이 URL을 미리 알고 있으면 nofollow 링크를 추가하더라도 검색 결과에서 이 페이지를 없앨 수 없다.

2019년 9월에 구글은 nofollow에 대한 업데이트로 새로운 2개의 link attribute를 소개한다.

- `rel="sponsored"` : 광고 목적의 링크를 구분하기 위한 속성
- `rel="ugc"` : 유저가 생성한 컨텐츠(User Generated Content)를 위한 속성. 유저가 만든 컨텐츠 사이트에 있는 링크에 쓰도록 권장. (post나 댓글 등)

## Noindex Nofollow?

위에서 언급했듯, nofollow 태그를 추가하는 것은 페이지에 대한 크롤링을 완전히 차단할 수 없다. 

그러므로 검색이 안 되게 하려면 noindex를 같이 처리해줘야 한다. 이렇게 하면 구글이 여전히 이 페이지를 크롤링하지만 검색 결과에는 나타나지 않는다. admin, login, 내부 검색 결과, 가입 페이지와 같이 noindex를 넣고 싶은 페이지들에 사용할 수 있는 방법이다. 구글이 이 페이지를 완전히 크롤링 못하게 하려면 disallow시키면 된다.
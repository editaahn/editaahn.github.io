---
title: "sitemap 가이드라인 - 2"
date: "2022-04-15T23:45:00"
categories: [seo]
comments: true
---

7. 같은 페이지가 여러 버전으로 필요해서 url이 다수 존재하는 경우, 표준 url을 직접 지정하는 것을 권장
    - Googlebot은 컨텐츠가 비슷한 페이지들을 중복 페이지로 판단하고 내부 기준에 따라 표준 url을 지정
    - 표준 페이지 지정 기준: `rel=canonical` 라벨 존재 여부
      1. 서버에서 페이지 응답 HTTP 헤더에 `rel="canonical"` 삽입
      2. 중복 페이지 HTML head에 태그 삽입하여 표준 url을 명시
      
    ```html
    <link rel="canonical" href="https://example.표준-페이지.com" />
    ```

    - 사이트맵 내에 표준 페이지 url만 넣기: 위 방법보다는 덜 강력함
    - 프로토콜: HTTPS가 HTTP보다 선호됨
    - [더 자세히 보기](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls?hl=ko#define-canonical)
    - 중복 페이지의 예시
      - 여러 기기 유형을 지원하는 경우
        
      ```tsx
      https://example.com/news/koala-rampage
      https://m.example.com/news/koala-rampage
      https://amp.example.com/news/koala-rampage
      ```
    
      - www가 있는 버전과 없는 버전, http/https 버전 등 url 형태는 다르나, 같은 콘텐츠를 게시하는 경우
    
      ```tsx
      http://example.com/green-dresses
      https://example.com/green-dresses
      http://www.example.com/green-dresses
      ```
      
    - 표준 url을 매뉴얼하게 지정하도록 권장하는 이유
        - 검색한 사용자가 하나의 url으로만 인입되게 할 수 있음
            - (ex) 방문자 인입 경로 추적 시 데이터를 정규화할 수 있지 않을까?
        - Googlebot이 중복 페이지에 크롤링 시간을 낭비하지 않도록 함
        - [더 자세히 보기](https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls?hl=ko#why-it-matters)
      
8. 모바일, 데스크탑 버전 url이 다른 경우, Googlebot이 두 버전을 별도로 찾을 수 있게 하는 2가지 방법
    - HTML에 사이트 설정을 포함하는 방법
        1. 데스크탑 페이지 코드에 `rel=alternate` 삽입
        
        ```html
        <link rel="alternate" media="only screen and (max-width: 640px)"
          href="http://m.example.com/page-1">
        ```
        
        2. 모바일 페이지 코드에 `link rel=canonical` 삽입
        
        ```html
        <link rel="canonical" href="http://www.example.com/page-1">
        ```
        
    - sitemap에 사이트 설정을 포함하는 방법
        
    ```html
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <url>
        <loc>http://www.example.com/page-1/</loc>
        <xhtml:link rel="alternate" media="only screen and (max-width: 640px)"
        href="http://m.example.com/page-1" />
      </url>
    </urlset>
    ```
        

9. 사이트맵은 어떤 페이지가 중요한지 Google에 알려주는 제안일 뿐
    - 사이트맵 내 모든 url을 크롤링한다고 보장하지 않음

10. Googlebot은 `<priority>` 및 `<changefreq>` 값을 무시함

11. Googlebot은 사이트맵에 표시된 순서대로 URL을 크롤링하지 않음
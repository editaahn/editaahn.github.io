---
title: "sitemap 가이드라인 - 1"
date: "2022-04-14T11:45:00"
categories: [seo]
comments: true
---

1. 일관성 있는, 정규화된 URL 사용
    - www 누락 또는 상대 URL 등 변형하지 않기
    
2. 사이트의 루트 폴더에 사이트맵 파일 위치시키기

3. 사이트맵 내 URL에 세션ID 포함시키지 말 것

4. 다른 언어 버전이 존재하는 경우, 명시적으로 대체 url 제공하는 방법
    - HTML에 사이트 설정을 포함하는 방법
      - HTML header에서 `hreflang` 속성에 언어 코드를 부여하고, `href`에 해당 언어/지역에 맞는 url 부여
    
    ```html
    <link rel="alternate" hreflang="lang_code" href="url_of_page" />
    ```
    
    - 사이트맵에 사이트 설정을 포함하는 방법
      - 각 `<url>` 요소에 기준 페이지 포함 모든 대체 버전을 나열하는 하위 요소 삽입. 
      - `<xhtml:link rel="alternate" {...} />`
    
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <url>
        <loc>https://www.example.com/english/page.html</loc>
        <xhtml:link
                   rel="alternate"
                   hreflang="de"
                   href="https://www.example.com/deutsch/page.html"/>
        <xhtml:link
                   rel="alternate"
                   hreflang="de-ch"
                   href="https://www.example.com/schweiz-deutsch/page.html"/>
        <xhtml:link
                   rel="alternate"
                   hreflang="en"
                   href="https://www.example.com/english/page.html"/>
      </url>
      <url>
        <loc>https://www.example.com/deutsch/page.html</loc>
        <xhtml:link
                   rel="alternate"
                   hreflang="de"
                   href="https://www.example.com/deutsch/page.html"/>
        <xhtml:link
                   rel="alternate"
                   hreflang="de-ch"
                   href="https://www.example.com/schweiz-deutsch/page.html"/>
        <xhtml:link
                   rel="alternate"
                   hreflang="en"
                   href="https://www.example.com/english/page.html"/>
      </url>
    </urlset>
    ```
    
5. UTF-8로 사이트맵 파일 인코딩

6. 사이트맵 파일은 50MB, url 5만개까지만 허용됨
    - sitemap.xml은 sitemap 여러개를 가질 수 있음
        - 사이트맵의 규모가 커졌을 때 `sitemapindex` 을 사용
        - `sitemapindex` 하위에 sitemap 다수 포함 가능
        
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>http://www.example.com/sitemap1.xml.gz</loc>
      </sitemap>
      <sitemap>
        <loc>http://www.example.com/sitemap2.xml.gz</loc>
      </sitemap>
    </sitemapindex>
    ```
---
title: "Canvas API 최적화하기"
date: "2022-05-09T23:46:00"
categories: [animation]
description: "HTML5의 Canvas API를 잘 쓰는 방법을 찾아보기"
comments: true
---

- 이미지 좌표에 소수점보다는 정수 쓰기
    
    ```jsx
    ctx.drawImage(myImage, 0.3, 0.5);
    ```
    
    drawImage를 할 때 소수점을 쓰면 이미지를 부드럽게 보여주기 위해 브라우저가 부가적인 연산을 한다.
    
    이를 피하기 위해 좌표값을 반올림하자.
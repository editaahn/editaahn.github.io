---
title: "Performance API"
date: "2022-06-17T11:51:00"
categories: [web, browser]
description: "Performance API를 통해 웹 브라우저에서 일어나는 시간 관련 값들 알아보기"
comments: true
---

최근에 이벤트가 일어나는 timestamp를 알아내서 작업을 해야할 일이 있었다.

Web API의 Performance API와 이벤트의 timing 등을 이용하면, web에서 벌어지는 성능에 대한 값들을 구할 수 있다.

## Performance API란?

페이지에서 수행 타이밍 관련 정보를 담고 있는 인터페이스.

`Window.performance`를 호출하면 해당 객체를 볼 수 있다. 객체의 프로퍼티들을 살펴보면 deprecated된 것들이 많아 사용에 주의가 필요하다. (navigation, timing 등)

### PerformanceEntry

web에서 일어나는 이벤트들이 프로그램 동작의 기준 시점으로부터 microsecond로 얼만큼의 시간이 지나서 발생했는지 정보를 제공한다. 

이 객체는 여러 종류의 타입으로 구분된다. 

- PerformanceMark
- PerformanceMeasure
- PerformanceNavigationTiming
- PerformanceResourceTiming
- PerformancePaintTiming


자세한 내용은 To Be Continued..

<!-- 이 중에 하나인 PerformanceNavigationTiming를 살펴보도록 하자.

### PerformanceNavigationTiming

PerformanceEntry 객체의 서브타입 중 하나이다. -->
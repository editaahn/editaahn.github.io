---
title: "MSA"
date: "2022-06-28T00:27:00"
categories: [architecture]
description: "Micro Service Architecture Style의 정의와 구성 요소, 이점을 알아보자."
comments: true
---

## Micro Service Architecture Style

- 아키텍처를 독립적인 비지니스 기능을 가진 여러 서비스들로 쪼개어 구성하는 방법

## Micro Service

- Microservice는 작고, 독립적이고, 느슨하게 결합되어야 한다.
- 하나의 작은 개발팀이 관리할 수 있을 정도의 크기로 코드베이스를 분리한다.
- 독립적으로 배포할 수 있어야 한다. 전체 application의 빌드/배포에 영향을 미치지 않는다.
- API를 잘 정의해 서비스 간에 소통한다. 서비스 내부 수행에 대한 디테일은 다른 서비스가 알지 못한다.
- 서비스 별 언어, 기술 스택, 라이브러리 등이 전부 다를 수 있다.

### 기타 구성 요소

- 관리 및 조정: 노드에 서비스 배치, 실패 식별, 서비스 간에 부하 조정 작업 등등. 주로 Kubernetes 등 상용 기술이 담당함
- API Gateway: 클라이언트에서의 진입점. 클라이언트는 서비스를 직접 부르지 않고 API gateway를 거침. back end 내 적절한 서비스에 호출 전달. 아래와 같은 이점.
    - 클라이언트를 서비스로부터 분리
    - 서비스에서 웹 친화적이지 않은 messaging protocol을 쓸 수도 있음 (ex. AMQP)
    - 인증, 로깅, SSL 종료, 부하 분산 가능
    - throttling이나 caching, validation 등에서 다양한 정책을 가져갈 수 있음

## Benefits

- 민첩성
    - 독립적으로 배포하기 때문에, 서비스 업데이트 주기가 빨라지고 롤백도 빠름
- 집중적으로 일하는 소규모 팀
    - 서비스 규모가 작기 때문에, 한 기능 팀 내에서 충분히 구축, 테스트, 배포.
    - 커뮤니케이션 속도 및 생산성 제고
- 작은 코드 베이스
    - 모놀리식 애플리케이션은 시간이 가면서 코드 간 의존성이 복잡해지는 경향 크고, 새 기능을 추가하려면 여러 곳을 고쳐야함
    - MSA에서는 코드나 저장소를 공유하지 않기 때문에 종속성 최소화
- 다양한 기술 사용
    - 팀의 각 서비스에만 필요한 기술을 적절히 선택
- 결함 격리
    - 하나의 서비스가 문제가 생겨도, 전체에게 영향 가지 않도록 핸들링할 수 있음
- 확장성
    - 서비스 별 확장 가능
    - 전체 애플리케이션 규모를 확장하지 않아도 됨
- 데이터 격리
    - 서비스 하나에서만 스키마를 바꾸면 되니까 스키마 업데이트하기 쉬움

### Reference

- [Azure 문서](https://docs.microsoft.com/ko-kr/azure/architecture/guide/architecture-styles/microservices)
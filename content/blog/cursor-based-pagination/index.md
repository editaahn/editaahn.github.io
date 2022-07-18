---
title: "Cursor-based pagination"
date: "2022-07-18T23:50:00"
categories: [apollo]
comments: true
---

## 배경

modern web에서 유저에게 노출되는 데이터는 다이나믹하게 변할 수 있다. 

전통적인 page numbering 방식은 유저 인터랙션이나 데이터 변경이 잦은 서비스에서 쓰기엔 문제가 좀 있을 수 있는데.. 유저가 페이지를 이동하는 와중에 리스트에 item이 추가되거나 삭제될 수 있기 때문.

- 일부 item을 유저가 보지 못할 수 있음
- 같은 item을 두번 보게 될 수 있음

데이터가 계속 업데이트되어도 유저가 안정된 화면을 보도록 하는 것이 중요해짐

## ****Cursor-based pagination의 등장****

어느 item까지 불러왔는지 가리키는 포인터가 있다면 위쪽에 계속 새로운 아이템이 쌓여도 이전 값들을 불러오는 데에는 문제가 없다. 이 포인터를 cursor라고 부른다.
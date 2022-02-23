---
title: "(번역) 타입스크립트를 활용한 5가지 리팩터링 팁"
date: "2022-02-01T18:00:00"
description: "TypeScript를 이용한 리팩터링 아이디어를 얻고 싶어서 아래 글을 읽어 보다가 번역했다."
categories: [typescript]
comments: true
---

- TypeScript를 이용한 리팩터링 아이디어를 얻고 싶어서 아래 글을 읽어보다가 번역했다.

    [Top 5 techniques in TypeScript to bring your code to the next level.](https://obaranovskyi.medium.com/top-5-techniques-in-typescript-to-bring-your-code-to-the-next-level-6f20be543b39)
- 글을 읽으면서 JS에도 적용 가능한 내용이라 생각했고 댓글에도 나처럼 생각한 사람들이 있다.
- 예시들이 전부 TypeScript 문법을 쓰고 있기 때문에 TypeScript를 활용했다고 하는 것이며, 문법을 빼거나 대체할 수 있다면 JavaScript 프로젝트에도 적용할 수 있는 패턴들이다.

우리 모두는 더 좋은 코드 퀄리티를 제공하기 위해 시간과 열정을 들이지만, 언제나 개선의 여지가 존재한다. 
내가 반년 전 작성한 코드를 들여보고 있노라면, 개선시킬 방법이 생각나지 않는다. 
두가지 이유가 있다고 생각한다. 내가 성장하지 못했거나, 이미 잘 짜여 있거나. 
당신이 나와 비슷한 상황이거나 코드 품질을 중시한다면 공감할 것이다. 
그동안 당신이 몰랐던, 주기적으로 사용할 수 있는 몇가지 새로운 테크닉에 대해 탐구해보자.

## 1. ‘includes’와 selector function을 활용한 validation 개선

### 문제

하나의 property를 같은 Type을 가진 여러개의 값들과 비교하고, 그 중 하나라도 일치하면 true를 return하는 함수를 만든다고 하자.

```tsx
enum UserStatus {
  Administrator = 1,
  Author = 2,
  Contributor = 3,
  Editor = 4,
  Subscriber = 5,
}

interface User {
  firstName: string;
  lastName: string;
  status: UserStatus;
}

function isEditActionAvailable(user: User): boolean {
  return (
    user.status === UserStatus.Administrator ||
    user.status === UserStatus.Author ||
    user.status === UserStatus.Editor
  );
```

### 개선 방법

배열 메서드 중 `includes`를 사용해보자. 아래처럼 접근하면 조건문이 더욱 깔끔해진다.

```tsx
const EDIT_ROLES = [
  UserStatus.Administrator,
  UserStatus.Author,
  UserStatus.Editor,
];

function isEditActionAvailable(user: User): boolean {
  return EDIT_ROLES.includes(user.status);
}
```

그러나, 여기에도 개선점이 있다.

첫 째로, 함수 내에 하드코딩된 데이터를 포함해야 한다. 아니면 다른 방식으로 상수값을 넣어줘야한다. (EDIT_ROLES)

둘 째는, 위에서 정의한 수정 외에 다른 권한(role)을 추가로 체크하는 함수를 또 만들고 싶다면?

selector 함수 및 role list 데이터를 받는 factory 함수를 만들어보자.

이 함수는 또 다른 함수를 반환한다. 반환하는 함수는 user 데이터를 받아서 이 user의 status(property)와 상위에서 인자로 받은 role list를 비교한다.

```tsx
function roleCheck<D, T>(
  selector: (data: D) => T,
  roles: T[]
): (value: D) => boolean {
  return (value: D) => roles.includes(selector(value));
}

const isEditActionAvailable = roleCheck(
  (user: User) => user.status,
  EDIT_ROLES
);
```

위 방식으로, 함수 내 데이터들을 쪼개 기능적 측면에서 개선했고, 재사용이 가능해졌다.

얼마나 쉽게 다른 role을 체크하는 함수를 추가할 수 있게 되었는지 확인해보자.

```tsx
const ADD_ROLES = [
  UserStatus.Administrator,
  UserStatus.Author
];

const isAddActionAvailable = roleCheck(
  (user: User) => user.status,
  ADD_ROLES
);
```

잠깐 생각해보자. 여기서 우리는 selector 함수의 필요성에 대해서 의문을 느끼고 있을 것이다.

selector 함수의 도움으로 다른 필드를 선택하는 것이 가능하다.

User가 리드, 매니저 등 직책(team status)을 가지고 있고, 이를 체크해야한다고 가정하자. 이런 요구사항을 반영하는 가드함수를 더 추가할 필요가 없다. 만들어둔 `roleCheck` 함수를 재활용하면 되기 때문이다.

```tsx
enum TeamStatus {
    Lead = 1,
    Manager = 2,
    Developer = 3
}

const MANAGER_OR_LEAD = [
    TeamStatus.Lead,
    TeamStatus.Manager
];

const isManagerOrLead = roleCheck(
  (user: User) => user.teamStatus,
  MANAGER_OR_LEAD
);
```

## 2. 캡슐화한 분기 코드에 콜백 사용하기

### 문제

작은 차이 외엔 거의 유사한 함수들을 많이 만들어 봤을 것이다. 중복되는 코드들을 제거해보자.

```tsx
async function createUser(user: User): Promise<void> {
  LoadingService.startLoading();
  await userHttpClient.createUser(user);
  LoadingService.stopLoading();
  UserGrid.reloadData();
}

async function updateUser(user: User): Promise<void> {
  LoadingService.startLoading();
  await userHttpClient.updateUser(user); // 이부분만 다르다.
  LoadingService.stopLoading();
  UserGrid.reloadData();
}
```

### 해결 방법

달라지는 부분의 코드를 추출해서 콜백으로 넘겨주는 방식으로 중복을 제거할 수 있다.

```tsx
async function makeUserAction(fn: Function): Promise<void> {
  LoadingService.startLoading();
  await fn();
  LoadingService.stopLoading();
  UserGrid.reloadData();
}

async function createUser2(user: User): Promise<void> {
  makeUserAction(() => userHttpClient.createUser(user));
}

async function updateUser2(user: User): Promise<void> {
  makeUserAction(() => userHttpClient.updateUser(user));
}
```

## 3. 조건 술부 컴비네이터

### 문제

아래의 함수들은 확인해야할 조건이 많고, 책임질 게 많다.

```tsx
enum UserRole {
  Administrator = 1,
  Editor = 2,
  Subscriber = 3,
  Writer = 4,
}

interface User {
  username: string;
  age: number;
  role: UserRole;
}

const users = [
  { username: "John", age: 25, role: UserRole.Administrator },
  { username: "Jane", age: 7, role: UserRole.Subscriber },
  { username: "Liza", age: 18, role: UserRole.Writer },
  { username: "Jim", age: 16, role: UserRole.Editor },
  { username: "Bill", age: 32, role: UserRole.Editor },
];

const greaterThan17AndWriterOrEditor = users.filter(
  (user: User2) =>
    user.age > 17 &&
    (user.role === UserRole.Writer || user.role === UserRole.Editor)
);

const greaterThan5AndSubscriberOrWriter = users.filter(
  (user: User2) => user.age > 5 && user.role === UserRole.Writer
);
```

### 해결 방법

조건 술부들을 결합하는 컴비네이터를 만들어서 코드 가독성과 재사용성을 제고해보자.

```tsx
type PredicateFn = (value: any, index?: number) => boolean;
type ProjectionFn = (value: any, index?: number) => any;

function or(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.some((predicate) => predicate(value));
}

function and(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.every((predicate) => predicate(value));
}

function not(...predicates: PredicateFn[]): PredicateFn {
  return (value) => predicates.every((predicate) => !predicate(value));
}
```

컴비네이터를 적용해보자.

```tsx
const isWriter = (user: User) => user.role === UserRole.Writer;
const isEditor = (user: User) => user.role === UserRole.Editor;
const isGreaterThan17 = (user: User) => user.age > 17;
const isGreaterThan5 = (user: User) => user.age > 5;

const greaterThan17AndWriterOrEditor = users.filter(
  and(isGreaterThan17, or(isWriter, isEditor))
);

const greaterThan5AndSubscriberOrWriter = users.filter(
  and(isGreaterThan5, isWriter)
);
```

## 4. 컴비네이터를 factory로 개선하기

### 문제

술부 컴비네이터가 너무 많은 변수들을 생성하게 되면 함수들 사이에서 길을 잃게된다. 단 한 번만 컴비네이터 함수를 사용한다면 더욱 범용적일 것이다.

### 해결 방법

컴비네이터 factory를 만들어볼 것이다. 몇 부분만 추가해보자.

```tsx
const isRole = (role: UserRole) => 
  (user: User) => user.role === role;

const isGreaterThan = (age: number) =>
  (user: User) => user.age > age;

const greaterThan17AndWriterOrEditor = users.filter(
  and(isGreaterThan(17), or(isRole(UserRole.writer), isRole(UserRole.Editor)))
);

const greaterThan5AndSubscriberOrWriter = users.filter(
  and(isGreaterThan(5), isRole(UserRole.Writer)
);
```

반복도 줄이고, 코드를 깔끔하게 유지할 수 있다.

## 5. class 캡슐화 알고리즘

### 문제

아래의 클래스는 너무 많은 책임을 가지고 있다. 알고리즘 로직과 관련이 있어야하는데 그러지 않고 있다.

```tsx
class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public signUpDate: Date
  ) {}

  getFormattedUserDetails(): string {
    const formattedSignUpDate = `${this.signUpDate.getFullYear()}-${this.signUpDate.getMonth() + 1}-${this.signUpDate.getDate()}`;
    const username = `${this.firstName.charAt(0)}${this.lastName}`.toLowerCase();

    return `
        First name: ${this.firstName},
        Last name: ${this.lastName},
        Sign up date: ${formattedSignUpDate},
        Username: ${username}
    `;
  }
}

const user = new User("John", "Doe", new Date());
console.log(user.getFormattedUserDetails());
```

### 개선

User의 data model 내부에 저 method(`getFormattedUserDetails`)가 있으면 안된다.

따라서, 우리의 임무는 책임을 분산하는 것이다. 알고리즘을 분리해서 class내부에 캡슐화해야 한다.

```tsx
interface User {
    firstName: string,
    lastName: string,
    signUpDate: Date
}

class UserDetailsFormatter {
  constructor(private user: User) {}

  format(): string {
    const { firstName, lastName } = this.user;

    return `
        First name: ${firstName},
        Last name: ${lastName},
        Sign up date: ${this.getFormattedSignUpDate()},
        Username: ${this.getUsername()}
    `;
  }

  private getUsername(): string {
    const { firstName, lastName } = this.user;

    return `${firstName.charAt(0)}${lastName}`.toLowerCase();
  }

  private getFormattedSignUpDate(): string {
    const signUpDate = this.user.signUpDate;

    return [
      signUpDate.getFullYear(),
      signUpDate.getMonth() + 1,
      signUpDate.getDate(),
    ].join("-");
  }
}

const user = { firstName: "John", lastName: "Doe", signUpDate: new Date() };
const userFormatter = new UserDetailsFormatter(user);
console.log(userFormatter.format());
```


## 번역하면서 느낀점

- 1번 방식처럼 확장 가능성을 고려하면서 함수 설계를 하면 유지 보수에 아주 좋을 것 같다!
- 어쩔 수 없이 복잡한 조건문을 써야한다면... 3,4번은 util화해서 사용하면 코드가 훨씬 깔끔해질 것 같다.

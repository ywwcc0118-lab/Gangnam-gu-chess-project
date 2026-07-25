# 강남구 체스연맹 홈페이지

강남구 체스연맹 홈페이지 제작 프로젝트입니다.
연맹 소개, 공지사항, 엘리트 선수단, 청소년위원회, 회원 혜택을 한눈에 볼 수 있도록 구성했습니다.

모든 페이지에서 동일한 디자인과 메뉴를 사용할 수 있도록 Header와 Footer를 별도의 HTML 파일로 분리해 공통으로 관리합니다.

---

## 프로젝트 목적

이 홈페이지는 강남구 체스연맹의 활동을 소개하고, 공지사항과 대회 이력을 쉽게 관리하기 위해 제작되었습니다.

주요 목적은 다음과 같습니다.

* 강남구 체스연맹 소개
* 엘리트 선수단 및 대회 이력 안내
* 청소년위원회 활동 소개
* 회원 혜택 안내
* 공지사항 및 뉴스 전달
* 제목과 날짜를 이용한 공지사항 검색
* Google Sheet를 활용한 데이터 관리
* 공통 Header와 Footer를 이용한 전체 페이지 통합 관리

---

## 사용 기술

* HTML
* CSS
* JavaScript
* Fetch API
* Google Sheets
* Google Apps Script
* GitHub Pages

---

## 파일 구조

```txt
Homepage_Gangnam/
├── index.html
├── about.html
├── elite.html
├── youth.html
├── benefits.html
├── notice.html
├── style.css
├── script.js
├── README.md
├── components/
│   ├── header.html
│   └── footer.html
├── images/
│   ├── logo.png
│   ├── first_page.jpg
│   ├── elite.jpeg
│   ├── elite_2.jpg
│   ├── info.jpg
│   ├── notices.jpg
│   ├── sudan.png
│   ├── youth_1.jpg
│   ├── youth_2.jpg
│   └── qr.png
└── notices/
    ├── chess_insight.jpg
    ├── family.jpg
    ├── sudan_third.jpg
    └── youth_competition.jpg
```

---

## 공통 Header와 Footer

홈페이지의 Header와 Footer는 모든 페이지에 같은 코드를 반복해서 작성하지 않고 별도의 파일로 분리했습니다.

공통 컴포넌트 파일은 다음과 같습니다.

```txt
components/header.html
components/footer.html
```

### `components/header.html`

홈페이지 상단의 공통 Header를 관리합니다.

포함 내용:

* 강남구 체스연맹 로고
* 홈페이지 이름
* 공지 페이지 링크
* 소개 페이지 링크
* 엘리트 선수단 페이지 링크
* 청소년위원회 페이지 링크
* 회원 혜택 페이지 링크
* 소식 보기 버튼
* 현재 페이지 메뉴 활성화 표시

Header의 로고, 메뉴 이름 또는 링크를 변경하면 모든 페이지에 동일하게 적용됩니다.

### `components/footer.html`

홈페이지 하단의 공통 Footer를 관리합니다.

포함 내용:

* 강남구 체스연맹 로고
* 영문 연맹 이름
* 주소
* 전화번호
* 이메일
* Instagram 링크
* 카카오톡 채널 링크
* 저작권 연도

Footer의 주소, 연락처 또는 소셜 미디어 링크를 변경하면 모든 페이지에 동일하게 적용됩니다.

### 공통 컴포넌트 적용 방식

각 HTML 페이지에는 Header와 Footer가 표시될 위치만 작성합니다.

```html
<div id="site-header"></div>

<main>
  페이지별 내용
</main>

<div id="site-footer"></div>
```

`script.js`는 페이지가 열리면 Fetch API를 사용해 다음 파일을 불러옵니다.

```txt
components/header.html
components/footer.html
```

불러온 Header와 Footer는 각 페이지의 `#site-header`, `#site-footer` 영역에 자동으로 삽입됩니다.

따라서 Header나 Footer를 수정할 때 모든 HTML 파일을 각각 수정할 필요가 없습니다.

예를 들어 메뉴 이름을 변경하려면 다음 파일만 수정하면 됩니다.

```txt
components/header.html
```

연락처나 소셜 미디어 링크를 변경하려면 다음 파일만 수정하면 됩니다.

```txt
components/footer.html
```

---

## 페이지 구성

### `index.html`

홈페이지 메인 화면입니다.

포함 내용:

* 공통 Header
* 메인 소개
* 최신 공지사항
* 연맹 소개 미리보기
* 엘리트 선수단 미리보기
* 청소년위원회 미리보기
* 회원 혜택 미리보기
* 관련 기관 안내
* 공통 Footer

---

### `about.html`

강남구 체스연맹 소개 페이지입니다.

포함 내용:

* 공통 Header
* 연맹 소개
* 유소년 육성
* 성인 동호회 활성화
* 지역사회 교류
* 체스 교육 및 대회 운영
* 공통 Footer

---

### `elite.html`

엘리트 선수단 소개 페이지입니다.

포함 내용:

* 공통 Header
* 엘리트 선수단 소개
* 전문 전략 훈련 방향
* 대회 이력
* 공통 Footer

대회 이력은 Google Sheet와 연동되어 자동으로 업데이트됩니다.

---

### `youth.html`

청소년위원회 소개 페이지입니다.

포함 내용:

* 공통 Header
* 청소년위원회 소개
* 청소년 자치 활동
* 지역사회 활동
* 남수단 기금 모금 활동
* 공통 Footer

---

### `benefits.html`

회원 혜택 안내 페이지입니다.

포함 내용:

* 공통 Header
* 회원 혜택 소개
* 대회 참여 기회
* 교육 및 훈련 기회
* 커뮤니티 활동
* QR 코드 안내
* 공통 Footer

QR 코드는 `benefits.html`에 있으며, 바로가기 버튼이 있어 사용자가 편리하게 관련 채널로 이동할 수 있습니다.

---

### `notice.html`

공지사항 전체 페이지입니다.

포함 내용:

* 공통 Header
* Google Sheet 기반 공지사항 목록
* 날짜 최신순 정렬
* 게시판 형태 디자인
* 페이지네이션
* 외부 링크 연결
* 공지 제목 검색
* 공지 날짜 검색
* 제목과 날짜를 함께 사용하는 통합 검색
* 검색 결과 개수 표시
* 검색 조건 초기화
* 공통 Footer

사용자는 공지 제목의 일부를 입력해 원하는 공지를 찾을 수 있습니다.
날짜를 선택하면 해당 날짜에 등록된 공지만 확인할 수 있습니다.

제목과 날짜를 모두 입력하면 두 조건을 모두 만족하는 공지만 표시됩니다.
검색 결과가 여러 페이지인 경우 검색된 공지 목록을 기준으로 페이지네이션이 적용됩니다.

---

## 디자인 방향

전체 디자인은 강남구 체스연맹 로고 색상을 기준으로 제작했습니다.

* 메인 컬러: 파란색
* 포인트 컬러: 빨간색
* 배경 컬러: 흰색
* 카드형 레이아웃 사용
* 반응형 디자인 적용
* 데스크톱 및 모바일 검색창 디자인 적용
* 모든 페이지에 동일한 Header와 Footer 적용
* 현재 페이지 메뉴 강조 표시
* Header 스크롤 그림자 효과 적용

---

## Google Sheet 연동

이 프로젝트는 Google Sheet와 Apps Script를 사용해 데이터를 관리합니다.
HTML을 직접 수정하지 않아도 Google Sheet에서 내용을 바꾸면 홈페이지에 반영됩니다.

공지사항 검색은 Google Sheet에서 불러온 데이터를 기준으로 브라우저에서 처리됩니다.
따라서 별도의 검색 서버 없이 제목과 날짜를 이용해 공지를 빠르게 찾을 수 있습니다.

---

## 공지사항 Google Sheet

공지사항은 `notice.html`과 `index.html`에서 사용됩니다.

* 홈페이지: 최신 공지 4개 표시
* 공지 페이지: 전체 공지 표시
* 날짜 최신순 정렬
* 이미지와 외부 링크 지원
* 제목을 이용한 공지 검색
* 날짜를 이용한 공지 검색
* 제목과 날짜 동시 검색
* 검색 결과 페이지네이션 지원

공지사항 API:

```txt
https://script.google.com/macros/s/AKfycbwSLSHgC4OfUcj4-z-3AdQGLY5qEnrtlTDyFnbzY3qRJgxwWqZ8zlGlxRK1CyWvB-ip/exec
```

---

## 공지사항 검색 방식

공지사항 검색 기능은 `notice.html`, `script.js`, `style.css`에 구현되어 있습니다.

### 제목 검색

공지 제목의 전체 문장을 입력하지 않아도 일부 글자만으로 검색할 수 있습니다.

예시:

```txt
검색어: 대회
```

제목에 `대회`가 포함된 공지사항이 모두 표시됩니다.

### 날짜 검색

날짜 입력창에서 특정 날짜를 선택하면 해당 날짜의 공지만 표시됩니다.

예시:

```txt
2026-07-25
```

### 제목과 날짜 동시 검색

제목과 날짜를 모두 입력하면 두 조건을 동시에 만족하는 공지만 표시됩니다.

예시:

```txt
제목: 대회
날짜: 2026-07-25
```

### 검색 초기화

초기화 버튼을 누르면 입력한 제목과 날짜가 삭제되며 전체 공지 목록이 다시 표시됩니다.

### 검색 결과 페이지네이션

검색 결과가 한 페이지에 표시되는 개수를 초과하면 검색된 공지 목록을 기준으로 페이지 번호가 생성됩니다.

페이지를 이동해도 검색 조건은 유지되며 전체 공지 목록으로 갑자기 변경되지 않습니다.

---

## 엘리트 선수단 대회 이력 Google Sheet

`elite.html`의 대회 이력은 Google Sheet에서 불러옵니다.

엘리트 대회 이력 API:

```txt
https://script.google.com/macros/s/AKfycbwv24W3Xb30jmXvfOEsu1UQ6EbYpjhvT6OgOQScZhokv7OsXQYNGz-v1noNYJZB-UjH/exec
```

Google Sheet 열 구성:

| Category | event name                          | date                  | location  | achievement               | players       |
| -------- | ----------------------------------- | --------------------- | --------- | ------------------------- | ------------- |
| Kadet    | FIDE World Cadet Championships 2025 | 2025년 9월 18일 - 10월 1일 | 카자흐스탄 알마티 | 유소년 국제대회 출전 및 세계 무대 경험 확보 | 설영준 및 엘리트 선수단 |

---

## 대회 이력 표시 방식

대회 이력 카테고리는 고정되어 있습니다.

```txt
Olympiad
Kadet
League
```

각 카테고리에서는 가장 최신 대회 1개만 표시됩니다.

예를 들어 `Kadet` 카테고리에 여러 대회가 있어도 날짜가 가장 최근인 대회만 화면에 표시됩니다.

---

## 날짜 형식

대회 이력의 날짜 형식은 반드시 아래 형식으로 입력합니다.

```txt
2026년 5월 14일 - 5월 19일
```

형식은 다음과 같습니다.

```txt
YYYY년 M월 D일 - M월 D일
```

예시:

```txt
2024년 9월 10일 - 9월 23일
2025년 9월 18일 - 10월 1일
2026년 3월 7일 - 5월 30일
```

공지사항 날짜 검색에서는 Google Sheet에서 받은 날짜를 `YYYY-MM-DD` 형식으로 변환해 사용자가 선택한 날짜와 비교합니다.

---

## 주요 JavaScript 기능

`script.js`에서 담당하는 기능입니다.

### 공통 페이지 기능

* 공통 Header 불러오기
* 공통 Footer 불러오기
* 기존 Header와 Footer를 공통 컴포넌트로 교체
* 현재 페이지 메뉴 활성화
* Footer 저작권 연도 자동 표시
* Header 스크롤 그림자 효과
* 페이지 내부 링크 부드러운 스크롤

### 공지사항 기능

* 공지사항 불러오기
* 공지사항 최신순 정렬
* 홈페이지 최신 공지 4개 표시
* 공지 페이지 페이지네이션
* 공지 제목 검색
* 공지 날짜 검색
* 제목과 날짜 동시 검색
* 검색 결과 개수 표시
* 검색 결과가 없을 때 안내 문구 표시
* 검색 조건 초기화
* 검색 결과 기준 페이지네이션
* 공지 카드 가로 스크롤

### 엘리트 선수단 기능

* 엘리트 선수단 대회 이력 불러오기
* 대회 이력 데이터 형식 정리
* 대회 날짜 변환
* 카테고리별 최신 대회 1개 표시

### 기타 기능

* QR 코드 바로가기 버튼 연결
* 외부 링크 안전 처리
* HTML 특수문자 처리

---

## QR 코드

QR 코드는 `benefits.html`에 있습니다.

QR 코드 이미지는 아래 파일을 사용합니다.

```txt
images/qr.png
```

QR 코드 섹션에는 바로가기 버튼이 함께 있어 사용자가 더 편리하게 관련 페이지나 채널로 이동할 수 있습니다.

---

## Header와 Footer 수정 방법

### Header 메뉴 수정

모든 페이지의 메뉴를 수정하려면 다음 파일을 수정합니다.

```txt
components/header.html
```

예를 들어 메뉴 이름이나 링크를 변경하면 모든 페이지에 자동으로 반영됩니다.

### Footer 정보 수정

주소, 전화번호, 이메일 또는 소셜 미디어 링크를 수정하려면 다음 파일을 수정합니다.

```txt
components/footer.html
```

각 페이지의 HTML 파일에서 Header와 Footer 코드를 직접 수정할 필요가 없습니다.

### 새 페이지에 Header와 Footer 적용

새 HTML 페이지를 만들 때 `<body>` 안에 다음 구조를 추가합니다.

```html
<body>
  <div id="site-header"></div>

  <main>
    새 페이지 내용
  </main>

  <div id="site-footer"></div>

  <script defer src="script.js"></script>
</body>
```

`script.js`가 Header와 Footer를 자동으로 불러옵니다.

---

## 완료된 작업

* 전체 페이지 구조 제작
* 메인 페이지 제작
* 소개 페이지 제작
* 엘리트 선수단 페이지 제작
* 청소년위원회 페이지 제작
* 회원 혜택 페이지 제작
* 공지사항 페이지 제작
* Header 별도 파일 분리
* Footer 별도 파일 분리
* 전체 페이지 공통 Header 적용
* 전체 페이지 공통 Footer 적용
* 현재 페이지 메뉴 활성화 기능 적용
* Footer 저작권 연도 자동 표시
* 로고 적용
* 반응형 CSS 적용
* 공지사항 Google Sheet 연동
* 공지사항 제목 검색 기능 구현
* 공지사항 날짜 검색 기능 구현
* 제목과 날짜 동시 검색 기능 구현
* 공지사항 검색 초기화 기능 구현
* 검색 결과 개수 표시 기능 구현
* 검색 결과 페이지네이션 기능 구현
* 검색 결과 없음 안내 기능 구현
* 모바일 공지 검색창 디자인 적용
* 엘리트 대회 이력 Google Sheet 연동
* 카테고리별 최신 대회 표시 기능 적용
* QR 코드 섹션 추가
* QR 코드 바로가기 버튼 추가
* Instagram 링크 추가
* 카카오톡 채널 링크 추가

---

## 실행 방법

공통 Header와 Footer는 Fetch API로 불러오기 때문에 HTML 파일을 컴퓨터에서 직접 더블클릭해 실행하면 정상적으로 표시되지 않을 수 있습니다.

Google Sheet와 Apps Script 데이터, 공통 Header와 Footer를 정상적으로 불러오려면 VS Code의 Live Server를 사용합니다.

```txt
1. VS Code에서 프로젝트 폴더 열기
2. Live Server 확장 프로그램 설치
3. index.html 파일에서 마우스 오른쪽 버튼 클릭
4. Open with Live Server 클릭
5. 브라우저에서 홈페이지 확인
6. 각 페이지에서 같은 Header와 Footer가 표시되는지 확인
```

정상적인 실행 주소 예시:

```txt
http://127.0.0.1:5500/index.html
```

다음과 같은 `file://` 주소에서는 공통 컴포넌트가 불러와지지 않을 수 있습니다.

```txt
file:///C:/Homepage_Gangnam/index.html
```

---

## 배포 방법

GitHub Pages를 사용해 배포할 수 있습니다.

```txt
1. 프로젝트 파일을 GitHub 저장소에 업로드
2. GitHub 저장소로 이동
3. Settings 클릭
4. Pages 클릭
5. 배포할 Branch를 main으로 설정
6. 저장 경로를 root로 설정
7. Save 클릭
```

배포가 완료된 뒤 각 페이지에서 공통 Header와 Footer가 정상적으로 표시되는지 확인합니다.

확인할 내용:

```txt
1. 메인 페이지 Header와 Footer 확인
2. 소개 페이지 Header와 Footer 확인
3. 엘리트 선수단 페이지 Header와 Footer 확인
4. 청소년위원회 페이지 Header와 Footer 확인
5. 회원 혜택 페이지 Header와 Footer 확인
6. 공지 페이지 Header와 Footer 확인
7. Header 메뉴 이동 확인
8. 현재 페이지 메뉴 활성화 확인
9. 제목 검색이 정상적으로 작동하는지 확인
10. 날짜 검색이 정상적으로 작동하는지 확인
11. 제목과 날짜 동시 검색 확인
12. 초기화 버튼 확인
13. 검색 결과 페이지 이동 확인
14. 모바일 화면 검색창 확인
```

---

## 프로젝트 요약

강남구 체스연맹 홈페이지는 HTML, CSS, JavaScript로 제작한 정적 웹사이트입니다.

Header와 Footer는 별도의 컴포넌트 파일로 분리되어 있으며, JavaScript의 Fetch API를 사용해 모든 페이지에 공통으로 적용됩니다.

따라서 메뉴, 로고, 연락처 또는 소셜 미디어 링크를 수정할 때 각 페이지를 하나씩 변경할 필요 없이 공통 컴포넌트 파일만 수정하면 됩니다.

공지사항과 엘리트 선수단 대회 이력은 Google Sheet와 Apps Script를 통해 관리되며 홈페이지에 자동으로 반영됩니다.

공지사항 페이지에서는 사용자가 제목 또는 날짜로 원하는 공지를 검색할 수 있습니다.
제목과 날짜를 함께 입력하는 통합 검색과 검색 결과 페이지네이션도 지원합니다.

QR 코드는 `benefits.html`에 배치되어 있으며, 바로가기 버튼을 통해 사용자가 편리하게 관련 채널로 이동할 수 있습니다.

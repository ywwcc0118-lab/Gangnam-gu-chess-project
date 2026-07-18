# 강남구 체스연맹 홈페이지

강남구 체스연맹 홈페이지 제작 프로젝트입니다.  
연맹 소개, 공지사항, 엘리트 선수단, 청소년위원회, 회원 혜택을 한눈에 볼 수 있도록 구성했습니다.

---

## 프로젝트 목적

이 홈페이지는 강남구 체스연맹의 활동을 소개하고, 공지사항과 대회 이력을 쉽게 관리하기 위해 제작되었습니다.

주요 목적은 다음과 같습니다.

- 강남구 체스연맹 소개
- 엘리트 선수단 및 대회 이력 안내
- 청소년위원회 활동 소개
- 회원 혜택 안내
- 공지사항 및 뉴스 전달
- Google Sheet를 활용한 데이터 관리

---

## 사용 기술

- HTML
- CSS
- JavaScript
- Google Sheets
- Google Apps Script
- GitHub Pages

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

## 페이지 구성

### `index.html`

홈페이지 메인 화면입니다.

포함 내용:

- 메인 소개
- 최신 공지사항
- 연맹 소개 미리보기
- 엘리트 선수단 미리보기
- 청소년위원회 미리보기
- 회원 혜택 미리보기
- 관련 기관 안내

---

### `about.html`

강남구 체스연맹 소개 페이지입니다.

포함 내용:

- 연맹 소개
- 유소년 육성
- 성인 동호회 활성화
- 지역사회 교류
- 체스 교육 및 대회 운영

---

### `elite.html`

엘리트 선수단 소개 페이지입니다.

포함 내용:

- 엘리트 선수단 소개
- 전문 전략 훈련 방향
- 대회 이력

대회 이력은 Google Sheet와 연동되어 자동으로 업데이트됩니다.

---

### `youth.html`

청소년위원회 소개 페이지입니다.

포함 내용:

- 청소년위원회 소개
- 청소년 자치 활동
- 지역사회 활동
- 남수단 기금 모금 활동

---

### `benefits.html`

회원 혜택 안내 페이지입니다.

포함 내용:

- 회원 혜택 소개
- 대회 참여 기회
- 교육 및 훈련 기회
- 커뮤니티 활동
- QR 코드 안내

QR 코드는 `benefits.html`에 있으며, 바로가기 버튼이 있어 사용자가 편리하게 관련 채널로 이동할 수 있습니다.

---

### `notice.html`

공지사항 전체 페이지입니다.

포함 내용:

- Google Sheet 기반 공지사항 목록
- 날짜 최신순 정렬
- 게시판 형태 디자인
- 페이지네이션
- 외부 링크 연결

---

## 디자인 방향

전체 디자인은 강남구 체스연맹 로고 색상을 기준으로 제작했습니다.

- 메인 컬러: 파란색
- 포인트 컬러: 빨간색
- 배경 컬러: 흰색
- 카드형 레이아웃 사용
- 반응형 디자인 적용

---

## Google Sheet 연동

이 프로젝트는 Google Sheet와 Apps Script를 사용해 데이터를 관리합니다.  
HTML을 직접 수정하지 않아도 Google Sheet에서 내용을 바꾸면 홈페이지에 반영됩니다.

---

## 공지사항 Google Sheet

공지사항은 `notice.html`과 `index.html`에서 사용됩니다.

- 홈페이지: 최신 공지 4개 표시
- 공지 페이지: 전체 공지 표시
- 날짜 최신순 정렬
- 이미지와 외부 링크 지원

공지사항 API:

```txt
https://script.google.com/macros/s/AKfycbwSLSHgC4OfUcj4-z-3AdQGLY5qEnrtlTDyFnbzY3qRJgxwWqZ8zlGlxRK1CyWvB-ip/exec
```

---

## 엘리트 선수단 대회 이력 Google Sheet

`elite.html`의 대회 이력은 Google Sheet에서 불러옵니다.

엘리트 대회 이력 API:

```txt
https://script.google.com/macros/s/AKfycbwv24W3Xb30jmXvfOEsu1UQ6EbYpjhvT6OgOQScZhokv7OsXQYNGz-v1noNYJZB-UjH/exec
```

Google Sheet 열 구성:

| Category | event name | date | location | achievement | players |
|---|---|---|---|---|---|
| Kadet | FIDE World Cadet Championships 2025 | 2025년 9월 18일 - 10월 1일 | 카자흐스탄 알마티 | 유소년 국제대회 출전 및 세계 무대 경험 확보 | 설영준 및 엘리트 선수단 |

---

## 대회 이력 표시 방식

대회 이력 카테고리는 고정되어 있습니다.

```txt
Olympiad
Kadet
League
```

각 카테고리에서는 가장 최신 대회 1개만 표시됩니다.

예를 들어 `Kadet` 카테고리에 여러 대회가 있어도, 날짜가 가장 최근인 대회만 화면에 표시됩니다.

---

## 날짜 형식

대회 이력의 날짜 형식은 반드시 아래 형식으로 입력합니다.

```txt
2026년 5월 14일 - 5월 19일
```

즉, 형식은 다음과 같습니다.

```txt
YYYY년 M월 D일 - M월 D일
```

예시:

```txt
2024년 9월 10일 - 9월 23일
2025년 9월 18일 - 10월 1일
2026년 3월 7일 - 5월 30일
```

---

## 주요 JavaScript 기능

`script.js`에서 담당하는 기능입니다.

- 공지사항 불러오기
- 공지사항 최신순 정렬
- 홈페이지 최신 공지 4개 표시
- 공지 페이지 페이지네이션
- 엘리트 선수단 대회 이력 불러오기
- 카테고리별 최신 대회 1개 표시
- QR 코드 바로가기 버튼 연결
- 공지 카드 가로 스크롤
- Header 스크롤 그림자 효과

---

## QR 코드

QR 코드는 `benefits.html`에 있습니다.

QR 코드 이미지는 아래 파일을 사용합니다.

```txt
images/qr.png
```

QR 코드 섹션에는 바로가기 버튼이 함께 있어 사용자가 더 편리하게 관련 페이지나 채널로 이동할 수 있습니다.

---

## 완료된 작업

- 전체 페이지 구조 제작
- 메인 페이지 제작
- 소개 페이지 제작
- 엘리트 선수단 페이지 제작
- 청소년위원회 페이지 제작
- 회원 혜택 페이지 제작
- 공지사항 페이지 제작
- 공통 header / footer 제작
- 로고 적용
- 반응형 CSS 적용
- 공지사항 Google Sheet 연동
- 엘리트 대회 이력 Google Sheet 연동
- 카테고리별 최신 대회 표시 기능 적용
- QR 코드 섹션 추가
- QR 코드 바로가기 버튼 추가
- Instagram 링크 추가
- 카카오톡 채널 링크 추가

---

## 실행 방법

브라우저에서 `index.html` 파일을 열면 실행할 수 있습니다.

VS Code에서는 Live Server를 사용하면 편리합니다.

```txt
1. VS Code에서 프로젝트 폴더 열기
2. Live Server 실행
3. index.html 열기
```

---

## 배포 방법

GitHub Pages를 사용해 배포할 수 있습니다.

```txt
1. GitHub 저장소로 이동
2. Settings 클릭
3. Pages 클릭
4. Branch를 main으로 설정
5. Save 클릭
```

---

## 프로젝트 요약

강남구 체스연맹 홈페이지는 HTML, CSS, JavaScript로 제작한 정적 웹사이트입니다.

공지사항과 엘리트 선수단 대회 이력은 Google Sheet와 Apps Script를 통해 관리되며, 홈페이지에 자동으로 반영됩니다.

QR 코드는 `benefits.html`에 배치되어 있으며, 바로가기 버튼을 통해 사용자가 편리하게 관련 채널로 이동할 수 있습니다.

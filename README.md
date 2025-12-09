# 시끌벅적 놀이터 FE
> 익명 커뮤니티 게시판의 프런트엔드. Express 정적 서버로 HTML/CSS/JS를 서빙하고, 백엔드 API와 연동해 글/댓글/회원 기능을 제공합니다.

## 프로젝트 개요
- GitHub: https://github.com/JI1047/3-haaland-kim-community-FE
- 목표: 게시글 목록/상세, 댓글, 좋아요, 회원 관리(로그인·프로필·비밀번호 변경·탈퇴)를 웹에서 제공
- 기술: Node.js(Express 5), Vanilla JS, SweetAlert2, Toast UI(커스텀), Jest+Supertest(헬스체크)

## 설치 및 실행
1. 의존성 설치  
   `npm install`
2. 개발 서버 (자동 리로드)  
   `npm run dev` → http://localhost:3000
3. 프로덕션 스타일 실행  
   `npm start`
4. 테스트  
   `npm test` (샌드박스 포트 권한이 필요할 수 있음)

## 사용 방법
1. `npm run dev`로 서버 실행 후 브라우저에서 접속
2. 게시글 목록: `/getPostList`  
   - 글 작성: 로그인 시 “+ 게시글 작성” 버튼
3. 게시글 상세: `/getPost?id={postId}`  
   - 좋아요, 댓글 작성/수정/삭제, 본인 글이면 수정·삭제
4. 회원 관련  
   - 프로필/비번 수정: `/getUser`, `/updateUserProfile`, `/updateUserPassword`  
   - 회원가입: `/signup`, 로그인: `/login`, 탈퇴: `/getUser` → SweetAlert 확인
5. 환경: `/env.js`에서 `window.BACKEND_URL` 주입(기본 `https://haaland-community.site`); fetch는 `credentials: "include"` 사용

## 프로젝트 기간
- 2024년 진행(리포지토리 기준). 실제 일정이 다르면 이 섹션을 업데이트하세요.

## 팀원 및 역할
- Frontend: @JI1047 (리포지토리 소유자)  
- Backend/DevOps: 별도 레포지토리 운영. 팀 구성이 다르면 해당 섹션을 보완해주세요.

## 마크다운 예시(참조)
1. 숫자 목록 예) 1. 메인화면 2. 현장 구매 3. 예매내역 조회  
2. 글머리 기호 예) `-`, `*`, `+`  
3. 인용 예) `> 첫번째 인용`  
4. 줄바꿈 예) 문장 끝에 공백 2개 또는 `<br>`  
5. 이미지 예) `![Alt text](/path/to/img.jpg)` 또는 `<img width="" alt="" src="">`

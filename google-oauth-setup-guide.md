# Google OAuth 웹 애플리케이션 클라이언트 생성 가이드

## 문제 상황

OAuth 클라이언트 ID를 편집할 때 "승인된 리디렉션 URI" 항목이 보이지 않는 경우
→ **애플리케이션 유형이 "웹 애플리케이션"이 아닙니다!**

## 해결 방법: 웹 애플리케이션 OAuth 클라이언트 새로 생성

### 1. Google Cloud Console 접속

[https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)

### 2. OAuth 동의 화면 설정 확인 (처음인 경우)

**API 및 서비스** → **OAuth 동의 화면** → 다음 설정:

- **User Type**: External (외부)
- **앱 이름**: 프로젝트 이름
- **사용자 지원 이메일**: 본인 이메일
- **개발자 연락처 정보**: 본인 이메일
- **저장 및 계속**

### 3. 새 OAuth 클라이언트 ID 생성

1. **API 및 서비스** → **사용자 인증 정보** 페이지로 이동

2. 상단의 **+ 사용자 인증 정보 만들기** 버튼 클릭

3. **OAuth 클라이언트 ID** 선택

4. **애플리케이션 유형** 드롭다운에서 **웹 애플리케이션** 선택 ⭐

5. 다음 정보 입력:

#### 이름

```
Privy Web Application
```

#### 승인된 JavaScript 원본 (선택사항)

**+ URI 추가** 버튼을 클릭하여 추가:

```
http://localhost:3000
https://your-app-domain.vercel.app
```

#### 승인된 리디렉션 URI (필수!)

**+ URI 추가** 버튼을 클릭하여 다음 URI들을 **하나씩** 추가:

```
https://auth.privy.io/api/v1/oauth/callback
```

로컬 개발용 (선택사항):

```
http://localhost:3000
http://localhost:3000/api/auth/callback
```

6. **만들기** 버튼 클릭

### 4. 클라이언트 ID와 시크릿 복사

생성 완료 후 팝업에 표시되는 정보 복사:

```
클라이언트 ID: 1234567890-abcdefghijklmnop.apps.googleusercontent.com
클라이언트 보안 비밀번호: GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

⚠️ **중요**: 이 정보는 나중에도 확인 가능하지만, 지금 복사해두는 것을 권장합니다.

### 5. Privy Dashboard에 등록

1. [https://dashboard.privy.io](https://dashboard.privy.io) 접속

2. 프로젝트 선택

3. 왼쪽 메뉴: **Settings** → **Login methods**

4. **Google** 섹션 찾기

5. **Enable Google** 토글 활성화

6. 입력 필드에 복사한 정보 붙여넣기:

   - **Client ID**: Google에서 복사한 클라이언트 ID
   - **Client Secret**: Google에서 복사한 클라이언트 시크릿

7. **Save** 또는 **Update** 버튼 클릭

### 6. 테스트

1. 변경 사항이 반영되도록 **2-3분 대기**

2. 브라우저 캐시 삭제:

   - Chrome/Edge: `Ctrl + Shift + Delete`
   - 쿠키 및 캐시된 데이터 삭제

3. 애플리케이션 접속하여 Google 로그인 테스트

4. 시크릿/인코그니토 창에서도 테스트 권장

## 체크리스트

- [ ] Google Cloud Console에서 프로젝트 선택 확인
- [ ] OAuth 동의 화면 설정 완료 (처음인 경우)
- [ ] **웹 애플리케이션** 타입으로 OAuth 클라이언트 생성
- [ ] Privy redirect URI 추가: `https://auth.privy.io/api/v1/oauth/callback`
- [ ] 로컬 개발용 URI 추가: `http://localhost:3000`
- [ ] 클라이언트 ID와 시크릿 복사
- [ ] Privy Dashboard에 클라이언트 ID/시크릿 등록
- [ ] 2-3분 대기 후 캐시 삭제
- [ ] Google 로그인 테스트

## 자주 발생하는 문제

### 문제 1: "승인된 리디렉션 URI" 항목이 없음

**원인**: 애플리케이션 유형이 "웹 애플리케이션"이 아님
**해결**: 위 가이드대로 새로운 "웹 애플리케이션" OAuth 클라이언트 생성

### 문제 2: redirect_uri_mismatch 에러 지속

**원인**: Privy의 정확한 redirect URI가 등록되지 않음
**해결**: `https://auth.privy.io/api/v1/oauth/callback` 정확히 추가 (끝에 슬래시 없음)

### 문제 3: Access blocked: Authorization Error

**원인**: OAuth 동의 화면 미설정 또는 앱이 검토 중
**해결**: OAuth 동의 화면에서 테스트 사용자 추가 또는 "게시 상태"를 "테스트"로 설정

### 문제 4: Invalid client error

**원인**: Privy에 등록한 클라이언트 ID가 잘못됨
**해결**: Google Cloud Console에서 클라이언트 ID 재확인 및 Privy에 다시 등록

## 추가 참고 사항

### Privy의 실제 Redirect URI 확인 방법

브라우저 개발자 도구 (F12) → Network 탭:

1. Google 로그인 시도
2. `accounts.google.com` 요청 확인
3. Query Parameters에서 `redirect_uri` 값 확인
4. 해당 URI를 Google Cloud Console에 정확히 추가

### 일반적인 Privy Redirect URI 패턴

```
# 기본 Privy Auth 엔드포인트
https://auth.privy.io/api/v1/oauth/callback

# 또는 (Privy 버전에 따라)
https://auth.privy.io/oauth/callback
https://auth.privy.io/api/v1/oauth/google/callback
```

⚠️ **주의**: Privy Dashboard의 Google 설정 페이지에 정확한 redirect URI가 표시되므로 반드시 확인하세요!

## 완료!

위 단계를 모두 완료하면 Google 로그인이 정상 작동합니다. 🎉

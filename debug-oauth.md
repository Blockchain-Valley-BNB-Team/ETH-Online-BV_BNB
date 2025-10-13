# Google OAuth redirect_uri_mismatch 디버깅 가이드

## 에러 메시지에서 실제 URI 확인하기

1. **브라우저 개발자 도구 열기** (F12 또는 Ctrl+Shift+I)

2. **Network 탭** 확인:

   - Google 로그인 시도
   - 실패한 요청 찾기
   - Request URL에서 `redirect_uri` 파라미터 값 확인

3. **에러 페이지 확인**:

   - Google 에러 페이지에 표시되는 내용:

     ```
     Error 400: redirect_uri_mismatch

     The redirect URI in the request: https://actual-redirect-uri.com/callback

     does not match the ones authorized for the OAuth client.
     ```

4. **실제 사용된 redirect_uri를 Google Cloud Console에 추가**

## Privy 사용 시 일반적인 redirect URI 패턴

```
# 프로덕션 (Privy 기본)
https://auth.privy.io/api/v1/oauth/callback
https://auth.privy.io/api/v1/oauth/google/callback

# 로컬 개발
http://localhost:3000
http://localhost:3000/api/auth/callback/google

# Vercel/배포 환경
https://your-domain.vercel.app
https://your-domain.vercel.app/api/auth/callback/google
```

## Privy 설정 확인 사항

### 1. Privy Dashboard 설정

- 프로젝트 Settings → Login methods → Google
- "Enabled" 상태 확인
- Client ID, Client Secret 올바르게 입력되었는지 확인

### 2. Google Cloud Console 설정

- OAuth 2.0 클라이언트 ID 타입: **웹 애플리케이션**
- 승인된 JavaScript 원본:
  ```
  http://localhost:3000
  https://your-domain.vercel.app
  ```
- 승인된 리디렉션 URI:
  ```
  https://auth.privy.io/api/v1/oauth/callback
  https://auth.privy.io/api/v1/oauth/google/callback
  http://localhost:3000
  http://localhost:3000/api/auth/callback/google
  https://your-domain.vercel.app
  https://your-domain.vercel.app/api/auth/callback/google
  ```

### 3. 환경 변수 확인

- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy 앱 ID가 올바른지 확인
- Privy Dashboard에서 동일한 프로젝트의 Google OAuth 설정을 사용하는지 확인

## 문제 해결 체크리스트

- [ ] Privy Dashboard에서 Google 로그인 활성화 확인
- [ ] Google Cloud Console에서 Privy redirect URI 추가 완료
- [ ] 로컬 개발용 URI도 추가 (http://localhost:3000)
- [ ] Google OAuth 설정 저장 후 몇 분 대기 (전파 시간 필요)
- [ ] 브라우저 캐시 삭제 및 새로고침
- [ ] 시크릿 창에서 다시 시도

## 추가 참고 자료

- [Privy Google OAuth 문서](https://docs.privy.io/guide/guides/oauth/google)
- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)

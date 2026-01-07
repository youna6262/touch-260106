# Netlify 배포 가이드

이 프로젝트를 GitHub와 연동하여 Netlify에 배포하는 방법을 안내합니다.

## 📋 사전 준비사항

1. GitHub 계정
2. Netlify 계정 (https://www.netlify.com)
3. 프로젝트가 GitHub 저장소에 푸시되어 있어야 함

## 🚀 배포 단계

### 1단계: GitHub에 프로젝트 푸시

```bash
# Git 저장소 초기화 (아직 안 했다면)
git init

# 원격 저장소 추가
git remote add origin https://github.com/사용자명/저장소명.git

# 파일 추가 및 커밋
git add .
git commit -m "Initial commit: Netlify 배포 준비"

# GitHub에 푸시
git push -u origin main
```

### 2단계: Netlify에서 새 사이트 생성

1. **Netlify 대시보드 접속**
   - https://app.netlify.com 접속
   - 로그인 또는 회원가입

2. **"Add new site" → "Import an existing project" 클릭**

3. **GitHub 연동**
   - "GitHub" 선택
   - GitHub 인증 및 권한 승인
   - 저장소 선택

4. **빌드 설정**
   - **Build command**: `npm run build` (자동 감지됨)
   - **Publish directory**: `dist` (자동 감지됨)
   - `netlify.toml` 파일이 있으면 자동으로 설정을 읽어옵니다

5. **"Deploy site" 클릭**

### 3단계: 배포 확인

- 배포가 완료되면 자동으로 생성된 URL이 표시됩니다
- 예: `https://your-site-name.netlify.app`
- 배포 상태는 "Published"로 표시됩니다

## ⚙️ 설정 파일 설명

### `netlify.toml`

프로젝트 루트에 있는 `netlify.toml` 파일은 다음을 설정합니다:

- **빌드 명령어**: `npm run build`
- **배포 디렉토리**: `dist`
- **SPA 리다이렉트**: 모든 경로를 `index.html`로 리다이렉트 (React Router 등 사용 시 필요)

## 🔄 자동 배포

GitHub에 푸시하면 자동으로 배포됩니다:

- `main` 브랜치에 푸시 → 프로덕션 사이트 자동 배포
- Pull Request 생성 → 미리보기 배포 자동 생성

## 🌿 브랜치별 배포 설정

Netlify 대시보드에서:
1. **Site settings** → **Build & deploy** → **Continuous Deployment**
2. 브랜치별 빌드 설정 가능
   - Production branch: `main`
   - Branch deploys: 모든 브랜치 또는 특정 브랜치만

## 🔧 환경 변수 설정

필요한 경우 Netlify 대시보드에서 환경 변수를 설정할 수 있습니다:

1. **Site settings** → **Environment variables**
2. 변수 추가 (예: API 키, 환경 설정 등)

## 📝 커스텀 도메인 연결

1. **Site settings** → **Domain management**
2. **Add custom domain** 클릭
3. 도메인 입력 및 DNS 설정 안내 따르기

## 🐛 문제 해결

### 빌드 실패 시

1. **Netlify 로그 확인**
   - Deploy log에서 에러 메시지 확인
   - 일반적인 원인:
     - 의존성 설치 실패 → `package.json` 확인
     - 빌드 명령어 오류 → `netlify.toml` 확인
     - Node 버전 불일치 → `netlify.toml`에 Node 버전 명시

2. **로컬에서 빌드 테스트**
   ```bash
   npm install
   npm run build
   ```
   로컬에서 빌드가 성공하는지 확인

### SPA 라우팅 문제

- `netlify.toml`에 리다이렉트 설정이 포함되어 있습니다
- 모든 경로가 `index.html`로 리다이렉트되어 React Router 등이 정상 작동합니다

## 📚 추가 리소스

- [Netlify 공식 문서](https://docs.netlify.com/)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html#netlify)





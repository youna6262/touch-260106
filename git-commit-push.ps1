# Git 커밋 및 푸시 스크립트
# 프로젝트 디렉토리로 이동
$projectPath = "C:\Users\USER\OneDrive - 서울신대림초등학교\문서\GIthub\touch-260106"
Set-Location $projectPath

# Git 저장소 초기화 (이미 있으면 무시됨)
if (-not (Test-Path .git)) {
    git init
    git branch -M main
}

# 변경사항 확인
Write-Host "=== Git 상태 확인 ===" -ForegroundColor Cyan
git status

# 파일 추가
Write-Host "`n=== 파일 추가 ===" -ForegroundColor Cyan
git add -A

# 커밋
Write-Host "`n=== 커밋 ===" -ForegroundColor Cyan
git commit -m "결과 공유 페이지 UX 개선: 카드형 레이아웃, 상태 시각화, Step UI, 버튼 스타일"

# 원격 저장소 확인 및 푸시
Write-Host "`n=== 원격 저장소 확인 ===" -ForegroundColor Cyan
$remote = git remote -v
if ($remote) {
    Write-Host "원격 저장소: $remote" -ForegroundColor Green
    Write-Host "`n=== 푸시 ===" -ForegroundColor Cyan
    git push origin main
} else {
    Write-Host "원격 저장소가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host "다음 명령으로 원격 저장소를 추가하세요:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/사용자명/저장소명.git" -ForegroundColor Yellow
    Write-Host "git push -u origin main" -ForegroundColor Yellow
}

Write-Host "`n완료!" -ForegroundColor Green

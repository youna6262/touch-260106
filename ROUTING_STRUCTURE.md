# 웹앱 플로우 및 라우팅 구조

## 전체 플로우 개요

이 웹앱은 **단일 페이지 애플리케이션(SPA)**으로, 네비게이션 메뉴를 통해 섹션 간 이동이 가능합니다.

## 섹션 구조

### 1️⃣ 망한 수업 자랑하기 (`failed-section`)
- **목적**: 실패한 수업 경험을 공유하고 함께 성장
- **기능**: 
  - 수업 실패 경험 작성
  - 공유하기 버튼 (향후 확장 가능)
- **라우팅**: `#failed-section` 또는 네비게이션 메뉴 클릭

### 2️⃣ PICRAT 진단 (`picrat-section`)
- **목적**: 수업의 PICRAT 코드를 진단하고 이유 작성
- **기능**:
  - PICRAT 코드 선택 (PR, PA, PT, IR, IA, IT, CR, CA, CT)
  - 핵심 활동 키워드 입력
  - PICRAT 이유 자동 생성
- **라우팅**: `#picrat-section` 또는 네비게이션 메뉴 클릭

### 3️⃣ As Is → To Be 청사진 (`blueprint-section`)
- **목적**: 현재 수업 분석 및 미래 수업 청사진 작성
- **기능**:
  - **기본 정보**: 수업 주제 입력
  - **As-is (현재 수업 분석)**:
    - 교사 역할, 기술 활용 수준 선택
    - 학생 활동 특성 체크박스
    - 개선 필요점 선택
    - As-is 자동 생성
  - **To-be (미래 수업 청사진)**:
    - 출발점, 핵심 흐름, 산출물 형태 선택
    - 공유/피드백 방식, 과정 점검 도구 선택
    - AI 윤리/출처 성찰 포함 여부
    - To-be 자동 생성
  - **PICRAT**: (2번 섹션과 동일한 기능)
  - **지원 및 필요**: 성장 지원 방안, 역량, 자원 자동 생성
  - **SAMR**: SAMR 단계 선택 및 이유 작성
  - **최종 결과**: 구글 문서 붙여넣기용 텍스트 생성
- **라우팅**: `#blueprint-section` 또는 네비게이션 메뉴 클릭

### 4️⃣ 결과 공유 페이지 (`share-section`) ⭐ 신규
- **목적**: 연수 마지막 나눔·피드백 단계에서 결과 공유
- **기능**:
  - **한 문장 다짐** 입력
  - **카드형 요약 UI**:
    - 🏆 나의 망한 수업 상
    - 🧠 PICRAT 코드
    - 🧩 As Is → To Be 요약
    - 💪 한 문장 다짐
    - 🤖 Cursor AI 프롬프트 (최종 통합)
  - **공유 기능**:
    - 📸 이미지로 저장 (html2canvas 사용)
    - 📋 Cursor 프롬프트 복사
    - 📄 요약 복사
    - 💾 저장 / 📂 불러오기
- **라우팅**: `#share-section` 또는 네비게이션 메뉴 클릭

## 네비게이션 구조

```
┌─────────────────────────────────────────────────┐
│  [🏆 망한 수업] [🧠 PICRAT] [🧩 청사진] [📤 공유] │
└─────────────────────────────────────────────────┘
```

- 상단 고정 네비게이션 바
- 현재 활성 섹션 하이라이트
- 클릭 시 해당 섹션으로 부드럽게 스크롤

## 데이터 흐름

### State 관리
- 모든 입력 데이터는 React `useState`로 관리
- `localStorage`에 자동 저장/불러오기 지원
- 저장 키: `blueprint_draft_v1`

### 데이터 구조
```javascript
{
  topic: string,
  asis_teacher: string,
  asis_tech: string,
  asis_student: string[],
  asis_need: string[],
  asis_out: string,
  tobe_start: string,
  tobe_flow: string,
  tobe_product: string,
  tobe_share: string,
  tobe_eval: string,
  ethics: string[],
  tobe_out: string,
  picrat_code: string,
  picrat_focus: string,
  picrat_out: string,
  needs_focus: string,
  needs_env: string,
  support_out: string,
  competency_out: string,
  resource_out: string,
  samr_level: string,
  samr_evidence: string,
  samr_out: string,
  final_out: string,
  commitment: string  // 신규 추가
}
```

## 사용자 여정 (User Journey)

### 기본 플로우
1. **망한 수업 자랑하기** → 실패 경험 공유 (선택)
2. **PICRAT 진단** → 수업 분석 코드 선택 및 이유 작성
3. **As Is → To Be 청사진** → 
   - 현재 수업 분석 (As-is)
   - 미래 수업 설계 (To-be)
   - 지원 및 필요 사항 정리
   - 최종 결과 생성
4. **결과 공유 페이지** → 
   - 한 문장 다짐 작성
   - 카드형 요약 확인
   - 이미지 저장 또는 텍스트 복사
   - 연수에서 공유

### 단축 플로우
- 필요한 섹션만 선택하여 사용 가능
- 예: PICRAT만 진단하거나, 청사진만 작성 후 바로 공유

## 기술 스택

- **프레임워크**: React (Vite)
- **스타일링**: CSS (인라인 스타일 + CSS 파일)
- **이미지 캡처**: html2canvas
- **저장소**: localStorage (브라우저 로컬 저장소)

## 향후 확장 가능성

1. **서버 연동**: 공유 기능을 서버로 확장하여 다른 교사들의 결과 확인
2. **라우터 도입**: React Router를 사용한 URL 기반 라우팅
3. **인증 시스템**: 개인별 결과 관리
4. **템플릿 저장**: 자주 사용하는 설정을 템플릿으로 저장

## 접근성 고려사항

- 섹션 ID를 통한 직접 링크 가능 (`#share-section`)
- 키보드 네비게이션 지원
- 스크린 리더를 위한 시맨틱 HTML 구조



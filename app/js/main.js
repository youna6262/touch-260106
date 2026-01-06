// 메인 라우팅 및 네비게이션 관리
import { surveyModule } from './survey.js';
import { picratModule } from './picrat.js';
import { blueprintModule } from './blueprint.js';
import { shareModule } from './share.js';

// 전역 상태 관리
const appState = {
    currentPage: 'survey',
    surveyResult: null,
    picratResult: null,
    blueprintData: null
};

// 페이지 전환 함수
function switchPage(pageId) {
    // 모든 페이지 숨기기
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 선택한 페이지 표시
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 메뉴 활성화 상태 업데이트
    document.querySelectorAll('.side-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetBtn = document.querySelector(`[data-page="${pageId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
    
    appState.currentPage = pageId;
    
    // 페이지별 초기화
    switch(pageId) {
        case 'survey':
            // surveyModule은 이미 로드됨
            break;
        case 'picrat':
            picratModule.init();
            break;
        case 'blueprint':
            blueprintModule.init();
            break;
        case 'share':
            shareModule.init();
            break;
    }
}

// 메뉴 클릭 이벤트
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.side-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = btn.getAttribute('data-page');
            if (pageId) {
                switchPage(pageId);
            }
        });
    });
    
    // 초기 페이지 로드
    surveyModule.init();
});

// 전역으로 내보내기 (다른 모듈에서 사용)
window.appState = appState;
window.switchPage = switchPage;



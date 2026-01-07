// 모든 모듈 import
import { surveyModule } from './js/survey.js';
import { picratModule } from './js/picrat.js';
import { blueprintModule } from './js/blueprint.js';
import { shareModule } from './js/share.js';

// 전역 상태 관리
const appState = {
    currentPage: 'survey',
    surveyResult: null,
    picratResult: null,
    blueprintData: null
};

// 전역으로 사용할 수 있도록 window에 할당
window.surveyModule = surveyModule;
window.picratModule = picratModule;
window.blueprintModule = blueprintModule;
window.shareModule = shareModule;
window.appState = appState;

window.startTest = () => surveyModule.startTest();
window.answer = (qNum, type) => surveyModule.answer(qNum, type);
window.restart = () => surveyModule.restart();

// 기존 코드는 유지 (다른 모듈에서 사용할 수 있음)
let currentQuestion = 0;
const totalQuestions = 8;
let scores = {
    'explain': 0,
    'tech': 0,
    'tool': 0,
    'time': 0,
    'ai': 0,
    'alone': 0,
    'what': 0,
    'loading': 0
};

const results = {
    'explain': {
        icon: '🗣️',
        title: '설명충상',
        subtitle: '"도구 설명 20분, 본 활동 5분"',
        desc: `<h3>📋 당신의 수업 패턴</h3>
        <p>AI·디지털 도구의 모든 기능을 완벽하게 설명하고 싶은 마음이 앞섰군요! 학생들이 헤매지 않도록 친절하게 안내하려다 보니 정작 활동 시간이 부족해졌습니다.</p>
        <ul>
            <li>도구 설명에 수업 시간의 절반 이상 사용</li>
            <li>학생들의 눈이 점점 풀어지는 것을 목격</li>
            <li>"이제 시작해볼까요?"했더니 종이 침</li>
        </ul>`,
        tip: `<h4>💡 개선 팁</h4>
        <p><strong>"도구 설명 5분, 본 활동 35분"</strong> 원칙을 적용해보세요! 도구 사용법은 3분 영상으로 미리 제작하고, 수업에서는 핵심 버튼 2-3개만 빠르게 안내한 뒤 바로 활동을 시작하세요.</p>`
    },
    'tech': {
        icon: '🔧',
        title: '기술지원상',
        subtitle: '"수업 시간의 절반이 트러블슈팅"',
        desc: `<h3>📋 당신의 수업 패턴</h3>
        <p>로그인 안 됨, 마이크 안 됨, 인터넷 끊김... 수업이 아니라 IT 지원 업무를 하신 것 같네요!</p>
        <ul>
            <li>"선생님, 안 돼요!"가 수업 중 가장 많이 들은 말</li>
            <li>한 학생 문제 해결하면 다른 학생 손이 올라감</li>
            <li>수업 후 탈진 상태</li>
        </ul>`,
        tip: `<h4>💡 개선 팁</h4>
        <p><strong>사전 체크리스트</strong>를 만들어보세요! 수업 전날 로그인 테스트, 당일 아침 인터넷 확인, 그리고 <strong>Plan B</strong>(오프라인 대안 활동)를 항상 준비해두세요.</p>`
    },
    'tool': {
        icon: '🤖',
        title: '도구만능주의상',
        subtitle: '"도구가 수업을 구원해줄 줄 알았더니..."',
        desc: `<h3>📋 당신의 수업 패턴</h3>
        <p>신기한 AI 도구를 발견하고 "이거 수업에 쓰면 대박이겠다!" 싶어서 도입했는데... 도구는 화려했지만 학습 목표와의 연결이 약했습니다.</p>
        <ul>
            <li>도구 선택이 먼저, 학습 목표는 나중</li>
            <li>학생들은 신기해했지만 뭘 배웠는지는 모호</li>
            <li>"재밌었어요!"는 많았지만 학습은 글쎄...</li>
        </ul>`,
        tip: `<h4>💡 개선 팁</h4>
        <p><strong>"이 도구가 왜 필요한가?"</strong>를 먼저 질문하세요! 학습 목표를 먼저 정하고, 그 목표 달성에 도구가 정말 도움이 되는지 판단한 후 도입하세요.</p>`
    },
    'time': {
        icon: '📅',
        title: '다음시간에상',
        subtitle: '"오늘 못한 건 다음에... (흥미 증발)"',
        desc: `<h3>📋 당신의 수업 패턴</h3>
        <p>야심차게 계획한 활동의 절반도 못 끝내고 "다음 시간에 이어서 할게요!"라고 마무리하셨군요. 일주일 뒤, 학생들의 흥미는 이미 증발...</p>
        <ul>
            <li>활동량 > 수업 시간 (과욕)</li>
            <li>"다음 시간에"가 입버릇</li>
            <li>연속성이 끊기면서 학습 효과도 반감</li>
        </ul>`,
        tip: `<h4>💡 개선 팁</h4>
        <p>계획한 활동의 <strong>70%만 수업에 넣으세요!</strong> 나머지 30%는 버퍼 시간입니다. 매 차시가 <strong>완결성</strong>을 갖도록 설계하세요.</p>`
    },
    'ai': {
        icon: '😵',
        title: 'AI이상해요상',
        subtitle: '"선생님, 이거 왜 이래요?"',
        desc: `<h3>📋 당신의 수업 패턴</h3>
        <p>AI가 예상치 못한 답변을 내놓았을 때 학생들도, 선생님도 당황하셨군요! AI 환각(Hallucination) 현상에 대한 대비가 부족했습니다.</p>
        <ul>
            <li>AI가 엉뚱한 답변을 했을 때 즉각 대응 실패</li>
            <li>"AI가 이상해요!" 학생들의 혼란</li>
            <li>AI를 '정답 기계'로 여기는 인식 문제</li>
        </ul>`,
        tip: `<h4>💡 개선 팁</h4>
        <p>수업 전에 <strong>"AI도 틀릴 수 있어요"</strong>를 먼저 안내하세요! AI 환각 현상을 오히려 <strong>비판적 사고 교육의 기회</strong>로 활용할 수 있습니다.</p>`
    },
    'alone': {
        icon: '🎉',
        title: '혼자신난상',
        subtitle: '"나만 신나고 애들은 멍~"',
        desc: `<h3>📋 당신의 수업 패턴</h3>
        <p>새로운 도구에 대한 열정이 넘쳤지만... 그 열정이 학생들에게 전달되지 않았습니다.</p>
        <ul>
            <li>도구 시연할 때 교사만 신남</li>
            <li>학생들은 "언제 우리가 해요?" 표정</li>
            <li>열정과 현실의 온도차</li>
        </ul>`,
        tip: `<h4>💡 개선 팁</h4>
        <p><strong>5분 안에 학생 손에 도구를 쥐어주세요!</strong> 교사가 시연하는 시간을 최소화하고, 학생들이 직접 만져보면서 배우도록 하세요.</p>`
    },
    'what': {
        icon: '🤔',
        title: '그래서뭐했지상',
        subtitle: '"오늘 뭐 배웠어?" "음... 자작자작이요?"',
        desc: `<h3>📋 당신의 수업 패턴</h3>
        <p>수업은 분명히 했는데, 학생들 머릿속에 남은 건 도구 이름뿐! 학습 목표가 도구 사용에 묻혀버렸습니다.</p>
        <ul>
            <li>활동은 했는데 배움이 모호</li>
            <li>학생들이 기억하는 건 도구 이름뿐</li>
            <li>"재밌었다"와 "배웠다"의 괴리</li>
        </ul>`,
        tip: `<h4>💡 개선 팁</h4>
        <p>수업 마무리 5분에 <strong>"오늘 OO를 배웠어요"</strong> 문장 완성 활동을 넣어보세요! 도구가 아닌 <strong>학습 내용</strong>으로 정리하세요.</p>`
    },
    'loading': {
        icon: '⏳',
        title: '로딩왕상',
        subtitle: '"기다리다 수업 끝남"',
        desc: `<h3>📋 당신의 수업 패턴</h3>
        <p>AI 이미지 생성, 영상 렌더링, 파일 업로드... 기다림의 연속이었습니다.</p>
        <ul>
            <li>이미지 한 장 만드는 데 5분</li>
            <li>25명이 동시에 요청하니 서버 과부하</li>
            <li>대기 시간에 집중력 증발</li>
        </ul>`,
        tip: `<h4>💡 개선 팁</h4>
        <p><strong>대기 시간용 미니 활동</strong>을 준비하세요! "AI가 만드는 동안 옆 친구와 OO 토론하기" 같은 활동을 넣으면 기다림도 학습 시간이 됩니다.</p>`
    }
};

function startTest() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('progressText').style.display = 'block';
    document.getElementById('progressBar').style.display = 'block';
    document.getElementById('q1').classList.add('active');
    currentQuestion = 1;
    updateProgress();
}

function answer(qNum, type) {
    // 점수 부여
    switch(qNum) {
        case 1:
            if (type === 'explain') scores.explain += 3;
            if (type === 'none') scores.ai += 1;
            break;
        case 2:
            if (type === 'tech') scores.tech += 3;
            if (type === 'wait') { scores.loading += 2; scores.tech += 1; }
            break;
        case 3:
            if (type === 'tool') scores.what += 3;
            if (type === 'confused') scores.what += 2;
            if (type === 'excited') scores.tool += 1;
            break;
        case 4:
            if (type === 'panic') scores.ai += 2;
            if (type === 'chaos') scores.ai += 3;
            break;
        case 5:
            if (type === 'trend') scores.tool += 3;
            if (type === 'easy') scores.tool += 1;
            if (type === 'student') scores.alone += 1;
            break;
        case 6:
            if (type === 'fail') scores.time += 3;
            if (type === 'rush') scores.time += 1;
            break;
        case 7:
            if (type === 'alone') scores.alone += 3;
            if (type === 'tired') scores.tech += 1;
            break;
        case 8:
            if (type === 'time') scores.explain += 1;
            if (type === 'tool') scores.tool += 1;
            if (type === 'prep') scores.tech += 1;
            break;
    }

    // 다음 질문으로
    document.getElementById('q' + qNum).classList.remove('active');
    
    if (qNum < totalQuestions) {
        currentQuestion = qNum + 1;
        document.getElementById('q' + (qNum + 1)).classList.add('active');
        updateProgress();
    } else {
        showResult();
    }
}

function updateProgress() {
    document.getElementById('currentQ').textContent = currentQuestion;
    const percent = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = percent + '%';
}

function showResult() {
    document.getElementById('progressText').style.display = 'none';
    document.getElementById('progressBar').style.display = 'none';
    
    // 최고 점수 찾기
    let maxScore = 0;
    let resultType = 'tool';
    
    for (let type in scores) {
        if (scores[type] > maxScore) {
            maxScore = scores[type];
            resultType = type;
        }
    }

    if (maxScore === 0) resultType = 'tool';

    const result = results[resultType];
    
    document.getElementById('resultBadge').textContent = result.icon;
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultSubtitle').textContent = result.subtitle;
    document.getElementById('resultDesc').innerHTML = result.desc;
    document.getElementById('resultTip').innerHTML = result.tip;
    
    document.getElementById('resultScreen').classList.add('show');
}

function restart() {
    currentQuestion = 0;
    scores = {
        'explain': 0, 'tech': 0, 'tool': 0, 'time': 0,
        'ai': 0, 'alone': 0, 'what': 0, 'loading': 0
    };
    
    document.getElementById('resultScreen').classList.remove('show');
    for (let i = 1; i <= totalQuestions; i++) {
        document.getElementById('q' + i).classList.remove('active');
    }
    document.getElementById('startScreen').style.display = 'block';
}

// 전역 함수로 export (HTML에서 onclick으로 사용하기 위해)
window.startTest = startTest;
window.answer = answer;
window.restart = restart;

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
  const activeBtn = document.querySelector(`[data-page="${pageId}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
  
  appState.currentPage = pageId;
  
  // 페이지별 초기화
  switch(pageId) {
    case 'survey':
      surveyModule.init();
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

// 전역으로 내보내기
window.switchPage = switchPage;

// 페이지 전환 로직
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.side-btn');
  
  // 초기 페이지 설정
  switchPage('survey');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPage = btn.dataset.page;
      switchPage(targetPage);
    });
  });
});


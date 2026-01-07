// PICRAT 코드와 해설 매핑
const picratDescriptions = {
  PR: {
    code: "PR",
    description: "학생이 주로 시청·청취하며 정보 수용 중심으로 활동합니다. 기술은 기존 활동을 단순히 대체하는 수준입니다."
  },
  PA: {
    code: "PA",
    description: "즉각 피드백/시각화/자동화로 이해와 효율이 높아집니다. 기술이 학습 효율을 증폭시키지만 활동 구조는 유지됩니다."
  },
  PT: {
    code: "PT",
    description: "기술이 학습 경험 자체를 새롭게 구성하도록 설계되었습니다. 기술 없이는 불가능한 새로운 학습 경험이 제공됩니다."
  },
  IR: {
    code: "IR",
    description: "학생의 상호작용은 있으나 활동 형태는 기존 구조를 유지합니다. 기술은 기존 상호작용 방식을 대체합니다."
  },
  IA: {
    code: "IA",
    description: "상호작용이 학습을 확장(증폭)하여 비교·수정·토론이 활발해집니다. 기술이 상호작용의 질과 범위를 증폭시킵니다."
  },
  IT: {
    code: "IT",
    description: "상호작용을 통해 학습 구조가 재구성되어 새로운 활동이 가능해집니다. 기술이 없으면 어려운 새로운 상호작용 방식이 구현됩니다."
  },
  CR: {
    code: "CR",
    description: "학생이 결과물을 만들지만 기존 활동을 기술로 옮긴 수준입니다. 창작 활동은 있으나 기술은 단순 대체 역할입니다."
  },
  CA: {
    code: "CA",
    description: "창작 과정이 더 풍부해지고 산출물의 품질이 향상됩니다. 기술이 창작 능력과 결과물의 질을 증폭시킵니다."
  },
  CT: {
    code: "CT",
    description: "기술이 없으면 어려운 새로운 창작 활동이 가능해집니다. 기술이 학습 경험을 근본적으로 변형하여 새로운 창작 영역을 열어줍니다."
  }
};

// 상태 관리
let selectedQ1 = null;
let selectedQ2 = null;

// DOM 요소
const q1Buttons = document.querySelectorAll('#question1-buttons .option-btn');
const q2Buttons = document.querySelectorAll('#question2-buttons .option-btn');
const resultCard = document.getElementById('result-card');
const resultCode = document.getElementById('result-code');
const resultDescription = document.getElementById('result-description');
const copyBtn = document.getElementById('copy-btn');

// 질문 1 버튼 이벤트
q1Buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // 기존 선택 제거
    q1Buttons.forEach(b => b.classList.remove('selected'));
    // 새 선택
    btn.classList.add('selected');
    selectedQ1 = btn.dataset.value;
    updateResult();
  });
});

// 질문 2 버튼 이벤트
q2Buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // 기존 선택 제거
    q2Buttons.forEach(b => b.classList.remove('selected'));
    // 새 선택
    btn.classList.add('selected');
    selectedQ2 = btn.dataset.value;
    updateResult();
  });
});

// 결과 업데이트
function updateResult() {
  if (selectedQ1 && selectedQ2) {
    const code = selectedQ1 + selectedQ2;
    const data = picratDescriptions[code];
    
    if (data) {
      resultCode.textContent = data.code;
      resultDescription.textContent = data.description;
      resultCard.classList.add('show');
      
      // 결과 카드로 스크롤
      setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }
}

// 복사 기능
copyBtn.addEventListener('click', async () => {
  if (!selectedQ1 || !selectedQ2) {
    showToast('복사할 결과가 없습니다.');
    return;
  }

  const code = selectedQ1 + selectedQ2;
  const data = picratDescriptions[code];
  const textToCopy = `PICRAT 코드: ${data.code}\n\n${data.description}`;

  try {
    await navigator.clipboard.writeText(textToCopy);
    showToast('복사했습니다!');
  } catch (err) {
    // 폴백: 텍스트 영역 사용
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('복사했습니다!');
  }
});

// Toast 메시지
function showToast(message) {
  // 기존 toast 제거
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // 새 toast 생성
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // 표시
  setTimeout(() => {
    toast.classList.remove('hidden');
  }, 10);

  // 제거
  setTimeout(() => {
    toast.classList.add('hidden');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 1500);
}








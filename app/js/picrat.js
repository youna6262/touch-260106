// PICRAT 진단 모듈
export const picratModule = {
    selectedAnswers: [],
    
    questions: [
        {
            id: 1,
            text: '학생들이 기술을 어떻게 사용하나요?',
            options: [
                { text: '교사가 사용하는 것을 지켜본다 (Passive)', value: 'P' },
                { text: '교사의 지시에 따라 사용한다 (Interactive)', value: 'I' },
                { text: '학생이 주도적으로 사용한다 (Creative)', value: 'C' }
            ]
        },
        {
            id: 2,
            text: '기술이 수업에 어떤 영향을 미치나요?',
            options: [
                { text: '기존 수업을 대체한다 (Replacement)', value: 'R' },
                { text: '기존 수업을 개선한다 (Amplification)', value: 'A' },
                { text: '기존 수업을 변형한다 (Transformation)', value: 'T' }
            ]
        }
    ],
    
    results: {
        'PR': {
            code: 'PR',
            name: 'Passive Replacement',
            description: '기술이 기존 수업을 단순히 대체하고, 학생들은 수동적으로 관찰만 합니다.',
            improvement: '학생들이 직접 기술을 사용할 수 있도록 기회를 제공하세요.'
        },
        'PA': {
            code: 'PA',
            name: 'Passive Amplification',
            description: '기술이 수업을 개선하지만, 학생들은 여전히 수동적입니다.',
            improvement: '학생 참여를 높이는 상호작용 활동을 추가하세요.'
        },
        'PT': {
            code: 'PT',
            name: 'Passive Transformation',
            description: '기술이 수업을 변형하지만, 학생 참여는 부족합니다.',
            improvement: '학생들이 능동적으로 기술을 활용할 수 있는 과제를 설계하세요.'
        },
        'IR': {
            code: 'IR',
            name: 'Interactive Replacement',
            description: '학생들이 기술을 사용하지만, 기존 수업 방식을 단순히 대체합니다.',
            improvement: '기술을 활용해 학습 효과를 증대시키는 방법을 모색하세요.'
        },
        'IA': {
            code: 'IA',
            name: 'Interactive Amplification',
            description: '학생들이 기술을 사용하고, 수업 효과가 개선됩니다.',
            improvement: '더 창의적이고 변형적인 활용 방법을 시도해보세요.'
        },
        'IT': {
            code: 'IT',
            name: 'Interactive Transformation',
            description: '학생들이 기술을 활용해 수업이 근본적으로 변형됩니다.',
            improvement: '학생들이 스스로 기술을 창의적으로 활용할 수 있는 환경을 조성하세요.'
        },
        'CR': {
            code: 'CR',
            name: 'Creative Replacement',
            description: '학생들이 창의적으로 기술을 사용하지만, 기존 수업을 대체하는 수준입니다.',
            improvement: '기술 활용을 통해 학습 목표를 더 효과적으로 달성하세요.'
        },
        'CA': {
            code: 'CA',
            name: 'Creative Amplification',
            description: '학생들이 창의적으로 기술을 활용하고, 학습 효과가 크게 증대됩니다.',
            improvement: '기술을 통해 학습 경험을 근본적으로 변형시킬 수 있는 방법을 탐색하세요.'
        },
        'CT': {
            code: 'CT',
            name: 'Creative Transformation',
            description: '학생들이 창의적으로 기술을 활용해 수업이 완전히 변형됩니다. 최고 수준!',
            improvement: '이 수준을 유지하고, 다른 교사들과 경험을 공유하세요.'
        }
    },
    
    init() {
        this.selectedAnswers = [null, null];
        this.render();
    },
    
    render() {
        const container = document.getElementById('picrat-content');
        
        container.innerHTML = `
            <div class="picrat-intro">
                <div class="intro-card">
                    <h2>📊 PICRAT 모델이란?</h2>
                    <p>PICRAT는 기술 통합 수업을 평가하는 모델입니다.</p>
                    <div class="picrat-grid">
                        <div class="picrat-axis">
                            <h3>학생 참여도 (P-I-C)</h3>
                            <ul>
                                <li><strong>P (Passive)</strong>: 수동적 - 관찰만 함</li>
                                <li><strong>I (Interactive)</strong>: 상호작용 - 교사 지시에 따라 사용</li>
                                <li><strong>C (Creative)</strong>: 창의적 - 학생이 주도적으로 사용</li>
                            </ul>
                        </div>
                        <div class="picrat-axis">
                            <h3>기술 영향도 (R-A-T)</h3>
                            <ul>
                                <li><strong>R (Replacement)</strong>: 대체 - 기존 수업을 대체</li>
                                <li><strong>A (Amplification)</strong>: 증대 - 기존 수업을 개선</li>
                                <li><strong>T (Transformation)</strong>: 변형 - 수업을 근본적으로 변형</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="picrat-questions" id="picrat-questions"></div>
            <div class="picrat-result" id="picrat-result" style="display:none;"></div>
        `;
        
        this.renderQuestions();
    },
    
    renderQuestions() {
        const container = document.getElementById('picrat-questions');
        container.innerHTML = '';
        
        this.questions.forEach((q, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'picrat-question-card';
            questionCard.id = `picrat-q${q.id}`;
            
            const optionsHtml = q.options.map(opt => 
                `<button class="picrat-option-btn" data-value="${opt.value}" onclick="picratModule.selectAnswer(${q.id}, '${opt.value}', event)">
                    <span class="option-code">${opt.value}</span>
                    <span class="option-text">${opt.text}</span>
                </button>`
            ).join('');
            
            questionCard.innerHTML = `
                <div class="question-header">
                    <span class="question-number">질문 ${q.id}</span>
                </div>
                <div class="question-text">${q.text}</div>
                <div class="picrat-options">${optionsHtml}</div>
            `;
            
            container.appendChild(questionCard);
        });
    },
    
    selectAnswer(qId, value, event) {
        // 기존 선택 제거
        const questionCard = document.getElementById(`picrat-q${qId}`);
        questionCard.querySelectorAll('.picrat-option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // 새 선택 표시
        let clickedBtn = null;
        if (event && event.target) {
            clickedBtn = event.target.closest('.picrat-option-btn');
        }
        if (!clickedBtn) {
            clickedBtn = questionCard.querySelector(`[data-value="${value}"]`);
        }
        if (clickedBtn) {
            clickedBtn.classList.add('selected');
        }
        
        // 답변 저장
        this.selectedAnswers[qId - 1] = value;
        
        // 두 질문 모두 답했으면 결과 표시
        if (this.selectedAnswers.length === 2 && this.selectedAnswers[0] && this.selectedAnswers[1]) {
            this.showResult();
        }
    },
    
    showResult() {
        const code = this.selectedAnswers.join('');
        const result = this.results[code];
        
        if (!result) return;
        
        const container = document.getElementById('picrat-result');
        container.style.display = 'block';
        
        container.innerHTML = `
            <div class="result-card">
                <div class="result-code">${result.code}</div>
                <h2>${result.name}</h2>
                <div class="result-description">
                    <p>${result.description}</p>
                </div>
                <div class="result-improvement">
                    <h3>💡 개선 방향</h3>
                    <p>${result.improvement}</p>
                </div>
                <button class="restart-btn" onclick="picratModule.restart()">다시 진단하기</button>
            </div>
        `;
        
        // 결과를 전역 상태에 저장
        window.appState.picratResult = result;
        
        // 스크롤
        container.scrollIntoView({ behavior: 'smooth' });
    },
    
    restart() {
        this.selectedAnswers = [null, null];
        document.getElementById('picrat-result').style.display = 'none';
        document.querySelectorAll('.picrat-option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }
};

// 전역으로 내보내기
window.picratModule = picratModule;

// PICRAT 진단 모듈
export const picratModule = {
    selectedAnswers: [],
    currentStep: {
        pic: null,  // P, I, C 중 하나
        rat: null   // R, A, T 중 하나
    },
    
    questions: [
        {
            id: 1,
            text: '학생들은 주로 도구를 관찰용/대체용으로만 사용하고 있나요?',
            category: 'pic',
            options: [
                { text: '예 - 교사가 사용하는 것을 지켜본다', value: 'P' },
                { text: '아니오 - 교사의 지시에 따라 사용한다', value: 'I' },
                { text: '아니오 - 학생이 주도적으로 사용한다', value: 'C' }
            ]
        },
        {
            id: 2,
            text: '기술이 수업에 어떤 영향을 미치나요?',
            category: 'rat',
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
        this.currentStep = { pic: null, rat: null };
        this.render();
    },
    
    render() {
        const container = document.getElementById('picrat-content');
        
        container.innerHTML = `
            <!-- 상단 진행 바 (sticky) -->
            <div class="picrat-progress-bar" id="picrat-progress-bar">
                <div class="progress-steps">
                    <div class="progress-step" data-step="P" id="step-P">
                        <div class="step-circle">○</div>
                        <div class="step-label">Passive</div>
                    </div>
                    <div class="progress-connector"></div>
                    <div class="progress-step" data-step="I" id="step-I">
                        <div class="step-circle">○</div>
                        <div class="step-label">Interactive</div>
                    </div>
                    <div class="progress-connector"></div>
                    <div class="progress-step" data-step="C" id="step-C">
                        <div class="step-circle">○</div>
                        <div class="step-label">Creative</div>
                    </div>
                </div>
                <div class="progress-indicator" id="progress-indicator">
                    <span>진단 진행 중...</span>
                </div>
            </div>

            <!-- 메인 컨텐츠 영역 -->
            <div class="picrat-main-layout">
                <!-- 좌측: 질문 카드 영역 -->
                <div class="picrat-questions-container">
                    <div class="picrat-questions" id="picrat-questions"></div>
                    <div class="picrat-result" id="picrat-result" style="display:none;"></div>
                </div>

                <!-- 우측: PICRAT 매트릭스 패널 (고정) -->
                <div class="picrat-matrix-panel">
                    <div class="matrix-header">
                        <h3>PICRAT 매트릭스</h3>
                        <p class="matrix-subtitle">현재 수업 위치</p>
                    </div>
                    <div class="matrix-axis-labels">
                        <div class="axis-label-top">Creative</div>
                        <div class="axis-label-left">Replace</div>
                        <div class="axis-label-center">Amplify</div>
                        <div class="axis-label-right">Transform</div>
                        <div class="axis-label-bottom">Passive</div>
                    </div>
                    <div class="picrat-matrix" id="picrat-matrix">
                        <!-- 첫 번째 열: Replacement -->
                        <div class="matrix-col">
                            <div class="matrix-cell" data-code="CR">
                                <div class="cell-code">CR</div>
                                <div class="cell-label">Creative<br>Replacement</div>
                            </div>
                            <div class="matrix-cell" data-code="IR">
                                <div class="cell-code">IR</div>
                                <div class="cell-label">Interactive<br>Replacement</div>
                            </div>
                            <div class="matrix-cell" data-code="PR">
                                <div class="cell-code">PR</div>
                                <div class="cell-label">Passive<br>Replacement</div>
                            </div>
                        </div>
                        <!-- 두 번째 열: Amplification -->
                        <div class="matrix-col">
                            <div class="matrix-cell" data-code="CA">
                                <div class="cell-code">CA</div>
                                <div class="cell-label">Creative<br>Amplification</div>
                            </div>
                            <div class="matrix-cell" data-code="IA">
                                <div class="cell-code">IA</div>
                                <div class="cell-label">Interactive<br>Amplification</div>
                            </div>
                            <div class="matrix-cell" data-code="PA">
                                <div class="cell-code">PA</div>
                                <div class="cell-label">Passive<br>Amplification</div>
                            </div>
                        </div>
                        <!-- 세 번째 열: Transformation -->
                        <div class="matrix-col">
                            <div class="matrix-cell" data-code="CT">
                                <div class="cell-code">CT</div>
                                <div class="cell-label">Creative<br>Transformation</div>
                            </div>
                            <div class="matrix-cell" data-code="IT">
                                <div class="cell-code">IT</div>
                                <div class="cell-label">Interactive<br>Transformation</div>
                            </div>
                            <div class="matrix-cell" data-code="PT">
                                <div class="cell-code">PT</div>
                                <div class="cell-label">Passive<br>Transformation</div>
                            </div>
                        </div>
                    </div>
                    <div class="matrix-legend">
                        <div class="legend-item">
                            <div class="legend-color current"></div>
                            <span>현재 위치</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.renderQuestions();
        this.updateProgressBar();
    },
    
    renderQuestions() {
        const container = document.getElementById('picrat-questions');
        container.innerHTML = '';
        
        this.questions.forEach((q, index) => {
            const questionCard = document.createElement('div');
            questionCard.className = 'picrat-question-card';
            questionCard.id = `picrat-q${q.id}`;
            if (index === 0) {
                questionCard.classList.add('active');
            }
            
            const optionsHtml = q.options.map(opt => {
                const isSelected = this.currentStep[q.category] === opt.value;
                return `
                    <button class="picrat-option-btn ${isSelected ? 'selected' : ''}" 
                            data-value="${opt.value}" 
                            onclick="picratModule.selectAnswer(${q.id}, '${opt.value}', '${q.category}', event)">
                        <span class="option-radio">${isSelected ? '●' : '○'}</span>
                        <span class="option-text">${opt.text}</span>
                    </button>
                `;
            }).join('');
            
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
    
    selectAnswer(qId, value, category, event) {
        // 기존 선택 제거
        const questionCard = document.getElementById(`picrat-q${qId}`);
        questionCard.querySelectorAll('.picrat-option-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.querySelector('.option-radio').textContent = '○';
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
            clickedBtn.querySelector('.option-radio').textContent = '●';
        }
        
        // 답변 저장
        this.currentStep[category] = value;
        this.selectedAnswers[qId - 1] = value;
        
        // 카드 강조 효과
        questionCard.classList.add('answered');
        
        // 진행 바 업데이트
        this.updateProgressBar();
        
        // 매트릭스 업데이트
        this.updateMatrix();
        
        // 다음 카드로 스크롤
        setTimeout(() => {
            const nextCard = document.getElementById(`picrat-q${qId + 1}`);
            if (nextCard) {
                nextCard.classList.add('active');
                nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
        
        // 두 질문 모두 답했으면 결과 표시
        if (this.currentStep.pic && this.currentStep.rat) {
            setTimeout(() => {
                this.showResult();
            }, 500);
        }
    },
    
    updateProgressBar() {
        const steps = ['P', 'I', 'C'];
        const currentPic = this.currentStep.pic;
        
        steps.forEach((step, index) => {
            const stepElement = document.getElementById(`step-${step}`);
            const circle = stepElement.querySelector('.step-circle');
            
            if (currentPic) {
                const stepIndex = steps.indexOf(currentPic);
                if (index < stepIndex) {
                    // 완료된 단계
                    circle.textContent = '●';
                    circle.classList.add('completed');
                    stepElement.classList.remove('current');
                } else if (index === stepIndex) {
                    // 현재 단계
                    circle.textContent = '●';
                    circle.classList.add('current');
                    stepElement.classList.add('current');
                } else {
                    // 미진행 단계
                    circle.textContent = '○';
                    circle.classList.remove('completed', 'current');
                    stepElement.classList.remove('current');
                }
            } else {
                // 아직 선택 안됨
                if (index === 0) {
                    circle.textContent = '○';
                    stepElement.classList.add('current');
                } else {
                    circle.textContent = '○';
                    stepElement.classList.remove('current');
                }
                circle.classList.remove('completed', 'current');
            }
        });
        
        // 진행 인디케이터 업데이트
        const indicator = document.getElementById('progress-indicator');
        if (currentPic) {
            const stepNames = { 'P': 'Passive', 'I': 'Interactive', 'C': 'Creative' };
            indicator.innerHTML = `<span>현재: <strong>${stepNames[currentPic]}</strong></span>`;
        } else {
            indicator.innerHTML = '<span>진단 진행 중...</span>';
        }
    },
    
    updateMatrix() {
        // 모든 셀에서 하이라이트 제거
        document.querySelectorAll('.matrix-cell').forEach(cell => {
            cell.classList.remove('current-position');
        });
        
        // 현재 위치 하이라이트
        if (this.currentStep.pic && this.currentStep.rat) {
            const code = this.currentStep.pic + this.currentStep.rat;
            const cell = document.querySelector(`[data-code="${code}"]`);
            if (cell) {
                cell.classList.add('current-position');
            }
        }
    },
    
    showResult() {
        const code = this.currentStep.pic + this.currentStep.rat;
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
        this.currentStep = { pic: null, rat: null };
        document.getElementById('picrat-result').style.display = 'none';
        document.querySelectorAll('.picrat-option-btn').forEach(btn => {
            btn.classList.remove('selected');
            btn.querySelector('.option-radio').textContent = '○';
        });
        document.querySelectorAll('.picrat-question-card').forEach(card => {
            card.classList.remove('answered', 'active');
        });
        document.getElementById('picrat-q1').classList.add('active');
        this.updateProgressBar();
        this.updateMatrix();
    }
};

// 전역으로 내보내기
window.picratModule = picratModule;

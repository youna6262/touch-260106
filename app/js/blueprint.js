// As Is → To Be 청사진 설계 모듈
export const blueprintModule = {
    blueprintData: {
        asIs: {
            learningGoal: '',
            currentMethod: '',
            problem: '',
            studentReaction: ''
        },
        toBe: {
            learningGoal: '',
            newMethod: '',
            expectedEffect: '',
            actionPlan: ''
        }
    },
    
    init() {
        this.loadSavedData();
        this.render();
        this.updateProgress();
    },
    
    updateProgress() {
        // As Is 진행률 계산
        const asIsFields = Object.values(this.blueprintData.asIs);
        const asIsCompleted = asIsFields.filter(v => v.trim() !== '').length;
        const asIsProgress = Math.round((asIsCompleted / asIsFields.length) * 100);
        
        // To Be 진행률 계산
        const toBeFields = Object.values(this.blueprintData.toBe);
        const toBeCompleted = toBeFields.filter(v => v.trim() !== '').length;
        const toBeProgress = Math.round((toBeCompleted / toBeFields.length) * 100);
        
        // 메뉴에 진행 상태 표시
        const menuBtn = document.querySelector('[data-page="blueprint"]');
        if (menuBtn) {
            const progressText = menuBtn.querySelector('.progress-indicator');
            if (progressText) {
                progressText.textContent = `[As Is ${asIsProgress}%] [To Be ${toBeProgress}%]`;
            } else {
                const progressEl = document.createElement('span');
                progressEl.className = 'progress-indicator';
                progressEl.textContent = `[As Is ${asIsProgress}%] [To Be ${toBeProgress}%]`;
                menuBtn.appendChild(progressEl);
            }
        }
    },
    
    render() {
        const container = document.getElementById('blueprint-content');
        
        container.innerHTML = `
            <!-- 히어로 영역 -->
            <div class="blueprint-hero">
                <div class="hero-icon">🧩</div>
                <h1 class="hero-title">As Is → To Be 수업 청사진 설계</h1>
                <p class="hero-description">현재 수업을 돌아보고, 더 나은 수업으로 바꾸는 설계 단계입니다</p>
            </div>
            
            <div class="blueprint-container">
                <!-- As Is 섹션 -->
                <div class="blueprint-card as-is-card">
                    <div class="card-header">
                        <h2 class="card-title">📄 As Is (현재 수업)</h2>
                        <p class="card-subtitle">지금 수업의 모습</p>
                    </div>
                    
                    <div class="form-group">
                        <div class="question-header">
                            <span class="question-number">①</span>
                            <div class="question-content">
                                <h3 class="question-title">학습 목표는 무엇이었나요?</h3>
                                <p class="question-hint">지금 수업에서 학생들이 무엇을 배우도록 했나요?</p>
                            </div>
                        </div>
                        <div class="hint-card">
                            <span class="hint-icon">💡</span>
                            <span class="hint-text">예시: AI 도구를 사용해 창의적 글쓰기 활동 진행</span>
                        </div>
                        <textarea 
                            id="as-is-goal" 
                            class="form-input as-is-input" 
                            rows="4"
                            oninput="blueprintModule.updateData('asIs', 'learningGoal', this.value); blueprintModule.updateProgress();"
                        >${this.blueprintData.asIs.learningGoal}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="question-header">
                            <span class="question-number">②</span>
                            <div class="question-content">
                                <h3 class="question-title">어떤 방법으로 수업했나요?</h3>
                                <p class="question-hint">수업 진행 방식과 활동 내용을 기록하세요</p>
                            </div>
                        </div>
                        <div class="hint-card">
                            <span class="hint-icon">💡</span>
                            <span class="hint-text">예시: 챗GPT를 사용해 글쓰기 활동 진행</span>
                        </div>
                        <textarea 
                            id="as-is-method" 
                            class="form-input as-is-input" 
                            rows="4"
                            oninput="blueprintModule.updateData('asIs', 'currentMethod', this.value); blueprintModule.updateProgress();"
                        >${this.blueprintData.asIs.currentMethod}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="question-header">
                            <span class="question-number">③</span>
                            <div class="question-content">
                                <h3 class="question-title">어떤 문제가 있었나요?</h3>
                                <p class="question-hint">수업 중 발생한 문제점이나 아쉬운 점을 솔직하게 기록하세요</p>
                            </div>
                        </div>
                        <div class="hint-card">
                            <span class="hint-icon">💡</span>
                            <span class="hint-text">예시: 도구 설명에 시간이 너무 많이 걸렸다</span>
                        </div>
                        <textarea 
                            id="as-is-problem" 
                            class="form-input as-is-input" 
                            rows="4"
                            oninput="blueprintModule.updateData('asIs', 'problem', this.value); blueprintModule.updateProgress();"
                        >${this.blueprintData.asIs.problem}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="question-header">
                            <span class="question-number">④</span>
                            <div class="question-content">
                                <h3 class="question-title">학생들의 반응은 어땠나요?</h3>
                                <p class="question-hint">학생들의 참여도와 반응을 관찰한 내용을 기록하세요</p>
                            </div>
                        </div>
                        <div class="hint-card">
                            <span class="hint-icon">💡</span>
                            <span class="hint-text">예시: 신기해했지만 학습 내용은 기억하지 못함</span>
                        </div>
                        <textarea 
                            id="as-is-reaction" 
                            class="form-input as-is-input" 
                            rows="4"
                            oninput="blueprintModule.updateData('asIs', 'studentReaction', this.value); blueprintModule.updateProgress();"
                        >${this.blueprintData.asIs.studentReaction}</textarea>
                    </div>
                    
                    <!-- As Is 완료 구분선 -->
                    <div class="section-divider">
                        <div class="divider-line"></div>
                        <div class="divider-text">✔ 현재 수업 분석 완료</div>
                        <div class="divider-line"></div>
                    </div>
                </div>
                
                <!-- To Be 섹션 -->
                <div class="blueprint-card to-be-card">
                    <div class="card-header">
                        <h2 class="card-title">🎯 To Be (개선된 수업)</h2>
                        <p class="card-subtitle">이상적인 수업의 모습을 설계해보세요</p>
                    </div>
                    
                    <div class="form-group">
                        <div class="question-header">
                            <span class="question-number">①</span>
                            <div class="question-content">
                                <h3 class="question-title">앞으로 수업의 학습 목표는?</h3>
                                <p class="question-hint">학생들이 수업 후 무엇을 할 수 있기를 바라나요?</p>
                            </div>
                        </div>
                        <div class="hint-card">
                            <span class="hint-icon">💡</span>
                            <span class="hint-text">예시: AI 도구를 활용해 창의적 글쓰기 능력을 기른다</span>
                        </div>
                        <textarea 
                            id="to-be-goal" 
                            class="form-input to-be-input" 
                            rows="4"
                            oninput="blueprintModule.updateData('toBe', 'learningGoal', this.value); blueprintModule.updateProgress();"
                        >${this.blueprintData.toBe.learningGoal}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="question-header">
                            <span class="question-number">②</span>
                            <div class="question-content">
                                <h3 class="question-title">어떤 방법으로 수업할 건가요?</h3>
                                <p class="question-hint">개선된 수업 진행 방식과 활동을 설계해보세요</p>
                            </div>
                        </div>
                        <div class="hint-card">
                            <span class="hint-icon">💡</span>
                            <span class="hint-text">예시: 사전 영상으로 도구 사용법 안내 후, 수업에서는 바로 활동 시작</span>
                        </div>
                        <textarea 
                            id="to-be-method" 
                            class="form-input to-be-input" 
                            rows="4"
                            oninput="blueprintModule.updateData('toBe', 'newMethod', this.value); blueprintModule.updateProgress();"
                        >${this.blueprintData.toBe.newMethod}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="question-header">
                            <span class="question-number">③</span>
                            <div class="question-content">
                                <h3 class="question-title">기대 효과는 무엇인가요?</h3>
                                <p class="question-hint">이 수업을 통해 얻고자 하는 결과를 구체적으로 적어보세요</p>
                            </div>
                        </div>
                        <div class="hint-card">
                            <span class="hint-icon">💡</span>
                            <span class="hint-text">예시: 활동 시간이 늘어 학습 효과가 증대될 것</span>
                        </div>
                        <textarea 
                            id="to-be-effect" 
                            class="form-input to-be-input" 
                            rows="4"
                            oninput="blueprintModule.updateData('toBe', 'expectedEffect', this.value); blueprintModule.updateProgress();"
                        >${this.blueprintData.toBe.expectedEffect}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="question-header">
                            <span class="question-number">④</span>
                            <div class="question-content">
                                <h3 class="question-title">구체적인 실행 계획은?</h3>
                                <p class="question-hint">실제로 수업에 적용할 수 있는 단계별 계획을 세워보세요</p>
                            </div>
                        </div>
                        <div class="hint-card">
                            <span class="hint-icon">💡</span>
                            <span class="hint-text">예시: 1) 사전 영상 제작 2) 핵심 기능만 3분 안내 3) 즉시 활동 시작</span>
                        </div>
                        <textarea 
                            id="to-be-plan" 
                            class="form-input to-be-input" 
                            rows="4"
                            oninput="blueprintModule.updateData('toBe', 'actionPlan', this.value); blueprintModule.updateProgress();"
                        >${this.blueprintData.toBe.actionPlan}</textarea>
                    </div>
                </div>
            </div>
            
            <div class="blueprint-actions">
                <button class="save-btn" onclick="blueprintModule.saveData()">💾 저장하기</button>
                <button class="export-btn" onclick="blueprintModule.exportData()">📄 내보내기</button>
                <button class="clear-btn" onclick="blueprintModule.clearData()">🗑️ 초기화</button>
            </div>
        `;
    },
    
    updateData(section, field, value) {
        this.blueprintData[section][field] = value;
        this.saveToLocalStorage();
    },
    
    saveData() {
        this.saveToLocalStorage();
        alert('청사진이 저장되었습니다! 💾');
    },
    
    saveToLocalStorage() {
        localStorage.setItem('blueprintData', JSON.stringify(this.blueprintData));
        window.appState.blueprintData = this.blueprintData;
    },
    
    loadSavedData() {
        const saved = localStorage.getItem('blueprintData');
        if (saved) {
            this.blueprintData = JSON.parse(saved);
            window.appState.blueprintData = this.blueprintData;
        }
    },
    
    exportData() {
        const data = {
            asIs: this.blueprintData.asIs,
            toBe: this.blueprintData.toBe,
            exportDate: new Date().toLocaleString('ko-KR')
        };
        
        const text = `
=== As Is → To Be 청사진 ===

[As Is - 현재 수업]
1. 학습 목표: ${data.asIs.learningGoal || '(작성 안 됨)'}
2. 수업 방법: ${data.asIs.currentMethod || '(작성 안 됨)'}
3. 문제점: ${data.asIs.problem || '(작성 안 됨)'}
4. 학생 반응: ${data.asIs.studentReaction || '(작성 안 됨)'}

[To Be - 개선된 수업]
1. 학습 목표: ${data.toBe.learningGoal || '(작성 안 됨)'}
2. 수업 방법: ${data.toBe.newMethod || '(작성 안 됨)'}
3. 기대 효과: ${data.toBe.expectedEffect || '(작성 안 됨)'}
4. 실행 계획: ${data.toBe.actionPlan || '(작성 안 됨)'}

생성일: ${data.exportDate}
        `.trim();
        
        // 클립보드에 복사
        navigator.clipboard.writeText(text).then(() => {
            alert('청사진이 클립보드에 복사되었습니다! 📋\n\n텍스트 파일로 붙여넣기 하거나 공유할 수 있습니다.');
        }).catch(() => {
            // 클립보드 API 실패 시 텍스트 영역으로 표시
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('청사진이 클립보드에 복사되었습니다! 📋');
        });
    },
    
    clearData() {
        if (confirm('정말 청사진을 초기화하시겠습니까?')) {
            this.blueprintData = {
                asIs: {
                    learningGoal: '',
                    currentMethod: '',
                    problem: '',
                    studentReaction: ''
                },
                toBe: {
                    learningGoal: '',
                    newMethod: '',
                    expectedEffect: '',
                    actionPlan: ''
                }
            };
            localStorage.removeItem('blueprintData');
            this.render();
            this.updateProgress();
            alert('청사진이 초기화되었습니다.');
        }
    }
};

// 전역으로 내보내기
window.blueprintModule = blueprintModule;

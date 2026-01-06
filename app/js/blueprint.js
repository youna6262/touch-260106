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
    },
    
    render() {
        const container = document.getElementById('blueprint-content');
        
        container.innerHTML = `
            <div class="blueprint-intro">
                <p>현재 수업(As Is)을 분석하고, 개선된 수업(To Be)을 설계해보세요.</p>
            </div>
            
            <div class="blueprint-container">
                <!-- As Is 섹션 -->
                <div class="blueprint-section as-is">
                    <div class="section-header">
                        <h2>📋 As Is (현재 수업)</h2>
                        <p>지금 수업의 모습을 솔직하게 기록하세요</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="as-is-goal">1. 학습 목표는 무엇이었나요?</label>
                        <textarea 
                            id="as-is-goal" 
                            class="form-input" 
                            rows="3"
                            placeholder="예: AI 도구를 사용해 창의적 글쓰기를 배운다"
                            oninput="blueprintModule.updateData('asIs', 'learningGoal', this.value)"
                        >${this.blueprintData.asIs.learningGoal}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="as-is-method">2. 어떤 방법으로 수업했나요?</label>
                        <textarea 
                            id="as-is-method" 
                            class="form-input" 
                            rows="3"
                            placeholder="예: 챗GPT를 사용해 글쓰기 활동 진행"
                            oninput="blueprintModule.updateData('asIs', 'currentMethod', this.value)"
                        >${this.blueprintData.asIs.currentMethod}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="as-is-problem">3. 어떤 문제가 있었나요?</label>
                        <textarea 
                            id="as-is-problem" 
                            class="form-input" 
                            rows="3"
                            placeholder="예: 도구 설명에 시간이 너무 많이 걸렸다"
                            oninput="blueprintModule.updateData('asIs', 'problem', this.value)"
                        >${this.blueprintData.asIs.problem}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="as-is-reaction">4. 학생들의 반응은 어땠나요?</label>
                        <textarea 
                            id="as-is-reaction" 
                            class="form-input" 
                            rows="3"
                            placeholder="예: 신기해했지만 학습 내용은 기억하지 못함"
                            oninput="blueprintModule.updateData('asIs', 'studentReaction', this.value)"
                        >${this.blueprintData.asIs.studentReaction}</textarea>
                    </div>
                </div>
                
                <!-- 화살표 -->
                <div class="arrow-divider">
                    <div class="arrow">→</div>
                    <p>개선</p>
                </div>
                
                <!-- To Be 섹션 -->
                <div class="blueprint-section to-be">
                    <div class="section-header">
                        <h2>🎯 To Be (개선된 수업)</h2>
                        <p>이상적인 수업의 모습을 그려보세요</p>
                    </div>
                    
                    <div class="form-group">
                        <label for="to-be-goal">1. 학습 목표는 무엇인가요?</label>
                        <textarea 
                            id="to-be-goal" 
                            class="form-input" 
                            rows="3"
                            placeholder="예: AI 도구를 활용해 창의적 글쓰기 능력을 기른다"
                            oninput="blueprintModule.updateData('toBe', 'learningGoal', this.value)"
                        >${this.blueprintData.toBe.learningGoal}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="to-be-method">2. 어떤 방법으로 수업할 건가요?</label>
                        <textarea 
                            id="to-be-method" 
                            class="form-input" 
                            rows="3"
                            placeholder="예: 사전 영상으로 도구 사용법 안내 후, 수업에서는 바로 활동 시작"
                            oninput="blueprintModule.updateData('toBe', 'newMethod', this.value)"
                        >${this.blueprintData.toBe.newMethod}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="to-be-effect">3. 기대 효과는 무엇인가요?</label>
                        <textarea 
                            id="to-be-effect" 
                            class="form-input" 
                            rows="3"
                            placeholder="예: 활동 시간이 늘어 학습 효과가 증대될 것"
                            oninput="blueprintModule.updateData('toBe', 'expectedEffect', this.value)"
                        >${this.blueprintData.toBe.expectedEffect}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="to-be-plan">4. 구체적인 실행 계획은?</label>
                        <textarea 
                            id="to-be-plan" 
                            class="form-input" 
                            rows="3"
                            placeholder="예: 1) 사전 영상 제작 2) 핵심 기능만 3분 안내 3) 즉시 활동 시작"
                            oninput="blueprintModule.updateData('toBe', 'actionPlan', this.value)"
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
            alert('청사진이 초기화되었습니다.');
        }
    }
};

// 전역으로 내보내기
window.blueprintModule = blueprintModule;

// 결과 공유 모듈
export const shareModule = {
    init() {
        this.render();
        this.updateMenuStatus();
    },
    
    // 완료 상태 계산
    getCompletionStatus() {
        const state = window.appState;
        const completed = {
            survey: !!state.surveyResult,
            picrat: !!state.picratResult,
            blueprint: !!(state.blueprintData && (
                state.blueprintData.asIs?.learningGoal || 
                state.blueprintData.toBe?.learningGoal
            ))
        };
        const total = Object.keys(completed).length;
        const completedCount = Object.values(completed).filter(Boolean).length;
        return { completed, total, completedCount };
    },
    
    // 메뉴 상태 업데이트
    updateMenuStatus() {
        const status = this.getCompletionStatus();
        const shareBtn = document.querySelector('[data-page="share"]');
        if (shareBtn) {
            const statusBadge = shareBtn.querySelector('.status-badge') || document.createElement('span');
            statusBadge.className = 'status-badge';
            if (status.completedCount === status.total) {
                statusBadge.textContent = '✅ 완료';
                statusBadge.style.background = '#10b981';
            } else {
                statusBadge.textContent = `${status.completedCount} / ${status.total} 완료`;
                statusBadge.style.background = '#f59e0b';
            }
            if (!shareBtn.querySelector('.status-badge')) {
                shareBtn.appendChild(statusBadge);
            }
        }
    },
    
    render() {
        const container = document.getElementById('share-content');
        const state = window.appState;
        const status = this.getCompletionStatus();
        
        // PICRAT 코드 추출 (IA, IC 등)
        const picratCode = state.picratResult?.code || '';
        const picratName = state.picratResult?.name || '';
        const picratDescription = state.picratResult?.description || '';
        
        // 청사진 완료 여부
        const blueprintCompleted = !!(state.blueprintData && (
            state.blueprintData.asIs?.learningGoal || 
            state.blueprintData.toBe?.learningGoal
        ));
        
        // 상태 배지 생성 함수
        const getStatusBadge = (isCompleted) => {
            if (isCompleted) {
                return '<span class="status-badge completed">🟢 완료</span>';
            } else {
                return '<span class="status-badge incomplete">🔴 미완료</span>';
            }
        };
        
        let content = '';
        
        // ========== ① 상단: 전체 상태 요약 카드 ==========
        content += `
            <div class="summary-card">
                <h2 class="summary-title">📊 수업 분석 전체 상태</h2>
                <div class="summary-content">
                    <div class="summary-item">
                        <span class="summary-label">PICRAT 진단:</span>
                        ${getStatusBadge(status.completed.picrat)}
                        ${status.completed.picrat ? `<span class="summary-value">${picratCode}</span>` : ''}
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">As-Is → To-Be:</span>
                        ${getStatusBadge(blueprintCompleted)}
                    </div>
                </div>
            </div>
        `;
        
        // ========== ② 하단: Step 기반 진행 UI ==========
        const steps = [
            {
                id: 'survey',
                number: 1,
                icon: '🌱',
                title: '망한 수업 자랑하기',
                completed: status.completed.survey,
                page: 'survey',
                buttonText: '✍ 지금 작성하기'
            },
            {
                id: 'picrat',
                number: 2,
                icon: '📋',
                title: 'PICRAT 진단',
                completed: status.completed.picrat,
                page: 'picrat',
                buttonText: '🔍 진단 시작하기'
            },
            {
                id: 'blueprint',
                number: 3,
                icon: '🧭',
                title: 'As-Is → To-Be 작성',
                completed: status.completed.blueprint,
                page: 'blueprint',
                buttonText: '✍ 지금 작성하기'
            }
        ];
        
        // 첫 번째 미완료 항목 찾기 (우선순위)
        const firstIncompleteIndex = steps.findIndex(step => !step.completed);
        
        content += `
            <div class="steps-section">
                <h3 class="steps-title">📋 결과 공유 전 확인 사항</h3>
                <div class="steps-container">
        `;
        
        steps.forEach((step, index) => {
            const isFirstIncomplete = index === firstIncompleteIndex;
            const stepClass = step.completed ? 'step-item completed' : 'step-item incomplete';
            const statusBadge = step.completed ? '🟢 완료' : '🔴 미완료';
            const buttonClass = isFirstIncomplete ? 'action-btn primary' : 'action-btn secondary';
            
            content += `
                <div class="${stepClass}">
                    <div class="step-header">
                        <span class="step-number">[${step.number}]</span>
                        <span class="step-icon">${step.icon}</span>
                        <span class="step-title">${step.title}</span>
                        <span class="step-status-badge">${statusBadge}</span>
                    </div>
                    ${!step.completed ? `
                        <button class="${buttonClass}" onclick="switchPage('${step.page}')">
                            ${step.buttonText}
                        </button>
                    ` : ''}
                </div>
            `;
        });
        
        content += `
                </div>
            </div>
        `;
        
        // ========== PICRAT 결과 카드 (완료된 경우만 표시) ==========
        if (status.completed.picrat && state.picratResult) {
            // PICRAT 코드 분해 (예: IA -> I, A)
            const picratParts = picratCode.split('').filter(c => c.trim());
            const meanings = {
                'I': 'Interactive',
                'P': 'Passive',
                'C': 'Creative',
                'R': 'Replacement',
                'A': 'Amplification',
                'T': 'Transformation'
            };
            
            content += `
                <div class="picrat-result-card">
                    <h3 class="picrat-card-title">🧠 PICRAT 진단 결과</h3>
                    <div class="picrat-code-large">${picratCode}</div>
                    <div class="picrat-expansion">
                        ${picratParts.map(letter => {
                            const meaning = meanings[letter] || '';
                            return `<div class="picrat-letter">
                                <span class="letter-code">${letter}</span>
                                <span class="letter-meaning">${meaning}</span>
                            </div>`;
                        }).join('')}
                    </div>
                    <p class="picrat-description">${picratDescription || '학생들이 기술을 활용해 수업 효과를 확장하는 단계입니다.'}</p>
                    <button class="action-btn primary" onclick="shareModule.sharePicrat()">📤 결과 공유하기</button>
                </div>
            `;
        }
        
        // ========== ③ 공유 액션 영역 ==========
        if (status.completedCount > 0) {
            content += `
                <div class="share-action-section">
                    <h3 class="share-action-title">📤 전체 결과 공유</h3>
                    <p class="share-action-desc">수업 분석 결과를 동료 교사와 공유할 수 있습니다</p>
                    <button class="action-btn primary large" onclick="shareModule.shareAll()">📤 전체 결과 공유하기</button>
                </div>
            `;
        }
        
        container.innerHTML = content;
    },
    
    shareSurvey() {
        const result = window.appState.surveyResult;
        if (!result) return;
        
        const text = `🏆 나의 망한 수업 자랑하기 결과

${result.icon} ${result.title}
${result.subtitle}

${result.desc.replace(/<[^>]*>/g, '').substring(0, 200)}...

#AI디지털수업 #수업개선 #교사연수`;

        this.copyToClipboard(text, '설문 결과가 클립보드에 복사되었습니다!');
    },
    
    sharePicrat() {
        const result = window.appState.picratResult;
        if (!result) return;
        
        const text = `🧠 PICRAT 진단 결과

${result.code} - ${result.name}

${result.description}

💡 개선 방향: ${result.improvement}

#PICRAT #수업진단 #AI디지털수업`;

        this.copyToClipboard(text, 'PICRAT 진단 결과가 클립보드에 복사되었습니다!');
    },
    
    shareBlueprint() {
        const data = window.appState.blueprintData;
        if (!data) return;
        
        const text = `🧩 As Is → To Be 청사진

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

#수업청사진 #수업개선 #AI디지털수업`;

        this.copyToClipboard(text, '청사진이 클립보드에 복사되었습니다!');
    },
    
    shareAll() {
        const state = window.appState;
        let text = `📊 AI 디지털 기반 수업 분석 결과\n\n`;
        
        if (state.surveyResult) {
            text += `🏆 망한 수업 자랑하기: ${state.surveyResult.title}\n`;
        }
        
        if (state.picratResult) {
            text += `🧠 PICRAT 진단: ${state.picratResult.code} - ${state.picratResult.name}\n`;
        }
        
        if (state.blueprintData) {
            text += `🧩 청사진: 작성 완료\n`;
        }
        
        text += `\n#AI디지털수업 #수업개선 #교사연수`;
        
        this.copyToClipboard(text, '전체 결과가 클립보드에 복사되었습니다!');
    },
    
    copyToClipboard(text, message) {
        navigator.clipboard.writeText(text).then(() => {
            alert(message + '\n\nSNS나 메신저에 붙여넣기 하여 공유할 수 있습니다!');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert(message);
        });
    }
};

// 전역으로 내보내기
window.shareModule = shareModule;

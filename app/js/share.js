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
        
        // 현재 상태 텍스트
        const currentStatus = status.completedCount === status.total 
            ? '✅ 모든 단계가 완료되었습니다!' 
            : '⚠️ 일부 단계가 완료되지 않았습니다';
        
        let content = '';
        
        // ========== ① 나의 수업 분석 요약 카드 ==========
        content += `
            <div class="summary-card">
                <h2 class="summary-title">📊 나의 수업 분석 결과</h2>
                <div class="summary-content">
                    <div class="summary-item">
                        <span class="summary-label">PICRAT 진단 결과:</span>
                        <span class="summary-value">${picratCode || '미완료'}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">As Is → To Be 청사진:</span>
                        <span class="summary-value">${blueprintCompleted ? '완료' : '미완료'}</span>
                    </div>
                    <div class="summary-status">
                        <span class="status-text">${currentStatus}</span>
                    </div>
                </div>
            </div>
        `;
        
        // ========== ② 단계별 완료 현황 (체크리스트) ==========
        content += `
            <div class="checklist-section">
                <h3 class="checklist-title">📋 결과 공유 전 확인 사항</h3>
                <div class="checklist-items">
        `;
        
        // 설문 체크리스트
        content += `
            <div class="checklist-item ${status.completed.survey ? 'completed' : ''}">
                <span class="check-icon">${status.completed.survey ? '☑' : '☐'}</span>
                <span class="check-label">망한 수업 자랑하기 ${status.completed.survey ? '완료' : '미완료'}</span>
                ${!status.completed.survey ? `<button class="action-btn secondary" onclick="switchPage('survey')">작성하러 가기</button>` : ''}
            </div>
        `;
        
        // PICRAT 체크리스트
        content += `
            <div class="checklist-item ${status.completed.picrat ? 'completed' : ''}">
                <span class="check-icon">${status.completed.picrat ? '☑' : '☐'}</span>
                <span class="check-label">PICRAT 진단 ${status.completed.picrat ? '완료' : '미완료'}</span>
                ${!status.completed.picrat ? `<button class="action-btn secondary" onclick="switchPage('picrat')">진단하러 가기</button>` : ''}
            </div>
        `;
        
        // 청사진 체크리스트
        content += `
            <div class="checklist-item ${status.completed.blueprint ? 'completed' : ''}">
                <span class="check-icon">${status.completed.blueprint ? '☑' : '☐'}</span>
                <span class="check-label">As Is → To Be 청사진 ${status.completed.blueprint ? '완료' : '미완료'}</span>
                ${!status.completed.blueprint ? `<button class="action-btn secondary" onclick="switchPage('blueprint')">작성하러 가기</button>` : ''}
            </div>
        `;
        
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

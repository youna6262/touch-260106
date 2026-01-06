// 결과 공유 모듈
export const shareModule = {
    init() {
        this.render();
    },
    
    render() {
        const container = document.getElementById('share-content');
        const state = window.appState;
        
        let content = `
            <div class="share-intro">
                <p>나의 수업 분석 결과를 확인하고 공유해보세요!</p>
            </div>
        `;
        
        // 설문 결과
        if (state.surveyResult) {
            content += `
                <div class="share-card">
                    <h2>🏆 망한 수업 자랑하기 결과</h2>
                    <div class="result-preview">
                        <div class="preview-badge">${state.surveyResult.icon}</div>
                        <h3>${state.surveyResult.title}</h3>
                        <p class="preview-subtitle">${state.surveyResult.subtitle}</p>
                    </div>
                    <button class="share-btn" onclick="shareModule.shareSurvey()">📤 공유하기</button>
                </div>
            `;
        } else {
            content += `
                <div class="share-card empty">
                    <p>아직 설문을 완료하지 않았습니다.</p>
                    <button class="nav-to-btn" onclick="switchPage('survey')">설문하러 가기 →</button>
                </div>
            `;
        }
        
        // PICRAT 결과
        if (state.picratResult) {
            content += `
                <div class="share-card">
                    <h2>🧠 PICRAT 진단 결과</h2>
                    <div class="result-preview">
                        <div class="preview-code">${state.picratResult.code}</div>
                        <h3>${state.picratResult.name}</h3>
                        <p class="preview-description">${state.picratResult.description}</p>
                    </div>
                    <button class="share-btn" onclick="shareModule.sharePicrat()">📤 공유하기</button>
                </div>
            `;
        } else {
            content += `
                <div class="share-card empty">
                    <p>아직 PICRAT 진단을 완료하지 않았습니다.</p>
                    <button class="nav-to-btn" onclick="switchPage('picrat')">진단하러 가기 →</button>
                </div>
            `;
        }
        
        // 청사진 결과
        if (state.blueprintData && (
            state.blueprintData.asIs.learningGoal || 
            state.blueprintData.toBe.learningGoal
        )) {
            content += `
                <div class="share-card">
                    <h2>🧩 As Is → To Be 청사진</h2>
                    <div class="result-preview">
                        <p>청사진이 작성되었습니다.</p>
                    </div>
                    <button class="share-btn" onclick="shareModule.shareBlueprint()">📤 공유하기</button>
                </div>
            `;
        } else {
            content += `
                <div class="share-card empty">
                    <p>아직 청사진을 작성하지 않았습니다.</p>
                    <button class="nav-to-btn" onclick="switchPage('blueprint')">작성하러 가기 →</button>
                </div>
            `;
        }
        
        // 전체 결과 요약
        if (state.surveyResult || state.picratResult || state.blueprintData) {
            content += `
                <div class="share-card summary">
                    <h2>📊 전체 결과 요약</h2>
                    <button class="share-btn large" onclick="shareModule.shareAll()">📤 전체 결과 공유하기</button>
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

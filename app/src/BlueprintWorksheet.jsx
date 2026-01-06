import { useState, useEffect, useRef } from 'react'
import './BlueprintWorksheet.css'

const STORAGE_KEY = "blueprint_worksheet_v2";

// PICRAT 모델 정보
const PICRAT_GRID = [
  { code: 'PR', label: 'PR', desc: 'Passive-Replace', row: 0, col: 0 },
  { code: 'PA', label: 'PA', desc: 'Passive-Amplify', row: 0, col: 1 },
  { code: 'PT', label: 'PT', desc: 'Passive-Transform', row: 0, col: 2 },
  { code: 'IR', label: 'IR', desc: 'Interactive-Replace', row: 1, col: 0 },
  { code: 'IA', label: 'IA', desc: 'Interactive-Amplify', row: 1, col: 1 },
  { code: 'IT', label: 'IT', desc: 'Interactive-Transform', row: 1, col: 2 },
  { code: 'CR', label: 'CR', desc: 'Creative-Replace', row: 2, col: 0 },
  { code: 'CA', label: 'CA', desc: 'Creative-Amplify', row: 2, col: 1 },
  { code: 'CT', label: 'CT', desc: 'Creative-Transform', row: 2, col: 2 },
];

// SAMR 모델 정보
const SAMR_LEVELS = [
  { code: 'S', label: 'S', desc: '대체 (Substitution)', level: 0 },
  { code: 'A', label: 'A', desc: '증강 (Augmentation)', level: 1 },
  { code: 'M', label: 'M', desc: '수정 (Modification)', level: 2 },
  { code: 'R', label: 'R', desc: '재정의 (Redefinition)', level: 3 },
];

// 현재 수업 특징 옵션
const CURRENT_FEATURES = [
  '교사 주도',
  '디지털은 보조 도구',
  '학생 참여 제한적',
  '일방적 설명 중심',
  '개별 활동 위주',
  '피드백 부족',
];

function BlueprintWorksheet() {
  // As-Is 상태
  const [topic, setTopic] = useState('');
  const [currentFeatures, setCurrentFeatures] = useState([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [selectedPicrat, setSelectedPicrat] = useState('');
  const [selectedSamr, setSelectedSamr] = useState('');
  
  // To-Be 상태
  const [targetChange, setTargetChange] = useState('');
  const [competencies, setCompetencies] = useState([]);
  const [resources, setResources] = useState([]);
  const [competencyInput, setCompetencyInput] = useState('');
  const [resourceInput, setResourceInput] = useState('');
  
  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);
  
  // PDF/이미지 저장용 ref
  const worksheetRef = useRef(null);
  
  // Toast 함수
  const toast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 1500);
  };
  
  // PICRAT 결과를 As Is에 자동 표시
  const loadPicratResult = () => {
    try {
      const draftData = localStorage.getItem("blueprint_draft_v1");
      if (draftData) {
        const data = JSON.parse(draftData);
        if (data.picrat_code) {
          setSelectedPicrat(data.picrat_code);
          toast("PICRAT 결과를 불러왔습니다.");
        }
        if (data.samr_level) {
          setSelectedSamr(data.samr_level);
          toast("SAMR 결과를 불러왔습니다.");
        }
        if (!data.picrat_code && !data.samr_level) {
          toast("저장된 PICRAT/SAMR 결과가 없습니다.");
        }
      } else {
        toast("저장된 진단 결과가 없습니다.");
      }
    } catch (e) {
      toast("결과를 불러오는 중 오류가 발생했습니다.");
    }
  };
  
  // 자동 저장
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage();
    }, 500);
    return () => clearTimeout(timer);
  }, [topic, currentFeatures, currentDescription, selectedPicrat, selectedSamr, targetChange, competencies, resources]);
  
  // 로컬스토리지에 저장
  const saveToLocalStorage = () => {
    const data = {
      topic,
      current_features: currentFeatures,
      current_description: currentDescription,
      selected_picrat: selectedPicrat,
      selected_samr: selectedSamr,
      target_change: targetChange,
      competencies,
      resources,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };
  
  // 로컬스토리지에서 불러오기
  const loadFromLocalStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setTopic(parsed.topic || '');
        setCurrentFeatures(parsed.current_features || []);
        setCurrentDescription(parsed.current_description || '');
        setSelectedPicrat(parsed.selected_picrat || '');
        setSelectedSamr(parsed.selected_samr || '');
        setTargetChange(parsed.target_change || '');
        setCompetencies(parsed.competencies || []);
        setResources(parsed.resources || []);
        toast("저장된 내용을 불러왔습니다.");
      } else {
        toast("저장된 내용이 없습니다.");
      }
    } catch (e) {
      toast("불러오는 중 오류가 발생했습니다.");
    }
  };
  
  // 초기 로드
  useEffect(() => {
    loadFromLocalStorage();
  }, []);
  
  // 체크박스 핸들러
  const handleFeatureToggle = (feature) => {
    setCurrentFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };
  
  // 역량 추가
  const addCompetency = () => {
    if (competencyInput.trim()) {
      setCompetencies(prev => [...prev, competencyInput.trim()]);
      setCompetencyInput('');
      toast("역량이 추가되었습니다.");
    }
  };
  
  // 역량 삭제
  const removeCompetency = (index) => {
    setCompetencies(prev => prev.filter((_, i) => i !== index));
  };
  
  // 자원 추가
  const addResource = () => {
    if (resourceInput.trim()) {
      setResources(prev => [...prev, resourceInput.trim()]);
      setResourceInput('');
      toast("자원이 추가되었습니다.");
    }
  };
  
  // 자원 삭제
  const removeResource = (index) => {
    setResources(prev => prev.filter((_, i) => i !== index));
  };
  
  // PICRAT 카드 클릭 핸들러
  const handlePicratClick = (code) => {
    setSelectedPicrat(selectedPicrat === code ? '' : code);
  };
  
  // SAMR 단계 클릭 핸들러
  const handleSamrClick = (code) => {
    setSelectedSamr(selectedSamr === code ? '' : code);
  };
  
  // 이미지로 저장
  const saveAsImage = async () => {
    if (!worksheetRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(worksheetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = 'As-Is-To-Be-청사진.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast("이미지로 저장했습니다.");
    } catch (e) {
      toast("이미지 저장에 실패했습니다. Ctrl+P로 인쇄해주세요.");
    }
  };
  
  return (
    <div className="blueprint-worksheet-container">
      <div className="worksheet-header">
        <h1>📋 As Is → To Be 청사진 설계</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={loadPicratResult}>
            🔍 PICRAT 결과 불러오기
          </button>
          <button className="btn btn-secondary" onClick={loadFromLocalStorage}>
            📂 불러오기
          </button>
          <button className="btn btn-secondary" onClick={saveAsImage}>
            🖼️ 이미지 저장
          </button>
        </div>
      </div>
      
      <div className="worksheet-content" ref={worksheetRef}>
        <div className="worksheet-layout">
          {/* As-Is 영역 (왼쪽) */}
          <div className="worksheet-section asis-section">
            <div className="section-header">
              <h2>As-Is 나의 수업</h2>
              <span className="section-subtitle">(현재)</span>
            </div>
            
            {/* 수업 주제 */}
            <div className="form-group">
              <label htmlFor="topic">수업 주제</label>
              <input
                id="topic"
                type="text"
                className="worksheet-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예) 5학년 과학: 프랙탈로 자연 패턴 이해"
              />
            </div>
            
            {/* 현재 수업의 특징 */}
            <div className="form-group">
              <label>현재 수업의 특징</label>
              <div className="check-card-container">
                {CURRENT_FEATURES.map(feature => (
                  <label key={feature} className="check-card">
                    <input
                      type="checkbox"
                      checked={currentFeatures.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                    />
                    <span>{feature}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* 짧은 서술 */}
            <div className="form-group">
              <label htmlFor="current-description">현재 수업 설명 (선택)</label>
              <textarea
                id="current-description"
                className="worksheet-textarea short"
                value={currentDescription}
                onChange={(e) => setCurrentDescription(e.target.value)}
                placeholder="현재 수업의 특징을 짧게 서술해주세요."
              />
            </div>
            
            {/* PICRAT 선택 */}
            <div className="form-group">
              <label>PICRAT 위치 선택</label>
              <div className="picrat-grid">
                <div className="picrat-axis-label" style={{gridRow: 1, gridColumn: 1}}></div>
                <div className="picrat-axis-label picrat-col-label" style={{gridRow: 1, gridColumn: 2}}>Replace</div>
                <div className="picrat-axis-label picrat-col-label" style={{gridRow: 1, gridColumn: 3}}>Amplify</div>
                <div className="picrat-axis-label picrat-col-label" style={{gridRow: 1, gridColumn: 4}}>Transform</div>
                <div className="picrat-axis-label picrat-row-label" style={{gridRow: 2, gridColumn: 1}}>Passive</div>
                <div className="picrat-axis-label picrat-row-label" style={{gridRow: 3, gridColumn: 1}}>Interactive</div>
                <div className="picrat-axis-label picrat-row-label" style={{gridRow: 4, gridColumn: 1}}>Creative</div>
                {PICRAT_GRID.map(item => (
                  <button
                    key={item.code}
                    className={`picrat-card ${selectedPicrat === item.code ? 'selected' : ''}`}
                    onClick={() => handlePicratClick(item.code)}
                    style={{ gridRow: item.row + 2, gridColumn: item.col + 2 }}
                  >
                    <div className="picrat-code">{item.label}</div>
                    {selectedPicrat === item.code && (
                      <div className="picrat-desc">{item.desc}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* SAMR 선택 */}
            <div className="form-group">
              <label>SAMR 단계</label>
              <div className="samr-stairs">
                {SAMR_LEVELS.map(level => (
                  <button
                    key={level.code}
                    className={`samr-step ${selectedSamr === level.code ? 'selected' : ''}`}
                    onClick={() => handleSamrClick(level.code)}
                    style={{ 
                      '--level': level.level,
                      backgroundColor: selectedSamr === level.code 
                        ? `hsl(${200 + level.level * 20}, 70%, ${60 - level.level * 5}%)`
                        : `hsl(${200 + level.level * 20}, 30%, ${85 - level.level * 5}%)`
                    }}
                  >
                    <div className="samr-label">{level.label}</div>
                    {selectedSamr === level.code && (
                      <div className="samr-desc">{level.desc}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* To-Be 영역 (오른쪽) */}
          <div className="worksheet-section tobe-section">
            <div className="section-header">
              <h2>To-Be 미래 수업 청사진</h2>
              <span className="section-subtitle">(미래)</span>
            </div>
            
            {/* 목표 변화 */}
            <div className="form-group">
              <label htmlFor="target-change">🎯 목표 변화</label>
              <textarea
                id="target-change"
                className="worksheet-textarea large"
                value={targetChange}
                onChange={(e) => setTargetChange(e.target.value)}
                placeholder="어떤 방향으로 수업을 개선하고 싶은지 작성해주세요."
              />
            </div>
            
            {/* 필요한 역량 */}
            <div className="form-group">
              <label>🧠 필요한 역량</label>
              <div className="tag-input-group">
                <input
                  type="text"
                  className="tag-input"
                  value={competencyInput}
                  onChange={(e) => setCompetencyInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCompetency();
                    }
                  }}
                  placeholder="역량을 입력하고 Enter 또는 + 버튼을 누르세요"
                />
                <button className="btn-add" onClick={addCompetency}>+ 추가</button>
              </div>
              <div className="tag-container">
                {competencies.map((comp, index) => (
                  <span key={index} className="tag">
                    {comp}
                    <button className="tag-remove" onClick={() => removeCompetency(index)}>×</button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* 필요한 자원 */}
            <div className="form-group">
              <label>🧰 필요한 자원</label>
              <div className="tag-input-group">
                <input
                  type="text"
                  className="tag-input"
                  value={resourceInput}
                  onChange={(e) => setResourceInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addResource();
                    }
                  }}
                  placeholder="자원을 입력하고 Enter 또는 + 버튼을 누르세요"
                />
                <button className="btn-add" onClick={addResource}>+ 추가</button>
              </div>
              <div className="tag-container">
                {resources.map((res, index) => (
                  <span key={index} className="tag">
                    {res}
                    <button className="tag-remove" onClick={() => removeResource(index)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Toast */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        {toastMsg}
      </div>
    </div>
  );
}

export default BlueprintWorksheet;

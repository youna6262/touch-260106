import { useState, useEffect, useRef } from 'react'
import './BlueprintWorksheet.css'

const STORAGE_KEY = "blueprint_worksheet_v1";

function BlueprintWorksheet() {
  // As Is 상태
  const [asisDescription, setAsisDescription] = useState('');
  const [asisPicratSamr, setAsisPicratSamr] = useState('');
  
  // To Be 상태
  const [tobeUpgrade, setTobeUpgrade] = useState('');
  const [tobeSupport, setTobeSupport] = useState('');
  const [tobeCompetency, setTobeCompetency] = useState('');
  const [tobeResource, setTobeResource] = useState('');
  
  // 요약 카드
  const [summaryCard, setSummaryCard] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  
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
      // 기존 blueprint_draft_v1에서 PICRAT 결과 가져오기
      const draftData = localStorage.getItem("blueprint_draft_v1");
      if (draftData) {
        const data = JSON.parse(draftData);
        let picratText = '';
        
        if (data.picrat_code && data.picrat_out) {
          picratText += `PICRAT: (${data.picrat_code})\n${data.picrat_out}\n\n`;
        }
        
        if (data.samr_level && data.samr_out) {
          picratText += `SAMR: (${data.samr_level})\n${data.samr_out}`;
        }
        
        if (picratText) {
          setAsisPicratSamr(picratText);
          toast("PICRAT/SAMR 결과를 불러왔습니다.");
        } else {
          toast("저장된 PICRAT/SAMR 결과가 없습니다.");
        }
      } else {
        toast("저장된 진단 결과가 없습니다.");
      }
    } catch (e) {
      toast("결과를 불러오는 중 오류가 발생했습니다.");
    }
  };
  
  // 자동 저장 (입력 시마다)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToLocalStorage();
    }, 500);
    return () => clearTimeout(timer);
  }, [asisDescription, asisPicratSamr, tobeUpgrade, tobeSupport, tobeCompetency, tobeResource]);
  
  // 로컬스토리지에 저장
  const saveToLocalStorage = () => {
    const data = {
      asis_description: asisDescription,
      asis_picrat_samr: asisPicratSamr,
      tobe_upgrade: tobeUpgrade,
      tobe_support: tobeSupport,
      tobe_competency: tobeCompetency,
      tobe_resource: tobeResource,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };
  
  // 로컬스토리지에서 불러오기
  const loadFromLocalStorage = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setAsisDescription(parsed.asis_description || '');
        setAsisPicratSamr(parsed.asis_picrat_samr || '');
        setTobeUpgrade(parsed.tobe_upgrade || '');
        setTobeSupport(parsed.tobe_support || '');
        setTobeCompetency(parsed.tobe_competency || '');
        setTobeResource(parsed.tobe_resource || '');
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
  
  // 요약 카드 생성
  const generateSummary = () => {
    const summary = `📋 As Is → To Be 청사진 요약

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 As Is (나의 기존 수업)
${asisDescription || '(작성되지 않음)'}

${asisPicratSamr ? `🔍 진단 결과\n${asisPicratSamr}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 To Be (업그레이드하고 싶은 수업)
${tobeUpgrade || '(작성되지 않음)'}

💡 필요한 성장 지원 방안
${tobeSupport || '(작성되지 않음)'}

🎓 필요한 역량
${tobeCompetency || '(작성되지 않음)'}

📦 필요한 자원
${tobeResource || '(작성되지 않음)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    setSummaryCard(summary);
    setShowSummary(true);
    toast("요약 카드를 생성했습니다.");
  };
  
  // PDF로 저장 (html2pdf 라이브러리 사용)
  const saveAsPDF = async () => {
    if (!worksheetRef.current) return;
    
    try {
      // html2pdf.js 라이브러리 동적 로드
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = worksheetRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'As-Is-To-Be-청사진.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
      toast("PDF로 저장했습니다.");
    } catch (e) {
      // html2pdf가 없으면 이미지로 저장 시도
      toast("PDF 저장을 위해 이미지로 저장합니다.");
      saveAsImage();
    }
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
      // 라이브러리가 없으면 인쇄 기능 사용
      toast("라이브러리가 없어 인쇄 기능을 사용합니다. Ctrl+P (또는 Cmd+P)를 눌러 인쇄하세요.");
      window.print();
    }
  };
  
  // 복사
  const copySummary = async () => {
    if (!summaryCard) {
      toast("먼저 요약 카드를 생성해주세요.");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(summaryCard);
      toast("요약 카드를 복사했습니다.");
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = summaryCard;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast("요약 카드를 복사했습니다.");
    }
  };
  
  return (
    <div className="blueprint-worksheet-container">
      <div className="worksheet-header">
        <h1>📋 As Is → To Be 청사진 워크시트</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={loadPicratResult}>
            🔍 PICRAT 결과 불러오기
          </button>
          <button className="btn btn-secondary" onClick={loadFromLocalStorage}>
            📂 불러오기
          </button>
          <button className="btn btn-secondary" onClick={saveToLocalStorage}>
            💾 저장
          </button>
        </div>
      </div>
      
      <div className="worksheet-content" ref={worksheetRef}>
        <div className="worksheet-layout">
          {/* As Is 영역 (왼쪽) */}
          <div className="worksheet-section asis-section">
            <div className="section-header">
              <h2>📌 As Is</h2>
              <span className="section-subtitle">나의 기존 수업</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="asis-description">나의 기존 수업 설명</label>
              <textarea
                id="asis-description"
                className="worksheet-textarea"
                value={asisDescription}
                onChange={(e) => setAsisDescription(e.target.value)}
                placeholder="현재 수업의 특징, 방식, 학생 활동 등을 자유롭게 서술해주세요."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="asis-picrat-samr">PICRAT 또는 SAMR 진단 결과</label>
              <textarea
                id="asis-picrat-samr"
                className="worksheet-textarea"
                value={asisPicratSamr}
                onChange={(e) => setAsisPicratSamr(e.target.value)}
                placeholder="PICRAT 또는 SAMR 진단 결과를 입력하거나, 'PICRAT 결과 불러오기' 버튼을 사용하세요."
              />
            </div>
          </div>
          
          {/* To Be 영역 (오른쪽) */}
          <div className="worksheet-section tobe-section">
            <div className="section-header">
              <h2>🎯 To Be</h2>
              <span className="section-subtitle">미래 수업 청사진</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="tobe-upgrade">업그레이드/도전하고 싶은 수업</label>
              <textarea
                id="tobe-upgrade"
                className="worksheet-textarea"
                value={tobeUpgrade}
                onChange={(e) => setTobeUpgrade(e.target.value)}
                placeholder="어떤 방향으로 수업을 개선하고 싶은지 자유롭게 서술해주세요."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tobe-support">필요한 성장 지원 방안</label>
              <textarea
                id="tobe-support"
                className="worksheet-textarea"
                value={tobeSupport}
                onChange={(e) => setTobeSupport(e.target.value)}
                placeholder="수업 개선을 위해 필요한 지원 방안을 서술해주세요."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tobe-competency">필요한 역량</label>
              <textarea
                id="tobe-competency"
                className="worksheet-textarea"
                value={tobeCompetency}
                onChange={(e) => setTobeCompetency(e.target.value)}
                placeholder="수업 개선을 위해 필요한 역량을 서술해주세요."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="tobe-resource">필요한 자원</label>
              <textarea
                id="tobe-resource"
                className="worksheet-textarea"
                value={tobeResource}
                onChange={(e) => setTobeResource(e.target.value)}
                placeholder="수업 개선을 위해 필요한 자원(기기, 자료, 시간, 인력 등)을 서술해주세요."
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 요약 카드 영역 */}
      <div className="summary-section">
        <div className="summary-header">
          <h2>📋 요약 카드</h2>
          <div className="summary-actions">
            <button className="btn btn-primary" onClick={generateSummary}>
              ✨ 요약 카드 생성
            </button>
            {showSummary && (
              <>
                <button className="btn btn-secondary" onClick={copySummary}>
                  📋 복사
                </button>
                <button className="btn btn-secondary" onClick={saveAsImage}>
                  🖼️ 이미지 저장
                </button>
                <button className="btn btn-secondary" onClick={saveAsPDF}>
                  📄 PDF 저장
                </button>
              </>
            )}
          </div>
        </div>
        
        {showSummary && (
          <div className="summary-card">
            <pre className="summary-content">{summaryCard}</pre>
          </div>
        )}
      </div>
      
      {/* Toast */}
      <div className={`toast ${toastVisible ? 'show' : ''}`}>
        {toastMsg}
      </div>
    </div>
  );
}

export default BlueprintWorksheet;


import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import './App.css'
import BlueprintWorksheet from './BlueprintWorksheet'

const KEY = "blueprint_draft_v1";

function App() {
  // State 관리
  const [topic, setTopic] = useState('');
  const [asisTeacher, setAsisTeacher] = useState('교사 설명 중심');
  const [asisTech, setAsisTech] = useState('자료 제시(영상/슬라이드) 중심');
  const [asisStudent, setAsisStudent] = useState([]);
  const [asisNeed, setAsisNeed] = useState([]);
  const [asisOut, setAsisOut] = useState('');
  
  const [tobeStart, setTobeStart] = useState('문제/질문을 스스로 생성');
  const [tobeFlow, setTobeFlow] = useState('질문/아이디어 → 시도 → 수정·보완 → 공유 → 피드백 반영');
  const [tobeProduct, setTobeProduct] = useState('보고서/설명문');
  const [tobeShare, setTobeShare] = useState('모둠 공유 후 전체 피드백');
  const [tobeEval, setTobeEval] = useState('루브릭/체크리스트를 활용해 자기 점검');
  const [ethics, setEthics] = useState([]);
  const [tobeOut, setTobeOut] = useState('');
  
  const [picratCode, setPicratCode] = useState('');
  const [picratFocus, setPicratFocus] = useState('');
  const [picratOut, setPicratOut] = useState('');
  
  const [needsFocus, setNeedsFocus] = useState('');
  const [needsEnv, setNeedsEnv] = useState('');
  const [supportOut, setSupportOut] = useState('');
  const [competencyOut, setCompetencyOut] = useState('');
  const [resourceOut, setResourceOut] = useState('');
  
  const [samrLevel, setSamrLevel] = useState('');
  const [samrEvidence, setSamrEvidence] = useState('');
  const [samrOut, setSamrOut] = useState('');
  
  const [finalOut, setFinalOut] = useState('');
  const [commitment, setCommitment] = useState(''); // 한 문장 다짐
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState('blueprint'); // 'failed', 'picrat', 'blueprint', 'worksheet', 'share'
  const shareCardRef = useRef(null); // 공유용 이미지 캡처 영역 참조

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

  // 복사 함수
  const copyText = async (text) => {
    if (!text) {
      toast("복사할 내용이 없습니다.");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("복사했습니다.");
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast("복사했습니다.");
    }
  };

  // 체크박스 핸들러
  const handleCheckboxChange = (setter, value, checked, max = null) => {
    setter(prev => {
      if (checked) {
        if (max && prev.length >= max) {
          toast(`최대 ${max}개까지 선택을 권장합니다.`);
          return prev;
        }
        return [...prev, value];
      } else {
        return prev.filter(v => v !== value);
      }
    });
  };

  // As-is 생성
  const autoAsIs = () => {
    const actsTxt = asisStudent.length ? asisStudent.join("·") : "듣기/시청·개별 작성";
    const needsTxt = asisNeed.length ? asisNeed.join(", ") : "학생 주도성 및 상호작용(협력/토론)";
    
    const out = `현재 수업은 ${asisTeacher}으로 운영되며, 학생 활동은 주로 ${actsTxt}에 머무는 경향이 있습니다.
디지털 활용은 ${asisTech} 수준으로, 수업 구조 자체를 변화시키기보다는 기존 활동을 보조하는 역할이 큽니다.
그 결과 ${needsTxt}이(가) 제한될 수 있어, 수업에서 과정 중심 활동과 피드백 순환을 강화할 필요가 있습니다.`;
    
    setAsisOut(out);
    toast("As-is를 생성했습니다.");
  };

  // To-be 생성
  const autoToBe = () => {
    const ethicsTxt = ethics.length
      ? `마무리에서는 ${ethics.join(", ")} 등 윤리·출처 성찰을 포함합니다.`
      : `마무리에서는 출처·저작권 및 학습 과정 성찰을 포함합니다.`;

    const out = `미래 수업은 학생이 먼저 ${tobeStart}하고, 이를 바탕으로 탐구·설계·제작을 진행하는 학생 주도 구조로 전환합니다.
수업 흐름은 '${tobeFlow}'의 순환 과정으로 설계하여, 시도와 수정·보완을 학습의 핵심 과정으로 포함합니다.
산출물은 ${tobeProduct} 형태로 제작하고, ${tobeEval}을 통해 자기 점검과 과정 기록을 강화합니다.
공유·피드백은 ${tobeShare} 방식으로 운영하며, ${ethicsTxt}`;

    setTobeOut(out);
    toast("To-be를 생성했습니다.");
  };

  // PICRAT 핵심 문구
  const picratCorePhrase = (code) => {
    const map = {
      PR: "학생이 주로 시청·청취하며 정보 수용 중심으로 활동합니다",
      PA: "즉각 피드백/시각화/자동화로 이해와 효율이 높아집니다",
      PT: "기술이 학습 경험 자체를 새롭게 구성하도록 설계되었습니다",
      IR: "학생의 상호작용은 있으나 활동 형태는 기존 구조를 유지합니다",
      IA: "상호작용이 학습을 확장(증폭)하여 비교·수정·토론이 활발해집니다",
      IT: "상호작용을 통해 학습 구조가 재구성되어 새로운 활동이 가능해집니다",
      CR: "학생이 결과물을 만들지만 기존 활동을 기술로 옮긴 수준입니다",
      CA: "창작 과정이 더 풍부해지고 산출물의 품질이 향상됩니다",
      CT: "기술이 없으면 어려운 새로운 창작 활동이 가능해집니다"
    };
    return map[code] || "수업 설계의 근거가 분명해집니다";
  };

  // PICRAT 생성
  const autoPicrat = () => {
    if (!picratCode) {
      toast("PICRAT 코드를 먼저 선택해주세요.");
      return;
    }

    const core = picratCorePhrase(picratCode);
    const focusTxt = picratFocus ? `특히 '${picratFocus}' 활동을 통해 학생이 질문·탐색·제작·수정에 적극적으로 참여합니다.` : "";

    const out = `(${picratCode}) 학생이 질문·탐색·제작·수정 과정에 적극적으로 참여하는 활동 구조이기 때문입니다. ${core}.
${focusTxt}
또한 공유·피드백·비교 과정을 통해 산출물의 질을 높이고, 학습 과정에 대한 성찰이 가능해집니다.`
      .replace(/\n\n/g, "\n")
      .trim();

    setPicratOut(out);
    toast("PICRAT 이유를 생성했습니다.");
  };

  // 불릿 포인트 생성
  const bullets = (arr) => {
    return arr.map(x => `● ${x}`).join("\n");
  };

  // Needs 생성
  const autoNeeds = () => {
    const support = [
      "기초 디지털 도구 활용 연수 및 실습(수업 적용 사례 중심)",
      "수업 설계 공동 협의(차시 흐름·피드백·평가 요소 점검)",
      "템플릿/루브릭/학생 산출물 예시 제공 및 공유",
      "공개·나눔을 통한 동료 피드백(동학년/동교과)",
      "AI·저작권·개인정보 체크리스트 공유 및 적용"
    ];

    const competency = [
      "기초 디지털 리터러시(문서/공유/기기 활용)",
      "과정 중심 수업 설계 역량(질문 유도, 단계 설계, 피드백 루프)",
      "협력 학습 운영 역량(역할 분담, 상호 점검, 토의 촉진)",
      "평가·기록 역량(관찰 포인트 설정, 루브릭 적용)",
      "AI 리터러시 및 윤리 지도 역량(출처·공정성·개인정보)"
    ];

    const resource = [
      "기기/환경: 태블릿·노트북, 안정적 네트워크, 전원/충전 환경",
      "자료: 수업 템플릿, 예시 산출물, 참고 이미지/영상, 체크리스트",
      "시간: 수업 설계 협의 시간, 공유·피드백 운영 시간",
      "인적 자원: 동학년 협력, 정보/AI 담당 교사, (선택) 외부 강사",
      "운영 도구: 공유 게시 공간(학급 보드/드라이브), 제출/피드백 도구"
    ];

    if (needsFocus) {
      support.unshift(`핵심 포인트( ${needsFocus} )에 맞춘 수업 사례 모음 및 적용 가이드 제공`);
      competency.unshift(`핵심 포인트( ${needsFocus} )를 수업 활동으로 전환하는 설계 역량`);
      resource.unshift(`핵심 포인트( ${needsFocus} ) 실행을 위한 참고 자료 및 운영 도구 정비`);
    }
    if (needsEnv) {
      resource.unshift(`현장 환경 반영: ${needsEnv}`);
    }

    setSupportOut(bullets(support.slice(0, 5)));
    setCompetencyOut(bullets(competency.slice(0, 5)));
    setResourceOut(bullets(resource.slice(0, 5)));
    toast("지원/역량/자원을 생성했습니다.");
  };

  // SAMR 생성
  const autoSamr = () => {
    if (!samrLevel) {
      toast("SAMR 단계를 먼저 선택해주세요.");
      return;
    }

    let out = "";
    if (samrLevel === "S") {
      out = `(S) 기존의 학습 활동을 디지털 도구로 옮겨 수행하는 수준으로, 학습 목표와 활동 구조는 유지되기 때문입니다.
${samrEvidence ? `근거: ${samrEvidence}` : ""}`.trim();
    } else if (samrLevel === "A") {
      out = `(A) 디지털 도구의 기능(즉각 피드백, 정오 확인, 시각화 등)이 학습 효율과 이해를 높이지만, 활동 구조의 큰 변화는 제한적이기 때문입니다.
${samrEvidence ? `근거: ${samrEvidence}` : ""}`.trim();
    } else if (samrLevel === "M") {
      out = `(M) 디지털을 단순히 사용하는 수준을 넘어, 디지털을 전제로 학습 활동(질문·시도·수정·공유·피드백)을 재설계했기 때문입니다.
또한 협력과 피드백 과정이 수업 흐름에 포함되어 학생 참여 방식이 변화합니다.
${samrEvidence ? `근거: ${samrEvidence}` : ""}`.trim();
    } else if (samrLevel === "R") {
      out = `(R) 기술이 없으면 수행하기 어려운 새로운 창작·공유·확장 활동을 통해 학습 경험 자체를 새롭게 정의했기 때문입니다.
학생이 산출물을 제작·공유·성찰(윤리 포함)하는 과정이 수업의 핵심으로 자리합니다.
${samrEvidence ? `근거: ${samrEvidence}` : ""}`.trim();
    }

    setSamrOut(out);
    toast("SAMR 이유를 생성했습니다.");
  };

  // 최종 결과 생성
  const buildFinal = () => {
    const lines = [];
    lines.push(`수업 주제: ${topic || ""}`.trim());
    lines.push(`\nAs-is (나의 기존 수업 분석):\n${asisOut || ""}`.trim());
    lines.push(`\nTo-be (미래 수업 청사진):\n${tobeOut || ""}`.trim());
    lines.push(`\nPICRAT: ( ${picratCode || ""} ) / 이유:\n${picratOut || ""}`.trim());
    lines.push(`\n지원 및 필요:`);
    lines.push(`- 필요한 성장 지원 방안:\n${supportOut || ""}`.trim());
    lines.push(`- 필요한 역량:\n${competencyOut || ""}`.trim());
    lines.push(`- 필요한 자원:\n${resourceOut || ""}`.trim());
    lines.push(`\nSAMR: ( ${samrLevel || ""} ) / 이유:\n${samrOut || ""}`.trim());

    setFinalOut(lines.join("\n"));
    toast("최종 결과를 생성했습니다.");
  };

  // 저장
  const saveDraft = () => {
    const state = {
      topic,
      asis_teacher: asisTeacher,
      asis_tech: asisTech,
      asis_student: asisStudent,
      asis_need: asisNeed,
      asis_out: asisOut,
      tobe_start: tobeStart,
      tobe_flow: tobeFlow,
      tobe_product: tobeProduct,
      tobe_share: tobeShare,
      tobe_eval: tobeEval,
      ethics,
      tobe_out: tobeOut,
      picrat_code: picratCode,
      picrat_focus: picratFocus,
      picrat_out: picratOut,
      needs_focus: needsFocus,
      needs_env: needsEnv,
      support_out: supportOut,
      competency_out: competencyOut,
      resource_out: resourceOut,
      samr_level: samrLevel,
      samr_evidence: samrEvidence,
      samr_out: samrOut,
      final_out: finalOut,
      commitment: commitment,
    };
    localStorage.setItem(KEY, JSON.stringify(state));
    toast("저장했습니다.");
  };

  // 불러오기
  const loadDraft = () => {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      toast("저장된 내용이 없습니다.");
      return;
    }
    const s = JSON.parse(raw);

    setTopic(s.topic || "");
    setAsisTeacher(s.asis_teacher || "교사 설명 중심");
    setAsisTech(s.asis_tech || "자료 제시(영상/슬라이드) 중심");
    setAsisStudent(s.asis_student || []);
    setAsisNeed(s.asis_need || []);
    setAsisOut(s.asis_out || "");
    setTobeStart(s.tobe_start || "문제/질문을 스스로 생성");
    setTobeFlow(s.tobe_flow || "질문/아이디어 → 시도 → 수정·보완 → 공유 → 피드백 반영");
    setTobeProduct(s.tobe_product || "보고서/설명문");
    setTobeShare(s.tobe_share || "모둠 공유 후 전체 피드백");
    setTobeEval(s.tobe_eval || "루브릭/체크리스트를 활용해 자기 점검");
    setEthics(s.ethics || []);
    setTobeOut(s.tobe_out || "");
    setPicratCode(s.picrat_code || "");
    setPicratFocus(s.picrat_focus || "");
    setPicratOut(s.picrat_out || "");
    setNeedsFocus(s.needs_focus || "");
    setNeedsEnv(s.needs_env || "");
    setSupportOut(s.support_out || "");
    setCompetencyOut(s.competency_out || "");
    setResourceOut(s.resource_out || "");
    setSamrLevel(s.samr_level || "");
    setSamrEvidence(s.samr_evidence || "");
    setSamrOut(s.samr_out || "");
    setFinalOut(s.final_out || "");
    setCommitment(s.commitment || "");
    toast("불러왔습니다.");
  };

  // 예시 채우기
  const fillExample = () => {
    setTopic("5학년 과학: 프랙탈(반복·규칙)로 자연 패턴 이해 및 창의적 표현");
    setAsisTeacher("교사 설명 중심");
    setAsisTech("자료 제시(영상/슬라이드) 중심");
    setAsisStudent(["듣기/시청", "개별 작성"]);
    setAsisNeed(["학생 주도성", "피드백 순환(수정·보완)"]);
    setTimeout(() => {
      autoAsIs();
    }, 0);

    setTobeStart("느낌/의도를 언어로 표현");
    setTobeFlow("질문/아이디어 → 시도 → 수정·보완 → 공유 → 피드백 반영");
    setTobeProduct("작품(미술/영상/음성)");
    setTobeShare("온라인 게시(학급 보드/문서) + 댓글 피드백");
    setTobeEval("루브릭/체크리스트를 활용해 자기 점검");
    setEthics(["AI 도움의 범위 점검", "출처/저작권 확인"]);
    setTimeout(() => {
      autoToBe();
    }, 0);

    setPicratCode("IT");
    setPicratFocus("질문→시도→수정·보완→공유");
    setTimeout(() => {
      autoPicrat();
    }, 0);

    setNeedsFocus("협력·피드백, 과정 중심 평가, AI 윤리");
    setNeedsEnv("태블릿 1인 1대(또는 모둠 1대), 학급 보드 활용");
    setTimeout(() => {
      autoNeeds();
    }, 0);

    setSamrLevel("M");
    setSamrEvidence("디지털 전제를 기반으로 활동 흐름(수정·공유·피드백)을 재설계");
    setTimeout(() => {
      autoSamr();
      buildFinal();
    }, 0);
  };

  // 전체 초기화
  const resetAll = () => {
    setTopic("");
    setAsisOut("");
    setTobeOut("");
    setPicratOut("");
    setSupportOut("");
    setCompetencyOut("");
    setResourceOut("");
    setSamrOut("");
    setFinalOut("");
    setPicratFocus("");
    setNeedsFocus("");
    setNeedsEnv("");
    setSamrEvidence("");
    setAsisTeacher("교사 설명 중심");
    setAsisTech("자료 제시(영상/슬라이드) 중심");
    setAsisStudent([]);
    setAsisNeed([]);
    setTobeStart("문제/질문을 스스로 생성");
    setTobeFlow("질문/아이디어 → 시도 → 수정·보완 → 공유 → 피드백 반영");
    setTobeProduct("보고서/설명문");
    setTobeShare("모둠 공유 후 전체 피드백");
    setTobeEval("루브릭/체크리스트를 활용해 자기 점검");
    setEthics([]);
    setPicratCode("");
    setSamrLevel("");
    setCommitment("");
    localStorage.removeItem(KEY);
    toast("초기화했습니다.");
  };

  // 체크박스 옵션들
  const studentOptions = ["듣기/시청", "따라하기", "개별 작성", "질문", "토론", "제작", "공유"];
  const needOptions = ["학생 주도성", "상호작용(협력/토론)", "산출물의 다양성·확장", "피드백 순환(수정·보완)", "과정 중심 평가"];
  const ethicsOptions = ["AI 도움의 범위 점검", "출처/저작권 확인", "개인정보/초상권 주의", "공정성/편향에 대한 질문"];

  // 섹션별 스크롤 이동 (가로 스크롤 컨테이너 내에서)
  const scrollToSection = (sectionId) => {
    // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 실행
    setTimeout(() => {
      const scrollContainer = document.querySelector('.content-scrollable');
      
      if (!scrollContainer) {
        console.error('가로 스크롤 컨테이너를 찾을 수 없습니다.');
        return;
      }
      
      // 컨테이너 내에서 섹션 찾기
      const element = scrollContainer.querySelector(`#${sectionId}`);
      
      if (!element) {
        console.error(`섹션을 찾을 수 없습니다: ${sectionId}`);
        console.log('사용 가능한 섹션:', Array.from(scrollContainer.querySelectorAll('[id$="-section"]')).map(el => el.id));
        return;
      }
      
      // 컨테이너와 요소의 위치 계산
      const containerRect = scrollContainer.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      
      // 현재 스크롤 위치 + 요소의 상대적 위치
      const scrollLeft = scrollContainer.scrollLeft + (elementRect.left - containerRect.left);
      
      scrollContainer.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
      
      console.log(`✅ ${sectionId}로 스크롤 완료:`, scrollLeft);
    }, 100);
  };

  // 공유용 이미지 캡처
  const captureShareImage = async () => {
    if (!shareCardRef.current) {
      toast("캡처할 영역이 없습니다.");
      return;
    }
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `수업청사진_${topic || '결과'}_${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      toast("이미지가 다운로드되었습니다.");
    } catch (error) {
      console.error('이미지 캡처 실패:', error);
      toast("이미지 캡처에 실패했습니다.");
    }
  };

  // Cursor AI 프롬프트 생성 (최종 통합)
  const buildCursorPrompt = () => {
    const lines = [];
    lines.push(`# 수업 설계 개선 요청\n`);
    lines.push(`## 수업 주제\n${topic || "(주제 미입력)"}\n`);
    lines.push(`## 현재 상황 (As-Is)\n${asisOut || "(분석 미완료)"}\n`);
    lines.push(`## 목표 수업 (To-Be)\n${tobeOut || "(청사진 미완료)"}\n`);
    lines.push(`## PICRAT 분석\n- 코드: ${picratCode || "(미선택)"}\n- 이유: ${picratOut || "(미작성)"}\n`);
    if (commitment) {
      lines.push(`## 한 문장 다짐\n${commitment}\n`);
    }
    lines.push(`\n위 정보를 바탕으로 구체적인 수업 설계안과 실행 방안을 제안해주세요.`);
    return lines.join('\n');
  };

  return (
    <div className="app-container">
      {/* 왼쪽 세로 네비게이션 메뉴 */}
      <nav className="nav-menu-vertical">
        <button 
          className={`nav-item ${currentSection === 'failed' ? 'active' : ''}`}
          onClick={() => {
            setCurrentSection('failed');
            scrollToSection('failed-section');
          }}
        >
          🏆 망한 수업 자랑하기
        </button>
        <button 
          className={`nav-item ${currentSection === 'picrat' ? 'active' : ''}`}
          onClick={() => {
            setCurrentSection('picrat');
            scrollToSection('picrat-section');
          }}
        >
          🧠 PICRAT 진단
        </button>
        <button 
          className={`nav-item ${currentSection === 'blueprint' ? 'active' : ''}`}
          onClick={() => {
            setCurrentSection('blueprint');
            scrollToSection('blueprint-section');
          }}
        >
          🧩 As Is → To Be 청사진
        </button>
        <button 
          className={`nav-item ${currentSection === 'worksheet' ? 'active' : ''}`}
          onClick={() => {
            setCurrentSection('worksheet');
            scrollToSection('worksheet-section');
          }}
        >
          📋 워크시트
        </button>
        <button 
          className={`nav-item ${currentSection === 'share' ? 'active' : ''}`}
          onClick={() => {
            setCurrentSection('share');
            scrollToSection('share-section');
          }}
        >
          📤 결과 공유
        </button>
      </nav>

      {/* 메인 컨텐츠 영역 */}
      <div className="main-content">
        <div className="wrap">
          <h1>As-is → To-be 청사진 작성 도우미 (무과금/템플릿 자동조립)</h1>
          <p className="sub">
            이 페이지는 <b>API 없이</b> 동작합니다. 선생님들은 체크/선택 + 짧은 키워드 입력만 하시면,
            장학 보고서 톤 문장이 자동으로 조립됩니다. (필요 시 생성된 문장을 그대로 수정해도 됩니다)<br/>
            <span className="small">※ 학생 개인정보는 입력하지 마세요.</span>
          </p>

          {/* 가로 스크롤 가능한 컨텐츠 영역 */}
          <div className="content-scrollable">
      {/* 망한 수업 자랑하기 섹션 */}
      <div id="failed-section" className="section-content">
        <div className="card">
          <h2>🏆 망한 수업 자랑하기</h2>
          <p className="sub">실패한 수업 경험을 공유하고 함께 성장해요!</p>
          <textarea 
            placeholder="어떤 수업이 예상과 달랐나요? 어떤 점이 아쉬웠나요? 함께 나눠보세요."
            style={{minHeight: '200px'}}
          />
          <div className="row right" style={{marginTop: '10px'}}>
            <button className="btn">공유하기</button>
          </div>
        </div>
      </div>

      {/* PICRAT 진단 섹션 */}
      <div id="picrat-section" className="section-content" data-section="picrat">
        <div className="card">
          <div className="row">
            <label style={{margin:0}}>PICRAT - 선택 + 이유 자동 조립</label>
            <div className="row right">
              <button className="btn" onClick={autoPicrat}>PICRAT 이유 자동작성</button>
            </div>
          </div>

          <div className="two" style={{marginTop:'10px'}}>
            <div>
              <label htmlFor="picrat_code">PICRAT 코드</label>
              <select 
                id="picrat_code" 
                value={picratCode}
                onChange={(e) => setPicratCode(e.target.value)}
              >
                <option value="">(미선택) 추천은 수동으로 선택해주세요</option>
                <option value="PR">PR (Passive–Replace)</option>
                <option value="PA">PA (Passive–Amplify)</option>
                <option value="PT">PT (Passive–Transform)</option>
                <option value="IR">IR (Interactive–Replace)</option>
                <option value="IA">IA (Interactive–Amplify)</option>
                <option value="IT">IT (Interactive–Transform)</option>
                <option value="CR">CR (Creative–Replace)</option>
                <option value="CA">CA (Creative–Amplify)</option>
                <option value="CT">CT (Creative–Transform)</option>
              </select>
              <p className="hint">권장: 수업의 핵심이 "창작+기술로만 가능한 경험"이면 CT, 상호작용으로 학습이 확장되면 IA/IT.</p>
            </div>
            <div>
              <label htmlFor="picrat_focus">근거가 되는 핵심 활동(키워드)</label>
              <input 
                id="picrat_focus" 
                type="text" 
                value={picratFocus}
                onChange={(e) => setPicratFocus(e.target.value)}
                placeholder="예) 질문→수정→공유 / 공동 문서 협업 / 결과물 제작·개선" 
              />
              <p className="hint">짧게 1~2개만 적어도 됩니다.</p>
            </div>
          </div>

          <div className="divider"></div>

          <label htmlFor="picrat_out">PICRAT 선택 이유(수정 가능)</label>
          <textarea 
            id="picrat_out" 
            value={picratOut}
            onChange={(e) => setPicratOut(e.target.value)}
            placeholder="(IT) ~이기 때문. 형태로 자동 생성됩니다."
          />
        </div>
      </div>

      {/* As Is → To Be 청사진 섹션 */}
      <div id="blueprint-section" className="section-content" data-section="blueprint">
      <div className="grid">
        {/* 기본 정보 */}
        <div className="card">
          <div className="row">
            <div style={{flex:1, minWidth:'240px'}}>
              <label htmlFor="topic">수업 주제</label>
              <input 
                id="topic" 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="예) 5학년 과학: 프랙탈(반복·규칙)로 자연 패턴 이해 및 창의적 표현" 
              />
            </div>
            <div className="row right" style={{marginTop: '28px'}}>
              <button className="btn secondary" onClick={fillExample}>예시 채우기</button>
              <button className="btn danger" onClick={resetAll}>전체 초기화</button>
            </div>
          </div>
          <p className="hint">
            팁: "학년/교과/단원/차시/핵심 개념" 정도만 적어도 충분합니다.
          </p>
        </div>

        {/* As-is */}
        <div className="card">
          <div className="row">
            <label style={{margin:0}}>As-is (나의 기존 수업 분석) - 입력(선택/체크)</label>
            <div className="row right">
              <button className="btn" onClick={autoAsIs}>As-is 자동작성</button>
            </div>
          </div>

          <div className="two" style={{marginTop:'10px'}}>
            <div>
              <label htmlFor="asis_teacher">교사 역할 중심</label>
              <select 
                id="asis_teacher" 
                value={asisTeacher}
                onChange={(e) => setAsisTeacher(e.target.value)}
              >
                <option value="교사 설명 중심">교사 설명 중심</option>
                <option value="교사 시범 중심">교사 시범 중심</option>
                <option value="교사 진행·통제 중심">교사 진행·통제 중심</option>
                <option value="혼합(설명+활동 운영)">혼합(설명+활동 운영)</option>
              </select>
            </div>
            <div>
              <label htmlFor="asis_tech">기술 활용 수준</label>
              <select 
                id="asis_tech" 
                value={asisTech}
                onChange={(e) => setAsisTech(e.target.value)}
              >
                <option value="자료 제시(영상/슬라이드) 중심">자료 제시(영상/슬라이드) 중심</option>
                <option value="정답 확인/연습(퀴즈/학습앱) 중심">정답 확인/연습(퀴즈/학습앱) 중심</option>
                <option value="기록/제출(문서/폼) 중심">기록/제출(문서/폼) 중심</option>
                <option value="부분적 협력(공유/댓글) 포함">부분적 협력(공유/댓글) 포함</option>
              </select>
            </div>
          </div>

          <div style={{marginTop:'10px'}}>
            <label>학생 활동 특성(복수 선택)</label>
            <div className="chipbox">
              {studentOptions.map(opt => (
                <label key={opt} className="chip">
                  <input 
                    type="checkbox" 
                    value={opt}
                    checked={asisStudent.includes(opt)}
                    onChange={(e) => handleCheckboxChange(setAsisStudent, opt, e.target.checked)}
                  />
                  {opt}
                </label>
              ))}
            </div>
            <p className="hint">팁: 2~3개만 체크해도 문장이 자연스럽게 조립됩니다.</p>
          </div>

          <div style={{marginTop:'10px'}}>
            <label>개선이 필요한 점(1~2개 선택)</label>
            <div className="chipbox">
              {needOptions.map(opt => (
                <label key={opt} className="chip">
                  <input 
                    type="checkbox" 
                    value={opt}
                    checked={asisNeed.includes(opt)}
                    onChange={(e) => handleCheckboxChange(setAsisNeed, opt, e.target.checked, 2)}
                  />
                  {opt}
                </label>
              ))}
            </div>
            <p className="hint">선택을 2개까지만 권장합니다(장학 문장 간결화).</p>
          </div>

          <div className="divider"></div>

          <label htmlFor="asis_out">As-is 자동 작성 결과(수정 가능)</label>
          <textarea 
            id="asis_out" 
            value={asisOut}
            onChange={(e) => setAsisOut(e.target.value)}
            placeholder="As-is 자동작성 결과가 여기에 생성됩니다."
          />
        </div>

        {/* To-be */}
        <div className="card">
          <div className="row">
            <label style={{margin:0}}>To-be (미래 수업 청사진) - 입력(선택/체크)</label>
            <div className="row right">
              <button className="btn" onClick={autoToBe}>To-be 자동작성</button>
            </div>
          </div>

          <div className="three" style={{marginTop:'10px'}}>
            <div>
              <label htmlFor="tobe_start">출발점(학생이 먼저 하는 일)</label>
              <select 
                id="tobe_start" 
                value={tobeStart}
                onChange={(e) => setTobeStart(e.target.value)}
              >
                <option value="문제/질문을 스스로 생성">문제/질문을 스스로 생성</option>
                <option value="느낌/의도를 언어로 표현">느낌/의도를 언어로 표현</option>
                <option value="관찰·자료 탐색으로 근거 찾기">관찰·자료 탐색으로 근거 찾기</option>
                <option value="실험·시도로 가설 점검">실험·시도로 가설 점검</option>
              </select>
            </div>
            <div>
              <label htmlFor="tobe_flow">핵심 흐름</label>
              <select 
                id="tobe_flow" 
                value={tobeFlow}
                onChange={(e) => setTobeFlow(e.target.value)}
              >
                <option value="질문/아이디어 → 시도 → 수정·보완 → 공유 → 피드백 반영">질문/아이디어 → 시도 → 수정·보완 → 공유 → 피드백 반영</option>
                <option value="탐색 → 설계 → 제작 → 발표/공유 → 개선">탐색 → 설계 → 제작 → 발표/공유 → 개선</option>
                <option value="관찰 → 설명 구성 → 검증 → 공유 → 성찰">관찰 → 설명 구성 → 검증 → 공유 → 성찰</option>
              </select>
            </div>
            <div>
              <label htmlFor="tobe_product">산출물 형태</label>
              <select 
                id="tobe_product" 
                value={tobeProduct}
                onChange={(e) => setTobeProduct(e.target.value)}
              >
                <option value="보고서/설명문">보고서/설명문</option>
                <option value="카드뉴스/포스터">카드뉴스/포스터</option>
                <option value="코딩 결과물/시뮬레이션">코딩 결과물/시뮬레이션</option>
                <option value="작품(미술/영상/음성)">작품(미술/영상/음성)</option>
                <option value="문제 해결 제안서">문제 해결 제안서</option>
              </select>
            </div>
          </div>

          <div className="two" style={{marginTop:'10px'}}>
            <div>
              <label htmlFor="tobe_share">공유/피드백 방식</label>
              <select 
                id="tobe_share" 
                value={tobeShare}
                onChange={(e) => setTobeShare(e.target.value)}
              >
                <option value="모둠 공유 후 전체 피드백">모둠 공유 후 전체 피드백</option>
                <option value="온라인 게시(학급 보드/문서) + 댓글 피드백">온라인 게시(학급 보드/문서) + 댓글 피드백</option>
                <option value="짝/모둠 상호 점검(체크리스트) 후 개선">짝/모둠 상호 점검(체크리스트) 후 개선</option>
                <option value="전시/발표 + 질의응답">전시/발표 + 질의응답</option>
              </select>
            </div>
            <div>
              <label htmlFor="tobe_eval">과정 점검 도구(선택)</label>
              <select 
                id="tobe_eval" 
                value={tobeEval}
                onChange={(e) => setTobeEval(e.target.value)}
              >
                <option value="루브릭/체크리스트를 활용해 자기 점검">루브릭/체크리스트를 활용해 자기 점검</option>
                <option value="중간 점검 질문지를 활용해 수정 방향을 설정">중간 점검 질문지를 활용해 수정 방향을 설정</option>
                <option value="관찰 포인트로 과정 기록(교사/학생)">관찰 포인트로 과정 기록(교사/학생)</option>
              </select>
            </div>
          </div>

          <div style={{marginTop:'10px'}}>
            <label>AI 윤리/출처 성찰 포함 여부</label>
            <div className="chipbox">
              {ethicsOptions.map(opt => (
                <label key={opt} className="chip">
                  <input 
                    type="checkbox" 
                    value={opt}
                    checked={ethics.includes(opt)}
                    onChange={(e) => handleCheckboxChange(setEthics, opt, e.target.checked)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="divider"></div>

          <label htmlFor="tobe_out">To-be 자동 작성 결과(수정 가능)</label>
          <textarea 
            id="tobe_out" 
            value={tobeOut}
            onChange={(e) => setTobeOut(e.target.value)}
            placeholder="To-be 자동작성 결과가 여기에 생성됩니다."
          />
        </div>

        {/* 지원 및 필요 */}
        <div className="card">
          <div className="row">
            <label style={{margin:0}}>지원 및 필요 - 불릿 자동 조립</label>
            <div className="row right">
              <button className="btn" onClick={autoNeeds}>지원/역량/자원 자동작성</button>
            </div>
          </div>

          <div className="two" style={{marginTop:'10px'}}>
            <div>
              <label htmlFor="needs_focus">수업에서 강화하려는 포인트(키워드)</label>
              <input 
                id="needs_focus" 
                type="text" 
                value={needsFocus}
                onChange={(e) => setNeedsFocus(e.target.value)}
                placeholder="예) 협력·피드백 / 산출물 공유 / 과정 중심 평가 / AI 윤리" 
              />
              <p className="hint">선택: 비워도 기본 세트가 생성됩니다.</p>
            </div>
            <div>
              <label htmlFor="needs_env">수업 환경/자원 힌트(선택)</label>
              <input 
                id="needs_env" 
                type="text" 
                value={needsEnv}
                onChange={(e) => setNeedsEnv(e.target.value)}
                placeholder="예) 태블릿 1인1대 / 학급 보드 / 동학년 협의 시간" 
              />
            </div>
          </div>

          <div className="three" style={{marginTop:'10px'}}>
            <div>
              <label htmlFor="support_out">필요한 성장 지원 방안</label>
              <textarea 
                id="support_out" 
                value={supportOut}
                onChange={(e) => setSupportOut(e.target.value)}
                placeholder="● 불릿 3~5개 자동 생성"
              />
            </div>
            <div>
              <label htmlFor="competency_out">필요한 역량</label>
              <textarea 
                id="competency_out" 
                value={competencyOut}
                onChange={(e) => setCompetencyOut(e.target.value)}
                placeholder="● 불릿 3~5개 자동 생성"
              />
            </div>
            <div>
              <label htmlFor="resource_out">필요한 자원</label>
              <textarea 
                id="resource_out" 
                value={resourceOut}
                onChange={(e) => setResourceOut(e.target.value)}
                placeholder="● 불릿 3~5개 자동 생성"
              />
            </div>
          </div>
        </div>

        {/* SAMR */}
        <div className="card">
          <div className="row">
            <label style={{margin:0}}>SAMR - 단계 + 이유 자동 조립</label>
            <div className="row right">
              <button className="btn" onClick={autoSamr}>SAMR 이유 자동작성</button>
            </div>
          </div>

          <div className="two" style={{marginTop:'10px'}}>
            <div>
              <label htmlFor="samr_level">SAMR 단계</label>
              <select 
                id="samr_level" 
                value={samrLevel}
                onChange={(e) => setSamrLevel(e.target.value)}
              >
                <option value="">(미선택)</option>
                <option value="S">S (대체)</option>
                <option value="A">A (증강)</option>
                <option value="M">M (수정)</option>
                <option value="R">R (재정의)</option>
              </select>
            </div>
            <div>
              <label htmlFor="samr_evidence">근거 키워드(선택)</label>
              <input 
                id="samr_evidence" 
                type="text" 
                value={samrEvidence}
                onChange={(e) => setSamrEvidence(e.target.value)}
                placeholder="예) 디지털 전제 재설계 / 기술 없으면 불가 / 협력·피드백 루프" 
              />
            </div>
          </div>

          <div className="divider"></div>

          <label htmlFor="samr_out">SAMR 선택 이유(수정 가능)</label>
          <textarea 
            id="samr_out" 
            value={samrOut}
            onChange={(e) => setSamrOut(e.target.value)}
            placeholder="(M) 디지털을 단순히 사용하는 수준을 넘어… 형태로 자동 생성됩니다."
          />
        </div>

        {/* 최종 출력 */}
        <div className="card">
          <div className="row">
            <label style={{margin:0}}>구글 문서 붙여넣기용 최종 결과</label>
            <div className="row right">
              <button className="btn" onClick={buildFinal}>최종 결과 생성</button>
              <button className="btn" onClick={() => copyText(finalOut)}>전체 복사</button>
              <button className="btn secondary" onClick={saveDraft}>자동 저장</button>
              <button className="btn secondary" onClick={loadDraft}>불러오기</button>
            </div>
          </div>
          <textarea 
            id="final_out" 
            className="mono" 
            style={{minHeight:'240px'}}
            value={finalOut}
            onChange={(e) => setFinalOut(e.target.value)}
            placeholder="최종 결과가 여기에 생성됩니다."
          />
          <p className="hint">'최종 결과 생성' → '전체 복사' → 구글 문서에 붙여넣기.</p>
        </div>
      </div>
      </div>

      {/* 워크시트 섹션 */}
      <div id="worksheet-section" className="section-content" data-section="worksheet">
        <BlueprintWorksheet />
      </div>

      {/* 결과 공유 섹션 */}
      <div id="share-section" className="section-content" data-section="share">
        <div className="card">
          <h2>📤 결과 공유 페이지</h2>
          <p className="sub">연수 마지막 나눔·피드백 단계에서 공유할 수 있는 요약 카드입니다.</p>
          
          {/* 한 문장 다짐 입력 */}
          <div style={{marginTop: '20px', marginBottom: '20px'}}>
            <label htmlFor="commitment">💪 한 문장 다짐</label>
            <input 
              id="commitment"
              type="text" 
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="예) 학생 주도성과 협력을 강화한 수업을 실천하겠습니다."
              style={{width: '100%', padding: '10px', marginTop: '5px'}}
            />
            <p className="hint">연수에서 나눌 한 문장 다짐을 작성해주세요.</p>
          </div>

          {/* 공유용 카드 영역 */}
          <div 
            ref={shareCardRef}
            className="share-card"
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              padding: '30px',
              marginTop: '20px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{textAlign: 'center', marginBottom: '25px'}}>
              <h2 style={{margin: 0, color: '#2c3e50', fontSize: '24px'}}>🎯 수업 설계 개선 결과</h2>
              {topic && (
                <p style={{margin: '10px 0 0 0', color: '#7f8c8d', fontSize: '16px'}}>{topic}</p>
              )}
            </div>

            {/* 나의 망한 수업 상 */}
            {asisOut && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#fff5f5',
                borderRadius: '8px',
                borderLeft: '4px solid #e53e3e'
              }}>
                <h3 style={{margin: '0 0 10px 0', color: '#c53030', fontSize: '18px'}}>🏆 나의 망한 수업 상</h3>
                <p style={{margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>{asisOut}</p>
              </div>
            )}

            {/* PICRAT 코드 */}
            {picratCode && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                borderLeft: '4px solid #3182ce'
              }}>
                <h3 style={{margin: '0 0 10px 0', color: '#2c5282', fontSize: '18px'}}>🧠 PICRAT 코드</h3>
                <div style={{marginBottom: '8px'}}>
                  <strong style={{color: '#2c5282', fontSize: '20px'}}>{picratCode}</strong>
                </div>
                {picratOut && (
                  <p style={{margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>{picratOut}</p>
                )}
              </div>
            )}

            {/* As Is → To Be 요약 */}
            {(asisOut || tobeOut) && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#f0fff4',
                borderRadius: '8px',
                borderLeft: '4px solid #38a169'
              }}>
                <h3 style={{margin: '0 0 15px 0', color: '#22543d', fontSize: '18px'}}>🧩 As Is → To Be 요약</h3>
                {asisOut && (
                  <div style={{marginBottom: '15px'}}>
                    <strong style={{color: '#22543d', display: 'block', marginBottom: '5px'}}>As Is (현재)</strong>
                    <p style={{margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>{asisOut}</p>
                  </div>
                )}
                {tobeOut && (
                  <div>
                    <strong style={{color: '#22543d', display: 'block', marginBottom: '5px'}}>To Be (목표)</strong>
                    <p style={{margin: 0, color: '#2d3748', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>{tobeOut}</p>
                  </div>
                )}
              </div>
            )}

            {/* 한 문장 다짐 */}
            {commitment && (
              <div style={{
                marginBottom: '20px',
                padding: '15px',
                backgroundColor: '#fffaf0',
                borderRadius: '8px',
                borderLeft: '4px solid #d69e2e',
                textAlign: 'center'
              }}>
                <h3 style={{margin: '0 0 10px 0', color: '#744210', fontSize: '18px'}}>💪 한 문장 다짐</h3>
                <p style={{margin: 0, color: '#2d3748', lineHeight: '1.6', fontSize: '16px', fontWeight: '500'}}>{commitment}</p>
              </div>
            )}

            {/* Cursor AI 프롬프트 (최종 통합) */}
            <div style={{
              marginTop: '25px',
              padding: '15px',
              backgroundColor: '#f7fafc',
              borderRadius: '8px',
              border: '1px solid #cbd5e0'
            }}>
              <h3 style={{margin: '0 0 10px 0', color: '#2d3748', fontSize: '18px'}}>🤖 Cursor AI 프롬프트 (최종 통합)</h3>
              <textarea
                readOnly
                value={buildCursorPrompt()}
                style={{
                  width: '100%',
                  minHeight: '150px',
                  padding: '10px',
                  border: '1px solid #cbd5e0',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  backgroundColor: '#ffffff',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="row" style={{marginTop: '20px', flexWrap: 'wrap', gap: '10px'}}>
            <button className="btn" onClick={captureShareImage}>
              📸 이미지로 저장
            </button>
            <button className="btn" onClick={() => copyText(buildCursorPrompt())}>
              📋 Cursor 프롬프트 복사
            </button>
            <button className="btn secondary" onClick={() => {
              const summary = `수업 주제: ${topic || "(미입력)"}\n\n나의 망한 수업 상:\n${asisOut || "(미작성)"}\n\nPICRAT 코드: ${picratCode || "(미선택)"}\n${picratOut || ""}\n\nAs Is → To Be:\n${asisOut || ""}\n↓\n${tobeOut || ""}\n\n한 문장 다짐:\n${commitment || "(미작성)"}`;
              copyText(summary);
            }}>
              📄 요약 복사
            </button>
            <button className="btn secondary" onClick={saveDraft}>💾 저장</button>
            <button className="btn secondary" onClick={loadDraft}>📂 불러오기</button>
          </div>
        </div>
      </div>
      </div>
      {/* 가로 스크롤 컨텐츠 영역 끝 */}
        </div>
      </div>
      {/* 메인 컨텐츠 영역 끝 */}

      <div className={`toast ${toastVisible ? '' : 'hidden'}`}>
        {toastMsg}
      </div>
    </div>
  )
}

export default App




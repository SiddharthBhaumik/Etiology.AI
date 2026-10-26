import { useState } from "react";
import { Activity, Atom, BookOpen, BrainCircuit, FlaskConical, GraduationCap, Menu, Moon, Sun, Search, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

type Page = "Overview" | "AI Study Assistant" | "Research Library" | "Syllabus Explorer" | "Anatomy & Radiology" | "Question Bank";
const pages: {name:Page; icon: typeof Activity; detail:string}[] = [
 {name:"Overview",icon:Activity,detail:"Your medical learning workspace"},
 {name:"AI Study Assistant",icon:BrainCircuit,detail:"Concept explanations and guided revision"},
 {name:"Research Library",icon:FlaskConical,detail:"Discover papers and evidence"},
 {name:"Syllabus Explorer",icon:BookOpen,detail:"Explore your MBBS curriculum"},
 {name:"Anatomy & Radiology",icon:Atom,detail:"Visual learning for anatomy and imaging"},
 {name:"Question Bank",icon:GraduationCap,detail:"Practice MCQs, viva and recall"}
];
const tools = [
 {name:"Study a topic",detail:"Understand concepts, your way",icon:BrainCircuit,page:"AI Study Assistant" as Page},
 {name:"Explore research",detail:"Find papers and evidence",icon:FlaskConical,page:"Research Library" as Page},
 {name:"Browse syllabus",detail:"Follow your MBBS curriculum",icon:BookOpen,page:"Syllabus Explorer" as Page},
 {name:"Practice questions",detail:"MCQs, viva and recall",icon:GraduationCap,page:"Question Bank" as Page}
];
export default function App(){
 const [active,setActive]=useState<Page>("Overview"); const [dark,setDark]=useState(false); const [mobile,setMobile]=useState(false); const [search,setSearch]=useState("");
 const go=(p:Page)=>{setActive(p);setMobile(false)};
 const Icon=pages.find(p=>p.name===active)?.icon ?? Activity;
 return <div className={dark?"app theme-dark":"app"}>
  <aside className={mobile?"sidebar open":"sidebar"}>
   <div className="brand"><div className="brand-icon"><Activity size={21}/></div><div><strong>Etiology<span>.AI</span></strong><small>MEDICAL LEARNING, REIMAGINED</small></div></div>
   <p className="nav-label">YOUR WORKSPACE</p><nav>{pages.map(p=><button key={p.name} className={active===p.name?"nav active":"nav"} onClick={()=>go(p.name)}><p.icon size={18}/>{p.name}{p.name==="AI Study Assistant"&&<span className="ai-tag">AI</span>}</button>)}</nav>
   <div className="side-bottom"><div className="quota"><Sparkles size={17}/><div><b>Free to learn</b><small>AI access will be shared fairly.</small></div></div><div className="user"><div className="avatar">S</div><div><b>Student workspace</b><small>Prototype · not signed in</small></div></div></div>
  </aside>
  {mobile&&<button className="backdrop" aria-label="Close navigation" onClick={()=>setMobile(false)}/>}
  <main className="main"><header className="topbar"><div className="crumb"><button className="menu" onClick={()=>setMobile(true)} aria-label="Open navigation"><Menu/></button>Workspace <span>/</span> <b>{active}</b></div><div className="actions"><label className="search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search anything…"/></label><button className="icon-btn" onClick={()=>setDark(!dark)} aria-label="Toggle theme">{dark?<Sun size={18}/>:<Moon size={18}/>}</button><div className="avatar">S</div></div></header>
  <div className="content">{active==="Overview"?<>
   <div className="welcome"><div><p className="eyebrow">✳ YOUR MEDICAL LEARNING SPACE</p><h1>Welcome to your workspace<span>.</span></h1><p className="muted">A little progress every day adds up to something extraordinary.</p></div><button className="primary" onClick={()=>go("AI Study Assistant")}>＋ Start a study session</button></div>
   <section className="hero"><div className="hero-copy"><p className="eyebrow">✧ YOUR PERSONAL STUDY COMPANION</p><h2>Understand more.<br/><em>Memorise less.</em></h2><p>Build clinical understanding, strengthen your fundamentals, and learn to think like a doctor — one concept at a time.</p><button className="hero-btn" onClick={()=>go("AI Study Assistant")}>Explore AI study assistant <ArrowRight size={16}/></button><small><ShieldCheck size={14}/> Designed for learning, not clinical decision-making</small></div><div className="hero-visual"><div className="orb"><Activity size={48}/><b>ETIOLOGY</b><small>LEARN · REASON · DISCOVER</small></div><div className="float f1"><BrainCircuit/></div><div className="float f2"><Atom/></div><div className="float f3"><FlaskConical/></div></div></section>
   <section className="section"><div className="section-head"><div><h3>Where would you like to begin?</h3><p>Pick up where curiosity takes you.</p></div><span>YOUR STUDY TOOLS ↗</span></div><div className="tools">{tools.map(t=><button className="tool" key={t.name} onClick={()=>go(t.page)}><div className="tool-icon"><t.icon size={21}/></div><b>{t.name}</b><p>{t.detail}</p><ArrowRight className="arrow" size={17}/></button>)}</div></section>
   <section className="section lower"><div className="panel"><h3>Your learning map</h3><p className="muted">Illustrative curriculum progress</p>{[["Anatomy","1st Professional",68],["Physiology","1st Professional",42],["Biochemistry","1st Professional",31]].map(([name,year,progress])=><div className="progress-row" key={name as string}><div><b>{name}</b><small>{year}</small></div><div className="bar"><span style={{width:progress+"%"}}/></div><strong>{progress}%</strong></div>)}</div><div className="panel"><h3>Built for curious minds</h3><p className="muted">A calm place to connect mechanisms, evidence and clinical context.</p><div className="callout"><ShieldCheck size={20}/><div><b>Learning-first by design</b><p>Educational content is not a substitute for clinical judgement or supervision.</p></div></div></div></section>
  </>:<section className="module"><div className="module-icon"><Icon size={25}/></div><p className="eyebrow">ETIOLOGY.AI WORKSPACE</p><h1>{active}</h1><p className="muted">{pages.find(p=>p.name===active)?.detail}.</p><div className="notice"><ShieldCheck size={20}/><div><b>This module is a prototype</b><p>The interface is ready to build on, but live AI, research APIs, curriculum data and question content have not been connected yet.</p></div></div>{active==="AI Study Assistant"&&<div className="prompt-box"><label htmlFor="study-prompt">What would you like to understand?</label><textarea id="study-prompt" placeholder="e.g. Explain the renin–angiotensin–aldosterone system…"/><button className="primary" onClick={()=>alert("The AI service is not connected in this prototype yet.")}>Prepare study prompt <ArrowRight size={16}/></button><small>No prompt is sent anywhere in this prototype.</small></div>}{active==="Research Library"&&<p className="module-hint">Planned sources include PubMed, Europe PMC, Crossref and ClinicalTrials.gov, with source links and citations.</p>}{active==="Syllabus Explorer"&&<p className="module-hint">Curriculum mapping and subject content will be added after the relevant syllabus sources are verified.</p>}{active==="Anatomy & Radiology"&&<p className="module-hint">Licensed anatomy assets and appropriately sourced imaging datasets will be required before publishing visual content.</p>}{active==="Question Bank"&&<p className="module-hint">Question sets, explanations and source attribution will be added in a later phase.</p>}</section>}
   <footer><span>© Etiology.AI · Built for medical learning</span><span>Educational use only · Prototype</span></footer>
  </div></main></div>
}
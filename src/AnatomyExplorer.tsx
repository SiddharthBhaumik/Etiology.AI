import { useState } from "react";
import type { CSSProperties } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Activity, Bone, Brain, Check, ChevronDown, CircleHelp, Eye, EyeOff, HeartPulse, Layers3, RotateCcw, ScanLine, Search, ShieldCheck, Wind } from "lucide-react";
import "./AnatomyExplorer.css";

type System = "All systems" | "Skeletal" | "Nervous" | "Respiratory" | "Cardiovascular" | "Digestive";
type Structure = { id: string; name: string; system: Exclude<System, "All systems">; color: string; position: [number, number, number]; scale: [number, number, number]; location: string; function: string; imaging: string };
const structures: Structure[] = [
 {id:"brain",name:"Brain",system:"Nervous",color:"#d8a7c7",position:[0,1.78,.3],scale:[.34,.3,.26],location:"Cranial cavity",function:"Integrates sensory information, coordinates movement, and supports cognition, memory, and autonomic regulation.",imaging:"On axial CT, compare grey and white matter, the ventricles, and symmetry of the cerebral hemispheres."},
 {id:"spine",name:"Vertebral column",system:"Skeletal",color:"#e6d8bc",position:[0,.05,.18],scale:[.12,1.15,.1],location:"Midline, posterior trunk",function:"Supports the body, protects the spinal cord, and provides attachment for ribs and muscles.",imaging:"On lateral spine imaging, assess vertebral alignment, body height, disc spaces, and posterior elements."},
 {id:"lungs",name:"Lungs",system:"Respiratory",color:"#e69a9d",position:[0,.48,.23],scale:[.55,.48,.17],location:"Thoracic cavity, either side of the mediastinum",function:"Exchange oxygen and carbon dioxide across the alveolar-capillary membrane.",imaging:"On chest radiography, compare lung volumes, air-space opacity, pleural spaces, and costophrenic angles."},
 {id:"heart",name:"Heart",system:"Cardiovascular",color:"#d95e69",position:[.02,.26,.48],scale:[.2,.25,.17],location:"Middle mediastinum, slightly left of midline",function:"Generates the pressure needed to circulate blood through pulmonary and systemic circuits.",imaging:"On chest radiography, assess the cardiac silhouette alongside the lungs and mediastinum."},
 {id:"liver",name:"Liver",system:"Digestive",color:"#b87958",position:[.23,-.16,.26],scale:[.36,.19,.13],location:"Right upper quadrant, beneath the diaphragm",function:"Produces bile, processes nutrients, stores glycogen, and metabolises many substances.",imaging:"On abdominal ultrasound or CT, assess contour, parenchymal appearance, and surrounding fluid."},
 {id:"stomach",name:"Stomach",system:"Digestive",color:"#e7b36e",position:[-.24,-.23,.3],scale:[.19,.26,.13],location:"Upper abdomen, predominantly left of midline",function:"Stores food and begins mechanical and chemical digestion.",imaging:"Its position and contents vary; correlate cross-sectional findings with the clinical question."},
 {id:"kidneys",name:"Kidneys",system:"Digestive",color:"#a96b79",position:[.39,-.42,.06],scale:[.12,.18,.1],location:"Retroperitoneum, either side of the spine",function:"Filter blood, regulate fluid and electrolyte balance, and contribute to blood-pressure control.",imaging:"On CT or ultrasound, compare renal size, position, collecting systems, and perinephric spaces."},
 {id:"intestines",name:"Intestines",system:"Digestive",color:"#d7a36e",position:[0,-.54,.29],scale:[.31,.18,.12],location:"Abdominal cavity",function:"Digest and absorb nutrients and water; the large bowel also compacts stool.",imaging:"On abdominal imaging, assess bowel calibre, distribution, wall appearance, and surrounding fat."}
];
const systems: System[] = ["All systems","Skeletal","Nervous","Respiratory","Cardiovascular","Digestive"];

function Shape({item, selected, onSelect}:{item:Structure;selected:boolean;onSelect:(id:string)=>void}) {
 return <mesh position={item.position} scale={item.scale} onClick={e=>{e.stopPropagation();onSelect(item.id)}} onPointerOver={()=>{document.body.style.cursor="pointer"}} onPointerOut={()=>{document.body.style.cursor="default"}} castShadow>
  <sphereGeometry args={[1,24,18]}/>
  <meshStandardMaterial color={selected?"#7c8df2":item.color} roughness={.5} emissive={selected?"#3546a5":"#000000"} emissiveIntensity={selected ? 0.25 : 0}/>
 </mesh>;
}
function BoneSegment({position,scale,rotation=[0,0,0]}:{position:[number,number,number];scale:[number,number,number];rotation?:[number,number,number]}) {
 return <mesh position={position} scale={scale} rotation={rotation}><capsuleGeometry args={[.055,.24,4,8]}/><meshStandardMaterial color="#e6d8bc" roughness={.7}/></mesh>;
}
function Body({selected,onSelect,organs,skeleton,system}:{selected:string;onSelect:(id:string)=>void;organs:boolean;skeleton:boolean;system:System}) {
 const bodyMaterial = <meshStandardMaterial color="#aab7c8" transparent opacity={.2} roughness={.8}/>;
 return <group position={[0,-.12,0]}>
  <mesh position={[0,.45,-.12]} scale={[.67,.88,.28]}><capsuleGeometry args={[.48,.72,8,16]}/>{bodyMaterial}</mesh>
  <mesh position={[0,-.62,-.12]} scale={[.42,.28,.24]}><sphereGeometry args={[1,24,16]}/>{bodyMaterial}</mesh>
  <mesh position={[0,1.78,-.1]} scale={[.31,.34,.25]}><sphereGeometry args={[1,24,16]}/>{bodyMaterial}</mesh>
  <mesh position={[0,1.38,-.1]} scale={[.12,.17,.13]}><cylinderGeometry args={[.1,.12,.35,16]}/>{bodyMaterial}</mesh>
  {[-1,1].map(side=><group key={side}>
   <mesh position={[side*.81,.43,-.13]} rotation={[0,0,side*-.16]}><capsuleGeometry args={[.13,.72,6,12]}/>{bodyMaterial}</mesh>
   <mesh position={[side*.94,-.28,-.13]}><capsuleGeometry args={[.095,.6,6,12]}/>{bodyMaterial}</mesh>
   <mesh position={[side*.34,-1.3,-.1]}><capsuleGeometry args={[.15,.83,6,12]}/>{bodyMaterial}</mesh>
   <mesh position={[side*.35,-2.05,-.1]}><capsuleGeometry args={[.105,.58,6,12]}/>{bodyMaterial}</mesh>
  </group>)}
  {skeleton && <group>
   <mesh position={[0,1.78,.12]} scale={[.28,.29,.21]}><sphereGeometry args={[1,18,14]}/><meshStandardMaterial color="#e6d8bc"/></mesh>
   {Array.from({length:12},(_,i)=><BoneSegment key={i} position={[0,1.2-i*.21,.18]} scale={[.8,.65,.7]}/>)}
   {[-1,1].map(side=><group key={side}>
    <BoneSegment position={[side*.32,.86,.04]} scale={[1.2,.6,.7]} rotation={[0,0,side*.85]}/>
    {Array.from({length:6},(_,i)=><BoneSegment key={i} position={[side*(.2+i*.035),.57-i*.08,.12]} scale={[.55,.4,.5]} rotation={[0,0,side*(.18+i*.08)]}/>)}
    <BoneSegment position={[side*.8,.35,.02]} scale={[.75,.7,.7]}/>
    <BoneSegment position={[side*.94,-.23,.02]} scale={[.65,.7,.7]}/>
    <BoneSegment position={[side*.34,-1.22,.04]} scale={[1.05,1.7,.8]}/>
    <BoneSegment position={[side*.35,-2.03,.04]} scale={[.8,1.25,.8]}/>
   </group>)}
  </group>}
  {organs && structures.filter(item=>item.system!=="Skeletal"&&(system==="All systems"||item.system===system)).map(item=><Shape key={item.id} item={item} selected={selected===item.id} onSelect={onSelect}/>)}
 </group>;
}
export default function AnatomyExplorer() {
 const [viewMode,setViewMode]=useState<"atlas"|"schematic">("atlas");
 const [system,setSystem]=useState<System>("All systems"),[selectedId,setSelectedId]=useState("heart"),[organs,setOrgans]=useState(true),[skeleton,setSkeleton]=useState(false),[details,setDetails]=useState(true),[query,setQuery]=useState("");
 const selected=structures.find(item=>item.id===selectedId)??structures[0];
 const filtered=structures.filter(item=>(system==="All systems"||item.system===system)&&(item.name.toLowerCase().includes(query.toLowerCase())||item.system.toLowerCase().includes(query.toLowerCase())));
 const pickSystem=(item:System)=>{setSystem(item);const next=structures.find(s=>item==="All systems"||s.system===item);if(next)setSelectedId(next.id);if(item==="Skeletal")setSkeleton(true)};
 return <section className="anatomy-explorer">
  <div className="anatomy-heading"><div><p className="eyebrow">INTERACTIVE LEARNING LAB</p><h1>Anatomy <span>&</span> Radiology</h1><p className="muted">Explore body systems in 3D, select a structure, and connect anatomy to imaging.</p></div><div className="anatomy-status"><i/> 3D EXPLORER <b/> LEARNING MODE</div></div>
  <div className="anatomy-view-switch" role="tablist" aria-label="Anatomy model source"><button role="tab" aria-selected={viewMode==="atlas"} className={viewMode==="atlas"?"active":""} onClick={()=>setViewMode("atlas")}><Layers3 size={15}/> Real 3D atlas</button><button role="tab" aria-selected={viewMode==="schematic"} className={viewMode==="schematic"?"active":""} onClick={()=>setViewMode("schematic")}><Activity size={15}/> Schematic preview</button></div>
  {viewMode==="atlas" ? <section className="external-atlas"><div className="external-atlas-head"><div><b>Interactive human anatomy atlas</b><p>Detailed, selectable anatomical structures from Ana3D’s Z-Anatomy atlas. This viewer is hosted by Ana3D.</p></div><a href="https://ana3d.app/en/atlas/z-anatomy/" target="_blank" rel="noreferrer">Open atlas in a new tab ↗</a></div><iframe title="Ana3D interactive human anatomy atlas" src="https://ana3d.app/en/atlas/z-anatomy/" loading="lazy" allow="fullscreen" referrerPolicy="strict-origin-when-cross-origin"/><div className="external-atlas-foot"><span>Model source: Z-Anatomy · CC BY-SA 4.0</span><span>If the embedded viewer does not load, use “Open atlas in a new tab”.</span></div></section> : <div className="anatomy-workspace">
   <aside className="anatomy-sidebar">
    <div className="anatomy-panel-title"><Layers3 size={16}/>Explore systems</div>
    <label className="anatomy-search"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a structure"/></label>
    <div className="system-list">{systems.map(item=><button key={item} className={system===item?"system-option active":"system-option"} onClick={()=>pickSystem(item)}><span className={"system-dot dot-"+item.toLowerCase().replace(" ","-")}/><span>{item}</span>{system===item&&<Check size={14}/>}</button>)}</div>
    <div className="anatomy-divider"/>
    <div className="anatomy-panel-title"><Eye size={16}/>Visible layers</div>
    <button className="layer-option" onClick={()=>setOrgans(v=>!v)}><span><i className="layer-swatch organs"/>Organs & soft tissue</span>{organs?<Eye size={16}/>:<EyeOff size={16}/>}</button>
    <button className="layer-option" onClick={()=>setSkeleton(v=>!v)}><span><i className="layer-swatch bones"/>Skeleton overlay</span>{skeleton?<Eye size={16}/>:<EyeOff size={16}/>}</button>
    <div className="anatomy-note"><CircleHelp size={15}/><p>Drag to rotate. Scroll to zoom. Select a structure to learn more.</p></div>
    <div className="anatomy-disclaimer"><ShieldCheck size={15}/><p>Educational illustration, not for diagnosis or treatment.</p></div>
   </aside>
   <div className="anatomy-stage">
    <div className="stage-topline"><span><i/> LIVE MODEL</span><button onClick={()=>{setSystem("All systems");setSelectedId("heart");setOrgans(true);setSkeleton(false)}}><RotateCcw size={13}/> Reset view</button></div>
    <div className="canvas-wrap"><Canvas camera={{position:[0,0,7.5],fov:38}} dpr={[1,1.8]} gl={{antialias:true,alpha:true}}><color attach="background" args={["#f4f7fb"]}/><ambientLight intensity={1.5}/><directionalLight position={[4,5,7]} intensity={2.2}/><directionalLight position={[-4,2,-3]} intensity={1.1} color="#c6d4ff"/><Body selected={selectedId} onSelect={setSelectedId} organs={organs} skeleton={skeleton} system={system}/><OrbitControls enablePan={false} minDistance={5} maxDistance={11} minPolarAngle={.45} maxPolarAngle={Math.PI-.45}/></Canvas><div className="canvas-caption"><span>ANTERIOR VIEW</span><span>ROTATE 360°</span></div><div className="stage-axis"><span>R</span><span>L</span></div></div>
    <div className="structure-strip">{filtered.slice(0,5).map(item=><button key={item.id} className={selectedId===item.id?"structure-chip selected":"structure-chip"} onClick={()=>setSelectedId(item.id)}><i style={{background:item.color}}/>{item.name}</button>)}</div>
   </div>
   <aside className={details?"anatomy-details":"anatomy-details collapsed"}>
    <div className="details-header"><div><p className="details-kicker">SELECTED STRUCTURE</p><h2>{selected.name}</h2></div><button aria-label="Toggle details" onClick={()=>setDetails(v=>!v)}><ChevronDown size={16}/></button></div>
    {details&&<><span className="system-pill" style={{"--pill-color":selected.color} as CSSProperties}>{selected.system}</span>
     <div className="detail-illustration"><div className="detail-orb" style={{background:selected.color+"25",borderColor:selected.color+"80"}}>{selected.system==="Nervous"?<Brain size={38}/>:selected.system==="Cardiovascular"?<HeartPulse size={38}/>:selected.system==="Respiratory"?<Wind size={38}/>:selected.system==="Skeletal"?<Bone size={38}/>:<Activity size={38}/>}</div><span>ANATOMICAL OVERVIEW</span></div>
     <div className="detail-block"><h3>Location</h3><p>{selected.location}</p></div><div className="detail-block"><h3>Function</h3><p>{selected.function}</p></div>
     <div className="imaging-card"><div className="imaging-title"><ScanLine size={15}/><b>Radiology connection</b></div><p>{selected.imaging}</p><span>STUDY NOTE · VERIFY WITH STANDARD REFERENCES</span></div>
     <button className="detail-quiz" onClick={()=>window.alert("Quick recall: "+selected.name+" — "+selected.function)}><Brain size={15}/> Quick recall <span>↗</span></button>
    </>}
   </aside>
  </div>}
  <div className="anatomy-footer"><span><i/> BUILT FOR MEDICAL LEARNING</span><span>{viewMode==="atlas"?"External model: Ana3D / Z-Anatomy · CC BY-SA 4.0; derived from BodyParts3D.":"Schematic preview only; not anatomically detailed."}</span></div>
 </section>;
}

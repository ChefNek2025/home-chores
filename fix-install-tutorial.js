const fs = require('fs');
let code = fs.readFileSync('pages/index.tsx', 'utf8');

const tutorialSection = `
        {/* Install Tutorial Section */}
        <div style={{ background:'#0D1117', padding:'60px 24px' }}>
          <div style={{ maxWidth:700, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{ fontSize:13, color:'#1D9E75', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase' as any, marginBottom:8 }}>No App Store needed</div>
              <h2 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:8, letterSpacing:'-0.5px' }}>Install Seru Chores on your phone</h2>
              <p style={{ color:'#666', fontSize:15, lineHeight:1.6 }}>Works like a real app — follow these steps after scanning the QR code!</p>
            </div>

            {/* OS Tabs */}
            <InstallTutorial />
          </div>
        </div>`;

// Add the InstallTutorial component before the export default
const componentCode = `
function InstallTutorial() {
  const [os, setOs] = React.useState('ios');
  const [step, setStep] = React.useState(0);

  const iosSteps = [
    { num:1, title:'Open Safari browser', hint:'Must use Safari — not Chrome!', icon:'🧭' },
    { num:2, title:'Go to seruchores.com', hint:'Type it in the Safari address bar', icon:'🌐' },
    { num:3, title:'Tap the Share button ⬆️', hint:'The box with arrow at the bottom toolbar', icon:'📤' },
    { num:4, title:'Tap "Add to Home Screen"', hint:'Scroll down in the share sheet to find it', icon:'➕' },
    { num:5, title:'Tap "Add" — done! 🎉', hint:'Seru Chores icon now appears on your home screen!', icon:'✅' },
  ];

  const andSteps = [
    { num:1, title:'Open Chrome browser', hint:'Chrome is the green/yellow/red circle icon', icon:'🌐' },
    { num:2, title:'Go to seruchores.com', hint:'Type it in the Chrome address bar', icon:'🔍' },
    { num:3, title:'Tap Menu ⋮ (top right)', hint:'Three dots in the top right corner of Chrome', icon:'⋮' },
    { num:4, title:'Tap "Add to Home Screen"', hint:'Then tap "Add" to confirm', icon:'➕' },
    { num:5, title:'Tap "Add" — done! 🎉', hint:'Seru Chores icon now appears on your home screen!', icon:'✅' },
  ];

  const steps = os === 'ios' ? iosSteps : andSteps;

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:24 }}>
        <button onClick={() => { setOs('ios'); setStep(0); }}
          style={{ padding:'10px 24px', borderRadius:12, border:'none', cursor:'pointer', fontSize:14, fontWeight:700,
            background: os==='ios' ? '#1D9E75' : '#1A1A1A', color: os==='ios' ? '#fff' : '#666' }}>
          🍎 iPhone (Safari)
        </button>
        <button onClick={() => { setOs('android'); setStep(0); }}
          style={{ padding:'10px 24px', borderRadius:12, border:'none', cursor:'pointer', fontSize:14, fontWeight:700,
            background: os==='android' ? '#1D9E75' : '#1A1A1A', color: os==='android' ? '#fff' : '#666' }}>
          🤖 Android (Chrome)
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height:4, background:'#1A1A1A', borderRadius:2, marginBottom:24 }}>
        <div style={{ height:'100%', background:'#1D9E75', borderRadius:2, width: ((step+1)/steps.length*100)+'%', transition:'width 0.4s' }} />
      </div>

      {/* Steps */}
      <div style={{ display:'grid', gap:10, marginBottom:24 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{ display:'flex', alignItems:'center', gap:14, background: i===step?'#1A2A1A': i<step?'#111':'#111',
            borderRadius:16, padding:'14px 18px', border: i===step?'2px solid #1D9E75': i<step?'1px solid #333':'1px solid #222', cursor:'pointer' }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background: i<step?'#1D9E75': i===step?'#1D9E75':'#1A1A1A',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize: i<step?16:18, fontWeight:700, color:'#fff', flexShrink:0 }}>
              {i < step ? '✓' : s.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color: i===step?'#fff': i<step?'#9FE1CB':'#555' }}>{s.title}</div>
              <div style={{ fontSize:12, color: i===step?'#9FE1CB':'#444', marginTop:2 }}>{s.hint}</div>
            </div>
            {i === step && <div style={{ fontSize:12, color:'#1D9E75', fontWeight:700 }}>← NOW</div>}
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={() => setStep(Math.max(0, step-1))} disabled={step===0}
          style={{ flex:1, padding:'12px', borderRadius:12, border:'1px solid #333', background:'#111', color: step===0?'#333':'#fff', fontSize:14, fontWeight:700, cursor: step===0?'default':'pointer' }}>
          ← Back
        </button>
        <button onClick={() => setStep(step === steps.length-1 ? 0 : step+1)}
          style={{ flex:2, padding:'12px', borderRadius:12, border:'none', background:'#1D9E75', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' }}>
          {step === steps.length-1 ? '↺ Start over' : 'Next step →'}
        </button>
      </div>

      {/* Final success message */}
      {step === steps.length-1 && (
        <div style={{ marginTop:16, background:'#0F6E56', borderRadius:16, padding:'16px 20px', textAlign:'center' }}>
          <div style={{ fontSize:24, marginBottom:4 }}>🎉</div>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>You're all set!</div>
          <div style={{ fontSize:13, color:'#9FE1CB' }}>Seru Chores is now installed on your home screen like a real app!</div>
        </div>
      )}
    </div>
  );
}

`;

// Add React import if not already there
if (!code.includes("import React")) {
  code = code.replace("import { useEffect", "import React, { useEffect");
}

// Add component before the export default
code = code.replace("export default function", componentCode + "export default function");

// Add tutorial section before the footer
code = code.replace("      </footer>", tutorialSection + "\n      </footer>");

fs.writeFileSync('pages/index.tsx', code);
console.log('done! tutorial:', code.indexOf('Install Tutorial Section'), 'component:', code.indexOf('InstallTutorial'));
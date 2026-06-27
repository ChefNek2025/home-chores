const fs = require('fs');
let code = fs.readFileSync('pages/index.tsx', 'utf8');

const installSection = `
        {/* Install App Section */}
        <div style={{ background:'#0D1117', padding:'60px 24px' }}>
          <div style={{ maxWidth:600, margin:'0 auto', textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📱</div>
            <h2 style={{ fontSize:28, fontWeight:900, color:'#fff', marginBottom:8, letterSpacing:'-0.5px' }}>
              Install Seru Chores on your phone
            </h2>
            <p style={{ color:'#666', fontSize:15, marginBottom:32, lineHeight:1.6 }}>
              No App Store needed! Add it to your home screen in seconds.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
              <div style={{ background:'#1A1A1A', borderRadius:20, padding:24, border:'1px solid #333', textAlign:'left' }}>
                <div style={{ fontSize:28, marginBottom:10 }}>🍎</div>
                <div style={{ fontWeight:800, fontSize:16, color:'#fff', marginBottom:12 }}>iPhone / iPad</div>
                {['Open Safari browser','Go to seruchores.com','Tap Share button','Tap Add to Home Screen','Tap Add — done!'].map((step, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:'#1D9E75', color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:13, color:'#C9D1D9' }}>{step}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'#1A1A1A', borderRadius:20, padding:24, border:'1px solid #333', textAlign:'left' }}>
                <div style={{ fontSize:28, marginBottom:10 }}>🤖</div>
                <div style={{ fontWeight:800, fontSize:16, color:'#fff', marginBottom:12 }}>Android</div>
                {['Open Chrome browser','Go to seruchores.com','Tap Menu top right','Tap Add to Home Screen','Tap Add — done!'].map((step, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                    <div style={{ width:22, height:22, borderRadius:'50%', background:'#1D9E75', color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</div>
                    <span style={{ fontSize:13, color:'#C9D1D9' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'#1D9E75', borderRadius:16, padding:'16px 24px' }}>
              <span style={{ color:'#fff', fontWeight:700, fontSize:14 }}>Works like a real app — no App Store, no download, no cost!</span>
            </div>
          </div>
        </div>`;

// Find the last </div> before the closing return
const anchor = '</div>\n  );\n}';
const lastIdx = code.lastIndexOf(anchor);
if (lastIdx !== -1) {
  code = code.slice(0, lastIdx) + installSection + '\n' + code.slice(lastIdx);
  fs.writeFileSync('pages/index.tsx', code);
  console.log('Done! Size:', code.length);
} else {
  console.log('Anchor not found! Trying alternative...');
  // Show last 200 chars to debug
  console.log(code.slice(-200));
}
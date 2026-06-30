const fs = require('fs');
let code = fs.readFileSync('pages/dashboard.tsx', 'utf8');
const idx = code.indexOf('        {/* PHOTOS */}');
const content = 
        {tab === 'earnings2' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:4 }}>💳 Pay Your Kids</h2>
            <p style={{ fontSize:13, color:'#888', marginBottom:20 }}>Review earnings and choose how to pay!</p>
            <div style={{ display:'grid', gap:12, marginBottom:24 }}>
              {kids.map(kid => {
                const kc = chores.filter(c => c.assign_to === 'both' || c.assign_to === kid.id);
                const we = kc.reduce((a,c) => a + Number(c.pay_per_completion), 0);
                return (
                  <div key={kid.id} style={{ background:'#fff', borderRadius:20, padding:20, border:'1px solid #EBEBEB', display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, color:'#0F6E56' }}>{kid.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:16, color:'#0D1117' }}>{kid.name}</div>
                      <div style={{ fontSize:13, color:'#888' }}>{kc.length} chores</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:26, fontWeight:900, color:'#1D9E75' }}>\</div>
                      <div style={{ fontSize:11, color:'#888' }}>per day</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'#0D1117', marginBottom:16 }}>🏆 Give kids a real debit card</h3>
              <a href="https://greenlight.com" target="_blank" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F0FBF7', borderRadius:14, padding:14, border:'2px solid #1D9E75' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#1D9E75', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', flexShrink:0 }}>GL</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0D1117' }}>Greenlight <span style={{ background:'#1D9E75', color:'#fff', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6 }}>BEST</span></div>
                    <div style={{ fontSize:12, color:'#666' }}>Real Visa card · Any age · .99/month</div>
                  </div>
                  <div style={{ fontSize:13, color:'#1D9E75', fontWeight:700 }}>Get started →</div>
                </div>
              </a>
              <a href="https://step.com" target="_blank" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F7F7F5', borderRadius:14, padding:14, border:'1px solid #EBEBEB' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', flexShrink:0 }}>ST</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0D1117' }}>Step <span style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6 }}>FREE</span></div>
                    <div style={{ fontSize:12, color:'#666' }}>Free Visa card · Ages 13-18 · Builds credit</div>
                  </div>
                  <div style={{ fontSize:13, color:'#4F46E5', fontWeight:700 }}>Get started →</div>
                </div>
              </a>
              <a href="https://current.com" target="_blank" style={{ textDecoration:'none', display:'block' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F7F7F5', borderRadius:14, padding:14, border:'1px solid #EBEBEB' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', flexShrink:0 }}>CU</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0D1117' }}>Current <span style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6 }}>FREE</span></div>
                    <div style={{ fontSize:12, color:'#666' }}>Free Visa card · Ages 13-18 · Spend controls</div>
                  </div>
                  <div style={{ fontSize:13, color:'#333', fontWeight:700 }}>Get started →</div>
                </div>
              </a>
            </div>
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB' }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'#0D1117', marginBottom:16 }}>💸 Pay manually</h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                {[{name:'Venmo',color:'#008CFF',url:'https://venmo.com'},{name:'Zelle',color:'#6D1ED4',url:'https://zellepay.com'},{name:'Cash App',color:'#00C244',url:'https://cash.app'}].map(app => (
                  <a key={app.name} href={app.url} target="_blank" style={{ textDecoration:'none' }}>
                    <div style={{ background:'#F7F7F5', borderRadius:12, padding:'14px 8px', textAlign:'center', border:'1px solid #EBEBEB' }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:app.color, margin:'0 auto 6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900, color:'#fff' }}>{app.name[0]}</div>
                      <div style={{ fontSize:12, fontWeight:600, color:'#333' }}>{app.name}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
;
code = code.slice(0, idx) + content + code.slice(idx);
fs.writeFileSync('pages/dashboard.tsx', code);
console.log('done! photos:', code.indexOf('PHOTOS'));

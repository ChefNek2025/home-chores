const fs = require('fs');
let code = fs.readFileSync('pages/dashboard.tsx', 'utf8');

// Replace the entire partner cards section
const oldSection = `              <h3 style={{ fontSize:14, fontWeight:700, color:'#0D1117', marginBottom:4 }}>🏆 Give kids a real debit card</h3>
              <p style={{ fontSize:12, color:'#aaa', marginBottom:16 }}>Kids get a real Visa debit card. You control every purchase. See spending in real time!</p>
              <a href="https://greenlight.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F0FBF7', borderRadius:14, padding:14, border:'2px solid #1D9E75' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#1D9E75', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', flexShrink:0 }}>GL</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0D1117' }}>Greenlight <span style={{ background:'#1D9E75', color:'#fff', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6 }}>BEST</span></div>
                    <div style={{ fontSize:12, color:'#666' }}>Real Visa card · Any age · \\$5.99/month · Parents control spending</div>
                  </div>
                  <div style={{ fontSize:13, color:'#1D9E75', fontWeight:700 }}>Get started →</div>
                </div>
              </a>
              <a href="https://step.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F7F7F5', borderRadius:14, padding:14, border:'1px solid #EBEBEB' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', flexShrink:0 }}>ST</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0D1117' }}>Step <span style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6 }}>FREE</span></div>
                    <div style={{ fontSize:12, color:'#666' }}>Free Visa card · Ages 13-18 · Builds credit history</div>
                  </div>
                  <div style={{ fontSize:13, color:'#4F46E5', fontWeight:700 }}>Get started →</div>
                </div>
              </a>
              <a href="https://current.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', display:'block' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F7F7F5', borderRadius:14, padding:14, border:'1px solid #EBEBEB' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', flexShrink:0 }}>CU</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0D1117' }}>Current <span style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6 }}>FREE</span></div>
                    <div style={{ fontSize:12, color:'#666' }}>Free Visa card · Ages 13-18 · Spend controls by category</div>
                  </div>
                  <div style={{ fontSize:13, color:'#333', fontWeight:700 }}>Get started →</div>
                </div>
              </a>`;

const newSection = `              <h3 style={{ fontSize:14, fontWeight:700, color:'#0D1117', marginBottom:4 }}>🏆 Give kids a FREE real debit card</h3>
              <p style={{ fontSize:12, color:'#aaa', marginBottom:16 }}>Kids get a real Visa debit card completely FREE! Physical card delivered in 20 days + instant virtual card for their phone!</p>
              <a href="https://step.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', display:'block', marginBottom:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F0FBF7', borderRadius:14, padding:14, border:'2px solid #1D9E75' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', flexShrink:0 }}>ST</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0D1117' }}>Step <span style={{ background:'#1D9E75', color:'#fff', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6 }}>FREE ⭐ BEST</span></div>
                    <div style={{ fontSize:12, color:'#666' }}>100% Free Visa card · Ages 13-18 · Virtual card instant + physical card in 20 days · Builds credit!</div>
                  </div>
                  <div style={{ fontSize:13, color:'#4F46E5', fontWeight:700 }}>Get started →</div>
                </div>
              </a>
              <a href="https://current.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none', display:'block' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'#F7F7F5', borderRadius:14, padding:14, border:'1px solid #EBEBEB' }}>
                  <div style={{ width:44, height:44, borderRadius:10, background:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#fff', flexShrink:0 }}>CU</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, color:'#0D1117' }}>Current <span style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6 }}>FREE</span></div>
                    <div style={{ fontSize:12, color:'#666' }}>Free Visa card · Ages 13-18 · Spend controls by category · Virtual card instant!</div>
                  </div>
                  <div style={{ fontSize:13, color:'#333', fontWeight:700 }}>Get started →</div>
                </div>
              </a>`;

code = code.replace(oldSection, newSection);
fs.writeFileSync('pages/dashboard.tsx', code);
console.log('done! Greenlight remaining:', code.indexOf('greenlight.com'), 'Step:', code.indexOf('step.com'));
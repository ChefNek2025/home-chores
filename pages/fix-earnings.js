const fs = require('fs');
let code = fs.readFileSync('pages/dashboard.tsx', 'utf8');

// Add earnings tab to tabs array
code = code.replace(
  "{id:'photos',label:'📸 Photos'},",
  "{id:'photos',label:'📸 Photos'},\n          {id:'earnings2',label:'💳 Pay Kids'},"
);

// Add earnings2 tab content before the closing </div> of the main content area
const earningsTab = `
        {/* PAY KIDS TAB */}
        {tab === 'earnings2' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:4 }}>💳 Pay Your Kids</h2>
            <p style={{ fontSize:13, color:'#888', marginBottom:20 }}>Review earnings and choose how to pay your kids this week!</p>

            {/* Weekly earnings per kid */}
            <div style={{ display:'grid', gap:12, marginBottom:24 }}>
              {kids.map(kid => {
                const kidChores = chores.filter(c => c.assign_to === 'both' || c.assign_to === kid.id);
                const weeklyEarnings = kidChores.reduce((a, c) => a + Number(c.pay_per_completion), 0);
                return (
                  <div key={kid.id} style={{ background:'#fff', borderRadius:20, padding:20, border:'1px solid #EBEBEB', display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, color:'#0F6E56' }}>{kid.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:16, color:'#0D1117' }}>{kid.name}</div>
                      <div style={{ fontSize:13, color:'#888' }}>{kidChores.length} chores assigned</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:26, fontWeight:900, color:'#1D9E75' }}>\${weeklyEarnings.toFixed(2)}</div>
                      <div style={{ fontSize:11, color:'#888' }}>per day potential</div>
                    </div>
                  </div>
                );
              })}
              {kids.length === 0 && (
                <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', border:'1px solid #EBEBEB', color:'#888' }}>
                  <div style={{ fontSize:40, marginBottom:12 }}>👧</div>
                  <p>Add kids first to track earnings!</p>
                  <button onClick={() => setTab('kids')} style={{ marginTop:16, background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>Add kids →</button>
                </div>
              )}
            </div>

            {/* Pay with partner card */}
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB', marginBottom:16 }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'#888', textTransform:'uppercase' as any, letterSpacing:'0.5px', marginBottom:4 }}>🏆 Recommended — Give kids a real card</h3>
              <p style={{ fontSize:12, color:'#aaa', marginBottom:16 }}>Kids get a real Visa debit card. You control every purchase. See spending in real time!</p>
              
              {/* Greenlight */}
              <a href="https://greenlight.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16, background:'#F0FBF7', borderRadius:16, padding:16, border:'2px solid #1D9E75', marginBottom:10, cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#E1F5EE')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F0FBF7')}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'#1D9E75', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#fff', flexShrink:0 }}>GL</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'#0D1117' }}>Greenlight <span style={{ background:'#1D9E75', color:'#fff', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6, fontWeight:700 }}>BEST</span></div>
                    <div style={{ fontSize:12, color:'#666', marginTop:2 }}>Real Visa card for any age · $5.99/month · Parents control spending</div>
                  </div>
                  <div style={{ fontSize:13, color:'#1D9E75', fontWeight:700 }}>Get started →</div>
                </div>
              </a>

              {/* Step */}
              <a href="https://step.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16, background:'#F7F7F5', borderRadius:16, padding:16, border:'1px solid #EBEBEB', marginBottom:10, cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F0')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F7F7F5')}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'#4F46E5', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#fff', flexShrink:0 }}>ST</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'#0D1117' }}>Step <span style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6, fontWeight:700 }}>FREE</span></div>
                    <div style={{ fontSize:12, color:'#666', marginTop:2 }}>Free Visa card · Ages 13-18 · Builds credit history</div>
                  </div>
                  <div style={{ fontSize:13, color:'#4F46E5', fontWeight:700 }}>Get started →</div>
                </div>
              </a>

              {/* Current */}
              <a href="https://current.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16, background:'#F7F7F5', borderRadius:16, padding:16, border:'1px solid #EBEBEB', cursor:'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F0')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F7F7F5')}>
                  <div style={{ width:48, height:48, borderRadius:12, background:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16, color:'#fff', flexShrink:0 }}>CU</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:15, color:'#0D1117' }}>Current <span style={{ background:'#E1F5EE', color:'#0F6E56', fontSize:10, padding:'2px 8px', borderRadius:99, marginLeft:6, fontWeight:700 }}>FREE</span></div>
                    <div style={{ fontSize:12, color:'#666', marginTop:2 }}>Free Visa card · Ages 13-18 · Spend controls by category</div>
                  </div>
                  <div style={{ fontSize:13, color:'#333', fontWeight:700 }}>Get started →</div>
                </div>
              </a>
            </div>

            {/* Pay manually */}
            <div style={{ background:'#fff', borderRadius:20, padding:24, border:'1px solid #EBEBEB' }}>
              <h3 style={{ fontSize:14, fontWeight:700, color:'#888', textTransform:'uppercase' as any, letterSpacing:'0.5px', marginBottom:4 }}>💸 Pay manually</h3>
              <p style={{ fontSize:12, color:'#aaa', marginBottom:16 }}>Transfer money directly using your preferred app</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                {[
                  { name:'Venmo', color:'#008CFF', url:'https://venmo.com' },
                  { name:'Zelle', color:'#6D1ED4', url:'https://zellepay.com' },
                  { name:'Cash App', color:'#00C244', url:'https://cash.app' },
                  { name:'PayPal', color:'#003087', url:'https://paypal.com' },
                  { name:'Apple Pay', color:'#000', url:'https://apple.com/apple-pay' },
                  { name:'Google Pay', color:'#4285F4', url:'https://pay.google.com' },
                ].map(app => (
                  <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>
                    <div style={{ background:'#F7F7F5', borderRadius:12, padding:'12px 8px', textAlign:'center', border:'1px solid #EBEBEB', cursor:'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F0')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#F7F7F5')}>
                      <div style={{ width:32, height:32, borderRadius:8, background:app.color, margin:'0 auto 6px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#fff' }}>{app.name[0]}</div>
                      <div style={{ fontSize:12, fontWeight:600, color:'#333' }}>{app.name}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}`;

// Insert before the closing </div> of the main content area
code = code.replace(
  "        {/* PHOTOS */}",
  earningsTab + "\n\n        {/* PHOTOS */}"
);

fs.writeFileSync('pages/dashboard.tsx', code);
console.log('done! tab:', code.indexOf('earnings2'));

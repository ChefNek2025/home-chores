const fs = require('fs');
let code = fs.readFileSync('pages/dashboard.tsx', 'utf8');

// Find the Pay Kids tab content and add pay out buttons
const oldKidCard = `                  <div key={kid.id} style={{ background:'#fff', borderRadius:20, padding:20, border:'1px solid #EBEBEB', display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, color:'#0F6E56' }}>{kid.name[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:16, color:'#0D1117' }}>{kid.name}</div>
                      <div style={{ fontSize:13, color:'#888' }}>{kc.length} chores assigned</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:26, fontWeight:900, color:'#1D9E75' }}>\${we.toFixed(2)}</div>
                      <div style={{ fontSize:11, color:'#888' }}>per day potential</div>
                    </div>
                  </div>`;

const newKidCard = `                  <div key={kid.id} style={{ background:surface, borderRadius:20, padding:20, border:\`1px solid \${border}\`, marginBottom:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:12 }}>
                      <div style={{ width:48, height:48, borderRadius:14, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:20, color:'#0F6E56' }}>{kid.name[0]}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:16, color:text }}>{kid.name}</div>
                        <div style={{ fontSize:13, color:text3 }}>{kc.length} chores assigned</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:26, fontWeight:900, color:'#1D9E75' }}>\${we.toFixed(2)}</div>
                        <div style={{ fontSize:11, color:text3 }}>earned this week</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8' }}>
                      <button onClick={async () => {
                        const payment = { kid_id: kid.id, kid_name: kid.name, amount: we, paid_at: new Date().toISOString(), family_id: family?.id };
                        await supabase.from('payments').insert(payment);
                        alert(\`✅ Paid \${kid.name} \$\${we.toFixed(2)}! Great job!\`);
                      }} style={{ flex:1, background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                        💸 Pay \${we.toFixed(2)}
                      </button>
                      <button onClick={() => {
                        if(confirm(\`Reset \${kid.name}'s earnings for next week?\`)) {
                          alert(\`\${kid.name}'s earnings reset! ✅\`);
                        }
                      }} style={{ flex:1, background:'#F7F7F5', color:'#333', border:'1px solid #E0E0E0', borderRadius:12, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                        🔄 Reset Week
                      </button>
                    </div>
                  </div>`;

code = code.replace(oldKidCard, newKidCard);

// Add payment history tab
code = code.replace(
  "{id:'paykids', label:'💳 Pay Kids'},",
  "{id:'paykids', label:'💳 Pay Kids'},\n          {id:'payhistory', label:'📊 Pay History'},"
);

// Add payment history content before closing
code = code.replace(
  "        {tab === 'paykids' &&",
  `        {tab === 'payhistory' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:text, marginBottom:4 }}>📊 Payment History</h2>
            <p style={{ fontSize:13, color:text3, marginBottom:20 }}>All payments you have made to your kids!</p>
            <PaymentHistory familyId={family?.id} supabase={supabase} text={text} text2={text2} text3={text3} surface={surface} border={border} />
          </div>
        )}

        {tab === 'paykids' &&`
);

fs.writeFileSync('pages/dashboard.tsx', code);
console.log('done! Pay button:', code.indexOf('💸 Pay'));

// Add PaymentHistory component at the bottom
let dashboard = fs.readFileSync('pages/dashboard.tsx', 'utf8');

const historyComponent = `
function PaymentHistory({ familyId, supabase, text, text2, text3, surface, border }: any) {
  const [payments, setPayments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!familyId) return;
    supabase.from('payments').select('*').eq('family_id', familyId).order('paid_at', { ascending: false }).then(({ data }: any) => {
      setPayments(data || []);
      setLoading(false);
    });
  }, [familyId]);

  if (loading) return <div style={{ textAlign:'center', color:text3, padding:32 }}>Loading...</div>;

  if (payments.length === 0) return (
    <div style={{ background:surface, borderRadius:20, padding:32, textAlign:'center', border:\`1px solid \${border}\` }}>
      <div style={{ fontSize:40, marginBottom:12 }}>💸</div>
      <p style={{ color:text3 }}>No payments yet! Pay your kids from the Pay Kids tab.</p>
    </div>
  );

  const total = payments.reduce((a: number, p: any) => a + Number(p.amount), 0);

  return (
    <div>
      <div style={{ background:'#1D9E75', borderRadius:20, padding:20, marginBottom:16, textAlign:'center' }}>
        <div style={{ fontSize:13, color:'#9FE1CB', fontWeight:700, marginBottom:4 }}>TOTAL PAID TO KIDS</div>
        <div style={{ fontSize:36, fontWeight:900, color:'#fff' }}>\${total.toFixed(2)}</div>
      </div>
      <div style={{ display:'grid', gap:10 }}>
        {payments.map((p: any, i: number) => (
          <div key={i} style={{ background:surface, borderRadius:16, padding:'14px 18px', border:\`1px solid \${border}\`, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:'#0F6E56' }}>{p.kid_name?.[0] || '?'}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:text }}>{p.kid_name}</div>
              <div style={{ fontSize:12, color:text3 }}>{new Date(p.paid_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</div>
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:'#1D9E75' }}>\${Number(p.amount).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

dashboard = dashboard.replace(
  'function AIReport',
  historyComponent + '\nfunction AIReport'
);

// Add React import if needed
if (!dashboard.includes('import React')) {
  dashboard = dashboard.replace(
    "import { useEffect, useState }",
    "import React, { useEffect, useState }"
  );
}

fs.writeFileSync('pages/dashboard.tsx', dashboard);
console.log('history component added!');
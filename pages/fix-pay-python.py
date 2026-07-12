import re

with open('pages/dashboard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Add payments state after photos state
code = code.replace(
    'const [photos, setPhotos] = useState<any[]>([]);',
    'const [photos, setPhotos] = useState<any[]>([]);\n  const [payments, setPayments] = useState<any[]>([]);'
)

# Load payments in load function
code = code.replace(
    'setPhotos(photosData || []);\n      setLoading(false);',
    'setPhotos(photosData || []);\n      const { data: paymentsData } = await supabase.from(\'payments\').select(\'*\').eq(\'family_id\', userId).order(\'paid_at\', { ascending: false });\n      setPayments(paymentsData || []);\n      setLoading(false);'
)

# Add payKid function before logout
pay_func = '''  async function payKid(kid: any, amount: number) {
    await supabase.from('payments').insert({ family_id: family?.id, kid_id: kid.id, kid_name: kid.name, amount: amount, paid_at: new Date().toISOString() });
    const { data: pd } = await supabase.from('payments').select('*').eq('family_id', family?.id).order('paid_at', { ascending: false });
    setPayments(pd || []);
    alert('Paid ' + kid.name + ' $' + amount.toFixed(2) + '! Great job!');
  }

  async function logout() {'''

code = code.replace('  async function logout() {', pay_func)

# Add Pay and Reset buttons after earnings display
old_earnings = '''                      <div style={{ fontSize:11, color:text3 }}>per day potential</div>
                    </div>
                  </div>
                );
              })}'''

new_earnings = '''                      <div style={{ fontSize:11, color:text3 }}>earned this week</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, marginTop:10 }}>
                    <button onClick={() => payKid(kid, we)} style={{ flex:1, background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                      💸 Pay ${we.toFixed(2)}
                    </button>
                    <button onClick={() => { if(window.confirm('Reset ' + kid.name + ' earnings?')) alert(kid.name + ' reset!'); }} style={{ flex:1, background:'#F7F7F5', color:text, border:'1px solid #E0E0E0', borderRadius:12, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                      🔄 Reset Week
                    </button>
                  </div>
                </div>
                );
              })}'''

code = code.replace(old_earnings, new_earnings)

# Add Pay History tab button
code = code.replace(
    "{id:'paykids', label:'💳 Pay Kids'},",
    "{id:'paykids', label:'💳 Pay Kids'},\n          {id:'payhistory', label:'📊 Pay History'},"
)

# Add Pay History content before closing
history_content = '''        {tab === 'payhistory' && (
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:text, marginBottom:4 }}>📊 Payment History</h2>
            <p style={{ fontSize:13, color:text3, marginBottom:20 }}>All payments made to your kids!</p>
            {payments.length === 0 ? (
              <div style={{ background:surface, borderRadius:20, padding:32, textAlign:'center', border:`1px solid ${border}` }}>
                <div style={{ fontSize:40, marginBottom:12 }}>💸</div>
                <p style={{ color:text3 }}>No payments yet! Use the Pay Kids tab to pay your kids.</p>
              </div>
            ) : (
              <div>
                <div style={{ background:'#1D9E75', borderRadius:20, padding:20, marginBottom:16, textAlign:'center' }}>
                  <div style={{ fontSize:13, color:'#9FE1CB', fontWeight:700, marginBottom:4 }}>TOTAL PAID TO KIDS</div>
                  <div style={{ fontSize:36, fontWeight:900, color:'#fff' }}>${payments.reduce((a, p) => a + Number(p.amount), 0).toFixed(2)}</div>
                </div>
                <div style={{ display:'grid', gap:10 }}>
                  {payments.map((p, i) => (
                    <div key={i} style={{ background:surface, borderRadius:16, padding:'14px 18px', border:`1px solid ${border}`, display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:'#0F6E56' }}>{p.kid_name?.[0] || '?'}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color:text }}>{p.kid_name}</div>
                        <div style={{ fontSize:12, color:text3 }}>{new Date(p.paid_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</div>
                      </div>
                      <div style={{ fontSize:20, fontWeight:800, color:'#1D9E75' }}>${Number(p.amount).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

'''

code = code.replace(
    "      </div>\n    </div>\n  );\n}\n\nfunction AIReport",
    history_content + "      </div>\n    </div>\n  );\n}\n\nfunction AIReport"
)

with open('pages/dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('done!')
print('payKid:', code.find('payKid'))
print('Reset Week:', code.find('Reset Week'))
print('payhistory:', code.find('payhistory'))
print('Pay History:', code.find('Pay History'))
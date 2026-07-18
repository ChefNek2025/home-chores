const fs = require('fs');
let c = fs.readFileSync('pages/dashboard.tsx', 'utf8');

// Find and replace the prompt button with proper async button + modal
const btnStart = c.indexOf('<button onClick={()=>{ const m=window.prompt');
const btnEnd = c.indexOf('</button>', btnStart) + '</button>'.length;

console.log('Button from:', btnStart, 'to:', btnEnd);

const newBtn = `<button onClick={async()=>{
    const m = window.confirm("Pay " + kid.name + " $" + we.toFixed(2) + "?\\nClick OK to confirm payment.");
    if(!m) return;
    const { error } = await supabase.from("kids").update({paid_this_week:true, earned_amount:0}).eq("id", kid.id);
    console.log("Supabase update error:", error);
    await supabase.from("payments").insert({family_id:family?.id, kid_id:kid.id, kid_name:kid.name, amount:we, paid_at:new Date().toISOString()});
    setKids(kids.map(k=>k.id===kid.id ? {...k, earned_amount:0, paid_this_week:true} : k));
    setPaidKids(prev=>[...prev, kid.id]);
    alert("✅ Paid " + kid.name + " $" + we.toFixed(2) + "! Great job!");
  }} style={{flex:1,background:"#1D9E75",color:"#fff",border:"none",borderRadius:12,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>💸 Pay \${we.toFixed(2)}</button>`;

c = c.slice(0, btnStart) + newBtn + c.slice(btnEnd);
fs.writeFileSync('pages/dashboard.tsx', c);
console.log('done! async pay:', c.indexOf('async()=>'));
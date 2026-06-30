const fs = require('fs');
let code = fs.readFileSync('pages/dashboard.tsx', 'utf8');

// Add editChore state variables after newChoreEmoji state
code = code.replace(
  "const [showLibrary, setShowLibrary] = useState(false);",
  `const [showLibrary, setShowLibrary] = useState(false);
  const [editingChore, setEditingChore] = useState<any>(null);`
);

// Add editChore function after removeChore function
code = code.replace(
  "  async function logout() {",
  `  async function editChore(chore: any) {
    setEditingChore(chore);
    setNewChoreName(chore.name);
    setNewChoreEmoji(chore.emoji);
    setNewChorePay(String(chore.pay_per_completion));
    setNewChoreFreq(chore.freq);
    setNewChoreKid(chore.assign_to);
    setTab('chores');
    window.scrollTo(0, 0);
  }

  async function saveChoreEdit() {
    if (!editingChore || !newChoreName.trim()) return;
    const { error } = await supabase.from('chores').update({
      name: newChoreName.trim(),
      emoji: newChoreEmoji,
      pay_per_completion: parseFloat(newChorePay) || 1,
      freq: newChoreFreq,
      assign_to: newChoreKid,
    }).eq('id', editingChore.id);
    if (!error) {
      setChores(chores.map(c => c.id === editingChore.id ? {
        ...c,
        name: newChoreName.trim(),
        emoji: newChoreEmoji,
        pay_per_completion: parseFloat(newChorePay) || 1,
        freq: newChoreFreq,
        assign_to: newChoreKid,
      } : c));
      setEditingChore(null);
      setNewChoreName('');
      setNewChorePay('2.00');
      setChoreSearch('');
    }
  }

  async function logout() {`
);

// Update the Add chore button to show Save/Cancel when editing
code = code.replace(
  `              <button onClick={addChore} style={{ width:'100%', background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add chore</button>`,
  `              {editingChore ? (
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={saveChoreEdit} style={{ flex:1, background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer' }}>✅ Save changes</button>
                  <button onClick={() => { setEditingChore(null); setNewChoreName(''); setNewChorePay('2.00'); setChoreSearch(''); }} style={{ flex:1, background:'#F7F7F5', color:'#333', border:'1px solid #E0E0E0', borderRadius:12, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer' }}>❌ Cancel</button>
                </div>
              ) : (
                <button onClick={addChore} style={{ width:'100%', background:'#1D9E75', color:'#fff', border:'none', borderRadius:12, padding:'11px', fontSize:14, fontWeight:700, cursor:'pointer' }}>+ Add chore</button>
              )}`
);

// Update the chore heading to show "Editing" when in edit mode
code = code.replace(
  `              <h3 style={{ fontSize:14, fontWeight:600, color:'#888', textTransform:'uppercase' as any, letterSpacing:'0.5px', marginBottom:16 }}>{newChoreName ? 'Customize & add' : 'Add a custom chore'}</h3>`,
  `              <h3 style={{ fontSize:14, fontWeight:600, color:editingChore?'#1D9E75':'#888', textTransform:'uppercase' as any, letterSpacing:'0.5px', marginBottom:16 }}>{editingChore ? '✏️ Editing chore' : newChoreName ? 'Customize & add' : 'Add a custom chore'}</h3>`
);

// Add edit button next to delete button in chores list
code = code.replace(
  `                    <button onClick={() => removeChore(c.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16 }}>🗑️</button>`,
  `                    <button onClick={() => editChore(c)} style={{ background:'none', border:'1px solid #1D9E75', borderRadius:8, padding:'4px 10px', cursor:'pointer', fontSize:12, color:'#1D9E75', fontWeight:600, marginRight:6 }}>✏️ Edit</button>
                    <button onClick={() => removeChore(c.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16 }}>🗑️</button>`
);

fs.writeFileSync('pages/dashboard.tsx', code);
console.log('done! editChore:', code.indexOf('editChore'), 'saveChoreEdit:', code.indexOf('saveChoreEdit'));

const fs = require('fs');
let code = fs.readFileSync('pages/dashboard.tsx', 'utf8');

const photoTab = `
      {tab === 'photos' && (
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'#0D1117', marginBottom:8 }}>📸 Photo Proof</h2>
          <p style={{ fontSize:14, color:'#888', marginBottom:20 }}>Review and approve chore photos from your kids!</p>
          {photos.length === 0 ? (
            <div style={{ background:'#fff', borderRadius:20, padding:32, textAlign:'center', border:'1px solid #EBEBEB' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📸</div>
              <p style={{ color:'#666' }}>No photos yet! Kids submit photos after completing chores.</p>
            </div>
          ) : (
            <div style={{ display:'grid', gap:16 }}>
              {photos.map(photo => {
                const kid = kids.find(k => k.id === photo.kid_id);
                const chore = chores.find(c => c.id === photo.chore_id);
                return (
                  <div key={photo.id} style={{ background:'#fff', borderRadius:20, padding:20, border:'2px solid #EBEBEB' }}>
                    <div style={{ fontWeight:700, color:'#0D1117', marginBottom:8 }}>{kid?.name} - {chore?.name}</div>
                    <img src={photo.photo_url} alt="proof" style={{ width:'100%', maxHeight:300, objectFit:'cover', borderRadius:12, marginBottom:12 }} />
                    {photo.status === 'pending' && (
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={async () => { await supabase.from('chore_photos').update({ status:'approved' }).eq('id', photo.id); setPhotos(photos.map(p => p.id===photo.id ? {...p, status:'approved'} : p)); }} style={{ flex:1, background:'#1D9E75', color:'#fff', border:'none', borderRadius:10, padding:'10px', fontWeight:700, cursor:'pointer' }}>Approve</button>
                        <button onClick={async () => { await supabase.from('chore_photos').update({ status:'rejected' }).eq('id', photo.id); setPhotos(photos.map(p => p.id===photo.id ? {...p, status:'rejected'} : p)); }} style={{ flex:1, background:'#FFF0F0', color:'#C00', border:'1px solid #FFD0D0', borderRadius:10, padding:'10px', fontWeight:700, cursor:'pointer' }}>Reject</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
`;

const idx = code.lastIndexOf('      </div>');
code = code.substring(0, idx) + photoTab + code.substring(idx);
fs.writeFileSync('pages/dashboard.tsx', code);
console.log('done! photos at:', code.indexOf("tab === 'photos'"));
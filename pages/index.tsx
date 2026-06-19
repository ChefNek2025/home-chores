import dynamic from 'next/dynamic';

export default function LandingPage()  {
  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans','Inter',system-ui,sans-serif", background:'#FAFAF8', color:'#1A1A1A' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        .nav-link{color:#555;text-decoration:none;font-size:15px;font-weight:500;transition:color .15s}
        .nav-link:hover{color:#1A1A1A}
        .btn-green{display:inline-flex;align-items:center;gap:8px;background:#1D9E75;color:#fff;font-weight:700;font-size:16px;padding:14px 28px;border-radius:14px;text-decoration:none;border:none;cursor:pointer;transition:background .15s,transform .1s}
        .btn-green:hover{background:#0F6E56;transform:translateY(-1px)}
        .btn-outline{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#1A1A1A;font-weight:600;font-size:15px;padding:13px 24px;border-radius:14px;text-decoration:none;border:1.5px solid #D8D8D0;cursor:pointer;transition:border-color .15s,background .15s}
        .btn-outline:hover{border-color:#1D9E75;background:#F0FBF7;color:#0F6E56}
        .feature-card{background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:28px;transition:box-shadow .2s,transform .2s}
        .feature-card:hover{box-shadow:0 8px 30px rgba(0,0,0,.07);transform:translateY(-3px)}
        .phone-frame{background:#fff;border:2px solid #E0E0E0;border-radius:36px;padding:12px;box-shadow:0 20px 60px rgba(0,0,0,.12);width:260px;flex-shrink:0}
        .phone-screen{background:#F4F4F2;border-radius:26px;overflow:hidden}
        .chore-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#fff;border-bottom:1px solid #F0F0F0;font-size:13px;font-weight:500;color:#333}
        .testimonial{background:#fff;border:1px solid #EBEBEB;border-radius:20px;padding:28px}
        .pricing-card{background:#fff;border:1.5px solid #EBEBEB;border-radius:24px;padding:32px}
        .pricing-card.popular{border-color:#1D9E75;background:#F0FBF7;box-shadow:0 0 0 4px rgba(29,158,117,.1)}
        .faq-item{border-bottom:1px solid #EBEBEB;padding:20px 0}
        @media(max-width:768px){
          .hero-inner{flex-direction:column!important;text-align:center}
          .hero-ctas{justify-content:center!important}
          .phone-frame{width:220px}
          .features-grid{grid-template-columns:1fr!important}
          .pricing-grid{grid-template-columns:1fr!important}
          .testimonials-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(250,250,248,.92)',backdropFilter:'blur(12px)',borderBottom:'1px solid #EBEBEB'}}>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'0 24px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:24}}>🏠</span>
            <span style={{fontWeight:800,fontSize:18}}>Seru Chores</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:24}}>
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="/app" className="btn-green" style={{padding:'10px 20px',fontSize:14}}>Try it free</a>
          </div>
        </div>
      </nav>

      <section style={{maxWidth:1100,margin:'0 auto',padding:'72px 24px 64px'}}>
        <div className="hero-inner" style={{display:'flex',alignItems:'center',gap:64}}>
          <div style={{flex:1}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'#E1F5EE',color:'#0F6E56',fontWeight:700,fontSize:13,padding:'6px 14px',borderRadius:99,marginBottom:24}}>
              ✨ 🇪🇹 Seru means "Make it" in Amharic · ሥሩ
            </div>
            <h1 style={{fontSize:'clamp(36px,5vw,60px)',fontWeight:800,lineHeight:1.1,letterSpacing:'-1.5px',color:'#0D1117',marginBottom:20}}>
             Seru — Make it happen.<br/><span style={{color:'#1D9E75'}}>Your kids earn it.</span>
            </h1>
            <p style={{fontSize:18,color:'#555',lineHeight:1.7,marginBottom:32,maxWidth:460}}>
              Assign daily chores, let kids check off jobs on their phone, and pay them weekly — without the nagging, the arguments, or the sticky notes on the fridge.
            </p>
            <div className="hero-ctas" style={{display:'flex',gap:12,flexWrap:'wrap'}}>
              <a href="/app" className="btn-green">Start free trial →</a>
              <a href="#how-it-works" className="btn-outline">See how it works</a>
            </div>
            <p style={{fontSize:13,color:'#AAA',marginTop:16}}>No account needed · Works on any phone · Free to try</p>
            <div style={{display:'flex',gap:32,marginTop:40,paddingTop:32,borderTop:'1px solid #EBEBEB',flexWrap:'wrap'}}>
              {[{num:'3 min',label:'to set up your family'},{num:'$1.99',label:'to get started'},{num:'100%',label:'works on any phone'}].map(s=>(
                <div key={s.label}>
                  <div style={{fontSize:28,fontWeight:800,color:'#1D9E75'}}>{s.num}</div>
                  <div style={{fontSize:13,color:'#888',marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16,flexShrink:0}}>
            <div className="phone-frame">
              <div className="phone-screen">
                <div style={{background:'#0F6E56',padding:'16px 16px 12px',color:'#fff'}}>
                  <div style={{fontSize:11,opacity:.7,marginBottom:4}}>Monday · June 16</div>
                  <div style={{fontWeight:800,fontSize:17}}>Hey Liam! 👋</div>
                  <div style={{fontSize:12,opacity:.85,marginTop:2}}>5 chores · $9.50 today</div>
                  <div style={{marginTop:10,background:'rgba(255,255,255,.25)',borderRadius:99,height:6}}>
                    <div style={{background:'#fff',borderRadius:99,height:6,width:'60%'}}/>
                  </div>
                </div>
                {[
                  {name:'Wash dishes',pay:'$2.00',done:true,emoji:'🍽️'},
                  {name:'Make all beds',pay:'$2.00',done:true,emoji:'🛏️'},
                  {name:'Walk dog (morning)',pay:'$2.00',done:true,emoji:'🐕'},
                  {name:'Take out trash',pay:'$1.50',done:false,emoji:'🗑️'},
                  {name:'Walk dog (evening)',pay:'$2.00',done:false,emoji:'🐕'},
                ].map((c,i)=>(
                  <div key={i} className="chore-item">
                    {c.done
                      ? <div style={{width:20,height:20,borderRadius:'50%',background:'#1D9E75',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg></div>
                      : <div style={{width:20,height:20,borderRadius:'50%',border:'2px solid #CCC',flexShrink:0}}/>
                    }
                    <span style={{opacity:c.done?.45:1,textDecoration:c.done?'line-through':'none',flex:1}}>{c.emoji} {c.name}</span>
                    <span style={{color:'#1D9E75',fontWeight:700,fontSize:12}}>{c.pay}</span>
                  </div>
                ))}
                <div style={{padding:'10px 12px',fontSize:12,color:'#1D9E75',fontWeight:600,background:'#F0FBF7',textAlign:'center'}}>💪 2 more to go!</div>
              </div>
            </div>
            <div style={{fontSize:12,color:'#AAA',textAlign:'center'}}>Works like a real app on their phone</div>
          </div>
        </div>
      </section>

      <section style={{background:'#0D1117',padding:'56px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <p style={{fontSize:13,fontWeight:700,color:'#1D9E75',textTransform:'uppercase',letterSpacing:'2px',marginBottom:20}}>Sound familiar?</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:2}}>
            {[
              {emoji:'😤',text:'"Did you take out the trash? I asked three times."'},
              {emoji:'💸',text:'"I don\'t know how much I owe you — I lost track."'},
              {emoji:'🤷',text:'"Who was supposed to walk the dog this morning?"'},
              {emoji:'📝',text:'"Check the list on the fridge... the fridge, not your phone."'},
            ].map((q,i)=>(
              <div key={i} style={{background:'#161B22',padding:'24px 20px',borderRadius:4}}>
                <div style={{fontSize:28,marginBottom:10}}>{q.emoji}</div>
                <p style={{fontSize:14,color:'#8B949E',lineHeight:1.6,fontStyle:'italic'}}>{q.text}</p>
              </div>
            ))}
          </div>
          <p style={{fontSize:18,color:'#C9D1D9',marginTop:32,fontWeight:500}}>Seru Chores fixes all of this — in one app, on every phone.</p>
        </div>
      </section>

      <section style={{maxWidth:1100,margin:'0 auto',padding:'80px 24px'}}>
        <div style={{textAlign:'center',marginBottom:56}}>
          <p style={{fontSize:13,fontWeight:700,color:'#1D9E75',textTransform:'uppercase',letterSpacing:'2px',marginBottom:12}}>Features</p>
          <h2 style={{fontSize:'clamp(28px,4vw,40px)',fontWeight:800,letterSpacing:'-1px',color:'#0D1117'}}>Everything a busy family needs</h2>
        </div>
        <div className="features-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {[
            {icon:'📋',title:'Assign any chore',body:'Pick from a library of common jobs or create your own. Assign to one kid or both.'},
            {icon:'✅',title:'Kids check in themselves',body:'Each kid gets their own page on their phone. Tap to mark a chore done. No app download needed.'},
            {icon:'💵',title:'Set your own pay rate',body:'You decide what each chore is worth. $1.50 for trash, $2 for dishes — your house, your rules.'},
            {icon:'📊',title:'Parent dashboard',body:"See both kids' progress at a glance. Who's done? Who's slacking? What's owed?"},
            {icon:'📅',title:'Weekly earnings tracker',body:'The app adds it all up automatically. When payday comes, tap one button and it logs the payment.'},
            {icon:'📱',title:'Works on any phone',body:'No app store. No download. Kids bookmark their page and add it to their home screen.'},
          ].map(f=>(
            <div key={f.title} className="feature-card">
              <div style={{fontSize:32,marginBottom:14}}>{f.icon}</div>
              <h3 style={{fontSize:17,fontWeight:700,color:'#0D1117',marginBottom:8}}>{f.title}</h3>
              <p style={{fontSize:14,color:'#666',lineHeight:1.7}}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section style={{background:'linear-gradient(135deg, #078930 0%, #FCDD09 50%, #EF3340 100%)', padding:'3px 0'}}>
  <div style={{background:'#0D1117', margin:'3px 0', padding:'56px 24px'}}>
    <div style={{maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'center'}}>
      <div>
        <div style={{fontSize:13, fontWeight:700, color:'#FCDD09', textTransform:'uppercase', letterSpacing:'2px', marginBottom:16}}>🇪🇹 Built by an Ethiopian family</div>
        <h2 style={{fontSize:'clamp(24px,4vw,36px)', fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:16, letterSpacing:'-0.5px'}}>
         ሥሩ — Make it happen.<br/>
          <span style={{color:'#078930'}}>For every family,</span><br/>
          <span style={{color:'#FCDD09'}}>in every home.</span>
        </h2>
        <p style={{fontSize:15, color:'#8B949E', lineHeight:1.7, marginBottom:24}}>
          Seru Chores was created by an Ethiopian family in Maryland to help parents everywhere teach their kids responsibility, hard work, and the value of money — just like our parents taught us.
        </p>
        <p style={{fontSize:15, color:'#8B949E', lineHeight:1.7, marginBottom:24}}>
          Whether you speak Amharic, Arabic, English, or Spanish — every family deserves a simple way to manage chores and pay their kids fairly.
        </p>
        <div style={{display:'flex', gap:12, flexWrap:'wrap' as any}}>
          {['🇪🇹 Ethiopian families','🇺🇸 American families','🇸🇦 Arab families','🌍 Families worldwide'].map(t => (
            <span key={t} style={{background:'rgba(255,255,255,.08)', color:'#C9D1D9', fontSize:12, fontWeight:600, padding:'6px 12px', borderRadius:99}}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:80, marginBottom:16}}>🏠</div>
        <div style={{fontSize:32, fontWeight:800, color:'#fff', marginBottom:8}}>ሥሩ</div>
        <div style={{fontSize:16, color:'#FCDD09', fontWeight:600, marginBottom:4}}>Seru — "Make it"</div>
        <div style={{fontSize:14, color:'#8B949E'}}>In Amharic, the language of Ethiopia</div>
        <div style={{marginTop:24, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          {[
            {lang:'🇪🇹 አማርኛ', word:'ሥሩ', meaning:'Make it'},
            {lang:'🇺🇸 English', word:'Do it', meaning:'Get it done'},
            {lang:'🇸🇦 العربية', word:'افعلها', meaning:'Make it'},
            {lang:'🇪🇸 Español', word:'Hazlo', meaning:'Make it'},
          ].map(l => (
            <div key={l.lang} style={{background:'rgba(255,255,255,.05)', borderRadius:12, padding:'12px'}}>
              <div style={{fontSize:11, color:'#666', marginBottom:4}}>{l.lang}</div>
              <div style={{fontSize:18, fontWeight:800, color:'#fff'}}>{l.word}</div>
              <div style={{fontSize:11, color:'#555'}}>{l.meaning}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  <div style={{background:'linear-gradient(135deg, #078930 0%, #FCDD09 50%, #EF3340 100%)', height:3}}/>
</section>

<section style={{background:'linear-gradient(135deg, #078930 0%, #FCDD09 50%, #EF3340 100%)', padding:'3px 0'}}></section>

<section id="how-it-works" style={{background:'#F0FBF7',padding:'80px 24px'}}>
        
        <div style={{maxWidth:800,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:56}}>
            <p style={{fontSize:13,fontWeight:700,color:'#1D9E75',textTransform:'uppercase',letterSpacing:'2px',marginBottom:12}}>How it works</p>
            <h2 style={{fontSize:'clamp(28px,4vw,40px)',fontWeight:800,letterSpacing:'-1px',color:'#0D1117'}}>Set up in under 3 minutes</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32}}>
            {[
              {n:'1',title:'Open the admin dashboard',body:"Go to the site, tap \"Parent / Admin.\" You're in — no account, no email, no password."},
              {n:'2',title:'Add your chores',body:'Pick from the suggested list or type your own. Set the pay per chore and how often it repeats.'},
              {n:'3',title:"Share each kid's link",body:'Send your kids their personal page link. They bookmark it and add it to their phone home screen.'},
              {n:'4',title:'Pay weekly with one tap',body:'Every Sunday, open Earnings, see what each kid earned, tap Pay. It logs the payment automatically.'},
            ].map(s=>(
              <div key={s.n} style={{display:'flex',gap:16,alignItems:'flex-start'}}>
                <div style={{width:40,height:40,borderRadius:12,background:'#E1F5EE',color:'#0F6E56',fontWeight:800,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s.n}</div>
                <div>
                  <h3 style={{fontSize:16,fontWeight:700,color:'#0D1117',marginBottom:6}}>{s.title}</h3>
                  <p style={{fontSize:14,color:'#555',lineHeight:1.7}}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{maxWidth:1100,margin:'0 auto',padding:'80px 24px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'clamp(28px,4vw,38px)',fontWeight:800,letterSpacing:'-1px',color:'#0D1117'}}>What parents say</h2>
        </div>
        <div className="testimonials-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
          {[
            {quote:'My son actually asks me if he can do MORE chores now. The money tracking made it real for him.',name:'Maria T.',role:'Mom of 2, Texas',avatar:'👩'},
            {quote:'I set it up on a Sunday night and by Monday morning both kids were already checking off chores. No arguments.',name:'David K.',role:'Dad of 3, Florida',avatar:'👨'},
            {quote:"My daughter saved $80 in one month. I love that she's learning about money.",name:'Jennifer R.',role:'Mom of 1, Ohio',avatar:'👩'},
          ].map(t=>(
            <div key={t.name} className="testimonial">
              <div style={{fontSize:32,marginBottom:4}}>❝</div>
              <p style={{fontSize:15,color:'#333',lineHeight:1.7,fontStyle:'italic',marginBottom:20}}>{t.quote}</p>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:38,height:38,borderRadius:'50%',background:'#E1F5EE',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{t.avatar}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:'#0D1117'}}>{t.name}</div>
                  <div style={{fontSize:12,color:'#999'}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" style={{background:'#F7F7F5',padding:'80px 24px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:48}}>
            <p style={{fontSize:13,fontWeight:700,color:'#1D9E75',textTransform:'uppercase',letterSpacing:'2px',marginBottom:12}}>Pricing</p>
            <h2 style={{fontSize:'clamp(28px,4vw,40px)',fontWeight:800,letterSpacing:'-1px',color:'#0D1117'}}>Simple, honest pricing</h2>
          </div>
          <div className="pricing-grid" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {name:'Free',price:'$1.99',period:'forever',desc:'Start free trial.',features:['1 family','Up to 4 kids','Unlimited chores','Weekly pay tracking','Works on any phone'],cta:'Start free trial',href:'/app',popular:false},
              {name:'Family Pro',price:'$4',period:'per month',desc:'Extra features for power families.',features:['Everything in Free','Photo proof of chores','Parent approval required','Savings goals for kids','Streak & badge rewards'],cta:'Coming soon',href:'#',popular:true},
              {name:'Business',price:'Custom',period:'',desc:'For running multiple client families.',features:['Multiple families','Custom branding','Admin panel','White-label option','Priority support'],cta:'Contact us',href:'mailto:hello@homechores.app',popular:false},
            ].map(p=>(
              <div key={p.name} className={`pricing-card${p.popular?' popular':''}`} style={{position:'relative'}}>
                {p.popular && <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)',background:'#1D9E75',color:'#fff',fontSize:11,fontWeight:700,padding:'4px 14px',borderRadius:99,whiteSpace:'nowrap'}}>MOST POPULAR</div>}
                <div style={{fontWeight:800,fontSize:16,color:'#0D1117',marginBottom:4}}>{p.name}</div>
                <div style={{display:'flex',alignItems:'baseline',gap:4,marginBottom:4}}>
                  <span style={{fontSize:36,fontWeight:800,color:'#0D1117'}}>{p.price}</span>
                  {p.period && <span style={{fontSize:14,color:'#888'}}>{p.period}</span>}
                </div>
                <p style={{fontSize:13,color:'#777',marginBottom:20}}>{p.desc}</p>
                <ul style={{listStyle:'none',marginBottom:24}}>
                  {p.features.map(f=>(
                    <li key={f} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',fontSize:14,color:'#444'}}>
                      <span style={{color:'#1D9E75',fontWeight:700}}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href={p.href} style={{display:'block',textAlign:'center',padding:'12px',borderRadius:12,textDecoration:'none',fontWeight:700,fontSize:14,background:p.popular?'#1D9E75':'transparent',color:p.popular?'#fff':'#1A1A1A',border:p.popular?'none':'1.5px solid #D8D8D0'}}>
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{maxWidth:720,margin:'0 auto',padding:'80px 24px'}}>
        <div style={{textAlign:'center',marginBottom:48}}>
          <h2 style={{fontSize:'clamp(28px,4vw,38px)',fontWeight:800,letterSpacing:'-1px',color:'#0D1117'}}>Questions parents ask</h2>
        </div>
        {[
          {q:'Do my kids need to download an app?',a:'Nope. Seru Chores is a regular website. Kids open their link in Safari or Chrome, tap "Add to Home Screen," and it looks just like a real app — no App Store needed.'},
          {q:"Is my family's data private?",a:'All data is stored directly on your device — nothing is sent to a server. Your family\'s chore history stays on your phone, not ours.'},
          {q:'Can I change the chores or pay rates?',a:'Any time. Head to the Admin dashboard → Manage tab. Add, remove, or update chores whenever you want.'},
          {q:'What age is this good for?',a:'Best for kids ages 8–17 who are old enough to use a phone.'},
          {q:'Can I use this for more than 2 kids?',a:'The free version supports up to 4 kids. The Business plan supports unlimited family members.'},
        ].map(f=>(
          <div key={f.q} className="faq-item">
            <div style={{fontWeight:700,fontSize:16,color:'#1A1A1A',marginBottom:8}}>🙋 {f.q}</div>
            <div style={{fontSize:15,color:'#666',lineHeight:1.7}}>{f.a}</div>
          </div>
        ))}
      </section>

      <section style={{background:'#0D1117',padding:'80px 24px',textAlign:'center'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          <div style={{fontSize:52,marginBottom:20}}>🏠</div>
          <h2 style={{fontSize:'clamp(28px,4vw,42px)',fontWeight:800,letterSpacing:'-1.5px',color:'#fff',lineHeight:1.15,marginBottom:16}}>
            Make this the summer<br/>they actually help out.
          </h2>
          <p style={{fontSize:17,color:'#8B949E',marginBottom:36,lineHeight:1.7}}>Set up your family in 3 minutes. No credit card. No app to download.</p>
          <a href="/app" className="btn-green" style={{fontSize:18,padding:'16px 36px'}}>Start for free →</a>
          <p style={{color:'#444',fontSize:13,marginTop:16}}>2 weeks free · then $1.99/month · cancel anytime</p>
        </div>
      </section>

      <footer style={{background:'#0A0A0A',padding:'32px 24px',textAlign:'center'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:12}}>
          <span style={{fontSize:18}}>🏠</span>
          <span style={{fontWeight:800,fontSize:15,color:'#fff'}}>Seru Chores</span>
        </div>
        <p style={{fontSize:13,color:'#555'}}>
          Made with ❤️ for families everywhere · <a href="/app" style={{color:'#1D9E75',textDecoration:'none'}}>Open the app</a>
        </p>
      </footer>
    </div>
    
  );
  
}
export const config = { unstable_runtimeJS: true };
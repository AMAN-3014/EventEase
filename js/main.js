const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const ROOT=document.body.dataset.root||'', PAGE=document.body.dataset.page;
const fmt=d=>new Date(d+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(msg,bad){let t=$('#toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');document.body.appendChild(t)}
 t.textContent=msg;t.className='show'+(bad?' bad':'');clearTimeout(t._h);t._h=setTimeout(()=>t.className='',3000)}
function setErr(input,msg){const f=input.closest('.field');f.classList.toggle('invalid',!!msg);f.querySelector('.err').textContent=msg||''}
const LABELS={name:'Name',email:'Email',phone:'Phone number',tickets:'Tickets',message:'Message'};
function isNameValid(name){const value=name.trim();return value.length>=2&&/^[A-Za-z .'-]+$/.test(value)}
function isEmailValid(email){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)}
function isPhoneValid(phone){let digits=phone.replace(/[\s-]/g,'');if(digits.indexOf('+91')===0)digits=digits.slice(3);return digits.length===10&&/^[6-9][0-9]{9}$/.test(digits)}
function isTicketsValid(value){const count=Number(value);return Number.isInteger(count)&&count>=1&&count<=10}
function isMessageValid(message){return message.trim().length>=10}
function validate(form){let ok=true;$$('#'+form.id+' [name]').forEach(input=>{const value=input.value;let message='';
 if(value.trim()==='')message=(LABELS[input.name]||input.name)+' is required.';
 else if(input.name==='name'&&!isNameValid(value))message='Enter your full name (letters only, at least 2).';
 else if(input.name==='email'&&!isEmailValid(value))message='Enter a valid email address.';
 else if(input.name==='phone'&&!isPhoneValid(value))message='Enter a valid 10 digit mobile number.';
 else if(input.name==='tickets'&&!isTicketsValid(value))message='Choose between 1 and 10 tickets.';
 else if(input.name==='message'&&!isMessageValid(value))message='Write at least 10 characters.';
 setErr(input,message);if(message)ok=false;
 });return ok}
function card(e){return `<article class="card"><a href="${ROOT}Client/3- Event Details.html?id=${e.id}"><img src="${ROOT}${e.image}" alt="${esc(e.title)}" loading="lazy"></a><div class="card-b"><span class="chip">${esc(e.category)}</span><h3><a href="${ROOT}Client/3- Event Details.html?id=${e.id}">${esc(e.title)}</a></h3><p class="meta">${fmt(e.date)} at ${esc(e.time)}<br>${esc(e.venue)}</p><div class="row"><strong>${esc(e.price)}</strong><a class="btn sm" href="${ROOT}Client/3- Event Details.html?id=${e.id}">View event</a></div></div></article>`}

/* mobile menu */
const mt=$('#menuBtn');if(mt)mt.onclick=()=>{const o=document.body.classList.toggle('menu-open');mt.setAttribute('aria-expanded',o)};
$$('[data-site]').forEach(n=>n.textContent=getSettings().siteName);

/* admin guard */
if(document.body.dataset.admin==='1'&&!sessionStorage.getItem('ee_admin'))location.replace('1- Login Page.html');
$$('[data-logout]').forEach(a=>a.onclick=e=>{e.preventDefault();sessionStorage.removeItem('ee_admin');location.href='1- Login Page.html'});


const PAL=['#4B3FE0','#FFB627','#0E7C86','#E4572E','#C9184A','#2D6A4F','#8D99AE','#7B2CBF'];
function canvasFor(id,h){const c=$('#'+id),dpr=window.devicePixelRatio||1;c.style.height=h+'px';const w=c.clientWidth;c.width=w*dpr;c.height=h*dpr;const x=c.getContext('2d');x.scale(dpr,dpr);x.font='12px DM Sans, Arial, sans-serif';return[x,w,h]}
function barChart(id,labels,vals){const rows=labels.length,[x,w,h]=canvasFor(id,rows*28+8),lw=Math.min(150,w*.4),max=Math.max(...vals,1);
 labels.forEach((l,i)=>{const y=i*28+4,bw=(w-lw-40)*vals[i]/max;x.fillStyle='#5B6478';x.textAlign='right';x.textBaseline='middle';x.fillText(l.length>22?l.slice(0,21)+'...':l,lw-8,y+11);
  x.fillStyle=PAL[i%PAL.length];x.beginPath();x.roundRect?x.roundRect(lw,y+2,Math.max(bw,2),18,4):x.rect(lw,y+2,Math.max(bw,2),18);x.fill();
  x.fillStyle='#121826';x.textAlign='left';x.fillText(vals[i],lw+bw+6,y+11)})}
function donutChart(id,vals){const[x,w,h]=canvasFor(id,200),tot=vals.reduce((a,b)=>a+b,0)||1,cx=w/2,cy=h/2,R=Math.min(w,h)/2-6;let a=-Math.PI/2;
 vals.forEach((v,i)=>{const e=a+v/tot*Math.PI*2;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,R,a,e);x.closePath();x.fillStyle=PAL[i%PAL.length];x.fill();a=e});
 x.beginPath();x.arc(cx,cy,R*.58,0,Math.PI*2);x.fillStyle='#fff';x.fill();x.fillStyle='#121826';x.textAlign='center';x.textBaseline='middle';x.font='700 22px Bricolage Grotesque, Arial';x.fillText(tot,cx,cy-6);x.font='12px DM Sans, Arial';x.fillStyle='#5B6478';x.fillText('tickets',cx,cy+14)}
function lineChart(id,labels,vals){const[x,w,h]=canvasFor(id,220),L=34,B=26,T=12,max=Math.ceil(Math.max(...vals,1)/4)*4,gx=i=>L+(w-L-14)*i/Math.max(vals.length-1,1),gy=v=>T+(h-T-B)*(1-v/max);
 x.strokeStyle='#E3E5F0';x.fillStyle='#5B6478';x.textAlign='right';x.textBaseline='middle';
 for(let k=0;k<=4;k++){const v=Math.round(max*k/4),y=gy(v);x.beginPath();x.moveTo(L,y);x.lineTo(w-8,y);x.stroke();x.fillText(v,L-6,y)}
 x.textAlign='center';labels.forEach((l,i)=>x.fillText(l,gx(i),h-10));
 x.beginPath();vals.forEach((v,i)=>i?x.lineTo(gx(i),gy(v)):x.moveTo(gx(i),gy(v)));x.strokeStyle=PAL[0];x.lineWidth=2.5;x.stroke();
 x.lineTo(gx(vals.length-1),h-B);x.lineTo(gx(0),h-B);x.closePath();x.fillStyle='rgba(75,63,224,.10)';x.fill();
 vals.forEach((v,i)=>{x.beginPath();x.arc(gx(i),gy(v),4,0,Math.PI*2);x.fillStyle='#fff';x.fill();x.lineWidth=2;x.strokeStyle=PAL[0];x.stroke()})}
function drawDashCharts(){const ev=getEvents(),rg=getRegs();
 const per=ev.map(e=>[e.title,rg.filter(r=>r.eventId===e.id).length]).filter(p=>p[1]).sort((a,b)=>b[1]-a[1]).slice(0,8);
 barChart('cBar',per.map(p=>p[0]),per.map(p=>p[1]));
 const cat={};rg.forEach(r=>{const e=ev.find(y=>y.id===r.eventId);if(e)cat[e.category]=(cat[e.category]||0)+r.tickets});
 const ck=Object.keys(cat);donutChart('cDonut',ck.map(k=>cat[k]));
 $('#legend').innerHTML=ck.map((k,i)=>`<span><i style="background:${PAL[i%PAL.length]}"></i>${esc(k)} (${cat[k]})</span>`).join('');
 const start=new Date('2026-09-21T00:00').getTime(),n=8,wk=Array(n).fill(0);
 rg.forEach(r=>{const i=Math.floor((new Date(r.date+'T00:00')-start)/6048e5);wk[Math.min(Math.max(i,0),n-1)]++});
 lineChart('cLine',wk.map((_,i)=>new Date(start+i*6048e5).toLocaleDateString('en-IN',{day:'numeric',month:'short'})),wk)}

const P={
home(){const ev=getEvents();$('#homeEvents').innerHTML=ev.slice(0,3).map(card).join('');
 let i=0;const s=$('#slides'),dots=$('#dots'),n=Math.min(3,ev.length);
 s.innerHTML=ev.slice(0,n).map(e=>`<a class="slide" href="${ROOT}Client/3- Event Details.html?id=${e.id}"><img src="${ROOT}${e.image}" alt=""><div class="cap"><span class="chip">${esc(e.category)}</span><h3>${esc(e.title)}</h3><p>${fmt(e.date)} - ${esc(e.venue)}</p></div></a>`).join('');
 dots.innerHTML=ev.slice(0,n).map((_,k)=>`<button aria-label="Go to slide ${k+1}"></button>`).join('');
 const go=k=>{i=(k+n)%n;s.style.transform=`translateX(-${i*100}%)`;[...dots.children].forEach((d,j)=>d.classList.toggle('on',j===i))};
 $('#prev').onclick=()=>go(i-1);$('#next').onclick=()=>go(i+1);[...dots.children].forEach((d,k)=>d.onclick=()=>go(k));go(0);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>go(i+1),5000)},
events(){const ev=getEvents(),cats=['All',...new Set(ev.map(e=>e.category))];
 $('#cats').innerHTML=cats.map((c,k)=>`<button class="pill${k?'':' on'}" data-c="${c}">${c}</button>`).join('');
 let cat='All';const draw=()=>{const q=$('#q').value.toLowerCase();const r=ev.filter(e=>(cat==='All'||e.category===cat)&&(e.title+e.venue).toLowerCase().includes(q));
  $('#list').innerHTML=r.length?r.map(card).join(''):'<p class="empty">No events match. Try another category or clear the search.</p>'};
 $('#cats').onclick=e=>{if(!e.target.dataset.c)return;cat=e.target.dataset.c;$$('#cats .pill').forEach(p=>p.classList.toggle('on',p===e.target));draw()};$('#q').oninput=draw;draw()},
details(){const id=+new URLSearchParams(location.search).get('id'),e=getEvents().find(x=>x.id===id);
 if(!e){$('#detail').innerHTML='<p class="empty">Event not found. <a href="2. Events.html">Browse all events</a></p>';$('#regBox').hidden=true;return}
 document.title=e.title+' - EventEase';
 $('#detail').innerHTML=`<img class="banner" src="${ROOT}${e.image}" alt="${esc(e.title)}"><span class="chip">${esc(e.category)}</span><h1>${esc(e.title)}</h1>
 <dl class="facts"><div><dt>Date</dt><dd>${fmt(e.date)}</dd></div><div><dt>Time</dt><dd>${esc(e.time)}</dd></div><div><dt>Venue</dt><dd>${esc(e.venue)}</dd></div><div><dt>Price</dt><dd>${esc(e.price)}</dd></div><div><dt>Seats</dt><dd>${e.seats}</dd></div></dl><p>${esc(e.desc)}</p>`;
 $('#regForm').onsubmit=ev=>{ev.preventDefault();const f=ev.target;if(!validate(f))return;const regs=getRegs();
  regs.push({id:Date.now(),eventId:e.id,name:f.name.value.trim(),email:f.email.value.trim(),phone:f.phone.value.trim(),tickets:+f.tickets.value,date:new Date().toISOString().slice(0,10)});
  saveRegs(regs);f.reset();toast('You are registered for '+e.title)}},
contact(){$('#contactForm').onsubmit=ev=>{ev.preventDefault();if(!validate(ev.target))return;ev.target.reset();toast('Message sent. We reply within one working day.')}},
login(){if(sessionStorage.getItem('ee_admin'))location.replace('2. Dashboard.html');
 const ADMIN_USER='admin';
 function checkAdminLogin(user,pass){return user===ADMIN_USER&&pass===getSettings().password}
 $('#loginForm').onsubmit=ev=>{ev.preventDefault();const f=ev.target;
  if(checkAdminLogin(f.user.value.trim(),f.pass.value)){sessionStorage.setItem('ee_admin','1');location.href='2. Dashboard.html'}
  else{$('#loginErr').textContent='Username or password is incorrect.'}}},
dashboard(){const ev=getEvents(),rg=getRegs();drawDashCharts();addEventListener('resize',drawDashCharts);
 $('#stats').innerHTML=[['Events',ev.length],['Registrations',rg.length],['Tickets booked',rg.reduce((a,r)=>a+r.tickets,0)],['Upcoming',ev.filter(e=>e.date>=new Date().toISOString().slice(0,10)).length]].map(([l,v])=>`<div class="stat"><b>${v}</b><span>${l}</span></div>`).join('');
 $('#recent').innerHTML=rg.slice(-5).reverse().map(r=>{const e=ev.find(x=>x.id===r.eventId);return `<tr><td>${esc(r.name)}</td><td>${e?esc(e.title):'Removed event'}</td><td>${r.tickets}</td><td>${fmt(r.date)}</td></tr>`}).join('')||'<tr><td colspan="4" class="empty">No registrations yet.</td></tr>'},
manage(){const draw=()=>{const ev=getEvents();$('#rows').innerHTML=ev.map(e=>`<tr><td>${esc(e.title)}</td><td>${esc(e.category)}</td><td>${fmt(e.date)}</td><td>${esc(e.price)}</td><td><button class="btn sm ghost" data-del="${e.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan="5" class="empty">No events. Add one using the form.</td></tr>'};
 $('#rows').onclick=e=>{const id=+e.target.dataset.del;if(!id||!confirm('Delete this event?'))return;saveEvents(getEvents().filter(x=>x.id!==id));draw();toast('Event deleted')};
 $('#evForm').onsubmit=e=>{e.preventDefault();const f=e.target;if(f.title.value.trim().length<3)return toast('Enter an event title',1);
  const ev=getEvents(),n=ev.length%6+1;ev.push({id:Date.now(),title:f.title.value.trim(),category:f.category.value.trim()||'General',date:f.date.value,time:f.time.value||'10:00 AM',venue:f.venue.value.trim()||'To be announced',price:f.price.value.trim()||'Free',seats:+f.seats.value||100,image:'images/event-'+n+'.svg',desc:f.desc.value.trim()||'Details coming soon.'});
  saveEvents(ev);f.reset();draw();toast('Event added')};draw()},
regs(){const draw=()=>{const ev=getEvents(),q=$('#q').value.toLowerCase();
  const r=getRegs().filter(x=>(x.name+x.email).toLowerCase().includes(q));
  $('#rows').innerHTML=r.map(x=>{const e=ev.find(y=>y.id===x.eventId);return `<tr><td>${esc(x.name)}</td><td>${esc(x.email)}</td><td>${esc(x.phone)}</td><td>${e?esc(e.title):'Removed event'}</td><td>${x.tickets}</td><td><button class="btn sm ghost" data-del="${x.id}">Remove</button></td></tr>`}).join('')||'<tr><td colspan="6" class="empty">No registrations found.</td></tr>'};
 $('#q').oninput=draw;$('#rows').onclick=e=>{const id=+e.target.dataset.del;if(!id)return;saveRegs(getRegs().filter(x=>x.id!==id));draw();toast('Registration removed')};
 $('#csv').onclick=()=>{const rows=[['Name','Email','Phone','EventId','Tickets'],...getRegs().map(r=>[r.name,r.email,r.phone,r.eventId,r.tickets])];
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(c=>'"'+c+'"').join(',')).join('\n')],{type:'text/csv'}));a.download='registrations.csv';a.click()};draw()},
settings(){const s=getSettings(),f=$('#setForm');f.siteName.value=s.siteName;f.email.value=s.email;f.phone.value=s.phone;
 f.onsubmit=e=>{e.preventDefault();const n={...s,siteName:f.siteName.value.trim()||'EventEase',email:f.email.value.trim(),phone:f.phone.value.trim()};if(f.pass.value){if(f.pass.value.length<6)return toast('Password needs 6+ characters',1);n.password=f.pass.value}
  save('ee_settings',n);toast('Settings saved')};
 $('#reset').onclick=()=>{if(!confirm('Reset all events and registrations to the demo data?'))return;['ee_events','ee_regs'].forEach(k=>localStorage.removeItem(k));toast('Demo data restored')}}
};
if(P[PAGE])P[PAGE]();

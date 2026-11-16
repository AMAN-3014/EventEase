/* No database: static data + browser localStorage for demo changes */
const DEFAULT_EVENTS=[
{id:1,title:"Startup Pitch Night",category:"Business",date:"2026-12-05",time:"6:00 PM",venue:"Convention Hall, Ahmedabad",price:"Free",seats:120,image:"images/event-1.jpg",desc:"Ten early-stage founders pitch to a panel of investors. Stay for networking and feedback sessions after the final pitch."},
{id:2,title:"Food and Music Fest",category:"Festival",date:"2026-12-12",time:"4:00 PM",venue:"Riverfront Grounds, Ahmedabad",price:"Rs. 499",seats:500,image:"images/event-2.jpg",desc:"Forty street-food stalls, three live bands and a dessert lane. Bring friends - tickets are valid for the full evening."},
{id:3,title:"Tech Talk: Modern Web Dev",category:"Technology",date:"2026-12-18",time:"10:00 AM",venue:"Innovation Hub, Gandhinagar",price:"Rs. 199",seats:80,image:"images/event-3.jpg",desc:"Hands-on talks on responsive design, JavaScript and performance, led by working front-end developers."},
{id:4,title:"Wedding Expo 2026",category:"Lifestyle",date:"2027-01-09",time:"11:00 AM",venue:"Exhibition Centre, Ahmedabad",price:"Rs. 99",seats:300,image:"images/event-4.jpg",desc:"Meet decorators, photographers, caterers and planners in one place. Compare packages and book on the spot."},
{id:5,title:"Art and Design Show",category:"Arts",date:"2027-01-16",time:"12:00 PM",venue:"City Art Gallery, Ahmedabad",price:"Free",seats:150,image:"images/event-5.jpg",desc:"Work from 60 local artists and designers, plus live sketching and a Saturday workshop for beginners."},
{id:6,title:"Charity Marathon 5K",category:"Sports",date:"2027-01-24",time:"6:30 AM",venue:"Sabarmati Riverfront",price:"Rs. 299",seats:400,image:"images/event-6.jpg",desc:"Run or walk 5 km to raise funds for local education programs. Every participant receives a finisher medal."}];
/* ---- extra demo events (ids 7-12) ---- */
[["Yoga and Wellness Morning","Health","2027-01-30","6:30 AM","Law Garden, Ahmedabad","Free",90,"A relaxed open-air yoga session for all levels, followed by a healthy breakfast and a short talk on daily habits."],
["Classical Music Evening","Music","2027-02-06","7:00 PM","Town Hall, Ahmedabad","Rs. 350",250,"An evening of sitar, tabla and vocals by regional artists. Seating is first come, first served."],
["Photography Walk","Arts","2027-02-13","7:00 AM","Old City Heritage Route","Rs. 150",40,"A guided morning walk through the old city with a professional photographer. Bring any camera or phone."],
["Cybersecurity Workshop","Technology","2027-02-20","10:00 AM","Tech Park, Gandhinagar","Rs. 249",70,"A beginner-friendly workshop on passwords, phishing and safe browsing, with live demos and a short quiz."],
["Kids Science Fair","Education","2027-02-27","10:00 AM","Science City, Ahmedabad","Rs. 49",350,"Interactive experiments and model displays by school teams, with prizes for the best projects."],
["Career Fair 2027","Business","2027-03-06","9:30 AM","Convention Hall, Ahmedabad","Free",600,"Over 40 companies hiring for internships and entry-level roles. Bring printed copies of your resume."]
].forEach((e,i)=>DEFAULT_EVENTS.push({id:7+i,title:e[0],category:e[1],date:e[2],time:e[3],venue:e[4],price:e[5],seats:e[6],image:"images/event-"+(7+i)+".jpg",desc:e[7]}));

/* ---- fake registrations: 48 entries, generated the same way every time ---- */
const SEED_REGS=(()=>{
 let s=2026;const rnd=()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 const first=["Riya","Aman","Neha","Kabir","Diya","Aarav","Isha","Rohan","Priya","Karan","Sneha","Yash","Meera","Vivek","Anjali","Harsh","Pooja","Dev","Kavya","Nikhil"];
 const last=["Shah","Patel","Joshi","Nair","Mehta","Desai","Kapoor","Sharma","Trivedi","Parikh","Gandhi","Modi"];
 const pick=[1,1,1,2,2,2,2,3,3,3,4,4,5,5,6,6,6,7,8,9,10,11,12];
 const base=new Date("2026-09-21T00:00").getTime(),out=[];
 for(let i=0;i<48;i++){const f=first[Math.floor(rnd()*first.length)],l=last[Math.floor(rnd()*last.length)];
  const day=Math.floor(Math.pow(rnd(),0.7)*56);const dt=new Date(base+day*864e5).toISOString().slice(0,10);
  out.push({id:i+1,eventId:pick[Math.floor(rnd()*pick.length)],name:f+" "+l,email:(f+"."+l).toLowerCase()+"@example.com",phone:"9"+String(Math.floor(rnd()*1e9)).padStart(9,"0"),tickets:1+Math.floor(rnd()*4),date:dt})}
 return out.sort((a,b)=>a.date<b.date?-1:1)})();
function load(k,def){try{const s=localStorage.getItem(k);if(s)return JSON.parse(s)}catch(e){}return def}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
const getEvents=()=>load('ee_events',DEFAULT_EVENTS);
const saveEvents=v=>save('ee_events',v);
const getRegs=()=>load('ee_regs',SEED_REGS);
const saveRegs=v=>save('ee_regs',v);
const getSettings=()=>load('ee_settings',{siteName:'EventEase',email:'hello@eventease.example',phone:'+91 98765 43210',password:'admin123'});

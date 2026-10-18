(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function r(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(t){if(t.ep)return;t.ep=!0;const a=r(t);fetch(t.href,a)}})();function ve(o){let e="",r="",s="";const t=o.info;t&&(e=t.vendor||"",r=t.architecture||"",s=t.description||"");const a=[e,r,s].filter(l=>l&&l.length>0);return{name:a.length?a.join(" · "):"WebGPU adapter",features:[...o.features]}}async function xe(o){const e=navigator.gpu;if(!e)throw new Error("navigator.gpu недоступен — браузер без WebGPU");const r=[{powerPreference:"high-performance"},{},{forceFallbackAdapter:!0}],s=window.__GPUKEEP__??[];window.__GPUKEEP__=s;let t=null,a=null;for(const i of r){let f=null;try{f=await e.requestAdapter(i)}catch{f=null}if(!f)continue;let u;try{u=await f.requestDevice({label:"hdrp-webgpu-device",requiredLimits:{maxTextureDimension2D:Math.min(f.limits.maxTextureDimension2D,8192),maxStorageBufferBindingSize:Math.min(f.limits.maxStorageBufferBindingSize,1<<28)}})}catch{continue}const w=new Promise(y=>u.lost.then(()=>y(!0)));if(await Promise.race([w,new Promise(y=>setTimeout(()=>y(!1),350))])){try{u.destroy()}catch{}continue}t=u,a=f;break}if(a&&s.push(a),t&&s.push(t),!a||!t)throw new Error("Не получен рабочий GPUDevice (все кандидаты отклонены)");const{name:c}=ve(a),l=o.getContext("webgpu");if(!l)throw new Error('canvas.getContext("webgpu") вернул null');const m=e.getPreferredCanvasFormat();l.configure({device:t,format:m,alphaMode:"opaque"});const n=globalThis;n.__devSeq=(n.__devSeq??0)+1;const d=n.__devSeq;window.__DEV_OK__=`#${d} @${(performance.now()/1e3).toFixed(2)}s`,t.lost.then(i=>{const f=`#${d} ${i.reason}: ${i.message} @${(performance.now()/1e3).toFixed(2)}s`;console.error(`[gpu] DEVICE LOST ${f}`),window.__DEVLOST__=f});const v={maxTextureDimension2D:t.limits.maxTextureDimension2D,maxBufferSize:t.limits.maxBufferSize,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxUniformBufferBindingSize:t.limits.maxUniformBufferBindingSize};return{device:t,context:l,canvas:o,format:m,adapterName:c,features:[...t.features],limits:v,maxTextureDim:t.limits.maxTextureDimension2D}}function be(o,e){o.addEventListener("uncapturederror",r=>{e(`GPU uncaptured error: ${r.error.message}`)})}const F=(o,e,r,s)=>{let[t,a,c]=[o,e,r];if(s.rz){const l=Math.cos(s.rz),m=Math.sin(s.rz),n=t*l-a*m,d=t*m+a*l;t=n,a=d}if(s.ry){const l=Math.cos(s.ry),m=Math.sin(s.ry),n=t*l+c*m,d=-t*m+c*l;t=n,c=d}return[t+s.translate[0],a+s.translate[1],c+s.translate[2]]},k=(o,e,r,s)=>{let[t,a,c]=[o,e,r];if(s.rz){const l=Math.cos(s.rz),m=Math.sin(s.rz),n=t*l-a*m,d=t*m+a*l;t=n,a=d}if(s.ry){const l=Math.cos(s.ry),m=Math.sin(s.ry),n=t*l+c*m,d=-t*m+c*l;t=n,c=d}return[t,a,c]};class we{pos=[];nrm=[];uv=[];idx=[];vert(e,r,s,t){return this.pos.push(e[0],e[1],e[2]),this.nrm.push(r[0],r[1],r[2]),this.uv.push(s,t),this.pos.length/3-1}quad(e,r,s,t){this.idx.push(e,r,s,e,s,t)}addBox(e,r,s){const t={translate:e,...s},a=r[0]/2,c=r[1]/2,l=r[2]/2,m=[{n:[0,0,1],corners:[[-a,-c,l],[a,-c,l],[a,c,l],[-a,c,l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,0,-1],corners:[[a,-c,-l],[-a,-c,-l],[-a,c,-l],[a,c,-l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[1,0,0],corners:[[a,-c,l],[a,-c,-l],[a,c,-l],[a,c,l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[-1,0,0],corners:[[-a,-c,-l],[-a,-c,l],[-a,c,l],[-a,c,-l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,1,0],corners:[[-a,c,l],[a,c,l],[a,c,-l],[-a,c,-l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,-1,0],corners:[[-a,-c,-l],[a,-c,-l],[a,-c,l],[-a,-c,l]],uv:[[0,0],[1,0],[1,1],[0,1]]}];for(const n of m){const d=k(n.n[0],n.n[1],n.n[2],t),v=n.corners.map((i,f)=>this.vert(F(i[0],i[1],i[2],t),d,n.uv[f][0],n.uv[f][1]));this.quad(v[0],v[1],v[2],v[3])}return this}addCylinder(e,r,s,t,a=10,c){const l={translate:e,...c},m=t/2,n=this.pos.length/3;for(let d=0;d<=a;d++){const v=d/a*Math.PI*2,i=Math.cos(v),f=Math.sin(v),u=(r-s)/t,w=Math.hypot(1,u);this.vert(F(i*r,-m,f*r,l),k(i/w,u/w,f/w,l),d/a*4,0),this.vert(F(i*s,m,f*s,l),k(i/w,u/w,f/w,l),d/a*4,1)}for(let d=0;d<a;d++){const v=n+d*2;this.quad(v,v+2,v+3,v+1)}if(s>.001){const d=this.vert(F(0,m,0,l),k(0,1,0,l),.5,.5);for(let v=0;v<a;v++){const i=v/a*Math.PI*2,f=(v+1)/a*Math.PI*2,u=this.vert(F(Math.cos(i)*s,m,Math.sin(i)*s,l),k(0,1,0,l),0,0),w=this.vert(F(Math.cos(f)*s,m,Math.sin(f)*s,l),k(0,1,0,l),0,0);this.quad(d,u,w,d)}}if(r>.001){const d=this.vert(F(0,-m,0,l),k(0,-1,0,l),.5,.5);for(let v=0;v<a;v++){const i=v/a*Math.PI*2,f=(v+1)/a*Math.PI*2,u=this.vert(F(Math.cos(i)*r,-m,Math.sin(i)*r,l),k(0,-1,0,l),0,0),w=this.vert(F(Math.cos(f)*r,-m,Math.sin(f)*r,l),k(0,-1,0,l),0,0);this.quad(d,w,u,d)}}return this}addSphere(e,r,s,t=12,a=8){const c=this.pos.length/3;for(let l=0;l<=a;l++){const m=l/a,n=m*Math.PI;for(let d=0;d<=t;d++){const v=d/t,i=v*Math.PI*2,f=[Math.sin(n)*Math.cos(i),Math.cos(n),Math.sin(n)*Math.sin(i)],u=[e[0]+f[0]*r,e[1]+f[1]*r,e[2]+f[2]*r];s&&s(u,f),this.vert(u,f,v*3,m*2)}}for(let l=0;l<a;l++)for(let m=0;m<t;m++){const n=c+l*(t+1)+m,d=n+t+1;this.quad(n,d,d+1,n+1)}return this}build(){const e=this.pos.length/3,r=new Float32Array(e*8);for(let s=0;s<e;s++)r.set([this.pos[s*3],this.pos[s*3+1],this.pos[s*3+2]],s*8),r.set([this.nrm[s*3],this.nrm[s*3+1],this.nrm[s*3+2]],s*8+3),r.set([this.uv[s*2],this.uv[s*2+1]],s*8+6);return{vertexData:r,indexData:new Uint32Array(this.idx)}}}const _={CONCRETE:0,PLASTER:1,WOOD_FLOOR:2,WOOD_DECK:3,METAL:4,FABRIC:5,FOLIAGE:6,ROCK:7,EMISSIVE:8};let ee=1337;function C(){return ee=ee*1664525+1013904223>>>0,ee/4294967296}function ye(){ee=1337;const o=new Map,e=h=>{let p=o.get(h);return p||(p=new we,o.set(h,p)),p},r=0;e(_.CONCRETE).addBox([0,.6,0],[38,1.2,30]),e(_.CONCRETE).addBox([0,-2.2,0],[420,1,420]),e(_.WOOD_FLOOR).addBox([-11,1.22,0],[10,.05,12]),e(_.PLASTER).addBox([-16,2.65,-4],[.35,2.9,4]),e(_.PLASTER).addBox([-16,2.65,4],[.35,2.9,4]),e(_.PLASTER).addBox([-16,.65,0],[.35,1.1,4]),e(_.PLASTER).addBox([-16,3.75,0],[.35,1.2,4]),e(_.PLASTER).addBox([-11,2.85,6],[10,3.3,.35]),e(_.PLASTER).addBox([-11,2.85,-6],[10,3.3,.35]),e(_.PLASTER).addBox([-6,2.85,-3.6],[.35,3.3,4.8]),e(_.PLASTER).addBox([-6,2.85,3.6],[.35,3.3,4.8]),e(_.PLASTER).addBox([-6,3.6,0],[.35,1.8,2.4]),e(_.PLASTER).addBox([-11,4.65,0],[10,.3,12]),e(_.WOOD_FLOOR).addBox([-4.5,1.22,0],[3,.05,3]),e(_.PLASTER).addBox([-4.5,2.7,-1.5],[3,3,.3]),e(_.PLASTER).addBox([-4.5,2.7,1.5],[3,3,.3]),e(_.PLASTER).addBox([-4.5,4.35,0],[3,.3,3.3]),e(_.WOOD_FLOOR).addBox([1.5,1.22,0],[9,.05,9]),e(_.PLASTER).addBox([-3,3.35,-2.85],[.35,4.3,3.3]),e(_.PLASTER).addBox([-3,3.35,2.85],[.35,4.3,3.3]),e(_.PLASTER).addBox([-3,4.2,0],[.35,2,2.4]),e(_.PLASTER).addBox([1.5,3.35,4.5],[9,4.3,.35]),e(_.PLASTER).addBox([1.5,3.35,-4.5],[9,4.3,.35]),e(_.PLASTER).addBox([6,3.35,-3],[.35,4.3,3]),e(_.PLASTER).addBox([6,3.35,3],[.35,4.3,3]),e(_.PLASTER).addBox([6,4.2,0],[.35,2,3]),e(_.PLASTER).addBox([-.9,5.65,0],[4.2,.3,9]),e(_.PLASTER).addBox([4.5,5.65,0],[3,.3,9]),e(_.PLASTER).addBox([1.5,5.65,-3],[6,.3,3]),e(_.PLASTER).addBox([1.5,5.65,3],[6,.3,3]),e(_.CONCRETE).addBox([1.5,5.9,-1.55],[3.2,.4,.12]),e(_.CONCRETE).addBox([1.5,5.9,1.55],[3.2,.4,.12]),e(_.CONCRETE).addBox([-.05,5.9,0],[.12,.4,3.2]),e(_.CONCRETE).addBox([3.05,5.9,0],[.12,.4,3.2]),e(_.CONCRETE).addBox([4.6,1.5,3.2],[1.2,.6,1.2]);for(let h=0;h<5;h++){const p=C()*Math.PI*2;e(_.FOLIAGE).addSphere([4.6+Math.cos(p)*.35,1.95+C()*.3,3.2+Math.sin(p)*.35],.32+C()*.15,L=>{L[1]*=.7},8,6)}e(_.WOOD_FLOOR).addBox([11,1.22,0],[10,.05,10]),e(_.PLASTER).addBox([11,2.85,5],[10,3.3,.35]),e(_.PLASTER).addBox([11,2.85,-5],[10,3.3,.35]),e(_.PLASTER).addBox([16,2.85,-3.75],[.35,3.3,2.5]),e(_.PLASTER).addBox([16,2.85,3.75],[.35,3.3,2.5]),e(_.PLASTER).addBox([16,.6,0],[.35,1,5]),e(_.PLASTER).addBox([16,3.75,0],[.35,1.2,5]),e(_.PLASTER).addBox([11,4.65,0],[10,.3,10]),e(_.WOOD_FLOOR).addBox([14.3,1.75,-1.2],[2,1.05,5.2]),e(_.METAL).addBox([15.6,2.4,-1.2],[.08,.04,5.2]),e(_.PLASTER).addBox([15.75,3.1,-1.2],[.4,1.9,5.2]);for(const h of[-2.8,-1.4,0,1.4])e(_.FABRIC).addCylinder([13,1.55,h],.22,.24,.68,10),e(_.METAL).addCylinder([13,1.2,h],.05,.05,.35,8);e(_.FABRIC).addBox([8.2,1.6,-2.8],[1.1,.75,2.6]),e(_.FABRIC).addBox([7.8,2,-2.8],[.35,.8,2.6]),e(_.FABRIC).addBox([8.2,1.75,-3.9],[1,.45,.3]),e(_.FABRIC).addBox([8.2,1.75,-1.7],[1,.45,.3]),e(_.FABRIC).addBox([10,1.26,-1.5],[4.2,.03,3.2]);for(const h of[-2.6,.2])e(_.METAL).addCylinder([14.2,4,h],.008,.008,1.2,6),e(_.METAL).addCylinder([14.2,3.32,h],.16,.06,.16,12),e(_.EMISSIVE).addSphere([14.2,3.24,h],.055,void 0,8,6);e(_.METAL).addCylinder([1.5,5.5,0],.008,.008,1.6,6),e(_.METAL).addCylinder([1.5,4.62,0],.2,.07,.18,12),e(_.EMISSIVE).addSphere([1.5,4.52,0],.06,void 0,8,6),e(_.METAL).addCylinder([8.6,1.85,2.8],.02,.02,1.3,6),e(_.METAL).addCylinder([8.6,1.22,2.8],.16,.16,.04,10),e(_.EMISSIVE).addCylinder([8.6,2.62,2.8],.11,.14,.24,12);for(const h of[-1.15,1.15])e(_.EMISSIVE).addBox([-4.5,2.55,h],[.16,.1,.24]);for(const h of[-2.6,2.6])e(_.EMISSIVE).addCylinder([-11,4.42,h],.09,.09,.05,10);for(const h of[-4.6,4.6])e(_.METAL).addCylinder([-18.5,1.5,h],.06,.06,.62,8),e(_.EMISSIVE).addCylinder([-18.5,1.86,h],.045,.05,.1,8);for(const h of[-4.6,0,4.6])e(_.CONCRETE).addCylinder([-17.2,3,h],.22,.26,3.6,12);e(_.PLASTER).addBox([-17.2,5,0],[.9,.5,11]);for(let h=0;h<24;h++){const p=-17.4-h*1;e(_.WOOD_DECK).addBox([p,1.08,0],[.88,.09,3.6])}e(_.WOOD_DECK).addBox([-29,.92,-1.55],[24,.16,.28]),e(_.WOOD_DECK).addBox([-29,.92,1.55],[24,.16,.28]);for(const h of[-18,-22,-26,-30,-34,-38])for(const p of[-1.9,1.9])e(_.WOOD_DECK).addCylinder([h,.1,p],.15,.13,3,8);e(_.WOOD_DECK).addBox([-28.5,1.85,-1.72],[22,.07,.07]),e(_.WOOD_DECK).addBox([-28.5,1.85,1.72],[22,.07,.07]);for(let h=0;h<12;h++){const p=-18.5-h*1.8;e(_.WOOD_DECK).addBox([p,1.5,-1.72],[.06,.6,.06]),e(_.WOOD_DECK).addBox([p,1.5,1.72],[.06,.6,.06])}const s=[[-20.5,-.35,3.6,1.5],[-22.5,-.55,-2.8,1.9],[-25,-.3,1.6,1.2],[-27.5,-.5,-4.2,1.6],[-30,-.45,2.8,1.4],[-23.8,-.75,.4,1.1],[-19.4,-.6,-3.4,1.3],[-33,-.35,-1.2,1.7]];for(const[h,p,L,P]of s)e(_.ROCK).addSphere([h,p,L],P,S=>{const x=T=>Math.sin(S[0]*T+1.7)*Math.sin(S[1]*T*1.7+4.2)*Math.sin(S[2]*T*1.3+2.1),b=1+.28*x(2.1)+.14*x(4.7);S[0]=h+(S[0]-h)*b,S[1]=Math.max(p-P*.35,p+(S[1]-p)*b),S[2]=L+(S[2]-L)*b},14,9);const t=[];for(let h=0;h<9;h++)t.push([-14+h*3.4,0,10.4+C()*2.6]);for(let h=0;h<8;h++)t.push([-12+h*3.6,0,-10.2-C()*2.4]);for(const[h,,p]of t){const L=5+Math.floor(C()*4);for(let P=0;P<L;P++){const S=h+(C()-.5)*1.6,x=p+(C()-.5)*1.6,b=3+C()*1.8,T=(C()-.5)*.16,B=(C()-.5)*.16;e(_.FOLIAGE).addCylinder([S,1.2+b/2-.02,x],.035,.022,b,6,{rz:T,ry:B});const D=1.2+b*Math.cos(T),M=S+b*Math.sin(T)*-Math.sin(B)+0,A=x+b*Math.sin(T)*Math.cos(B)*.5,G=3+Math.floor(C()*3);for(let O=0;O<G;O++){const H=D-.25-C()*1.2,j=.35+C()*.45,q=C()*Math.PI*2;e(_.FOLIAGE).addBox([M+Math.cos(q)*j*.5,H,A+Math.sin(q)*j*.5],[j,.02,.09+C()*.06],{ry:q,rz:-.25-C()*.3})}}}const a=[];let c=0,l=0;const m=[],n=[];for(const[h,p]of[...o.entries()].sort((L,P)=>L[0]-P[0])){const{vertexData:L,indexData:P}=p.build();m.push(L),n.push(P),a.push({matId:h,firstIndex:l,count:P.length}),c+=L.length/8,l+=P.length}const d=m.reduce((h,p)=>h+p.length,0),v=n.reduce((h,p)=>h+p.length,0),i=new Float32Array(d),f=new Uint32Array(v);let u=0,w=0;for(let h=0;h<m.length;h++){i.set(m[h],u);const p=n[h],L=u/8;for(let P=0;P<p.length;P++)f[w+P]=p[P]+L;u+=m[h].length,w+=p.length}return{vertexData:i,indexData:f,groups:a,lights:[{pos:[14.2,3.1,-2.6],color:[1,.72,.45],intensity:40,range:9},{pos:[14.2,3.1,.2],color:[1,.72,.45],intensity:40,range:9},{pos:[1.5,4.4,0],color:[1,.82,.6],intensity:26,range:9},{pos:[8.6,2.55,2.8],color:[1,.68,.42],intensity:26,range:7},{pos:[-4.2,2.55,-1.15],color:[1,.75,.5],intensity:14,range:5},{pos:[-4.2,2.55,1.15],color:[1,.75,.5],intensity:14,range:5},{pos:[-11,4.15,-2.6],color:[.95,.9,.8],intensity:18,range:7},{pos:[-11,4.15,2.6],color:[.95,.9,.8],intensity:18,range:7},{pos:[-17.2,4.4,0],color:[.85,.92,1],intensity:55,range:14,spotDir:[-17.5,0,0],cosInner:.88,cosOuter:.6},{pos:[-18.5,1.95,-4.6],color:[1,.8,.55],intensity:10,range:5},{pos:[-18.5,1.95,4.6],color:[1,.8,.55],intensity:10,range:5}],shots:[{name:"Пирс",eye:[-37,2.6,.4],look:[-8,2.6,0]},{name:"Атриум",eye:[5,2.1,3.4],look:[-.5,2.4,-.6]},{name:"Бар",eye:[10.4,2,1.6],look:[14.6,1.6,-1.8]},{name:"Коридор",eye:[-6.2,1.95,0],look:[-1,1.7,.1]},{name:"Океан",eye:[-24,1.6,7.5],look:[-60,4,-4]},{name:"Обзор",eye:[27,22,25],look:[-4,.5,-1]}],probes:[{pos:[-11,2.6,0],interior:.88,bounce:.55},{pos:[-4.5,2.4,0],interior:.92,bounce:.5},{pos:[1.5,2.6,0],interior:.62,bounce:.6},{pos:[11,2.4,0],interior:.8,bounce:.65},{pos:[0,1.9,9.5],interior:.12,bounce:.2},{pos:[-14,2.2,0],interior:.25,bounce:.25},{pos:[-24,2.2,0],interior:.04,bounce:.05},{pos:[-36,2.4,0],interior:0,bounce:0},{pos:[-40,1.4,-16],interior:0,bounce:0},{pos:[12,1.4,-16],interior:0,bounce:0}],waterLevel:r}}class Be{constructor(e){this.device=e}resources=new Map;pool=[];passes=[];current=null;frameIndex=0;texture(e,r){let s=this.resources.get(e);if((!s||s.desc.width!==r.width||s.desc.height!==r.height||s.desc.format!==r.format)&&(s&&s.texture&&this.retire(s.texture),s={desc:r,texture:null,view:null},this.resources.set(e,s)),!s.texture){const t=this.pool.pop()??null;t&&t.width===r.width&&t.height===r.height&&t.format===r.format?s.texture=t:(t&&this.retire(t),s.texture=this.device.createTexture({label:`rg:${e}`,size:[r.width,r.height],format:r.format,usage:r.usage})),s.view=s.texture.createView()}return s.view}persistent(e,r){return this.texture(e,r)}retire(e){this.pool.push(e),this.pool.length>24&&this.pool.shift()?.destroy()}async run(e,r,s){const t={name:e,kind:r,cpuMs:0};this.passes.push(t),this.current=t;const a=performance.now();await s(),t.cpuMs=performance.now()-a,this.current=null}beginFrame(){this.passes.length=0,this.frameIndex++}reset(e=!1){for(const r of this.resources.values())r.texture?.destroy(),r.texture=null,r.view=null;if(this.resources.clear(),!e){for(const r of this.pool)r.destroy();this.pool.length=0}}totalCpuMs(){return this.passes.reduce((e,r)=>e+r.cpuMs,0)}get dev(){return this.device}}function N(){const o=new Float32Array(16);return o[0]=o[5]=o[10]=o[15]=1,o}function _e(o){return o.fill(0),o[0]=o[5]=o[10]=o[15]=1,o}function pe(o,e,r){const s=e[0],t=e[1],a=e[2],c=e[3],l=e[4],m=e[5],n=e[6],d=e[7],v=e[8],i=e[9],f=e[10],u=e[11],w=e[12],g=e[13],y=e[14],z=e[15];for(let h=0;h<4;h++){const p=r[h*4],L=r[h*4+1],P=r[h*4+2],S=r[h*4+3];o[h*4]=p*s+L*l+P*v+S*w,o[h*4+1]=p*t+L*m+P*i+S*g,o[h*4+2]=p*a+L*n+P*f+S*y,o[h*4+3]=p*c+L*d+P*u+S*z}return o}function Pe(o,e,r,s,t){const a=1/Math.tan(e/2);return o.fill(0),o[0]=a/r,o[5]=a,o[10]=t/(s-t),o[14]=t*s/(s-t),o[11]=-1,o}function Le(o,e,r,s,t,a,c){return o.fill(0),o[0]=2/(r-e),o[5]=2/(t-s),o[10]=1/(a-c),o[12]=(e+r)/(e-r),o[13]=(t+s)/(s-t),o[14]=a/(a-c),o[15]=1,o}function me(o,e,r,s){let t=e[0]-r[0],a=e[1]-r[1],c=e[2]-r[2],l=Math.hypot(t,a,c);l<1e-8&&(t=0,a=0,c=1,l=1),t/=l,a/=l,c/=l;let m=s[1]*c-s[2]*a,n=s[2]*t-s[0]*c,d=s[0]*a-s[1]*t;if(l=Math.hypot(m,n,d),l<1e-8){const u=Math.abs(s[2])<.9?[0,0,1]:[1,0,0];m=u[1]*c-u[2]*a,n=u[2]*t-u[0]*c,d=u[0]*a-u[1]*t,l=Math.hypot(m,n,d)}m/=l,n/=l,d/=l;const v=a*d-c*n,i=c*m-t*d,f=t*n-a*m;return o[0]=m,o[1]=v,o[2]=t,o[3]=0,o[4]=n,o[5]=i,o[6]=a,o[7]=0,o[8]=d,o[9]=f,o[10]=c,o[11]=0,o[12]=-(m*e[0]+n*e[1]+d*e[2]),o[13]=-(v*e[0]+i*e[1]+f*e[2]),o[14]=-(t*e[0]+a*e[1]+c*e[2]),o[15]=1,o}function Te(o,e){const r=e[0],s=e[1],t=e[2],a=e[3],c=e[4],l=e[5],m=e[6],n=e[7],d=e[8],v=e[9],i=e[10],f=e[11],u=e[12],w=e[13],g=e[14],y=e[15],z=r*l-s*c,h=r*m-t*c,p=r*n-a*c,L=s*m-t*l,P=s*n-a*l,S=t*n-a*m,x=d*w-v*u,b=d*g-i*u,T=d*y-f*u,B=v*g-i*w,D=v*y-f*w,M=i*y-f*g;let A=z*M-h*D+p*B+L*T-P*b+S*x;return A?(A=1/A,o[0]=(l*M-m*D+n*B)*A,o[1]=(t*D-s*M-a*B)*A,o[2]=(w*S-g*P+y*L)*A,o[3]=(i*P-v*S-f*L)*A,o[4]=(m*T-c*M-n*b)*A,o[5]=(r*M-t*T+a*b)*A,o[6]=(g*p-u*S-y*h)*A,o[7]=(d*S-i*p+f*h)*A,o[8]=(c*D-l*T+n*x)*A,o[9]=(s*T-r*D-a*x)*A,o[10]=(u*P-w*p+y*z)*A,o[11]=(v*p-d*P-f*z)*A,o[12]=(l*b-c*B-m*x)*A,o[13]=(r*B-s*b+t*x)*A,o[14]=(w*h-u*L-g*z)*A,o[15]=(d*L-v*h+i*z)*A,o):_e(o)}function J(o,e){return[o[0]-e[0],o[1]-e[1],o[2]-e[2]]}function Z(o,e){return[o[0]+e[0],o[1]+e[1],o[2]+e[2]]}function se(o,e){return[o[0]*e,o[1]*e,o[2]*e]}function ce(o,e){return[o[1]*e[2]-o[2]*e[1],o[2]*e[0]-o[0]*e[2],o[0]*e[1]-o[1]*e[0]]}function Se(o){return Math.hypot(o[0],o[1],o[2])}function Y(o){const e=Se(o)||1;return[o[0]/e,o[1]/e,o[2]/e]}function le(o,e){let r=1,s=0,t=o;for(;t>0;)r/=e,s+=r*(t%e),t=Math.floor(t/e);return s}const W=(o,e,r)=>Math.min(r,Math.max(e,o)),$=(o,e,r)=>o+(e-o)*r,ze=(o,e,r)=>{const s=W((r-o)/(e-o),0,1);return s*s*(3-2*s)},V=o=>o*Math.PI/180;class De{target=[0,2,0];distance=26;yaw=V(215);pitch=V(14);position=[-30,2.4,2];flyYaw=V(70);flyPitch=V(4);mode="orbit";fovY=V(52);near=.3;far=2400;view=N();proj=N();viewProj=N();invViewProj=N();prevViewProj=N();viewDir=[0,0,1];camPos=[0,0,0];hasPrev=!1;jitterEnabled=!0;jitterIdx=0;jitter=[0,0];eye(){if(this.mode==="fly")return this.position;const e=Math.cos(this.pitch);return[this.target[0]+this.distance*e*Math.cos(this.yaw),this.target[1]+this.distance*Math.sin(this.pitch),this.target[2]+this.distance*e*Math.sin(this.yaw)]}lookAtPoint(){return this.mode==="fly"?Z(this.position,this.forward()):this.target}forward(){const e=Math.cos(this.flyPitch);return Y([e*Math.cos(this.flyYaw),Math.sin(this.flyPitch),e*Math.sin(this.flyYaw)])}forwardOfView(){return Y(J(this.lookAtPoint(),this.eye()))}update(e){if(this.jitterEnabled){const a=(le(this.jitterIdx%8+1,2)-.5)*2/Math.ceil(e*720),c=(le(this.jitterIdx%8+1,3)-.5)*2/720;this.jitter=[a,c],this.jitterIdx++}else this.jitter=[0,0];const r=this.prevViewProj;this.hasPrev&&r.set(this.viewProj);const s=this.eye(),t=this.lookAtPoint();me(this.view,s,t,[0,1,0]),Pe(this.proj,this.fovY,e,this.near,this.far),this.proj[2]+=this.jitter[0],this.proj[13]+=this.jitter[1],pe(this.viewProj,this.proj,this.view),Te(this.invViewProj,this.viewProj),this.hasPrev||(r.set(this.viewProj),this.hasPrev=!0),this.camPos=s,this.viewDir=Y(J(t,s))}moveOrbit(e,r){this.yaw-=e*.005,this.pitch=W(this.pitch+r*.005,V(-85),V(85))}zoom(e){this.distance=W(this.distance*(e>0?1.12:.89),2.2,220)}pan(e,r){const s=this.forward(),t=Y(ce([0,1,0],s)),a=this.distance*.0016;this.target=Z(this.target,Z(se(t,-e*a),se([0,1,0],r*a)))}flyStep(e,r){const s=r.has("shiftleft")||r.has("shiftright")?26:7,t=this.forward(),a=Y(ce(t,[0,1,0])),c=[0,0,0];r.has("keyw")&&c.forEach((m,n)=>c[n]+=t[n]),r.has("keys")&&c.forEach((m,n)=>c[n]-=t[n]),r.has("keyd")&&c.forEach((m,n)=>c[n]+=a[n]),r.has("keya")&&c.forEach((m,n)=>c[n]-=a[n]),r.has("keye")&&(c[1]+=1),r.has("keyq")&&(c[1]-=1);const l=Math.hypot(...c);if(l>1e-4){const m=s*e/l;this.position=Z(this.position,se(c,m)),this.position[1]=Math.max(this.position[1],-1.5)}}animateTo(e,r){const s=r*r*(3-2*r),t=this.eye(),a=this.lookAtPoint(),c=[$(t[0],e.eye[0],s),$(t[1],e.eye[1],s),$(t[2],e.eye[2],s)],l=[$(a[0],e.look[0],s),$(a[1],e.look[1],s),$(a[2],e.look[2],s)];if(this.mode==="orbit"){this.distance=W(Math.hypot(...J(c,e.look)),2.2,220),this.target=l;const m=J(c,l),n=Math.hypot(m[0],m[2]);this.yaw=Math.atan2(m[2],m[0]),this.pitch=Math.atan2(m[1],n)}else{this.position=c;const m=Y(J(l,c));this.flyYaw=Math.atan2(m[2],m[0]),this.flyPitch=Math.asin(W(m[1],-1,1))}}}const fe=4,de=[.025,.11,.32,.72,1],ae=10,ue=20;class Ae{camData=new Float32Array(68);frameData=new Float32Array(116);cascadeData=[];lightData;probeData=new Float32Array(ae*ue);sunElevation=28;sunAzimuth=245;shadowDist=70;fogScale=.9;evBias=0;cloudCover=.42;bloomStrength=.06;caAmount=.55;debugMode=0;taaOn=1;lutOn=1;ssrOn=1;giOn=1;ssrStrength=1;evLock=0;fftOn=1;causticsOn=1;sunDir=[0,1,0];sunColor=[1,1,1];probes=[];bakedSun=null;constructor(e){for(let r=0;r<fe;r++)this.cascadeData.push(new Float32Array(16));this.lightData=new Float32Array(e.length*16),this.packLights(e)}setProbes(e){this.probes=e.slice(0,ae)}packLights(e){e.forEach((r,s)=>{const t=s*16;this.lightData[t]=r.pos[0],this.lightData[t+1]=r.pos[1],this.lightData[t+2]=r.pos[2],this.lightData[t+3]=r.range,this.lightData[t+4]=r.color[0],this.lightData[t+5]=r.color[1],this.lightData[t+6]=r.color[2],this.lightData[t+7]=r.intensity;const a=r.spotDir??[0,-1,0],c=Math.hypot(a[0],a[1],a[2])||1;this.lightData[t+8]=a[0]/c,this.lightData[t+9]=a[1]/c,this.lightData[t+10]=a[2]/c,this.lightData[t+11]=0,this.lightData[t+12]=r.cosInner??0,this.lightData[t+13]=r.cosOuter??0,this.lightData[t+14]=r.spotDir?1:0,this.lightData[t+15]=0})}updateSun(){const e=V(this.sunElevation),r=V(this.sunAzimuth);this.sunDir=[Math.cos(e)*Math.sin(r),Math.sin(e),Math.cos(e)*Math.cos(r)];const s=1-ze(6,26,this.sunElevation);this.sunColor=[1,.965-.42*s,.925-.66*s]}pack(e,r,s,t,a,c,l,m,n,d,v,i,f,u){const w=this.camData;w.set(e.view,0),w.set(e.viewProj,16),w.set(e.invViewProj,32),w.set(e.prevViewProj,48),w[64]=e.camPos[0],w[65]=e.camPos[1],w[66]=e.camPos[2],w[67]=1;const g=this.frameData;g[0]=this.sunDir[0],g[1]=this.sunDir[1],g[2]=this.sunDir[2],g[3]=0,g[4]=this.sunColor[0]*1e5,g[5]=this.sunColor[1]*1e5,g[6]=this.sunColor[2]*1e5,g[7]=1,g[8]=.00125,g[9]=.035,g[10]=.55,g[11]=performance.now()/1e3,g[12]=r,g[13]=s,g[14]=1/r,g[15]=1/s,g[16]=e.near,g[17]=e.far,g[18]=v,g[19]=this.shadowDist;const y=de;g[20]=y[1]*this.shadowDist,g[21]=y[2]*this.shadowDist,g[22]=y[3]*this.shadowDist,g[23]=y[4]*this.shadowDist,g[24]=n,g[25]=d,g[26]=a,g[27]=t,g[28]=this.evBias,g[29]=f,g[30]=u,g[31]=1.15,g[32]=this.cloudCover,g[33]=1,g[34]=this.fogScale,g[35]=i,g[36]=c,g[37]=l,g[38]=m,g[39]=Math.tan(e.fovY/2),g[40]=this.taaOn,g[41]=this.bloomStrength,g[42]=this.caAmount,g[43]=this.debugMode,g[44]=this.lutOn,g[45]=this.ssrOn*this.ssrStrength,g[46]=this.giOn,g[47]=this.evLock,g[48]=this.fftOn,g[49]=this.causticsOn,g[50]=.86,g[51]=1}bakeProbes(){const e=this.sunElevation,r=this.sunAzimuth;if(this.bakedSun&&this.bakedSun.el===e&&this.bakedSun.az===r)return;this.bakedSun={el:e,az:r};const s=this.sunDir,t=[this.sunColor[0]*1e5,this.sunColor[1]*1e5,this.sunColor[2]*1e5],a=64,c=Math.PI*(3-Math.sqrt(5));for(let l=0;l<this.probes.length;l++){const m=this.probes[l],n=1-m.interior,d=l*ue;this.probeData[d]=m.pos[0],this.probeData[d+1]=m.pos[1],this.probeData[d+2]=m.pos[2],this.probeData[d+3]=m.interior;let v=[0,0,0],i=[0,0,0],f=[0,0,0],u=[0,0,0];for(let w=0;w<a;w++){const g=1-2*((w+.5)/a),y=Math.sqrt(Math.max(1-g*g,1e-6)),z=w*c,h=[Math.cos(z)*y,g,Math.sin(z)*y],p=h[1]*.5+.5,L=[.5,.55,.64],P=[.3,.44,.75],S=[0,1,2].map(B=>(L[B]+(P[B]-L[B])*p)*.6),x=W(h[0]*s[0]+h[1]*s[1]+h[2]*s[2],0,1)*.5+.5,b=18e-6*x*x,T=[0,1,2].map(B=>{const D=S[B]+t[B]*b,M=t[B]*.0013*(B===0?1:B===1?.86:.72)*(1+m.bounce*(B===0?.35:B===1?.12:-.1));return M+(D-M)*n});for(let B=0;B<3;B++)v[B]+=T[B]/a,i[B]+=T[B]*h[0]/a,f[B]+=T[B]*h[1]/a,u[B]+=T[B]*h[2]/a}this.probeData[d+4]=v[0],this.probeData[d+5]=v[1],this.probeData[d+6]=v[2],this.probeData[d+7]=0,this.probeData[d+8]=i[0],this.probeData[d+9]=i[1],this.probeData[d+10]=i[2],this.probeData[d+11]=0,this.probeData[d+12]=f[0],this.probeData[d+13]=f[1],this.probeData[d+14]=f[2],this.probeData[d+15]=0,this.probeData[d+16]=u[0],this.probeData[d+17]=u[1],this.probeData[d+18]=u[2],this.probeData[d+19]=0}}updateCascades(e){const r=de,s=e.invViewProj;for(let t=0;t<fe;t++){const a=r[t]*this.shadowDist,c=r[t+1]*this.shadowDist,l=[],m=y=>(e.far-e.near*e.far/y)/(e.far-e.near);for(const[y,z]of[[-1,-1],[1,-1],[1,1],[-1,1]])for(const h of[Math.max(a,e.near+.5),c]){const p=[y,z,W(m(h),0,.9999)],L=s,P=L[0]*p[0]+L[4]*p[1]+L[8]*p[2]+L[12],S=L[1]*p[0]+L[5]*p[1]+L[9]*p[2]+L[13],x=L[2]*p[0]+L[6]*p[1]+L[10]*p[2]+L[14],b=L[3]*p[0]+L[7]*p[1]+L[11]*p[2]+L[15];l.push([P/b,S/b,x/b])}let n=0,d=0,v=0;for(const y of l)n+=y[0],d+=y[1],v+=y[2];n/=8,d/=8,v/=8;let i=0;for(const y of l)i=Math.max(i,Math.hypot(y[0]-n,y[1]-d,y[2]-v));i=Math.max(i,2.5);const f=[n-this.sunDir[0]*(i+30),d-this.sunDir[1]*(i+30),v-this.sunDir[2]*(i+30)],u=N();me(u,f,[n,d,v],[0,1,0]);const w=N();Le(w,-i,i,-i,i,1,(i+30)*2+10);const g=N();pe(g,w,u),this.cascadeData[t].set(g)}}cascadeTexelWorld(){return 2*this.shadowDist*.35/1024}}const E=`
const PI = 3.14159265;

// ---------- uniform structs ----------
struct Camera {
  view         : mat4x4f,
  viewProj     : mat4x4f,
  invViewProj  : mat4x4f,
  prevViewProj : mat4x4f,
  camPos       : vec4f,
};

struct Frame {
  sunDir   : vec4f,  // xyz = dir TO sun, w = unused
  sunColor : vec4f,  // rgb = irradiance (HDR), a = ambient scale
  fog      : vec4f,  // x = density, y = height falloff, z = ground boost, w = time
  screen   : vec4f,  // w, h, 1/w, 1/h
  params   : vec4f,  // x = near, y = far, z = waterLevel, w = shadowDist
  splits   : vec4f,  // cascade split distances (meters)
  counts   : vec4f,  // x = tilesX, y = tilesY, z = lightCount, w = dt
  misc     : vec4f,  // x = evBias, y = evMin, z = evMax, w = bloomThreshold
  extra    : vec4f,  // x = cloudCover, y = cloudSpeed, z = fogScale, w = skyScale
  aux      : vec4f,  // x = texelWorld, y = atlasTexelUV, z = shadowSoftness, w = tanHalfFovY
  dbg      : vec4f,  // x = taaOn, y = bloomStrength, z = CA, w = debugMode
  grade    : vec4f,  // x = lutOn, y = ssrStrength, z = giOn, w = evLock (M3; locked EV = misc.x)
  fx       : vec4f,  // x = fftOn, y = causticsOn, z = foamThresh, w = fftFarBoost (M4)
  cascade0 : mat4x4f,
  cascade1 : mat4x4f,
  cascade2 : mat4x4f,
  cascade3 : mat4x4f,
};

// ---------- full-screen triangle ----------
struct FSOut {
  @builtin(position) clip : vec4f,
  @location(0) uv : vec2f,
};

@vertex
fn vs_fs(@builtin(vertex_index) vi : u32) -> FSOut {
  var p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  let pos = p[vi];
  var o : FSOut;
  o.clip = vec4f(pos, 0.0, 1.0);
  o.uv = pos * 0.5 + 0.5;
  return o;
}

// ---------- depth helpers ----------
fn linDepth(z : f32, near : f32, far : f32) -> f32 {
  return near * far / max(far - z * (far - near), 1e-6);
}

fn worldFromDepth(uv : vec2f, depth : f32, invVP : mat4x4f) -> vec3f {
  let ndc = vec4f(uv.x * 2.0 - 1.0, uv.y * 2.0 - 1.0, depth, 1.0);
  let p = invVP * ndc;
  return p.xyz / p.w;
}

// ---------- noise ----------
fn hash21(p : vec2f) -> f32 {
  var q = fract(p * vec2f(123.34, 456.21));
  q += dot(q, q + 45.32);
  return fract(q.x * q.y);
}

fn vnoise(p : vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm2(p : vec2f, oct : i32) -> f32 {
  var s = 0.0;
  var a = 0.5;
  var q = p;
  for (var i = 0; i < oct; i = i + 1) {
    s += a * vnoise(q);
    q = q * 2.03 + vec2f(17.3, 9.1);
    a = a * 0.5;
  }
  return s;
}

fn hash31(p : vec3f) -> f32 {
  return fract(sin(dot(p, vec3f(127.1, 311.7, 74.7))) * 43758.5453);
}

// ---------- BRDF (Cook-Torrance GGX, height-correlated Smith) ----------
fn D_GGX(NoH : f32, a : f32) -> f32 {
  let a2 = a * a;
  let d = (NoH * a2 - NoH) * NoH + 1.0;
  return a2 / max(PI * d * d, 1e-7);
}

fn V_SmithGGX(NoV : f32, NoL : f32, a : f32) -> f32 {
  let a2 = a * a;
  let lv = NoV * sqrt(max(NoV * (1.0 - a2) + a2, 1e-4));
  let ll = NoL * sqrt(max(NoL * (1.0 - a2) + a2, 1e-4));
  return 0.5 / max(lv + ll, 1e-4);
}

fn fresnelSchlick(F0 : vec3f, VoH : f32) -> vec3f {
  return F0 + (vec3f(1.0) - F0) * pow(1.0 - VoH, 5.0);
}

fn shadePBR(N : vec3f, V : vec3f, L : vec3f, radiance : vec3f,
            albedo : vec3f, F0 : vec3f, rough : f32, metal : f32) -> vec3f {
  let H = normalize(V + L);
  let a = max(rough * rough, 0.002);
  let NoL = saturate(dot(N, L));
  let NoV = saturate(dot(N, V)) + 1e-4;
  let NoH = saturate(dot(N, H));
  let VoH = saturate(dot(V, H));
  let D = D_GGX(NoH, a);
  let vis = V_SmithGGX(NoV, NoL, a);
  let F = fresnelSchlick(F0, VoH);
  let spec = (D * vis) * F * NoL;
  let kd = (vec3f(1.0) - F) * (1.0 - metal);
  let diff = kd * albedo * (1.0 / PI) * NoL;
  return (diff + spec) * radiance;
}

fn henyeyGreenstein(cosTheta : f32, g : f32) -> f32 {
  let g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(max(1.0 + g2 - 2.0 * g * cosTheta, 1e-4), 1.5));
}

// ---------- procedural sky (PBS-like; full LUT model lands at M5) ----------
fn skyBase(dir : vec3f, f : Frame) -> vec3f {
  let lowSun = 1.0 - smoothstep(0.06, 0.42, f.sunDir.y);
  let zen = mix(vec3f(0.10, 0.26, 0.60), vec3f(0.10, 0.12, 0.26), lowSun);
  let hor = mix(vec3f(0.58, 0.70, 0.86), vec3f(0.98, 0.45, 0.17), lowSun);
  let t = pow(saturate(dir.y), 0.5);
  var col = mix(hor, zen, t);
  col = mix(col, hor * 1.12, exp(-max(dir.y, 0.0) * 9.0) * 0.55);
  return col * f.extra.w;
}

fn skyColor(dir : vec3f, f : Frame) -> vec3f {
  let d = normalize(dir);
  var col = skyBase(d, f);
  let cosg = dot(d, f.sunDir.xyz);
  let lowSun = 1.0 - smoothstep(0.06, 0.42, f.sunDir.y);
  // mie glow
  col += f.sunColor.rgb * 0.00005 * pow(max(cosg, 0.0), 7.0);
  // sun disc (HDR; bloom picks it up)
  let disc = smoothstep(0.99950, 0.99988, cosg);
  col += f.sunColor.rgb * 850.0 * disc;
  // procedural cloud layer
  if (d.y > 0.015) {
    let sp = f.extra.y;
    let cuv = d.xz / (d.y + 0.10) * 1.35 + vec2f(f.fog.w * 0.005 * sp, f.fog.w * 0.0032 * sp);
    let n = fbm2(cuv * 0.5, 5);
    let cov = smoothstep(1.02 - f.extra.x, 1.12 - f.extra.x * 0.5, n);
    let shade = mix(vec3f(0.36, 0.39, 0.46), vec3f(0.52, 0.38, 0.32), lowSun);
    let lit = mix(vec3f(1.04, 1.02, 1.00), vec3f(1.25, 0.80, 0.55), lowSun);
    let cloud = mix(shade, lit, smoothstep(0.32, 0.78, n + cosg * 0.18));
    let fade = saturate(d.y * 6.0);
    col = mix(col, cloud * f.extra.w * 0.9, cov * fade * 0.93);
  }
  return col;
}

fn skyAmbient(N : vec3f, f : Frame) -> vec3f {
  let up = N.y * 0.5 + 0.5;
  let hor = vec3f(0.50, 0.55, 0.64);
  let zen = vec3f(0.30, 0.44, 0.75);
  var amb = mix(hor, zen, up) * f.extra.w * 0.6;
  let sunW = saturate(dot(N, f.sunDir.xyz) * 0.5 + 0.5);
  amb += f.sunColor.rgb * 0.000018 * sunW * sunW;
  return amb;
}

// ---------- cascaded shadow maps ----------
fn shadowAtten(f : Frame, tex : texture_depth_2d, smp : sampler_comparison,
               worldPos : vec3f, N : vec3f, ndotl : f32, viewDist : f32) -> f32 {
  if (viewDist > f.splits.w) { return 1.0; }
  var idx = 0;
  if (viewDist > f.splits.x) { idx = 1; }
  if (viewDist > f.splits.y) { idx = 2; }
  if (viewDist > f.splits.z) { idx = 3; }
  var m = f.cascade0;
  if (idx == 1) { m = f.cascade1; }
  if (idx == 2) { m = f.cascade2; }
  if (idx == 3) { m = f.cascade3; }

  // normal-offset bias (world texel size scaled by slope)
  let tw = f.aux.x * (1.0 + 2.2 * (1.0 - ndotl));
  let p = worldPos + N * tw;

  let clip = m * vec4f(p, 1.0);
  let uvC = clip.xy / clip.w * 0.5 + vec2f(0.5);
  let q = vec2f(f32(idx & 1), f32(idx >> 1)) * 0.5;
  let suv = uvC * 0.5 + q;
  let depthRef = clip.z / clip.w - 0.0006 - f32(idx) * 0.0005;

  if (suv.x < 0.0 || suv.x > 1.0 || suv.y < 0.0 || suv.y > 1.0) { return 1.0; }

  let tx = f.aux.y;
  let o = f.aux.z;
  var s = textureSampleCompareLevel(tex, smp, suv, depthRef);
  s += textureSampleCompareLevel(tex, smp, suv + vec2f(tx * o, 0.0), depthRef);
  s += textureSampleCompareLevel(tex, smp, suv + vec2f(0.0, tx * o), depthRef);
  s += textureSampleCompareLevel(tex, smp, suv - vec2f(tx * o, 0.0), depthRef);
  s += textureSampleCompareLevel(tex, smp, suv - vec2f(0.0, tx * o), depthRef);
  return s * 0.2;
}

// ---------- aerial perspective (height fog + shadowed sun shafts) ----------
fn fogTransmittance(f : Frame, dist : f32, height : f32) -> f32 {
  let dens = f.fog.x * f.extra.z;
  if (dens < 1e-6) { return 1.0; }
  let h = max(height - f.params.z, 0.0);
  let hf = exp(-h * f.fog.y);
  let ground = 1.0 + f.fog.z * saturate(1.0 - h / 8.0);
  return exp(-dens * dist * hf * ground);
}

fn applyFog(colorIn : vec3f, f : Frame, worldPos : vec3f, camPos : vec3f,
            tex : texture_depth_2d, smp : sampler_comparison) -> vec3f {
  let toP = worldPos - camPos;
  let dist = length(toP);
  if (dist < 1.0) { return colorIn; }
  let dir = toP / dist;
  let midH = (camPos.y + worldPos.y) * 0.5;
  let T = fogTransmittance(f, dist, midH);
  if (T > 0.99999) { return colorIn; }
  var inscatter = skyBase(dir, f) * 0.95 + f.sunColor.rgb * 0.000018;
  // sun shaft: shadow the in-scatter at 35% along the ray
  let sp = camPos + dir * dist * 0.35;
  let sh = shadowAtten(f, tex, smp, sp, vec3f(0.0, 1.0, 0.0), 1.0, dist * 0.35 + 1.0);
  let cosg = dot(dir, f.sunDir.xyz);
  let phase = 0.4 + 2.4 * henyeyGreenstein(cosg, 0.62);
  inscatter *= phase * mix(0.45, 1.0, saturate(sh * 1.7));
  return colorIn * T + inscatter * (1.0 - T);
}

// ---------- ACES ----------
fn acesFilm(x : vec3f) -> vec3f {
  let a = 2.51; let b = 0.03; let c = 2.43; let d = 0.59; let e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3f(0.0), vec3f(1.0));
}
`,Me=`
struct MeshConst {
  matId : f32,
  pad0  : f32,
  pad1  : f32,
  pad2  : f32,
};

@group(0) @binding(0) var<uniform> cam : Camera;
@group(1) @binding(0) var<uniform> mesh : MeshConst;

struct VSOut {
  @builtin(position) clip : vec4f,
  @location(0) worldPos : vec3f,
  @location(1) normal : vec3f,
  @location(2) uv : vec2f,
  @location(3) @interpolate(flat) matId : u32,
};

@vertex
fn vs_mesh(@location(0) pos : vec3f, @location(1) nrm : vec3f, @location(2) uv : vec2f) -> VSOut {
  var o : VSOut;
  o.worldPos = pos;   // static scene: world transforms baked on CPU
  o.normal = nrm;
  o.uv = uv;
  o.clip = cam.viewProj * vec4f(pos, 1.0);
  o.matId = u32(mesh.matId + 0.5);
  return o;
}

// ---------- material library (procedural) ----------
struct MatOut {
  albedo : vec3f,
  gloss : f32,
  metallic : f32,
  N : vec3f,
};

fn perturb(N : vec3f, wp : vec3f, freq : f32, amp : f32) -> vec3f {
  let e = 0.06;
  let t = select(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 0.0, 1.0), abs(N.y) > 0.9);
  let T = normalize(cross(N, t));
  let Bt = cross(N, T);
  let f0 = fbm2(wp.xz * freq + vec2f(wp.y * freq * 0.7), 3);
  let fx = fbm2(wp.xz * freq + T.xz * e * freq + vec2f(wp.y * freq * 0.7), 3);
  let fz = fbm2(wp.xz * freq + Bt.xz * e * freq + vec2f(wp.y * freq * 0.7), 3);
  return normalize(N + (T * (fx - f0) + Bt * (fz - f0)) * amp);
}

fn pbrMat(matId : u32, wp : vec3f, N : vec3f) -> MatOut {
  var m : MatOut;
  m.albedo = vec3f(0.5);
  m.gloss = 0.2;
  m.metallic = 0.0;
  m.N = N;

  if (matId == 0u) {
    // concrete / sand
    let n = fbm2(wp.xz * 0.42 + vec2f(wp.y * 0.2), 4);
    let n2 = fbm2(wp.xz * 3.0, 3);
    var c = mix(vec3f(0.42, 0.41, 0.39), vec3f(0.58, 0.56, 0.52), n);
    c = mix(c, c * 0.82, smoothstep(0.62, 0.78, n2) * 0.6);
    m.albedo = c;
    m.gloss = 0.08 + n2 * 0.08;
    m.N = perturb(N, wp, 2.4, 0.22);
  } else if (matId == 1u) {
    // plaster
    let n = fbm2(vec2f(wp.x + wp.z * 0.7, wp.y) * 0.9, 4);
    m.albedo = mix(vec3f(0.72, 0.69, 0.63), vec3f(0.82, 0.79, 0.73), n);
    m.gloss = 0.16 + n * 0.1;
    m.N = perturb(N, wp, 1.1, 0.1);
  } else if (matId == 2u) {
    // interior wood floor (planks along x)
    let plank = floor(wp.x * 0.85 + floor(wp.z * 0.5) * 3.7);
    let grain = fbm2(vec2f(wp.x * 0.7, wp.z * 7.0) + vec2f(plank * 13.1), 4);
    let border = abs(fract(wp.x * 0.85) - 0.5);
    var c = mix(vec3f(0.34, 0.21, 0.11), vec3f(0.52, 0.35, 0.19), grain);
    c *= mix(0.75, 1.05, hash31(vec3f(plank, 3.0, 7.0)));
    c *= mix(0.55, 1.0, smoothstep(0.0, 0.06, border));
    m.albedo = c;
    m.gloss = 0.35 + grain * 0.2;
    m.N = perturb(N, wp, 5.0, 0.3);
  } else if (matId == 3u) {
    // weathered deck planks (along x, grooves in z)
    let plank = floor(wp.z * 1.05);
    let grain = fbm2(vec2f(wp.x * 4.0, wp.z * 0.8) + vec2f(plank * 7.7), 4);
    let border = abs(fract(wp.z * 1.05) - 0.5);
    var c = mix(vec3f(0.30, 0.25, 0.20), vec3f(0.46, 0.38, 0.29), grain);
    c *= mix(0.85, 1.1, hash31(vec3f(plank, 1.0, 9.0)));
    c *= mix(0.4, 1.0, smoothstep(0.0, 0.05, border));
    m.albedo = c;
    m.gloss = 0.18 + grain * 0.18;
    m.N = perturb(N, wp, 6.0, 0.42);
  } else if (matId == 4u) {
    // metal
    let n = fbm2(vec2f(wp.x, wp.z) * 1.7, 3);
    m.albedo = mix(vec3f(0.55, 0.56, 0.58), vec3f(0.68, 0.69, 0.71), n);
    m.gloss = 0.5 + n * 0.2;
    m.metallic = 0.95;
    m.N = perturb(N, wp, 2.0, 0.08);
  } else if (matId == 5u) {
    // fabric
    let weave = fbm2(vec2f(wp.x * 40.0, wp.y * 40.0), 2);
    let n = fbm2(vec2f(wp.x * 1.3, wp.z * 1.3), 3);
    m.albedo = mix(vec3f(0.22, 0.19, 0.16), vec3f(0.34, 0.29, 0.24), n) * (0.9 + weave * 0.2);
    m.gloss = 0.05;
    m.N = perturb(N, wp, 8.0, 0.12);
  } else if (matId == 6u) {
    // foliage (bamboo / ferns)
    let n = fbm2(vec2f(wp.x * 2.2 + wp.y, wp.z * 2.2), 3);
    m.albedo = mix(vec3f(0.10, 0.24, 0.08), vec3f(0.20, 0.42, 0.12), n);
    m.gloss = 0.22 + n * 0.2;
    m.N = perturb(N, wp, 3.0, 0.2);
  } else if (matId == 7u) {
    // rock
    let n = fbm2(wp.xz * 1.4 + vec2f(wp.y * 1.1), 5);
    let n2 = fbm2(wp.xz * 6.0, 3);
    var c = mix(vec3f(0.24, 0.23, 0.22), vec3f(0.44, 0.42, 0.40), n);
    c = mix(c, c * 0.7, smoothstep(0.55, 0.75, n2));
    m.albedo = c;
    m.gloss = 0.06 + n2 * 0.08;
    m.N = perturb(N, wp, 3.5, 0.5);
  } else {
    // emissive bulb
    m.albedo = vec3f(1.0, 0.95, 0.85);
    m.gloss = 0.4;
  }
  return m;
}

struct GBufOut {
  @location(0) g0 : vec4f, // rgb albedo (linear), a = matId/255
  @location(1) g1 : vec4f, // xyz normal, w gloss
  @location(2) g2 : vec4f, // rgb F0, a metallic
};

@fragment
fn fs_gbuffer(in : VSOut) -> GBufOut {
  let m = pbrMat(in.matId, in.worldPos, normalize(in.normal));
  var o : GBufOut;
  o.g0 = vec4f(m.albedo, f32(in.matId) / 255.0);
  o.g1 = vec4f(m.N, m.gloss);
  let F0 = mix(vec3f(0.04), m.albedo, m.metallic);
  o.g2 = vec4f(F0, m.metallic);
  return o;
}
`,Ce=`
@group(0) @binding(0) var<uniform> cascadeMat : mat4x4f;

@vertex
fn vs_shadow(@location(0) pos : vec3f, @location(1) nrm : vec3f, @location(2) uv : vec2f) -> @builtin(position) vec4f {
  return cascadeMat * vec4f(pos, 1.0);
}
`,Ee=`
struct Light {
  posRange : vec4f,
  colorI   : vec4f,
  dirSpot  : vec4f,
  params   : vec4f,
};

const MAXL = 24u;

@group(0) @binding(0) var<storage, read> lights : array<Light>;
@group(0) @binding(1) var<storage, read_write> gridCounts : array<atomic<u32>>;
@group(0) @binding(2) var<storage, read_write> gridIndices : array<u32>;
@group(0) @binding(3) var t_depth : texture_depth_2d;
@group(0) @binding(4) var<uniform> cam : Camera;
@group(0) @binding(5) var<uniform> frame : Frame;

@compute @workgroup_size(16, 16)
fn cullMain(@builtin(global_invocation_id) g : vec3u) {
  let tilesX = u32(frame.counts.x);
  let tilesY = u32(frame.counts.y);
  if (g.x >= tilesX || g.y >= tilesY) { return; }
  let tileId = g.y * tilesX + g.x;

  var zmin = 1.0;
  var zmax = 0.0;
  let basePx = vec2i(g.xy) * 16;
  for (var y = 0; y < 16; y = y + 1) {
    for (var x = 0; x < 16; x = x + 1) {
      let z = textureLoad(t_depth, basePx + vec2i(x, y), 0);
      zmin = min(zmin, z);
      zmax = max(zmax, z);
    }
  }
  if (zmax <= 0.0) { return; }
  zmin = min(zmin, 0.99999);
  zmax = max(zmax, 0.0001);

  let near = frame.params.x;
  let far = frame.params.y;
  let vNear = linDepth(zmin, near, far);
  let vFar = linDepth(zmax, near, far);

  // tile xy extents at vFar (conservative view-space AABB)
  let tanY = frame.aux.w;
  let tanX = tanY * frame.screen.x / frame.screen.y;
  let fx0 = (f32(g.x) * 16.0 * frame.screen.z) * 2.0 - 1.0;
  let fx1 = (min(f32(g.x + 1u) * 16.0, frame.screen.x) * frame.screen.z) * 2.0 - 1.0;
  let fy0 = (f32(g.y) * 16.0 * frame.screen.w) * 2.0 - 1.0;
  let fy1 = (min(f32(g.y + 1u) * 16.0, frame.screen.y) * frame.screen.w) * 2.0 - 1.0;
  let xmin = min(fx0, fx1) * tanX * vFar;
  let xmax = max(fx0, fx1) * tanX * vFar;
  let ymin = min(fy0, fy1) * tanY * vFar;
  let ymax = max(fy0, fy1) * tanY * vFar;

  let count = u32(frame.counts.z);
  for (var i = 0u; i < count; i = i + 1) {
    let L = lights[i];
    let lp = (cam.view * vec4f(L.posRange.xyz, 1.0)).xyz;
    let d = -lp.z;
    let r = L.posRange.w;
    if (d + r < vNear * 0.5 || d - r > vFar * 1.2) { continue; }
    let c = clamp(lp, vec3f(xmin, ymin, -vFar), vec3f(xmax, ymax, -vNear));
    let dd = lp - c;
    if (dot(dd, dd) <= r * r) {
      let n = atomicAdd(&gridCounts[tileId], 1u);
      if (n < MAXL) {
        let slot = tilesX * tilesY * MAXL + tileId * MAXL + n;
        gridIndices[slot] = i;
      }
    }
  }
}
`,Re=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_depth : texture_depth_2d;
@group(1) @binding(1) var t_g1 : texture_2d<f32>;

fn aoSampleDir(i : i32, px : vec2f) -> vec3f {
  let h1 = hash21(px + vec2f(f32(i) * 1.37, f32(i) * 0.71));
  let h2 = hash21(px + vec2f(f32(i) * 2.11 + 5.0, f32(i) * 1.13 + 9.0));
  let h3 = hash21(px + vec2f(f32(i) * 0.57 + 11.0, f32(i) * 3.71 + 3.0));
  let cosT = h1;
  let sinT = sqrt(max(1.0 - cosT * cosT, 0.0));
  let phi = h2 * 2.0 * PI + h3 * 0.5;
  return vec3f(cos(phi) * sinT, sin(phi) * sinT, cosT);
}

@fragment
fn fs_ssao(in : FSOut) -> @location(0) vec4f {
  let fullPx = clamp(vec2i(in.clip.xy) * 2, vec2i(0), vec2i(frame.screen.xy) - vec2i(1));
  let depth = textureLoad(t_depth, fullPx, 0);
  if (depth > 0.99999) { return vec4f(1.0); }
  let uv = in.clip.xy / (frame.screen.xy * 0.5);
  let world = worldFromDepth(uv, depth, cam.invViewProj);
  let g1 = textureLoad(t_g1, fullPx, 0);
  let N = normalize(g1.xyz);
  let viewDist = distance(world, cam.camPos.xyz);
  if (viewDist > 90.0) { return vec4f(1.0); }

  let t = select(vec3f(1.0, 0.0, 0.0), vec3f(0.0, 0.0, 1.0), abs(N.y) > 0.9);
  let T = normalize(cross(N, t));
  let B = cross(N, T);

  let radius = 0.85;
  let bias = 0.025;
  var occ = 0.0;
  let NSAMP = 14;
  for (var i = 0; i < NSAMP; i = i + 1) {
    let d3 = aoSampleDir(i, vec2f(fullPx));
    let sp = world + (T * d3.x + B * d3.y + N * d3.z) * radius;
    let clip = cam.viewProj * vec4f(sp, 1.0);
    let cuv = clip.xy / clip.w * 0.5 + vec2f(0.5);
    if (cuv.x < 0.0 || cuv.x > 1.0 || cuv.y < 0.0 || cuv.y > 1.0) { continue; }
    let cpx = clamp(vec2i(cuv * frame.screen.xy), vec2i(0), vec2i(frame.screen.xy) - vec2i(1));
    let sdepth = textureLoad(t_depth, cpx, 0);
    let sdist = linDepth(sdepth, frame.params.x, frame.params.y);
    let pdist = distance(sp, cam.camPos.xyz);
    let delta = pdist - sdist;
    if (delta > bias && delta < radius * 2.2) {
      occ += (1.0 - delta / (radius * 2.2));
    }
  }
  var ao = 1.0 - occ / f32(NSAMP);
  ao = pow(clamp(ao, 0.0, 1.0), 1.6);
  return vec4f(vec3f(ao), 1.0);
}
`,Ge=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_aoSrc : texture_2d<f32>;
@group(1) @binding(1) var smpLin : sampler;

@fragment
fn fs_aoBlur(in : FSOut) -> @location(0) vec4f {
  let halfSize = frame.screen.xy * 0.5;
  let tx = 1.4 / halfSize;
  let uv = in.clip.xy / halfSize;
  var a = textureSampleLevel(t_aoSrc, smpLin, uv, 0.0).r * 0.34;
  a += textureSampleLevel(t_aoSrc, smpLin, uv + vec2f(tx.x, 0.0), 0.0).r * 0.165;
  a += textureSampleLevel(t_aoSrc, smpLin, uv - vec2f(tx.x, 0.0), 0.0).r * 0.165;
  a += textureSampleLevel(t_aoSrc, smpLin, uv + vec2f(0.0, tx.y), 0.0).r * 0.165;
  a += textureSampleLevel(t_aoSrc, smpLin, uv - vec2f(0.0, tx.y), 0.0).r * 0.165;
  return vec4f(vec3f(clamp(a, 0.0, 1.0)), 1.0);
}
`,Oe=`
struct Light {
  posRange : vec4f,
  colorI   : vec4f,
  dirSpot  : vec4f,
  params   : vec4f,
};

// Baked irradiance probe (M3 GI): SH-L1 per channel — L0 rgb + three axis
// L1 vectors rgb. Reconstruction: E(n) = L0 + 3 * dot(L1, n) (exact for a
// linear irradiance field, good approximation for our clamped sky model).
struct Probe {
  posW : vec4f, // xyz = world pos, w = interior factor
  shAr : vec4f, // L0 rgb
  shAx : vec4f, // L1 x-axis rgb
  shAy : vec4f, // L1 y-axis rgb
  shAz : vec4f, // L1 z-axis rgb
};

const PROBE_N = 10u;
const MAXL = 24u;

@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(0) @binding(2) var t_shadow : texture_depth_2d;
@group(0) @binding(3) var smpCmp : sampler_comparison;
@group(1) @binding(0) var t_g0 : texture_2d<f32>;
@group(1) @binding(1) var t_g1 : texture_2d<f32>;
@group(1) @binding(2) var t_g2 : texture_2d<f32>;
@group(1) @binding(3) var t_depth : texture_depth_2d;
@group(1) @binding(4) var t_ao : texture_2d<f32>;
@group(1) @binding(5) var<storage, read> lights : array<Light>;
@group(1) @binding(6) var<storage, read> gridCounts : array<u32>; // written via atomics in cull; read as plain u32 here
@group(1) @binding(7) var<storage, read> gridIndices : array<u32>;
@group(1) @binding(8) var<storage, read> probes : array<Probe>;

fn roughOf(gloss : f32) -> f32 {
  return clamp(1.0 - gloss, 0.045, 1.0);
}

// Inverse-distance blend of probe SH irradiance (fixed trip over PROBE_N).
fn probeIrradiance(world : vec3f, N : vec3f) -> vec3f {
  var acc = vec3f(0.0);
  var wsum = 0.0;
  for (var i = 0u; i < PROBE_N; i = i + 1u) {
    let P = probes[i];
    let dv = P.posW.xyz - world;
    // weight falls off with distance; probe radius ~ 6-12 m in this scene
    let w = 1.0 / (dot(dv, dv) + 9.0);
    let L1 = P.shAx.rgb * N.x + P.shAy.rgb * N.y + P.shAz.rgb * N.z;
    acc += (P.shAr.rgb + 3.0 * L1) * w;
    wsum += w;
  }
  return acc / max(wsum, 1e-5);
}

@fragment
fn fs_lighting(in : FSOut) -> @location(0) vec4f {
  let px = vec2i(in.clip.xy);
  let depth = textureLoad(t_depth, px, 0);
  let uv = in.clip.xy * frame.screen.zw;

  if (depth > 0.99999) {
    let ndc = vec3f(uv.x * 2.0 - 1.0, uv.y * 2.0 - 1.0, 1.0);
    let p = cam.invViewProj * vec4f(ndc, 1.0);
    let dir = normalize(p.xyz / p.w - cam.camPos.xyz);
    let sky = skyColor(dir, frame);
    return vec4f(sky, 1.0);
  }

  let g0 = textureLoad(t_g0, px, 0);
  let g1 = textureLoad(t_g1, px, 0);
  let g2 = textureLoad(t_g2, px, 0);
  let albedo = g0.rgb;
  let matId = u32(g0.a * 255.0 + 0.5);
  let N = normalize(g1.xyz);
  let gloss = g1.w;
  let F0 = g2.rgb;
  let metallic = g2.a;
  let world = worldFromDepth(uv, depth, cam.invViewProj);
  let toCam = cam.camPos.xyz - world;
  let viewDist = length(toCam);
  let V = toCam / max(viewDist, 1e-4);
  let rough = roughOf(gloss);

  // --- sun (CSM 4 cascades) ---
  let ndotl = saturate(dot(N, frame.sunDir.xyz));
  let sh = shadowAtten(frame, t_shadow, smpCmp, world, N, ndotl, viewDist);
  var color = shadePBR(N, V, frame.sunDir.xyz, frame.sunColor.rgb, albedo, F0, rough, metallic) * sh;

  // --- M4 caustics: animated interference pattern on submerged surfaces
  // (underwater rocks, pier piles). Textured method per plan §M4 — projected
  // through the sun direction, depth-attenuated, gated by the sun height.
  if (frame.fx.y > 0.5 && world.y < frame.params.z - 0.02) {
    let depthW = frame.params.z - world.y;
    let t4 = frame.fog.w;
    let cuv = world.xz * 0.42;
    let c1 = fbm2(cuv + vec2f(t4 * 0.16, t4 * 0.11), 3);
    let c2 = fbm2(cuv * 1.9 + vec2f(-t4 * 0.21, t4 * 0.07) + vec2f(4.7), 3);
    let inter = 1.0 - abs(c1 - c2) * 3.2;
    let caust = pow(saturate(inter), 4.0);
    let att = exp(-depthW * 0.22);
    let sunUp = saturate(frame.sunDir.y * 3.0);
    color += albedo * frame.sunColor.rgb * (ndotl * sh) * caust * att * 0.9 * sunUp;
  }

  // --- punctual / spot lights via FPTL grid ---
  let tilesX = u32(frame.counts.x);
  let tilesY = u32(frame.counts.y);
  let tile = vec2u(clamp(px, vec2i(0), vec2i(frame.screen.xy) - vec2i(1))) / 16u;
  let tileId = clamp(tile.y, 0u, tilesY - 1u) * tilesX + clamp(tile.x, 0u, tilesX - 1u);
  let count = min(gridCounts[tileId], MAXL);
  let lightCount = u32(frame.counts.z);
  let idxBase = tilesX * tilesY * MAXL + tileId * MAXL;
  for (var i = 0u; i < count; i = i + 1) {
    let li = gridIndices[idxBase + i];
    if (li >= lightCount) { continue; }
    let L = lights[li];
    let toL = L.posRange.xyz - world;
    let d2 = dot(toL, toL);
    let d = sqrt(d2);
    let range = L.posRange.w;
    if (d > range || d < 1e-4) { continue; }
    let Ld = toL / d;
    let win = pow(saturate(1.0 - pow(d / range, 4.0)), 2.0);
    var att = win / max(d2, 0.02);
    let cd = dot(-Ld, normalize(L.dirSpot.xyz));
    let spot = select(1.0, smoothstep(L.params.y, L.params.x, cd), L.params.z > 0.5);
    att *= spot;
    color += shadePBR(N, V, Ld, L.colorI.rgb * L.colorI.w * att, albedo, F0, rough, metallic);
  }

  // --- ambient / GI (M3): SH-probe irradiance, AO from SSAO ---
  let aoDims = vec2i(textureDimensions(t_ao));
  let aoPx = clamp(px >> vec2u(1), vec2i(0), aoDims - vec2i(1));
  let ao = textureLoad(t_ao, aoPx, 0).r;
  var ambient : vec3f;
  if (frame.grade.z > 0.5) {
    // spatially varying probe GI (interior warm bounce / exterior sky)
    ambient = probeIrradiance(world, N);
  } else {
    // legacy static ambient (pre-M3 fallback)
    let interAmb = frame.sunColor.rgb * 0.0013 * vec3f(1.0, 0.86, 0.72);
    ambient = mix(interAmb, skyAmbient(N, frame), saturate(sh * 1.9 + 0.06));
  }
  color += ambient * ao * albedo * (1.0 - metallic);

  // --- emissive bulbs ---
  if (matId == 8u) {
    color += vec3f(1.0, 0.85, 0.6) * 16.0;
  }

  // --- debug modes ---
  if (frame.dbg.w > 0.5 && frame.dbg.w < 1.5) { color = albedo; }
  if (frame.dbg.w > 1.5 && frame.dbg.w < 2.5) { color = N * 0.5 + vec3f(0.5); }
  if (frame.dbg.w > 2.5 && frame.dbg.w < 3.5) { color = vec3f(ao); }
  if (frame.dbg.w > 5.5 && frame.dbg.w < 6.5) { color = vec3f(sh); }        // shadow term
  if (frame.dbg.w > 7.5 && frame.dbg.w < 8.5) { color = ambient * 0.003; }  // ambient field

  // --- aerial perspective ---
  color = applyFog(color, frame, world, cam.camPos.xyz, t_shadow, smpCmp);
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,ie=`
struct OceanVOut {
  @builtin(position) clip : vec4f,
  @location(0) world : vec3f,
  @location(1) normal : vec3f,
  @location(2) foam : f32,
};

struct Gerstner {
  disp : vec3f,
  B    : vec3f,
  T    : vec3f,
  J    : f32,
};

// One Gerstner wave accumulated into state (no dynamic array indexing —
// SwiftShader-safe). Waves are unrolled at call sites with literal params.
fn accWave(s : ptr<function, Gerstner>, dx : f32, dz : f32, wl : f32, steep : f32,
           pos2 : vec2f, t : f32, fade : f32) {
  let d = normalize(vec2f(dx, dz));
  let k = 2.0 * PI / wl;
  let c = sqrt(9.81 / k);
  let f = k * (dot(d, pos2) - c * t);
  let a = (steep / k) * fade;
  let ak = a * k;
  let sf = sin(f) * fade;
  let cf = cos(f);
  (*s).disp += vec3f(d.x * a * cf, a * sf, d.y * a * cf);
  (*s).B.y += d.x * ak * cf;
  (*s).T.y += d.y * ak * cf;
  (*s).J += d.x * d.x * ak * sf;
}

fn gerstner(pos2 : vec2f, t : f32, fade : f32) -> Gerstner {
  var g : Gerstner;
  g.disp = vec3f(0.0);
  g.B = vec3f(1.0, 0.0, 0.0);
  g.T = vec3f(0.0, 0.0, 1.0);
  g.J = 0.0;
  var sumXZ = 0.0;
  var sumZZ = 0.0;

  var w1 : Gerstner = g;
  accWave(&w1,  0.85,  0.53, 26.0, 0.055, pos2, t, fade);
  var w2 : Gerstner = g;
  accWave(&w2,  0.65, -0.76, 15.0, 0.050, pos2, t, fade);
  var w3 : Gerstner = g;
  accWave(&w3, -0.35,  0.94,  8.4, 0.045, pos2, t, fade);
  var w4 : Gerstner = g;
  accWave(&w4,  0.95, -0.30,  4.9, 0.040, pos2, t, fade);
  var w5 : Gerstner = g;
  accWave(&w5, -0.70, -0.72,  2.8, 0.035, pos2, t, fade);
  var w6 : Gerstner = g;
  accWave(&w6,  0.30,  0.95,  1.7, 0.030, pos2, t, fade);

  var sumXX = w1.J + w2.J + w3.J + w4.J + w5.J + w6.J;
  var disp = w1.disp + w2.disp + w3.disp + w4.disp + w5.disp + w6.disp;
  var By = w1.B.y + w2.B.y + w3.B.y + w4.B.y + w5.B.y + w6.B.y;
  var Ty = w1.T.y + w2.T.y + w3.T.y + w4.T.y + w5.T.y + w6.T.y;

  // cross terms for jacobian
  var sxz = 0.0;
  var szz = 0.0;
  var wv : Gerstner = g;
  accWave(&wv,  0.85,  0.53, 26.0, 0.055, pos2, t, fade); let a1d = normalize(vec2f(0.85, 0.53));
  accWave(&wv,  0.65, -0.76, 15.0, 0.050, pos2, t, fade); let a2d = normalize(vec2f(0.65, -0.76));
  accWave(&wv, -0.35,  0.94,  8.4, 0.045, pos2, t, fade); let a3d = normalize(vec2f(-0.35, 0.94));
  accWave(&wv,  0.95, -0.30,  4.9, 0.040, pos2, t, fade); let a4d = normalize(vec2f(0.95, -0.30));
  accWave(&wv, -0.70, -0.72,  2.8, 0.035, pos2, t, fade); let a5d = normalize(vec2f(-0.70, -0.72));
  accWave(&wv,  0.30,  0.95,  1.7, 0.030, pos2, t, fade); let a6d = normalize(vec2f(0.30, 0.95));
  sxz = a1d.x * a1d.y + a2d.x * a2d.y + a3d.x * a3d.y + a4d.x * a4d.y + a5d.x * a5d.y + a6d.x * a6d.y;
  szz = a1d.y * a1d.y + a2d.y * a2d.y + a3d.y * a3d.y + a4d.y * a4d.y + a5d.y * a5d.y + a6d.y * a6d.y;
  // scale cross terms with the shared ak*sf magnitude proxy (approximate)
  let mag = sumXX;
  sumXZ = sxz * mag * 0.5;
  sumZZ = szz * mag * 0.5;

  g.disp = disp;
  g.B = vec3f(1.0 - sumXX, By, sumXZ);
  g.T = vec3f(sumXZ, Ty, 1.0 - sumZZ);
  g.J = (1.0 - sumXX) * (1.0 - sumZZ) - sumXZ * sumXZ;
  return g;
}

@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(0) @binding(2) var t_shadow : texture_depth_2d;
@group(0) @binding(3) var smpCmp : sampler_comparison;
@group(1) @binding(0) var t_scene : texture_2d<f32>;
@group(1) @binding(1) var t_depth : texture_depth_2d;
@group(1) @binding(2) var smpLin : sampler;
@group(1) @binding(3) var t_disp : texture_2d<f32>; // M4: FFT displacement (r=Dx, g=h, b=Dz)
@group(1) @binding(4) var smpRep : sampler;         // linear + repeat wrap

// ---------------------------------------------------------------------------
// M4 FFT ocean wave field: displacement from the 256² Tessendorf texture at
// two UV scales (near chop 130 m + far swell 920 m). Normals and the Jacobian
// foam term come from central differences of the summed displacement field —
// 10 linear taps per vertex, no extra IFFT chains needed.
fn dispAt(uv : vec2f) -> vec3f {
  let d = textureSampleLevel(t_disp, smpRep, uv, 0.0);
  return vec3f(d.x, d.y, d.z);
}

fn fftWave(pos2 : vec2f, fade : f32) -> Gerstner {
  var g : Gerstner;
  let L1 = 130.0;
  let L2 = 920.0;
  let e1 = 1.0 / 256.0;
  let uv1 = pos2 / L1;
  let uv2 = pos2 / L2 + vec2f(0.37, 0.71);
  let c1 = dispAt(uv1);
  let x1p = dispAt(uv1 + vec2f(e1, 0.0)); let x1m = dispAt(uv1 - vec2f(e1, 0.0));
  let z1p = dispAt(uv1 + vec2f(0.0, e1)); let z1m = dispAt(uv1 - vec2f(0.0, e1));
  let c2 = dispAt(uv2);
  let x2p = dispAt(uv2 + vec2f(e1, 0.0)); let x2m = dispAt(uv2 - vec2f(e1, 0.0));
  let z2p = dispAt(uv2 + vec2f(0.0, e1)); let z2m = dispAt(uv2 - vec2f(0.0, e1));

  // per-cascade amplitude: near chop + far swell (boost rescales the retiled spectrum)
  let a1 = vec3f(0.75, 1.0, 0.75) * fade;
  let a2 = vec3f(1.1, 1.45, 1.1) * fade * frame.fx.w;
  g.disp = c1 * a1 + c2 * a2;

  // world-space derivatives: dD/dx = (D(uv+e) - D(uv-e)) * a / (2·e·L)
  let s1 = a1 / (2.0 * e1 * L1);
  let s2 = a2 / (2.0 * e1 * L2);
  let dDx_dx = (x1p.x - x1m.x) * s1.x + (x2p.x - x2m.x) * s2.x;
  let dh_dx  = (x1p.y - x1m.y) * s1.y + (x2p.y - x2m.y) * s2.y;
  let dDz_dx = (x1p.z - x1m.z) * s1.z + (x2p.z - x2m.z) * s2.z;
  let dDx_dz = (z1p.x - z1m.x) * s1.x + (z2p.x - z2m.x) * s2.x;
  let dh_dz  = (z1p.y - z1m.y) * s1.y + (z2p.y - z2m.y) * s2.y;
  let dDz_dz = (z1p.z - z1m.z) * s1.z + (z2p.z - z2m.z) * s2.z;

  g.B = vec3f(1.0 + dDx_dx, dh_dx, dDx_dz);
  g.T = vec3f(dDx_dz, dh_dz, 1.0 + dDz_dz);
  g.J = (1.0 + dDx_dx) * (1.0 + dDz_dz) - dDx_dz * dDz_dx;
  return g;
}

// ---------------------------------------------------------------------------
// M3 SSR: screen-space ray march against the scene depth (hdrB, pre-ocean).
// Returns hit color + confidence; miss → alpha 0 → caller keeps sky reflection.
// SwiftShader-safe: fixed-trip loops, NO break (predicated first-hit),
// clamped loads only — dynamic loop exits crash the SwiftShader JIT here.
fn ssrMarch(originW : vec3f, dirW : vec3f, maxDist : f32) -> vec4f {
  let p0 = cam.viewProj * vec4f(originW, 1.0);
  let p1 = cam.viewProj * vec4f(originW + dirW * maxDist, 1.0);
  if (p0.w <= 0.0 || p1.w <= 0.0) { return vec4f(0.0); }
  let n0 = p0.xyz / p0.w;
  let n1 = p1.xyz / p1.w;
  let uv0 = n0.xy * 0.5 + vec2f(0.5);
  let uv1 = n1.xy * 0.5 + vec2f(0.5);
  let z0 = n0.z;
  let z1 = n1.z;

  // fixed 12-step march, predicated: first crossing wins (hitT sentinel 9)
  var hitT = 9.0;
  for (var i = 1; i <= 12; i = i + 1) {
    let s = f32(i) / 12.0;
    let uv = clamp(mix(uv0, uv1, s), vec2f(0.002), vec2f(0.998));
    let px = vec2i(uv * frame.screen.xy);
    let zS = textureLoad(t_depth, px, 0);
    let zR = mix(z0, z1, s);
    let cross = zS < 0.99999 && zR > zS + 0.00035 + s * 0.0012;
    if (cross && hitT > 8.0) {
      hitT = s;
    }
  }

  // 4-step binary refine between the last miss and the hit (fixed trip)
  var lo = hitT - 1.0 / 12.0;
  var hi = hitT;
  for (var i = 0; i < 4; i = i + 1) {
    let mid = (lo + hi) * 0.5;
    let uv = clamp(mix(uv0, uv1, mid), vec2f(0.002), vec2f(0.998));
    let px = vec2i(uv * frame.screen.xy);
    let zS = textureLoad(t_depth, px, 0);
    let zR = mix(z0, z1, mid);
    let cross = zS < 0.99999 && zR > zS + 0.00035;
    if (cross) { hi = mid; } else { lo = mid; }
  }
  if (hitT > 8.0) { return vec4f(0.0); }
  let uvHit = clamp(mix(uv0, uv1, (lo + hi) * 0.5), vec2f(0.002), vec2f(0.998));

  let edge = min(min(uvHit.x, 1.0 - uvHit.x) * 9.0, min(uvHit.y, 1.0 - uvHit.y) * 9.0);
  let conf = saturate(edge) * saturate(1.0 - hitT * 0.55);
  let col = textureSampleLevel(t_scene, smpLin, uvHit, 0.0).rgb;
  return vec4f(col, conf);
}

@vertex
fn vs_ocean(@location(0) pos : vec3f) -> OceanVOut {
  let center = vec2f(-14.0, 0.0);
  let distC = distance(pos.xz, center);
  let fade = 1.0 - saturate((distC - 150.0) / 160.0);
  // M4: FFT displacement when enabled, Gerstner preview as the fallback path
  var g : Gerstner;
  if (frame.fx.x > 0.5) {
    g = fftWave(pos.xz, fade);
  } else {
    g = gerstner(pos.xz, frame.fog.w, fade);
  }
  let world = pos + g.disp;
  var o : OceanVOut;
  o.world = world;
  o.normal = normalize(cross(g.T, g.B));
  let foamTh = frame.fx.z;
  o.foam = saturate((foamTh - g.J) * 2.4) * fade;
  o.clip = cam.viewProj * vec4f(world, 1.0);
  return o;
}

@fragment
fn fs_ocean(in : OceanVOut) -> @location(0) vec4f {
  let t = frame.fog.w;
  let uv = in.clip.xy * frame.screen.zw;
  let px = vec2i(in.clip.xy);
  let depth = textureLoad(t_depth, px, 0);

  // detail normal: two scrolled fbm layers
  let dn1 = fbm2(in.world.xz * 1.35 + vec2f(t * 0.22, t * 0.15), 3) - 0.5;
  let dn2 = fbm2(in.world.xz * 4.1 + vec2f(-t * 0.31, t * 0.11) + vec2f(7.7), 2) - 0.5;
  var N = normalize(in.normal + vec3f(dn1 * 0.28 + dn2 * 0.12, 0.0, dn1 * 0.24 - dn2 * 0.1));
  let toCam = cam.camPos.xyz - in.world;
  let viewDist = length(toCam);
  let V = toCam / max(viewDist, 1e-4);
  let underwater = cam.camPos.y < frame.params.z;

  // fade ocean shading into fog at distance (hides grid edge)
  let farFade = saturate((viewDist - 220.0) / 260.0);

  // fresnel
  let NoV = saturate(dot(N, V));
  let F = 0.02 + 0.98 * pow(1.0 - NoV, 5.0);

  // sky reflection + screen-space scene reflection (M3 SSR)
  var R = reflect(-V, N);
  R.y = max(R.y, 0.015);
  let skyRef = skyColor(R, frame);
  // trace the lit scene (hdrB): buildings/piers mirror in the water;
  // max distance shrinks with haze so far rays fall back to sky
  let ssr = ssrMarch(in.world + vec3f(0.0, 0.06, 0.0), normalize(R), mix(110.0, 34.0, farFade));
  let refl = mix(skyRef, ssr.rgb, ssr.a * 0.88);

  // refraction with depth-aware offset (reduced underwater: viewing from
  // below distorts the above-water image and reads as an artifact)
  var ruv = uv + N.xz * saturate(3.5 / (viewDist * 0.1 + 1.0)) * select(0.055, 0.018, underwater);
  let rpx = clamp(vec2i(ruv * frame.screen.xy), vec2i(0), vec2i(frame.screen.xy) - vec2i(1));
  let rdepth = textureLoad(t_depth, rpx, 0);
  if (rdepth < depth) { ruv = uv; }
  let refr = textureSampleLevel(t_scene, smpLin, ruv, 0.0).rgb;

  // depth-based absorption
  let sceneDist = linDepth(rdepth, frame.params.x, frame.params.y);
  let surfDist = linDepth(depth, frame.params.x, frame.params.y);
  let thick = max(sceneDist - surfDist, 0.0);
  let absorb = exp(-thick * vec3f(0.42, 0.20, 0.14));
  let sunUp = saturate(frame.sunDir.y * 2.0);
  let scatter = vec3f(0.015, 0.075, 0.10) * (0.25 + 0.75 * sunUp) * frame.extra.w * 0.55;
  var color = refr * absorb + scatter * (1.0 - absorb);
  color = mix(refl, color, saturate(1.0 - F));

  // sun glitter
  let rough = clamp(0.05 + in.foam * 0.45, 0.05, 0.5);
  let sh = shadowAtten(frame, t_shadow, smpCmp, in.world, vec3f(0.0, 1.0, 0.0), 1.0, viewDist);
  color += shadePBR(N, V, frame.sunDir.xyz, frame.sunColor.rgb * sh, vec3f(0.0), vec3f(0.02), rough, 0.0) * (1.0 - farFade);

  // foam: Jacobian crests + shoreline (thickness fade) + animated pattern
  let pat = fbm2(in.world.xz * 0.9 + vec2f(t * 0.1, -t * 0.07), 3);
  let pat2 = fbm2(in.world.xz * 3.3 - vec2f(t * 0.17, t * 0.05), 2);
  var foam = in.foam * saturate(0.5 + 0.5 * (pat + pat2 - 0.5) * 2.0);
  let shore = (1.0 - saturate(thick / 2.4)) * saturate(0.5 + 0.5 * sin(t * 1.7 + in.world.x * 0.35 + pat * 5.0));
  foam = saturate(foam + shore * 0.75 * (1.0 - farFade));
  let foamCol = vec3f(0.86, 0.89, 0.92) * (skyAmbient(vec3f(0, 1, 0), frame) * 0.55 + frame.sunColor.rgb * 0.00006 * saturate(frame.sunDir.y));
  color = mix(color, foamCol, foam);

  // dissolve into horizon haze before aerial perspective (hides grid edge)
  color = mix(color, skyBase(normalize(vec3(-V.x, 0.035, -V.z)), frame), farFade * farFade);

  // aerial perspective (heavier over water)
  color = applyFog(color, frame, in.world, cam.camPos.xyz, t_shadow, smpCmp);

  // underwater: shift toward deep scatter + upward TIR-ish sky boost
  if (underwater) {
    let deep = vec3f(0.008, 0.05, 0.07) * frame.extra.w * 0.5;
    color = mix(deep, color, exp(-viewDist * 0.055));
    let upDot = saturate(-V.y * 1.4 - 0.1);
    color = mix(color, skyBase(vec3f(0.0, 1.0, 0.0), frame) * 0.55, upDot * 0.55);
  }
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,Fe=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;

struct FlatOut {
  @builtin(position) clip : vec4f,
  @location(0) world : vec3f,
  @location(1) normal : vec3f,
  @location(2) foam : f32,
};

@vertex
fn vs_ocean(@location(0) pos : vec3f) -> FlatOut {
  var o : FlatOut;
  o.world = pos;
  o.normal = vec3f(0.0, 1.0, 0.0);
  o.foam = 0.0;
  o.clip = cam.viewProj * vec4f(pos, 1.0);
  return o;
}
`,he=`
@fragment
fn fs_ocean() -> @location(0) vec4f {
  return vec4f(0.05, 0.20, 0.30, 1.0);
}
`,ke=`
@group(0) @binding(0) var<uniform> frame : Frame;
@group(0) @binding(1) var t_dstA : texture_storage_2d<rgba32float, write>;
@group(0) @binding(2) var t_dstB : texture_storage_2d<rgba32float, write>;

const FFT_N = 256u;
const TILE_L = 130.0;      // near-cascade tile size (m)
const AMP_A = 1.35e-4;     // Phillips amplitude (tuned for ~0.7 m swell)
const L_CUT = 0.55;        // small-wave suppression (m); texel = 0.51 m
const WIND = vec2f(0.85, 0.53);

fn bitrev8(x : u32) -> u32 {
  var r = x;
  r = ((r & 0x55u) << 1u) | ((r >> 1u) & 0x55u);
  r = ((r & 0x33u) << 2u) | ((r >> 2u) & 0x33u);
  r = ((r & 0x0Fu) << 4u) | ((r >> 4u) & 0x0Fu);
  return r;
}

fn cmul2(a : vec2f, b : vec2f) -> vec2f {
  return vec2f(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

fn gauss2(seed : vec2f) -> vec2f {
  let u1 = max(hash21(seed), 1e-6);
  let u2 = hash21(seed + vec2f(19.19, 47.31));
  let r = sqrt(-2.0 * log(u1));
  let ph = 6.2831853 * u2;
  return vec2f(r * cos(ph), r * sin(ph));
}

fn phillips(k : vec2f) -> f32 {
  let kLen = max(length(k), 1e-6);
  let kh = k / kLen;
  let kw = dot(kh, WIND);
  let Lw = 49.0 / 9.81;                 // wind 7 m/s → L = V²/g
  let kL = kLen * Lw;
  var p = AMP_A * exp(-1.0 / (kL * kL)) / (kLen * kLen * kLen * kLen);
  p = p * kw * kw;                      // directional spreading
  p = p * exp(-kLen * kLen * L_CUT * L_CUT);
  p = p * select(0.22, 1.0, kw > 0.0);  // damp waves travelling against wind
  return p;
}

@compute @workgroup_size(8, 8)
fn genSpectrum(@builtin(global_invocation_id) g : vec3u) {
  let x = g.x;
  let y = g.y;
  if (x >= FFT_N || y >= FFT_N) { return; }
  let fx = select(f32(x), f32(x) - 256.0, x >= 128u);
  let fy = select(f32(y), f32(y) - 256.0, y >= 128u);
  let k = vec2f(fx, fy) * (6.2831853 / TILE_L);
  let kLen = length(k);
  let dst = vec2i(i32(bitrev8(x)), i32(bitrev8(y)));
  if (kLen < 1e-5) {
    textureStore(t_dstA, dst, vec4f(0.0));
    textureStore(t_dstB, dst, vec4f(0.0));
    return;
  }
  let Pk = phillips(k);
  let sq = sqrt(Pk * 0.5);
  let g0 = gauss2(vec2f(f32(x), f32(y)) + 3.7);
  let mx = f32((FFT_N - x) % FFT_N);
  let my = f32((FFT_N - y) % FFT_N);
  let gM = gauss2(vec2f(mx, my) + 3.7);
  let h0k = g0 * sq;                    // h0(k)
  let h0mk = vec2f(gM.x, -gM.y) * sq;   // conj(h0(-k))
  let w = sqrt(9.81 * kLen);            // deep-water dispersion ω = √(gk)
  let ph = w * frame.fog.w;
  let e = vec2f(cos(ph), sin(ph));      // e^{+iωt}
  let em = vec2f(cos(ph), -sin(ph));    // e^{-iωt}
  let H = cmul2(h0k, e) + cmul2(h0mk, em);
  let kn = k / kLen;
  let Di = vec2f(H.y, -H.x);            // (-i)·H
  textureStore(t_dstA, dst, vec4f(H, Di * kn.x));
  textureStore(t_dstB, dst, vec4f(Di * kn.y, vec2f(0.0)));
}
`,Ve=`
@group(0) @binding(0) var<uniform> passPrm : vec4f; // x = half, y = isRow, z/w = unused
@group(0) @binding(1) var t_srcA : texture_storage_2d<rgba32float, read>;
@group(0) @binding(2) var t_srcB : texture_storage_2d<rgba32float, read>;
@group(0) @binding(3) var t_dstA : texture_storage_2d<rgba32float, write>;
@group(0) @binding(4) var t_dstB : texture_storage_2d<rgba32float, write>;

fn cm(a : vec2f, b : vec2f) -> vec2f {
  return vec2f(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

@compute @workgroup_size(8, 8)
fn fftPass(@builtin(global_invocation_id) gin : vec3u) {
  let N = 256u;
  if (gin.x >= N || gin.y >= N) { return; }
  let halfF = passPrm.x;
  let isRow = passPrm.y;
  let m = halfF * 2.0;

  // transform index (ti) runs along x for rows, along y for columns
  let ti = select(f32(gin.y), f32(gin.x), isRow > 0.5);
  let cc = select(f32(gin.x), f32(gin.y), isRow > 0.5);

  let block = floor(ti / m);
  let j = ti - block * m;
  let odd = select(0.0, 1.0, j >= halfF);   // even output = +, odd output = -
  let j2 = j - odd * halfF;
  let s = 1.0 - 2.0 * odd;

  let ang = 6.2831853 * j2 / m;             // inverse DFT twiddle e^{+2πi j/m}
  let w = vec2f(cos(ang), sin(ang));

  let pa = block * m + j2;
  let pb = pa + halfF;
  let coordA = select(vec2i(i32(pa), i32(cc)), vec2i(i32(cc), i32(pa)), isRow > 0.5);
  let coordB = select(vec2i(i32(pb), i32(cc)), vec2i(i32(cc), i32(pb)), isRow > 0.5);

  let aA = textureLoad(t_srcA, coordA);
  let bA = textureLoad(t_srcA, coordB);
  let aB = textureLoad(t_srcB, coordA);
  let bB = textureLoad(t_srcB, coordB);

  let H = aA.xy + s * cm(bA.xy, w);
  let Dx = aA.zw + s * cm(bA.zw, w);
  let Dz = aB.xy + s * cm(bB.xy, w);

  textureStore(t_dstA, coordA, vec4f(H, Dx));
  textureStore(t_dstB, coordA, vec4f(Dz, vec2f(0.0)));
}
`,Ue=`
@group(0) @binding(0) var t_srcA : texture_storage_2d<rgba32float, read>;
@group(0) @binding(1) var t_srcB : texture_storage_2d<rgba32float, read>;
@group(0) @binding(2) var t_dst : texture_storage_2d<rgba16float, write>;

@compute @workgroup_size(8, 8)
fn packDisp(@builtin(global_invocation_id) g : vec3u) {
  if (g.x >= 256u || g.y >= 256u) { return; }
  let A = textureLoad(t_srcA, vec2i(i32(g.x), i32(g.y))); // (h.re, h.im, Dx.re, Dx.im)
  let B = textureLoad(t_srcB, vec2i(i32(g.x), i32(g.y))); // (Dz.re, Dz.im, 0, 0)
  let inv = 1.0 / (256.0 * 256.0);
  // soft physical clamp: Phillips tail spikes (rare >3 sigma draws) must not
  // launch the surface into the pier deck
  let h = clamp(A.x * inv, -1.6, 1.6);
  let dx = clamp(A.z * inv, -2.4, 2.4);
  let dz = clamp(B.x * inv, -2.4, 2.4);
  textureStore(t_dst, vec2i(i32(g.x), i32(g.y)), vec4f(dx, h, dz, 0.0));
}
`,Ne=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_g0 : texture_2d<f32>;
@group(1) @binding(1) var t_g1 : texture_2d<f32>;
@group(1) @binding(2) var t_g2 : texture_2d<f32>;
@group(1) @binding(3) var t_depth : texture_depth_2d;
@group(1) @binding(4) var t_scene : texture_2d<f32>;
@group(1) @binding(5) var smpLin : sampler;

@fragment
fn fs_ssr(in : FSOut) -> @location(0) vec4f {
  // half-res target: full-res uv and pixel
  let halfRes = frame.screen.xy * 0.5;
  let uv = in.clip.xy / halfRes;
  let px = vec2i(in.clip.xy) * 2;

  let depth = textureLoad(t_depth, px, 0);
  if (depth > 0.99999) { return vec4f(0.0); }
  let g1 = textureLoad(t_g1, px, 0);
  let gloss = g1.w;
  // rough surfaces: env handled by the analytic ambient term, skip trace
  if (gloss < 0.30) { return vec4f(0.0); }
  let g2 = textureLoad(t_g2, px, 0);
  let F0 = g2.rgb;

  let world = worldFromDepth(uv, depth, cam.invViewProj);
  let N = normalize(g1.xyz);
  let toCam = cam.camPos.xyz - world;
  let viewDist = length(toCam);
  let V = toCam / max(viewDist, 1e-4);

  var R = reflect(-V, N);
  // grazing floor rays that go under the surface: nudge above horizon
  R = normalize(R);
  if (R.y < 0.02 && N.y > 0.6) { R = normalize(vec3f(R.x, 0.02 + R.y * 0.5 + 0.02, R.z)); }

  // far rays through haze can't resolve scene hits — fade the max distance
  let maxDist = mix(90.0, 28.0, saturate(viewDist / 120.0));

  let p0 = cam.viewProj * vec4f(world + N * 0.03, 1.0);
  let p1 = cam.viewProj * vec4f(world + N * 0.03 + R * maxDist, 1.0);
  var result = vec4f(0.0);
  if (p0.w > 0.0 && p1.w > 0.0) {
    let n0 = p0.xyz / p0.w;
    let n1 = p1.xyz / p1.w;
    let uv0 = n0.xy * 0.5 + vec2f(0.5);
    let uv1 = n1.xy * 0.5 + vec2f(0.5);
    let z0 = n0.z;
    let z1 = n1.z;

    // fixed 10-step march, predicated first-hit (hitT sentinel 9)
    var hitT = 9.0;
    for (var i = 1; i <= 10; i = i + 1) {
      let s = f32(i) / 10.0;
      let suv = clamp(mix(uv0, uv1, s), vec2f(0.003), vec2f(0.997));
      let spx = vec2i(suv * frame.screen.xy);
      let zS = textureLoad(t_depth, spx, 0);
      let zR = mix(z0, z1, s);
      let cross = zS < 0.99999 && zR > zS + 0.0004 + s * 0.0015;
      if (cross && hitT > 8.0) { hitT = s; }
    }
    // 4-step binary refine (fixed trip)
    var lo = hitT - 1.0 / 10.0;
    var hi = hitT;
    for (var i = 0; i < 4; i = i + 1) {
      let mid = (lo + hi) * 0.5;
      let suv = clamp(mix(uv0, uv1, mid), vec2f(0.003), vec2f(0.997));
      let spx = vec2i(suv * frame.screen.xy);
      let zS = textureLoad(t_depth, spx, 0);
      let zR = mix(z0, z1, mid);
      let cross = zS < 0.99999 && zR > zS + 0.0004;
      if (cross) { hi = mid; } else { lo = mid; }
    }

    let skyR = skyColor(R, frame);
    if (hitT > 8.0) {
      result = vec4f(skyR, 0.0);
    } else {
      let uvHit = clamp(mix(uv0, uv1, (lo + hi) * 0.5), vec2f(0.003), vec2f(0.997));
      let edge = min(min(uvHit.x, 1.0 - uvHit.x) * 8.0, min(uvHit.y, 1.0 - uvHit.y) * 8.0);
      let conf = saturate(edge) * saturate(1.0 - hitT * 0.6) * saturate(gloss * 1.6 - 0.25);
      let hitCol = textureSampleLevel(t_scene, smpLin, uvHit, 0.0).rgb;
      result = vec4f(mix(skyR, hitCol, conf * 0.92), 1.0);
    }
  }
  return result;
}
`,Ie=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_hdr : texture_2d<f32>;
@group(1) @binding(1) var t_ssr : texture_2d<f32>;
@group(1) @binding(2) var t_g1 : texture_2d<f32>;
@group(1) @binding(3) var t_g2 : texture_2d<f32>;
@group(1) @binding(4) var t_depth : texture_depth_2d;
@group(1) @binding(5) var smpLin : sampler;

@fragment
fn fs_refl(in : FSOut) -> @location(0) vec4f {
  let px = vec2i(in.clip.xy);
  let uv = in.clip.xy * frame.screen.zw;
  let base = textureLoad(t_hdr, px, 0).rgb;

  if (frame.grade.y < 0.005) { return vec4f(base, 1.0); }
  let depth = textureLoad(t_depth, px, 0);
  if (depth > 0.99999) { return vec4f(base, 1.0); }

  let g1 = textureLoad(t_g1, px, 0);
  let gloss = g1.w;
  let g2 = textureLoad(t_g2, px, 0);
  let F0 = g2.rgb;
  let rough = clamp(1.0 - gloss, 0.045, 1.0);
  let N = normalize(g1.xyz);
  let world = worldFromDepth(uv, depth, cam.invViewProj);
  let toCam = cam.camPos.xyz - world;
  let V = toCam / max(length(toCam), 1e-4);
  let NoV = saturate(dot(N, V));

  // glossy weight: roughness-blurred env fresnel (Schlick + rough boost);
  // env radiance is roughness-mixed toward sky already inside the SSR pass,
  // here we only shape the BRDF side.
  var F = F0 + (max(vec3f(1.0 - rough * 0.55), F0) - F0) * pow(1.0 - NoV, 5.0);
  F *= smoothstep(0.30, 0.52, gloss);

  // 5-tap roughness blur of the half-res SSR buffer (radius ~ rough)
  let srcUv = uv;
  let rad = (0.35 + rough * 2.6) * frame.screen.zw * 2.0; // half-res texels
  let ssrC = textureSampleLevel(t_ssr, smpLin, srcUv, 0.0);
  var env = ssrC.rgb * 0.44;
  var wsum = 0.44;
  let o1 = vec2f(rad.x, 0.0);
  let o2 = vec2f(0.0, rad.y);
  env += textureSampleLevel(t_ssr, smpLin, srcUv + o1, 0.0).rgb * 0.14;
  env += textureSampleLevel(t_ssr, smpLin, srcUv - o1, 0.0).rgb * 0.14;
  env += textureSampleLevel(t_ssr, smpLin, srcUv + o2, 0.0).rgb * 0.14;
  env += textureSampleLevel(t_ssr, smpLin, srcUv - o2, 0.0).rgb * 0.14;
  wsum += 0.56;
  env /= wsum;

  return vec4f(base + env * F * frame.grade.y, 1.0);
}
`,We=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_cur : texture_2d<f32>;
@group(1) @binding(1) var t_hist : texture_2d<f32>;
@group(1) @binding(2) var t_depth : texture_depth_2d;
@group(1) @binding(3) var smpLin : sampler;

// Catmull-Rom weights for the 4 texels around fract(x)=0 center.
fn crWeights(f : f32) -> vec4f {
  let f2 = f * f;
  let f3 = f2 * f;
  return vec4f(
    -0.5 * f3 +       f2 - 0.5 * f,
     1.5 * f3 - 2.5 * f2 + 1.0,
    -1.5 * f3 + 2.0 * f2 + 0.5 * f,
     0.5 * f3 - 0.5 * f2
  );
}

// 4-tap bicubic (Catmull-Rom) history resample: sharper than bilinear when
// reprojection lands between texels, neutralises the TAA softening.
fn crSample(t : texture_2d<f32>, s : sampler, uv : vec2f, res : vec2f) -> vec3f {
  let sp = uv * res - vec2f(0.5);
  let base = floor(sp);
  let wx = crWeights(sp.x - base.x);
  let wy = crWeights(sp.y - base.y);
  let w01x = wx.x + wx.y;
  let w23x = wx.z + wx.w;
  let w01y = wy.x + wy.y;
  let w23y = wy.z + wy.w;
  let sx0 = (base.x - 1.0 + wx.y / max(w01x, 1e-4) + 0.5) / res.x;
  let sx1 = (base.x + 1.0 + wx.w / max(w23x, 1e-4) + 0.5) / res.x;
  let sy0 = (base.y - 1.0 + wy.y / max(w01y, 1e-4) + 0.5) / res.y;
  let sy1 = (base.y + 1.0 + wy.w / max(w23y, 1e-4) + 0.5) / res.y;
  var c = textureSampleLevel(t, s, vec2f(sx0, sy0), 0.0).rgb * (w01x * w01y);
  c += textureSampleLevel(t, s, vec2f(sx1, sy0), 0.0).rgb * (w23x * w01y);
  c += textureSampleLevel(t, s, vec2f(sx0, sy1), 0.0).rgb * (w01x * w23y);
  c += textureSampleLevel(t, s, vec2f(sx1, sy1), 0.0).rgb * (w23x * w23y);
  return max(c, vec3f(0.0));
}

@fragment
fn fs_taa(in : FSOut) -> @location(0) vec4f {
  let uv = in.clip.xy * frame.screen.zw;
  let px = vec2i(in.clip.xy);
  let cur = textureLoad(t_cur, px, 0).rgb;

  if (frame.dbg.x < 0.5) { return vec4f(cur, 1.0); }

  // Neighborhood stats over 3x3: mean, variance (Salvi) and AABB (min/max).
  var m1 = vec3f(0.0);
  var m2 = vec3f(0.0);
  var mn = cur;
  var mx = cur;
  for (var y = -1; y <= 1; y = y + 1) {
    for (var x = -1; x <= 1; x = x + 1) {
      let c = textureLoad(t_cur, clamp(px + vec2i(x, y), vec2i(0), vec2i(frame.screen.xy) - vec2i(1)), 0).rgb;
      m1 += c;
      m2 += c * c;
      mn = min(mn, c);
      mx = max(mx, c);
    }
  }
  let mu = m1 / 9.0;
  let sigma = sqrt(max(m2 / 9.0 - mu * mu, vec3f(0.0)));
  // Variance box (gradients) intersected with AABB (geometry edges).
  let g = 1.55;
  let lo = max(mu - g * sigma, mn - 1e-4);
  let hi = min(mu + g * sigma, mx + 1e-4);

  // Geometry pixels: reproject world position into the previous frame.
  // Sky pixels (depth == far) skip TAA (raw current) — far-plane reprojection
  // through prevViewProj is numerically fragile on SwiftShader-class GPUs and
  // produced a hard boundary artifact; sky gradients barely alias anyway.
  var depth = textureLoad(t_depth, px, 0);
  if (depth > 0.99999) { return vec4f(cur, 1.0); }
  depth = min(depth, 0.999995);
  let world = worldFromDepth(uv, depth, cam.invViewProj);
  let prevClip = cam.prevViewProj * vec4f(world, 1.0);
  let prevUv = prevClip.xy / prevClip.w * 0.5 + vec2f(0.5);
  if (prevUv.x < 0.0 || prevUv.x > 1.0 || prevUv.y < 0.0 || prevUv.y > 1.0) {
    return vec4f(cur, 1.0);
  }

  let raw = crSample(t_hist, smpLin, prevUv, frame.screen.xy);
  let hist = clamp(raw, lo, hi);

  // Adaptive feedback: rejection distance in sigmas drives the blend —
  // sticky on stable pixels, snaps to current on strong disocclusion.
  let reject = saturate(max3(abs(raw - hist) / (sigma + vec3f(1e-3))));
  let alpha = clamp(0.085 + reject * 0.18, 0.085, 0.45);
  return vec4f(mix(hist, cur, alpha), 1.0);
}

fn max3(v : vec3f) -> f32 {
  return max(v.x, max(v.y, v.z));
}
`,He=`
struct Stats {
  hist : array<atomic<u32>, 64>,
  ev   : f32,
  avg  : f32,
  pad0 : f32,
};

@group(0) @binding(0) var t_hdr : texture_2d<f32>;
@group(0) @binding(1) var<storage, read_write> stats : Stats;
@group(0) @binding(2) var<uniform> frame : Frame;

@compute @workgroup_size(8, 8)
fn expAccum(@builtin(global_invocation_id) g : vec3u) {
  let px = vec2i(g.xy * 4u);
  if (px.x >= i32(frame.screen.x) || px.y >= i32(frame.screen.y)) { return; }
  let c = textureLoad(t_hdr, px, 0).rgb;
  let lum = clamp(dot(c, vec3f(0.2126, 0.7152, 0.0722)), 1e-6, 1e6);
  let lg = clamp((log2(lum) + 12.0) / 24.0, 0.0, 0.9999);
  atomicAdd(&stats.hist[u32(lg * 64.0)], 1u);
}

var<workgroup> wsum : array<f32, 64>;
var<workgroup> wcnt : array<f32, 64>;

@compute @workgroup_size(64, 1)
fn expFinal(@builtin(local_invocation_id) lid : vec3u) {
  let i = lid.x;
  let c = f32(atomicLoad(&stats.hist[i]));
  let centerLog = (f32(i) + 0.5) / 64.0 * 24.0 - 12.0;
  wsum[i] = c * centerLog;  // geometric mean: sum of c * log2(lum)
  wcnt[i] = c;
  workgroupBarrier();
  if (i == 0u) {
    var s = 0.0;
    var n = 0.0;
    for (var j = 0; j < 64; j = j + 1) {
      s += wsum[j];
      n += wcnt[j];
    }
    let avgLog = select(0.0, s / max(n, 1.0), n > 0.5);
    let avg = exp2(clamp(avgLog, -12.0, 12.0));
    let evTarget = clamp(log2(0.18 / max(avg, 1e-6)) + frame.misc.x, frame.misc.y, frame.misc.z);
    let dt = max(frame.counts.w, 1e-3);
    // evLock (verification / deterministic capture): EV pinned to evBias —
    // adaptation disabled so A/B pixel diffs isolate feature contributions
    if (frame.grade.w > 0.5) {
      stats.ev = frame.misc.x;
    } else {
      stats.ev = mix(stats.ev, evTarget, 1.0 - exp(-dt * 1.6));
    }
    stats.avg = avg;
  }
  atomicStore(&stats.hist[i], 0u);
}
`,je=`
struct StatsRO {
  hist : array<u32, 64>,
  ev   : f32,
  avg  : f32,
  pad0 : f32,
};

struct Dest {
  size : vec4f, // w, h, 1/w, 1/h of THIS pass target
};
@group(0) @binding(0) var<uniform> frame : Frame;
@group(0) @binding(1) var<uniform> dest : Dest;
@group(1) @binding(0) var t_src : texture_2d<f32>;
@group(1) @binding(1) var smpLin : sampler;
@group(1) @binding(2) var<storage, read> stats : StatsRO;

@fragment
fn fs_bloomPrefilter(in : FSOut) -> @location(0) vec4f {
  let uv = in.clip.xy * dest.size.zw;
  let ev = exp2(stats.ev);
  let c = textureSampleLevel(t_src, smpLin, uv, 0.0).rgb * ev;
  let l = dot(c, vec3f(0.2126, 0.7152, 0.0722));
  let t = frame.misc.w;
  let knee = t * 0.6 + 1e-4;
  var soft = clamp(l - t + knee, 0.0, 2.0 * knee);
  soft = soft * soft / (4.0 * knee);
  let contrib = max(soft, l - t) / max(l, 1e-4);
  return vec4f(c * contrib, 1.0);
}

@fragment
fn fs_bloomDown(in : FSOut) -> @location(0) vec4f {
  let uv = in.clip.xy * dest.size.zw;
  let srcTexel = 2.0 / dest.size.xy; // source is 2x dest
  var c = textureSampleLevel(t_src, smpLin, uv + vec2f(-srcTexel.x, -srcTexel.y), 0.0).rgb;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(srcTexel.x, -srcTexel.y), 0.0).rgb;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(-srcTexel.x, srcTexel.y), 0.0).rgb;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(srcTexel.x, srcTexel.y), 0.0).rgb;
  return vec4f(c * 0.25, 1.0);
}

@fragment
fn fs_bloomUp(in : FSOut) -> @location(0) vec4f {
  let uv = in.clip.xy * dest.size.zw;
  let srcTexel = 2.0 / dest.size.xy; // source is 2x dest
  var c = textureSampleLevel(t_src, smpLin, uv, 0.0).rgb * 4.0;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(-srcTexel.x, 0.0), 0.0).rgb * 2.0;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(srcTexel.x, 0.0), 0.0).rgb * 2.0;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(0.0, -srcTexel.y), 0.0).rgb * 2.0;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(0.0, srcTexel.y), 0.0).rgb * 2.0;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(-srcTexel.x, -srcTexel.y), 0.0).rgb;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(srcTexel.x, -srcTexel.y), 0.0).rgb;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(-srcTexel.x, srcTexel.y), 0.0).rgb;
  c += textureSampleLevel(t_src, smpLin, uv + vec2f(srcTexel.x, srcTexel.y), 0.0).rgb;
  return vec4f(c / 16.0, 1.0);
}
`,qe=`
struct StatsRO {
  hist : array<u32, 64>,
  ev   : f32,
  avg  : f32,
  pad0 : f32,
};

@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_hdr : texture_2d<f32>;
@group(1) @binding(1) var t_bloom : texture_2d<f32>;
@group(1) @binding(2) var<storage, read> stats : StatsRO;
@group(1) @binding(3) var smpLin : sampler;
@group(1) @binding(4) var t_lut : texture_3d<f32>;

@fragment
fn fs_tonemap(in : FSOut) -> @location(0) vec4f {
  let uv = in.clip.xy * frame.screen.zw;
  let d = distance(uv, vec2f(0.5));

  // debug: 7 = presentation test (constant), 5 = raw HDR view
  if (frame.dbg.w > 6.5) { return vec4f(1.0, 0.42, 0.1, 1.0); }
  if (frame.dbg.w > 4.5 && frame.dbg.w < 4.6) {
    let raw = textureSampleLevel(t_hdr, smpLin, uv, 0.0).rgb * exp2(stats.ev);
    return vec4f(pow(clamp(raw, vec3f(0.0), vec3f(1.0)), vec3f(1.0 / 2.2)), 1.0);
  }

  // chromatic aberration on HDR input
  let ca = frame.dbg.z * 0.0035 * pow(clamp(d * 1.35, 0.0, 1.0), 2.0);
  let dir = normalize(uv - vec2f(0.5) + vec2f(1e-5));
  var hdr = vec3f(
    textureSampleLevel(t_hdr, smpLin, uv + dir * ca, 0.0).r,
    textureSampleLevel(t_hdr, smpLin, uv, 0.0).g,
    textureSampleLevel(t_hdr, smpLin, uv - dir * ca, 0.0).b
  );

  hdr += textureSampleLevel(t_bloom, smpLin, uv, 0.0).rgb * frame.dbg.y;

  let ev = exp2(stats.ev);
  var c = hdr * ev;
  c = acesFilm(c);

  // --- color grading (M3): 32^3 baked LUT (gamma-domain, display-ready) ---
  // identity = passthrough; bake carries the HDRP-style grade: contrast
  // S-curve, saturation lift, cool shadows / warm highlights split-tone.
  if (frame.grade.x > 0.5) {
    let g = pow(clamp(c, vec3f(0.0), vec3f(1.0)), vec3f(1.0 / 2.2));
    c = textureSampleLevel(t_lut, smpLin, g, 0.0).rgb;
  } else {
    // legacy warm grade stand-in
    c *= vec3f(1.02, 0.995, 0.965);
    c = pow(max(c, vec3f(0.0)), vec3f(1.0 / 2.2));
  }

  // vignette
  c *= 1.0 - smoothstep(0.45, 0.92, d) * 0.30;

  // film grain (luminance-adaptive)
  let g2 = hash21(in.clip.xy + vec2f(frame.fog.w * 137.0, frame.fog.w * 41.0)) - 0.5;
  let l = dot(c, vec3f(0.2126, 0.7152, 0.0722));
  c += g2 * 0.028 * (1.0 - clamp(l, 0.0, 1.0));

  return vec4f(c, 1.0);
}
`,te=[{name:"Performant",shadowAtlas:1024,ssao:!1,taa:!1,ssr:!1,fft:!1,oceanNear:96,oceanFar:48},{name:"Balanced",shadowAtlas:2048,ssao:!0,taa:!1,ssr:!0,fft:!0,oceanNear:160,oceanFar:72},{name:"High",shadowAtlas:4096,ssao:!0,taa:!0,ssr:!0,fft:!0,oceanNear:224,oceanFar:88}],Q=6,Xe=24;class Ye{graph;camera=new De;uniforms;tierIndex=2;toggles={ssao:!0,taa:!0,bloom:!0,ocean:!0,ssr:!0,lut:!0,gi:!0,fft:!0,caus:!0};lastFrameCpuMs=0;frameNo=0;fftDiv=1;dev;canvasPrivate;ctx;scene;sceneVB;sceneIB;camBuf;frameBuf;cascadeBuf=[];lightsBuf;statsBuf;meshConstBufs=[];whiteTex;blackTex;oceanNearVB;oceanNearIB;oceanNearCount=0;oceanFarVB;oceanFarIB;oceanFarCount=0;pShadow;pGbuffer;pCull;pSsao;pBlur;pLighting;pTaa;pSsr;pRefl;pOcean;pGen;pFft;pPack;pExpAccum;pExpFinal;pBloomPre;pBloomDown;pBloomUp;pTonemap;bglGlobal;bglMesh;bglCull;bglSsao;bglBlur;bglLighting;bglOcean;bglGen;bglFft;bglPack;bglSsr;bglRefl;bglTaa;bglExp;bglBloom0;bglBloom1;bglTonemap;gridCountsBuf;gridIndicesBuf;destBufs=[];bgGlobal;bgCascade=[];bgMesh=[];bgCull;bgSsao;bgBlur;bgLightingAo;bgLightingWhite;bgSsr;bgRefl;bgOcean;bgGen;bgFft=[];bgPack;fftPassBufs=[];fftA0View;fftA1View;fftB0View;fftB1View;dispView;bgTaa;bgExp;bgTonemapBloom;bgTonemapBlack;bgBloom=[];bloomPasses=[];shadowView;g0View;g1View;g2View;depthView;hdrAView;hdrA2View;ssrHalfView;hdrBView;hdrCView;historyView;bloomViews=[];aoHalfView;aoHalf2View;whiteView;blackView;smpRep;probesBuf;lutTex;lutView;W=0;H=0;atlas=2048;zerobuffer=new Uint32Array(0);constructor(e,r){this.ctx=e,this.dev=e.device,this.canvasPrivate=e.canvas,this.graph=new Be(this.dev),this.scene=r,this.uniforms=new Ae(r.lights)}put(e,r,s=0){this.dev.queue.writeBuffer(e,s,r)}get tier(){return te[this.tierIndex]}get canvas(){return this.canvasPrivate}adapterNameShort(){const e=this.ctx.adapterName;return e.length>46?e.slice(0,44)+"…":e}async init(){const e=this.dev;this.uniforms.updateSun(),this.uniforms.setProbes(this.scene.probes),this.uniforms.bakeProbes(),this.probesBuf=e.createBuffer({size:ae*80,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.probesBuf,this.uniforms.probeData),this.bakeLut(),this.sceneVB=e.createBuffer({size:this.scene.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneVB,this.scene.vertexData),this.sceneIB=e.createBuffer({size:this.scene.indexData.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneIB,this.scene.indexData),this.camBuf=e.createBuffer({size:272,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.frameBuf=e.createBuffer({size:464,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});for(let a=0;a<4;a++){const c=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.cascadeBuf.push(c),this.bgCascade.push(e.createBindGroup({layout:this.bglMeshAfter(),entries:[{binding:0,resource:{buffer:c}}]}))}const r=this.scene.lights.length*64;this.lightsBuf=e.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.lightsBuf,this.uniforms.lightData),this.statsBuf=e.createBuffer({size:272,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.put(this.statsBuf,new Float32Array([-3,.02,0]),256);for(const a of this.scene.groups){const c=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(c,new Float32Array([a.matId,0,0,0])),this.meshConstBufs.push(c)}this.whiteTex=e.createTexture({size:[4,4],format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.whiteTex},new Uint8Array(16).fill(255),{bytesPerRow:4,rowsPerImage:4},[4,4]),this.blackTex=e.createTexture({size:[4,4],format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.blackTex},new Float32Array(64),{bytesPerRow:32,rowsPerImage:4},[4,4]),this.whiteView=this.whiteTex.createView(),this.blackView=this.blackTex.createView(),this.createPipelines(),this.initFft();const s=new URLSearchParams(location.search);s.get("fft")==="0"&&(this.toggles.fft=!1),s.get("caus")==="0"&&(this.toggles.caus=!1);const t=Number(s.get("fftdiv")??0);t>=1&&(this.fftDiv=Math.floor(t));for(const a of this.scene.groups)this.bgMesh.push(e.createBindGroup({layout:this.bglMesh,entries:[{binding:0,resource:{buffer:this.meshConstBufs[this.bgMesh.length]}}]}));this.rebuildOcean()}bglMeshAfter(){return this.bglMesh||(this.bglMesh=this.dev.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})),this.bglMesh}rebuildOcean(){const e=this.dev,r=Number(new URLSearchParams(location.search).get("oceansize")??0),s=r>0?r:this.tier.oceanNear;this.oceanNearVB?.destroy(),this.oceanNearIB?.destroy(),this.oceanFarVB?.destroy(),this.oceanFarIB?.destroy();const t=this.makeGrid(s,380,-14,0,0),a=this.makeDisk(Math.max(this.tier.oceanFar>>1,24),Math.max(this.tier.oceanFar*2,96),1500,-14,0,-.35);this.oceanNearVB=e.createBuffer({size:t.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearVB,t.pos),this.oceanNearIB=e.createBuffer({size:t.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearIB,t.idx),this.oceanNearCount=t.idx.length,this.oceanFarVB=e.createBuffer({size:a.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarVB,a.pos),this.oceanFarIB=e.createBuffer({size:a.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarIB,a.idx),this.oceanFarCount=a.idx.length}makeDisk(e,r,s,t,a,c){const l=new Float32Array((e+1)*r*3);for(let d=0;d<=e;d++){const v=d/e*s;for(let i=0;i<r;i++){const f=i/r*Math.PI*2,u=(d*r+i)*3;l[u]=t+Math.cos(f)*v,l[u+1]=c,l[u+2]=a+Math.sin(f)*v}}const m=new Uint32Array(e*r*6);let n=0;for(let d=0;d<e;d++)for(let v=0;v<r;v++){const i=(v+1)%r,f=d*r+v,u=(d+1)*r+v;m[n++]=f,m[n++]=u,m[n++]=u+i-v,m[n++]=f,m[n++]=u+i-v,m[n++]=f+(i-v)}return{pos:l,idx:m}}makeGrid(e,r,s,t,a){const c=new Float32Array(e*e*3),l=r/(e-1);for(let v=0;v<e;v++)for(let i=0;i<e;i++){const f=(v*e+i)*3;c[f]=s-r/2+i*l,c[f+1]=a,c[f+2]=t-r/2+v*l}const m=(e-1)*(e-1),n=new Uint32Array(m*6);let d=0;for(let v=0;v<e-1;v++)for(let i=0;i<e-1;i++){const f=v*e+i;n[d++]=f,n[d++]=f+e,n[d++]=f+e+1,n[d++]=f,n[d++]=f+e+1,n[d++]=f+1}return{pos:c,idx:n}}createPipelines(){const e=this.dev,r=this.module(E+Me),s=this.module(E+Ce),t=this.module(E+Ee),a=this.module(E+Re),c=this.module(E+Ge),l=this.module(E+Oe),m=this.module(E+Ne),n=this.module(E+Ie),d=new URLSearchParams(location.search).get("ocean")??"full";let v;if(d==="flat")v=E+Fe+he;else if(d==="constfs"){const G=ie.indexOf("@fragment");v=E+ie.slice(0,G)+he}else v=E+ie;const i=this.module(v),f=this.module(E+ke),u=this.module(Ve),w=this.module(Ue),g=this.module(E+We),y=this.module(E+He),z=this.module(E+je),h=this.module(E+qe),p=GPUShaderStage.FRAGMENT,L=GPUShaderStage.VERTEX,P=GPUShaderStage.COMPUTE,S={sampleType:"float"};this.bglGlobal=e.createBindGroupLayout({entries:[{binding:0,visibility:L|p,buffer:{type:"uniform"}},{binding:1,visibility:L|p,buffer:{type:"uniform"}},{binding:2,visibility:p,texture:{sampleType:"depth"}},{binding:3,visibility:p,sampler:{type:"comparison"}}]}),this.bglCull=e.createBindGroupLayout({entries:[{binding:0,visibility:P,buffer:{type:"read-only-storage"}},{binding:1,visibility:P,buffer:{type:"storage"}},{binding:2,visibility:P,buffer:{type:"storage"}},{binding:3,visibility:P,texture:{sampleType:"depth"}},{binding:4,visibility:P,buffer:{type:"uniform"}},{binding:5,visibility:P,buffer:{type:"uniform"}}]}),this.bglSsao=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:{sampleType:"depth"}},{binding:1,visibility:p,texture:S}]}),this.bglBlur=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:S},{binding:1,visibility:p,sampler:{type:"filtering"}}]}),this.bglLighting=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:S},{binding:1,visibility:p,texture:S},{binding:2,visibility:p,texture:S},{binding:3,visibility:p,texture:{sampleType:"depth"}},{binding:4,visibility:p,texture:S},{binding:5,visibility:p,buffer:{type:"read-only-storage"}},{binding:6,visibility:p,buffer:{type:"read-only-storage"}},{binding:7,visibility:p,buffer:{type:"read-only-storage"}},{binding:8,visibility:p,buffer:{type:"read-only-storage"}}]}),this.bglOcean=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:S},{binding:1,visibility:p,texture:{sampleType:"depth"}},{binding:2,visibility:p,sampler:{type:"filtering"}},{binding:3,visibility:L|p,texture:S},{binding:4,visibility:L|p,sampler:{type:"filtering"}}]}),this.bglGen=e.createBindGroupLayout({entries:[{binding:0,visibility:P,buffer:{type:"uniform"}},{binding:1,visibility:P,storageTexture:{access:"write-only",format:"rgba32float"}},{binding:2,visibility:P,storageTexture:{access:"write-only",format:"rgba32float"}}]}),this.bglFft=e.createBindGroupLayout({entries:[{binding:0,visibility:P,buffer:{type:"uniform"}},{binding:1,visibility:P,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:2,visibility:P,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:3,visibility:P,storageTexture:{access:"write-only",format:"rgba32float"}},{binding:4,visibility:P,storageTexture:{access:"write-only",format:"rgba32float"}}]}),this.bglPack=e.createBindGroupLayout({entries:[{binding:0,visibility:P,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:1,visibility:P,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:2,visibility:P,storageTexture:{access:"write-only",format:"rgba16float"}}]}),this.bglSsr=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:S},{binding:1,visibility:p,texture:S},{binding:2,visibility:p,texture:S},{binding:3,visibility:p,texture:{sampleType:"depth"}},{binding:4,visibility:p,texture:S},{binding:5,visibility:p,sampler:{type:"filtering"}}]}),this.bglRefl=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:S},{binding:1,visibility:p,texture:S},{binding:2,visibility:p,texture:S},{binding:3,visibility:p,texture:S},{binding:4,visibility:p,texture:{sampleType:"depth"}},{binding:5,visibility:p,sampler:{type:"filtering"}}]}),this.bglTaa=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:S},{binding:1,visibility:p,texture:S},{binding:2,visibility:p,texture:{sampleType:"depth"}},{binding:3,visibility:p,sampler:{type:"filtering"}}]}),this.bglExp=e.createBindGroupLayout({entries:[{binding:0,visibility:P,texture:S},{binding:1,visibility:P,buffer:{type:"storage"}},{binding:2,visibility:P,buffer:{type:"uniform"}}]}),this.bglBloom0=e.createBindGroupLayout({entries:[{binding:0,visibility:p,buffer:{type:"uniform"}},{binding:1,visibility:p,buffer:{type:"uniform"}}]}),this.bglBloom1=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:S},{binding:1,visibility:p,sampler:{type:"filtering"}},{binding:2,visibility:p,buffer:{type:"read-only-storage"}}]}),this.bglTonemap=e.createBindGroupLayout({entries:[{binding:0,visibility:p,texture:S},{binding:1,visibility:p,texture:S},{binding:2,visibility:p,buffer:{type:"read-only-storage"}},{binding:3,visibility:p,sampler:{type:"filtering"}},{binding:4,visibility:p,texture:{sampleType:"float",viewDimension:"3d"}}]}),this.bglMeshAfter();const x={arrayStride:32,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]},b={arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},T=(G,O,H)=>({module:G,entryPoint:O,targets:H}),B=G=>({vertex:{module:G,entryPoint:"vs_fs"}});this.pShadow=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglMesh]}),vertex:{module:s,entryPoint:"vs_shadow",buffers:[x]},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.pGbuffer=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglMesh]}),vertex:{module:r,entryPoint:"vs_mesh",buffers:[x]},fragment:T(r,"fs_gbuffer",[{format:"rgba8unorm"},{format:"rgba16float"},{format:"rgba8unorm"}]),depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{cullMode:"back"}}),this.pCull=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglCull]}),compute:{module:t,entryPoint:"cullMain"}}),this.pSsao=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsao]}),...B(a),fragment:T(a,"fs_ssao",[{format:"r8unorm"}])}),this.pBlur=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglBlur]}),...B(c),fragment:T(c,"fs_aoBlur",[{format:"r8unorm"}])}),this.pLighting=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglLighting]}),...B(l),fragment:T(l,"fs_lighting",[{format:"rgba16float"}])}),this.pTaa=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTaa]}),...B(g),fragment:T(g,"fs_taa",[{format:"rgba16float"}])}),this.pSsr=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsr]}),...B(m),fragment:T(m,"fs_ssr",[{format:"rgba16float"}])}),this.pRefl=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglRefl]}),...B(n),fragment:T(n,"fs_refl",[{format:"rgba16float"}])});const D=new URLSearchParams(location.search).get("odepth")==="0",M=new URLSearchParams(location.search).get("obgl")==="0";this.pOcean=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:M?[this.bglGlobal]:[this.bglGlobal,this.bglOcean]}),vertex:{module:i,entryPoint:"vs_ocean",buffers:[b]},fragment:T(i,"fs_ocean",[{format:"rgba16float"}]),...D?{}:{depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"}},primitive:{cullMode:"none"}}),this.pGen=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGen]}),compute:{module:f,entryPoint:"genSpectrum"}}),this.pFft=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglFft]}),compute:{module:u,entryPoint:"fftPass"}}),this.pPack=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglPack]}),compute:{module:w,entryPoint:"packDisp"}}),this.pExpAccum=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:y,entryPoint:"expAccum"}}),this.pExpFinal=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:y,entryPoint:"expFinal"}});const A={color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}};this.pBloomPre=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...B(z),fragment:T(z,"fs_bloomPrefilter",[{format:"rgba16float"}])}),this.pBloomDown=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...B(z),fragment:T(z,"fs_bloomDown",[{format:"rgba16float"}])}),this.pBloomUp=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...B(z),fragment:T(z,"fs_bloomUp",[{format:"rgba16float",blend:A}])}),this.pTonemap=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTonemap]}),...B(h),fragment:T(h,"fs_tonemap",[{format:this.ctx.format}])})}module(e){return this.dev.createShaderModule({code:e})}initFft(){const e=this.dev,r=256,s=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING,t=()=>{const u=e.createTexture({size:[r,r],format:"rgba32float",usage:s});return[u,u.createView()]},[a,c]=t(),[l,m]=t(),[n,d]=t(),[v,i]=t();this.fftA0View=c,this.fftA1View=m,this.fftB0View=d,this.fftB1View=i,this._fftTex=[a,l,n,v];const f=e.createTexture({size:[r,r],format:"rgba16float",usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC});this._dispTex=f,this.dispView=f.createView(),e.queue.writeTexture({texture:f},new Float32Array(r*r*4),{bytesPerRow:r*8,rowsPerImage:r},[r,r]),this.bgGen=e.createBindGroup({layout:this.bglGen,entries:[{binding:0,resource:{buffer:this.frameBuf}},{binding:1,resource:this.fftA0View},{binding:2,resource:this.fftB0View}]}),this.fftPassBufs=[],this.bgFft=[];for(let u=0;u<16;u++){const w=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(w,new Float32Array([1<<u%8,u<8?1:0,0,0])),this.fftPassBufs.push(w);const g=u%2===0?this.fftA0View:this.fftA1View,y=u%2===0?this.fftA1View:this.fftA0View,z=u%2===0?this.fftB0View:this.fftB1View,h=u%2===0?this.fftB1View:this.fftB0View;this.bgFft.push(e.createBindGroup({layout:this.bglFft,entries:[{binding:0,resource:{buffer:w}},{binding:1,resource:g},{binding:2,resource:z},{binding:3,resource:y},{binding:4,resource:h}]}))}this.bgPack=e.createBindGroup({layout:this.bglPack,entries:[{binding:0,resource:this.fftA0View},{binding:1,resource:this.fftB0View},{binding:2,resource:this.dispView}]})}bakeLut(){const e=this.dev,r=32,s=n=>Math.min(1,Math.max(0,n)),t=new Uint8Array(r*r*r*4),a=1.055,c=1.07,l=[.9,.96,1.08],m=[1.06,1,.92];for(let n=0;n<r;n++)for(let d=0;d<r;d++)for(let v=0;v<r;v++){const i=((n*r+d)*r+v)*4;let f=[Math.pow((v+.5)/r,1/2.2),Math.pow((d+.5)/r,1/2.2),Math.pow((n+.5)/r,1/2.2)];const u=.2126*f[0]+.7152*f[1]+.0722*f[2];f=f.map(y=>s((y-.5)*a+.5)),f=f.map(y=>s(u+(y-u)*c));const w=1-s((u-.35)/.4),g=s((u-.45)/.35);f=f.map((y,z)=>s(y+(l[z]-1)*w*.055+(m[z]-1)*g*.055)),t[i]=f[0]*255,t[i+1]=f[1]*255,t[i+2]=f[2]*255,t[i+3]=255}this.lutTex=e.createTexture({size:[r,r,r],dimension:"3d",format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.lutTex},t,{bytesPerRow:r*4,rowsPerImage:r},[r,r,r]),this.lutView=this.lutTex.createView({dimension:"3d"})}setTier(e){this.tierIndex=Math.max(0,Math.min(te.length-1,e)),this.toggles.taa=this.tier.taa,this.toggles.ssao=this.tier.ssao,this.toggles.ssr=this.tier.ssr,this.rebuildOcean(),this.W=0,this.rebuildTargets()}resize(){this.W=0,this.rebuildTargets()}rebuildTargets(){const e=this.dev,r=Math.min(window.devicePixelRatio||1,2),s=Math.max(2,Math.floor(this.canvas.clientWidth*r)),t=Math.max(2,Math.floor(this.canvas.clientHeight*r));if(s===this.W&&t===this.H)return;this.W=s,this.H=t,this.canvas.width=s,this.canvas.height=t,this.graph.reset(!0);const a=GPUTextureUsage.RENDER_ATTACHMENT,c=GPUTextureUsage.TEXTURE_BINDING,l=GPUTextureUsage.COPY_SRC,m=GPUTextureUsage.COPY_DST,n=a|c|l|m,d=Math.ceil(s/2),v=Math.ceil(t/2);this.atlas=Math.min(this.tier.shadowAtlas,this.ctx.maxTextureDim),this.g0View=this.graph.texture("g0",{width:s,height:t,format:"rgba8unorm",usage:n}),this.g1View=this.graph.texture("g1",{width:s,height:t,format:"rgba16float",usage:n}),this.g2View=this.graph.texture("g2",{width:s,height:t,format:"rgba8unorm",usage:n}),this.depthView=this.graph.texture("depth",{width:s,height:t,format:"depth32float",usage:n}),this.hdrAView=this.graph.texture("hdrA",{width:s,height:t,format:"rgba16float",usage:n}),this.hdrA2View=this.graph.texture("hdrA2",{width:s,height:t,format:"rgba16float",usage:n}),this.ssrHalfView=this.graph.texture("ssrHalf",{width:d,height:v,format:"rgba16float",usage:n}),this.hdrBView=this.graph.texture("hdrB",{width:s,height:t,format:"rgba16float",usage:n}),this.hdrCView=this.graph.texture("hdrC",{width:s,height:t,format:"rgba16float",usage:n}),this.historyView=this.graph.texture("history",{width:s,height:t,format:"rgba16float",usage:c|GPUTextureUsage.COPY_DST|l}),this.shadowView=this.graph.texture("shadowAtlas",{width:this.atlas,height:this.atlas,format:"depth24plus",usage:n}),this.aoHalfView=this.graph.texture("aoHalf",{width:d,height:v,format:"r8unorm",usage:n}),this.aoHalf2View=this.graph.texture("aoHalf2",{width:d,height:v,format:"r8unorm",usage:n}),this.bloomViews=[];let i=d,f=v;for(let h=0;h<Q;h++){const p=this.graph.texture(`bloom${h}`,{width:Math.max(i,2),height:Math.max(f,2),format:"rgba16float",usage:n});this.bloomViews.push(p),i=Math.max(i>>1,2),f=Math.max(f>>1,2)}const u=Math.ceil(s/16),w=Math.ceil(t/16);this.gridCountsBuf?.destroy(),this.gridIndicesBuf?.destroy(),this.gridCountsBuf=e.createBuffer({size:u*w*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.gridIndicesBuf=e.createBuffer({size:u*w*Xe*4,usage:GPUBufferUsage.STORAGE}),this.zerobuffer=new Uint32Array(u*w);for(const h of this.destBufs)h.destroy();this.destBufs=[],i=d,f=v;for(let h=0;h<Q;h++){const p=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(p,new Float32Array([i,f,1/i,1/f])),this.destBufs.push(p),i=Math.max(i>>1,2),f=Math.max(f>>1,2)}const g=e.createSampler({magFilter:"linear",minFilter:"linear"});this.smpRep=e.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),this.bgGlobal=e.createBindGroup({layout:this.bglGlobal,entries:[{binding:0,resource:{buffer:this.camBuf}},{binding:1,resource:{buffer:this.frameBuf}},{binding:2,resource:this.shadowView},{binding:3,resource:e.createSampler({compare:"less"})}]}),this.bgCull=e.createBindGroup({layout:this.bglCull,entries:[{binding:0,resource:{buffer:this.lightsBuf}},{binding:1,resource:{buffer:this.gridCountsBuf}},{binding:2,resource:{buffer:this.gridIndicesBuf}},{binding:3,resource:this.depthView},{binding:4,resource:{buffer:this.camBuf}},{binding:5,resource:{buffer:this.frameBuf}}]}),this.bgSsao=e.createBindGroup({layout:this.bglSsao,entries:[{binding:0,resource:this.depthView},{binding:1,resource:this.g1View}]}),this.bgBlur=e.createBindGroup({layout:this.bglBlur,entries:[{binding:0,resource:this.aoHalfView},{binding:1,resource:g}]});const y=h=>[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:h},{binding:5,resource:{buffer:this.lightsBuf}},{binding:6,resource:{buffer:this.gridCountsBuf}},{binding:7,resource:{buffer:this.gridIndicesBuf}},{binding:8,resource:{buffer:this.probesBuf}}];this.bgLightingAo=e.createBindGroup({layout:this.bglLighting,entries:y(this.aoHalf2View)}),this.bgLightingWhite=e.createBindGroup({layout:this.bglLighting,entries:y(this.whiteView)}),this.bgSsr=e.createBindGroup({layout:this.bglSsr,entries:[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:this.hdrAView},{binding:5,resource:g}]}),this.bgRefl=e.createBindGroup({layout:this.bglRefl,entries:[{binding:0,resource:this.hdrAView},{binding:1,resource:this.ssrHalfView},{binding:2,resource:this.g1View},{binding:3,resource:this.g2View},{binding:4,resource:this.depthView},{binding:5,resource:g}]}),this.bgOcean=e.createBindGroup({layout:this.bglOcean,entries:[{binding:0,resource:this.hdrBView},{binding:1,resource:this.depthView},{binding:2,resource:g},{binding:3,resource:this.dispView},{binding:4,resource:this.smpRep}]}),this.bgTaa=e.createBindGroup({layout:this.bglTaa,entries:[{binding:0,resource:this.hdrA2View},{binding:1,resource:this.historyView},{binding:2,resource:this.depthView},{binding:3,resource:g}]}),this.bgExp=e.createBindGroup({layout:this.bglExp,entries:[{binding:0,resource:this.hdrCView},{binding:1,resource:{buffer:this.statsBuf}},{binding:2,resource:{buffer:this.frameBuf}}]}),this.bloomPasses=[],this.bgBloom=[],this.bloomPasses.push({kind:"pre",src:this.hdrCView,dst:this.bloomViews[0],mip:0});for(let h=1;h<Q;h++)this.bloomPasses.push({kind:"down",src:this.bloomViews[h-1],dst:this.bloomViews[h],mip:h});for(let h=Q-2;h>=0;h--)this.bloomPasses.push({kind:"up",src:this.bloomViews[h+1],dst:this.bloomViews[h],mip:h});this.bloomPasses.forEach(h=>{const p=e.createBindGroup({layout:this.bglBloom0,entries:[{binding:0,resource:{buffer:this.frameBuf}},{binding:1,resource:{buffer:this.destBufs[h.mip]}}]}),L=e.createBindGroup({layout:this.bglBloom1,entries:[{binding:0,resource:h.src},{binding:1,resource:g},{binding:2,resource:{buffer:this.statsBuf}}]});this.bgBloom.push([p,L])});const z=h=>[{binding:0,resource:this.hdrCView},{binding:1,resource:h},{binding:2,resource:{buffer:this.statsBuf}},{binding:3,resource:g},{binding:4,resource:this.lutView}];this.bgTonemapBloom=e.createBindGroup({layout:this.bglTonemap,entries:z(this.bloomViews[0])}),this.bgTonemapBlack=e.createBindGroup({layout:this.bglTonemap,entries:z(this.blackView)})}passFilter=null;want(e){return!this.passFilter||this.passFilter.has(e)}render(e){const r=this.dev,s=performance.now(),t=this.W,a=this.H;if(t<4||a<4)return;this.graph.beginFrame();const c=this.camera;c.jitterEnabled=this.toggles.taa,this.uniforms.taaOn=this.toggles.taa?1:0,c.update(t/a),this.uniforms.updateSun(),this.uniforms.updateCascades(c);const l=Math.ceil(t/16),m=Math.ceil(a/16);this.uniforms.pack(c,t,a,e/1e3,this.scene.lights.length,this.uniforms.cascadeTexelWorld(),1/this.atlas,1.6,l,m,this.scene.waterLevel,4200,-22,2),this.put(this.camBuf,this.uniforms.camData),this.put(this.frameBuf,this.uniforms.frameData);for(let i=0;i<4;i++)this.put(this.cascadeBuf[i],this.uniforms.cascadeData[i]);this.put(this.gridCountsBuf,this.zerobuffer),this.uniforms.lutOn=this.toggles.lut?1:0,this.uniforms.ssrOn=this.toggles.ssr&&this.tier.ssr?1:0,this.uniforms.giOn=this.toggles.gi?1:0,this.uniforms.fftOn=this.toggles.fft&&this.tier.fft?1:0,this.uniforms.causticsOn=this.toggles.caus?1:0,this.uniforms.bakeProbes(),this.put(this.probesBuf,this.uniforms.probeData);const n=r.createCommandEncoder();if(this.want("shadow")){const i=n.beginRenderPass({colorAttachments:[],depthStencilAttachment:{view:this.shadowView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});i.setPipeline(this.pShadow),i.setVertexBuffer(0,this.sceneVB),i.setIndexBuffer(this.sceneIB,"uint32");const f=this.atlas/2;for(let u=0;u<4;u++){i.setViewport((u&1)*f,(u>>1)*f,f,f,0,1),i.setScissorRect((u&1)*f,(u>>1)*f,f,f),i.setBindGroup(0,this.bgCascade[u]);for(const w of this.scene.groups)i.drawIndexed(w.count,1,w.firstIndex)}i.end()}if(this.want("gbuffer")){const i=n.beginRenderPass({colorAttachments:[{view:this.g0View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g1View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g2View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});i.setPipeline(this.pGbuffer),i.setBindGroup(0,this.bgGlobal),i.setVertexBuffer(0,this.sceneVB),i.setIndexBuffer(this.sceneIB,"uint32"),this.scene.groups.forEach((f,u)=>{i.setBindGroup(1,this.bgMesh[u]),i.drawIndexed(f.count,1,f.firstIndex)}),i.end()}if(this.want("cull")){const i=n.beginComputePass();i.setPipeline(this.pCull),i.setBindGroup(0,this.bgCull),i.dispatchWorkgroups(l,m),i.end()}const d=this.want("ssao")&&this.toggles.ssao&&this.tier.ssao;if(d){const i=Math.ceil(t/2),f=Math.ceil(a/2),u=n.beginRenderPass({colorAttachments:[{view:this.aoHalfView,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});u.setPipeline(this.pSsao),u.setBindGroup(0,this.bgGlobal),u.setBindGroup(1,this.bgSsao),u.setViewport(0,0,i,f,0,1),u.draw(3),u.end();const w=n.beginRenderPass({colorAttachments:[{view:this.aoHalf2View,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});w.setPipeline(this.pBlur),w.setBindGroup(0,this.bgGlobal),w.setBindGroup(1,this.bgBlur),w.setViewport(0,0,i,f,0,1),w.draw(3),w.end()}if(this.want("lighting")){const i=n.beginRenderPass({colorAttachments:[{view:this.hdrAView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.pLighting),i.setBindGroup(0,this.bgGlobal),i.setBindGroup(1,d?this.bgLightingAo:this.bgLightingWhite),i.draw(3),i.end()}if(this.want("ssr")&&this.toggles.ssr&&this.tier.ssr){const i=Math.ceil(t/2),f=Math.ceil(a/2),u=n.beginRenderPass({colorAttachments:[{view:this.ssrHalfView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});u.setPipeline(this.pSsr),u.setBindGroup(0,this.bgGlobal),u.setBindGroup(1,this.bgSsr),u.setViewport(0,0,i,f,0,1),u.draw(3),u.end()}if(this.want("refl")){const i=n.beginRenderPass({colorAttachments:[{view:this.hdrA2View,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.pRefl),i.setBindGroup(0,this.bgGlobal),i.setBindGroup(1,this.bgRefl),i.draw(3),i.end()}if(this.want("taa")){const i=n.beginRenderPass({colorAttachments:[{view:this.hdrBView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.pTaa),i.setBindGroup(0,this.bgGlobal),i.setBindGroup(1,this.bgTaa),i.draw(3),i.end(),n.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("history")},[t,a,1])}if(n.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("hdrC")},[t,a,1]),this.frameNo++,this.uniforms.fftOn>0&&this.frameNo%this.fftDiv===0&&this.want("fft")){const i=n.beginComputePass();i.setPipeline(this.pGen),i.setBindGroup(0,this.bgGen),i.dispatchWorkgroups(32,32),i.setPipeline(this.pFft);for(let f=0;f<16;f++)i.setBindGroup(0,this.bgFft[f]),i.dispatchWorkgroups(32,32);i.setPipeline(this.pPack),i.setBindGroup(0,this.bgPack),i.dispatchWorkgroups(32,32),i.end()}if(this.want("ocean")&&this.toggles.ocean){const i=new URLSearchParams(location.search).get("odepth")==="0",f=new URLSearchParams(location.search).get("oload")!=="clear",u=n.beginRenderPass({colorAttachments:[{view:this.hdrCView,loadOp:f?"load":"clear",clearValue:{r:0,g:0,b:0,a:1},storeOp:"store"}],...i?{}:{depthStencilAttachment:{view:this.depthView,depthReadOnly:!0}}});u.setPipeline(this.pOcean),u.setBindGroup(0,this.bgGlobal),new URLSearchParams(location.search).get("obgl")!=="0"&&u.setBindGroup(1,this.bgOcean),u.setVertexBuffer(0,this.oceanNearVB),u.setIndexBuffer(this.oceanNearIB,"uint32"),u.drawIndexed(this.oceanNearCount),new URLSearchParams(location.search).get("ofar")!=="0"&&(u.setVertexBuffer(0,this.oceanFarVB),u.setIndexBuffer(this.oceanFarIB,"uint32"),u.drawIndexed(this.oceanFarCount)),u.end()}if(this.want("exposure")){const i=n.beginComputePass();i.setPipeline(this.pExpAccum),i.setBindGroup(0,this.bgExp),i.dispatchWorkgroups(Math.ceil(t/4/8),Math.ceil(a/4/8)),i.setPipeline(this.pExpFinal),i.dispatchWorkgroups(1,1,1),i.end()}if(this.want("bloom")&&this.toggles.bloom&&this.bloomPasses.forEach((i,f)=>{const u=i.kind==="pre"?this.pBloomPre:i.kind==="down"?this.pBloomDown:this.pBloomUp,w=Math.max(Math.ceil(t/2)>>i.mip,2),g=Math.max(Math.ceil(a/2)>>i.mip,2),y=n.beginRenderPass({colorAttachments:[{view:i.dst,clearValue:{r:0,g:0,b:0,a:1},loadOp:i.kind==="up"?"load":"clear",storeOp:"store"}]});y.setPipeline(u),y.setBindGroup(0,this.bgBloom[f][0]),y.setBindGroup(1,this.bgBloom[f][1]),y.setViewport(0,0,w,g,0,1),y.draw(3),y.end()}),this.want("tonemap")){const f=new URLSearchParams(location.search).get("ttex")==="1"?this.graph.texture("tonemapTex",{width:t,height:a,format:this.ctx.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}):this.ctx.context.getCurrentTexture().createView(),u=n.beginRenderPass({colorAttachments:[{view:f,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});u.setPipeline(this.pTonemap),u.setBindGroup(0,this.bgGlobal),u.setBindGroup(1,this.toggles.bloom?this.bgTonemapBloom:this.bgTonemapBlack),u.setViewport(0,0,t,a,0,1),u.draw(3),u.end()}r.queue.submit([n.finish()]),this.lastFrameCpuMs=performance.now()-s,window.__FRAME_N__=window.__FRAME_N__===void 0?performance.now()/1e3:window.__FRAME_N__}async debugSnapshot(e,r,s=0,t=0){const a=this.dev,c=Math.min(e??this.W,this.W),l=Math.min(r??this.H,this.H),m=this.graphTexture("tonemapTex"),n=Math.ceil(c*4/256)*256,d=a.createBuffer({size:n*l,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),v=a.createCommandEncoder();v.copyTextureToBuffer({texture:m,origin:[s,t,0]},{buffer:d,bytesPerRow:n,rowsPerImage:l},[c,l,1]),a.queue.submit([v.finish()]),await d.mapAsync(GPUMapMode.READ);const i=new Uint8Array(d.getMappedRange()),f=new Uint8Array(c*l*4);for(let u=0;u<l;u++)for(let w=0;w<c;w++){const g=u*n+w*4,y=u*c*4+w*4;f[y]=i[g+2],f[y+1]=i[g+1],f[y+2]=i[g],f[y+3]=255}return d.unmap(),d.destroy(),{w:c,h:l,rgba:f}}async debugRow(e,r,s,t,a=16){const c=this.dev,l=[];for(let g=s;g<=t;g+=a)l.push(Math.min(g,this.W-1));const m=l.length,n=256,d=this.graphTexture(e),v=c.createBuffer({size:n*m,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),i=c.createCommandEncoder();l.forEach((g,y)=>{i.copyTextureToBuffer({texture:d,origin:[g,Math.min(r,this.H-1),0]},{buffer:v,offset:y*n,bytesPerRow:n,rowsPerImage:1},[1,1,1])}),c.queue.submit([i.finish()]),await v.mapAsync(GPUMapMode.READ);const f=new Uint8Array(v.getMappedRange()),u=(g,y)=>{const z=g|y<<8,h=(z&32768)>>15,p=(z&31744)>>10,L=z&1023;let P;return p===0?P=L*2**-24:p===31?P=L?NaN:1/0:P=(1+L/1024)*2**(p-15),(h?-1:1)*P},w={x:l};for(let g=0;g<m;g++){const y=g*n;w[`p${g}`]=[u(f[y],f[y+1]),u(f[y+2],f[y+3])]}return v.unmap(),v.destroy(),w}async debugSample(){const e=this.dev,r=this.W,s=this.H,t=[["g0",this.graphTexture("g0"),r>>1,s>>1,"all"],["hdrA_c",this.graphTexture("hdrA"),r>>1,s>>1,"all"],["hdrA_q",this.graphTexture("hdrA"),r>>2,s>>1,"all"],["hdrA_3q",this.graphTexture("hdrA"),3*r>>2,3*s>>2,"all"],["hdrA_sky",this.graphTexture("hdrA"),r>>1,Math.max(2,s*.08|0),"all"],["hdrC_c",this.graphTexture("hdrC"),r>>1,s>>1,"all"]],a=e.createCommandEncoder(),c={};for(const[m,n,d,v,i]of t)c[m]=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a.copyTextureToBuffer({texture:n,origin:[d,v,0],aspect:i},{buffer:c[m],bytesPerRow:256,rowsPerImage:1},[1,1,1]);e.queue.submit([a.finish()]);const l={};for(const[m]of t){await c[m].mapAsync(GPUMapMode.READ);const n=new Uint8Array(c[m].getMappedRange());l[m]=Array.from(n.slice(0,8)),c[m].unmap(),c[m].destroy()}return l}forceEv(e){this.dev.queue.writeBuffer(this.statsBuf,256,new Float32Array([e]))}async debugDisp(){const e=this.dev,r=64,s=8,t=Math.ceil(r*8/256)*256,a=e.createBuffer({size:t*s,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),c=e.createCommandEncoder();c.copyTextureToBuffer({texture:this._dispTex,origin:[0,0,0]},{buffer:a,bytesPerRow:t,rowsPerImage:s},[r,s,1]),e.queue.submit([c.finish()]),await a.mapAsync(GPUMapMode.READ);const l=new Uint8Array(a.getMappedRange()),m=new DataView(l.buffer),n=w=>{const g=m.getUint16(w,!0),y=(g&32768)>>15,z=(g&31744)>>10,h=g&1023;let p;return z===0?p=h*2**-24:z===31?p=h?NaN:1/0:p=(1+h/1024)*2**(z-15),(y?-1:1)*p};let d=1e9,v=-1e9,i=0,f=0,u=0;for(let w=0;w<s;w++)for(let g=0;g<r;g++){const y=w*t+g*8,z=n(y),h=n(y+2),p=n(y+4);d=Math.min(d,h),v=Math.max(v,h),i+=h*h,f=Math.max(f,Math.abs(z),Math.abs(p)),u++}return a.unmap(),a.destroy(),{hMin:d,hMax:v,hRms:Math.sqrt(i/Math.max(u,1)),dMax:f}}async readStats(){const e=this.dev,r=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),s=e.createCommandEncoder();s.copyBufferToBuffer(this.statsBuf,256,r,0,12),e.queue.submit([s.finish()]),await r.mapAsync(GPUMapMode.READ);const t=new Float32Array(r.getMappedRange()),a={ev:t[0],avg:t[1]};return r.unmap(),r.destroy(),a}graphTexture(e){const r=this.graph.resources.get(e);if(!r||!r.texture)throw new Error(`graph texture ${e} missing`);return r.texture}}function $e(o,e,r,s){const t=b=>document.getElementById(b),c=[...t("tier-seg").querySelectorAll("button")],l=()=>{c.forEach(b=>b.classList.toggle("active",Number(b.dataset.tier)===o.tierIndex)),t("hud-tier").textContent=`tier · ${te[o.tierIndex].name}`};c.forEach(b=>b.addEventListener("click",()=>{o.setTier(Number(b.dataset.tier)),t("tg-ssao").checked=o.toggles.ssao,t("tg-taa").checked=o.toggles.taa,t("tg-ssr").checked=o.toggles.ssr,l()})),l();const m=(b,T,B,D)=>{const M=t(b),A=t(T),G=()=>{const O=Number(M.value);D(O),A.textContent=B(O)};M.addEventListener("input",G),G()};m("sun-el","val-sun-el",b=>`${b}°`,b=>{o.uniforms.sunElevation=b}),m("sun-az","val-sun-az",b=>`${b}°`,b=>{o.uniforms.sunAzimuth=b}),m("ev-bias","val-ev",b=>b.toFixed(1),b=>{o.uniforms.evBias=b}),m("fog-dens","val-fog",b=>b.toFixed(2),b=>{o.uniforms.fogScale=b});const n=(b,T)=>{const B=t(b);B.checked=o.toggles[T],B.addEventListener("change",()=>{o.toggles[T]=B.checked})};n("tg-ssao","ssao"),n("tg-taa","taa"),n("tg-bloom","bloom"),n("tg-ocean","ocean"),n("tg-ssr","ssr"),n("tg-lut","lut"),n("tg-gi","gi"),n("tg-fft","fft"),n("tg-caus","caus");const d=t("tg-wire");d.addEventListener("change",()=>{o.uniforms.debugMode=d.checked?1:0});const v=t("shots");o.uniforms;const i=o.camera,f=window.__SHOTS__??[];let u=-1,w={eye:[0,0,0],look:[0,0,0]};window.__CAM_ANIM__=(b,T)=>{w=T,u=0},f.forEach((b,T)=>{const B=document.createElement("button");B.textContent=`${T+1}. ${b.name}`,B.title=`Точка съёмки ${T+1}`,B.addEventListener("click",()=>{document.exitPointerLock?.();const D={eye:i.eye(),look:i.lookAtPoint()};window.__CAM_ANIM__?.(D,{eye:b.eye,look:b.look})}),v.appendChild(B)}),window.__CAM_TICK__=b=>{u<0||(u=Math.min(u+b/1.4,1),i.animateTo(w,u),u>=1&&(u=-1))};const g=t("btn-fly"),y=()=>{g.textContent=s()?"Орбитальный режим":"Свободный полёт"};g.addEventListener("click",()=>{if(s())document.exitPointerLock?.();else{i.position=i.eye();const b=i.forwardOfView();i.flyYaw=Math.atan2(b[2],b[0]),i.flyPitch=Math.asin(Math.max(-1,Math.min(1,b[1]))),i.mode="fly",o.canvas.requestPointerLock?.()}y()}),document.addEventListener("pointerlockchange",()=>{!s()&&i.mode==="fly"&&(i.mode="orbit"),y()});const z=t("hud-panel"),h=t("hud-toggle"),p=b=>{z.classList.toggle("collapsed",b),h.style.display=b?"block":"none"};h.addEventListener("click",()=>p(!1)),document.addEventListener("keydown",b=>{(b.key==="h"||b.key==="H")&&p(!z.classList.contains("collapsed"))});const L=t("fps-graph"),P=L.getContext("2d"),S=[];let x=16.6;window.__FPS_TICK__=b=>{x=x*.9+b*.1,S.push(b),S.length>110&&S.shift(),P.clearRect(0,0,L.width,L.height),P.strokeStyle="rgba(242,106,27,0.35)",P.beginPath(),P.moveTo(0,L.height-16.6/40*L.height),P.lineTo(L.width,L.height-16.6/40*L.height),P.stroke(),P.strokeStyle="#F26A1B",P.beginPath(),S.forEach((T,B)=>{const D=B/109*L.width,M=L.height-Math.min(T/40,1)*L.height;B===0?P.moveTo(D,M):P.lineTo(D,M)}),P.stroke(),t("hud-fps").textContent=`${(1e3/Math.max(x,.01)).toFixed(0)} fps · ${x.toFixed(1)} ms`},e.adapter.textContent=o.adapterNameShort()}const Ke=document.getElementById("boot"),Je=document.getElementById("boot-status"),Ze=document.getElementById("boot-bar-fill"),re=document.getElementById("boot-detail"),Qe=document.getElementById("hud");function I(o,e=-1,r=""){Je.textContent=o,e>=0&&(Ze.style.width=`${Math.round(e*100)}%`),r&&(re.textContent+=(re.textContent?`
`:"")+r)}function oe(o,e){I("Не удалось запустить WebGPU",1);const r=[o,"",e];re.textContent=r.join(`
`),re.style.color="#d89a55",window.__wgpu={status:"unsupported",error:o}}async function et(){const o=document.getElementById("gpu");I("Запрос GPU-адаптера…",.1);let e;try{e=await xe(o)}catch(x){oe(String(x.message??x),["Поддержка WebGPU:","· Chrome / Edge 113+ (Windows, macOS, ChromeOS)","· Firefox 141+ (Windows)","· Safari 26+ (macOS, iOS)","","Если браузер поддерживает — включите флаг или проверьте, что аппаратное ускорение активно."].join(`
`));return}I("Компиляция пайплайнов…",.35,`адаптер: ${e.adapterName}`),console.log(`[boot] device ok @${(performance.now()/1e3).toFixed(2)}s`),I("…",.4,`лимиты: maxTex2D=${e.limits.maxTextureDimension2D} storage=${(e.limits.maxStorageBufferBindingSize/(1<<20)).toFixed(0)} МБ`),be(e.device,x=>{console.error("[gpu]",x),window.__wgpu={status:"error",error:x},I("Ошибка GPU",-1,x)}),console.log(`[boot] pre-scene @${(performance.now()/1e3).toFixed(2)}s`);const r=ye();window.__SHOTS__=r.shots,console.log(`[boot] scene built @${(performance.now()/1e3).toFixed(2)}s`),window.__DEBUG__={groups:r.groups.map(x=>({matId:x.matId,tris:x.count/3})),verts:r.vertexData.length/8,tris:r.indexData.length/3,lights:r.lights.length,probes:r.probes.length};const s=new Ye(e,r);try{await s.init()}catch(x){console.error(x),oe(`Инициализация рендерера: ${String(x.message??x)}`,"Смотрите консоль (F12) для деталей.");return}const t=new URLSearchParams(location.search),a=t.get("tier"),c=t.get("only");if(c&&(s.passFilter=new Set(c.split(",").map(x=>x.trim()).filter(Boolean))),s.setTier(a?Number(a):2),t.has("notaa")){s.toggles.taa=!1;const x=document.getElementById("tg-taa");x&&(x.checked=!1)}if(t.has("taayes")){s.toggles.taa=!0;const x=document.getElementById("tg-taa");x&&(x.checked=!0)}const l=(x,b,T)=>{if(t.has(x)){s.toggles[b]=!1;const B=document.getElementById(T);B&&(B.checked=!1)}};l("nossr","ssr","tg-ssr"),l("nolut","lut","tg-lut"),l("gino","gi","tg-gi"),s.camera.target=[-8,2.2,0],s.camera.distance=30,s.camera.yaw=4.05,s.camera.pitch=.22,s.resize(),console.log(`[boot] renderer ready @${(performance.now()/1e3).toFixed(2)}s`),I("Сцена собрана. Старт рендера…",1),$e(s,{adapter:document.getElementById("hud-adapter"),fps:document.getElementById("hud-fps"),tier:document.getElementById("hud-tier")},()=>{},()=>document.pointerLockElement===o);const m=t.get("evbias");if(m!==null){const x=document.getElementById("ev-bias");x&&(x.value=m),s.uniforms.evBias=Number(m)}t.has("evlock")&&(s.uniforms.evLock=1);const n=t.get("dbg");if(n!==null){s.uniforms.debugMode=Number(n);const x=document.getElementById("tg-wire");x&&(x.checked=Number(n)===1)}window.__PROBE__=()=>s.debugSample(),window.__SNAPBUF__=async(x,b,T)=>{L=!0,await new Promise(B=>setTimeout(B,120));try{const B=Math.min(x??s.canvas.width,s.canvas.width),D=Math.min(b??s.canvas.height,s.canvas.height),M=new Uint8Array(B*D*4),A=320,G=180;let O=0;for(let R=0;R<D;R+=G)for(let U=0;U<B;U+=A){const X=Math.min(A,B-U),ne=Math.min(G,D-R),ge=await s.debugSnapshot(X,ne,U,R);for(let K=0;K<ne;K++)M.set(ge.rgba.subarray(K*X*4,(K+1)*X*4),((R+K)*B+U)*4);console.log(`[snap] tile ${O++} ok`)}console.log("[snap] tiles done"),console.log("[snap] png start");let H="";const j=49152;for(let R=0;R<M.length;R+=j)H+=btoa(String.fromCharCode(...M.subarray(R,Math.min(R+j,M.length))));const q={w:B,h:D,b64:H};if(T){const R=document.createElement("canvas");R.width=B,R.height=D;const U=R.getContext("2d"),X=U.createImageData(B,D);X.data.set(M),U.putImageData(X,0,0),q.png=R.toDataURL("image/png").split(",")[1],console.log("[snap] png done")}return q}finally{L=!1}},window.__SET_DBG__=x=>{s.uniforms.debugMode=x},window.__PROBEDATA__=()=>Array.from(s.uniforms.probeData.slice(0,40)),window.__STATS__=()=>s.readStats(),window.__DISPSTAT__=()=>s.debugDisp(),window.__SAMPLES__=()=>s.debugSample(),window.__CAM_POSE__=(x,b)=>{const T=s.camera;T.target=b;const B=[x[0]-b[0],x[1]-b[1],x[2]-b[2]];T.distance=Math.max(2.2,Math.hypot(B[0],B[1],B[2])),T.yaw=Math.atan2(B[2],B[0]);const D=Math.hypot(B[0],B[2]);T.pitch=Math.atan2(B[1],D)},window.__ROW__=(x,b,T,B,D)=>s.debugRow(x,b,T,B,D);const d=s.canvas;let v=!1,i=0,f=0,u=!1;d.addEventListener("pointerdown",x=>{document.pointerLockElement!==d&&(v=!0,u=x.button===2||x.button===1,i=x.clientX,f=x.clientY,d.setPointerCapture(x.pointerId))}),d.addEventListener("pointermove",x=>{if(!v)return;const b=x.clientX-i,T=x.clientY-f;i=x.clientX,f=x.clientY,u?s.camera.pan(b,T):s.camera.moveOrbit(b,T)}),d.addEventListener("pointerup",x=>{v=!1,d.releasePointerCapture(x.pointerId)}),d.addEventListener("contextmenu",x=>x.preventDefault()),d.addEventListener("wheel",x=>{x.preventDefault(),s.camera.zoom(x.deltaY)},{passive:!1});const w=new Set;document.addEventListener("keydown",x=>w.add(x.code.toLowerCase())),document.addEventListener("keyup",x=>w.delete(x.code.toLowerCase()));let g=0;window.addEventListener("resize",()=>{clearTimeout(g),g=window.setTimeout(()=>s.resize(),120)}),performance.now();let y=!1;const z=Number(t.get("fpscap")??0);let h=0,p=0,L=!1;const P=x=>{if(L){y&&requestAnimationFrame(P);return}if(z>0&&x-h<z){y&&requestAnimationFrame(P);return}h=x;const b=p>0?Math.min(x-p,100):16;p=x,window.__CAM_TICK__?.(b/1e3),s.camera.mode==="fly"&&s.camera.flyStep(b/1e3,w);try{s.render(b)}catch(T){console.error(T),I("Ошибка кадра",-1,String(T.message??T)),y=!1;return}window.__FPS_TICK__?.(b),window.__wgpu={status:"running",adapter:e.adapterName,tier:te[s.tierIndex].name},y&&requestAnimationFrame(P)};new URLSearchParams(location.search).has("still")?window.__wgpu={status:"running",adapter:e.adapterName,tier:"still"}:(y=!0,requestAnimationFrame(P)),setTimeout(()=>{Ke.classList.add("fade"),Qe.classList.remove("hidden")},450)}et().catch(o=>{console.error(o),oe(String(o.message??o),"Смотрите консоль (F12).")});

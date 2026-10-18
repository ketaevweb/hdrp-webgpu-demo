(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();function ue(i){let e="",a="",r="";const t=i.info;t&&(e=t.vendor||"",a=t.architecture||"",r=t.description||"");const s=[e,a,r].filter(n=>n&&n.length>0);return{name:s.length?s.join(" · "):"WebGPU adapter",features:[...i.features]}}async function he(i){const e=navigator.gpu;if(!e)throw new Error("navigator.gpu недоступен — браузер без WebGPU");const a=[{powerPreference:"high-performance"},{},{forceFallbackAdapter:!0}],r=window.__GPUKEEP__??[];window.__GPUKEEP__=r;let t=null,s=null;for(const d of a){let f=null;try{f=await e.requestAdapter(d)}catch{f=null}if(!f)continue;let b;try{b=await f.requestDevice({label:"hdrp-webgpu-device",requiredLimits:{maxTextureDimension2D:Math.min(f.limits.maxTextureDimension2D,8192),maxStorageBufferBindingSize:Math.min(f.limits.maxStorageBufferBindingSize,1<<28)}})}catch{continue}const v=new Promise(B=>b.lost.then(()=>B(!0)));if(await Promise.race([v,new Promise(B=>setTimeout(()=>B(!1),350))])){try{b.destroy()}catch{}continue}t=b,s=f;break}if(s&&r.push(s),t&&r.push(t),!s||!t)throw new Error("Не получен рабочий GPUDevice (все кандидаты отклонены)");const{name:c}=ue(s),n=i.getContext("webgpu");if(!n)throw new Error('canvas.getContext("webgpu") вернул null');const h=e.getPreferredCanvasFormat();n.configure({device:t,format:h,alphaMode:"opaque"});const l=globalThis;l.__devSeq=(l.__devSeq??0)+1;const m=l.__devSeq;window.__DEV_OK__=`#${m} @${(performance.now()/1e3).toFixed(2)}s`,t.lost.then(d=>{const f=`#${m} ${d.reason}: ${d.message} @${(performance.now()/1e3).toFixed(2)}s`;console.error(`[gpu] DEVICE LOST ${f}`),window.__DEVLOST__=f});const o={maxTextureDimension2D:t.limits.maxTextureDimension2D,maxBufferSize:t.limits.maxBufferSize,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxUniformBufferBindingSize:t.limits.maxUniformBufferBindingSize};return{device:t,context:n,canvas:i,format:h,adapterName:c,features:[...t.features],limits:o,maxTextureDim:t.limits.maxTextureDimension2D}}function me(i,e){i.addEventListener("uncapturederror",a=>{e(`GPU uncaptured error: ${a.error.message}`)})}const R=(i,e,a,r)=>{let[t,s,c]=[i,e,a];if(r.rz){const n=Math.cos(r.rz),h=Math.sin(r.rz),l=t*n-s*h,m=t*h+s*n;t=l,s=m}if(r.ry){const n=Math.cos(r.ry),h=Math.sin(r.ry),l=t*n+c*h,m=-t*h+c*n;t=l,c=m}return[t+r.translate[0],s+r.translate[1],c+r.translate[2]]},I=(i,e,a,r)=>{let[t,s,c]=[i,e,a];if(r.rz){const n=Math.cos(r.rz),h=Math.sin(r.rz),l=t*n-s*h,m=t*h+s*n;t=l,s=m}if(r.ry){const n=Math.cos(r.ry),h=Math.sin(r.ry),l=t*n+c*h,m=-t*h+c*n;t=l,c=m}return[t,s,c]};class pe{pos=[];nrm=[];uv=[];idx=[];vert(e,a,r,t){return this.pos.push(e[0],e[1],e[2]),this.nrm.push(a[0],a[1],a[2]),this.uv.push(r,t),this.pos.length/3-1}quad(e,a,r,t){this.idx.push(e,a,r,e,r,t)}addBox(e,a,r){const t={translate:e,...r},s=a[0]/2,c=a[1]/2,n=a[2]/2,h=[{n:[0,0,1],corners:[[-s,-c,n],[s,-c,n],[s,c,n],[-s,c,n]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,0,-1],corners:[[s,-c,-n],[-s,-c,-n],[-s,c,-n],[s,c,-n]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[1,0,0],corners:[[s,-c,n],[s,-c,-n],[s,c,-n],[s,c,n]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[-1,0,0],corners:[[-s,-c,-n],[-s,-c,n],[-s,c,n],[-s,c,-n]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,1,0],corners:[[-s,c,n],[s,c,n],[s,c,-n],[-s,c,-n]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,-1,0],corners:[[-s,-c,-n],[s,-c,-n],[s,-c,n],[-s,-c,n]],uv:[[0,0],[1,0],[1,1],[0,1]]}];for(const l of h){const m=I(l.n[0],l.n[1],l.n[2],t),o=l.corners.map((d,f)=>this.vert(R(d[0],d[1],d[2],t),m,l.uv[f][0],l.uv[f][1]));this.quad(o[0],o[1],o[2],o[3])}return this}addCylinder(e,a,r,t,s=10,c){const n={translate:e,...c},h=t/2,l=this.pos.length/3;for(let m=0;m<=s;m++){const o=m/s*Math.PI*2,d=Math.cos(o),f=Math.sin(o),b=(a-r)/t,v=Math.hypot(1,b);this.vert(R(d*a,-h,f*a,n),I(d/v,b/v,f/v,n),m/s*4,0),this.vert(R(d*r,h,f*r,n),I(d/v,b/v,f/v,n),m/s*4,1)}for(let m=0;m<s;m++){const o=l+m*2;this.quad(o,o+2,o+3,o+1)}if(r>.001){const m=this.vert(R(0,h,0,n),I(0,1,0,n),.5,.5);for(let o=0;o<s;o++){const d=o/s*Math.PI*2,f=(o+1)/s*Math.PI*2,b=this.vert(R(Math.cos(d)*r,h,Math.sin(d)*r,n),I(0,1,0,n),0,0),v=this.vert(R(Math.cos(f)*r,h,Math.sin(f)*r,n),I(0,1,0,n),0,0);this.quad(m,b,v,m)}}if(a>.001){const m=this.vert(R(0,-h,0,n),I(0,-1,0,n),.5,.5);for(let o=0;o<s;o++){const d=o/s*Math.PI*2,f=(o+1)/s*Math.PI*2,b=this.vert(R(Math.cos(d)*a,-h,Math.sin(d)*a,n),I(0,-1,0,n),0,0),v=this.vert(R(Math.cos(f)*a,-h,Math.sin(f)*a,n),I(0,-1,0,n),0,0);this.quad(m,v,b,m)}}return this}addSphere(e,a,r,t=12,s=8){const c=this.pos.length/3;for(let n=0;n<=s;n++){const h=n/s,l=h*Math.PI;for(let m=0;m<=t;m++){const o=m/t,d=o*Math.PI*2,f=[Math.sin(l)*Math.cos(d),Math.cos(l),Math.sin(l)*Math.sin(d)],b=[e[0]+f[0]*a,e[1]+f[1]*a,e[2]+f[2]*a];r&&r(b,f),this.vert(b,f,o*3,h*2)}}for(let n=0;n<s;n++)for(let h=0;h<t;h++){const l=c+n*(t+1)+h,m=l+t+1;this.quad(l,m,m+1,l+1)}return this}build(){const e=this.pos.length/3,a=new Float32Array(e*8);for(let r=0;r<e;r++)a.set([this.pos[r*3],this.pos[r*3+1],this.pos[r*3+2]],r*8),a.set([this.nrm[r*3],this.nrm[r*3+1],this.nrm[r*3+2]],r*8+3),a.set([this.uv[r*2],this.uv[r*2+1]],r*8+6);return{vertexData:a,indexData:new Uint32Array(this.idx)}}}const w={CONCRETE:0,PLASTER:1,WOOD_FLOOR:2,WOOD_DECK:3,METAL:4,FABRIC:5,FOLIAGE:6,ROCK:7,EMISSIVE:8};let Z=1337;function D(){return Z=Z*1664525+1013904223>>>0,Z/4294967296}function ge(){Z=1337;const i=new Map,e=g=>{let x=i.get(g);return x||(x=new pe,i.set(g,x)),x},a=0;e(w.CONCRETE).addBox([0,.6,0],[38,1.2,30]),e(w.CONCRETE).addBox([0,-2.2,0],[420,1,420]),e(w.WOOD_FLOOR).addBox([-11,1.22,0],[10,.05,12]),e(w.PLASTER).addBox([-16,2.65,-4],[.35,2.9,4]),e(w.PLASTER).addBox([-16,2.65,4],[.35,2.9,4]),e(w.PLASTER).addBox([-16,.65,0],[.35,1.1,4]),e(w.PLASTER).addBox([-16,3.75,0],[.35,1.2,4]),e(w.PLASTER).addBox([-11,2.85,6],[10,3.3,.35]),e(w.PLASTER).addBox([-11,2.85,-6],[10,3.3,.35]),e(w.PLASTER).addBox([-6,2.85,-3.6],[.35,3.3,4.8]),e(w.PLASTER).addBox([-6,2.85,3.6],[.35,3.3,4.8]),e(w.PLASTER).addBox([-6,3.6,0],[.35,1.8,2.4]),e(w.PLASTER).addBox([-11,4.65,0],[10,.3,12]),e(w.WOOD_FLOOR).addBox([-4.5,1.22,0],[3,.05,3]),e(w.PLASTER).addBox([-4.5,2.7,-1.5],[3,3,.3]),e(w.PLASTER).addBox([-4.5,2.7,1.5],[3,3,.3]),e(w.PLASTER).addBox([-4.5,4.35,0],[3,.3,3.3]),e(w.WOOD_FLOOR).addBox([1.5,1.22,0],[9,.05,9]),e(w.PLASTER).addBox([-3,3.35,-2.85],[.35,4.3,3.3]),e(w.PLASTER).addBox([-3,3.35,2.85],[.35,4.3,3.3]),e(w.PLASTER).addBox([-3,4.2,0],[.35,2,2.4]),e(w.PLASTER).addBox([1.5,3.35,4.5],[9,4.3,.35]),e(w.PLASTER).addBox([1.5,3.35,-4.5],[9,4.3,.35]),e(w.PLASTER).addBox([6,3.35,-3],[.35,4.3,3]),e(w.PLASTER).addBox([6,3.35,3],[.35,4.3,3]),e(w.PLASTER).addBox([6,4.2,0],[.35,2,3]),e(w.PLASTER).addBox([-.9,5.65,0],[4.2,.3,9]),e(w.PLASTER).addBox([4.5,5.65,0],[3,.3,9]),e(w.PLASTER).addBox([1.5,5.65,-3],[6,.3,3]),e(w.PLASTER).addBox([1.5,5.65,3],[6,.3,3]),e(w.CONCRETE).addBox([1.5,5.9,-1.55],[3.2,.4,.12]),e(w.CONCRETE).addBox([1.5,5.9,1.55],[3.2,.4,.12]),e(w.CONCRETE).addBox([-.05,5.9,0],[.12,.4,3.2]),e(w.CONCRETE).addBox([3.05,5.9,0],[.12,.4,3.2]),e(w.CONCRETE).addBox([4.6,1.5,3.2],[1.2,.6,1.2]);for(let g=0;g<5;g++){const x=D()*Math.PI*2;e(w.FOLIAGE).addSphere([4.6+Math.cos(x)*.35,1.95+D()*.3,3.2+Math.sin(x)*.35],.32+D()*.15,L=>{L[1]*=.7},8,6)}e(w.WOOD_FLOOR).addBox([11,1.22,0],[10,.05,10]),e(w.PLASTER).addBox([11,2.85,5],[10,3.3,.35]),e(w.PLASTER).addBox([11,2.85,-5],[10,3.3,.35]),e(w.PLASTER).addBox([16,2.85,-3.75],[.35,3.3,2.5]),e(w.PLASTER).addBox([16,2.85,3.75],[.35,3.3,2.5]),e(w.PLASTER).addBox([16,.6,0],[.35,1,5]),e(w.PLASTER).addBox([16,3.75,0],[.35,1.2,5]),e(w.PLASTER).addBox([11,4.65,0],[10,.3,10]),e(w.WOOD_FLOOR).addBox([14.3,1.75,-1.2],[2,1.05,5.2]),e(w.METAL).addBox([15.6,2.4,-1.2],[.08,.04,5.2]),e(w.PLASTER).addBox([15.75,3.1,-1.2],[.4,1.9,5.2]);for(const g of[-2.8,-1.4,0,1.4])e(w.FABRIC).addCylinder([13,1.55,g],.22,.24,.68,10),e(w.METAL).addCylinder([13,1.2,g],.05,.05,.35,8);e(w.FABRIC).addBox([8.2,1.6,-2.8],[1.1,.75,2.6]),e(w.FABRIC).addBox([7.8,2,-2.8],[.35,.8,2.6]),e(w.FABRIC).addBox([8.2,1.75,-3.9],[1,.45,.3]),e(w.FABRIC).addBox([8.2,1.75,-1.7],[1,.45,.3]),e(w.FABRIC).addBox([10,1.26,-1.5],[4.2,.03,3.2]);for(const g of[-2.6,.2])e(w.METAL).addCylinder([14.2,4,g],.008,.008,1.2,6),e(w.METAL).addCylinder([14.2,3.32,g],.16,.06,.16,12),e(w.EMISSIVE).addSphere([14.2,3.24,g],.055,void 0,8,6);e(w.METAL).addCylinder([1.5,5.5,0],.008,.008,1.6,6),e(w.METAL).addCylinder([1.5,4.62,0],.2,.07,.18,12),e(w.EMISSIVE).addSphere([1.5,4.52,0],.06,void 0,8,6),e(w.METAL).addCylinder([8.6,1.85,2.8],.02,.02,1.3,6),e(w.METAL).addCylinder([8.6,1.22,2.8],.16,.16,.04,10),e(w.EMISSIVE).addCylinder([8.6,2.62,2.8],.11,.14,.24,12);for(const g of[-1.15,1.15])e(w.EMISSIVE).addBox([-4.5,2.55,g],[.16,.1,.24]);for(const g of[-2.6,2.6])e(w.EMISSIVE).addCylinder([-11,4.42,g],.09,.09,.05,10);for(const g of[-4.6,4.6])e(w.METAL).addCylinder([-18.5,1.5,g],.06,.06,.62,8),e(w.EMISSIVE).addCylinder([-18.5,1.86,g],.045,.05,.1,8);for(const g of[-4.6,0,4.6])e(w.CONCRETE).addCylinder([-17.2,3,g],.22,.26,3.6,12);e(w.PLASTER).addBox([-17.2,5,0],[.9,.5,11]);for(let g=0;g<24;g++){const x=-17.4-g*1;e(w.WOOD_DECK).addBox([x,1.08,0],[.88,.09,3.6])}e(w.WOOD_DECK).addBox([-29,.92,-1.55],[24,.16,.28]),e(w.WOOD_DECK).addBox([-29,.92,1.55],[24,.16,.28]);for(const g of[-18,-22,-26,-30,-34,-38])for(const x of[-1.9,1.9])e(w.WOOD_DECK).addCylinder([g,.1,x],.15,.13,3,8);e(w.WOOD_DECK).addBox([-28.5,1.85,-1.72],[22,.07,.07]),e(w.WOOD_DECK).addBox([-28.5,1.85,1.72],[22,.07,.07]);for(let g=0;g<12;g++){const x=-18.5-g*1.8;e(w.WOOD_DECK).addBox([x,1.5,-1.72],[.06,.6,.06]),e(w.WOOD_DECK).addBox([x,1.5,1.72],[.06,.6,.06])}const r=[[-20.5,-.35,3.6,1.5],[-22.5,-.55,-2.8,1.9],[-25,-.3,1.6,1.2],[-27.5,-.5,-4.2,1.6],[-30,-.45,2.8,1.4],[-23.8,-.75,.4,1.1],[-19.4,-.6,-3.4,1.3],[-33,-.35,-1.2,1.7]];for(const[g,x,L,u]of r)e(w.ROCK).addSphere([g,x,L],u,P=>{const S=y=>Math.sin(P[0]*y+1.7)*Math.sin(P[1]*y*1.7+4.2)*Math.sin(P[2]*y*1.3+2.1),_=1+.28*S(2.1)+.14*S(4.7);P[0]=g+(P[0]-g)*_,P[1]=Math.max(x-u*.35,x+(P[1]-x)*_),P[2]=L+(P[2]-L)*_},14,9);const t=[];for(let g=0;g<9;g++)t.push([-14+g*3.4,0,10.4+D()*2.6]);for(let g=0;g<8;g++)t.push([-12+g*3.6,0,-10.2-D()*2.4]);for(const[g,,x]of t){const L=5+Math.floor(D()*4);for(let u=0;u<L;u++){const P=g+(D()-.5)*1.6,S=x+(D()-.5)*1.6,_=3+D()*1.8,y=(D()-.5)*.16,T=(D()-.5)*.16;e(w.FOLIAGE).addCylinder([P,1.2+_/2-.02,S],.035,.022,_,6,{rz:y,ry:T});const C=1.2+_*Math.cos(y),z=P+_*Math.sin(y)*-Math.sin(T)+0,A=S+_*Math.sin(y)*Math.cos(T)*.5,M=3+Math.floor(D()*3);for(let V=0;V<M;V++){const N=C-.25-D()*1.2,E=.35+D()*.45,G=D()*Math.PI*2;e(w.FOLIAGE).addBox([z+Math.cos(G)*E*.5,N,A+Math.sin(G)*E*.5],[E,.02,.09+D()*.06],{ry:G,rz:-.25-D()*.3})}}}const s=[];let c=0,n=0;const h=[],l=[];for(const[g,x]of[...i.entries()].sort((L,u)=>L[0]-u[0])){const{vertexData:L,indexData:u}=x.build();h.push(L),l.push(u),s.push({matId:g,firstIndex:n,count:u.length}),c+=L.length/8,n+=u.length}const m=h.reduce((g,x)=>g+x.length,0),o=l.reduce((g,x)=>g+x.length,0),d=new Float32Array(m),f=new Uint32Array(o);let b=0,v=0;for(let g=0;g<h.length;g++){d.set(h[g],b);const x=l[g],L=b/8;for(let u=0;u<x.length;u++)f[v+u]=x[u]+L;b+=h[g].length,v+=x.length}return{vertexData:d,indexData:f,groups:s,lights:[{pos:[14.2,3.1,-2.6],color:[1,.72,.45],intensity:40,range:9},{pos:[14.2,3.1,.2],color:[1,.72,.45],intensity:40,range:9},{pos:[1.5,4.4,0],color:[1,.82,.6],intensity:26,range:9},{pos:[8.6,2.55,2.8],color:[1,.68,.42],intensity:26,range:7},{pos:[-4.2,2.55,-1.15],color:[1,.75,.5],intensity:14,range:5},{pos:[-4.2,2.55,1.15],color:[1,.75,.5],intensity:14,range:5},{pos:[-11,4.15,-2.6],color:[.95,.9,.8],intensity:18,range:7},{pos:[-11,4.15,2.6],color:[.95,.9,.8],intensity:18,range:7},{pos:[-17.2,4.4,0],color:[.85,.92,1],intensity:55,range:14,spotDir:[-17.5,0,0],cosInner:.88,cosOuter:.6},{pos:[-18.5,1.95,-4.6],color:[1,.8,.55],intensity:10,range:5},{pos:[-18.5,1.95,4.6],color:[1,.8,.55],intensity:10,range:5}],shots:[{name:"Пирс",eye:[-37,2.6,.4],look:[-8,2.6,0]},{name:"Атриум",eye:[5,2.1,3.4],look:[-.5,2.4,-.6]},{name:"Бар",eye:[10.4,2,1.6],look:[14.6,1.6,-1.8]},{name:"Коридор",eye:[-6.2,1.95,0],look:[-1,1.7,.1]},{name:"Океан",eye:[-24,1.6,7.5],look:[-60,4,-4]},{name:"Обзор",eye:[27,22,25],look:[-4,.5,-1]}],waterLevel:a}}class ve{constructor(e){this.device=e}resources=new Map;pool=[];passes=[];current=null;frameIndex=0;texture(e,a){let r=this.resources.get(e);if((!r||r.desc.width!==a.width||r.desc.height!==a.height||r.desc.format!==a.format)&&(r&&r.texture&&this.retire(r.texture),r={desc:a,texture:null,view:null},this.resources.set(e,r)),!r.texture){const t=this.pool.pop()??null;t&&t.width===a.width&&t.height===a.height&&t.format===a.format?r.texture=t:(t&&this.retire(t),r.texture=this.device.createTexture({label:`rg:${e}`,size:[a.width,a.height],format:a.format,usage:a.usage})),r.view=r.texture.createView()}return r.view}persistent(e,a){return this.texture(e,a)}retire(e){this.pool.push(e),this.pool.length>24&&this.pool.shift()?.destroy()}async run(e,a,r){const t={name:e,kind:a,cpuMs:0};this.passes.push(t),this.current=t;const s=performance.now();await r(),t.cpuMs=performance.now()-s,this.current=null}beginFrame(){this.passes.length=0,this.frameIndex++}reset(e=!1){for(const a of this.resources.values())a.texture?.destroy(),a.texture=null,a.view=null;if(this.resources.clear(),!e){for(const a of this.pool)a.destroy();this.pool.length=0}}totalCpuMs(){return this.passes.reduce((e,a)=>e+a.cpuMs,0)}get dev(){return this.device}}function U(){const i=new Float32Array(16);return i[0]=i[5]=i[10]=i[15]=1,i}function xe(i){return i.fill(0),i[0]=i[5]=i[10]=i[15]=1,i}function le(i,e,a){const r=e[0],t=e[1],s=e[2],c=e[3],n=e[4],h=e[5],l=e[6],m=e[7],o=e[8],d=e[9],f=e[10],b=e[11],v=e[12],p=e[13],B=e[14],g=e[15];for(let x=0;x<4;x++){const L=a[x*4],u=a[x*4+1],P=a[x*4+2],S=a[x*4+3];i[x*4]=L*r+u*n+P*o+S*v,i[x*4+1]=L*t+u*h+P*d+S*p,i[x*4+2]=L*s+u*l+P*f+S*B,i[x*4+3]=L*c+u*m+P*b+S*g}return i}function be(i,e,a,r,t){const s=1/Math.tan(e/2);return i.fill(0),i[0]=s/a,i[5]=s,i[10]=t/(r-t),i[14]=t*r/(r-t),i[11]=-1,i}function we(i,e,a,r,t,s,c){return i.fill(0),i[0]=2/(a-e),i[5]=2/(t-r),i[10]=1/(s-c),i[12]=(e+a)/(e-a),i[13]=(t+r)/(r-t),i[14]=s/(s-c),i[15]=1,i}function fe(i,e,a,r){let t=e[0]-a[0],s=e[1]-a[1],c=e[2]-a[2],n=Math.hypot(t,s,c);n<1e-8&&(t=0,s=0,c=1,n=1),t/=n,s/=n,c/=n;let h=r[1]*c-r[2]*s,l=r[2]*t-r[0]*c,m=r[0]*s-r[1]*t;if(n=Math.hypot(h,l,m),n<1e-8){const b=Math.abs(r[2])<.9?[0,0,1]:[1,0,0];h=b[1]*c-b[2]*s,l=b[2]*t-b[0]*c,m=b[0]*s-b[1]*t,n=Math.hypot(h,l,m)}h/=n,l/=n,m/=n;const o=s*m-c*l,d=c*h-t*m,f=t*l-s*h;return i[0]=h,i[1]=o,i[2]=t,i[3]=0,i[4]=l,i[5]=d,i[6]=s,i[7]=0,i[8]=m,i[9]=f,i[10]=c,i[11]=0,i[12]=-(h*e[0]+l*e[1]+m*e[2]),i[13]=-(o*e[0]+d*e[1]+f*e[2]),i[14]=-(t*e[0]+s*e[1]+c*e[2]),i[15]=1,i}function ye(i,e){const a=e[0],r=e[1],t=e[2],s=e[3],c=e[4],n=e[5],h=e[6],l=e[7],m=e[8],o=e[9],d=e[10],f=e[11],b=e[12],v=e[13],p=e[14],B=e[15],g=a*n-r*c,x=a*h-t*c,L=a*l-s*c,u=r*h-t*n,P=r*l-s*n,S=t*l-s*h,_=m*v-o*b,y=m*p-d*b,T=m*B-f*b,C=o*p-d*v,z=o*B-f*v,A=d*B-f*p;let M=g*A-x*z+L*C+u*T-P*y+S*_;return M?(M=1/M,i[0]=(n*A-h*z+l*C)*M,i[1]=(t*z-r*A-s*C)*M,i[2]=(v*S-p*P+B*u)*M,i[3]=(d*P-o*S-f*u)*M,i[4]=(h*T-c*A-l*y)*M,i[5]=(a*A-t*T+s*y)*M,i[6]=(p*L-b*S-B*x)*M,i[7]=(m*S-d*L+f*x)*M,i[8]=(c*z-n*T+l*_)*M,i[9]=(r*T-a*z-s*_)*M,i[10]=(b*P-v*L+B*g)*M,i[11]=(o*L-m*P-f*g)*M,i[12]=(n*y-c*C-h*_)*M,i[13]=(a*C-r*y+t*_)*M,i[14]=(v*x-b*u-p*g)*M,i[15]=(m*u-o*x+d*g)*M,i):xe(i)}function Y(i,e){return[i[0]-e[0],i[1]-e[1],i[2]-e[2]]}function $(i,e){return[i[0]+e[0],i[1]+e[1],i[2]+e[2]]}function ee(i,e){return[i[0]*e,i[1]*e,i[2]*e]}function se(i,e){return[i[1]*e[2]-i[2]*e[1],i[2]*e[0]-i[0]*e[2],i[0]*e[1]-i[1]*e[0]]}function Be(i){return Math.hypot(i[0],i[1],i[2])}function j(i){const e=Be(i)||1;return[i[0]/e,i[1]/e,i[2]/e]}function ie(i,e){let a=1,r=0,t=i;for(;t>0;)a/=e,r+=a*(t%e),t=Math.floor(t/e);return r}const X=(i,e,a)=>Math.min(a,Math.max(e,i)),H=(i,e,a)=>i+(e-i)*a,Pe=(i,e,a)=>{const r=X((a-i)/(e-i),0,1);return r*r*(3-2*r)},F=i=>i*Math.PI/180;class Le{target=[0,2,0];distance=26;yaw=F(215);pitch=F(14);position=[-30,2.4,2];flyYaw=F(70);flyPitch=F(4);mode="orbit";fovY=F(52);near=.3;far=2400;view=U();proj=U();viewProj=U();invViewProj=U();prevViewProj=U();viewDir=[0,0,1];camPos=[0,0,0];hasPrev=!1;jitterEnabled=!0;jitterIdx=0;jitter=[0,0];eye(){if(this.mode==="fly")return this.position;const e=Math.cos(this.pitch);return[this.target[0]+this.distance*e*Math.cos(this.yaw),this.target[1]+this.distance*Math.sin(this.pitch),this.target[2]+this.distance*e*Math.sin(this.yaw)]}lookAtPoint(){return this.mode==="fly"?$(this.position,this.forward()):this.target}forward(){const e=Math.cos(this.flyPitch);return j([e*Math.cos(this.flyYaw),Math.sin(this.flyPitch),e*Math.sin(this.flyYaw)])}forwardOfView(){return j(Y(this.lookAtPoint(),this.eye()))}update(e){if(this.jitterEnabled){const s=(ie(this.jitterIdx%8+1,2)-.5)*2/Math.ceil(e*720),c=(ie(this.jitterIdx%8+1,3)-.5)*2/720;this.jitter=[s,c],this.jitterIdx++}else this.jitter=[0,0];const a=this.prevViewProj;this.hasPrev&&a.set(this.viewProj);const r=this.eye(),t=this.lookAtPoint();fe(this.view,r,t,[0,1,0]),be(this.proj,this.fovY,e,this.near,this.far),this.proj[2]+=this.jitter[0],this.proj[13]+=this.jitter[1],le(this.viewProj,this.proj,this.view),ye(this.invViewProj,this.viewProj),this.hasPrev||(a.set(this.viewProj),this.hasPrev=!0),this.camPos=r,this.viewDir=j(Y(t,r))}moveOrbit(e,a){this.yaw-=e*.005,this.pitch=X(this.pitch+a*.005,F(-85),F(85))}zoom(e){this.distance=X(this.distance*(e>0?1.12:.89),2.2,220)}pan(e,a){const r=this.forward(),t=j(se([0,1,0],r)),s=this.distance*.0016;this.target=$(this.target,$(ee(t,-e*s),ee([0,1,0],a*s)))}flyStep(e,a){const r=a.has("shiftleft")||a.has("shiftright")?26:7,t=this.forward(),s=j(se(t,[0,1,0])),c=[0,0,0];a.has("keyw")&&c.forEach((h,l)=>c[l]+=t[l]),a.has("keys")&&c.forEach((h,l)=>c[l]-=t[l]),a.has("keyd")&&c.forEach((h,l)=>c[l]+=s[l]),a.has("keya")&&c.forEach((h,l)=>c[l]-=s[l]),a.has("keye")&&(c[1]+=1),a.has("keyq")&&(c[1]-=1);const n=Math.hypot(...c);if(n>1e-4){const h=r*e/n;this.position=$(this.position,ee(c,h)),this.position[1]=Math.max(this.position[1],-1.5)}}animateTo(e,a){const r=a*a*(3-2*a),t=this.eye(),s=this.lookAtPoint(),c=[H(t[0],e.eye[0],r),H(t[1],e.eye[1],r),H(t[2],e.eye[2],r)],n=[H(s[0],e.look[0],r),H(s[1],e.look[1],r),H(s[2],e.look[2],r)];if(this.mode==="orbit"){this.distance=X(Math.hypot(...Y(c,e.look)),2.2,220),this.target=n;const h=Y(c,n),l=Math.hypot(h[0],h[2]);this.yaw=Math.atan2(h[2],h[0]),this.pitch=Math.atan2(h[1],l)}else{this.position=c;const h=j(Y(n,c));this.flyYaw=Math.atan2(h[2],h[0]),this.flyPitch=Math.asin(X(h[1],-1,1))}}}const oe=4,ne=[.025,.11,.32,.72,1];class Se{camData=new Float32Array(68);frameData=new Float32Array(108);cascadeData=[];lightData;sunElevation=28;sunAzimuth=245;shadowDist=70;fogScale=.9;evBias=0;cloudCover=.42;bloomStrength=.06;caAmount=.55;debugMode=0;taaOn=1;sunDir=[0,1,0];sunColor=[1,1,1];constructor(e){for(let a=0;a<oe;a++)this.cascadeData.push(new Float32Array(16));this.lightData=new Float32Array(e.length*16),this.packLights(e)}packLights(e){e.forEach((a,r)=>{const t=r*16;this.lightData[t]=a.pos[0],this.lightData[t+1]=a.pos[1],this.lightData[t+2]=a.pos[2],this.lightData[t+3]=a.range,this.lightData[t+4]=a.color[0],this.lightData[t+5]=a.color[1],this.lightData[t+6]=a.color[2],this.lightData[t+7]=a.intensity;const s=a.spotDir??[0,-1,0],c=Math.hypot(s[0],s[1],s[2])||1;this.lightData[t+8]=s[0]/c,this.lightData[t+9]=s[1]/c,this.lightData[t+10]=s[2]/c,this.lightData[t+11]=0,this.lightData[t+12]=a.cosInner??0,this.lightData[t+13]=a.cosOuter??0,this.lightData[t+14]=a.spotDir?1:0,this.lightData[t+15]=0})}updateSun(){const e=F(this.sunElevation),a=F(this.sunAzimuth);this.sunDir=[Math.cos(e)*Math.sin(a),Math.sin(e),Math.cos(e)*Math.cos(a)];const r=1-Pe(6,26,this.sunElevation);this.sunColor=[1,.965-.42*r,.925-.66*r]}pack(e,a,r,t,s,c,n,h,l,m,o,d,f,b){const v=this.camData;v.set(e.view,0),v.set(e.viewProj,16),v.set(e.invViewProj,32),v.set(e.prevViewProj,48),v[64]=e.camPos[0],v[65]=e.camPos[1],v[66]=e.camPos[2],v[67]=1;const p=this.frameData;p[0]=this.sunDir[0],p[1]=this.sunDir[1],p[2]=this.sunDir[2],p[3]=0,p[4]=this.sunColor[0]*1e5,p[5]=this.sunColor[1]*1e5,p[6]=this.sunColor[2]*1e5,p[7]=1,p[8]=.00125,p[9]=.035,p[10]=.55,p[11]=performance.now()/1e3,p[12]=a,p[13]=r,p[14]=1/a,p[15]=1/r,p[16]=e.near,p[17]=e.far,p[18]=o,p[19]=this.shadowDist;const B=ne;p[20]=B[1]*this.shadowDist,p[21]=B[2]*this.shadowDist,p[22]=B[3]*this.shadowDist,p[23]=B[4]*this.shadowDist,p[24]=l,p[25]=m,p[26]=s,p[27]=t,p[28]=this.evBias,p[29]=f,p[30]=b,p[31]=1.15,p[32]=this.cloudCover,p[33]=1,p[34]=this.fogScale,p[35]=d,p[36]=c,p[37]=n,p[38]=h,p[39]=Math.tan(e.fovY/2),p[40]=this.taaOn,p[41]=this.bloomStrength,p[42]=this.caAmount,p[43]=this.debugMode}updateCascades(e){const a=ne,r=e.invViewProj;for(let t=0;t<oe;t++){const s=a[t]*this.shadowDist,c=a[t+1]*this.shadowDist,n=[],h=B=>(e.far-e.near*e.far/B)/(e.far-e.near);for(const[B,g]of[[-1,-1],[1,-1],[1,1],[-1,1]])for(const x of[Math.max(s,e.near+.5),c]){const L=[B,g,X(h(x),0,.9999)],u=r,P=u[0]*L[0]+u[4]*L[1]+u[8]*L[2]+u[12],S=u[1]*L[0]+u[5]*L[1]+u[9]*L[2]+u[13],_=u[2]*L[0]+u[6]*L[1]+u[10]*L[2]+u[14],y=u[3]*L[0]+u[7]*L[1]+u[11]*L[2]+u[15];n.push([P/y,S/y,_/y])}let l=0,m=0,o=0;for(const B of n)l+=B[0],m+=B[1],o+=B[2];l/=8,m/=8,o/=8;let d=0;for(const B of n)d=Math.max(d,Math.hypot(B[0]-l,B[1]-m,B[2]-o));d=Math.max(d,2.5);const f=[l-this.sunDir[0]*(d+30),m-this.sunDir[1]*(d+30),o-this.sunDir[2]*(d+30)],b=U();fe(b,f,[l,m,o],[0,1,0]);const v=U();we(v,-d,d,-d,d,1,(d+30)*2+10);const p=U();le(p,v,b),this.cascadeData[t].set(p)}}cascadeTexelWorld(){return 2*this.shadowDist*.35/1024}}const O=`
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
`,_e=`
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
`,Te=`
@group(0) @binding(0) var<uniform> cascadeMat : mat4x4f;

@vertex
fn vs_shadow(@location(0) pos : vec3f, @location(1) nrm : vec3f, @location(2) uv : vec2f) -> @builtin(position) vec4f {
  return cascadeMat * vec4f(pos, 1.0);
}
`,Ce=`
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
`,Me=`
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
`,ze=`
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
`,Ee=`
struct Light {
  posRange : vec4f,
  colorI   : vec4f,
  dirSpot  : vec4f,
  params   : vec4f,
};

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

fn roughOf(gloss : f32) -> f32 {
  return clamp(1.0 - gloss, 0.045, 1.0);
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

  // --- ambient (interior vs exterior via sun visibility, AO from SSAO) ---
  let aoDims = vec2i(textureDimensions(t_ao));
  let aoPx = clamp(px >> vec2u(1), vec2i(0), aoDims - vec2i(1));
  let ao = textureLoad(t_ao, aoPx, 0).r;
  let interAmb = frame.sunColor.rgb * 0.0013 * vec3f(1.0, 0.86, 0.72);
  let ambient = mix(interAmb, skyAmbient(N, frame), saturate(sh * 1.9 + 0.06));
  color += ambient * ao * albedo * (1.0 - metallic);

  // --- emissive bulbs ---
  if (matId == 8u) {
    color += vec3f(1.0, 0.85, 0.6) * 16.0;
  }

  // --- debug modes ---
  if (frame.dbg.w > 0.5 && frame.dbg.w < 1.5) { color = albedo; }
  if (frame.dbg.w > 1.5 && frame.dbg.w < 2.5) { color = N * 0.5 + vec3f(0.5); }
  if (frame.dbg.w > 2.5) { color = vec3f(ao); }

  // --- aerial perspective ---
  color = applyFog(color, frame, world, cam.camPos.xyz, t_shadow, smpCmp);
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,te=`
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
  let g = gerstner(pos.xz, frame.fog.w, fade);
  let world = pos + g.disp;
  var o : OceanVOut;
  o.world = world;
  o.normal = normalize(cross(g.T, g.B));
  o.foam = saturate((0.78 - g.J) * 2.2) * fade;
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

  // refraction with depth-aware offset
  var ruv = uv + N.xz * saturate(3.5 / (viewDist * 0.1 + 1.0)) * 0.055;
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

  // underwater: shift toward deep scatter
  if (underwater) {
    let deep = vec3f(0.008, 0.05, 0.07) * frame.extra.w * 0.5;
    color = mix(deep, color, exp(-viewDist * 0.055));
  }
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,De=`
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
`,ce=`
@fragment
fn fs_ocean() -> @location(0) vec4f {
  return vec4f(0.05, 0.20, 0.30, 1.0);
}
`,Ae=`
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
`,Oe=`
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
    stats.ev = mix(stats.ev, evTarget, 1.0 - exp(-dt * 1.6));
    stats.avg = avg;
  }
  atomicStore(&stats.hist[i], 0u);
}
`,Ge=`
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
`,Re=`
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
  // subtle warm grade (stand-in for 32^3 LUT from M3)
  c *= vec3f(1.02, 0.995, 0.965);
  c = acesFilm(c);

  // vignette
  c *= 1.0 - smoothstep(0.45, 0.92, d) * 0.30;

  // film grain (luminance-adaptive)
  let g = hash21(in.clip.xy + vec2f(frame.fog.w * 137.0, frame.fog.w * 41.0)) - 0.5;
  let l = dot(c, vec3f(0.2126, 0.7152, 0.0722));
  c += g * 0.028 * (1.0 - clamp(l, 0.0, 1.0));

  // gamma encode (canvas format is linear unorm)
  c = pow(max(c, vec3f(0.0)), vec3f(1.0 / 2.2));
  return vec4f(c, 1.0);
}
`,J=[{name:"Performant",shadowAtlas:1024,ssao:!1,taa:!1,oceanNear:96,oceanFar:48},{name:"Balanced",shadowAtlas:2048,ssao:!0,taa:!1,oceanNear:160,oceanFar:72},{name:"High",shadowAtlas:4096,ssao:!0,taa:!0,oceanNear:224,oceanFar:88}],K=6,Ie=24;class Fe{graph;camera=new Le;uniforms;tierIndex=2;toggles={ssao:!0,taa:!0,bloom:!0,ocean:!0};lastFrameCpuMs=0;dev;canvasPrivate;ctx;scene;sceneVB;sceneIB;camBuf;frameBuf;cascadeBuf=[];lightsBuf;statsBuf;meshConstBufs=[];whiteTex;blackTex;oceanNearVB;oceanNearIB;oceanNearCount=0;oceanFarVB;oceanFarIB;oceanFarCount=0;pShadow;pGbuffer;pCull;pSsao;pBlur;pLighting;pTaa;pOcean;pExpAccum;pExpFinal;pBloomPre;pBloomDown;pBloomUp;pTonemap;bglGlobal;bglMesh;bglCull;bglSsao;bglBlur;bglLighting;bglOcean;bglTaa;bglExp;bglBloom0;bglBloom1;bglTonemap;gridCountsBuf;gridIndicesBuf;destBufs=[];bgGlobal;bgCascade=[];bgMesh=[];bgCull;bgSsao;bgBlur;bgLightingAo;bgLightingWhite;bgOcean;bgTaa;bgExp;bgTonemapBloom;bgTonemapBlack;bgBloom=[];bloomPasses=[];shadowView;g0View;g1View;g2View;depthView;hdrAView;hdrBView;hdrCView;historyView;bloomViews=[];aoHalfView;aoHalf2View;whiteView;blackView;W=0;H=0;atlas=2048;zerobuffer=new Uint32Array(0);constructor(e,a){this.ctx=e,this.dev=e.device,this.canvasPrivate=e.canvas,this.graph=new ve(this.dev),this.scene=a,this.uniforms=new Se(a.lights)}put(e,a,r=0){this.dev.queue.writeBuffer(e,r,a)}get tier(){return J[this.tierIndex]}get canvas(){return this.canvasPrivate}adapterNameShort(){const e=this.ctx.adapterName;return e.length>46?e.slice(0,44)+"…":e}async init(){const e=this.dev;this.uniforms.updateSun(),this.sceneVB=e.createBuffer({size:this.scene.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneVB,this.scene.vertexData),this.sceneIB=e.createBuffer({size:this.scene.indexData.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneIB,this.scene.indexData),this.camBuf=e.createBuffer({size:272,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.frameBuf=e.createBuffer({size:432,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});for(let r=0;r<4;r++){const t=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.cascadeBuf.push(t),this.bgCascade.push(e.createBindGroup({layout:this.bglMeshAfter(),entries:[{binding:0,resource:{buffer:t}}]}))}const a=this.scene.lights.length*64;this.lightsBuf=e.createBuffer({size:a,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.lightsBuf,this.uniforms.lightData),this.statsBuf=e.createBuffer({size:272,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.statsBuf,new Float32Array([-10,.02,0]),256);for(const r of this.scene.groups){const t=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(t,new Float32Array([r.matId,0,0,0])),this.meshConstBufs.push(t)}this.whiteTex=e.createTexture({size:[4,4],format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.whiteTex},new Uint8Array(16).fill(255),{bytesPerRow:4,rowsPerImage:4},[4,4]),this.blackTex=e.createTexture({size:[4,4],format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.blackTex},new Float32Array(64),{bytesPerRow:32,rowsPerImage:4},[4,4]),this.whiteView=this.whiteTex.createView(),this.blackView=this.blackTex.createView(),this.createPipelines();for(const r of this.scene.groups)this.bgMesh.push(e.createBindGroup({layout:this.bglMesh,entries:[{binding:0,resource:{buffer:this.meshConstBufs[this.bgMesh.length]}}]}));this.rebuildOcean()}bglMeshAfter(){return this.bglMesh||(this.bglMesh=this.dev.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})),this.bglMesh}rebuildOcean(){const e=this.dev,a=Number(new URLSearchParams(location.search).get("oceansize")??0),r=a>0?a:this.tier.oceanNear;this.oceanNearVB?.destroy(),this.oceanNearIB?.destroy(),this.oceanFarVB?.destroy(),this.oceanFarIB?.destroy();const t=this.makeGrid(r,380,-14,0,0),s=this.makeDisk(Math.max(this.tier.oceanFar>>1,24),Math.max(this.tier.oceanFar*2,96),1500,-14,0,-.35);this.oceanNearVB=e.createBuffer({size:t.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearVB,t.pos),this.oceanNearIB=e.createBuffer({size:t.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearIB,t.idx),this.oceanNearCount=t.idx.length,this.oceanFarVB=e.createBuffer({size:s.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarVB,s.pos),this.oceanFarIB=e.createBuffer({size:s.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarIB,s.idx),this.oceanFarCount=s.idx.length}makeDisk(e,a,r,t,s,c){const n=new Float32Array((e+1)*a*3);for(let m=0;m<=e;m++){const o=m/e*r;for(let d=0;d<a;d++){const f=d/a*Math.PI*2,b=(m*a+d)*3;n[b]=t+Math.cos(f)*o,n[b+1]=c,n[b+2]=s+Math.sin(f)*o}}const h=new Uint32Array(e*a*6);let l=0;for(let m=0;m<e;m++)for(let o=0;o<a;o++){const d=(o+1)%a,f=m*a+o,b=(m+1)*a+o;h[l++]=f,h[l++]=b,h[l++]=b+d-o,h[l++]=f,h[l++]=b+d-o,h[l++]=f+(d-o)}return{pos:n,idx:h}}makeGrid(e,a,r,t,s){const c=new Float32Array(e*e*3),n=a/(e-1);for(let o=0;o<e;o++)for(let d=0;d<e;d++){const f=(o*e+d)*3;c[f]=r-a/2+d*n,c[f+1]=s,c[f+2]=t-a/2+o*n}const h=(e-1)*(e-1),l=new Uint32Array(h*6);let m=0;for(let o=0;o<e-1;o++)for(let d=0;d<e-1;d++){const f=o*e+d;l[m++]=f,l[m++]=f+e,l[m++]=f+e+1,l[m++]=f,l[m++]=f+e+1,l[m++]=f+1}return{pos:c,idx:l}}createPipelines(){const e=this.dev,a=this.module(O+_e),r=this.module(O+Te),t=this.module(O+Ce),s=this.module(O+Me),c=this.module(O+ze),n=this.module(O+Ee),h=new URLSearchParams(location.search).get("ocean")??"full";let l;if(h==="flat")l=O+De+ce;else if(h==="constfs"){const T=te.indexOf("@fragment");l=O+te.slice(0,T)+ce}else l=O+te;const m=this.module(l),o=this.module(O+Ae),d=this.module(O+Oe),f=this.module(O+Ge),b=this.module(O+Re),v=GPUShaderStage.FRAGMENT,p=GPUShaderStage.VERTEX,B=GPUShaderStage.COMPUTE,g={sampleType:"float"};this.bglGlobal=e.createBindGroupLayout({entries:[{binding:0,visibility:p|v,buffer:{type:"uniform"}},{binding:1,visibility:p|v,buffer:{type:"uniform"}},{binding:2,visibility:v,texture:{sampleType:"depth"}},{binding:3,visibility:v,sampler:{type:"comparison"}}]}),this.bglCull=e.createBindGroupLayout({entries:[{binding:0,visibility:B,buffer:{type:"read-only-storage"}},{binding:1,visibility:B,buffer:{type:"storage"}},{binding:2,visibility:B,buffer:{type:"storage"}},{binding:3,visibility:B,texture:{sampleType:"depth"}},{binding:4,visibility:B,buffer:{type:"uniform"}},{binding:5,visibility:B,buffer:{type:"uniform"}}]}),this.bglSsao=e.createBindGroupLayout({entries:[{binding:0,visibility:v,texture:{sampleType:"depth"}},{binding:1,visibility:v,texture:g}]}),this.bglBlur=e.createBindGroupLayout({entries:[{binding:0,visibility:v,texture:g},{binding:1,visibility:v,sampler:{type:"filtering"}}]}),this.bglLighting=e.createBindGroupLayout({entries:[{binding:0,visibility:v,texture:g},{binding:1,visibility:v,texture:g},{binding:2,visibility:v,texture:g},{binding:3,visibility:v,texture:{sampleType:"depth"}},{binding:4,visibility:v,texture:g},{binding:5,visibility:v,buffer:{type:"read-only-storage"}},{binding:6,visibility:v,buffer:{type:"read-only-storage"}},{binding:7,visibility:v,buffer:{type:"read-only-storage"}}]}),this.bglOcean=e.createBindGroupLayout({entries:[{binding:0,visibility:v,texture:g},{binding:1,visibility:v,texture:{sampleType:"depth"}},{binding:2,visibility:v,sampler:{type:"filtering"}}]}),this.bglTaa=e.createBindGroupLayout({entries:[{binding:0,visibility:v,texture:g},{binding:1,visibility:v,texture:g},{binding:2,visibility:v,texture:{sampleType:"depth"}},{binding:3,visibility:v,sampler:{type:"filtering"}}]}),this.bglExp=e.createBindGroupLayout({entries:[{binding:0,visibility:B,texture:g},{binding:1,visibility:B,buffer:{type:"storage"}},{binding:2,visibility:B,buffer:{type:"uniform"}}]}),this.bglBloom0=e.createBindGroupLayout({entries:[{binding:0,visibility:v,buffer:{type:"uniform"}},{binding:1,visibility:v,buffer:{type:"uniform"}}]}),this.bglBloom1=e.createBindGroupLayout({entries:[{binding:0,visibility:v,texture:g},{binding:1,visibility:v,sampler:{type:"filtering"}},{binding:2,visibility:v,buffer:{type:"read-only-storage"}}]}),this.bglTonemap=e.createBindGroupLayout({entries:[{binding:0,visibility:v,texture:g},{binding:1,visibility:v,texture:g},{binding:2,visibility:v,buffer:{type:"read-only-storage"}},{binding:3,visibility:v,sampler:{type:"filtering"}}]}),this.bglMeshAfter();const x={arrayStride:32,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]},L={arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},u=(T,C,z)=>({module:T,entryPoint:C,targets:z}),P=T=>({vertex:{module:T,entryPoint:"vs_fs"}});this.pShadow=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglMesh]}),vertex:{module:r,entryPoint:"vs_shadow",buffers:[x]},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.pGbuffer=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglMesh]}),vertex:{module:a,entryPoint:"vs_mesh",buffers:[x]},fragment:u(a,"fs_gbuffer",[{format:"rgba8unorm"},{format:"rgba16float"},{format:"rgba8unorm"}]),depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{cullMode:"back"}}),this.pCull=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglCull]}),compute:{module:t,entryPoint:"cullMain"}}),this.pSsao=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsao]}),...P(s),fragment:u(s,"fs_ssao",[{format:"r8unorm"}])}),this.pBlur=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglBlur]}),...P(c),fragment:u(c,"fs_aoBlur",[{format:"r8unorm"}])}),this.pLighting=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglLighting]}),...P(n),fragment:u(n,"fs_lighting",[{format:"rgba16float"}])}),this.pTaa=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTaa]}),...P(o),fragment:u(o,"fs_taa",[{format:"rgba16float"}])});const S=new URLSearchParams(location.search).get("odepth")==="0",_=new URLSearchParams(location.search).get("obgl")==="0";this.pOcean=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:_?[this.bglGlobal]:[this.bglGlobal,this.bglOcean]}),vertex:{module:m,entryPoint:"vs_ocean",buffers:[L]},fragment:u(m,"fs_ocean",[{format:"rgba16float"}]),...S?{}:{depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"}},primitive:{cullMode:"none"}}),this.pExpAccum=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:d,entryPoint:"expAccum"}}),this.pExpFinal=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:d,entryPoint:"expFinal"}});const y={color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}};this.pBloomPre=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...P(f),fragment:u(f,"fs_bloomPrefilter",[{format:"rgba16float"}])}),this.pBloomDown=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...P(f),fragment:u(f,"fs_bloomDown",[{format:"rgba16float"}])}),this.pBloomUp=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...P(f),fragment:u(f,"fs_bloomUp",[{format:"rgba16float",blend:y}])}),this.pTonemap=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTonemap]}),...P(b),fragment:u(b,"fs_tonemap",[{format:this.ctx.format}])})}module(e){return this.dev.createShaderModule({code:e})}setTier(e){this.tierIndex=Math.max(0,Math.min(J.length-1,e)),this.toggles.taa=this.tier.taa,this.toggles.ssao=this.tier.ssao,this.rebuildOcean(),this.W=0,this.rebuildTargets()}resize(){this.W=0,this.rebuildTargets()}rebuildTargets(){const e=this.dev,a=Math.min(window.devicePixelRatio||1,2),r=Math.max(2,Math.floor(this.canvas.clientWidth*a)),t=Math.max(2,Math.floor(this.canvas.clientHeight*a));if(r===this.W&&t===this.H)return;this.W=r,this.H=t,this.canvas.width=r,this.canvas.height=t,this.graph.reset(!0);const s=GPUTextureUsage.RENDER_ATTACHMENT,c=GPUTextureUsage.TEXTURE_BINDING,n=GPUTextureUsage.COPY_SRC,h=GPUTextureUsage.COPY_DST,l=s|c|n|h,m=Math.ceil(r/2),o=Math.ceil(t/2);this.atlas=Math.min(this.tier.shadowAtlas,this.ctx.maxTextureDim),this.g0View=this.graph.texture("g0",{width:r,height:t,format:"rgba8unorm",usage:l}),this.g1View=this.graph.texture("g1",{width:r,height:t,format:"rgba16float",usage:l}),this.g2View=this.graph.texture("g2",{width:r,height:t,format:"rgba8unorm",usage:l}),this.depthView=this.graph.texture("depth",{width:r,height:t,format:"depth32float",usage:l}),this.hdrAView=this.graph.texture("hdrA",{width:r,height:t,format:"rgba16float",usage:l}),this.hdrBView=this.graph.texture("hdrB",{width:r,height:t,format:"rgba16float",usage:l}),this.hdrCView=this.graph.texture("hdrC",{width:r,height:t,format:"rgba16float",usage:l}),this.historyView=this.graph.texture("history",{width:r,height:t,format:"rgba16float",usage:c|GPUTextureUsage.COPY_DST|n}),this.shadowView=this.graph.texture("shadowAtlas",{width:this.atlas,height:this.atlas,format:"depth24plus",usage:l}),this.aoHalfView=this.graph.texture("aoHalf",{width:m,height:o,format:"r8unorm",usage:l}),this.aoHalf2View=this.graph.texture("aoHalf2",{width:m,height:o,format:"r8unorm",usage:l}),this.bloomViews=[];let d=m,f=o;for(let x=0;x<K;x++){const L=this.graph.texture(`bloom${x}`,{width:Math.max(d,2),height:Math.max(f,2),format:"rgba16float",usage:l});this.bloomViews.push(L),d=Math.max(d>>1,2),f=Math.max(f>>1,2)}const b=Math.ceil(r/16),v=Math.ceil(t/16);this.gridCountsBuf?.destroy(),this.gridIndicesBuf?.destroy(),this.gridCountsBuf=e.createBuffer({size:b*v*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.gridIndicesBuf=e.createBuffer({size:b*v*Ie*4,usage:GPUBufferUsage.STORAGE}),this.zerobuffer=new Uint32Array(b*v);for(const x of this.destBufs)x.destroy();this.destBufs=[],d=m,f=o;for(let x=0;x<K;x++){const L=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(L,new Float32Array([d,f,1/d,1/f])),this.destBufs.push(L),d=Math.max(d>>1,2),f=Math.max(f>>1,2)}const p=e.createSampler({magFilter:"linear",minFilter:"linear"});this.bgGlobal=e.createBindGroup({layout:this.bglGlobal,entries:[{binding:0,resource:{buffer:this.camBuf}},{binding:1,resource:{buffer:this.frameBuf}},{binding:2,resource:this.shadowView},{binding:3,resource:e.createSampler({compare:"less"})}]}),this.bgCull=e.createBindGroup({layout:this.bglCull,entries:[{binding:0,resource:{buffer:this.lightsBuf}},{binding:1,resource:{buffer:this.gridCountsBuf}},{binding:2,resource:{buffer:this.gridIndicesBuf}},{binding:3,resource:this.depthView},{binding:4,resource:{buffer:this.camBuf}},{binding:5,resource:{buffer:this.frameBuf}}]}),this.bgSsao=e.createBindGroup({layout:this.bglSsao,entries:[{binding:0,resource:this.depthView},{binding:1,resource:this.g1View}]}),this.bgBlur=e.createBindGroup({layout:this.bglBlur,entries:[{binding:0,resource:this.aoHalfView},{binding:1,resource:p}]});const B=x=>[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:x},{binding:5,resource:{buffer:this.lightsBuf}},{binding:6,resource:{buffer:this.gridCountsBuf}},{binding:7,resource:{buffer:this.gridIndicesBuf}}];this.bgLightingAo=e.createBindGroup({layout:this.bglLighting,entries:B(this.aoHalf2View)}),this.bgLightingWhite=e.createBindGroup({layout:this.bglLighting,entries:B(this.whiteView)}),this.bgOcean=e.createBindGroup({layout:this.bglOcean,entries:[{binding:0,resource:this.hdrBView},{binding:1,resource:this.depthView},{binding:2,resource:p}]}),this.bgTaa=e.createBindGroup({layout:this.bglTaa,entries:[{binding:0,resource:this.hdrAView},{binding:1,resource:this.historyView},{binding:2,resource:this.depthView},{binding:3,resource:p}]}),this.bgExp=e.createBindGroup({layout:this.bglExp,entries:[{binding:0,resource:this.hdrCView},{binding:1,resource:{buffer:this.statsBuf}},{binding:2,resource:{buffer:this.frameBuf}}]}),this.bloomPasses=[],this.bgBloom=[],this.bloomPasses.push({kind:"pre",src:this.hdrCView,dst:this.bloomViews[0],mip:0});for(let x=1;x<K;x++)this.bloomPasses.push({kind:"down",src:this.bloomViews[x-1],dst:this.bloomViews[x],mip:x});for(let x=K-2;x>=0;x--)this.bloomPasses.push({kind:"up",src:this.bloomViews[x+1],dst:this.bloomViews[x],mip:x});this.bloomPasses.forEach(x=>{const L=e.createBindGroup({layout:this.bglBloom0,entries:[{binding:0,resource:{buffer:this.frameBuf}},{binding:1,resource:{buffer:this.destBufs[x.mip]}}]}),u=e.createBindGroup({layout:this.bglBloom1,entries:[{binding:0,resource:x.src},{binding:1,resource:p},{binding:2,resource:{buffer:this.statsBuf}}]});this.bgBloom.push([L,u])});const g=x=>[{binding:0,resource:this.hdrCView},{binding:1,resource:x},{binding:2,resource:{buffer:this.statsBuf}},{binding:3,resource:p}];this.bgTonemapBloom=e.createBindGroup({layout:this.bglTonemap,entries:g(this.bloomViews[0])}),this.bgTonemapBlack=e.createBindGroup({layout:this.bglTonemap,entries:g(this.blackView)})}passFilter=null;want(e){return!this.passFilter||this.passFilter.has(e)}render(e){const a=this.dev,r=performance.now(),t=this.W,s=this.H;if(t<4||s<4)return;this.graph.beginFrame();const c=this.camera;c.jitterEnabled=this.toggles.taa,this.uniforms.taaOn=this.toggles.taa?1:0,c.update(t/s),this.uniforms.updateSun(),this.uniforms.updateCascades(c);const n=Math.ceil(t/16),h=Math.ceil(s/16);this.uniforms.pack(c,t,s,e/1e3,this.scene.lights.length,this.uniforms.cascadeTexelWorld(),1/this.atlas,1.6,n,h,this.scene.waterLevel,4200,-22,2),this.put(this.camBuf,this.uniforms.camData),this.put(this.frameBuf,this.uniforms.frameData);for(let o=0;o<4;o++)this.put(this.cascadeBuf[o],this.uniforms.cascadeData[o]);this.put(this.gridCountsBuf,this.zerobuffer);const l=a.createCommandEncoder();if(this.want("shadow")){const o=l.beginRenderPass({colorAttachments:[],depthStencilAttachment:{view:this.shadowView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});o.setPipeline(this.pShadow),o.setVertexBuffer(0,this.sceneVB),o.setIndexBuffer(this.sceneIB,"uint32");const d=this.atlas/2;for(let f=0;f<4;f++){o.setViewport((f&1)*d,(f>>1)*d,d,d,0,1),o.setScissorRect((f&1)*d,(f>>1)*d,d,d),o.setBindGroup(0,this.bgCascade[f]);for(const b of this.scene.groups)o.drawIndexed(b.count,1,b.firstIndex)}o.end()}if(this.want("gbuffer")){const o=l.beginRenderPass({colorAttachments:[{view:this.g0View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g1View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g2View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});o.setPipeline(this.pGbuffer),o.setBindGroup(0,this.bgGlobal),o.setVertexBuffer(0,this.sceneVB),o.setIndexBuffer(this.sceneIB,"uint32"),this.scene.groups.forEach((d,f)=>{o.setBindGroup(1,this.bgMesh[f]),o.drawIndexed(d.count,1,d.firstIndex)}),o.end()}if(this.want("cull")){const o=l.beginComputePass();o.setPipeline(this.pCull),o.setBindGroup(0,this.bgCull),o.dispatchWorkgroups(n,h),o.end()}const m=this.want("ssao")&&this.toggles.ssao&&this.tier.ssao;if(m){const o=Math.ceil(t/2),d=Math.ceil(s/2),f=l.beginRenderPass({colorAttachments:[{view:this.aoHalfView,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});f.setPipeline(this.pSsao),f.setBindGroup(0,this.bgGlobal),f.setBindGroup(1,this.bgSsao),f.setViewport(0,0,o,d,0,1),f.draw(3),f.end();const b=l.beginRenderPass({colorAttachments:[{view:this.aoHalf2View,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});b.setPipeline(this.pBlur),b.setBindGroup(0,this.bgGlobal),b.setBindGroup(1,this.bgBlur),b.setViewport(0,0,o,d,0,1),b.draw(3),b.end()}if(this.want("lighting")){const o=l.beginRenderPass({colorAttachments:[{view:this.hdrAView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});o.setPipeline(this.pLighting),o.setBindGroup(0,this.bgGlobal),o.setBindGroup(1,m?this.bgLightingAo:this.bgLightingWhite),o.draw(3),o.end()}if(this.want("taa")){const o=l.beginRenderPass({colorAttachments:[{view:this.hdrBView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});o.setPipeline(this.pTaa),o.setBindGroup(0,this.bgGlobal),o.setBindGroup(1,this.bgTaa),o.draw(3),o.end(),l.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("history")},[t,s,1])}if(l.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("hdrC")},[t,s,1]),this.want("ocean")&&this.toggles.ocean){const o=new URLSearchParams(location.search).get("odepth")==="0",d=new URLSearchParams(location.search).get("oload")!=="clear",f=l.beginRenderPass({colorAttachments:[{view:this.hdrCView,loadOp:d?"load":"clear",clearValue:{r:0,g:0,b:0,a:1},storeOp:"store"}],...o?{}:{depthStencilAttachment:{view:this.depthView,depthReadOnly:!0}}});f.setPipeline(this.pOcean),f.setBindGroup(0,this.bgGlobal),new URLSearchParams(location.search).get("obgl")!=="0"&&f.setBindGroup(1,this.bgOcean),f.setVertexBuffer(0,this.oceanNearVB),f.setIndexBuffer(this.oceanNearIB,"uint32"),f.drawIndexed(this.oceanNearCount),new URLSearchParams(location.search).get("ofar")!=="0"&&(f.setVertexBuffer(0,this.oceanFarVB),f.setIndexBuffer(this.oceanFarIB,"uint32"),f.drawIndexed(this.oceanFarCount)),f.end()}if(this.want("exposure")){const o=l.beginComputePass();o.setPipeline(this.pExpAccum),o.setBindGroup(0,this.bgExp),o.dispatchWorkgroups(Math.ceil(t/4/8),Math.ceil(s/4/8)),o.setPipeline(this.pExpFinal),o.dispatchWorkgroups(1,1,1),o.end()}if(this.want("bloom")&&this.toggles.bloom&&this.bloomPasses.forEach((o,d)=>{const f=o.kind==="pre"?this.pBloomPre:o.kind==="down"?this.pBloomDown:this.pBloomUp,b=Math.max(Math.ceil(t/2)>>o.mip,2),v=Math.max(Math.ceil(s/2)>>o.mip,2),p=l.beginRenderPass({colorAttachments:[{view:o.dst,clearValue:{r:0,g:0,b:0,a:1},loadOp:o.kind==="up"?"load":"clear",storeOp:"store"}]});p.setPipeline(f),p.setBindGroup(0,this.bgBloom[d][0]),p.setBindGroup(1,this.bgBloom[d][1]),p.setViewport(0,0,b,v,0,1),p.draw(3),p.end()}),this.want("tonemap")){const d=new URLSearchParams(location.search).get("ttex")==="1"?this.graph.texture("tonemapTex",{width:t,height:s,format:this.ctx.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}):this.ctx.context.getCurrentTexture().createView(),f=l.beginRenderPass({colorAttachments:[{view:d,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});f.setPipeline(this.pTonemap),f.setBindGroup(0,this.bgGlobal),f.setBindGroup(1,this.toggles.bloom?this.bgTonemapBloom:this.bgTonemapBlack),f.setViewport(0,0,t,s,0,1),f.draw(3),f.end()}a.queue.submit([l.finish()]),this.lastFrameCpuMs=performance.now()-r,window.__FRAME_N__=window.__FRAME_N__===void 0?performance.now()/1e3:window.__FRAME_N__}async debugSnapshot(e,a,r=0,t=0){const s=this.dev,c=Math.min(e??this.W,this.W),n=Math.min(a??this.H,this.H),h=this.graphTexture("tonemapTex"),l=Math.ceil(c*4/256)*256,m=s.createBuffer({size:l*n,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),o=s.createCommandEncoder();o.copyTextureToBuffer({texture:h,origin:[r,t,0]},{buffer:m,bytesPerRow:l,rowsPerImage:n},[c,n,1]),s.queue.submit([o.finish()]),await m.mapAsync(GPUMapMode.READ);const d=new Uint8Array(m.getMappedRange()),f=new Uint8Array(c*n*4);for(let b=0;b<n;b++)for(let v=0;v<c;v++){const p=b*l+v*4,B=b*c*4+v*4;f[B]=d[p+2],f[B+1]=d[p+1],f[B+2]=d[p],f[B+3]=255}return m.unmap(),m.destroy(),{w:c,h:n,rgba:f}}async debugRow(e,a,r,t,s=16){const c=this.dev,n=[];for(let p=r;p<=t;p+=s)n.push(Math.min(p,this.W-1));const h=n.length,l=256,m=this.graphTexture(e),o=c.createBuffer({size:l*h,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),d=c.createCommandEncoder();n.forEach((p,B)=>{d.copyTextureToBuffer({texture:m,origin:[p,Math.min(a,this.H-1),0]},{buffer:o,offset:B*l,bytesPerRow:l,rowsPerImage:1},[1,1,1])}),c.queue.submit([d.finish()]),await o.mapAsync(GPUMapMode.READ);const f=new Uint8Array(o.getMappedRange()),b=(p,B)=>{const g=p|B<<8,x=(g&32768)>>15,L=(g&31744)>>10,u=g&1023;let P;return L===0?P=u*2**-24:L===31?P=u?NaN:1/0:P=(1+u/1024)*2**(L-15),(x?-1:1)*P},v={x:n};for(let p=0;p<h;p++){const B=p*l;v[`p${p}`]=[b(f[B],f[B+1]),b(f[B+2],f[B+3])]}return o.unmap(),o.destroy(),v}async debugSample(){const e=this.dev,a=this.W,r=this.H,t=[["g0",this.graphTexture("g0"),a>>1,r>>1,"all"],["hdrC",this.graphTexture("hdrA"),a>>1,r>>1,"all"],["hdrCsky",this.graphTexture("hdrA"),a>>1,Math.max(2,r*.12|0),"all"]],s=e.createCommandEncoder(),c={};for(const[h,l,m,o,d]of t)c[h]=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),s.copyTextureToBuffer({texture:l,origin:[m,o,0],aspect:d},{buffer:c[h],bytesPerRow:256,rowsPerImage:1},[1,1,1]);e.queue.submit([s.finish()]);const n={};for(const[h]of t){await c[h].mapAsync(GPUMapMode.READ);const l=new Uint8Array(c[h].getMappedRange());n[h]=Array.from(l.slice(0,8)),c[h].unmap(),c[h].destroy()}return n}graphTexture(e){const a=this.graph.resources.get(e);if(!a||!a.texture)throw new Error(`graph texture ${e} missing`);return a.texture}}function Ve(i,e,a,r){const t=y=>document.getElementById(y),c=[...t("tier-seg").querySelectorAll("button")],n=()=>{c.forEach(y=>y.classList.toggle("active",Number(y.dataset.tier)===i.tierIndex)),t("hud-tier").textContent=`tier · ${J[i.tierIndex].name}`};c.forEach(y=>y.addEventListener("click",()=>{i.setTier(Number(y.dataset.tier)),t("tg-ssao").checked=i.toggles.ssao,t("tg-taa").checked=i.toggles.taa,n()})),n();const h=(y,T,C,z)=>{const A=t(y),M=t(T),V=()=>{const N=Number(A.value);z(N),M.textContent=C(N)};A.addEventListener("input",V),V()};h("sun-el","val-sun-el",y=>`${y}°`,y=>{i.uniforms.sunElevation=y}),h("sun-az","val-sun-az",y=>`${y}°`,y=>{i.uniforms.sunAzimuth=y}),h("ev-bias","val-ev",y=>y.toFixed(1),y=>{i.uniforms.evBias=y}),h("fog-dens","val-fog",y=>y.toFixed(2),y=>{i.uniforms.fogScale=y});const l=(y,T)=>{const C=t(y);C.checked=i.toggles[T],C.addEventListener("change",()=>{i.toggles[T]=C.checked})};l("tg-ssao","ssao"),l("tg-taa","taa"),l("tg-bloom","bloom"),l("tg-ocean","ocean");const m=t("tg-wire");m.addEventListener("change",()=>{i.uniforms.debugMode=m.checked?1:0});const o=t("shots");i.uniforms;const d=i.camera,f=window.__SHOTS__??[];let b=-1,v={eye:[0,0,0],look:[0,0,0]};window.__CAM_ANIM__=(y,T)=>{v=T,b=0},f.forEach((y,T)=>{const C=document.createElement("button");C.textContent=`${T+1}. ${y.name}`,C.title=`Точка съёмки ${T+1}`,C.addEventListener("click",()=>{document.exitPointerLock?.();const z={eye:d.eye(),look:d.lookAtPoint()};window.__CAM_ANIM__?.(z,{eye:y.eye,look:y.look})}),o.appendChild(C)}),window.__CAM_TICK__=y=>{b<0||(b=Math.min(b+y/1.4,1),d.animateTo(v,b),b>=1&&(b=-1))};const p=t("btn-fly"),B=()=>{p.textContent=r()?"Орбитальный режим":"Свободный полёт"};p.addEventListener("click",()=>{if(r())document.exitPointerLock?.();else{d.position=d.eye();const y=d.forwardOfView();d.flyYaw=Math.atan2(y[2],y[0]),d.flyPitch=Math.asin(Math.max(-1,Math.min(1,y[1]))),d.mode="fly",i.canvas.requestPointerLock?.()}B()}),document.addEventListener("pointerlockchange",()=>{!r()&&d.mode==="fly"&&(d.mode="orbit"),B()});const g=t("hud-panel"),x=t("hud-toggle"),L=y=>{g.classList.toggle("collapsed",y),x.style.display=y?"block":"none"};x.addEventListener("click",()=>L(!1)),document.addEventListener("keydown",y=>{(y.key==="h"||y.key==="H")&&L(!g.classList.contains("collapsed"))});const u=t("fps-graph"),P=u.getContext("2d"),S=[];let _=16.6;window.__FPS_TICK__=y=>{_=_*.9+y*.1,S.push(y),S.length>110&&S.shift(),P.clearRect(0,0,u.width,u.height),P.strokeStyle="rgba(242,106,27,0.35)",P.beginPath(),P.moveTo(0,u.height-16.6/40*u.height),P.lineTo(u.width,u.height-16.6/40*u.height),P.stroke(),P.strokeStyle="#F26A1B",P.beginPath(),S.forEach((T,C)=>{const z=C/109*u.width,A=u.height-Math.min(T/40,1)*u.height;C===0?P.moveTo(z,A):P.lineTo(z,A)}),P.stroke(),t("hud-fps").textContent=`${(1e3/Math.max(_,.01)).toFixed(0)} fps · ${_.toFixed(1)} ms`},e.adapter.textContent=i.adapterNameShort()}const Ue=document.getElementById("boot"),Ne=document.getElementById("boot-status"),ke=document.getElementById("boot-bar-fill"),Q=document.getElementById("boot-detail"),We=document.getElementById("hud");function k(i,e=-1,a=""){Ne.textContent=i,e>=0&&(ke.style.width=`${Math.round(e*100)}%`),a&&(Q.textContent+=(Q.textContent?`
`:"")+a)}function re(i,e){k("Не удалось запустить WebGPU",1);const a=[i,"",e];Q.textContent=a.join(`
`),Q.style.color="#d89a55",window.__wgpu={status:"unsupported",error:i}}async function je(){const i=document.getElementById("gpu");k("Запрос GPU-адаптера…",.1);let e;try{e=await he(i)}catch(u){re(String(u.message??u),["Поддержка WebGPU:","· Chrome / Edge 113+ (Windows, macOS, ChromeOS)","· Firefox 141+ (Windows)","· Safari 26+ (macOS, iOS)","","Если браузер поддерживает — включите флаг или проверьте, что аппаратное ускорение активно."].join(`
`));return}k("Компиляция пайплайнов…",.35,`адаптер: ${e.adapterName}`),console.log(`[boot] device ok @${(performance.now()/1e3).toFixed(2)}s`),k("…",.4,`лимиты: maxTex2D=${e.limits.maxTextureDimension2D} storage=${(e.limits.maxStorageBufferBindingSize/(1<<20)).toFixed(0)} МБ`),me(e.device,u=>{console.error("[gpu]",u),window.__wgpu={status:"error",error:u},k("Ошибка GPU",-1,u)}),console.log(`[boot] pre-scene @${(performance.now()/1e3).toFixed(2)}s`);const a=ge();window.__SHOTS__=a.shots,console.log(`[boot] scene built @${(performance.now()/1e3).toFixed(2)}s`),window.__DEBUG__={groups:a.groups.map(u=>({matId:u.matId,tris:u.count/3})),verts:a.vertexData.length/8,tris:a.indexData.length/3,lights:a.lights.length};const r=new Fe(e,a);try{await r.init()}catch(u){console.error(u),re(`Инициализация рендерера: ${String(u.message??u)}`,"Смотрите консоль (F12) для деталей.");return}const t=new URLSearchParams(location.search),s=t.get("tier"),c=t.get("only");if(c&&(r.passFilter=new Set(c.split(",").map(u=>u.trim()).filter(Boolean))),r.setTier(s?Number(s):2),t.has("notaa")){r.toggles.taa=!1;const u=document.getElementById("tg-taa");u&&(u.checked=!1)}if(t.has("taayes")){r.toggles.taa=!0;const u=document.getElementById("tg-taa");u&&(u.checked=!0)}r.camera.target=[-8,2.2,0],r.camera.distance=30,r.camera.yaw=4.05,r.camera.pitch=.22,r.resize(),console.log(`[boot] renderer ready @${(performance.now()/1e3).toFixed(2)}s`),k("Сцена собрана. Старт рендера…",1),Ve(r,{adapter:document.getElementById("hud-adapter"),fps:document.getElementById("hud-fps"),tier:document.getElementById("hud-tier")},()=>{},()=>document.pointerLockElement===i),window.__PROBE__=()=>r.debugSample(),window.__SNAPBUF__=async(u,P,S)=>{g=!0,await new Promise(_=>setTimeout(_,120));try{const _=Math.min(u??r.canvas.width,r.canvas.width),y=Math.min(P??r.canvas.height,r.canvas.height),T=new Uint8Array(_*y*4),C=320,z=180;let A=0;for(let E=0;E<y;E+=z)for(let G=0;G<_;G+=C){const W=Math.min(C,_-G),ae=Math.min(z,y-E),de=await r.debugSnapshot(W,ae,G,E);for(let q=0;q<ae;q++)T.set(de.rgba.subarray(q*W*4,(q+1)*W*4),((E+q)*_+G)*4);console.log(`[snap] tile ${A++} ok`)}console.log("[snap] tiles done"),console.log("[snap] png start");let M="";const V=49152;for(let E=0;E<T.length;E+=V)M+=btoa(String.fromCharCode(...T.subarray(E,Math.min(E+V,T.length))));const N={w:_,h:y,b64:M};if(S){const E=document.createElement("canvas");E.width=_,E.height=y;const G=E.getContext("2d"),W=G.createImageData(_,y);W.data.set(T),G.putImageData(W,0,0),N.png=E.toDataURL("image/png").split(",")[1],console.log("[snap] png done")}return N}finally{g=!1}},window.__SET_DBG__=u=>{r.uniforms.debugMode=u},window.__ROW__=(u,P,S,_,y)=>r.debugRow(u,P,S,_,y);const n=r.canvas;let h=!1,l=0,m=0,o=!1;n.addEventListener("pointerdown",u=>{document.pointerLockElement!==n&&(h=!0,o=u.button===2||u.button===1,l=u.clientX,m=u.clientY,n.setPointerCapture(u.pointerId))}),n.addEventListener("pointermove",u=>{if(!h)return;const P=u.clientX-l,S=u.clientY-m;l=u.clientX,m=u.clientY,o?r.camera.pan(P,S):r.camera.moveOrbit(P,S)}),n.addEventListener("pointerup",u=>{h=!1,n.releasePointerCapture(u.pointerId)}),n.addEventListener("contextmenu",u=>u.preventDefault()),n.addEventListener("wheel",u=>{u.preventDefault(),r.camera.zoom(u.deltaY)},{passive:!1});const d=new Set;document.addEventListener("keydown",u=>d.add(u.code.toLowerCase())),document.addEventListener("keyup",u=>d.delete(u.code.toLowerCase()));let f=0;window.addEventListener("resize",()=>{clearTimeout(f),f=window.setTimeout(()=>r.resize(),120)});let b=performance.now(),v=!1;const p=Number(t.get("fpscap")??0);let B=0,g=!1;const x=u=>{const P=Math.min(u-b,100);if(b=u,g){v&&requestAnimationFrame(x);return}if(p>0&&u-B<p){v&&requestAnimationFrame(x);return}B=u,window.__CAM_TICK__?.(P/1e3),r.camera.mode==="fly"&&r.camera.flyStep(P/1e3,d);try{r.render(P)}catch(S){console.error(S),k("Ошибка кадра",-1,String(S.message??S)),v=!1;return}window.__FPS_TICK__?.(P),window.__wgpu={status:"running",adapter:e.adapterName,tier:J[r.tierIndex].name},v&&requestAnimationFrame(x)};new URLSearchParams(location.search).has("still")?window.__wgpu={status:"running",adapter:e.adapterName,tier:"still"}:(v=!0,requestAnimationFrame(x)),setTimeout(()=>{Ue.classList.add("fade"),We.classList.remove("hidden")},450)}je().catch(i=>{console.error(i),re(String(i.message??i),"Смотрите консоль (F12).")});

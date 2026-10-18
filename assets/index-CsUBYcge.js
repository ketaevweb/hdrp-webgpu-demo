(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function r(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(t){if(t.ep)return;t.ep=!0;const a=r(t);fetch(t.href,a)}})();function ve(o){let e="",r="",s="";const t=o.info;t&&(e=t.vendor||"",r=t.architecture||"",s=t.description||"");const a=[e,r,s].filter(c=>c&&c.length>0);return{name:a.length?a.join(" · "):"WebGPU adapter",features:[...o.features]}}async function xe(o){const e=navigator.gpu;if(!e)throw new Error("navigator.gpu недоступен — браузер без WebGPU");const r=[{powerPreference:"high-performance"},{},{forceFallbackAdapter:!0}],s=window.__GPUKEEP__??[];window.__GPUKEEP__=s;let t=null,a=null;for(const i of r){let d=null;try{d=await e.requestAdapter(i)}catch{d=null}if(!d)continue;let h;try{h=await d.requestDevice({label:"hdrp-webgpu-device",requiredLimits:{maxTextureDimension2D:Math.min(d.limits.maxTextureDimension2D,8192),maxStorageBufferBindingSize:Math.min(d.limits.maxStorageBufferBindingSize,1<<28)}})}catch{continue}const y=new Promise(m=>h.lost.then(()=>m(!0)));if(await Promise.race([y,new Promise(m=>setTimeout(()=>m(!1),350))])){try{h.destroy()}catch{}continue}t=h,a=d;break}if(a&&s.push(a),t&&s.push(t),!a||!t)throw new Error("Не получен рабочий GPUDevice (все кандидаты отклонены)");const{name:l}=ve(a),c=o.getContext("webgpu");if(!c)throw new Error('canvas.getContext("webgpu") вернул null');const p=e.getPreferredCanvasFormat();c.configure({device:t,format:p,alphaMode:"opaque"});const n=globalThis;n.__devSeq=(n.__devSeq??0)+1;const f=n.__devSeq;window.__DEV_OK__=`#${f} @${(performance.now()/1e3).toFixed(2)}s`,t.lost.then(i=>{const d=`#${f} ${i.reason}: ${i.message} @${(performance.now()/1e3).toFixed(2)}s`;console.error(`[gpu] DEVICE LOST ${d}`),window.__DEVLOST__=d});const g={maxTextureDimension2D:t.limits.maxTextureDimension2D,maxBufferSize:t.limits.maxBufferSize,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxUniformBufferBindingSize:t.limits.maxUniformBufferBindingSize};return{device:t,context:c,canvas:o,format:p,adapterName:l,features:[...t.features],limits:g,maxTextureDim:t.limits.maxTextureDimension2D}}function be(o,e){o.addEventListener("uncapturederror",r=>{e(`GPU uncaptured error: ${r.error.message}`)})}const R=(o,e,r,s)=>{let[t,a,l]=[o,e,r];if(s.rz){const c=Math.cos(s.rz),p=Math.sin(s.rz),n=t*c-a*p,f=t*p+a*c;t=n,a=f}if(s.ry){const c=Math.cos(s.ry),p=Math.sin(s.ry),n=t*c+l*p,f=-t*p+l*c;t=n,l=f}return[t+s.translate[0],a+s.translate[1],l+s.translate[2]]},G=(o,e,r,s)=>{let[t,a,l]=[o,e,r];if(s.rz){const c=Math.cos(s.rz),p=Math.sin(s.rz),n=t*c-a*p,f=t*p+a*c;t=n,a=f}if(s.ry){const c=Math.cos(s.ry),p=Math.sin(s.ry),n=t*c+l*p,f=-t*p+l*c;t=n,l=f}return[t,a,l]};class we{pos=[];nrm=[];uv=[];idx=[];vert(e,r,s,t){return this.pos.push(e[0],e[1],e[2]),this.nrm.push(r[0],r[1],r[2]),this.uv.push(s,t),this.pos.length/3-1}quad(e,r,s,t){this.idx.push(e,r,s,e,s,t)}addBox(e,r,s){const t={translate:e,...s},a=r[0]/2,l=r[1]/2,c=r[2]/2,p=[{n:[0,0,1],corners:[[-a,-l,c],[a,-l,c],[a,l,c],[-a,l,c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,0,-1],corners:[[a,-l,-c],[-a,-l,-c],[-a,l,-c],[a,l,-c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[1,0,0],corners:[[a,-l,c],[a,-l,-c],[a,l,-c],[a,l,c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[-1,0,0],corners:[[-a,-l,-c],[-a,-l,c],[-a,l,c],[-a,l,-c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,1,0],corners:[[-a,l,c],[a,l,c],[a,l,-c],[-a,l,-c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,-1,0],corners:[[-a,-l,-c],[a,-l,-c],[a,-l,c],[-a,-l,c]],uv:[[0,0],[1,0],[1,1],[0,1]]}];for(const n of p){const f=G(n.n[0],n.n[1],n.n[2],t),g=n.corners.map((i,d)=>this.vert(R(i[0],i[1],i[2],t),f,n.uv[d][0],n.uv[d][1]));this.quad(g[0],g[1],g[2],g[3])}return this}addCylinder(e,r,s,t,a=10,l){const c={translate:e,...l},p=t/2,n=this.pos.length/3;for(let f=0;f<=a;f++){const g=f/a*Math.PI*2,i=Math.cos(g),d=Math.sin(g),h=(r-s)/t,y=Math.hypot(1,h);this.vert(R(i*r,-p,d*r,c),G(i/y,h/y,d/y,c),f/a*4,0),this.vert(R(i*s,p,d*s,c),G(i/y,h/y,d/y,c),f/a*4,1)}for(let f=0;f<a;f++){const g=n+f*2;this.quad(g,g+2,g+3,g+1)}if(s>.001){const f=this.vert(R(0,p,0,c),G(0,1,0,c),.5,.5);for(let g=0;g<a;g++){const i=g/a*Math.PI*2,d=(g+1)/a*Math.PI*2,h=this.vert(R(Math.cos(i)*s,p,Math.sin(i)*s,c),G(0,1,0,c),0,0),y=this.vert(R(Math.cos(d)*s,p,Math.sin(d)*s,c),G(0,1,0,c),0,0);this.quad(f,h,y,f)}}if(r>.001){const f=this.vert(R(0,-p,0,c),G(0,-1,0,c),.5,.5);for(let g=0;g<a;g++){const i=g/a*Math.PI*2,d=(g+1)/a*Math.PI*2,h=this.vert(R(Math.cos(i)*r,-p,Math.sin(i)*r,c),G(0,-1,0,c),0,0),y=this.vert(R(Math.cos(d)*r,-p,Math.sin(d)*r,c),G(0,-1,0,c),0,0);this.quad(f,y,h,f)}}return this}addSphere(e,r,s,t=12,a=8){const l=this.pos.length/3;for(let c=0;c<=a;c++){const p=c/a,n=p*Math.PI;for(let f=0;f<=t;f++){const g=f/t,i=g*Math.PI*2,d=[Math.sin(n)*Math.cos(i),Math.cos(n),Math.sin(n)*Math.sin(i)],h=[e[0]+d[0]*r,e[1]+d[1]*r,e[2]+d[2]*r];s&&s(h,d),this.vert(h,d,g*3,p*2)}}for(let c=0;c<a;c++)for(let p=0;p<t;p++){const n=l+c*(t+1)+p,f=n+t+1;this.quad(n,f,f+1,n+1)}return this}build(){const e=this.pos.length/3,r=new Float32Array(e*8);for(let s=0;s<e;s++)r.set([this.pos[s*3],this.pos[s*3+1],this.pos[s*3+2]],s*8),r.set([this.nrm[s*3],this.nrm[s*3+1],this.nrm[s*3+2]],s*8+3),r.set([this.uv[s*2],this.uv[s*2+1]],s*8+6);return{vertexData:r,indexData:new Uint32Array(this.idx)}}}const B={CONCRETE:0,PLASTER:1,WOOD_FLOOR:2,WOOD_DECK:3,METAL:4,FABRIC:5,FOLIAGE:6,ROCK:7,EMISSIVE:8};let ee=1337;function E(){return ee=ee*1664525+1013904223>>>0,ee/4294967296}function ye(){ee=1337;const o=new Map,e=u=>{let b=o.get(u);return b||(b=new we,o.set(u,b)),b},r=0;e(B.CONCRETE).addBox([0,.6,0],[38,1.2,30]),e(B.CONCRETE).addBox([0,-2.2,0],[420,1,420]),e(B.WOOD_FLOOR).addBox([-11,1.22,0],[10,.05,12]),e(B.PLASTER).addBox([-16,2.65,-4],[.35,2.9,4]),e(B.PLASTER).addBox([-16,2.65,4],[.35,2.9,4]),e(B.PLASTER).addBox([-16,.65,0],[.35,1.1,4]),e(B.PLASTER).addBox([-16,3.75,0],[.35,1.2,4]),e(B.PLASTER).addBox([-11,2.85,6],[10,3.3,.35]),e(B.PLASTER).addBox([-11,2.85,-6],[10,3.3,.35]),e(B.PLASTER).addBox([-6,2.85,-3.6],[.35,3.3,4.8]),e(B.PLASTER).addBox([-6,2.85,3.6],[.35,3.3,4.8]),e(B.PLASTER).addBox([-6,3.6,0],[.35,1.8,2.4]),e(B.PLASTER).addBox([-11,4.65,0],[10,.3,12]),e(B.WOOD_FLOOR).addBox([-4.5,1.22,0],[3,.05,3]),e(B.PLASTER).addBox([-4.5,2.7,-1.5],[3,3,.3]),e(B.PLASTER).addBox([-4.5,2.7,1.5],[3,3,.3]),e(B.PLASTER).addBox([-4.5,4.35,0],[3,.3,3.3]),e(B.WOOD_FLOOR).addBox([1.5,1.22,0],[9,.05,9]),e(B.PLASTER).addBox([-3,3.35,-2.85],[.35,4.3,3.3]),e(B.PLASTER).addBox([-3,3.35,2.85],[.35,4.3,3.3]),e(B.PLASTER).addBox([-3,4.2,0],[.35,2,2.4]),e(B.PLASTER).addBox([1.5,3.35,4.5],[9,4.3,.35]),e(B.PLASTER).addBox([1.5,3.35,-4.5],[9,4.3,.35]),e(B.PLASTER).addBox([6,3.35,-3],[.35,4.3,3]),e(B.PLASTER).addBox([6,3.35,3],[.35,4.3,3]),e(B.PLASTER).addBox([6,4.2,0],[.35,2,3]),e(B.PLASTER).addBox([-.9,5.65,0],[4.2,.3,9]),e(B.PLASTER).addBox([4.5,5.65,0],[3,.3,9]),e(B.PLASTER).addBox([1.5,5.65,-3],[6,.3,3]),e(B.PLASTER).addBox([1.5,5.65,3],[6,.3,3]),e(B.CONCRETE).addBox([1.5,5.9,-1.55],[3.2,.4,.12]),e(B.CONCRETE).addBox([1.5,5.9,1.55],[3.2,.4,.12]),e(B.CONCRETE).addBox([-.05,5.9,0],[.12,.4,3.2]),e(B.CONCRETE).addBox([3.05,5.9,0],[.12,.4,3.2]),e(B.CONCRETE).addBox([4.6,1.5,3.2],[1.2,.6,1.2]);for(let u=0;u<5;u++){const b=E()*Math.PI*2;e(B.FOLIAGE).addSphere([4.6+Math.cos(b)*.35,1.95+E()*.3,3.2+Math.sin(b)*.35],.32+E()*.15,_=>{_[1]*=.7},8,6)}e(B.WOOD_FLOOR).addBox([11,1.22,0],[10,.05,10]),e(B.PLASTER).addBox([11,2.85,5],[10,3.3,.35]),e(B.PLASTER).addBox([11,2.85,-5],[10,3.3,.35]),e(B.PLASTER).addBox([16,2.85,-3.75],[.35,3.3,2.5]),e(B.PLASTER).addBox([16,2.85,3.75],[.35,3.3,2.5]),e(B.PLASTER).addBox([16,.6,0],[.35,1,5]),e(B.PLASTER).addBox([16,3.75,0],[.35,1.2,5]),e(B.PLASTER).addBox([11,4.65,0],[10,.3,10]),e(B.WOOD_FLOOR).addBox([14.3,1.75,-1.2],[2,1.05,5.2]),e(B.METAL).addBox([15.6,2.4,-1.2],[.08,.04,5.2]),e(B.PLASTER).addBox([15.75,3.1,-1.2],[.4,1.9,5.2]);for(const u of[-2.8,-1.4,0,1.4])e(B.FABRIC).addCylinder([13,1.55,u],.22,.24,.68,10),e(B.METAL).addCylinder([13,1.2,u],.05,.05,.35,8);e(B.FABRIC).addBox([8.2,1.6,-2.8],[1.1,.75,2.6]),e(B.FABRIC).addBox([7.8,2,-2.8],[.35,.8,2.6]),e(B.FABRIC).addBox([8.2,1.75,-3.9],[1,.45,.3]),e(B.FABRIC).addBox([8.2,1.75,-1.7],[1,.45,.3]),e(B.FABRIC).addBox([10,1.26,-1.5],[4.2,.03,3.2]);for(const u of[-2.6,.2])e(B.METAL).addCylinder([14.2,4,u],.008,.008,1.2,6),e(B.METAL).addCylinder([14.2,3.32,u],.16,.06,.16,12),e(B.EMISSIVE).addSphere([14.2,3.24,u],.055,void 0,8,6);e(B.METAL).addCylinder([1.5,5.5,0],.008,.008,1.6,6),e(B.METAL).addCylinder([1.5,4.62,0],.2,.07,.18,12),e(B.EMISSIVE).addSphere([1.5,4.52,0],.06,void 0,8,6),e(B.METAL).addCylinder([8.6,1.85,2.8],.02,.02,1.3,6),e(B.METAL).addCylinder([8.6,1.22,2.8],.16,.16,.04,10),e(B.EMISSIVE).addCylinder([8.6,2.62,2.8],.11,.14,.24,12);for(const u of[-1.15,1.15])e(B.EMISSIVE).addBox([-4.5,2.55,u],[.16,.1,.24]);for(const u of[-2.6,2.6])e(B.EMISSIVE).addCylinder([-11,4.42,u],.09,.09,.05,10);for(const u of[-4.6,4.6])e(B.METAL).addCylinder([-18.5,1.5,u],.06,.06,.62,8),e(B.EMISSIVE).addCylinder([-18.5,1.86,u],.045,.05,.1,8);for(const u of[-4.6,0,4.6])e(B.CONCRETE).addCylinder([-17.2,3,u],.22,.26,3.6,12);e(B.PLASTER).addBox([-17.2,5,0],[.9,.5,11]);for(let u=0;u<24;u++){const b=-17.4-u*1;e(B.WOOD_DECK).addBox([b,1.08,0],[.88,.09,3.6])}e(B.WOOD_DECK).addBox([-29,.92,-1.55],[24,.16,.28]),e(B.WOOD_DECK).addBox([-29,.92,1.55],[24,.16,.28]);for(const u of[-18,-22,-26,-30,-34,-38])for(const b of[-1.9,1.9])e(B.WOOD_DECK).addCylinder([u,.1,b],.15,.13,3,8);e(B.WOOD_DECK).addBox([-28.5,1.85,-1.72],[22,.07,.07]),e(B.WOOD_DECK).addBox([-28.5,1.85,1.72],[22,.07,.07]);for(let u=0;u<12;u++){const b=-18.5-u*1.8;e(B.WOOD_DECK).addBox([b,1.5,-1.72],[.06,.6,.06]),e(B.WOOD_DECK).addBox([b,1.5,1.72],[.06,.6,.06])}const s=[[-20.5,-.35,3.6,1.5],[-22.5,-.55,-2.8,1.9],[-25,-.3,1.6,1.2],[-27.5,-.5,-4.2,1.6],[-30,-.45,2.8,1.4],[-23.8,-.75,.4,1.1],[-19.4,-.6,-3.4,1.3],[-33,-.35,-1.2,1.7]];for(const[u,b,_,S]of s)e(B.ROCK).addSphere([u,b,_],S,T=>{const x=L=>Math.sin(T[0]*L+1.7)*Math.sin(T[1]*L*1.7+4.2)*Math.sin(T[2]*L*1.3+2.1),w=1+.28*x(2.1)+.14*x(4.7);T[0]=u+(T[0]-u)*w,T[1]=Math.max(b-S*.35,b+(T[1]-b)*w),T[2]=_+(T[2]-_)*w},14,9);const t=[];for(let u=0;u<9;u++)t.push([-14+u*3.4,0,10.4+E()*2.6]);for(let u=0;u<8;u++)t.push([-12+u*3.6,0,-10.2-E()*2.4]);for(const[u,,b]of t){const _=5+Math.floor(E()*4);for(let S=0;S<_;S++){const T=u+(E()-.5)*1.6,x=b+(E()-.5)*1.6,w=3+E()*1.8,L=(E()-.5)*.16,P=(E()-.5)*.16;e(B.FOLIAGE).addCylinder([T,1.2+w/2-.02,x],.035,.022,w,6,{rz:L,ry:P});const z=1.2+w*Math.cos(L),D=T+w*Math.sin(L)*-Math.sin(P)+0,M=x+w*Math.sin(L)*Math.cos(P)*.5,U=3+Math.floor(E()*3);for(let N=0;N<U;N++){const Z=z-.25-E()*1.2,H=.35+E()*.45,j=E()*Math.PI*2;e(B.FOLIAGE).addBox([D+Math.cos(j)*H*.5,Z,M+Math.sin(j)*H*.5],[H,.02,.09+E()*.06],{ry:j,rz:-.25-E()*.3})}}}const a=[];let l=0,c=0;const p=[],n=[];for(const[u,b]of[...o.entries()].sort((_,S)=>_[0]-S[0])){const{vertexData:_,indexData:S}=b.build();p.push(_),n.push(S),a.push({matId:u,firstIndex:c,count:S.length}),l+=_.length/8,c+=S.length}const f=p.reduce((u,b)=>u+b.length,0),g=n.reduce((u,b)=>u+b.length,0),i=new Float32Array(f),d=new Uint32Array(g);let h=0,y=0;for(let u=0;u<p.length;u++){i.set(p[u],h);const b=n[u],_=h/8;for(let S=0;S<b.length;S++)d[y+S]=b[S]+_;h+=p[u].length,y+=b.length}return{vertexData:i,indexData:d,groups:a,lights:[{pos:[14.2,3.1,-2.6],color:[1,.72,.45],intensity:40,range:9},{pos:[14.2,3.1,.2],color:[1,.72,.45],intensity:40,range:9},{pos:[1.5,4.4,0],color:[1,.82,.6],intensity:26,range:9},{pos:[8.6,2.55,2.8],color:[1,.68,.42],intensity:26,range:7},{pos:[-4.2,2.55,-1.15],color:[1,.75,.5],intensity:14,range:5},{pos:[-4.2,2.55,1.15],color:[1,.75,.5],intensity:14,range:5},{pos:[-11,4.15,-2.6],color:[.95,.9,.8],intensity:18,range:7},{pos:[-11,4.15,2.6],color:[.95,.9,.8],intensity:18,range:7},{pos:[-17.2,4.4,0],color:[.85,.92,1],intensity:55,range:14,spotDir:[-17.5,0,0],cosInner:.88,cosOuter:.6},{pos:[-18.5,1.95,-4.6],color:[1,.8,.55],intensity:10,range:5},{pos:[-18.5,1.95,4.6],color:[1,.8,.55],intensity:10,range:5}],shots:[{name:"Пирс",eye:[-37,2.6,.4],look:[-8,2.6,0]},{name:"Атриум",eye:[5,2.1,3.4],look:[-.5,2.4,-.6]},{name:"Бар",eye:[10.4,2,1.6],look:[14.6,1.6,-1.8]},{name:"Коридор",eye:[-6.2,1.95,0],look:[-1,1.7,.1]},{name:"Океан",eye:[-24,1.6,7.5],look:[-60,4,-4]},{name:"Обзор",eye:[27,22,25],look:[-4,.5,-1]}],probes:[{pos:[-11,2.6,0],interior:.88,bounce:.55},{pos:[-4.5,2.4,0],interior:.92,bounce:.5},{pos:[1.5,2.6,0],interior:.62,bounce:.6},{pos:[11,2.4,0],interior:.8,bounce:.65},{pos:[0,1.9,9.5],interior:.12,bounce:.2},{pos:[-14,2.2,0],interior:.25,bounce:.25},{pos:[-24,2.2,0],interior:.04,bounce:.05},{pos:[-36,2.4,0],interior:0,bounce:0},{pos:[-40,1.4,-16],interior:0,bounce:0},{pos:[12,1.4,-16],interior:0,bounce:0}],waterLevel:r}}class Be{constructor(e){this.device=e}resources=new Map;pool=[];passes=[];current=null;frameIndex=0;texture(e,r){let s=this.resources.get(e);if((!s||s.desc.width!==r.width||s.desc.height!==r.height||s.desc.format!==r.format)&&(s&&s.texture&&this.retire(s.texture),s={desc:r,texture:null,view:null},this.resources.set(e,s)),!s.texture){const t=this.pool.pop()??null;t&&t.width===r.width&&t.height===r.height&&t.format===r.format?s.texture=t:(t&&this.retire(t),s.texture=this.device.createTexture({label:`rg:${e}`,size:[r.width,r.height],format:r.format,usage:r.usage})),s.view=s.texture.createView()}return s.view}persistent(e,r){return this.texture(e,r)}retire(e){this.pool.push(e),this.pool.length>24&&this.pool.shift()?.destroy()}async run(e,r,s){const t={name:e,kind:r,cpuMs:0};this.passes.push(t),this.current=t;const a=performance.now();await s(),t.cpuMs=performance.now()-a,this.current=null}beginFrame(){this.passes.length=0,this.frameIndex++}reset(e=!1){for(const r of this.resources.values())r.texture?.destroy(),r.texture=null,r.view=null;if(this.resources.clear(),!e){for(const r of this.pool)r.destroy();this.pool.length=0}}totalCpuMs(){return this.passes.reduce((e,r)=>e+r.cpuMs,0)}get dev(){return this.device}}function I(){const o=new Float32Array(16);return o[0]=o[5]=o[10]=o[15]=1,o}function Pe(o){return o.fill(0),o[0]=o[5]=o[10]=o[15]=1,o}function pe(o,e,r){const s=e[0],t=e[1],a=e[2],l=e[3],c=e[4],p=e[5],n=e[6],f=e[7],g=e[8],i=e[9],d=e[10],h=e[11],y=e[12],v=e[13],m=e[14],C=e[15];for(let u=0;u<4;u++){const b=r[u*4],_=r[u*4+1],S=r[u*4+2],T=r[u*4+3];o[u*4]=b*s+_*c+S*g+T*y,o[u*4+1]=b*t+_*p+S*i+T*v,o[u*4+2]=b*a+_*n+S*d+T*m,o[u*4+3]=b*l+_*f+S*h+T*C}return o}function _e(o,e,r,s,t){const a=1/Math.tan(e/2);return o.fill(0),o[0]=a/r,o[5]=a,o[10]=t/(s-t),o[14]=t*s/(s-t),o[11]=-1,o}function Se(o,e,r,s,t,a,l){return o.fill(0),o[0]=2/(r-e),o[5]=2/(t-s),o[10]=1/(a-l),o[12]=(e+r)/(e-r),o[13]=(t+s)/(s-t),o[14]=a/(a-l),o[15]=1,o}function me(o,e,r,s){let t=e[0]-r[0],a=e[1]-r[1],l=e[2]-r[2],c=Math.hypot(t,a,l);c<1e-8&&(t=0,a=0,l=1,c=1),t/=c,a/=c,l/=c;let p=s[1]*l-s[2]*a,n=s[2]*t-s[0]*l,f=s[0]*a-s[1]*t;if(c=Math.hypot(p,n,f),c<1e-8){const h=Math.abs(s[2])<.9?[0,0,1]:[1,0,0];p=h[1]*l-h[2]*a,n=h[2]*t-h[0]*l,f=h[0]*a-h[1]*t,c=Math.hypot(p,n,f)}p/=c,n/=c,f/=c;const g=a*f-l*n,i=l*p-t*f,d=t*n-a*p;return o[0]=p,o[1]=g,o[2]=t,o[3]=0,o[4]=n,o[5]=i,o[6]=a,o[7]=0,o[8]=f,o[9]=d,o[10]=l,o[11]=0,o[12]=-(p*e[0]+n*e[1]+f*e[2]),o[13]=-(g*e[0]+i*e[1]+d*e[2]),o[14]=-(t*e[0]+a*e[1]+l*e[2]),o[15]=1,o}function Le(o,e){const r=e[0],s=e[1],t=e[2],a=e[3],l=e[4],c=e[5],p=e[6],n=e[7],f=e[8],g=e[9],i=e[10],d=e[11],h=e[12],y=e[13],v=e[14],m=e[15],C=r*c-s*l,u=r*p-t*l,b=r*n-a*l,_=s*p-t*c,S=s*n-a*c,T=t*n-a*p,x=f*y-g*h,w=f*v-i*h,L=f*m-d*h,P=g*v-i*y,z=g*m-d*y,D=i*m-d*v;let M=C*D-u*z+b*P+_*L-S*w+T*x;return M?(M=1/M,o[0]=(c*D-p*z+n*P)*M,o[1]=(t*z-s*D-a*P)*M,o[2]=(y*T-v*S+m*_)*M,o[3]=(i*S-g*T-d*_)*M,o[4]=(p*L-l*D-n*w)*M,o[5]=(r*D-t*L+a*w)*M,o[6]=(v*b-h*T-m*u)*M,o[7]=(f*T-i*b+d*u)*M,o[8]=(l*z-c*L+n*x)*M,o[9]=(s*L-r*z-a*x)*M,o[10]=(h*S-y*b+m*C)*M,o[11]=(g*b-f*S-d*C)*M,o[12]=(c*w-l*P-p*x)*M,o[13]=(r*P-s*w+t*x)*M,o[14]=(y*u-h*_-v*C)*M,o[15]=(f*_-g*u+i*C)*M,o):Pe(o)}function K(o,e){return[o[0]-e[0],o[1]-e[1],o[2]-e[2]]}function J(o,e){return[o[0]+e[0],o[1]+e[1],o[2]+e[2]]}function se(o,e){return[o[0]*e,o[1]*e,o[2]*e]}function ce(o,e){return[o[1]*e[2]-o[2]*e[1],o[2]*e[0]-o[0]*e[2],o[0]*e[1]-o[1]*e[0]]}function Te(o){return Math.hypot(o[0],o[1],o[2])}function X(o){const e=Te(o)||1;return[o[0]/e,o[1]/e,o[2]/e]}function le(o,e){let r=1,s=0,t=o;for(;t>0;)r/=e,s+=r*(t%e),t=Math.floor(t/e);return s}const W=(o,e,r)=>Math.min(r,Math.max(e,o)),Y=(o,e,r)=>o+(e-o)*r,ze=(o,e,r)=>{const s=W((r-o)/(e-o),0,1);return s*s*(3-2*s)},V=o=>o*Math.PI/180;class Ce{target=[0,2,0];distance=26;yaw=V(215);pitch=V(14);position=[-30,2.4,2];flyYaw=V(70);flyPitch=V(4);mode="orbit";fovY=V(52);near=.3;far=2400;view=I();proj=I();viewProj=I();invViewProj=I();prevViewProj=I();viewDir=[0,0,1];camPos=[0,0,0];hasPrev=!1;jitterEnabled=!0;jitterIdx=0;jitter=[0,0];eye(){if(this.mode==="fly")return this.position;const e=Math.cos(this.pitch);return[this.target[0]+this.distance*e*Math.cos(this.yaw),this.target[1]+this.distance*Math.sin(this.pitch),this.target[2]+this.distance*e*Math.sin(this.yaw)]}lookAtPoint(){return this.mode==="fly"?J(this.position,this.forward()):this.target}forward(){const e=Math.cos(this.flyPitch);return X([e*Math.cos(this.flyYaw),Math.sin(this.flyPitch),e*Math.sin(this.flyYaw)])}forwardOfView(){return X(K(this.lookAtPoint(),this.eye()))}update(e){if(this.jitterEnabled){const a=(le(this.jitterIdx%8+1,2)-.5)*2/Math.ceil(e*720),l=(le(this.jitterIdx%8+1,3)-.5)*2/720;this.jitter=[a,l],this.jitterIdx++}else this.jitter=[0,0];const r=this.prevViewProj;this.hasPrev&&r.set(this.viewProj);const s=this.eye(),t=this.lookAtPoint();me(this.view,s,t,[0,1,0]),_e(this.proj,this.fovY,e,this.near,this.far),this.proj[2]+=this.jitter[0],this.proj[13]+=this.jitter[1],pe(this.viewProj,this.proj,this.view),Le(this.invViewProj,this.viewProj),this.hasPrev||(r.set(this.viewProj),this.hasPrev=!0),this.camPos=s,this.viewDir=X(K(t,s))}moveOrbit(e,r){this.yaw-=e*.005,this.pitch=W(this.pitch+r*.005,V(-85),V(85))}zoom(e){this.distance=W(this.distance*(e>0?1.12:.89),2.2,220)}pan(e,r){const s=this.forward(),t=X(ce([0,1,0],s)),a=this.distance*.0016;this.target=J(this.target,J(se(t,-e*a),se([0,1,0],r*a)))}flyStep(e,r){const s=r.has("shiftleft")||r.has("shiftright")?26:7,t=this.forward(),a=X(ce(t,[0,1,0])),l=[0,0,0];r.has("keyw")&&l.forEach((p,n)=>l[n]+=t[n]),r.has("keys")&&l.forEach((p,n)=>l[n]-=t[n]),r.has("keyd")&&l.forEach((p,n)=>l[n]+=a[n]),r.has("keya")&&l.forEach((p,n)=>l[n]-=a[n]),r.has("keye")&&(l[1]+=1),r.has("keyq")&&(l[1]-=1);const c=Math.hypot(...l);if(c>1e-4){const p=s*e/c;this.position=J(this.position,se(l,p)),this.position[1]=Math.max(this.position[1],-1.5)}}animateTo(e,r){const s=r*r*(3-2*r),t=this.eye(),a=this.lookAtPoint(),l=[Y(t[0],e.eye[0],s),Y(t[1],e.eye[1],s),Y(t[2],e.eye[2],s)],c=[Y(a[0],e.look[0],s),Y(a[1],e.look[1],s),Y(a[2],e.look[2],s)];if(this.mode==="orbit"){this.distance=W(Math.hypot(...K(l,e.look)),2.2,220),this.target=c;const p=K(l,c),n=Math.hypot(p[0],p[2]);this.yaw=Math.atan2(p[2],p[0]),this.pitch=Math.atan2(p[1],n)}else{this.position=l;const p=X(K(c,l));this.flyYaw=Math.atan2(p[2],p[0]),this.flyPitch=Math.asin(W(p[1],-1,1))}}}const fe=4,de=[.025,.11,.32,.72,1],ae=10,ue=20;class Me{camData=new Float32Array(68);frameData=new Float32Array(112);cascadeData=[];lightData;probeData=new Float32Array(ae*ue);sunElevation=28;sunAzimuth=245;shadowDist=70;fogScale=.9;evBias=0;cloudCover=.42;bloomStrength=.06;caAmount=.55;debugMode=0;taaOn=1;lutOn=1;ssrOn=1;giOn=1;ssrStrength=1;evLock=0;sunDir=[0,1,0];sunColor=[1,1,1];probes=[];bakedSun=null;constructor(e){for(let r=0;r<fe;r++)this.cascadeData.push(new Float32Array(16));this.lightData=new Float32Array(e.length*16),this.packLights(e)}setProbes(e){this.probes=e.slice(0,ae)}packLights(e){e.forEach((r,s)=>{const t=s*16;this.lightData[t]=r.pos[0],this.lightData[t+1]=r.pos[1],this.lightData[t+2]=r.pos[2],this.lightData[t+3]=r.range,this.lightData[t+4]=r.color[0],this.lightData[t+5]=r.color[1],this.lightData[t+6]=r.color[2],this.lightData[t+7]=r.intensity;const a=r.spotDir??[0,-1,0],l=Math.hypot(a[0],a[1],a[2])||1;this.lightData[t+8]=a[0]/l,this.lightData[t+9]=a[1]/l,this.lightData[t+10]=a[2]/l,this.lightData[t+11]=0,this.lightData[t+12]=r.cosInner??0,this.lightData[t+13]=r.cosOuter??0,this.lightData[t+14]=r.spotDir?1:0,this.lightData[t+15]=0})}updateSun(){const e=V(this.sunElevation),r=V(this.sunAzimuth);this.sunDir=[Math.cos(e)*Math.sin(r),Math.sin(e),Math.cos(e)*Math.cos(r)];const s=1-ze(6,26,this.sunElevation);this.sunColor=[1,.965-.42*s,.925-.66*s]}pack(e,r,s,t,a,l,c,p,n,f,g,i,d,h){const y=this.camData;y.set(e.view,0),y.set(e.viewProj,16),y.set(e.invViewProj,32),y.set(e.prevViewProj,48),y[64]=e.camPos[0],y[65]=e.camPos[1],y[66]=e.camPos[2],y[67]=1;const v=this.frameData;v[0]=this.sunDir[0],v[1]=this.sunDir[1],v[2]=this.sunDir[2],v[3]=0,v[4]=this.sunColor[0]*1e5,v[5]=this.sunColor[1]*1e5,v[6]=this.sunColor[2]*1e5,v[7]=1,v[8]=.00125,v[9]=.035,v[10]=.55,v[11]=performance.now()/1e3,v[12]=r,v[13]=s,v[14]=1/r,v[15]=1/s,v[16]=e.near,v[17]=e.far,v[18]=g,v[19]=this.shadowDist;const m=de;v[20]=m[1]*this.shadowDist,v[21]=m[2]*this.shadowDist,v[22]=m[3]*this.shadowDist,v[23]=m[4]*this.shadowDist,v[24]=n,v[25]=f,v[26]=a,v[27]=t,v[28]=this.evBias,v[29]=d,v[30]=h,v[31]=1.15,v[32]=this.cloudCover,v[33]=1,v[34]=this.fogScale,v[35]=i,v[36]=l,v[37]=c,v[38]=p,v[39]=Math.tan(e.fovY/2),v[40]=this.taaOn,v[41]=this.bloomStrength,v[42]=this.caAmount,v[43]=this.debugMode,v[44]=this.lutOn,v[45]=this.ssrOn*this.ssrStrength,v[46]=this.giOn,v[47]=this.evLock}bakeProbes(){const e=this.sunElevation,r=this.sunAzimuth;if(this.bakedSun&&this.bakedSun.el===e&&this.bakedSun.az===r)return;this.bakedSun={el:e,az:r};const s=this.sunDir,t=[this.sunColor[0]*1e5,this.sunColor[1]*1e5,this.sunColor[2]*1e5],a=64,l=Math.PI*(3-Math.sqrt(5));for(let c=0;c<this.probes.length;c++){const p=this.probes[c],n=1-p.interior,f=c*ue;this.probeData[f]=p.pos[0],this.probeData[f+1]=p.pos[1],this.probeData[f+2]=p.pos[2],this.probeData[f+3]=p.interior;let g=[0,0,0],i=[0,0,0],d=[0,0,0],h=[0,0,0];for(let y=0;y<a;y++){const v=1-2*((y+.5)/a),m=Math.sqrt(Math.max(1-v*v,1e-6)),C=y*l,u=[Math.cos(C)*m,v,Math.sin(C)*m],b=u[1]*.5+.5,_=[.5,.55,.64],S=[.3,.44,.75],T=[0,1,2].map(P=>(_[P]+(S[P]-_[P])*b)*.6),x=W(u[0]*s[0]+u[1]*s[1]+u[2]*s[2],0,1)*.5+.5,w=18e-6*x*x,L=[0,1,2].map(P=>{const z=T[P]+t[P]*w,D=t[P]*.0013*(P===0?1:P===1?.86:.72)*(1+p.bounce*(P===0?.35:P===1?.12:-.1));return D+(z-D)*n});for(let P=0;P<3;P++)g[P]+=L[P]/a,i[P]+=L[P]*u[0]/a,d[P]+=L[P]*u[1]/a,h[P]+=L[P]*u[2]/a}this.probeData[f+4]=g[0],this.probeData[f+5]=g[1],this.probeData[f+6]=g[2],this.probeData[f+7]=0,this.probeData[f+8]=i[0],this.probeData[f+9]=i[1],this.probeData[f+10]=i[2],this.probeData[f+11]=0,this.probeData[f+12]=d[0],this.probeData[f+13]=d[1],this.probeData[f+14]=d[2],this.probeData[f+15]=0,this.probeData[f+16]=h[0],this.probeData[f+17]=h[1],this.probeData[f+18]=h[2],this.probeData[f+19]=0}}updateCascades(e){const r=de,s=e.invViewProj;for(let t=0;t<fe;t++){const a=r[t]*this.shadowDist,l=r[t+1]*this.shadowDist,c=[],p=m=>(e.far-e.near*e.far/m)/(e.far-e.near);for(const[m,C]of[[-1,-1],[1,-1],[1,1],[-1,1]])for(const u of[Math.max(a,e.near+.5),l]){const b=[m,C,W(p(u),0,.9999)],_=s,S=_[0]*b[0]+_[4]*b[1]+_[8]*b[2]+_[12],T=_[1]*b[0]+_[5]*b[1]+_[9]*b[2]+_[13],x=_[2]*b[0]+_[6]*b[1]+_[10]*b[2]+_[14],w=_[3]*b[0]+_[7]*b[1]+_[11]*b[2]+_[15];c.push([S/w,T/w,x/w])}let n=0,f=0,g=0;for(const m of c)n+=m[0],f+=m[1],g+=m[2];n/=8,f/=8,g/=8;let i=0;for(const m of c)i=Math.max(i,Math.hypot(m[0]-n,m[1]-f,m[2]-g));i=Math.max(i,2.5);const d=[n-this.sunDir[0]*(i+30),f-this.sunDir[1]*(i+30),g-this.sunDir[2]*(i+30)],h=I();me(h,d,[n,f,g],[0,1,0]);const y=I();Se(y,-i,i,-i,i,1,(i+30)*2+10);const v=I();pe(v,y,h),this.cascadeData[t].set(v)}}cascadeTexelWorld(){return 2*this.shadowDist*.35/1024}}const O=`
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
`,De=`
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
`,Ee=`
@group(0) @binding(0) var<uniform> cascadeMat : mat4x4f;

@vertex
fn vs_shadow(@location(0) pos : vec3f, @location(1) nrm : vec3f, @location(2) uv : vec2f) -> @builtin(position) vec4f {
  return cascadeMat * vec4f(pos, 1.0);
}
`,Ae=`
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
`,Oe=`
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
`,Re=`
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
`,Ge=`
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
`,Ve=`
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
`,Fe=`
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
`,Ue=`
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
`,Ne=`
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
`,ke=`
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
`,We=`
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
`,te=[{name:"Performant",shadowAtlas:1024,ssao:!1,taa:!1,ssr:!1,oceanNear:96,oceanFar:48},{name:"Balanced",shadowAtlas:2048,ssao:!0,taa:!1,ssr:!0,oceanNear:160,oceanFar:72},{name:"High",shadowAtlas:4096,ssao:!0,taa:!0,ssr:!0,oceanNear:224,oceanFar:88}],Q=6,He=24;class je{graph;camera=new Ce;uniforms;tierIndex=2;toggles={ssao:!0,taa:!0,bloom:!0,ocean:!0,ssr:!0,lut:!0,gi:!0};lastFrameCpuMs=0;dev;canvasPrivate;ctx;scene;sceneVB;sceneIB;camBuf;frameBuf;cascadeBuf=[];lightsBuf;statsBuf;meshConstBufs=[];whiteTex;blackTex;oceanNearVB;oceanNearIB;oceanNearCount=0;oceanFarVB;oceanFarIB;oceanFarCount=0;pShadow;pGbuffer;pCull;pSsao;pBlur;pLighting;pTaa;pSsr;pRefl;pOcean;pExpAccum;pExpFinal;pBloomPre;pBloomDown;pBloomUp;pTonemap;bglGlobal;bglMesh;bglCull;bglSsao;bglBlur;bglLighting;bglOcean;bglSsr;bglRefl;bglTaa;bglExp;bglBloom0;bglBloom1;bglTonemap;gridCountsBuf;gridIndicesBuf;destBufs=[];bgGlobal;bgCascade=[];bgMesh=[];bgCull;bgSsao;bgBlur;bgLightingAo;bgLightingWhite;bgSsr;bgRefl;bgOcean;bgTaa;bgExp;bgTonemapBloom;bgTonemapBlack;bgBloom=[];bloomPasses=[];shadowView;g0View;g1View;g2View;depthView;hdrAView;hdrA2View;ssrHalfView;hdrBView;hdrCView;historyView;bloomViews=[];aoHalfView;aoHalf2View;whiteView;blackView;probesBuf;lutTex;lutView;W=0;H=0;atlas=2048;zerobuffer=new Uint32Array(0);constructor(e,r){this.ctx=e,this.dev=e.device,this.canvasPrivate=e.canvas,this.graph=new Be(this.dev),this.scene=r,this.uniforms=new Me(r.lights)}put(e,r,s=0){this.dev.queue.writeBuffer(e,s,r)}get tier(){return te[this.tierIndex]}get canvas(){return this.canvasPrivate}adapterNameShort(){const e=this.ctx.adapterName;return e.length>46?e.slice(0,44)+"…":e}async init(){const e=this.dev;this.uniforms.updateSun(),this.uniforms.setProbes(this.scene.probes),this.uniforms.bakeProbes(),this.probesBuf=e.createBuffer({size:ae*80,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.probesBuf,this.uniforms.probeData),this.bakeLut(),this.sceneVB=e.createBuffer({size:this.scene.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneVB,this.scene.vertexData),this.sceneIB=e.createBuffer({size:this.scene.indexData.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneIB,this.scene.indexData),this.camBuf=e.createBuffer({size:272,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.frameBuf=e.createBuffer({size:448,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});for(let s=0;s<4;s++){const t=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.cascadeBuf.push(t),this.bgCascade.push(e.createBindGroup({layout:this.bglMeshAfter(),entries:[{binding:0,resource:{buffer:t}}]}))}const r=this.scene.lights.length*64;this.lightsBuf=e.createBuffer({size:r,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.lightsBuf,this.uniforms.lightData),this.statsBuf=e.createBuffer({size:272,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.put(this.statsBuf,new Float32Array([-3,.02,0]),256);for(const s of this.scene.groups){const t=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(t,new Float32Array([s.matId,0,0,0])),this.meshConstBufs.push(t)}this.whiteTex=e.createTexture({size:[4,4],format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.whiteTex},new Uint8Array(16).fill(255),{bytesPerRow:4,rowsPerImage:4},[4,4]),this.blackTex=e.createTexture({size:[4,4],format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.blackTex},new Float32Array(64),{bytesPerRow:32,rowsPerImage:4},[4,4]),this.whiteView=this.whiteTex.createView(),this.blackView=this.blackTex.createView(),this.createPipelines();for(const s of this.scene.groups)this.bgMesh.push(e.createBindGroup({layout:this.bglMesh,entries:[{binding:0,resource:{buffer:this.meshConstBufs[this.bgMesh.length]}}]}));this.rebuildOcean()}bglMeshAfter(){return this.bglMesh||(this.bglMesh=this.dev.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})),this.bglMesh}rebuildOcean(){const e=this.dev,r=Number(new URLSearchParams(location.search).get("oceansize")??0),s=r>0?r:this.tier.oceanNear;this.oceanNearVB?.destroy(),this.oceanNearIB?.destroy(),this.oceanFarVB?.destroy(),this.oceanFarIB?.destroy();const t=this.makeGrid(s,380,-14,0,0),a=this.makeDisk(Math.max(this.tier.oceanFar>>1,24),Math.max(this.tier.oceanFar*2,96),1500,-14,0,-.35);this.oceanNearVB=e.createBuffer({size:t.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearVB,t.pos),this.oceanNearIB=e.createBuffer({size:t.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearIB,t.idx),this.oceanNearCount=t.idx.length,this.oceanFarVB=e.createBuffer({size:a.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarVB,a.pos),this.oceanFarIB=e.createBuffer({size:a.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarIB,a.idx),this.oceanFarCount=a.idx.length}makeDisk(e,r,s,t,a,l){const c=new Float32Array((e+1)*r*3);for(let f=0;f<=e;f++){const g=f/e*s;for(let i=0;i<r;i++){const d=i/r*Math.PI*2,h=(f*r+i)*3;c[h]=t+Math.cos(d)*g,c[h+1]=l,c[h+2]=a+Math.sin(d)*g}}const p=new Uint32Array(e*r*6);let n=0;for(let f=0;f<e;f++)for(let g=0;g<r;g++){const i=(g+1)%r,d=f*r+g,h=(f+1)*r+g;p[n++]=d,p[n++]=h,p[n++]=h+i-g,p[n++]=d,p[n++]=h+i-g,p[n++]=d+(i-g)}return{pos:c,idx:p}}makeGrid(e,r,s,t,a){const l=new Float32Array(e*e*3),c=r/(e-1);for(let g=0;g<e;g++)for(let i=0;i<e;i++){const d=(g*e+i)*3;l[d]=s-r/2+i*c,l[d+1]=a,l[d+2]=t-r/2+g*c}const p=(e-1)*(e-1),n=new Uint32Array(p*6);let f=0;for(let g=0;g<e-1;g++)for(let i=0;i<e-1;i++){const d=g*e+i;n[f++]=d,n[f++]=d+e,n[f++]=d+e+1,n[f++]=d,n[f++]=d+e+1,n[f++]=d+1}return{pos:l,idx:n}}createPipelines(){const e=this.dev,r=this.module(O+De),s=this.module(O+Ee),t=this.module(O+Ae),a=this.module(O+Oe),l=this.module(O+Re),c=this.module(O+Ge),p=this.module(O+Fe),n=this.module(O+Ie),f=new URLSearchParams(location.search).get("ocean")??"full";let g;if(f==="flat")g=O+Ve+he;else if(f==="constfs"){const z=ie.indexOf("@fragment");g=O+ie.slice(0,z)+he}else g=O+ie;const i=this.module(g),d=this.module(O+Ue),h=this.module(O+Ne),y=this.module(O+ke),v=this.module(O+We),m=GPUShaderStage.FRAGMENT,C=GPUShaderStage.VERTEX,u=GPUShaderStage.COMPUTE,b={sampleType:"float"};this.bglGlobal=e.createBindGroupLayout({entries:[{binding:0,visibility:C|m,buffer:{type:"uniform"}},{binding:1,visibility:C|m,buffer:{type:"uniform"}},{binding:2,visibility:m,texture:{sampleType:"depth"}},{binding:3,visibility:m,sampler:{type:"comparison"}}]}),this.bglCull=e.createBindGroupLayout({entries:[{binding:0,visibility:u,buffer:{type:"read-only-storage"}},{binding:1,visibility:u,buffer:{type:"storage"}},{binding:2,visibility:u,buffer:{type:"storage"}},{binding:3,visibility:u,texture:{sampleType:"depth"}},{binding:4,visibility:u,buffer:{type:"uniform"}},{binding:5,visibility:u,buffer:{type:"uniform"}}]}),this.bglSsao=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:{sampleType:"depth"}},{binding:1,visibility:m,texture:b}]}),this.bglBlur=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:b},{binding:1,visibility:m,sampler:{type:"filtering"}}]}),this.bglLighting=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:b},{binding:1,visibility:m,texture:b},{binding:2,visibility:m,texture:b},{binding:3,visibility:m,texture:{sampleType:"depth"}},{binding:4,visibility:m,texture:b},{binding:5,visibility:m,buffer:{type:"read-only-storage"}},{binding:6,visibility:m,buffer:{type:"read-only-storage"}},{binding:7,visibility:m,buffer:{type:"read-only-storage"}},{binding:8,visibility:m,buffer:{type:"read-only-storage"}}]}),this.bglOcean=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:b},{binding:1,visibility:m,texture:{sampleType:"depth"}},{binding:2,visibility:m,sampler:{type:"filtering"}}]}),this.bglSsr=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:b},{binding:1,visibility:m,texture:b},{binding:2,visibility:m,texture:b},{binding:3,visibility:m,texture:{sampleType:"depth"}},{binding:4,visibility:m,texture:b},{binding:5,visibility:m,sampler:{type:"filtering"}}]}),this.bglRefl=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:b},{binding:1,visibility:m,texture:b},{binding:2,visibility:m,texture:b},{binding:3,visibility:m,texture:b},{binding:4,visibility:m,texture:{sampleType:"depth"}},{binding:5,visibility:m,sampler:{type:"filtering"}}]}),this.bglTaa=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:b},{binding:1,visibility:m,texture:b},{binding:2,visibility:m,texture:{sampleType:"depth"}},{binding:3,visibility:m,sampler:{type:"filtering"}}]}),this.bglExp=e.createBindGroupLayout({entries:[{binding:0,visibility:u,texture:b},{binding:1,visibility:u,buffer:{type:"storage"}},{binding:2,visibility:u,buffer:{type:"uniform"}}]}),this.bglBloom0=e.createBindGroupLayout({entries:[{binding:0,visibility:m,buffer:{type:"uniform"}},{binding:1,visibility:m,buffer:{type:"uniform"}}]}),this.bglBloom1=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:b},{binding:1,visibility:m,sampler:{type:"filtering"}},{binding:2,visibility:m,buffer:{type:"read-only-storage"}}]}),this.bglTonemap=e.createBindGroupLayout({entries:[{binding:0,visibility:m,texture:b},{binding:1,visibility:m,texture:b},{binding:2,visibility:m,buffer:{type:"read-only-storage"}},{binding:3,visibility:m,sampler:{type:"filtering"}},{binding:4,visibility:m,texture:{sampleType:"float",viewDimension:"3d"}}]}),this.bglMeshAfter();const _={arrayStride:32,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]},S={arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},T=(z,D,M)=>({module:z,entryPoint:D,targets:M}),x=z=>({vertex:{module:z,entryPoint:"vs_fs"}});this.pShadow=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglMesh]}),vertex:{module:s,entryPoint:"vs_shadow",buffers:[_]},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.pGbuffer=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglMesh]}),vertex:{module:r,entryPoint:"vs_mesh",buffers:[_]},fragment:T(r,"fs_gbuffer",[{format:"rgba8unorm"},{format:"rgba16float"},{format:"rgba8unorm"}]),depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{cullMode:"back"}}),this.pCull=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglCull]}),compute:{module:t,entryPoint:"cullMain"}}),this.pSsao=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsao]}),...x(a),fragment:T(a,"fs_ssao",[{format:"r8unorm"}])}),this.pBlur=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglBlur]}),...x(l),fragment:T(l,"fs_aoBlur",[{format:"r8unorm"}])}),this.pLighting=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglLighting]}),...x(c),fragment:T(c,"fs_lighting",[{format:"rgba16float"}])}),this.pTaa=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTaa]}),...x(d),fragment:T(d,"fs_taa",[{format:"rgba16float"}])}),this.pSsr=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsr]}),...x(p),fragment:T(p,"fs_ssr",[{format:"rgba16float"}])}),this.pRefl=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglRefl]}),...x(n),fragment:T(n,"fs_refl",[{format:"rgba16float"}])});const w=new URLSearchParams(location.search).get("odepth")==="0",L=new URLSearchParams(location.search).get("obgl")==="0";this.pOcean=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:L?[this.bglGlobal]:[this.bglGlobal,this.bglOcean]}),vertex:{module:i,entryPoint:"vs_ocean",buffers:[S]},fragment:T(i,"fs_ocean",[{format:"rgba16float"}]),...w?{}:{depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"}},primitive:{cullMode:"none"}}),this.pExpAccum=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:h,entryPoint:"expAccum"}}),this.pExpFinal=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:h,entryPoint:"expFinal"}});const P={color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}};this.pBloomPre=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...x(y),fragment:T(y,"fs_bloomPrefilter",[{format:"rgba16float"}])}),this.pBloomDown=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...x(y),fragment:T(y,"fs_bloomDown",[{format:"rgba16float"}])}),this.pBloomUp=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...x(y),fragment:T(y,"fs_bloomUp",[{format:"rgba16float",blend:P}])}),this.pTonemap=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTonemap]}),...x(v),fragment:T(v,"fs_tonemap",[{format:this.ctx.format}])})}module(e){return this.dev.createShaderModule({code:e})}bakeLut(){const e=this.dev,r=32,s=n=>Math.min(1,Math.max(0,n)),t=new Uint8Array(r*r*r*4),a=1.055,l=1.07,c=[.9,.96,1.08],p=[1.06,1,.92];for(let n=0;n<r;n++)for(let f=0;f<r;f++)for(let g=0;g<r;g++){const i=((n*r+f)*r+g)*4;let d=[Math.pow((g+.5)/r,1/2.2),Math.pow((f+.5)/r,1/2.2),Math.pow((n+.5)/r,1/2.2)];const h=.2126*d[0]+.7152*d[1]+.0722*d[2];d=d.map(m=>s((m-.5)*a+.5)),d=d.map(m=>s(h+(m-h)*l));const y=1-s((h-.35)/.4),v=s((h-.45)/.35);d=d.map((m,C)=>s(m+(c[C]-1)*y*.055+(p[C]-1)*v*.055)),t[i]=d[0]*255,t[i+1]=d[1]*255,t[i+2]=d[2]*255,t[i+3]=255}this.lutTex=e.createTexture({size:[r,r,r],dimension:"3d",format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.lutTex},t,{bytesPerRow:r*4,rowsPerImage:r},[r,r,r]),this.lutView=this.lutTex.createView({dimension:"3d"})}setTier(e){this.tierIndex=Math.max(0,Math.min(te.length-1,e)),this.toggles.taa=this.tier.taa,this.toggles.ssao=this.tier.ssao,this.toggles.ssr=this.tier.ssr,this.rebuildOcean(),this.W=0,this.rebuildTargets()}resize(){this.W=0,this.rebuildTargets()}rebuildTargets(){const e=this.dev,r=Math.min(window.devicePixelRatio||1,2),s=Math.max(2,Math.floor(this.canvas.clientWidth*r)),t=Math.max(2,Math.floor(this.canvas.clientHeight*r));if(s===this.W&&t===this.H)return;this.W=s,this.H=t,this.canvas.width=s,this.canvas.height=t,this.graph.reset(!0);const a=GPUTextureUsage.RENDER_ATTACHMENT,l=GPUTextureUsage.TEXTURE_BINDING,c=GPUTextureUsage.COPY_SRC,p=GPUTextureUsage.COPY_DST,n=a|l|c|p,f=Math.ceil(s/2),g=Math.ceil(t/2);this.atlas=Math.min(this.tier.shadowAtlas,this.ctx.maxTextureDim),this.g0View=this.graph.texture("g0",{width:s,height:t,format:"rgba8unorm",usage:n}),this.g1View=this.graph.texture("g1",{width:s,height:t,format:"rgba16float",usage:n}),this.g2View=this.graph.texture("g2",{width:s,height:t,format:"rgba8unorm",usage:n}),this.depthView=this.graph.texture("depth",{width:s,height:t,format:"depth32float",usage:n}),this.hdrAView=this.graph.texture("hdrA",{width:s,height:t,format:"rgba16float",usage:n}),this.hdrA2View=this.graph.texture("hdrA2",{width:s,height:t,format:"rgba16float",usage:n}),this.ssrHalfView=this.graph.texture("ssrHalf",{width:f,height:g,format:"rgba16float",usage:n}),this.hdrBView=this.graph.texture("hdrB",{width:s,height:t,format:"rgba16float",usage:n}),this.hdrCView=this.graph.texture("hdrC",{width:s,height:t,format:"rgba16float",usage:n}),this.historyView=this.graph.texture("history",{width:s,height:t,format:"rgba16float",usage:l|GPUTextureUsage.COPY_DST|c}),this.shadowView=this.graph.texture("shadowAtlas",{width:this.atlas,height:this.atlas,format:"depth24plus",usage:n}),this.aoHalfView=this.graph.texture("aoHalf",{width:f,height:g,format:"r8unorm",usage:n}),this.aoHalf2View=this.graph.texture("aoHalf2",{width:f,height:g,format:"r8unorm",usage:n}),this.bloomViews=[];let i=f,d=g;for(let u=0;u<Q;u++){const b=this.graph.texture(`bloom${u}`,{width:Math.max(i,2),height:Math.max(d,2),format:"rgba16float",usage:n});this.bloomViews.push(b),i=Math.max(i>>1,2),d=Math.max(d>>1,2)}const h=Math.ceil(s/16),y=Math.ceil(t/16);this.gridCountsBuf?.destroy(),this.gridIndicesBuf?.destroy(),this.gridCountsBuf=e.createBuffer({size:h*y*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.gridIndicesBuf=e.createBuffer({size:h*y*He*4,usage:GPUBufferUsage.STORAGE}),this.zerobuffer=new Uint32Array(h*y);for(const u of this.destBufs)u.destroy();this.destBufs=[],i=f,d=g;for(let u=0;u<Q;u++){const b=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(b,new Float32Array([i,d,1/i,1/d])),this.destBufs.push(b),i=Math.max(i>>1,2),d=Math.max(d>>1,2)}const v=e.createSampler({magFilter:"linear",minFilter:"linear"});this.bgGlobal=e.createBindGroup({layout:this.bglGlobal,entries:[{binding:0,resource:{buffer:this.camBuf}},{binding:1,resource:{buffer:this.frameBuf}},{binding:2,resource:this.shadowView},{binding:3,resource:e.createSampler({compare:"less"})}]}),this.bgCull=e.createBindGroup({layout:this.bglCull,entries:[{binding:0,resource:{buffer:this.lightsBuf}},{binding:1,resource:{buffer:this.gridCountsBuf}},{binding:2,resource:{buffer:this.gridIndicesBuf}},{binding:3,resource:this.depthView},{binding:4,resource:{buffer:this.camBuf}},{binding:5,resource:{buffer:this.frameBuf}}]}),this.bgSsao=e.createBindGroup({layout:this.bglSsao,entries:[{binding:0,resource:this.depthView},{binding:1,resource:this.g1View}]}),this.bgBlur=e.createBindGroup({layout:this.bglBlur,entries:[{binding:0,resource:this.aoHalfView},{binding:1,resource:v}]});const m=u=>[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:u},{binding:5,resource:{buffer:this.lightsBuf}},{binding:6,resource:{buffer:this.gridCountsBuf}},{binding:7,resource:{buffer:this.gridIndicesBuf}},{binding:8,resource:{buffer:this.probesBuf}}];this.bgLightingAo=e.createBindGroup({layout:this.bglLighting,entries:m(this.aoHalf2View)}),this.bgLightingWhite=e.createBindGroup({layout:this.bglLighting,entries:m(this.whiteView)}),this.bgSsr=e.createBindGroup({layout:this.bglSsr,entries:[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:this.hdrAView},{binding:5,resource:v}]}),this.bgRefl=e.createBindGroup({layout:this.bglRefl,entries:[{binding:0,resource:this.hdrAView},{binding:1,resource:this.ssrHalfView},{binding:2,resource:this.g1View},{binding:3,resource:this.g2View},{binding:4,resource:this.depthView},{binding:5,resource:v}]}),this.bgOcean=e.createBindGroup({layout:this.bglOcean,entries:[{binding:0,resource:this.hdrBView},{binding:1,resource:this.depthView},{binding:2,resource:v}]}),this.bgTaa=e.createBindGroup({layout:this.bglTaa,entries:[{binding:0,resource:this.hdrA2View},{binding:1,resource:this.historyView},{binding:2,resource:this.depthView},{binding:3,resource:v}]}),this.bgExp=e.createBindGroup({layout:this.bglExp,entries:[{binding:0,resource:this.hdrCView},{binding:1,resource:{buffer:this.statsBuf}},{binding:2,resource:{buffer:this.frameBuf}}]}),this.bloomPasses=[],this.bgBloom=[],this.bloomPasses.push({kind:"pre",src:this.hdrCView,dst:this.bloomViews[0],mip:0});for(let u=1;u<Q;u++)this.bloomPasses.push({kind:"down",src:this.bloomViews[u-1],dst:this.bloomViews[u],mip:u});for(let u=Q-2;u>=0;u--)this.bloomPasses.push({kind:"up",src:this.bloomViews[u+1],dst:this.bloomViews[u],mip:u});this.bloomPasses.forEach(u=>{const b=e.createBindGroup({layout:this.bglBloom0,entries:[{binding:0,resource:{buffer:this.frameBuf}},{binding:1,resource:{buffer:this.destBufs[u.mip]}}]}),_=e.createBindGroup({layout:this.bglBloom1,entries:[{binding:0,resource:u.src},{binding:1,resource:v},{binding:2,resource:{buffer:this.statsBuf}}]});this.bgBloom.push([b,_])});const C=u=>[{binding:0,resource:this.hdrCView},{binding:1,resource:u},{binding:2,resource:{buffer:this.statsBuf}},{binding:3,resource:v},{binding:4,resource:this.lutView}];this.bgTonemapBloom=e.createBindGroup({layout:this.bglTonemap,entries:C(this.bloomViews[0])}),this.bgTonemapBlack=e.createBindGroup({layout:this.bglTonemap,entries:C(this.blackView)})}passFilter=null;want(e){return!this.passFilter||this.passFilter.has(e)}render(e){const r=this.dev,s=performance.now(),t=this.W,a=this.H;if(t<4||a<4)return;this.graph.beginFrame();const l=this.camera;l.jitterEnabled=this.toggles.taa,this.uniforms.taaOn=this.toggles.taa?1:0,l.update(t/a),this.uniforms.updateSun(),this.uniforms.updateCascades(l);const c=Math.ceil(t/16),p=Math.ceil(a/16);this.uniforms.pack(l,t,a,e/1e3,this.scene.lights.length,this.uniforms.cascadeTexelWorld(),1/this.atlas,1.6,c,p,this.scene.waterLevel,4200,-22,2),this.put(this.camBuf,this.uniforms.camData),this.put(this.frameBuf,this.uniforms.frameData);for(let i=0;i<4;i++)this.put(this.cascadeBuf[i],this.uniforms.cascadeData[i]);this.put(this.gridCountsBuf,this.zerobuffer),this.uniforms.lutOn=this.toggles.lut?1:0,this.uniforms.ssrOn=this.toggles.ssr&&this.tier.ssr?1:0,this.uniforms.giOn=this.toggles.gi?1:0,this.uniforms.bakeProbes(),this.put(this.probesBuf,this.uniforms.probeData);const n=r.createCommandEncoder();if(this.want("shadow")){const i=n.beginRenderPass({colorAttachments:[],depthStencilAttachment:{view:this.shadowView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});i.setPipeline(this.pShadow),i.setVertexBuffer(0,this.sceneVB),i.setIndexBuffer(this.sceneIB,"uint32");const d=this.atlas/2;for(let h=0;h<4;h++){i.setViewport((h&1)*d,(h>>1)*d,d,d,0,1),i.setScissorRect((h&1)*d,(h>>1)*d,d,d),i.setBindGroup(0,this.bgCascade[h]);for(const y of this.scene.groups)i.drawIndexed(y.count,1,y.firstIndex)}i.end()}if(this.want("gbuffer")){const i=n.beginRenderPass({colorAttachments:[{view:this.g0View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g1View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g2View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});i.setPipeline(this.pGbuffer),i.setBindGroup(0,this.bgGlobal),i.setVertexBuffer(0,this.sceneVB),i.setIndexBuffer(this.sceneIB,"uint32"),this.scene.groups.forEach((d,h)=>{i.setBindGroup(1,this.bgMesh[h]),i.drawIndexed(d.count,1,d.firstIndex)}),i.end()}if(this.want("cull")){const i=n.beginComputePass();i.setPipeline(this.pCull),i.setBindGroup(0,this.bgCull),i.dispatchWorkgroups(c,p),i.end()}const f=this.want("ssao")&&this.toggles.ssao&&this.tier.ssao;if(f){const i=Math.ceil(t/2),d=Math.ceil(a/2),h=n.beginRenderPass({colorAttachments:[{view:this.aoHalfView,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.pSsao),h.setBindGroup(0,this.bgGlobal),h.setBindGroup(1,this.bgSsao),h.setViewport(0,0,i,d,0,1),h.draw(3),h.end();const y=n.beginRenderPass({colorAttachments:[{view:this.aoHalf2View,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});y.setPipeline(this.pBlur),y.setBindGroup(0,this.bgGlobal),y.setBindGroup(1,this.bgBlur),y.setViewport(0,0,i,d,0,1),y.draw(3),y.end()}if(this.want("lighting")){const i=n.beginRenderPass({colorAttachments:[{view:this.hdrAView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.pLighting),i.setBindGroup(0,this.bgGlobal),i.setBindGroup(1,f?this.bgLightingAo:this.bgLightingWhite),i.draw(3),i.end()}if(this.want("ssr")&&this.toggles.ssr&&this.tier.ssr){const i=Math.ceil(t/2),d=Math.ceil(a/2),h=n.beginRenderPass({colorAttachments:[{view:this.ssrHalfView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.pSsr),h.setBindGroup(0,this.bgGlobal),h.setBindGroup(1,this.bgSsr),h.setViewport(0,0,i,d,0,1),h.draw(3),h.end()}if(this.want("refl")){const i=n.beginRenderPass({colorAttachments:[{view:this.hdrA2View,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.pRefl),i.setBindGroup(0,this.bgGlobal),i.setBindGroup(1,this.bgRefl),i.draw(3),i.end()}if(this.want("taa")){const i=n.beginRenderPass({colorAttachments:[{view:this.hdrBView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});i.setPipeline(this.pTaa),i.setBindGroup(0,this.bgGlobal),i.setBindGroup(1,this.bgTaa),i.draw(3),i.end(),n.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("history")},[t,a,1])}if(n.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("hdrC")},[t,a,1]),this.want("ocean")&&this.toggles.ocean){const i=new URLSearchParams(location.search).get("odepth")==="0",d=new URLSearchParams(location.search).get("oload")!=="clear",h=n.beginRenderPass({colorAttachments:[{view:this.hdrCView,loadOp:d?"load":"clear",clearValue:{r:0,g:0,b:0,a:1},storeOp:"store"}],...i?{}:{depthStencilAttachment:{view:this.depthView,depthReadOnly:!0}}});h.setPipeline(this.pOcean),h.setBindGroup(0,this.bgGlobal),new URLSearchParams(location.search).get("obgl")!=="0"&&h.setBindGroup(1,this.bgOcean),h.setVertexBuffer(0,this.oceanNearVB),h.setIndexBuffer(this.oceanNearIB,"uint32"),h.drawIndexed(this.oceanNearCount),new URLSearchParams(location.search).get("ofar")!=="0"&&(h.setVertexBuffer(0,this.oceanFarVB),h.setIndexBuffer(this.oceanFarIB,"uint32"),h.drawIndexed(this.oceanFarCount)),h.end()}if(this.want("exposure")){const i=n.beginComputePass();i.setPipeline(this.pExpAccum),i.setBindGroup(0,this.bgExp),i.dispatchWorkgroups(Math.ceil(t/4/8),Math.ceil(a/4/8)),i.setPipeline(this.pExpFinal),i.dispatchWorkgroups(1,1,1),i.end()}if(this.want("bloom")&&this.toggles.bloom&&this.bloomPasses.forEach((i,d)=>{const h=i.kind==="pre"?this.pBloomPre:i.kind==="down"?this.pBloomDown:this.pBloomUp,y=Math.max(Math.ceil(t/2)>>i.mip,2),v=Math.max(Math.ceil(a/2)>>i.mip,2),m=n.beginRenderPass({colorAttachments:[{view:i.dst,clearValue:{r:0,g:0,b:0,a:1},loadOp:i.kind==="up"?"load":"clear",storeOp:"store"}]});m.setPipeline(h),m.setBindGroup(0,this.bgBloom[d][0]),m.setBindGroup(1,this.bgBloom[d][1]),m.setViewport(0,0,y,v,0,1),m.draw(3),m.end()}),this.want("tonemap")){const d=new URLSearchParams(location.search).get("ttex")==="1"?this.graph.texture("tonemapTex",{width:t,height:a,format:this.ctx.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}):this.ctx.context.getCurrentTexture().createView(),h=n.beginRenderPass({colorAttachments:[{view:d,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.pTonemap),h.setBindGroup(0,this.bgGlobal),h.setBindGroup(1,this.toggles.bloom?this.bgTonemapBloom:this.bgTonemapBlack),h.setViewport(0,0,t,a,0,1),h.draw(3),h.end()}r.queue.submit([n.finish()]),this.lastFrameCpuMs=performance.now()-s,window.__FRAME_N__=window.__FRAME_N__===void 0?performance.now()/1e3:window.__FRAME_N__}async debugSnapshot(e,r,s=0,t=0){const a=this.dev,l=Math.min(e??this.W,this.W),c=Math.min(r??this.H,this.H),p=this.graphTexture("tonemapTex"),n=Math.ceil(l*4/256)*256,f=a.createBuffer({size:n*c,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),g=a.createCommandEncoder();g.copyTextureToBuffer({texture:p,origin:[s,t,0]},{buffer:f,bytesPerRow:n,rowsPerImage:c},[l,c,1]),a.queue.submit([g.finish()]),await f.mapAsync(GPUMapMode.READ);const i=new Uint8Array(f.getMappedRange()),d=new Uint8Array(l*c*4);for(let h=0;h<c;h++)for(let y=0;y<l;y++){const v=h*n+y*4,m=h*l*4+y*4;d[m]=i[v+2],d[m+1]=i[v+1],d[m+2]=i[v],d[m+3]=255}return f.unmap(),f.destroy(),{w:l,h:c,rgba:d}}async debugRow(e,r,s,t,a=16){const l=this.dev,c=[];for(let v=s;v<=t;v+=a)c.push(Math.min(v,this.W-1));const p=c.length,n=256,f=this.graphTexture(e),g=l.createBuffer({size:n*p,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),i=l.createCommandEncoder();c.forEach((v,m)=>{i.copyTextureToBuffer({texture:f,origin:[v,Math.min(r,this.H-1),0]},{buffer:g,offset:m*n,bytesPerRow:n,rowsPerImage:1},[1,1,1])}),l.queue.submit([i.finish()]),await g.mapAsync(GPUMapMode.READ);const d=new Uint8Array(g.getMappedRange()),h=(v,m)=>{const C=v|m<<8,u=(C&32768)>>15,b=(C&31744)>>10,_=C&1023;let S;return b===0?S=_*2**-24:b===31?S=_?NaN:1/0:S=(1+_/1024)*2**(b-15),(u?-1:1)*S},y={x:c};for(let v=0;v<p;v++){const m=v*n;y[`p${v}`]=[h(d[m],d[m+1]),h(d[m+2],d[m+3])]}return g.unmap(),g.destroy(),y}async debugSample(){const e=this.dev,r=this.W,s=this.H,t=[["g0",this.graphTexture("g0"),r>>1,s>>1,"all"],["hdrA_c",this.graphTexture("hdrA"),r>>1,s>>1,"all"],["hdrA_q",this.graphTexture("hdrA"),r>>2,s>>1,"all"],["hdrA_3q",this.graphTexture("hdrA"),3*r>>2,3*s>>2,"all"],["hdrA_sky",this.graphTexture("hdrA"),r>>1,Math.max(2,s*.08|0),"all"],["hdrC_c",this.graphTexture("hdrC"),r>>1,s>>1,"all"]],a=e.createCommandEncoder(),l={};for(const[p,n,f,g,i]of t)l[p]=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a.copyTextureToBuffer({texture:n,origin:[f,g,0],aspect:i},{buffer:l[p],bytesPerRow:256,rowsPerImage:1},[1,1,1]);e.queue.submit([a.finish()]);const c={};for(const[p]of t){await l[p].mapAsync(GPUMapMode.READ);const n=new Uint8Array(l[p].getMappedRange());c[p]=Array.from(n.slice(0,8)),l[p].unmap(),l[p].destroy()}return c}forceEv(e){this.dev.queue.writeBuffer(this.statsBuf,256,new Float32Array([e]))}async readStats(){const e=this.dev,r=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),s=e.createCommandEncoder();s.copyBufferToBuffer(this.statsBuf,256,r,0,12),e.queue.submit([s.finish()]),await r.mapAsync(GPUMapMode.READ);const t=new Float32Array(r.getMappedRange()),a={ev:t[0],avg:t[1]};return r.unmap(),r.destroy(),a}graphTexture(e){const r=this.graph.resources.get(e);if(!r||!r.texture)throw new Error(`graph texture ${e} missing`);return r.texture}}function qe(o,e,r,s){const t=w=>document.getElementById(w),l=[...t("tier-seg").querySelectorAll("button")],c=()=>{l.forEach(w=>w.classList.toggle("active",Number(w.dataset.tier)===o.tierIndex)),t("hud-tier").textContent=`tier · ${te[o.tierIndex].name}`};l.forEach(w=>w.addEventListener("click",()=>{o.setTier(Number(w.dataset.tier)),t("tg-ssao").checked=o.toggles.ssao,t("tg-taa").checked=o.toggles.taa,t("tg-ssr").checked=o.toggles.ssr,c()})),c();const p=(w,L,P,z)=>{const D=t(w),M=t(L),U=()=>{const N=Number(D.value);z(N),M.textContent=P(N)};D.addEventListener("input",U),U()};p("sun-el","val-sun-el",w=>`${w}°`,w=>{o.uniforms.sunElevation=w}),p("sun-az","val-sun-az",w=>`${w}°`,w=>{o.uniforms.sunAzimuth=w}),p("ev-bias","val-ev",w=>w.toFixed(1),w=>{o.uniforms.evBias=w}),p("fog-dens","val-fog",w=>w.toFixed(2),w=>{o.uniforms.fogScale=w});const n=(w,L)=>{const P=t(w);P.checked=o.toggles[L],P.addEventListener("change",()=>{o.toggles[L]=P.checked})};n("tg-ssao","ssao"),n("tg-taa","taa"),n("tg-bloom","bloom"),n("tg-ocean","ocean"),n("tg-ssr","ssr"),n("tg-lut","lut"),n("tg-gi","gi");const f=t("tg-wire");f.addEventListener("change",()=>{o.uniforms.debugMode=f.checked?1:0});const g=t("shots");o.uniforms;const i=o.camera,d=window.__SHOTS__??[];let h=-1,y={eye:[0,0,0],look:[0,0,0]};window.__CAM_ANIM__=(w,L)=>{y=L,h=0},d.forEach((w,L)=>{const P=document.createElement("button");P.textContent=`${L+1}. ${w.name}`,P.title=`Точка съёмки ${L+1}`,P.addEventListener("click",()=>{document.exitPointerLock?.();const z={eye:i.eye(),look:i.lookAtPoint()};window.__CAM_ANIM__?.(z,{eye:w.eye,look:w.look})}),g.appendChild(P)}),window.__CAM_TICK__=w=>{h<0||(h=Math.min(h+w/1.4,1),i.animateTo(y,h),h>=1&&(h=-1))};const v=t("btn-fly"),m=()=>{v.textContent=s()?"Орбитальный режим":"Свободный полёт"};v.addEventListener("click",()=>{if(s())document.exitPointerLock?.();else{i.position=i.eye();const w=i.forwardOfView();i.flyYaw=Math.atan2(w[2],w[0]),i.flyPitch=Math.asin(Math.max(-1,Math.min(1,w[1]))),i.mode="fly",o.canvas.requestPointerLock?.()}m()}),document.addEventListener("pointerlockchange",()=>{!s()&&i.mode==="fly"&&(i.mode="orbit"),m()});const C=t("hud-panel"),u=t("hud-toggle"),b=w=>{C.classList.toggle("collapsed",w),u.style.display=w?"block":"none"};u.addEventListener("click",()=>b(!1)),document.addEventListener("keydown",w=>{(w.key==="h"||w.key==="H")&&b(!C.classList.contains("collapsed"))});const _=t("fps-graph"),S=_.getContext("2d"),T=[];let x=16.6;window.__FPS_TICK__=w=>{x=x*.9+w*.1,T.push(w),T.length>110&&T.shift(),S.clearRect(0,0,_.width,_.height),S.strokeStyle="rgba(242,106,27,0.35)",S.beginPath(),S.moveTo(0,_.height-16.6/40*_.height),S.lineTo(_.width,_.height-16.6/40*_.height),S.stroke(),S.strokeStyle="#F26A1B",S.beginPath(),T.forEach((L,P)=>{const z=P/109*_.width,D=_.height-Math.min(L/40,1)*_.height;P===0?S.moveTo(z,D):S.lineTo(z,D)}),S.stroke(),t("hud-fps").textContent=`${(1e3/Math.max(x,.01)).toFixed(0)} fps · ${x.toFixed(1)} ms`},e.adapter.textContent=o.adapterNameShort()}const Xe=document.getElementById("boot"),Ye=document.getElementById("boot-status"),$e=document.getElementById("boot-bar-fill"),re=document.getElementById("boot-detail"),Ke=document.getElementById("hud");function k(o,e=-1,r=""){Ye.textContent=o,e>=0&&($e.style.width=`${Math.round(e*100)}%`),r&&(re.textContent+=(re.textContent?`
`:"")+r)}function oe(o,e){k("Не удалось запустить WebGPU",1);const r=[o,"",e];re.textContent=r.join(`
`),re.style.color="#d89a55",window.__wgpu={status:"unsupported",error:o}}async function Ze(){const o=document.getElementById("gpu");k("Запрос GPU-адаптера…",.1);let e;try{e=await xe(o)}catch(x){oe(String(x.message??x),["Поддержка WebGPU:","· Chrome / Edge 113+ (Windows, macOS, ChromeOS)","· Firefox 141+ (Windows)","· Safari 26+ (macOS, iOS)","","Если браузер поддерживает — включите флаг или проверьте, что аппаратное ускорение активно."].join(`
`));return}k("Компиляция пайплайнов…",.35,`адаптер: ${e.adapterName}`),console.log(`[boot] device ok @${(performance.now()/1e3).toFixed(2)}s`),k("…",.4,`лимиты: maxTex2D=${e.limits.maxTextureDimension2D} storage=${(e.limits.maxStorageBufferBindingSize/(1<<20)).toFixed(0)} МБ`),be(e.device,x=>{console.error("[gpu]",x),window.__wgpu={status:"error",error:x},k("Ошибка GPU",-1,x)}),console.log(`[boot] pre-scene @${(performance.now()/1e3).toFixed(2)}s`);const r=ye();window.__SHOTS__=r.shots,console.log(`[boot] scene built @${(performance.now()/1e3).toFixed(2)}s`),window.__DEBUG__={groups:r.groups.map(x=>({matId:x.matId,tris:x.count/3})),verts:r.vertexData.length/8,tris:r.indexData.length/3,lights:r.lights.length,probes:r.probes.length};const s=new je(e,r);try{await s.init()}catch(x){console.error(x),oe(`Инициализация рендерера: ${String(x.message??x)}`,"Смотрите консоль (F12) для деталей.");return}const t=new URLSearchParams(location.search),a=t.get("tier"),l=t.get("only");if(l&&(s.passFilter=new Set(l.split(",").map(x=>x.trim()).filter(Boolean))),s.setTier(a?Number(a):2),t.has("notaa")){s.toggles.taa=!1;const x=document.getElementById("tg-taa");x&&(x.checked=!1)}if(t.has("taayes")){s.toggles.taa=!0;const x=document.getElementById("tg-taa");x&&(x.checked=!0)}const c=(x,w,L)=>{if(t.has(x)){s.toggles[w]=!1;const P=document.getElementById(L);P&&(P.checked=!1)}};c("nossr","ssr","tg-ssr"),c("nolut","lut","tg-lut"),c("gino","gi","tg-gi"),s.camera.target=[-8,2.2,0],s.camera.distance=30,s.camera.yaw=4.05,s.camera.pitch=.22,s.resize(),console.log(`[boot] renderer ready @${(performance.now()/1e3).toFixed(2)}s`),k("Сцена собрана. Старт рендера…",1),qe(s,{adapter:document.getElementById("hud-adapter"),fps:document.getElementById("hud-fps"),tier:document.getElementById("hud-tier")},()=>{},()=>document.pointerLockElement===o);const p=t.get("evbias");if(p!==null){const x=document.getElementById("ev-bias");x&&(x.value=p),s.uniforms.evBias=Number(p)}t.has("evlock")&&(s.uniforms.evLock=1);const n=t.get("dbg");if(n!==null){s.uniforms.debugMode=Number(n);const x=document.getElementById("tg-wire");x&&(x.checked=Number(n)===1)}window.__PROBE__=()=>s.debugSample(),window.__SNAPBUF__=async(x,w,L)=>{_=!0,await new Promise(P=>setTimeout(P,120));try{const P=Math.min(x??s.canvas.width,s.canvas.width),z=Math.min(w??s.canvas.height,s.canvas.height),D=new Uint8Array(P*z*4),M=320,U=180;let N=0;for(let A=0;A<z;A+=U)for(let F=0;F<P;F+=M){const q=Math.min(M,P-F),ne=Math.min(U,z-A),ge=await s.debugSnapshot(q,ne,F,A);for(let $=0;$<ne;$++)D.set(ge.rgba.subarray($*q*4,($+1)*q*4),((A+$)*P+F)*4);console.log(`[snap] tile ${N++} ok`)}console.log("[snap] tiles done"),console.log("[snap] png start");let Z="";const H=49152;for(let A=0;A<D.length;A+=H)Z+=btoa(String.fromCharCode(...D.subarray(A,Math.min(A+H,D.length))));const j={w:P,h:z,b64:Z};if(L){const A=document.createElement("canvas");A.width=P,A.height=z;const F=A.getContext("2d"),q=F.createImageData(P,z);q.data.set(D),F.putImageData(q,0,0),j.png=A.toDataURL("image/png").split(",")[1],console.log("[snap] png done")}return j}finally{_=!1}},window.__SET_DBG__=x=>{s.uniforms.debugMode=x},window.__PROBEDATA__=()=>Array.from(s.uniforms.probeData.slice(0,40)),window.__STATS__=()=>s.readStats(),window.__CAM_POSE__=(x,w)=>{const L=s.camera;L.target=w;const P=[x[0]-w[0],x[1]-w[1],x[2]-w[2]];L.distance=Math.max(2.2,Math.hypot(P[0],P[1],P[2])),L.yaw=Math.atan2(P[2],P[0]);const z=Math.hypot(P[0],P[2]);L.pitch=Math.atan2(P[1],z)},window.__ROW__=(x,w,L,P,z)=>s.debugRow(x,w,L,P,z);const f=s.canvas;let g=!1,i=0,d=0,h=!1;f.addEventListener("pointerdown",x=>{document.pointerLockElement!==f&&(g=!0,h=x.button===2||x.button===1,i=x.clientX,d=x.clientY,f.setPointerCapture(x.pointerId))}),f.addEventListener("pointermove",x=>{if(!g)return;const w=x.clientX-i,L=x.clientY-d;i=x.clientX,d=x.clientY,h?s.camera.pan(w,L):s.camera.moveOrbit(w,L)}),f.addEventListener("pointerup",x=>{g=!1,f.releasePointerCapture(x.pointerId)}),f.addEventListener("contextmenu",x=>x.preventDefault()),f.addEventListener("wheel",x=>{x.preventDefault(),s.camera.zoom(x.deltaY)},{passive:!1});const y=new Set;document.addEventListener("keydown",x=>y.add(x.code.toLowerCase())),document.addEventListener("keyup",x=>y.delete(x.code.toLowerCase()));let v=0;window.addEventListener("resize",()=>{clearTimeout(v),v=window.setTimeout(()=>s.resize(),120)}),performance.now();let m=!1;const C=Number(t.get("fpscap")??0);let u=0,b=0,_=!1;const S=x=>{if(_){m&&requestAnimationFrame(S);return}if(C>0&&x-u<C){m&&requestAnimationFrame(S);return}u=x;const w=b>0?Math.min(x-b,100):16;b=x,window.__CAM_TICK__?.(w/1e3),s.camera.mode==="fly"&&s.camera.flyStep(w/1e3,y);try{s.render(w)}catch(L){console.error(L),k("Ошибка кадра",-1,String(L.message??L)),m=!1;return}window.__FPS_TICK__?.(w),window.__wgpu={status:"running",adapter:e.adapterName,tier:te[s.tierIndex].name},m&&requestAnimationFrame(S)};new URLSearchParams(location.search).has("still")?window.__wgpu={status:"running",adapter:e.adapterName,tier:"still"}:(m=!0,requestAnimationFrame(S)),setTimeout(()=>{Xe.classList.add("fade"),Ke.classList.remove("hidden")},450)}Ze().catch(o=>{console.error(o),oe(String(o.message??o),"Смотрите консоль (F12).")});

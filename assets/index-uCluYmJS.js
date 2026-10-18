(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&t(u)}).observe(document,{childList:!0,subtree:!0});function i(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(s){if(s.ep)return;s.ep=!0;const o=i(s);fetch(s.href,o)}})();function Xe(n){let e="",i="",t="";const s=n.info;s&&(e=s.vendor||"",i=s.architecture||"",t=s.description||"");const o=[e,i,t].filter(l=>l&&l.length>0);return{name:o.length?o.join(" · "):"WebGPU adapter",features:[...n.features]}}async function $e(n){const e=navigator.gpu;if(!e)throw new Error("navigator.gpu недоступен — браузер без WebGPU");const i=[{powerPreference:"high-performance"},{},{forceFallbackAdapter:!0}],t=window.__GPUKEEP__??[];window.__GPUKEEP__=t;let s=null,o=null;for(const r of i){let p=null;try{p=await e.requestAdapter(r)}catch{p=null}if(!p)continue;let h;try{h=await p.requestDevice({label:"hdrp-webgpu-device",requiredLimits:{maxTextureDimension2D:Math.min(p.limits.maxTextureDimension2D,8192),maxStorageBufferBindingSize:Math.min(p.limits.maxStorageBufferBindingSize,1<<28)}})}catch{continue}const b=new Promise(w=>h.lost.then(()=>w(!0)));if(await Promise.race([b,new Promise(w=>setTimeout(()=>w(!1),350))])){try{h.destroy()}catch{}continue}s=h,o=p;break}if(o&&t.push(o),s&&t.push(s),!o||!s)throw new Error("Не получен рабочий GPUDevice (все кандидаты отклонены)");const{name:u}=Xe(o),l=n.getContext("webgpu");if(!l)throw new Error('canvas.getContext("webgpu") вернул null');const m=e.getPreferredCanvasFormat();l.configure({device:s,format:m,alphaMode:"opaque"});const c=globalThis;c.__devSeq=(c.__devSeq??0)+1;const f=c.__devSeq;window.__DEV_OK__=`#${f} @${(performance.now()/1e3).toFixed(2)}s`,s.lost.then(r=>{const p=`#${f} ${r.reason}: ${r.message} @${(performance.now()/1e3).toFixed(2)}s`;console.error(`[gpu] DEVICE LOST ${p}`),window.__DEVLOST__=p});const d={maxTextureDimension2D:s.limits.maxTextureDimension2D,maxBufferSize:s.limits.maxBufferSize,maxStorageBufferBindingSize:s.limits.maxStorageBufferBindingSize,maxComputeWorkgroupsPerDimension:s.limits.maxComputeWorkgroupsPerDimension,maxUniformBufferBindingSize:s.limits.maxUniformBufferBindingSize};return{device:s,context:l,canvas:n,format:m,adapterName:u,features:[...s.features],limits:d,maxTextureDim:s.limits.maxTextureDimension2D}}function Je(n,e){n.addEventListener("uncapturederror",i=>{e(`GPU uncaptured error: ${i.error.message}`)})}const X=(n,e,i,t)=>{let[s,o,u]=[n,e,i];if(t.rz){const l=Math.cos(t.rz),m=Math.sin(t.rz),c=s*l-o*m,f=s*m+o*l;s=c,o=f}if(t.ry){const l=Math.cos(t.ry),m=Math.sin(t.ry),c=s*l+u*m,f=-s*m+u*l;s=c,u=f}return[s+t.translate[0],o+t.translate[1],u+t.translate[2]]},$=(n,e,i,t)=>{let[s,o,u]=[n,e,i];if(t.rz){const l=Math.cos(t.rz),m=Math.sin(t.rz),c=s*l-o*m,f=s*m+o*l;s=c,o=f}if(t.ry){const l=Math.cos(t.ry),m=Math.sin(t.ry),c=s*l+u*m,f=-s*m+u*l;s=c,u=f}return[s,o,u]};class Ze{pos=[];nrm=[];uv=[];idx=[];vert(e,i,t,s){return this.pos.push(e[0],e[1],e[2]),this.nrm.push(i[0],i[1],i[2]),this.uv.push(t,s),this.pos.length/3-1}quad(e,i,t,s){this.idx.push(e,i,t,e,t,s)}addBox(e,i,t){const s={translate:e,...t},o=i[0]/2,u=i[1]/2,l=i[2]/2,m=[{n:[0,0,1],corners:[[-o,-u,l],[o,-u,l],[o,u,l],[-o,u,l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,0,-1],corners:[[o,-u,-l],[-o,-u,-l],[-o,u,-l],[o,u,-l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[1,0,0],corners:[[o,-u,l],[o,-u,-l],[o,u,-l],[o,u,l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[-1,0,0],corners:[[-o,-u,-l],[-o,-u,l],[-o,u,l],[-o,u,-l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,1,0],corners:[[-o,u,l],[o,u,l],[o,u,-l],[-o,u,-l]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,-1,0],corners:[[-o,-u,-l],[o,-u,-l],[o,-u,l],[-o,-u,l]],uv:[[0,0],[1,0],[1,1],[0,1]]}];for(const c of m){const f=$(c.n[0],c.n[1],c.n[2],s),d=c.corners.map((r,p)=>this.vert(X(r[0],r[1],r[2],s),f,c.uv[p][0],c.uv[p][1]));this.quad(d[0],d[1],d[2],d[3])}return this}addCylinder(e,i,t,s,o=10,u){const l={translate:e,...u},m=s/2,c=this.pos.length/3;for(let f=0;f<=o;f++){const d=f/o*Math.PI*2,r=Math.cos(d),p=Math.sin(d),h=(i-t)/s,b=Math.hypot(1,h);this.vert(X(r*i,-m,p*i,l),$(r/b,h/b,p/b,l),f/o*4,0),this.vert(X(r*t,m,p*t,l),$(r/b,h/b,p/b,l),f/o*4,1)}for(let f=0;f<o;f++){const d=c+f*2;this.quad(d,d+2,d+3,d+1)}if(t>.001){const f=this.vert(X(0,m,0,l),$(0,1,0,l),.5,.5);for(let d=0;d<o;d++){const r=d/o*Math.PI*2,p=(d+1)/o*Math.PI*2,h=this.vert(X(Math.cos(r)*t,m,Math.sin(r)*t,l),$(0,1,0,l),0,0),b=this.vert(X(Math.cos(p)*t,m,Math.sin(p)*t,l),$(0,1,0,l),0,0);this.quad(f,h,b,f)}}if(i>.001){const f=this.vert(X(0,-m,0,l),$(0,-1,0,l),.5,.5);for(let d=0;d<o;d++){const r=d/o*Math.PI*2,p=(d+1)/o*Math.PI*2,h=this.vert(X(Math.cos(r)*i,-m,Math.sin(r)*i,l),$(0,-1,0,l),0,0),b=this.vert(X(Math.cos(p)*i,-m,Math.sin(p)*i,l),$(0,-1,0,l),0,0);this.quad(f,b,h,f)}}return this}addSphere(e,i,t,s=12,o=8){const u=this.pos.length/3;for(let l=0;l<=o;l++){const m=l/o,c=m*Math.PI;for(let f=0;f<=s;f++){const d=f/s,r=d*Math.PI*2,p=[Math.sin(c)*Math.cos(r),Math.cos(c),Math.sin(c)*Math.sin(r)],h=[e[0]+p[0]*i,e[1]+p[1]*i,e[2]+p[2]*i];t&&t(h,p),this.vert(h,p,d*3,m*2)}}for(let l=0;l<o;l++)for(let m=0;m<s;m++){const c=u+l*(s+1)+m,f=c+s+1;this.quad(c,f,f+1,c+1)}return this}build(){const e=this.pos.length/3,i=new Float32Array(e*8);for(let t=0;t<e;t++)i.set([this.pos[t*3],this.pos[t*3+1],this.pos[t*3+2]],t*8),i.set([this.nrm[t*3],this.nrm[t*3+1],this.nrm[t*3+2]],t*8+3),i.set([this.uv[t*2],this.uv[t*2+1]],t*8+6);return{vertexData:i,indexData:new Uint32Array(this.idx)}}}const _={CONCRETE:0,PLASTER:1,WOOD_FLOOR:2,WOOD_DECK:3,METAL:4,FABRIC:5,FOLIAGE:6,ROCK:7,EMISSIVE:8};let he=1337;function C(){return he=he*1664525+1013904223>>>0,he/4294967296}function Ke(){he=1337;const n=new Map,e=v=>{let z=n.get(v);return z||(z=new Ze,n.set(v,z)),z},i=0;e(_.CONCRETE).addBox([0,.6,0],[38,1.2,30]),e(_.CONCRETE).addBox([0,-2.2,0],[420,1,420]),e(_.WOOD_FLOOR).addBox([-11,1.22,0],[10,.05,12]),e(_.PLASTER).addBox([-16,2.65,-4],[.35,2.9,4]),e(_.PLASTER).addBox([-16,2.65,4],[.35,2.9,4]),e(_.PLASTER).addBox([-16,.65,0],[.35,1.1,4]),e(_.PLASTER).addBox([-16,3.75,0],[.35,1.2,4]),e(_.PLASTER).addBox([-11,2.85,6],[10,3.3,.35]),e(_.PLASTER).addBox([-11,2.85,-6],[10,3.3,.35]),e(_.PLASTER).addBox([-6,2.85,-3.6],[.35,3.3,4.8]),e(_.PLASTER).addBox([-6,2.85,3.6],[.35,3.3,4.8]),e(_.PLASTER).addBox([-6,3.6,0],[.35,1.8,2.4]),e(_.PLASTER).addBox([-11,4.65,0],[10,.3,12]),e(_.WOOD_FLOOR).addBox([-4.5,1.22,0],[3,.05,3]),e(_.PLASTER).addBox([-4.5,2.7,-1.5],[3,3,.3]),e(_.PLASTER).addBox([-4.5,2.7,1.5],[3,3,.3]),e(_.PLASTER).addBox([-4.5,4.35,0],[3,.3,3.3]),e(_.WOOD_FLOOR).addBox([1.5,1.22,0],[9,.05,9]),e(_.PLASTER).addBox([-3,3.35,-2.85],[.35,4.3,3.3]),e(_.PLASTER).addBox([-3,3.35,2.85],[.35,4.3,3.3]),e(_.PLASTER).addBox([-3,4.2,0],[.35,2,2.4]),e(_.PLASTER).addBox([1.5,3.35,4.5],[9,4.3,.35]),e(_.PLASTER).addBox([1.5,3.35,-4.5],[9,4.3,.35]),e(_.PLASTER).addBox([6,3.35,-3],[.35,4.3,3]),e(_.PLASTER).addBox([6,3.35,3],[.35,4.3,3]),e(_.PLASTER).addBox([6,4.2,0],[.35,2,3]),e(_.PLASTER).addBox([-.9,5.65,0],[4.2,.3,9]),e(_.PLASTER).addBox([4.5,5.65,0],[3,.3,9]),e(_.PLASTER).addBox([1.5,5.65,-3],[6,.3,3]),e(_.PLASTER).addBox([1.5,5.65,3],[6,.3,3]),e(_.CONCRETE).addBox([1.5,5.9,-1.55],[3.2,.4,.12]),e(_.CONCRETE).addBox([1.5,5.9,1.55],[3.2,.4,.12]),e(_.CONCRETE).addBox([-.05,5.9,0],[.12,.4,3.2]),e(_.CONCRETE).addBox([3.05,5.9,0],[.12,.4,3.2]),e(_.CONCRETE).addBox([4.6,1.5,3.2],[1.2,.6,1.2]);for(let v=0;v<5;v++){const z=C()*Math.PI*2;e(_.FOLIAGE).addSphere([4.6+Math.cos(z)*.35,1.95+C()*.3,3.2+Math.sin(z)*.35],.32+C()*.15,T=>{T[1]*=.7},8,6)}e(_.WOOD_FLOOR).addBox([11,1.22,0],[10,.05,10]),e(_.PLASTER).addBox([11,2.85,5],[10,3.3,.35]),e(_.PLASTER).addBox([11,2.85,-5],[10,3.3,.35]),e(_.PLASTER).addBox([16,2.85,-3.75],[.35,3.3,2.5]),e(_.PLASTER).addBox([16,2.85,3.75],[.35,3.3,2.5]),e(_.PLASTER).addBox([16,.6,0],[.35,1,5]),e(_.PLASTER).addBox([16,3.75,0],[.35,1.2,5]),e(_.PLASTER).addBox([11,4.65,0],[10,.3,10]),e(_.WOOD_FLOOR).addBox([14.3,1.75,-1.2],[2,1.05,5.2]),e(_.METAL).addBox([15.6,2.4,-1.2],[.08,.04,5.2]),e(_.PLASTER).addBox([15.75,3.1,-1.2],[.4,1.9,5.2]);for(const v of[-2.8,-1.4,0,1.4])e(_.FABRIC).addCylinder([13,1.55,v],.22,.24,.68,10),e(_.METAL).addCylinder([13,1.2,v],.05,.05,.35,8);e(_.FABRIC).addBox([8.2,1.6,-2.8],[1.1,.75,2.6]),e(_.FABRIC).addBox([7.8,2,-2.8],[.35,.8,2.6]),e(_.FABRIC).addBox([8.2,1.75,-3.9],[1,.45,.3]),e(_.FABRIC).addBox([8.2,1.75,-1.7],[1,.45,.3]),e(_.FABRIC).addBox([10,1.26,-1.5],[4.2,.03,3.2]);for(const v of[-2.6,.2])e(_.METAL).addCylinder([14.2,4,v],.008,.008,1.2,6),e(_.METAL).addCylinder([14.2,3.32,v],.16,.06,.16,12),e(_.EMISSIVE).addSphere([14.2,3.24,v],.055,void 0,8,6);e(_.METAL).addCylinder([1.5,5.5,0],.008,.008,1.6,6),e(_.METAL).addCylinder([1.5,4.62,0],.2,.07,.18,12),e(_.EMISSIVE).addSphere([1.5,4.52,0],.06,void 0,8,6),e(_.METAL).addCylinder([8.6,1.85,2.8],.02,.02,1.3,6),e(_.METAL).addCylinder([8.6,1.22,2.8],.16,.16,.04,10),e(_.EMISSIVE).addCylinder([8.6,2.62,2.8],.11,.14,.24,12);for(const v of[-1.15,1.15])e(_.EMISSIVE).addBox([-4.5,2.55,v],[.16,.1,.24]);for(const v of[-2.6,2.6])e(_.EMISSIVE).addCylinder([-11,4.42,v],.09,.09,.05,10);for(const v of[-4.6,4.6])e(_.METAL).addCylinder([-18.5,1.5,v],.06,.06,.62,8),e(_.EMISSIVE).addCylinder([-18.5,1.86,v],.045,.05,.1,8);for(const v of[-4.6,0,4.6])e(_.CONCRETE).addCylinder([-17.2,3,v],.22,.26,3.6,12);e(_.PLASTER).addBox([-17.2,5,0],[.9,.5,11]);for(let v=0;v<24;v++){const z=-17.4-v*1;e(_.WOOD_DECK).addBox([z,1.08,0],[.88,.09,3.6])}e(_.WOOD_DECK).addBox([-29,.92,-1.55],[24,.16,.28]),e(_.WOOD_DECK).addBox([-29,.92,1.55],[24,.16,.28]);for(const v of[-18,-22,-26,-30,-34,-38])for(const z of[-1.9,1.9])e(_.WOOD_DECK).addCylinder([v,.1,z],.15,.13,3,8);e(_.WOOD_DECK).addBox([-28.5,1.85,-1.72],[22,.07,.07]),e(_.WOOD_DECK).addBox([-28.5,1.85,1.72],[22,.07,.07]);for(let v=0;v<12;v++){const z=-18.5-v*1.8;e(_.WOOD_DECK).addBox([z,1.5,-1.72],[.06,.6,.06]),e(_.WOOD_DECK).addBox([z,1.5,1.72],[.06,.6,.06])}const t=[[-20.5,-.35,3.6,1.5],[-22.5,-.55,-2.8,1.9],[-25,-.3,1.6,1.2],[-27.5,-.5,-4.2,1.6],[-30,-.45,2.8,1.4],[-23.8,-.75,.4,1.1],[-19.4,-.6,-3.4,1.3],[-33,-.35,-1.2,1.7]];for(const[v,z,T,a]of t)e(_.ROCK).addSphere([v,z,T],a,B=>{const y=A=>Math.sin(B[0]*A+1.7)*Math.sin(B[1]*A*1.7+4.2)*Math.sin(B[2]*A*1.3+2.1),x=1+.28*y(2.1)+.14*y(4.7);B[0]=v+(B[0]-v)*x,B[1]=Math.max(z-a*.35,z+(B[1]-z)*x),B[2]=T+(B[2]-T)*x},14,9);const s=[];for(let v=0;v<9;v++)s.push([-14+v*3.4,0,10.4+C()*2.6]);for(let v=0;v<8;v++)s.push([-12+v*3.6,0,-10.2-C()*2.4]);for(const[v,,z]of s){const T=5+Math.floor(C()*4);for(let a=0;a<T;a++){const B=v+(C()-.5)*1.6,y=z+(C()-.5)*1.6,x=3+C()*1.8,A=(C()-.5)*.16,R=(C()-.5)*.16;e(_.FOLIAGE).addCylinder([B,1.2+x/2-.02,y],.035,.022,x,6,{rz:A,ry:R});const V=1.2+x*Math.cos(A),E=B+x*Math.sin(A)*-Math.sin(R)+0,G=y+x*Math.sin(A)*Math.cos(R)*.5,F=3+Math.floor(C()*3);for(let N=0;N<F;N++){const W=V-.25-C()*1.2,O=.35+C()*.45,U=C()*Math.PI*2;e(_.FOLIAGE).addBox([E+Math.cos(U)*O*.5,W,G+Math.sin(U)*O*.5],[O,.02,.09+C()*.06],{ry:U,rz:-.25-C()*.3})}}}const o=[];let u=0,l=0;const m=[],c=[];for(const[v,z]of[...n.entries()].sort((T,a)=>T[0]-a[0])){const{vertexData:T,indexData:a}=z.build();m.push(T),c.push(a),o.push({matId:v,firstIndex:l,count:a.length}),u+=T.length/8,l+=a.length}const f=m.reduce((v,z)=>v+z.length,0),d=c.reduce((v,z)=>v+z.length,0),r=new Float32Array(f),p=new Uint32Array(d);let h=0,b=0;for(let v=0;v<m.length;v++){r.set(m[v],h);const z=c[v],T=h/8;for(let a=0;a<z.length;a++)p[b+a]=z[a]+T;h+=m[v].length,b+=z.length}const g=[{pos:[14.2,3.1,-2.6],color:[1,.72,.45],intensity:40,range:9,layerMask:2},{pos:[14.2,3.1,.2],color:[1,.72,.45],intensity:40,range:9,layerMask:2},{pos:[1.5,4.4,0],color:[1,.82,.6],intensity:26,range:9,layerMask:2},{pos:[8.6,2.55,2.8],color:[1,.68,.42],intensity:26,range:7,layerMask:2},{pos:[-4.2,2.55,-1.15],color:[1,.75,.5],intensity:14,range:5,layerMask:2},{pos:[-4.2,2.55,1.15],color:[1,.75,.5],intensity:14,range:5,layerMask:2},{pos:[-11,4.15,-2.6],color:[.95,.9,.8],intensity:18,range:7,layerMask:2},{pos:[-11,4.15,2.6],color:[.95,.9,.8],intensity:18,range:7,layerMask:2},{pos:[-17.2,4.4,0],color:[.85,.92,1],intensity:55,range:14,spotDir:[-17.5,0,0],cosInner:.88,cosOuter:.6,layerMask:1},{pos:[-17,4.6,0],color:[.9,.95,1],intensity:2e4,range:9,spotDir:[17.5,-2.2,0],cosInner:.8,cosOuter:.5,layerMask:1},{pos:[-18.5,1.95,-2.5],color:[1,.8,.55],intensity:35,range:6,layerMask:1},{pos:[-18.5,1.95,2.5],color:[1,.8,.55],intensity:35,range:6,layerMask:1}],w=[{name:"Пирс",eye:[-37,2.6,.4],look:[-8,2.6,0]},{name:"Атриум",eye:[5,2.1,3.4],look:[-.5,2.4,-.6]},{name:"Бар",eye:[10.4,2,1.6],look:[14.6,1.6,-1.8]},{name:"Коридор",eye:[-6.2,1.95,0],look:[-1,1.7,.1]},{name:"Океан",eye:[-24,1.6,7.5],look:[-60,4,-4]},{name:"Обзор",eye:[27,22,25],look:[-4,.5,-1]}],P=[{pos:[-11,2.6,0],interior:.88,bounce:.55},{pos:[-4.5,2.4,0],interior:.92,bounce:.5},{pos:[1.5,2.6,0],interior:.62,bounce:.6},{pos:[11,2.4,0],interior:.8,bounce:.65},{pos:[0,1.9,9.5],interior:.12,bounce:.2},{pos:[-14,2.2,0],interior:.25,bounce:.25},{pos:[-24,2.2,0],interior:.04,bounce:.05},{pos:[-36,2.4,0],interior:0,bounce:0},{pos:[-40,1.4,-16],interior:0,bounce:0},{pos:[12,1.4,-16],interior:0,bounce:0}],L=[];for(let v=0;v<8;v++)L.push({pos:[-19.5-v*2.6+C()*.8,1.09,(C()-.5)*1.4],halfExt:[1+C()*.7,.06,.55+C()*.5],yaw:(C()-.5)*.5,mode:1,tint:[.52,.56,.62],maskScale:3.5+C()*2.5,maskThresh:.36+C()*.08});for(const[v,z]of[[-18,-1.9],[-18,1.9],[-22,-1.9],[-22,1.9],[-26,-1.9],[-26,1.9]])L.push({pos:[v,1.09,z],halfExt:[.75,.06,.75],mode:1,tint:[.78,.8,.85],maskScale:5,maskThresh:.3});for(const[v,z,T]of[[-20.5,.1,3.6],[-22.5,-.1,-2.8],[-25,.15,1.6],[-27.5,-.05,-4.2],[-30,.1,2.8],[-23.8,-.2,.4],[-19.4,-.1,-3.4],[-33,.2,-1.2]])L.push({pos:[v,z,T],halfExt:[1.3,.9,1.3],yaw:C()*3.1,mode:2,tint:[.1,.22,.09],gloss:.35,maskScale:2.2+C()*1.5,maskThresh:.5});for(let v=0;v<10;v++)L.push({pos:[-15+C()*30,1.22,-13+C()*26],halfExt:[1.4+C()*1.6,.05,1.2+C()*1.4],yaw:C()*3.1,mode:3,tint:[.55,.53,.5],gloss:.14,maskScale:1.8+C()*2,maskThresh:.4});for(let v=0;v<8;v++){const z=v<4?-16.1:16.1;L.push({pos:[z,1.6+C()*.7,-4.5+v*1.3],halfExt:[.25,.9+C()*.6,.5+C()*.5],mode:2,tint:[.38,.36,.33],gloss:.1,maskScale:2.6,maskThresh:.52})}for(let v=0;v<6;v++)L.push({pos:[-18.3-C()*4,1.1,(C()-.5)*2.6],halfExt:[.9+C()*.9,.05,.7+C()*.6],yaw:C()*3.1,mode:2,tint:[.55,.5,.4],gloss:.1,maskScale:2.4+C()*2,maskThresh:.44});for(let v=0;v<4;v++)L.push({pos:[-22-v*4.5,1.13,0],halfExt:[2.2,.05,.4],mode:3,tint:[.5,.47,.44],gloss:.34,maskScale:1.6,maskThresh:.4});const S=[{pos:[-11,2.8,0],radius:7.5,density:.014,noiseScale:.9},{pos:[-4.5,2.6,0],radius:3.2,density:.02,noiseScale:1.2},{pos:[1.5,3,0],radius:6,density:.028,noiseScale:1},{pos:[11,2.8,0],radius:7,density:.014,noiseScale:.9},{pos:[-28,.4,0],radius:14,density:.006,noiseScale:.5},{pos:[-12,1.5,11],radius:8,density:.004,noiseScale:.7},{pos:[-12,1.5,-11],radius:8,density:.004,noiseScale:.7},{pos:[-17,2.5,0],radius:6,density:.004,noiseScale:.8}],M=[{pos:[1.5,3.3,0],radius:2.6,type:0,count:900},{pos:[-4.5,2.1,0],radius:1.5,type:0,count:600},{pos:[-11,2.4,0],radius:3.6,type:0,count:800},{pos:[11,2.2,0],radius:3.6,type:0,count:800},{pos:[-17,2.4,0],radius:4.2,type:0,count:1100},{pos:[-12,2.6,11.6],radius:4,type:1,count:160},{pos:[-12,2.6,-11.2],radius:4,type:1,count:160},{pos:[0,2.3,9.5],radius:5,type:2,count:32},{pos:[-17,2.1,5],radius:4,type:2,count:32}],D=(v,z,T,a)=>[Math.min(v,T),Math.min(z,a),Math.max(v,T),Math.max(z,a)],k={walls:[D(-16.2,-6,-15.8,-2),D(-16.2,-2,-15.8,2),D(-16.2,2,-15.8,6),D(-16,-6.2,-6,-5.8),D(-16,5.8,-6,6.2),D(-6.2,-6,-5.8,-1.2),D(-6.2,1.2,-5.8,6),D(-6,-1.7,-3,-1.3),D(-6,1.3,-3,1.7),D(-3.2,-4.5,-2.8,-1.2),D(-3.2,1.2,-2.8,4.5),D(-3,-4.7,6,-4.3),D(-3,4.3,6,4.7),D(5.8,-4.5,6.2,-1.5),D(5.8,1.5,6.2,4.5),D(6,-5.2,16,-4.8),D(6,4.8,16,5.2),D(15.8,-5,16.2,5),D(12.3,-3.8,16.3,1.4),D(7.1,-4.1,9.3,-1.5),D(3.4,2,5.8,4.4)],blocks:[],waypoints:[[-17.5,0],[-22,0],[-28,0],[-34,0],[-39.5,0],[-34,0],[-28,0],[-22,0]]};return{vertexData:r,indexData:p,groups:o,lights:g,shots:w,probes:P,decals:L,volumes:S,vfxZones:M,nav:k,waterLevel:i}}function Qe(n,e){if(n<-17&&n>-41&&Math.abs(e)<1.8)return 1.125;const i=n>=-16&&n<=-6&&e>=-6&&e<=6,t=n>-6&&n<=-3&&Math.abs(e)<=1.5,s=n>-3&&n<=6&&Math.abs(e)<=4.5,o=n>6&&n<=16&&Math.abs(e)<=5;return i||t||s||o?1.245:Math.abs(n)<=37.5&&Math.abs(e)<=29.5?1.2:-1}class et{constructor(e){this.device=e}resources=new Map;pool=[];passes=[];current=null;frameIndex=0;texture(e,i){let t=this.resources.get(e);if((!t||t.desc.width!==i.width||t.desc.height!==i.height||t.desc.format!==i.format)&&(t&&t.texture&&this.retire(t.texture),t={desc:i,texture:null,view:null},this.resources.set(e,t)),!t.texture){const s=this.pool.pop()??null;s&&s.width===i.width&&s.height===i.height&&s.format===i.format?t.texture=s:(s&&this.retire(s),t.texture=this.device.createTexture({label:`rg:${e}`,size:[i.width,i.height],format:i.format,usage:i.usage})),t.view=t.texture.createView()}return t.view}persistent(e,i){return this.texture(e,i)}retire(e){this.pool.push(e),this.pool.length>24&&this.pool.shift()?.destroy()}async run(e,i,t){const s={name:e,kind:i,cpuMs:0};this.passes.push(s),this.current=s;const o=performance.now();await t(),s.cpuMs=performance.now()-o,this.current=null}beginFrame(){this.passes.length=0,this.frameIndex++}reset(e=!1){for(const i of this.resources.values())i.texture?.destroy(),i.texture=null,i.view=null;if(this.resources.clear(),!e){for(const i of this.pool)i.destroy();this.pool.length=0}}totalCpuMs(){return this.passes.reduce((e,i)=>e+i.cpuMs,0)}get dev(){return this.device}}function j(){const n=new Float32Array(16);return n[0]=n[5]=n[10]=n[15]=1,n}function Ie(n){return n.fill(0),n[0]=n[5]=n[10]=n[15]=1,n}function K(n,e,i){const t=e[0],s=e[1],o=e[2],u=e[3],l=e[4],m=e[5],c=e[6],f=e[7],d=e[8],r=e[9],p=e[10],h=e[11],b=e[12],g=e[13],w=e[14],P=e[15];for(let L=0;L<4;L++){const S=i[L*4],M=i[L*4+1],D=i[L*4+2],k=i[L*4+3];n[L*4]=S*t+M*l+D*d+k*b,n[L*4+1]=S*s+M*m+D*r+k*g,n[L*4+2]=S*o+M*c+D*p+k*w,n[L*4+3]=S*u+M*f+D*h+k*P}return n}function tt(n,e,i,t,s){const o=1/Math.tan(e/2);return n.fill(0),n[0]=o/i,n[5]=o,n[10]=s/(t-s),n[14]=s*t/(t-s),n[11]=-1,n}function st(n,e,i,t,s,o,u){return n.fill(0),n[0]=2/(i-e),n[5]=2/(s-t),n[10]=1/(o-u),n[12]=(e+i)/(e-i),n[13]=(s+t)/(t-s),n[14]=o/(o-u),n[15]=1,n}function Ee(n,e,i,t){let s=e[0]-i[0],o=e[1]-i[1],u=e[2]-i[2],l=Math.hypot(s,o,u);l<1e-8&&(s=0,o=0,u=1,l=1),s/=l,o/=l,u/=l;let m=t[1]*u-t[2]*o,c=t[2]*s-t[0]*u,f=t[0]*o-t[1]*s;if(l=Math.hypot(m,c,f),l<1e-8){const h=Math.abs(t[2])<.9?[0,0,1]:[1,0,0];m=h[1]*u-h[2]*o,c=h[2]*s-h[0]*u,f=h[0]*o-h[1]*s,l=Math.hypot(m,c,f)}m/=l,c/=l,f/=l;const d=o*f-u*c,r=u*m-s*f,p=s*c-o*m;return n[0]=m,n[1]=d,n[2]=s,n[3]=0,n[4]=c,n[5]=r,n[6]=o,n[7]=0,n[8]=f,n[9]=p,n[10]=u,n[11]=0,n[12]=-(m*e[0]+c*e[1]+f*e[2]),n[13]=-(d*e[0]+r*e[1]+p*e[2]),n[14]=-(s*e[0]+o*e[1]+u*e[2]),n[15]=1,n}function it(n,e){const i=e[0],t=e[1],s=e[2],o=e[3],u=e[4],l=e[5],m=e[6],c=e[7],f=e[8],d=e[9],r=e[10],p=e[11],h=e[12],b=e[13],g=e[14],w=e[15],P=i*l-t*u,L=i*m-s*u,S=i*c-o*u,M=t*m-s*l,D=t*c-o*l,k=s*c-o*m,v=f*b-d*h,z=f*g-r*h,T=f*w-p*h,a=d*g-r*b,B=d*w-p*b,y=r*w-p*g;let x=P*y-L*B+S*a+M*T-D*z+k*v;return x?(x=1/x,n[0]=(l*y-m*B+c*a)*x,n[1]=(s*B-t*y-o*a)*x,n[2]=(b*k-g*D+w*M)*x,n[3]=(r*D-d*k-p*M)*x,n[4]=(m*T-u*y-c*z)*x,n[5]=(i*y-s*T+o*z)*x,n[6]=(g*S-h*k-w*L)*x,n[7]=(f*k-r*S+p*L)*x,n[8]=(u*B-l*T+c*v)*x,n[9]=(t*T-i*B-o*v)*x,n[10]=(h*D-b*S+w*P)*x,n[11]=(d*S-f*D-p*P)*x,n[12]=(l*z-u*a-m*v)*x,n[13]=(i*a-t*z+s*v)*x,n[14]=(b*L-h*M-g*P)*x,n[15]=(f*M-d*L+r*P)*x,n):Ie(n)}function ae(n,e){return[n[0]-e[0],n[1]-e[1],n[2]-e[2]]}function ue(n,e){return[n[0]+e[0],n[1]+e[1],n[2]+e[2]]}function Be(n,e){return[n[0]*e,n[1]*e,n[2]*e]}function De(n,e){return[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]]}function rt(n){return Math.hypot(n[0],n[1],n[2])}function ie(n){const e=rt(n)||1;return[n[0]/e,n[1]/e,n[2]/e]}function ke(n,e){let i=1,t=0,s=n;for(;s>0;)i/=e,t+=i*(s%e),s=Math.floor(s/e);return t}function Q(n,e,i,t){return Ie(n),n[12]=e,n[13]=i,n[14]=t,n}function oe(n,e,i){const t=Math.sin(i),s=Math.cos(i),o=e[4],u=e[5],l=e[6],m=e[7],c=e[8],f=e[9],d=e[10],r=e[11];return n!==e&&n.set(e),n[4]=o*s+c*t,n[5]=u*s+f*t,n[6]=l*s+d*t,n[7]=m*s+r*t,n[8]=c*s-o*t,n[9]=f*s-u*t,n[10]=d*s-l*t,n[11]=r*s-m*t,n}function Ae(n,e,i){const t=Math.sin(i),s=Math.cos(i),o=e[0],u=e[1],l=e[2],m=e[3],c=e[8],f=e[9],d=e[10],r=e[11];return n!==e&&n.set(e),n[0]=o*s-c*t,n[1]=u*s-f*t,n[2]=l*s-d*t,n[3]=m*s-r*t,n[8]=o*t+c*s,n[9]=u*t+f*s,n[10]=l*t+d*s,n[11]=m*t+r*s,n}const te=(n,e,i)=>Math.min(i,Math.max(e,n)),re=(n,e,i)=>n+(e-n)*i,at=(n,e,i)=>{const t=te((i-n)/(e-n),0,1);return t*t*(3-2*t)},J=n=>n*Math.PI/180;class ot{target=[0,2,0];distance=26;yaw=J(215);pitch=J(14);position=[-30,2.4,2];flyYaw=J(70);flyPitch=J(4);tpsEye=[0,3,5];tpsLook=[0,1.5,0];mode="orbit";fovY=J(52);near=.3;far=2400;view=j();proj=j();viewProj=j();invViewProj=j();prevViewProj=j();viewDir=[0,0,1];camPos=[0,0,0];hasPrev=!1;jitterEnabled=!0;jitterIdx=0;jitter=[0,0];eye(){if(this.mode==="tps")return this.tpsEye;if(this.mode==="fly")return this.position;const e=Math.cos(this.pitch);return[this.target[0]+this.distance*e*Math.cos(this.yaw),this.target[1]+this.distance*Math.sin(this.pitch),this.target[2]+this.distance*e*Math.sin(this.yaw)]}lookAtPoint(){return this.mode==="tps"?this.tpsLook:this.mode==="fly"?ue(this.position,this.forward()):this.target}forward(){const e=Math.cos(this.flyPitch);return ie([e*Math.cos(this.flyYaw),Math.sin(this.flyPitch),e*Math.sin(this.flyYaw)])}forwardOfView(){return ie(ae(this.lookAtPoint(),this.eye()))}update(e){if(this.jitterEnabled){const o=(ke(this.jitterIdx%8+1,2)-.5)*2/Math.ceil(e*720),u=(ke(this.jitterIdx%8+1,3)-.5)*2/720;this.jitter=[o,u],this.jitterIdx++}else this.jitter=[0,0];const i=this.prevViewProj;this.hasPrev&&i.set(this.viewProj);const t=this.eye(),s=this.lookAtPoint();Ee(this.view,t,s,[0,1,0]),tt(this.proj,this.fovY,e,this.near,this.far),this.proj[2]+=this.jitter[0],this.proj[13]+=this.jitter[1],K(this.viewProj,this.proj,this.view),it(this.invViewProj,this.viewProj),this.hasPrev||(i.set(this.viewProj),this.hasPrev=!0),this.camPos=t,this.viewDir=ie(ae(s,t))}moveOrbit(e,i){this.yaw-=e*.005,this.pitch=te(this.pitch+i*.005,J(-85),J(85))}zoom(e){this.distance=te(this.distance*(e>0?1.12:.89),2.2,220)}pan(e,i){const t=this.forward(),s=ie(De([0,1,0],t)),o=this.distance*.0016;this.target=ue(this.target,ue(Be(s,-e*o),Be([0,1,0],i*o)))}flyStep(e,i){const t=i.has("shiftleft")||i.has("shiftright")?26:7,s=this.forward(),o=ie(De(s,[0,1,0])),u=[0,0,0];i.has("keyw")&&u.forEach((m,c)=>u[c]+=s[c]),i.has("keys")&&u.forEach((m,c)=>u[c]-=s[c]),i.has("keyd")&&u.forEach((m,c)=>u[c]+=o[c]),i.has("keya")&&u.forEach((m,c)=>u[c]-=o[c]),i.has("keye")&&(u[1]+=1),i.has("keyq")&&(u[1]-=1);const l=Math.hypot(...u);if(l>1e-4){const m=t*e/l;this.position=ue(this.position,Be(u,m)),this.position[1]=Math.max(this.position[1],-1.5)}}animateTo(e,i){const t=i*i*(3-2*i),s=this.eye(),o=this.lookAtPoint(),u=[re(s[0],e.eye[0],t),re(s[1],e.eye[1],t),re(s[2],e.eye[2],t)],l=[re(o[0],e.look[0],t),re(o[1],e.look[1],t),re(o[2],e.look[2],t)];if(this.mode==="tps"){this.tpsEye=u,this.tpsLook=l;return}if(this.mode==="orbit"){this.distance=te(Math.hypot(...ae(u,e.look)),2.2,220),this.target=l;const m=ae(u,l),c=Math.hypot(m[0],m[2]);this.yaw=Math.atan2(m[2],m[0]),this.pitch=Math.atan2(m[1],c)}else{this.position=u;const m=ie(ae(l,u));this.flyYaw=Math.atan2(m[2],m[0]),this.flyPitch=Math.asin(te(m[1],-1,1))}}}const Ce=4,Re=[.025,.11,.32,.72,1],Le=10,Ge=20;class nt{camData=new Float32Array(68);frameData=new Float32Array(128);cascadeData=[];lightData;probeData=new Float32Array(Le*Ge);decalData=new Float32Array(800);volumeData=new Float32Array(64);sunElevation=28;sunAzimuth=245;shadowDist=70;fogScale=.9;evBias=0;cloudCover=.42;bloomStrength=.06;caAmount=.55;debugMode=0;taaOn=1;lutOn=1;ssrOn=1;giOn=1;ssrStrength=1;evLock=0;fftOn=1;causticsOn=1;volFogOn=1;layersMode=0;cookieStrength=0;skyLutOn=1;particlesOn=1;charOn=1;timeLock=null;sunDir=[0,1,0];sunColor=[1,1,1];probes=[];bakedSun=null;constructor(e){for(let i=0;i<Ce;i++)this.cascadeData.push(new Float32Array(16));this.lightData=new Float32Array(e.length*16),this.packLights(e)}setProbes(e){this.probes=e.slice(0,Le)}packLights(e){e.forEach((i,t)=>{const s=t*16;this.lightData[s]=i.pos[0],this.lightData[s+1]=i.pos[1],this.lightData[s+2]=i.pos[2],this.lightData[s+3]=i.range,this.lightData[s+4]=i.color[0],this.lightData[s+5]=i.color[1],this.lightData[s+6]=i.color[2],this.lightData[s+7]=i.intensity;const o=i.spotDir??[0,-1,0],u=Math.hypot(o[0],o[1],o[2])||1;this.lightData[s+8]=o[0]/u,this.lightData[s+9]=o[1]/u,this.lightData[s+10]=o[2]/u,this.lightData[s+11]=0,this.lightData[s+12]=i.cosInner??0,this.lightData[s+13]=i.cosOuter??0,this.lightData[s+14]=i.spotDir?1:0,this.lightData[s+15]=i.layerMask??7})}updateSun(){const e=J(this.sunElevation),i=J(this.sunAzimuth);this.sunDir=[Math.cos(e)*Math.sin(i),Math.sin(e),Math.cos(e)*Math.cos(i)];const t=1-at(6,26,this.sunElevation);this.sunColor=[1,.965-.42*t,.925-.66*t]}pack(e,i,t,s,o,u,l,m,c,f,d,r,p,h){const b=this.camData;b.set(e.view,0),b.set(e.viewProj,16),b.set(e.invViewProj,32),b.set(e.prevViewProj,48),b[64]=e.camPos[0],b[65]=e.camPos[1],b[66]=e.camPos[2],b[67]=1;const g=this.frameData;g[0]=this.sunDir[0],g[1]=this.sunDir[1],g[2]=this.sunDir[2],g[3]=0,g[4]=this.sunColor[0]*1e5,g[5]=this.sunColor[1]*1e5,g[6]=this.sunColor[2]*1e5,g[7]=1,g[8]=.00125,g[9]=.035,g[10]=.55,g[11]=this.timeLock??performance.now()/1e3,g[12]=i,g[13]=t,g[14]=1/i,g[15]=1/t,g[16]=e.near,g[17]=e.far,g[18]=d,g[19]=this.shadowDist;const w=Re;g[20]=w[1]*this.shadowDist,g[21]=w[2]*this.shadowDist,g[22]=w[3]*this.shadowDist,g[23]=w[4]*this.shadowDist,g[24]=c,g[25]=f,g[26]=o,g[27]=s,g[28]=this.evBias,g[29]=p,g[30]=h,g[31]=1.15,g[32]=this.cloudCover,g[33]=1,g[34]=this.fogScale,g[35]=r,g[36]=u,g[37]=l,g[38]=m,g[39]=Math.tan(e.fovY/2),g[40]=this.taaOn,g[41]=this.bloomStrength,g[42]=this.caAmount,g[43]=this.debugMode,g[44]=this.lutOn,g[45]=this.ssrOn*this.ssrStrength,g[46]=this.giOn,g[47]=this.evLock,g[48]=this.fftOn,g[49]=this.causticsOn,g[50]=.86,g[51]=1,g[52]=140,g[53]=48,g[54]=96,g[55]=54,g[56]=this.volFogOn,g[57]=this.layersMode,g[58]=this.cookieStrength,g[59]=this.skyLutOn,g[60]=this.particlesOn,g[61]=this.charOn,g[62]=0,g[63]=0}setDecalsAndVolumes(e,i){this.decalData.fill(0),e.slice(0,50).forEach((t,s)=>{const o=s*16;this.decalData[o]=t.pos[0],this.decalData[o+1]=t.pos[1],this.decalData[o+2]=t.pos[2],this.decalData[o+3]=t.yaw??0,this.decalData[o+4]=t.halfExt[0],this.decalData[o+5]=t.halfExt[1],this.decalData[o+6]=t.halfExt[2],this.decalData[o+7]=t.mode,this.decalData[o+8]=t.tint[0],this.decalData[o+9]=t.tint[1],this.decalData[o+10]=t.tint[2],this.decalData[o+11]=0,this.decalData[o+12]=t.gloss??.2,this.decalData[o+13]=t.maskScale??2.5,this.decalData[o+14]=t.maskThresh??.45,this.decalData[o+15]=0}),this.volumeData.fill(0),i.slice(0,8).forEach((t,s)=>{const o=s*8;this.volumeData[o]=t.pos[0],this.volumeData[o+1]=t.pos[1],this.volumeData[o+2]=t.pos[2],this.volumeData[o+3]=t.radius,this.volumeData[o+4]=t.density,this.volumeData[o+5]=0,this.volumeData[o+6]=t.noiseScale??1,this.volumeData[o+7]=1})}bakeSkyLut(){const m=[5802e-9,13558e-9,331e-7],c=3996e-9,f=44e-7,d=[65e-8,1881e-9,85e-9],r=.76,p=20,h=T=>{const a=Math.max(-65504,Math.min(65504,T)),B=new Float32Array(1),y=new Int32Array(B.buffer);B[0]=a;const x=y[0],A=x>>16&32768;let R=(x>>23&255)-127+15;const V=x&8388607;return R>=31?A|31744:R<=0?R<-10?A:A|(8388608|V)>>1-R>>13:A|R<<10|V>>13},b=T=>Math.max(0,1-Math.abs(T-25e3)/15e3),g=(T,a,B,y,x)=>{let A=0,R=0,V=0;const E=8;for(let G=0;G<E;G++){const F=x*Math.pow((G+.5)/E,2),N=Math.hypot(T+B*F,a+y*F)-636e4,W=x*(2*(G+.5)/E)/E;A+=Math.exp(-N/8500)*W,R+=Math.exp(-N/1200)*W,V+=b(N)*W}return[A,R,V]},w=T=>{const a=636e4*T,B=a*a-(636e4*636e4-646e4*646e4);return-a+Math.sqrt(Math.max(B,1e-6))},P=new Uint16Array(1536*24*4);for(let T=0;T<24;T++){const a=(T+.5)/24*(Math.PI/2),B=Math.cos(a),y=Math.sin(a);for(let x=0;x<32;x++){const A=(x+.5)/32*Math.PI;for(let R=0;R<48;R++){const V=(R+.5)/48*(Math.PI/2)-1e-4,E=Math.sin(V),F=Math.cos(V)*Math.cos(A),N=w(E),W=F*B+E*y,O=3/(16*Math.PI)*(1+W*W),U=r*r,H=(1-U)/(4*Math.PI*Math.pow(Math.max(1+U-2*r*W,1e-4),1.5));let Y=[0,0,0];const se=20;for(let ne=0;ne<se;ne++){const me=N*Math.pow((ne+.5)/se,2.2),Ue=N*2.2*Math.pow((ne+.5)/se,1.2)/se,ve=F*me,be=636e4+E*me,Me=Math.hypot(ve,be)-636e4,Ne=Math.exp(-Me/8500),We=Math.exp(-Me/1200),[xe,ye,we]=g(0,636e4,F,E,me),Pe=z(ve,be,B,y);let le=0,ce=0,fe=0;if(Pe>0){const[Z,qe,Ye]=g(ve,be,B,y,Pe);le=Z,ce=qe,fe=Ye}const je=[Math.exp(-(m[0]*xe+(c+f)*ye+d[0]*we)),Math.exp(-(m[1]*xe+(c+f)*ye+d[1]*we)),Math.exp(-(m[2]*xe+(c+f)*ye+d[2]*we))],He=[Math.exp(-(m[0]*le+(c+f)*ce+d[0]*fe)),Math.exp(-(m[1]*le+(c+f)*ce+d[1]*fe)),Math.exp(-(m[2]*le+(c+f)*ce+d[2]*fe))];if(!(Pe<=0))for(let Z=0;Z<3;Z++)Y[Z]+=je[Z]*(m[Z]*Ne*O+c*We*H)*He[Z]*Ue*p}const q=((T*32+x)*48+R)*4;P[q]=h(Y[0]*1.7),P[q+1]=h(Y[1]*1.7),P[q+2]=h(Y[2]*1.7),P[q+3]=0}}}const L=Math.min(47,Math.floor(28/90*48)),M=((Math.min(23,Math.floor(28/90*24))*32+Math.floor(32*.5))*48+L)*4,D=(.1+.26+.6)*4200;let k=0;for(let T=0;T<3;T++)k+=Ve(P[M+T]);let v=k>1e-6?D/k:0;(!isFinite(v)||v<=0||v>1e6)&&(v=0);for(let T=0;T<P.length;T+=4)for(let a=0;a<3;a++)P[T+a]=h(Math.min(6e4,Math.max(0,Ve(P[T+a])*v)));return P;function z(T,a,B,y){const x=T*B+a*y,A=x*x-(T*T+a*a-646e4*646e4);if(A<0)return-1;const R=-x+Math.sqrt(A),V=T*B+a*y,E=V*V-(T*T+a*a-636e4*636e4);return(E>=0?-V-Math.sqrt(E):1/0)>0?-1:R}}bakeProbes(){const e=this.sunElevation,i=this.sunAzimuth;if(this.bakedSun&&this.bakedSun.el===e&&this.bakedSun.az===i)return;this.bakedSun={el:e,az:i};const t=this.sunDir,s=[this.sunColor[0]*1e5,this.sunColor[1]*1e5,this.sunColor[2]*1e5],o=64,u=Math.PI*(3-Math.sqrt(5));for(let l=0;l<this.probes.length;l++){const m=this.probes[l],c=1-m.interior,f=l*Ge;this.probeData[f]=m.pos[0],this.probeData[f+1]=m.pos[1],this.probeData[f+2]=m.pos[2],this.probeData[f+3]=m.interior;let d=[0,0,0],r=[0,0,0],p=[0,0,0],h=[0,0,0];for(let b=0;b<o;b++){const g=1-2*((b+.5)/o),w=Math.sqrt(Math.max(1-g*g,1e-6)),P=b*u,L=[Math.cos(P)*w,g,Math.sin(P)*w],S=L[1]*.5+.5,M=[.5,.55,.64],D=[.3,.44,.75],k=[0,1,2].map(a=>(M[a]+(D[a]-M[a])*S)*.6),v=te(L[0]*t[0]+L[1]*t[1]+L[2]*t[2],0,1)*.5+.5,z=18e-6*v*v,T=[0,1,2].map(a=>{const B=k[a]+s[a]*z,y=s[a]*.0013*(a===0?1:a===1?.86:.72)*(1+m.bounce*(a===0?.35:a===1?.12:-.1));return y+(B-y)*c});for(let a=0;a<3;a++)d[a]+=T[a]/o,r[a]+=T[a]*L[0]/o,p[a]+=T[a]*L[1]/o,h[a]+=T[a]*L[2]/o}this.probeData[f+4]=d[0],this.probeData[f+5]=d[1],this.probeData[f+6]=d[2],this.probeData[f+7]=0,this.probeData[f+8]=r[0],this.probeData[f+9]=r[1],this.probeData[f+10]=r[2],this.probeData[f+11]=0,this.probeData[f+12]=p[0],this.probeData[f+13]=p[1],this.probeData[f+14]=p[2],this.probeData[f+15]=0,this.probeData[f+16]=h[0],this.probeData[f+17]=h[1],this.probeData[f+18]=h[2],this.probeData[f+19]=0}}updateCascades(e){const i=Re,t=e.invViewProj;for(let s=0;s<Ce;s++){const o=i[s]*this.shadowDist,u=i[s+1]*this.shadowDist,l=[],m=w=>(e.far-e.near*e.far/w)/(e.far-e.near);for(const[w,P]of[[-1,-1],[1,-1],[1,1],[-1,1]])for(const L of[Math.max(o,e.near+.5),u]){const S=[w,P,te(m(L),0,.9999)],M=t,D=M[0]*S[0]+M[4]*S[1]+M[8]*S[2]+M[12],k=M[1]*S[0]+M[5]*S[1]+M[9]*S[2]+M[13],v=M[2]*S[0]+M[6]*S[1]+M[10]*S[2]+M[14],z=M[3]*S[0]+M[7]*S[1]+M[11]*S[2]+M[15];l.push([D/z,k/z,v/z])}let c=0,f=0,d=0;for(const w of l)c+=w[0],f+=w[1],d+=w[2];c/=8,f/=8,d/=8;let r=0;for(const w of l)r=Math.max(r,Math.hypot(w[0]-c,w[1]-f,w[2]-d));r=Math.max(r,2.5);const p=[c-this.sunDir[0]*(r+30),f-this.sunDir[1]*(r+30),d-this.sunDir[2]*(r+30)],h=j();Ee(h,p,[c,f,d],[0,1,0]);const b=j();st(b,-r,r,-r,r,1,(r+30)*2+10);const g=j();K(g,b,h),this.cascadeData[s].set(g)}}cascadeTexelWorld(){return 2*this.shadowDist*.35/1024}}function Ve(n){const e=(n&32768)>>15,i=(n&31744)>>10,t=n&1023;let s;return i===0?s=t*2**-24:i===31?s=t?NaN:1/0:s=(1+t/1024)*2**(i-15),(e?-1:1)*s}const I=`
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
  vol      : vec4f,  // x = fogFar, y = slices FZ, z = froxels FX, w = froxels FY (M5)
  m5       : vec4f,  // x = volFogOn, y = layersMode, z = cookieStrength, w = skyLutOn (M5)
  m6       : vec4f,  // x = particlesOn, y = charOn, z/w = reserved (M6)
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
fn cloudLayer(d : vec3f, cosg : f32, lowSun : f32, f : Frame, col : vec3f) -> vec3f {
  if (d.y <= 0.015) { return col; }
  let sp = f.extra.y;
  let cuv = d.xz / (d.y + 0.10) * 1.35 + vec2f(f.fog.w * 0.005 * sp, f.fog.w * 0.0032 * sp);
  let n = fbm2(cuv * 0.5, 5);
  let cov = smoothstep(1.02 - f.extra.x, 1.12 - f.extra.x * 0.5, n);
  let shade = mix(vec3f(0.36, 0.39, 0.46), vec3f(0.52, 0.38, 0.32), lowSun);
  let lit = mix(vec3f(1.04, 1.02, 1.00), vec3f(1.25, 0.80, 0.55), lowSun);
  let cloud = mix(shade, lit, smoothstep(0.32, 0.78, n + cosg * 0.18));
  let fade = saturate(d.y * 6.0);
  return mix(col, cloud * f.extra.w * 0.9, cov * fade * 0.93);
}

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
  return cloudLayer(d, cosg, lowSun, f, col);
}

// ---------- M5 PBS sky: pre-baked sky-view LUT (Nishita-style CPU bake:
// Rayleigh + Mie aerosols + ozone, single scattering, normalized on CPU to
// match the legacy gradient scale; sun disc + procedural clouds overlaid) ----------
fn skyLutColor(dir : vec3f, f : Frame, lut : texture_3d<f32>, smp : sampler) -> vec3f {
  let d = normalize(dir);
  let eV = asin(clamp(d.y, -1.0, 1.0));
  let eS = asin(clamp(f.sunDir.y, -1.0, 1.0));
  let cosg = clamp(dot(d, f.sunDir.xyz), -1.0, 1.0);
  // LUT parameterized by (view elevation, relative azimuth, sun elevation);
  // recover relative azimuth from cosγ for exact per-direction sampling
  let cosRel = clamp((cosg - sin(eV) * sin(eS)) / max(cos(eV) * cos(eS), 1e-4), -1.0, 1.0);
  let relAz = acos(cosRel);
  let u = clamp(eV / (PI * 0.5), 0.0, 1.0);
  let vv = clamp(relAz / PI, 0.0, 1.0);
  let w = clamp(eS / (PI * 0.5), 0.0, 1.0);
  var col = textureSampleLevel(lut, smp, vec3f(u, vv, w), 0.0).rgb;
  let lowSun = 1.0 - smoothstep(0.06, 0.42, f.sunDir.y);
  // mie glow + HDR sun disc (bloom picks it up)
  col += f.sunColor.rgb * 0.00005 * pow(max(cosg, 0.0), 7.0);
  col += f.sunColor.rgb * 850.0 * smoothstep(0.99950, 0.99988, cosg);
  return cloudLayer(d, cosg, lowSun, f, col);
}

// unified sky entry: legacy analytic gradient or M5 LUT model
fn skyAny(dir : vec3f, f : Frame, lut : texture_3d<f32>, smp : sampler) -> vec3f {
  if (f.m5.w > 0.5) { return skyLutColor(dir, f, lut, smp); }
  return skyColor(dir, f);
}

// ---------- M5 froxel volumetric fog sampling (integrated LUT) ----------
fn froxelFog(colorIn : vec3f, f : Frame, t_vol : texture_3d<f32>, smp : sampler,
             viewDist : f32, screenUv : vec2f) -> vec3f {
  let fz = f.vol.y;
  let sliceF = clamp(viewDist / max(f.vol.x, 1.0) * fz - 0.5, 0.0, fz - 1.0);
  let zc = (sliceF + 0.5) / fz;
  let v = textureSampleLevel(t_vol, smp, vec3f(screenUv, zc), 0.0);
  return colorIn * v.a + v.rgb;
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

// ---------- light layers (M5): bit0 = Exterior, bit1 = Interior, bit2 = Lamps ----------
fn layerOf(p : vec3f, matId : u32) -> u32 {
  if (matId == 8u) { return 4u; } // emissive fixtures → LampsOnly
  let inRoom1 = p.x > -16.4 && p.x < -5.6 && p.z > -6.4 && p.z < 6.4 && p.y > 0.9 && p.y < 5.0;
  let inCorr  = p.x > -6.4 && p.x < -2.6 && abs(p.z) < 1.9 && p.y > 0.9 && p.y < 4.8;
  let inRoom2 = p.x > -3.4 && p.x < 6.4 && abs(p.z) < 4.9 && p.y > 0.9 && p.y < 6.3;
  let inRoom3 = p.x > 5.6 && p.x < 16.4 && abs(p.z) < 5.4 && p.y > 0.9 && p.y < 5.0;
  let interior = inRoom1 || inCorr || inRoom2 || inRoom3;
  return select(5u, 6u, interior); // exterior: Exterior|Lamps · interior: Interior|Lamps
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
`,lt=`
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
  @location(3) g3 : vec2f, // M6 motion vectors (static geometry: 0)
};

@fragment
fn fs_gbuffer(in : VSOut) -> GBufOut {
  let m = pbrMat(in.matId, in.worldPos, normalize(in.normal));
  var o : GBufOut;
  // M5: g0.a packs matId (low nibble) + light layer (high nibble):
  // bit0 Exterior, bit1 Interior, bit2 Lamps (HDRP Light Layers)
  o.g0 = vec4f(m.albedo, f32((in.matId & 0xF) | (layerOf(in.worldPos, in.matId) << 4)) / 255.0);
  o.g1 = vec4f(m.N, m.gloss);
  let F0 = mix(vec3f(0.04), m.albedo, m.metallic);
  o.g2 = vec4f(F0, m.metallic);
  o.g3 = vec2f(0.0); // static world never moves
  return o;
}
`,ct=`
@group(0) @binding(0) var<uniform> cascadeMat : mat4x4f;

@vertex
fn vs_shadow(@location(0) pos : vec3f, @location(1) nrm : vec3f, @location(2) uv : vec2f) -> @builtin(position) vec4f {
  return cascadeMat * vec4f(pos, 1.0);
}
`,ft=`
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
`,ut=`
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
`,dt=`
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
`,ht=`
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
@group(1) @binding(9) var t_vol : texture_3d<f32>;      // froxel fog LUT (M5)
@group(1) @binding(10) var t_skyLut : texture_3d<f32>;  // PBS sky LUT (M5)
@group(1) @binding(11) var smpFilt : sampler;

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
    let sky = skyAny(dir, frame, t_skyLut, smpFilt);
    // volumetric fog applies to the sky too (aerial haze up to fogFar)
    let fogged = select(sky, froxelFog(sky, frame, t_vol, smpFilt, frame.vol.x, uv), frame.m5.x > 0.5);
    return vec4f(fogged, 1.0);
  }

  let g0 = textureLoad(t_g0, px, 0);
  let g1 = textureLoad(t_g1, px, 0);
  let g2 = textureLoad(t_g2, px, 0);
  let albedo = g0.rgb;
  let packedId = u32(g0.a * 255.0 + 0.5);
  let matId = packedId & 0xF;
  let geoMask = (packedId >> 4) & 0xF; // light layers (M5): bit0 Ext, bit1 Int, bit2 Lamps
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
    // M5 light layers: filter punctual lights by the geometry layer mask
    if (frame.m5.y > 0.5 && (u32(L.params.w) & geoMask) == 0u) { continue; }
    // M5 spot cookie: procedural angular texture (foliage/jalousie mask)
    if (frame.m5.z > 0.5 && L.params.z > 0.5) {
      let dirS = normalize(L.dirSpot.xyz);
      let t0 = select(vec3f(0.0, 1.0, 0.0), vec3f(1.0, 0.0, 0.0), abs(dirS.y) > 0.99);
      let T = normalize(cross(t0, dirS));
      let B = cross(dirS, T);
      let v = -Ld;
      let ang = vec2f(dot(v, T), dot(v, B)) / max(dot(v, dirS), 0.05);
      let ck = fbm2(ang * 2.4 + vec2f(f32(li) * 3.7, f32(li) * 1.3), 3);
      let cookie = pow(saturate(ck * 1.55 - 0.12), 1.4);
      att *= mix(1.0, 0.2 + 0.8 * cookie, frame.m5.z);
    }
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
  if (frame.dbg.w > 8.5 && frame.dbg.w < 9.5) {                             // M5: light layer map
    color = vec3f(f32(geoMask) / 15.0, f32(matId) / 15.0, 0.0);
  }

  // --- aerial perspective: M5 froxel volumetric fog (shadowed sun shafts,
  // local volumes, punctual in-scatter) or legacy analytic height fog ---
  if (frame.m5.x > 0.5) {
    color = froxelFog(color, frame, t_vol, smpFilt, viewDist, uv);
  } else {
    color = applyFog(color, frame, world, cam.camPos.xyz, t_shadow, smpCmp);
  }
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,_e=`
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
@group(1) @binding(5) var t_skyLut : texture_3d<f32>; // M5 PBS sky LUT
@group(1) @binding(6) var t_vol : texture_3d<f32>;    // M5 froxel fog LUT

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
  let skyRef = skyAny(R, frame, t_skyLut, smpLin);
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
  color = mix(color, skyAny(normalize(vec3(-V.x, 0.035, -V.z)), frame, t_skyLut, smpLin), farFade * farFade);

  // aerial perspective (heavier over water)
  if (frame.m5.x > 0.5) {
    color = froxelFog(color, frame, t_vol, smpLin, viewDist, in.clip.xy * frame.screen.zw);
  } else {
    color = applyFog(color, frame, in.world, cam.camPos.xyz, t_shadow, smpCmp);
  }

  // underwater: shift toward deep scatter + upward TIR-ish sky boost
  if (underwater) {
    let deep = vec3f(0.008, 0.05, 0.07) * frame.extra.w * 0.5;
    color = mix(deep, color, exp(-viewDist * 0.055));
    let upDot = saturate(-V.y * 1.4 - 0.1);
    color = mix(color, skyBase(vec3f(0.0, 1.0, 0.0), frame) * 0.55, upDot * 0.55);
  }
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,pt=`
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
`,Fe=`
@fragment
fn fs_ocean() -> @location(0) vec4f {
  return vec4f(0.05, 0.20, 0.30, 1.0);
}
`,gt=`
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
`,mt=`
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
`,vt=`
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
`,bt=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_g0 : texture_2d<f32>;
@group(1) @binding(1) var t_g1 : texture_2d<f32>;
@group(1) @binding(2) var t_g2 : texture_2d<f32>;
@group(1) @binding(3) var t_depth : texture_depth_2d;
@group(1) @binding(4) var t_scene : texture_2d<f32>;
@group(1) @binding(5) var smpLin : sampler;
@group(1) @binding(6) var t_skyLut : texture_3d<f32>; // M5 PBS sky LUT

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

    let skyR = skyAny(R, frame, t_skyLut, smpLin);
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
`,xt=`
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
`,yt=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_cur : texture_2d<f32>;
@group(1) @binding(1) var t_hist : texture_2d<f32>;
@group(1) @binding(2) var t_depth : texture_depth_2d;
@group(1) @binding(3) var smpLin : sampler;
@group(1) @binding(4) var t_mv : texture_2d<f32>; // M6 motion vectors (rg16float, G-buffer g3)

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
  // M6 animated geometry (character) writes explicit motion vectors into
  // g3 — depth-based reprojection would reproject the BACKGROUND position
  // (the world position under the moving surface is frame-invariant) and
  // ghost. Static pixels have mv == 0 and take the depth path.
  var depth = textureLoad(t_depth, px, 0);
  if (depth > 0.99999) { return vec4f(cur, 1.0); }
  depth = min(depth, 0.999995);
  var prevUv : vec2f;
  let mv = textureLoad(t_mv, px, 0).xy;
  if (length(mv) > 2e-5) {
    prevUv = vec2f(uv.x + mv.x, uv.y + mv.y);
  } else {
    let world = worldFromDepth(uv, depth, cam.invViewProj);
    let prevClip = cam.prevViewProj * vec4f(world, 1.0);
    prevUv = prevClip.xy / prevClip.w * 0.5 + vec2f(0.5);
  }
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
`,wt=`
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
`,Pt=`
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
`,Bt=`
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
`,_t=`
struct VolSlot {
  posR   : vec4f, // xyz = center, w = radius
  params : vec4f, // x = density, y = aniso (unused), z = noise scale, w = enabled
};

// group(0) = shared global bindings (cam, frame, shadow atlas, comparison sampler)
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(0) @binding(2) var t_shadow : texture_depth_2d;
@group(0) @binding(3) var smpCmp : sampler_comparison;
// group(1) = fog-specific resources
struct Light {
  posRange : vec4f,
  colorI   : vec4f,
  dirSpot  : vec4f,
  params   : vec4f,
};
@group(1) @binding(0) var<storage, read> volumes : array<VolSlot>;
@group(1) @binding(1) var<storage, read> lights : array<Light>;
@group(1) @binding(2) var t_out : texture_storage_3d<rgba16float, write>;

const VOL_N = 8u;

@compute @workgroup_size(8, 8, 4)
fn fogInject(@builtin(global_invocation_id) g : vec3u) {
  let fx = u32(frame.vol.z);
  let fy = u32(frame.vol.w);
  let fz = u32(frame.vol.y);
  if (g.x >= fx || g.y >= fy || g.z >= fz) { return; }

  // froxel center → world position (screen-space grid, linear depth slices)
  let ndcX = (f32(g.x) + 0.5) / f32(fx) * 2.0 - 1.0;
  let ndcY = 1.0 - (f32(g.y) + 0.5) / f32(fy) * 2.0;
  let dist = (f32(g.z) + 0.5) / f32(fz) * frame.vol.x;
  let d = max(dist, frame.params.x + 0.05);
  let zN = frame.params.y * (1.0 - frame.params.x / d) / (frame.params.y - frame.params.x);
  let wp = worldFromDepth(vec2f(ndcX * 0.5 + 0.5, ndcY * 0.5 + 0.5), zN, cam.invViewProj);

  // --- density: global height fog + local volumes ---
  let h = max(wp.y - frame.params.z, 0.0);
  let hf = exp(-h * frame.fog.y);
  let ground = 1.0 + frame.fog.z * saturate(1.0 - h / 8.0);
  var density = frame.fog.x * frame.extra.z * hf * ground;
  for (var v = 0u; v < VOL_N; v = v + 1u) {
    let V = volumes[v];
    if (V.params.w < 0.5) { continue; }
    let dv = wp - V.posR.xyz;
    let r = V.posR.w;
    let dd = dot(dv, dv);
    if (dd > r * r) { continue; }
    let fall = 1.0 - smoothstep(0.45, 1.0, sqrt(dd) / r);
    let noise = fbm2(wp.xz * V.params.z + vec2f(wp.y * 0.6, frame.fog.w * 0.045), 2);
    density += V.params.x * fall * (0.45 + 1.1 * noise);
  }

  // --- scattering radiance (per unit density) ---
  // sun coefficient 0.006 calibrates the atrium skylight shaft to ~150-200 HDR
  // (8x above the interior-ambient in-scatter; aerial haze stays legacy-scale)
  let sh = shadowAtten(frame, t_shadow, smpCmp, wp, vec3f(0.0, 1.0, 0.0), 1.0, max(dist, 1.0));
  var lit = frame.sunColor.rgb * 0.006 * (0.3 + 0.7 * sh);
  lit += vec3f(0.30, 0.38, 0.52) * frame.extra.w * 0.038; // ambient sky in-scatter
  let nLights = u32(frame.counts.z);
  for (var i = 0u; i < nLights; i = i + 1u) {
    let L = lights[i];
    let toL = L.posRange.xyz - wp;
    let d2 = dot(toL, toL);
    if (d2 > L.posRange.w * L.posRange.w) { continue; }
    let dl = sqrt(max(d2, 1e-4));
    let win = pow(saturate(1.0 - pow(dl / L.posRange.w, 4.0)), 2.0);
    var att = win / max(d2, 0.02);
    let cd = dot(-toL / dl, normalize(L.dirSpot.xyz));
    let spot = select(1.0, smoothstep(L.params.y, L.params.x, cd), L.params.z > 0.5);
    att *= spot;
    lit += L.colorI.rgb * L.colorI.w * att;
  }

  textureStore(t_out, vec3i(g), vec4f(lit, density));
}
`,zt=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_in : texture_3d<f32>;
@group(1) @binding(1) var t_out : texture_storage_3d<rgba16float, write>;

@compute @workgroup_size(8, 8)
fn fogIntegrate(@builtin(global_invocation_id) g : vec3u) {
  let fx = u32(frame.vol.z);
  let fy = u32(frame.vol.w);
  let fz = u32(frame.vol.y);
  if (g.x >= fx || g.y >= fy) { return; }

  // column view direction at mid slice (HG phase is slowly varying per 8x8 tile)
  let ndcX = (f32(g.x) + 0.5) / f32(fx) * 2.0 - 1.0;
  let ndcY = 1.0 - (f32(g.y) + 0.5) / f32(fy) * 2.0;
  let distMid = 0.5 * frame.vol.x;
  let d = max(distMid, frame.params.x + 0.05);
  let zN = frame.params.y * (1.0 - frame.params.x / d) / (frame.params.y - frame.params.x);
  let wpm = worldFromDepth(vec2f(ndcX * 0.5 + 0.5, ndcY * 0.5 + 0.5), zN, cam.invViewProj);
  let dir = normalize(wpm - cam.camPos.xyz);
  let cosg = dot(dir, frame.sunDir.xyz);
  let phase = 0.4 + 2.4 * henyeyGreenstein(cosg, 0.62);

  let segLen = frame.vol.x / f32(fz);
  var trans = 1.0;
  var insc = vec3f(0.0);
  for (var s = 0; s < i32(fz); s = s + 1) {
    let v = textureLoad(t_in, vec3i(i32(g.x), i32(g.y), s), 0);
    insc += v.rgb * v.a * segLen * trans * phase;
    trans *= exp(-v.a * segLen);
    textureStore(t_out, vec3i(i32(g.x), i32(g.y), s), vec4f(insc, trans));
  }
}
`,Lt=`
struct Decal {
  posYaw  : vec4f, // xyz = center, w = yaw
  halfExt : vec4f, // xyz = half extents, w = mode (0 = disabled)
  tint    : vec4f, // rgb = albedo / stain multiplier, a = unused
  params2 : vec4f, // x = gloss, y = mask scale, z = mask threshold, w = unused
};

@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var t_g0 : texture_2d<f32>;
@group(1) @binding(1) var t_g1 : texture_2d<f32>;
@group(1) @binding(2) var t_g2 : texture_2d<f32>;
@group(1) @binding(3) var t_depth : texture_depth_2d;
@group(1) @binding(4) var<storage, read> decals : array<Decal>;

const DECAL_N = 50u;

struct DecOut {
  @location(0) g0 : vec4f,
  @location(1) g1 : vec4f,
  @location(2) g2 : vec4f,
};

@fragment
fn fs_decals(in : FSOut) -> DecOut {
  let px = vec2i(in.clip.xy);
  let uv = in.clip.xy * frame.screen.zw;
  var g0 = textureLoad(t_g0, px, 0);
  var g1 = textureLoad(t_g1, px, 0);
  var g2 = textureLoad(t_g2, px, 0);
  let depth = textureLoad(t_depth, px, 0);
  if (depth > 0.99999) { return DecOut(g0, g1, g2); }
  let world = worldFromDepth(uv, depth, cam.invViewProj);

  for (var i = 0u; i < DECAL_N; i = i + 1u) {
    let D = decals[i];
    if (D.halfExt.w < 0.5) { continue; }
    let rel = world - D.posYaw.xyz;
    let cy = cos(D.posYaw.w);
    let sy = sin(D.posYaw.w);
    let lx =  cy * rel.x + sy * rel.z;
    let lz = -sy * rel.x + cy * rel.z;
    let le = D.halfExt.xyz;
    let d = max(max(abs(lx) / le.x, abs(rel.y) / le.y), abs(lz) / le.z);
    if (d > 1.0) { continue; }
    let uvd = vec2f(lx / le.x, lz / le.z) * 0.5 + vec2f(0.5);
    let edge = smoothstep(1.0, 0.68, d);
    let nrm = fbm2(uvd * D.params2.y, 3);
    let mask = edge * smoothstep(D.params2.z - 0.11, D.params2.z + 0.11, nrm);
    if (mask < 0.004) { continue; }
    let mode = D.halfExt.w;
    if (mode < 1.5) {
      // wet puddle: gloss lift, F0 → water, slight albedo darkening
      g1.w = mix(g1.w, 0.88 + nrm * 0.08, mask);
      g2 = vec4f(mix(g2.rgb, vec3f(0.02), mask), mix(g2.a, 0.0, mask));
      let stainA = mix(g0.rgb, g0.rgb * D.tint.rgb, mask * 0.8);
      g0.r = stainA.r; g0.g = stainA.g; g0.b = stainA.b;
    } else if (mode < 2.5) {
      // albedo decal (algae / sand / grime paint)
      let stainB = mix(g0.rgb, D.tint.rgb, mask);
      g0.r = stainB.r; g0.g = stainB.g; g0.b = stainB.b;
      g1.w = mix(g1.w, D.params2.x, mask);
    } else {
      // dark stain with gloss change
      let stainC = mix(g0.rgb, g0.rgb * D.tint.rgb, mask);
      g0.r = stainC.r; g0.g = stainC.g; g0.b = stainC.b;
      g1.w = mix(g1.w, D.params2.x, mask);
    }
  }
  return DecOut(g0, g1, g2);
}
`,Tt=`
struct Zones {
  z : array<vec4f, 20>,  // 9 zones × 2 vec4: (cx,cy,cz,r) + (type, first, count, seedBase)
  n : vec4f,             // x = zone count
};

@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var<uniform> zones : Zones;
@group(1) @binding(1) var<storage, read_write> parts : array<Part>;

struct Part {
  a : vec4f,
  b : vec4f,
  c : vec4f,
};

const PART_N : u32 = 9216u;

fn sHash(i : u32) -> vec4f {
  var s = vec4f(f32(i) * 0.61803398875 + 0.12345,
                f32(i) * 0.75487766624 + 0.51739,
                f32(i) * 0.56984029099 + 0.90834,
                f32(i) * 0.41984248087 + 0.28451);
  s = fract(s * vec4f(127.31, 311.7, 74.7, 269.5));
  s = fract(s * vec4f(127.31, 311.7, 74.7, 269.5) + vec4f(0.37));
  return fract(s * vec4f(269.5, 183.3, 246.1, 113.9) + 0.5);
}

@compute
@workgroup_size(64)
fn simMain(@builtin(global_invocation_id) gid : vec3u) {
  let i = gid.x;
  if (i >= PART_N) { return; }
  let t = frame.fog.w;

  // locate zone by particle index (9 zones, linear scan)
  var zn = -1;
  for (var k = 0; k < 9; k = k + 1) {
    if (k >= i32(zones.n.x)) { break; }
    let zm = zones.z[u32(k) * 2u + 1u];
    let first = i32(zm.y);
    if (i32(i) >= first && i32(i) < first + i32(zm.z)) { zn = k; }
  }
  if (zn < 0) {
    // dormant slot: zero size → degenerate billboard, never visible
    parts[i].a = vec4f(0.0, -50.0, 0.0, 0.0);
    parts[i].b = vec4f(0.0);
    parts[i].c = vec4f(0.0);
    return;
  }

  let zoneA = zones.z[u32(zn) * 2u];
  let zoneB = zones.z[u32(zn) * 2u + 1u];
  let zc = zoneA.xyz;
  let zr = zoneA.w;
  let ztype = zoneB.x;
  let pi = i - u32(zoneB.y); // particle index within zone
  let s = sHash(i);

  if (ztype < 0.5) {
    // ---- FloatingDust: slow curl-ish drift inside the volume, twinkle ----
    let lifeT = 7.0 + s.x * 9.0;
    let ph = fract(s.y * 13.71 + t / lifeT);
    // slow vertical rise/loop so dust rides the air
    let R = zr * (0.25 + 0.72 * s.z);
    let th0 = s.w * 6.28318;
    let base = vec3f(
      zc.x + cos(th0) * R + sin(t * 0.17 + s.x * 40.0) * 0.42,
      zc.y + (ph - 0.5) * zr * 1.35 + sin(t * 0.23 + s.y * 51.0) * 0.30,
      zc.z + sin(th0) * R + cos(t * 0.19 + s.z * 63.0) * 0.42,
    );
    // gentle swirl (curl proxy)
    let sw = vec3f(
      sin(t * 0.31 + s.w * 91.0) * 0.24 + sin(t * 0.83 + s.x * 17.0) * 0.07,
      sin(t * 0.27 + s.y * 71.0) * 0.16,
      cos(t * 0.29 + s.z * 83.0) * 0.24 + cos(t * 0.91 + s.w * 23.0) * 0.07,
    );
    let pos = base + sw;
    let twinkle = 0.35 + 0.5 * pow(max(sin(t * 1.35 + s.x * 47.0), 0.0), 2.0);
    let size = 0.006 + s.z * 0.013;
    parts[i].a = vec4f(pos, size);
    parts[i].b = vec4f(0.0, 0.0, s.x, 0.9 + s.y * 0.5);
    parts[i].c = vec4f(0.0, twinkle, 0.0, 0.0);
  } else if (ztype < 1.5) {
    // ---- FallingLeaves: spiral descent with flutter, respawn on cycle ----
    let lifeT = 8.5 + s.x * 6.0;
    let ph = fract(s.y * 7.77 + t / lifeT);
    let discR = zr * 0.62 * sqrt(max(s.z, 0.05));
    let th0 = s.w * 6.28318;
    let fall = ph * 3.1 - 0.55; // from +2.55 above center to -1.65 below
    let pos = vec3f(
      zc.x + cos(th0) * discR + sin(t * 1.15 + s.x * 33.0) * 0.55 * ph,
      zc.y + fall,
      zc.z + sin(th0) * discR + cos(t * 0.95 + s.z * 27.0) * 0.55 * ph,
    );
    let roll = t * (1.4 + s.w * 1.8) + s.x * 6.28318;
    let fade = smoothstep(0.0, 0.06, ph) * (1.0 - smoothstep(0.94, 1.0, ph));
    let size = 0.038 + s.z * 0.035;
    parts[i].a = vec4f(pos, size);
    parts[i].b = vec4f(roll, 0.0, s.x, 1.0);
    parts[i].c = vec4f(1.0, fade, s.w, 0.0);
  } else {
    // ---- Butterflies: analytic Lissajous flight around the zone ----
    let w1 = 0.21 + s.x * 0.12;
    let w2 = 0.33 + s.y * 0.14;
    let w3 = 0.26 + s.z * 0.11;
    let R = zr * (0.35 + 0.5 * s.w);
    let pos = vec3f(
      zc.x + sin(t * w1 + s.x * 6.28318) * R,
      zc.y + 0.55 * sin(t * w2 + s.y * 6.28318),
      zc.z + cos(t * w3 + s.z * 6.28318) * R * 0.8,
    );
    // heading = analytic velocity direction (finite difference)
    let e = 0.05;
    let nx = zc.x + sin((t + e) * w1 + s.x * 6.28318) * R;
    let nz = zc.z + cos((t + e) * w3 + s.z * 6.28318) * R * 0.8;
    let yaw = atan2(nz - pos.z, nx - pos.x);
    let flap = t * 21.0 + s.w * 6.28318;
    let size = 0.11 + s.z * 0.05; // one-wing span
    parts[i].a = vec4f(pos, size);
    parts[i].b = vec4f(yaw, flap, s.x, 0.95);
    parts[i].c = vec4f(2.0, 1.0, s.w, 0.0);
  }
}
`,St=`
struct Part {
  a : vec4f,
  b : vec4f,
  c : vec4f,
};

@group(0) @binding(0) var<uniform> cam : Camera;
@group(0) @binding(1) var<uniform> frame : Frame;
@group(1) @binding(0) var<storage, read> parts : array<Part>;

struct VSOut {
  @builtin(position) clip : vec4f,
  @location(0) uv : vec2f,
  @location(1) @interpolate(flat) kind : u32,   // 0 dust/billboard, 1 leaf, 2 body, 3 wingL, 4 wingR
  @location(2) @interpolate(flat) pc0 : vec4f,  // pos, size
  @location(3) @interpolate(flat) pc1 : vec4f,  // yaw, flap, seed, bright
  @location(4) @interpolate(flat) alpha : f32,
};

const PART_N : u32 = 9216u;

@vertex
fn vs_part(@location(0) corner : vec2f, @location(1) quadId : f32,
           @builtin(instance_index) ii : u32) -> VSOut {
  let p = parts[ii];
  let pt = p.c.x;
  var o : VSOut;
  o.uv = corner * 0.5 + 0.5;
  o.pc0 = p.a;
  o.pc1 = p.b;
  o.alpha = p.c.y;
  let size = p.a.w;

  // static scene billboard basis from the view matrix rows
  let right = vec3f(cam.view[0][0], cam.view[1][0], cam.view[2][0]);
  let up = vec3f(cam.view[0][1], cam.view[1][1], cam.view[2][1]);
  var world = vec3f(0.0, -50.0, 0.0);
  var kind = 0u;

  if (pt < 0.5) {
    // dust: camera-facing round billboard
    kind = 0u;
    world = p.a.xyz + (right * corner.x + up * corner.y) * size;
  } else if (pt < 1.5) {
    // leaf: billboard rolled around the view axis (spin)
    kind = 1u;
    let roll = p.b.x;
    let cr = cos(roll) * corner.x - sin(roll) * corner.y;
    let sr = sin(roll) * corner.x + cos(roll) * corner.y;
    world = p.a.xyz + (right * cr + up * sr * 0.62) * size;
  } else if (quadId < 0.5) {
    // butterfly body: narrow vertical billboard
    kind = 2u;
    world = p.a.xyz + (right * corner.x * size * 0.09 + up * corner.y * size * 0.30);
  } else {
    // wings: vertex-animated flap around the body axis
    let side = select(-1.0, 1.0, quadId > 1.5);
    kind = select(3u, 4u, quadId > 1.5);
    let yaw = p.b.x;
    let flap = sin(p.b.y) * 0.95;
    let fwd = vec3f(cos(yaw), 0.0, sin(yaw));
    let wup = vec3f(0.0, 1.0, 0.0);
    let wingDir = normalize(cross(wup, fwd));
    // wing plane tilts by flap: outward dir lifts/falls
    let outDir = wingDir * side * cos(flap) + wup * sin(flap) * 0.55;
    let chord = corner.y; // 0 at body, 1 at wing tip front... (uv.y along body axis)
    let span = corner.x;  // 0..1 outward
    // wing quad: chord along flight dir, span outward+flapped
    world = p.a.xyz
      + fwd * (0.15 + chord * 0.75) * size
      + outDir * span * size;
  }

  o.kind = kind;
  o.clip = cam.viewProj * vec4f(world, 1.0);
  return o;
}

@fragment
fn fs_part(in : VSOut) -> @location(0) vec4f {
  let toP = in.pc0.xyz - cam.camPos.xyz;
  let dist = length(toP);
  // near clamp (avoid screen-filling blobs) + far fade (fog budget)
  var fade = smoothstep(0.5, 1.1, dist) * (1.0 - smoothstep(frame.vol.x * 0.75, frame.vol.x, dist));
  if (fade <= 0.001) { discard; }
  let amb = skyAmbient(vec3f(0.0, 1.0, 0.0), frame);
  let sunT = frame.sunColor.rgb * 0.000018;
  var col = vec3f(0.0);
  var alpha = in.alpha * fade;

  if (in.kind == 0u) {
    // dust: soft round sprite, warm-grey, catches sun
    let d = length(in.uv - vec2f(0.5)) * 2.0;
    alpha *= smoothstep(1.0, 0.2, d);
    col = vec3f(1.0, 0.95, 0.86) * (amb * 1.25 + sunT * 0.9) * in.pc1.w;
  } else if (in.kind == 1u) {
    // leaf: pointed ellipse mask, central vein, green→ochre by seed
    let q = abs(in.uv - vec2f(0.5));
    let shape = smoothstep(0.5, 0.32, q.x * 1.35 + q.y * q.y * 2.4);
    let vein = 1.0 - 0.35 * smoothstep(0.06, 0.0, abs(in.uv.y - 0.5));
    let leafA = mix(vec3f(0.42, 0.55, 0.14), vec3f(0.80, 0.62, 0.16), in.pc1.z);
    col = leafA * vein * (amb + sunT * 1.1);
    alpha *= shape;
  } else if (in.kind == 2u) {
    // butterfly body: dark slim capsule
    let d = max(abs(in.uv.x - 0.5) * 2.0, abs(in.uv.y - 0.5) * 2.0);
    alpha *= smoothstep(1.0, 0.7, d);
    col = vec3f(0.10, 0.09, 0.11) * (amb + sunT) * 1.6;
  } else {
    // wings: orange with dark margin + light streak
    let q = abs(in.uv - vec2f(0.5));
    let shape = smoothstep(1.0, 0.86, max(q.x, q.y) * 2.0);
    let margin = smoothstep(0.55, 0.95, max(q.x, q.y) * 2.0);
    let streak = smoothstep(0.35, 0.0, abs(in.uv.y - 0.62)) * 0.35;
    let wing = mix(vec3f(0.82, 0.40, 0.08), vec3f(0.16, 0.08, 0.07), margin);
    let lit = amb * 0.85 + sunT;
    col = (wing + vec3f(1.0, 0.85, 0.4) * streak) * lit * in.pc1.w;
    col += wing * 0.10; // subsurface-ish lift so wings read in shade
    alpha *= shape;
  }
  if (alpha <= 0.003) { discard; }
  return vec4f(col * alpha, alpha);
}
`,Mt=`
@group(0) @binding(0) var<uniform> cam : Camera;
@group(1) @binding(0) var<uniform> joints : array<mat4x4f, 7>;
@group(1) @binding(1) var<uniform> prevJoints : array<mat4x4f, 7>;

struct VSIn {
  @location(0) pos : vec3f,
  @location(1) nrm : vec3f,
  @location(2) uv : vec2f,
  @location(3) skin : f32,
};

struct VSOut {
  @builtin(position) clip : vec4f,
  @location(0) worldPos : vec3f,
  @location(1) normal : vec3f,
  @location(2) uv : vec2f,
  @location(3) @interpolate(flat) matId : u32,
  @location(4) @interpolate(flat) skin : u32,
  @location(5) mv : vec2f,
};

@vertex
fn vs_char(in : VSIn) -> VSOut {
  let k = u32(in.skin + 0.5);
  let world = joints[k] * vec4f(in.pos, 1.0);
  let prevWorld = prevJoints[k] * vec4f(in.pos, 1.0);
  let clip = cam.viewProj * world;
  let prevClip = cam.prevViewProj * prevWorld;
  // motion vectors in UV space: prevUV - curUV (TAA consumes uv + mv)
  let mvCur = clip.xy / max(clip.w, 1e-5);
  let mvPrev = prevClip.xy / max(prevClip.w, 1e-5);
  let mv = (mvPrev - mvCur) * 0.5;

  var o : VSOut;
  o.clip = clip;
  o.worldPos = world.xyz;
  let nr = mat3x3f(
    joints[k][0].xyz,
    joints[k][1].xyz,
    joints[k][2].xyz,
  );
  o.normal = normalize(nr * in.nrm);
  o.uv = in.uv;
  o.matId = 5u; // fabric (same uber-material family as the sofa)
  o.skin = k;
  o.mv = mv;
  return o;
}

struct GBufOut {
  @location(0) g0 : vec4f, // rgb albedo, a = matId | layer nibble pack
  @location(1) g1 : vec4f, // xyz normal, w gloss
  @location(2) g2 : vec4f, // rgb F0, a metallic
  @location(3) g3 : vec2f, // motion vectors (uv delta)
};

@fragment
fn fs_char(in : VSOut) -> GBufOut {
  // materials: skin (head, joint 2) vs outfit (everything else)
  var albedo = vec3f(0.13, 0.15, 0.20);   // dark technical outfit
  var gloss = 0.12;
  if (in.skin == 2u) {
    albedo = vec3f(0.58, 0.44, 0.34);     // skin tone
    gloss = 0.24;
  } else if (in.skin == 3u || in.skin == 4u) {
    albedo = vec3f(0.20, 0.22, 0.27);     // jacket sleeves
  }
  var o : GBufOut;
  // M5 layer packing: matId low nibble + light layer high nibble
  o.g0 = vec4f(albedo, f32((in.matId & 0xF) | (layerOf(in.worldPos, in.matId) << 4)) / 255.0);
  o.g1 = vec4f(normalize(in.normal), gloss);
  o.g2 = vec4f(vec3f(0.04), 0.0);
  o.g3 = in.mv;
  return o;
}
`,Dt=`
@group(0) @binding(0) var<uniform> cascadeMat : mat4x4f;
@group(1) @binding(0) var<uniform> joints : array<mat4x4f, 7>;

struct VSIn {
  @location(0) pos : vec3f,
  @location(1) nrm : vec3f,
  @location(2) uv : vec2f,
  @location(3) skin : f32,
};

@vertex
fn vs_char_shadow(in : VSIn) -> @builtin(position) vec4f {
  let k = u32(in.skin + 0.5);
  let world = joints[k] * vec4f(in.pos, 1.0);
  return cascadeMat * world;
}
`,Oe=7;class Se{pos=[-17.8,1.125,0];yaw=Math.PI/2;walkPhase=0;speed=0;auto=!1;autoIdx=0;clock=0;walls=[];waypoints=[];groundFn;joints=new Float32Array(Oe*16);prevJoints=new Float32Array(Oe*16);hasPrev=!1;static mats=[j(),j(),j(),j()];constructor(e,i,t){this.walls=e,this.waypoints=i,this.groundFn=t,this.pos[1]=Math.max(t(this.pos[0],this.pos[2]),.9)}update(e,i,t){this.clock+=e;let s=0,o=0;if(this.auto){const b=this.waypoints[this.autoIdx],g=b[0]-this.pos[0],w=b[1]-this.pos[2],P=Math.hypot(g,w);P<.35&&(this.autoIdx=(this.autoIdx+1)%this.waypoints.length),s=g/Math.max(P,1e-4),o=w/Math.max(P,1e-4)}else if(i){s=i.moveX,o=i.moveZ;const b=Math.hypot(s,o);b>1e-4&&(s/=b,o/=b)}let u,l;if(this.auto)u=s,l=o;else{const b=Math.cos(t),g=Math.sin(t),w=-g,P=b;u=b*o+w*s,l=g*o+P*s}const m=Math.hypot(u,l)>.05,c=m?this.auto?1.55:2.6:0;if(this.speed+=(c-this.speed)*Math.min(1,e*8),m){let g=Math.atan2(l,u)-this.yaw;for(;g>Math.PI;)g-=Math.PI*2;for(;g<-Math.PI;)g+=Math.PI*2;this.yaw+=g*Math.min(1,e*10)}const f=this.speed*e;let d=this.pos[0]+Math.cos(this.yaw)*f,r=this.pos[2]+Math.sin(this.yaw)*f;const p=this.resolve(d,r);d=p[0],r=p[1],this.pos[0]=d,this.pos[2]=r;const h=this.groundFn(d,r);h>0&&(this.pos[1]=h),this.walkPhase+=this.speed*e*3.4,this.pose()}resolve(e,i){e=Math.max(-40.6,Math.min(37,e)),i=Math.max(-29,Math.min(29,i)),e<-17&&Math.abs(i)>1.45&&(i=Math.sign(i)*1.45);for(const[s,o,u,l]of this.walls){const m=Math.max(s,Math.min(e,u)),c=Math.max(o,Math.min(i,l)),f=e-m,d=i-c,r=f*f+d*d;if(r<.32*.32)if(r>1e-9){const p=Math.sqrt(r);e=m+f/p*.32,i=c+d/p*.32}else{const p=e-s,h=u-e,b=i-o,g=l-i,w=Math.min(p,h,b,g);w===p?e=s-.32:w===h?e=u+.32:w===b?i=o-.32:i=l+.32}}return[e,i]}pose(){this.hasPrev&&this.prevJoints.set(this.joints);const e=this.pos[1],i=this.walkPhase,t=Math.min(this.speed/1.6,1),s=Math.sin(i)*.52*t,o=Math.sin(i+Math.PI)*.38*t,u=Math.abs(Math.cos(i))*.045*t,l=Math.sin(i)*.055*t,m=.92,[c,f,d]=Se.mats,r=p=>new Float32Array(this.joints.buffer,p*64,16);Q(c,this.pos[0],e+m+u,this.pos[2]),Ae(c,c,this.yaw),r(0).set(c),Q(f,0,0,0),Ae(f,f,l),K(r(1),c,f),Q(d,0,.62,0),oe(d,d,Math.sin(i*2)*.035*t),K(r(2),r(1),d),Q(d,.26,.56,0),oe(d,d,o),K(r(3),r(1),d),Q(d,-.26,.56,0),oe(d,d,-o),K(r(4),r(1),d),Q(d,.11,.02,0),oe(d,d,-s),K(r(5),c,d),Q(d,-.11,.02,0),oe(d,d,s),K(r(6),c,d),this.hasPrev||(this.prevJoints.set(this.joints),this.hasPrev=!0)}}function kt(){const n=[],e=[],i=[],t=[],s=(l,m,c)=>{const f=c[0]/2,d=c[1]/2,r=c[2]/2,p=[{n:[0,0,1],c:[[-f,-d,r],[f,-d,r],[f,d,r],[-f,d,r]]},{n:[0,0,-1],c:[[f,-d,-r],[-f,-d,-r],[-f,d,-r],[f,d,-r]]},{n:[1,0,0],c:[[f,-d,r],[f,-d,-r],[f,d,-r],[f,d,r]]},{n:[-1,0,0],c:[[-f,-d,-r],[-f,-d,r],[-f,d,r],[-f,d,-r]]},{n:[0,1,0],c:[[-f,d,r],[f,d,r],[f,d,-r],[-f,d,-r]]},{n:[0,-1,0],c:[[-f,-d,-r],[f,-d,-r],[f,-d,r],[-f,-d,r]]}];for(const h of p){const b=n.length/3;for(const g of h.c)n.push(g[0]+m[0],g[1]+m[1],g[2]+m[2]),e.push(h.n[0],h.n[1],h.n[2]);i.push(b,b+1,b+2,b,b+2,b+3)}t.push(l)};s(1,[0,.3,0],[.36,.6,.22]),s(2,[0,.17,.02],[.22,.3,.24]),s(3,[0,-.29,0],[.12,.58,.14]),s(4,[0,-.29,0],[.12,.58,.14]),s(5,[0,-.46,0],[.16,.92,.18]),s(6,[0,-.46,0],[.16,.92,.18]);const o=n.length/3,u=new Float32Array(o*9);for(let l=0;l<o;l++){const m=Math.floor(l/24);u.set([n[l*3],n[l*3+1],n[l*3+2]],l*9),u.set([e[l*3],e[l*3+1],e[l*3+2]],l*9+3),u[l*9+6]=l%4===1||l%4===2?1:0,u[l*9+7]=l%4>=2?1:0,u[l*9+8]=t[m]}return{vertexData:u,indexData:new Uint32Array(i)}}const pe=[{name:"Performant",shadowAtlas:1024,ssao:!1,taa:!1,ssr:!1,fft:!1,oceanNear:96,oceanFar:48,volfog:!1,volHQ:!1},{name:"Balanced",shadowAtlas:2048,ssao:!0,taa:!1,ssr:!0,fft:!0,oceanNear:160,oceanFar:72,volfog:!0,volHQ:!1},{name:"High",shadowAtlas:4096,ssao:!0,taa:!0,ssr:!0,fft:!0,oceanNear:224,oceanFar:88,volfog:!0,volHQ:!0}],de=6,At=24,Ct=50,Rt=8,ze=9216,Gt=9;class Vt{graph;camera=new ot;uniforms;tierIndex=2;toggles={ssao:!0,taa:!0,bloom:!0,ocean:!0,ssr:!0,lut:!0,gi:!0,fft:!0,caus:!0,volfog:!0,decals:!0,layers:!1,sky:!0,cookie:!0,parts:!0,char:!0};char;charCamYaw=Math.PI;charCamPitch=.12;lastFrameCpuMs=0;frameNo=0;fftDiv=1;dev;canvasPrivate;ctx;scene;sceneVB;sceneIB;camBuf;frameBuf;cascadeBuf=[];lightsBuf;statsBuf;meshConstBufs=[];whiteTex;blackTex;oceanNearVB;oceanNearIB;oceanNearCount=0;oceanFarVB;oceanFarIB;oceanFarCount=0;pShadow;pGbuffer;pCull;pSsao;pBlur;pLighting;pTaa;pSsr;pRefl;pOcean;pGen;pFft;pPack;pExpAccum;pExpFinal;pBloomPre;pBloomDown;pBloomUp;pTonemap;pFogInject;pFogIntegrate;pDecals;pPartSim;pPartDraw;pChar;pCharShadow;bglGlobal;bglMesh;bglCull;bglSsao;bglBlur;bglLighting;bglOcean;bglGen;bglFft;bglPack;bglSsr;bglRefl;bglTaa;bglExp;bglBloom0;bglBloom1;bglTonemap;bglFogInject;bglFogIntegrate;bglDecals;bglPartSim;bglPartDraw;bglChar;gridCountsBuf;gridIndicesBuf;destBufs=[];bgGlobal;bgCascade=[];bgMesh=[];bgCull;bgSsao;bgBlur;bgLightingAo;bgLightingWhite;bgSsr;bgRefl;bgOcean;bgGen;bgFft=[];bgPack;fftPassBufs=[];fftA0View;fftA1View;fftB0View;fftB1View;dispView;bgFogInject;bgFogIntegrate;bgDecals;bgPartSim;bgPartDraw;bgChar;bgTaa;bgExp;bgTonemapBloom;bgTonemapBlack;bgBloom=[];bloomPasses=[];shadowView;g0View;g1View;g2View;g0mView;g1mView;g2mView;depthView;hdrAView;hdrA2View;ssrHalfView;hdrBView;hdrCView;historyView;bloomViews=[];aoHalfView;aoHalf2View;volFogAView;volFogBView;skyLutTex;skyLutView;decalBuf;volumeBuf;partBuf;zonesBuf;charJointsBuf;charVB;charIB;charIdxCount=0;partQuadVB;partQuadIB;g3View;whiteView;blackView;smpRep;probesBuf;lutTex;lutView;W=0;H=0;atlas=2048;zerobuffer=new Uint32Array(0);constructor(e,i){this.ctx=e,this.dev=e.device,this.canvasPrivate=e.canvas,this.graph=new et(this.dev),this.scene=i,this.uniforms=new nt(i.lights)}put(e,i,t=0){this.dev.queue.writeBuffer(e,t,i)}get tier(){return pe[this.tierIndex]}volDims(){const e=Number(new URLSearchParams(location.search).get("volq")??0);return e===2?[48,27,24]:e===1?[64,36,32]:this.tier.volHQ?[96,54,48]:[64,36,32]}bakeSkyLut(){const e=this.dev,i=48,t=32,s=24,o=this.uniforms.bakeSkyLut();this.skyLutTex=e.createTexture({size:[i,t,s],dimension:"3d",format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.skyLutTex},o,{bytesPerRow:i*8,rowsPerImage:t},[i,t,s]),this.skyLutView=this.skyLutTex.createView({dimension:"3d"})}get canvas(){return this.canvasPrivate}adapterNameShort(){const e=this.ctx.adapterName;return e.length>46?e.slice(0,44)+"…":e}async init(){const e=this.dev;this.uniforms.updateSun(),this.uniforms.setProbes(this.scene.probes),this.uniforms.bakeProbes(),this.probesBuf=e.createBuffer({size:Le*80,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.probesBuf,this.uniforms.probeData),this.bakeLut(),this.bakeSkyLut(),this.sceneVB=e.createBuffer({size:this.scene.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneVB,this.scene.vertexData),this.sceneIB=e.createBuffer({size:this.scene.indexData.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneIB,this.scene.indexData),this.camBuf=e.createBuffer({size:272,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.frameBuf=e.createBuffer({size:512,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});for(let P=0;P<4;P++){const L=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.cascadeBuf.push(L),this.bgCascade.push(e.createBindGroup({layout:this.bglMeshAfter(),entries:[{binding:0,resource:{buffer:L}}]}))}const i=this.scene.lights.length*64;this.lightsBuf=e.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.lightsBuf,this.uniforms.lightData),this.uniforms.setDecalsAndVolumes(this.scene.decals,this.scene.volumes),this.decalBuf=e.createBuffer({size:Ct*64,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.decalBuf,this.uniforms.decalData),this.volumeBuf=e.createBuffer({size:Rt*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.volumeBuf,this.uniforms.volumeData),this.partBuf=e.createBuffer({size:ze*48,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});const t=new Float32Array(84),s=this.scene.vfxZones.slice(0,Gt);let o=0;s.forEach((P,L)=>{const S=L*8;t[S]=P.pos[0],t[S+1]=P.pos[1],t[S+2]=P.pos[2],t[S+3]=P.radius,t[S+4]=P.type,t[S+5]=o,t[S+6]=P.count,t[S+7]=0,o+=P.count}),t[80]=s.length,this.zonesBuf=e.createBuffer({size:t.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.put(this.zonesBuf,t);const u=kt();this.charVB=e.createBuffer({size:u.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.charVB,u.vertexData),this.charIB=e.createBuffer({size:u.indexData.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.charIB,u.indexData),this.charIdxCount=u.indexData.length,this.charJointsBuf=e.createBuffer({size:1024,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.char=new Se(this.scene.nav.walls,this.scene.nav.waypoints,Qe);const l=new Float32Array(48);[[[-1,-1],0],[[1,-1],0],[[1,1],0],[[-1,1],0],[[0,0],1],[[1,0],1],[[1,1],1],[[0,1],1],[[0,0],2],[[1,0],2],[[1,1],2],[[0,1],2]].forEach(([P,L],S)=>{l.set([P[0],P[1],L,0],S*4)}),this.partQuadVB=e.createBuffer({size:l.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.partQuadVB,l);const c=new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11]);this.partQuadIB=e.createBuffer({size:48,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.partQuadIB,c);const[f,d,r]=this.volDims(),p=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING,h=e.createTexture({size:[f,d,r],dimension:"3d",format:"rgba16float",usage:p}),b=e.createTexture({size:[f,d,r],dimension:"3d",format:"rgba16float",usage:p});this._volTex=[h,b],this.volFogAView=h.createView({dimension:"3d"}),this.volFogBView=b.createView({dimension:"3d"}),this.statsBuf=e.createBuffer({size:272,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.put(this.statsBuf,new Float32Array([-3,.02,0]),256);for(const P of this.scene.groups){const L=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(L,new Float32Array([P.matId,0,0,0])),this.meshConstBufs.push(L)}this.whiteTex=e.createTexture({size:[4,4],format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.whiteTex},new Uint8Array(16).fill(255),{bytesPerRow:4,rowsPerImage:4},[4,4]),this.blackTex=e.createTexture({size:[4,4],format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.blackTex},new Float32Array(64),{bytesPerRow:32,rowsPerImage:4},[4,4]),this.whiteView=this.whiteTex.createView(),this.blackView=this.blackTex.createView(),this.createPipelines(),this.initFft();const g=new URLSearchParams(location.search);g.get("fft")==="0"&&(this.toggles.fft=!1),g.get("caus")==="0"&&(this.toggles.caus=!1),g.get("froxel")==="0"&&(this.toggles.volfog=!1),g.get("decals")==="0"&&(this.toggles.decals=!1),g.get("sky")==="0"&&(this.toggles.sky=!1),g.get("cookie")==="0"&&(this.toggles.cookie=!1),g.get("layers")==="1"&&(this.toggles.layers=!0),g.get("parts")==="0"&&(this.toggles.parts=!1),g.get("char")==="0"&&(this.toggles.char=!1),g.get("char")==="auto"&&(this.char.auto=!0);const w=Number(g.get("fftdiv")??0);w>=1&&(this.fftDiv=Math.floor(w));for(const P of this.scene.groups)this.bgMesh.push(e.createBindGroup({layout:this.bglMesh,entries:[{binding:0,resource:{buffer:this.meshConstBufs[this.bgMesh.length]}}]}));this.rebuildOcean()}bglMeshAfter(){return this.bglMesh||(this.bglMesh=this.dev.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})),this.bglMesh}rebuildOcean(){const e=this.dev,i=Number(new URLSearchParams(location.search).get("oceansize")??0),t=i>0?i:this.tier.oceanNear;this.oceanNearVB?.destroy(),this.oceanNearIB?.destroy(),this.oceanFarVB?.destroy(),this.oceanFarIB?.destroy();const s=this.makeGrid(t,380,-14,0,0),o=this.makeDisk(Math.max(this.tier.oceanFar>>1,24),Math.max(this.tier.oceanFar*2,96),1500,-14,0,-.35);this.oceanNearVB=e.createBuffer({size:s.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearVB,s.pos),this.oceanNearIB=e.createBuffer({size:s.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearIB,s.idx),this.oceanNearCount=s.idx.length,this.oceanFarVB=e.createBuffer({size:o.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarVB,o.pos),this.oceanFarIB=e.createBuffer({size:o.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarIB,o.idx),this.oceanFarCount=o.idx.length}makeDisk(e,i,t,s,o,u){const l=new Float32Array((e+1)*i*3);for(let f=0;f<=e;f++){const d=f/e*t;for(let r=0;r<i;r++){const p=r/i*Math.PI*2,h=(f*i+r)*3;l[h]=s+Math.cos(p)*d,l[h+1]=u,l[h+2]=o+Math.sin(p)*d}}const m=new Uint32Array(e*i*6);let c=0;for(let f=0;f<e;f++)for(let d=0;d<i;d++){const r=(d+1)%i,p=f*i+d,h=(f+1)*i+d;m[c++]=p,m[c++]=h,m[c++]=h+r-d,m[c++]=p,m[c++]=h+r-d,m[c++]=p+(r-d)}return{pos:l,idx:m}}makeGrid(e,i,t,s,o){const u=new Float32Array(e*e*3),l=i/(e-1);for(let d=0;d<e;d++)for(let r=0;r<e;r++){const p=(d*e+r)*3;u[p]=t-i/2+r*l,u[p+1]=o,u[p+2]=s-i/2+d*l}const m=(e-1)*(e-1),c=new Uint32Array(m*6);let f=0;for(let d=0;d<e-1;d++)for(let r=0;r<e-1;r++){const p=d*e+r;c[f++]=p,c[f++]=p+e,c[f++]=p+e+1,c[f++]=p,c[f++]=p+e+1,c[f++]=p+1}return{pos:u,idx:c}}createPipelines(){const e=this.dev,i=this.module(I+lt),t=this.module(I+ct),s=this.module(I+ft),o=this.module(I+ut),u=this.module(I+dt),l=this.module(I+ht),m=this.module(I+bt),c=this.module(I+xt),f=new URLSearchParams(location.search).get("ocean")??"full";let d;if(f==="flat")d=I+pt+Fe;else if(f==="constfs"){const U=_e.indexOf("@fragment");d=I+_e.slice(0,U)+Fe}else d=I+_e;const r=this.module(d),p=this.module(I+gt),h=this.module(mt),b=this.module(vt),g=this.module(I+yt),w=this.module(I+wt),P=this.module(I+Pt),L=this.module(I+Bt),S=this.module(I+_t),M=this.module(I+zt),D=this.module(I+Lt),k=this.module(I+Tt),v=this.module(I+St),z=this.module(I+Mt),T=this.module(I+Dt),a=GPUShaderStage.FRAGMENT,B=GPUShaderStage.VERTEX,y=GPUShaderStage.COMPUTE,x={sampleType:"float"};this.bglGlobal=e.createBindGroupLayout({entries:[{binding:0,visibility:B|a|y,buffer:{type:"uniform"}},{binding:1,visibility:B|a|y,buffer:{type:"uniform"}},{binding:2,visibility:a|y,texture:{sampleType:"depth"}},{binding:3,visibility:a|y,sampler:{type:"comparison"}},{binding:4,visibility:a,texture:{sampleType:"float",viewDimension:"3d"}},{binding:5,visibility:a,sampler:{type:"filtering"}}]}),this.bglCull=e.createBindGroupLayout({entries:[{binding:0,visibility:y,buffer:{type:"read-only-storage"}},{binding:1,visibility:y,buffer:{type:"storage"}},{binding:2,visibility:y,buffer:{type:"storage"}},{binding:3,visibility:y,texture:{sampleType:"depth"}},{binding:4,visibility:y,buffer:{type:"uniform"}},{binding:5,visibility:y,buffer:{type:"uniform"}}]}),this.bglSsao=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:{sampleType:"depth"}},{binding:1,visibility:a,texture:x}]}),this.bglBlur=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,sampler:{type:"filtering"}}]}),this.bglLighting=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,texture:x},{binding:2,visibility:a,texture:x},{binding:3,visibility:a,texture:{sampleType:"depth"}},{binding:4,visibility:a,texture:x},{binding:5,visibility:a,buffer:{type:"read-only-storage"}},{binding:6,visibility:a,buffer:{type:"read-only-storage"}},{binding:7,visibility:a,buffer:{type:"read-only-storage"}},{binding:8,visibility:a,buffer:{type:"read-only-storage"}},{binding:9,visibility:a,texture:{sampleType:"float",viewDimension:"3d"}},{binding:10,visibility:a,texture:{sampleType:"float",viewDimension:"3d"}},{binding:11,visibility:a,sampler:{type:"filtering"}}]}),this.bglOcean=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,texture:{sampleType:"depth"}},{binding:2,visibility:a,sampler:{type:"filtering"}},{binding:3,visibility:B|a,texture:x},{binding:4,visibility:B|a,sampler:{type:"filtering"}},{binding:5,visibility:a,texture:{sampleType:"float",viewDimension:"3d"}},{binding:6,visibility:a,texture:{sampleType:"float",viewDimension:"3d"}}]}),this.bglGen=e.createBindGroupLayout({entries:[{binding:0,visibility:y,buffer:{type:"uniform"}},{binding:1,visibility:y,storageTexture:{access:"write-only",format:"rgba32float"}},{binding:2,visibility:y,storageTexture:{access:"write-only",format:"rgba32float"}}]}),this.bglFft=e.createBindGroupLayout({entries:[{binding:0,visibility:y,buffer:{type:"uniform"}},{binding:1,visibility:y,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:2,visibility:y,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:3,visibility:y,storageTexture:{access:"write-only",format:"rgba32float"}},{binding:4,visibility:y,storageTexture:{access:"write-only",format:"rgba32float"}}]}),this.bglPack=e.createBindGroupLayout({entries:[{binding:0,visibility:y,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:1,visibility:y,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:2,visibility:y,storageTexture:{access:"write-only",format:"rgba16float"}}]}),this.bglSsr=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,texture:x},{binding:2,visibility:a,texture:x},{binding:3,visibility:a,texture:{sampleType:"depth"}},{binding:4,visibility:a,texture:x},{binding:5,visibility:a,sampler:{type:"filtering"}},{binding:6,visibility:a,texture:{sampleType:"float",viewDimension:"3d"}}]}),this.bglRefl=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,texture:x},{binding:2,visibility:a,texture:x},{binding:3,visibility:a,texture:x},{binding:4,visibility:a,texture:{sampleType:"depth"}},{binding:5,visibility:a,sampler:{type:"filtering"}}]}),this.bglTaa=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,texture:x},{binding:2,visibility:a,texture:{sampleType:"depth"}},{binding:3,visibility:a,sampler:{type:"filtering"}},{binding:4,visibility:a,texture:x}]}),this.bglExp=e.createBindGroupLayout({entries:[{binding:0,visibility:y,texture:x},{binding:1,visibility:y,buffer:{type:"storage"}},{binding:2,visibility:y,buffer:{type:"uniform"}}]}),this.bglBloom0=e.createBindGroupLayout({entries:[{binding:0,visibility:a,buffer:{type:"uniform"}},{binding:1,visibility:a,buffer:{type:"uniform"}}]}),this.bglBloom1=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,sampler:{type:"filtering"}},{binding:2,visibility:a,buffer:{type:"read-only-storage"}}]}),this.bglTonemap=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,texture:x},{binding:2,visibility:a,buffer:{type:"read-only-storage"}},{binding:3,visibility:a,sampler:{type:"filtering"}},{binding:4,visibility:a,texture:{sampleType:"float",viewDimension:"3d"}}]}),this.bglFogInject=e.createBindGroupLayout({entries:[{binding:0,visibility:y,buffer:{type:"read-only-storage"}},{binding:1,visibility:y,buffer:{type:"read-only-storage"}},{binding:2,visibility:y,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"3d"}}]}),this.bglFogIntegrate=e.createBindGroupLayout({entries:[{binding:0,visibility:y,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:y,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"3d"}}]}),this.bglDecals=e.createBindGroupLayout({entries:[{binding:0,visibility:a,texture:x},{binding:1,visibility:a,texture:x},{binding:2,visibility:a,texture:x},{binding:3,visibility:a,texture:{sampleType:"depth"}},{binding:4,visibility:a,buffer:{type:"read-only-storage"}}]}),this.bglPartSim=e.createBindGroupLayout({entries:[{binding:0,visibility:y,buffer:{type:"uniform"}},{binding:1,visibility:y,buffer:{type:"storage"}}]}),this.bglPartDraw=e.createBindGroupLayout({entries:[{binding:0,visibility:B|a,buffer:{type:"read-only-storage"}}]}),this.bglChar=e.createBindGroupLayout({entries:[{binding:0,visibility:B,buffer:{type:"uniform"}},{binding:1,visibility:B,buffer:{type:"uniform"}}]}),this.bglMeshAfter();const A={arrayStride:32,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]},R={arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},V={arrayStride:36,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"},{shaderLocation:3,offset:32,format:"float32"}]},E={arrayStride:16,attributes:[{shaderLocation:0,offset:0,format:"float32x2"},{shaderLocation:1,offset:8,format:"float32"}]},G=(U,H,Y)=>({module:U,entryPoint:H,targets:Y}),F=U=>({vertex:{module:U,entryPoint:"vs_fs"}});this.pShadow=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglMesh]}),vertex:{module:t,entryPoint:"vs_shadow",buffers:[A]},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.pGbuffer=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglMesh]}),vertex:{module:i,entryPoint:"vs_mesh",buffers:[A]},fragment:G(i,"fs_gbuffer",[{format:"rgba8unorm"},{format:"rgba16float"},{format:"rgba8unorm"},{format:"rg16float"}]),depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{cullMode:"back"}}),this.pChar=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglChar]}),vertex:{module:z,entryPoint:"vs_char",buffers:[V]},fragment:G(z,"fs_char",[{format:"rgba8unorm"},{format:"rgba16float"},{format:"rgba8unorm"},{format:"rg16float"}]),depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{cullMode:"back"}}),this.pCharShadow=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglMesh,this.bglChar]}),vertex:{module:T,entryPoint:"vs_char_shadow",buffers:[V]},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.pPartSim=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglPartSim]}),compute:{module:k,entryPoint:"simMain"}}),this.pPartDraw=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglPartDraw]}),vertex:{module:v,entryPoint:"vs_part",buffers:[E]},fragment:G(v,"fs_part",[{format:"rgba16float",blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]),depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less-equal"},primitive:{cullMode:"none"}}),this.pCull=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglCull]}),compute:{module:s,entryPoint:"cullMain"}}),this.pSsao=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsao]}),...F(o),fragment:G(o,"fs_ssao",[{format:"r8unorm"}])}),this.pBlur=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglBlur]}),...F(u),fragment:G(u,"fs_aoBlur",[{format:"r8unorm"}])}),this.pLighting=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglLighting]}),...F(l),fragment:G(l,"fs_lighting",[{format:"rgba16float"}])}),this.pTaa=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTaa]}),...F(g),fragment:G(g,"fs_taa",[{format:"rgba16float"}])}),this.pSsr=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsr]}),...F(m),fragment:G(m,"fs_ssr",[{format:"rgba16float"}])}),this.pRefl=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglRefl]}),...F(c),fragment:G(c,"fs_refl",[{format:"rgba16float"}])});const N=new URLSearchParams(location.search).get("odepth")==="0",W=new URLSearchParams(location.search).get("obgl")==="0";this.pOcean=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:W?[this.bglGlobal]:[this.bglGlobal,this.bglOcean]}),vertex:{module:r,entryPoint:"vs_ocean",buffers:[R]},fragment:G(r,"fs_ocean",[{format:"rgba16float"}]),...N?{}:{depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"}},primitive:{cullMode:"none"}}),this.pGen=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGen]}),compute:{module:p,entryPoint:"genSpectrum"}}),this.pFft=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglFft]}),compute:{module:h,entryPoint:"fftPass"}}),this.pPack=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglPack]}),compute:{module:b,entryPoint:"packDisp"}}),this.pExpAccum=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:w,entryPoint:"expAccum"}}),this.pExpFinal=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:w,entryPoint:"expFinal"}});const O={color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}};this.pBloomPre=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...F(P),fragment:G(P,"fs_bloomPrefilter",[{format:"rgba16float"}])}),this.pBloomDown=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...F(P),fragment:G(P,"fs_bloomDown",[{format:"rgba16float"}])}),this.pBloomUp=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...F(P),fragment:G(P,"fs_bloomUp",[{format:"rgba16float",blend:O}])}),this.pTonemap=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTonemap]}),...F(L),fragment:G(L,"fs_tonemap",[{format:this.ctx.format}])}),this.pFogInject=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglFogInject]}),compute:{module:S,entryPoint:"fogInject"}}),this.pFogIntegrate=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglFogIntegrate]}),compute:{module:M,entryPoint:"fogIntegrate"}}),this.pDecals=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglDecals]}),...F(D),fragment:G(D,"fs_decals",[{format:"rgba8unorm"},{format:"rgba16float"},{format:"rgba8unorm"}])})}module(e){return this.dev.createShaderModule({code:e})}initFft(){const e=this.dev,i=256,t=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING,s=()=>{const h=e.createTexture({size:[i,i],format:"rgba32float",usage:t});return[h,h.createView()]},[o,u]=s(),[l,m]=s(),[c,f]=s(),[d,r]=s();this.fftA0View=u,this.fftA1View=m,this.fftB0View=f,this.fftB1View=r,this._fftTex=[o,l,c,d];const p=e.createTexture({size:[i,i],format:"rgba16float",usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC});this._dispTex=p,this.dispView=p.createView(),e.queue.writeTexture({texture:p},new Float32Array(i*i*4),{bytesPerRow:i*8,rowsPerImage:i},[i,i]),this.bgGen=e.createBindGroup({layout:this.bglGen,entries:[{binding:0,resource:{buffer:this.frameBuf}},{binding:1,resource:this.fftA0View},{binding:2,resource:this.fftB0View}]}),this.fftPassBufs=[],this.bgFft=[];for(let h=0;h<16;h++){const b=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(b,new Float32Array([1<<h%8,h<8?1:0,0,0])),this.fftPassBufs.push(b);const g=h%2===0?this.fftA0View:this.fftA1View,w=h%2===0?this.fftA1View:this.fftA0View,P=h%2===0?this.fftB0View:this.fftB1View,L=h%2===0?this.fftB1View:this.fftB0View;this.bgFft.push(e.createBindGroup({layout:this.bglFft,entries:[{binding:0,resource:{buffer:b}},{binding:1,resource:g},{binding:2,resource:P},{binding:3,resource:w},{binding:4,resource:L}]}))}this.bgPack=e.createBindGroup({layout:this.bglPack,entries:[{binding:0,resource:this.fftA0View},{binding:1,resource:this.fftB0View},{binding:2,resource:this.dispView}]})}bakeLut(){const e=this.dev,i=32,t=c=>Math.min(1,Math.max(0,c)),s=new Uint8Array(i*i*i*4),o=1.055,u=1.07,l=[.9,.96,1.08],m=[1.06,1,.92];for(let c=0;c<i;c++)for(let f=0;f<i;f++)for(let d=0;d<i;d++){const r=((c*i+f)*i+d)*4;let p=[Math.pow((d+.5)/i,1/2.2),Math.pow((f+.5)/i,1/2.2),Math.pow((c+.5)/i,1/2.2)];const h=.2126*p[0]+.7152*p[1]+.0722*p[2];p=p.map(w=>t((w-.5)*o+.5)),p=p.map(w=>t(h+(w-h)*u));const b=1-t((h-.35)/.4),g=t((h-.45)/.35);p=p.map((w,P)=>t(w+(l[P]-1)*b*.055+(m[P]-1)*g*.055)),s[r]=p[0]*255,s[r+1]=p[1]*255,s[r+2]=p[2]*255,s[r+3]=255}this.lutTex=e.createTexture({size:[i,i,i],dimension:"3d",format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.lutTex},s,{bytesPerRow:i*4,rowsPerImage:i},[i,i,i]),this.lutView=this.lutTex.createView({dimension:"3d"})}setTier(e){this.tierIndex=Math.max(0,Math.min(pe.length-1,e)),this.toggles.taa=this.tier.taa,this.toggles.ssao=this.tier.ssao,this.toggles.ssr=this.tier.ssr,this.rebuildOcean(),this.W=0,this.rebuildTargets()}resize(){this.W=0,this.rebuildTargets()}rebuildTargets(){const e=this.dev,i=Math.min(window.devicePixelRatio||1,2),t=Math.max(2,Math.floor(this.canvas.clientWidth*i)),s=Math.max(2,Math.floor(this.canvas.clientHeight*i));if(t===this.W&&s===this.H)return;this.W=t,this.H=s,this.canvas.width=t,this.canvas.height=s;const[o,u,l]=this.volDims(),m=this._volSize,c=`${o}x${u}x${l}`;if(m!==c||!this.volFogAView){const v=this._volTex;v&&v.forEach(B=>B.destroy());const z=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING,T=e.createTexture({size:[o,u,l],dimension:"3d",format:"rgba16float",usage:z}),a=e.createTexture({size:[o,u,l],dimension:"3d",format:"rgba16float",usage:z});this._volTex=[T,a],this.volFogAView=T.createView({dimension:"3d"}),this.volFogBView=a.createView({dimension:"3d"}),this._volSize=c}this.graph.reset(!0);const f=GPUTextureUsage.RENDER_ATTACHMENT,d=GPUTextureUsage.TEXTURE_BINDING,r=GPUTextureUsage.COPY_SRC,p=GPUTextureUsage.COPY_DST,h=f|d|r|p,b=Math.ceil(t/2),g=Math.ceil(s/2);this.atlas=Math.min(this.tier.shadowAtlas,this.ctx.maxTextureDim),this.g0View=this.graph.texture("g0",{width:t,height:s,format:"rgba8unorm",usage:h}),this.g1View=this.graph.texture("g1",{width:t,height:s,format:"rgba16float",usage:h}),this.g2View=this.graph.texture("g2",{width:t,height:s,format:"rgba8unorm",usage:h}),this.g3View=this.graph.texture("g3",{width:t,height:s,format:"rg16float",usage:h}),this.g0mView=this.graph.texture("g0m",{width:t,height:s,format:"rgba8unorm",usage:h}),this.g1mView=this.graph.texture("g1m",{width:t,height:s,format:"rgba16float",usage:h}),this.g2mView=this.graph.texture("g2m",{width:t,height:s,format:"rgba8unorm",usage:h}),this.depthView=this.graph.texture("depth",{width:t,height:s,format:"depth32float",usage:h}),this.hdrAView=this.graph.texture("hdrA",{width:t,height:s,format:"rgba16float",usage:h}),this.hdrA2View=this.graph.texture("hdrA2",{width:t,height:s,format:"rgba16float",usage:h}),this.ssrHalfView=this.graph.texture("ssrHalf",{width:b,height:g,format:"rgba16float",usage:h}),this.hdrBView=this.graph.texture("hdrB",{width:t,height:s,format:"rgba16float",usage:h}),this.hdrCView=this.graph.texture("hdrC",{width:t,height:s,format:"rgba16float",usage:h}),this.historyView=this.graph.texture("history",{width:t,height:s,format:"rgba16float",usage:d|GPUTextureUsage.COPY_DST|r}),this.shadowView=this.graph.texture("shadowAtlas",{width:this.atlas,height:this.atlas,format:"depth24plus",usage:h}),this.aoHalfView=this.graph.texture("aoHalf",{width:b,height:g,format:"r8unorm",usage:h}),this.aoHalf2View=this.graph.texture("aoHalf2",{width:b,height:g,format:"r8unorm",usage:h}),this.bloomViews=[];let w=b,P=g;for(let v=0;v<de;v++){const z=this.graph.texture(`bloom${v}`,{width:Math.max(w,2),height:Math.max(P,2),format:"rgba16float",usage:h});this.bloomViews.push(z),w=Math.max(w>>1,2),P=Math.max(P>>1,2)}const L=Math.ceil(t/16),S=Math.ceil(s/16);this.gridCountsBuf?.destroy(),this.gridIndicesBuf?.destroy(),this.gridCountsBuf=e.createBuffer({size:L*S*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.gridIndicesBuf=e.createBuffer({size:L*S*At*4,usage:GPUBufferUsage.STORAGE}),this.zerobuffer=new Uint32Array(L*S);for(const v of this.destBufs)v.destroy();this.destBufs=[],w=b,P=g;for(let v=0;v<de;v++){const z=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(z,new Float32Array([w,P,1/w,1/P])),this.destBufs.push(z),w=Math.max(w>>1,2),P=Math.max(P>>1,2)}const M=e.createSampler({magFilter:"linear",minFilter:"linear"});this.smpRep=e.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),this.bgGlobal=e.createBindGroup({layout:this.bglGlobal,entries:[{binding:0,resource:{buffer:this.camBuf}},{binding:1,resource:{buffer:this.frameBuf}},{binding:2,resource:this.shadowView},{binding:3,resource:e.createSampler({compare:"less"})},{binding:4,resource:this.skyLutView},{binding:5,resource:M}]}),this.bgCull=e.createBindGroup({layout:this.bglCull,entries:[{binding:0,resource:{buffer:this.lightsBuf}},{binding:1,resource:{buffer:this.gridCountsBuf}},{binding:2,resource:{buffer:this.gridIndicesBuf}},{binding:3,resource:this.depthView},{binding:4,resource:{buffer:this.camBuf}},{binding:5,resource:{buffer:this.frameBuf}}]}),this.bgSsao=e.createBindGroup({layout:this.bglSsao,entries:[{binding:0,resource:this.depthView},{binding:1,resource:this.g1View}]}),this.bgBlur=e.createBindGroup({layout:this.bglBlur,entries:[{binding:0,resource:this.aoHalfView},{binding:1,resource:M}]});const D=v=>[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:v},{binding:5,resource:{buffer:this.lightsBuf}},{binding:6,resource:{buffer:this.gridCountsBuf}},{binding:7,resource:{buffer:this.gridIndicesBuf}},{binding:8,resource:{buffer:this.probesBuf}},{binding:9,resource:this.volFogBView},{binding:10,resource:this.skyLutView},{binding:11,resource:M}];this.bgLightingAo=e.createBindGroup({layout:this.bglLighting,entries:D(this.aoHalf2View)}),this.bgLightingWhite=e.createBindGroup({layout:this.bglLighting,entries:D(this.whiteView)}),this.bgSsr=e.createBindGroup({layout:this.bglSsr,entries:[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:this.hdrAView},{binding:5,resource:M},{binding:6,resource:this.skyLutView}]}),this.bgRefl=e.createBindGroup({layout:this.bglRefl,entries:[{binding:0,resource:this.hdrAView},{binding:1,resource:this.ssrHalfView},{binding:2,resource:this.g1View},{binding:3,resource:this.g2View},{binding:4,resource:this.depthView},{binding:5,resource:M}]}),this.bgOcean=e.createBindGroup({layout:this.bglOcean,entries:[{binding:0,resource:this.hdrBView},{binding:1,resource:this.depthView},{binding:2,resource:M},{binding:3,resource:this.dispView},{binding:4,resource:this.smpRep},{binding:5,resource:this.skyLutView},{binding:6,resource:this.volFogBView}]}),this.bgFogInject=e.createBindGroup({layout:this.bglFogInject,entries:[{binding:0,resource:{buffer:this.volumeBuf}},{binding:1,resource:{buffer:this.lightsBuf}},{binding:2,resource:this.volFogAView}]}),this.bgFogIntegrate=e.createBindGroup({layout:this.bglFogIntegrate,entries:[{binding:0,resource:this.volFogAView},{binding:1,resource:this.volFogBView}]}),this.bgDecals=e.createBindGroup({layout:this.bglDecals,entries:[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:{buffer:this.decalBuf}}]}),this.bgPartSim=e.createBindGroup({layout:this.bglPartSim,entries:[{binding:0,resource:{buffer:this.zonesBuf}},{binding:1,resource:{buffer:this.partBuf}}]}),this.bgPartDraw=e.createBindGroup({layout:this.bglPartDraw,entries:[{binding:0,resource:{buffer:this.partBuf}}]}),this.bgChar=e.createBindGroup({layout:this.bglChar,entries:[{binding:0,resource:{buffer:this.charJointsBuf,offset:0,size:448}},{binding:1,resource:{buffer:this.charJointsBuf,offset:512,size:448}}]}),this.bgTaa=e.createBindGroup({layout:this.bglTaa,entries:[{binding:0,resource:this.hdrA2View},{binding:1,resource:this.historyView},{binding:2,resource:this.depthView},{binding:3,resource:M},{binding:4,resource:this.g3View}]}),this.bgExp=e.createBindGroup({layout:this.bglExp,entries:[{binding:0,resource:this.hdrCView},{binding:1,resource:{buffer:this.statsBuf}},{binding:2,resource:{buffer:this.frameBuf}}]}),this.bloomPasses=[],this.bgBloom=[],this.bloomPasses.push({kind:"pre",src:this.hdrCView,dst:this.bloomViews[0],mip:0});for(let v=1;v<de;v++)this.bloomPasses.push({kind:"down",src:this.bloomViews[v-1],dst:this.bloomViews[v],mip:v});for(let v=de-2;v>=0;v--)this.bloomPasses.push({kind:"up",src:this.bloomViews[v+1],dst:this.bloomViews[v],mip:v});this.bloomPasses.forEach(v=>{const z=e.createBindGroup({layout:this.bglBloom0,entries:[{binding:0,resource:{buffer:this.frameBuf}},{binding:1,resource:{buffer:this.destBufs[v.mip]}}]}),T=e.createBindGroup({layout:this.bglBloom1,entries:[{binding:0,resource:v.src},{binding:1,resource:M},{binding:2,resource:{buffer:this.statsBuf}}]});this.bgBloom.push([z,T])});const k=v=>[{binding:0,resource:this.hdrCView},{binding:1,resource:v},{binding:2,resource:{buffer:this.statsBuf}},{binding:3,resource:M},{binding:4,resource:this.lutView}];this.bgTonemapBloom=e.createBindGroup({layout:this.bglTonemap,entries:k(this.bloomViews[0])}),this.bgTonemapBlack=e.createBindGroup({layout:this.bglTonemap,entries:k(this.blackView)})}passFilter=null;want(e){return!this.passFilter||this.passFilter.has(e)}charInput=null;render(e){const i=this.dev,t=performance.now(),s=this.W,o=this.H;if(s<4||o<4)return;this.graph.beginFrame();const u=this.camera;u.jitterEnabled=this.toggles.taa,this.uniforms.taaOn=this.toggles.taa?1:0,u.update(s/o),this.uniforms.updateSun(),this.uniforms.updateCascades(u);const l=Math.ceil(s/16),m=Math.ceil(o/16);this.uniforms.pack(u,s,o,e/1e3,this.scene.lights.length,this.uniforms.cascadeTexelWorld(),1/this.atlas,1.6,l,m,this.scene.waterLevel,4200,-22,2),this.put(this.camBuf,this.uniforms.camData),this.put(this.frameBuf,this.uniforms.frameData);for(let r=0;r<4;r++)this.put(this.cascadeBuf[r],this.uniforms.cascadeData[r]);if(this.put(this.gridCountsBuf,this.zerobuffer),this.uniforms.lutOn=this.toggles.lut?1:0,this.uniforms.ssrOn=this.toggles.ssr&&this.tier.ssr?1:0,this.uniforms.giOn=this.toggles.gi?1:0,this.uniforms.fftOn=this.toggles.fft&&this.tier.fft?1:0,this.uniforms.causticsOn=this.toggles.caus?1:0,this.uniforms.volFogOn=this.toggles.volfog&&this.tier.volfog?1:0,this.uniforms.layersMode=this.toggles.layers?1:0,this.uniforms.cookieStrength=this.toggles.cookie?1:0,this.uniforms.skyLutOn=this.toggles.sky?1:0,this.uniforms.particlesOn=this.toggles.parts?1:0,this.uniforms.charOn=this.toggles.char?1:0,this.uniforms.bakeProbes(),this.put(this.probesBuf,this.uniforms.probeData),this.uniforms.charOn>0){const r=this.uniforms.timeLock!==null?.016666666666666666:Math.min(e/1e3,.1),p=this.charInput;this.char.update(r,p,this.charCamYaw),this.put(this.charJointsBuf,this.char.joints,0),this.put(this.charJointsBuf,this.char.prevJoints,512)}if(u.mode==="tps"){const r=this.char.pos,p=Math.cos(this.charCamYaw),h=Math.sin(this.charCamYaw),b=Math.cos(this.charCamPitch),g=3.6;u.tpsEye=[r[0]-p*b*g,r[1]+1.95+Math.sin(this.charCamPitch)*g,r[2]-h*b*g],u.tpsLook=[r[0],r[1]+1.45,r[2]]}const c=i.createCommandEncoder();if(this.want("shadow")){const r=c.beginRenderPass({colorAttachments:[],depthStencilAttachment:{view:this.shadowView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});r.setPipeline(this.pShadow),r.setVertexBuffer(0,this.sceneVB),r.setIndexBuffer(this.sceneIB,"uint32");const p=this.atlas/2;for(let h=0;h<4;h++){r.setViewport((h&1)*p,(h>>1)*p,p,p,0,1),r.setScissorRect((h&1)*p,(h>>1)*p,p,p),r.setBindGroup(0,this.bgCascade[h]);for(const b of this.scene.groups)r.drawIndexed(b.count,1,b.firstIndex);this.uniforms.charOn>0&&(r.setPipeline(this.pCharShadow),r.setVertexBuffer(0,this.charVB),r.setIndexBuffer(this.charIB,"uint32"),r.setBindGroup(1,this.bgChar),r.drawIndexed(this.charIdxCount),r.setPipeline(this.pShadow),r.setVertexBuffer(0,this.sceneVB),r.setIndexBuffer(this.sceneIB,"uint32"))}r.end()}if(this.want("gbuffer")){const r=c.beginRenderPass({colorAttachments:[{view:this.g0View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g1View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g2View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g3View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});r.setPipeline(this.pGbuffer),r.setBindGroup(0,this.bgGlobal),r.setVertexBuffer(0,this.sceneVB),r.setIndexBuffer(this.sceneIB,"uint32"),this.scene.groups.forEach((p,h)=>{r.setBindGroup(1,this.bgMesh[h]),r.drawIndexed(p.count,1,p.firstIndex)}),this.uniforms.charOn>0&&(r.setPipeline(this.pChar),r.setVertexBuffer(0,this.charVB),r.setIndexBuffer(this.charIB,"uint32"),r.setBindGroup(1,this.bgChar),r.drawIndexed(this.charIdxCount)),r.end()}if(this.want("decals")&&this.toggles.decals){const r=c.beginRenderPass({colorAttachments:[{view:this.g0mView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g1mView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g2mView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pDecals),r.setBindGroup(0,this.bgGlobal),r.setBindGroup(1,this.bgDecals),r.draw(3),r.end(),c.copyTextureToTexture({texture:this.graphTexture("g0m")},{texture:this.graphTexture("g0")},[s,o,1]),c.copyTextureToTexture({texture:this.graphTexture("g1m")},{texture:this.graphTexture("g1")},[s,o,1]),c.copyTextureToTexture({texture:this.graphTexture("g2m")},{texture:this.graphTexture("g2")},[s,o,1])}if(this.want("cull")){const r=c.beginComputePass();r.setPipeline(this.pCull),r.setBindGroup(0,this.bgCull),r.dispatchWorkgroups(l,m),this.want("parts")&&this.uniforms.particlesOn>0&&(r.setPipeline(this.pPartSim),r.setBindGroup(0,this.bgGlobal),r.setBindGroup(1,this.bgPartSim),r.dispatchWorkgroups(Math.ceil(ze/64),1,1)),r.end()}if(this.want("volfog")&&this.uniforms.volFogOn>0){const[r,p,h]=this.volDims(),b=c.beginComputePass();b.setPipeline(this.pFogInject),b.setBindGroup(0,this.bgGlobal),b.setBindGroup(1,this.bgFogInject),b.dispatchWorkgroups(Math.ceil(r/8),Math.ceil(p/8),Math.ceil(h/4)),b.setPipeline(this.pFogIntegrate),b.setBindGroup(0,this.bgGlobal),b.setBindGroup(1,this.bgFogIntegrate),b.dispatchWorkgroups(Math.ceil(r/8),Math.ceil(p/8)),b.end()}const f=this.want("ssao")&&this.toggles.ssao&&this.tier.ssao;if(f){const r=Math.ceil(s/2),p=Math.ceil(o/2),h=c.beginRenderPass({colorAttachments:[{view:this.aoHalfView,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.pSsao),h.setBindGroup(0,this.bgGlobal),h.setBindGroup(1,this.bgSsao),h.setViewport(0,0,r,p,0,1),h.draw(3),h.end();const b=c.beginRenderPass({colorAttachments:[{view:this.aoHalf2View,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});b.setPipeline(this.pBlur),b.setBindGroup(0,this.bgGlobal),b.setBindGroup(1,this.bgBlur),b.setViewport(0,0,r,p,0,1),b.draw(3),b.end()}if(this.want("lighting")){const r=c.beginRenderPass({colorAttachments:[{view:this.hdrAView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pLighting),r.setBindGroup(0,this.bgGlobal),r.setBindGroup(1,f?this.bgLightingAo:this.bgLightingWhite),r.draw(3),r.end()}if(this.want("ssr")&&this.toggles.ssr&&this.tier.ssr){const r=Math.ceil(s/2),p=Math.ceil(o/2),h=c.beginRenderPass({colorAttachments:[{view:this.ssrHalfView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.pSsr),h.setBindGroup(0,this.bgGlobal),h.setBindGroup(1,this.bgSsr),h.setViewport(0,0,r,p,0,1),h.draw(3),h.end()}if(this.want("refl")){const r=c.beginRenderPass({colorAttachments:[{view:this.hdrA2View,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pRefl),r.setBindGroup(0,this.bgGlobal),r.setBindGroup(1,this.bgRefl),r.draw(3),r.end()}if(this.want("taa")){const r=c.beginRenderPass({colorAttachments:[{view:this.hdrBView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});r.setPipeline(this.pTaa),r.setBindGroup(0,this.bgGlobal),r.setBindGroup(1,this.bgTaa),r.draw(3),r.end(),c.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("history")},[s,o,1])}if(c.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("hdrC")},[s,o,1]),this.frameNo++,this.uniforms.fftOn>0&&this.frameNo%this.fftDiv===0&&this.want("fft")){const r=c.beginComputePass();r.setPipeline(this.pGen),r.setBindGroup(0,this.bgGen),r.dispatchWorkgroups(32,32),r.setPipeline(this.pFft);for(let p=0;p<16;p++)r.setBindGroup(0,this.bgFft[p]),r.dispatchWorkgroups(32,32);r.setPipeline(this.pPack),r.setBindGroup(0,this.bgPack),r.dispatchWorkgroups(32,32),r.end()}if(this.want("ocean")&&this.toggles.ocean){const r=new URLSearchParams(location.search).get("odepth")==="0",p=new URLSearchParams(location.search).get("oload")!=="clear",h=c.beginRenderPass({colorAttachments:[{view:this.hdrCView,loadOp:p?"load":"clear",clearValue:{r:0,g:0,b:0,a:1},storeOp:"store"}],...r?{}:{depthStencilAttachment:{view:this.depthView,depthReadOnly:!0}}});h.setPipeline(this.pOcean),h.setBindGroup(0,this.bgGlobal),new URLSearchParams(location.search).get("obgl")!=="0"&&h.setBindGroup(1,this.bgOcean),h.setVertexBuffer(0,this.oceanNearVB),h.setIndexBuffer(this.oceanNearIB,"uint32"),h.drawIndexed(this.oceanNearCount),new URLSearchParams(location.search).get("ofar")!=="0"&&(h.setVertexBuffer(0,this.oceanFarVB),h.setIndexBuffer(this.oceanFarIB,"uint32"),h.drawIndexed(this.oceanFarCount)),h.end()}if(this.want("parts")&&this.uniforms.particlesOn>0){const r=c.beginRenderPass({colorAttachments:[{view:this.hdrCView,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:this.depthView,depthReadOnly:!0}});r.setPipeline(this.pPartDraw),r.setBindGroup(0,this.bgGlobal),r.setBindGroup(1,this.bgPartDraw),r.setVertexBuffer(0,this.partQuadVB),r.setIndexBuffer(this.partQuadIB,"uint16"),r.drawIndexed(18,ze),r.end()}if(this.want("exposure")){const r=c.beginComputePass();r.setPipeline(this.pExpAccum),r.setBindGroup(0,this.bgExp),r.dispatchWorkgroups(Math.ceil(s/4/8),Math.ceil(o/4/8)),r.setPipeline(this.pExpFinal),r.dispatchWorkgroups(1,1,1),r.end()}if(this.want("bloom")&&this.toggles.bloom&&this.bloomPasses.forEach((r,p)=>{const h=r.kind==="pre"?this.pBloomPre:r.kind==="down"?this.pBloomDown:this.pBloomUp,b=Math.max(Math.ceil(s/2)>>r.mip,2),g=Math.max(Math.ceil(o/2)>>r.mip,2),w=c.beginRenderPass({colorAttachments:[{view:r.dst,clearValue:{r:0,g:0,b:0,a:1},loadOp:r.kind==="up"?"load":"clear",storeOp:"store"}]});w.setPipeline(h),w.setBindGroup(0,this.bgBloom[p][0]),w.setBindGroup(1,this.bgBloom[p][1]),w.setViewport(0,0,b,g,0,1),w.draw(3),w.end()}),this.want("tonemap")){const p=new URLSearchParams(location.search).get("ttex")==="1"?this.graph.texture("tonemapTex",{width:s,height:o,format:this.ctx.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}):this.ctx.context.getCurrentTexture().createView(),h=c.beginRenderPass({colorAttachments:[{view:p,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});h.setPipeline(this.pTonemap),h.setBindGroup(0,this.bgGlobal),h.setBindGroup(1,this.toggles.bloom?this.bgTonemapBloom:this.bgTonemapBlack),h.setViewport(0,0,s,o,0,1),h.draw(3),h.end()}i.queue.submit([c.finish()]),this.lastFrameCpuMs=performance.now()-t,window.__FRAME_N__=window.__FRAME_N__===void 0?performance.now()/1e3:window.__FRAME_N__}async debugSnapshot(e,i,t=0,s=0){const o=this.dev,u=Math.min(e??this.W,this.W),l=Math.min(i??this.H,this.H),m=this.graphTexture("tonemapTex"),c=Math.ceil(u*4/256)*256,f=o.createBuffer({size:c*l,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),d=o.createCommandEncoder();d.copyTextureToBuffer({texture:m,origin:[t,s,0]},{buffer:f,bytesPerRow:c,rowsPerImage:l},[u,l,1]),o.queue.submit([d.finish()]),await f.mapAsync(GPUMapMode.READ);const r=new Uint8Array(f.getMappedRange()),p=new Uint8Array(u*l*4);for(let h=0;h<l;h++)for(let b=0;b<u;b++){const g=h*c+b*4,w=h*u*4+b*4;p[w]=r[g+2],p[w+1]=r[g+1],p[w+2]=r[g],p[w+3]=255}return f.unmap(),f.destroy(),{w:u,h:l,rgba:p}}async debugRow(e,i,t,s,o=16){const u=this.dev,l=[];for(let g=t;g<=s;g+=o)l.push(Math.min(g,this.W-1));const m=l.length,c=256,f=this.graphTexture(e),d=u.createBuffer({size:c*m,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r=u.createCommandEncoder();l.forEach((g,w)=>{r.copyTextureToBuffer({texture:f,origin:[g,Math.min(i,this.H-1),0]},{buffer:d,offset:w*c,bytesPerRow:c,rowsPerImage:1},[1,1,1])}),u.queue.submit([r.finish()]),await d.mapAsync(GPUMapMode.READ);const p=new Uint8Array(d.getMappedRange()),h=(g,w)=>{const P=g|w<<8,L=(P&32768)>>15,S=(P&31744)>>10,M=P&1023;let D;return S===0?D=M*2**-24:S===31?D=M?NaN:1/0:D=(1+M/1024)*2**(S-15),(L?-1:1)*D},b={x:l};for(let g=0;g<m;g++){const w=g*c;b[`p${g}`]=[h(p[w],p[w+1]),h(p[w+2],p[w+3])]}return d.unmap(),d.destroy(),b}async debugSample(){const e=this.dev,i=this.W,t=this.H,s=[["g0",this.graphTexture("g0"),i>>1,t>>1,"all"],["hdrA_c",this.graphTexture("hdrA"),i>>1,t>>1,"all"],["hdrA_q",this.graphTexture("hdrA"),i>>2,t>>1,"all"],["hdrA_3q",this.graphTexture("hdrA"),3*i>>2,3*t>>2,"all"],["hdrA_sky",this.graphTexture("hdrA"),i>>1,Math.max(2,t*.08|0),"all"],["hdrC_c",this.graphTexture("hdrC"),i>>1,t>>1,"all"]],o=e.createCommandEncoder(),u={};for(const[m,c,f,d,r]of s)u[m]=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),o.copyTextureToBuffer({texture:c,origin:[f,d,0],aspect:r},{buffer:u[m],bytesPerRow:256,rowsPerImage:1},[1,1,1]);e.queue.submit([o.finish()]);const l={};for(const[m]of s){await u[m].mapAsync(GPUMapMode.READ);const c=new Uint8Array(u[m].getMappedRange());l[m]=Array.from(c.slice(0,8)),u[m].unmap(),u[m].destroy()}return l}forceEv(e){this.dev.queue.writeBuffer(this.statsBuf,256,new Float32Array([e]))}async debugParts(e){const i=this.dev,t=48,s=Math.ceil(e.length*t/256)*256,o=i.createBuffer({size:s,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),u=i.createCommandEncoder();e.forEach((f,d)=>{u.copyBufferToBuffer(this.partBuf,f*t,o,d*t,t)}),i.queue.submit([u.finish()]),await o.mapAsync(GPUMapMode.READ);const l=new Uint8Array(o.getMappedRange()),m=new Float32Array(l.buffer),c=e.map((f,d)=>Array.from(m.slice(d*t/4,d*t/4+12)));return o.unmap(),o.destroy(),c}async debugDisp(){const e=this.dev,i=64,t=8,s=Math.ceil(i*8/256)*256,o=e.createBuffer({size:s*t,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),u=e.createCommandEncoder();u.copyTextureToBuffer({texture:this._dispTex,origin:[0,0,0]},{buffer:o,bytesPerRow:s,rowsPerImage:t},[i,t,1]),e.queue.submit([u.finish()]),await o.mapAsync(GPUMapMode.READ);const l=new Uint8Array(o.getMappedRange()),m=new DataView(l.buffer),c=b=>{const g=m.getUint16(b,!0),w=(g&32768)>>15,P=(g&31744)>>10,L=g&1023;let S;return P===0?S=L*2**-24:P===31?S=L?NaN:1/0:S=(1+L/1024)*2**(P-15),(w?-1:1)*S};let f=1e9,d=-1e9,r=0,p=0,h=0;for(let b=0;b<t;b++)for(let g=0;g<i;g++){const w=b*s+g*8,P=c(w),L=c(w+2),S=c(w+4);f=Math.min(f,L),d=Math.max(d,L),r+=L*L,p=Math.max(p,Math.abs(P),Math.abs(S)),h++}return o.unmap(),o.destroy(),{hMin:f,hMax:d,hRms:Math.sqrt(r/Math.max(h,1)),dMax:p}}async readStats(){const e=this.dev,i=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t=e.createCommandEncoder();t.copyBufferToBuffer(this.statsBuf,256,i,0,12),e.queue.submit([t.finish()]),await i.mapAsync(GPUMapMode.READ);const s=new Float32Array(i.getMappedRange()),o={ev:s[0],avg:s[1]};return i.unmap(),i.destroy(),o}graphTexture(e){const i=this.graph.resources.get(e);if(!i||!i.texture)throw new Error(`graph texture ${e} missing`);return i.texture}}function Ft(n,e,i,t){const s=a=>document.getElementById(a),u=[...s("tier-seg").querySelectorAll("button")],l=()=>{u.forEach(a=>a.classList.toggle("active",Number(a.dataset.tier)===n.tierIndex)),s("hud-tier").textContent=`tier · ${pe[n.tierIndex].name}`};u.forEach(a=>a.addEventListener("click",()=>{n.setTier(Number(a.dataset.tier)),s("tg-ssao").checked=n.toggles.ssao,s("tg-taa").checked=n.toggles.taa,s("tg-ssr").checked=n.toggles.ssr,l()})),l();const m=(a,B,y,x)=>{const A=s(a),R=s(B),V=()=>{const E=Number(A.value);x(E),R.textContent=y(E)};A.addEventListener("input",V),V()};m("sun-el","val-sun-el",a=>`${a}°`,a=>{n.uniforms.sunElevation=a}),m("sun-az","val-sun-az",a=>`${a}°`,a=>{n.uniforms.sunAzimuth=a}),m("ev-bias","val-ev",a=>a.toFixed(1),a=>{n.uniforms.evBias=a}),m("fog-dens","val-fog",a=>a.toFixed(2),a=>{n.uniforms.fogScale=a});const c=(a,B)=>{const y=s(a);y.checked=n.toggles[B],y.addEventListener("change",()=>{n.toggles[B]=y.checked})};c("tg-ssao","ssao"),c("tg-taa","taa"),c("tg-bloom","bloom"),c("tg-ocean","ocean"),c("tg-ssr","ssr"),c("tg-lut","lut"),c("tg-gi","gi"),c("tg-fft","fft"),c("tg-caus","caus"),c("tg-fog","volfog"),c("tg-decals","decals"),c("tg-layers","layers"),c("tg-sky","sky"),c("tg-cookie","cookie"),c("tg-parts","parts"),c("tg-char","char");const f=s("tg-wire");f.addEventListener("change",()=>{n.uniforms.debugMode=f.checked?1:0});const d=s("shots");n.uniforms;const r=n.camera,p=window.__SHOTS__??[];let h=-1,b={eye:[0,0,0],look:[0,0,0]};window.__CAM_ANIM__=(a,B)=>{b=B,h=0},p.forEach((a,B)=>{const y=document.createElement("button");y.textContent=`${B+1}. ${a.name}`,y.title=`Точка съёмки ${B+1}`,y.addEventListener("click",()=>{document.exitPointerLock?.();const x={eye:r.eye(),look:r.lookAtPoint()};window.__CAM_ANIM__?.(x,{eye:a.eye,look:a.look})}),d.appendChild(y)}),window.__CAM_TICK__=a=>{h<0||(h=Math.min(h+a/1.4,1),r.animateTo(b,h),h>=1&&(h=-1))};const g=s("btn-fly"),w=()=>{g.textContent=t()?"Орбитальный режим":"Свободный полёт"};g.addEventListener("click",()=>{if(t())document.exitPointerLock?.();else{r.position=r.eye();const a=r.forwardOfView();r.flyYaw=Math.atan2(a[2],a[0]),r.flyPitch=Math.asin(Math.max(-1,Math.min(1,a[1]))),r.mode="fly",n.canvas.requestPointerLock?.()}w()});const P=s("btn-tps"),L=()=>{P.textContent=r.mode==="tps"?"Орбитальный режим":"Персонаж (TPS)"};P.addEventListener("click",()=>{if(r.mode=r.mode==="tps"?"orbit":"tps",r.mode==="tps"){const a=r.eye(),B=r.lookAtPoint(),y=[B[0]-a[0],B[1]-a[1],B[2]-a[2]];n.charCamYaw=Math.atan2(y[2],y[0]);const x=Math.hypot(y[0],y[2]);n.charCamPitch=Math.max(-.25,Math.min(.85,Math.atan2(y[1],Math.max(x,.1))))}document.exitPointerLock?.(),L()}),L(),document.addEventListener("pointerlockchange",()=>{!t()&&r.mode==="fly"&&(r.mode="orbit"),w()});const S=s("hud-panel"),M=s("hud-toggle"),D=a=>{S.classList.toggle("collapsed",a),M.style.display=a?"block":"none"};M.addEventListener("click",()=>D(!1)),document.addEventListener("keydown",a=>{(a.key==="h"||a.key==="H")&&D(!S.classList.contains("collapsed"))});const k=s("fps-graph"),v=k.getContext("2d"),z=[];let T=16.6;window.__FPS_TICK__=a=>{T=T*.9+a*.1,z.push(a),z.length>110&&z.shift(),v.clearRect(0,0,k.width,k.height),v.strokeStyle="rgba(242,106,27,0.35)",v.beginPath(),v.moveTo(0,k.height-16.6/40*k.height),v.lineTo(k.width,k.height-16.6/40*k.height),v.stroke(),v.strokeStyle="#F26A1B",v.beginPath(),z.forEach((B,y)=>{const x=y/109*k.width,A=k.height-Math.min(B/40,1)*k.height;y===0?v.moveTo(x,A):v.lineTo(x,A)}),v.stroke(),s("hud-fps").textContent=`${(1e3/Math.max(T,.01)).toFixed(0)} fps · ${T.toFixed(1)} ms`},e.adapter.textContent=n.adapterNameShort()}const Ot=document.getElementById("boot"),It=document.getElementById("boot-status"),Et=document.getElementById("boot-bar-fill"),ge=document.getElementById("boot-detail"),Ut=document.getElementById("hud");function ee(n,e=-1,i=""){It.textContent=n,e>=0&&(Et.style.width=`${Math.round(e*100)}%`),i&&(ge.textContent+=(ge.textContent?`
`:"")+i)}function Te(n,e){ee("Не удалось запустить WebGPU",1);const i=[n,"",e];ge.textContent=i.join(`
`),ge.style.color="#d89a55",window.__wgpu={status:"unsupported",error:n}}async function Nt(){const n=document.getElementById("gpu");ee("Запрос GPU-адаптера…",.1);let e;try{e=await $e(n)}catch(a){Te(String(a.message??a),["Поддержка WebGPU:","· Chrome / Edge 113+ (Windows, macOS, ChromeOS)","· Firefox 141+ (Windows)","· Safari 26+ (macOS, iOS)","","Если браузер поддерживает — включите флаг или проверьте, что аппаратное ускорение активно."].join(`
`));return}ee("Компиляция пайплайнов…",.35,`адаптер: ${e.adapterName}`),console.log(`[boot] device ok @${(performance.now()/1e3).toFixed(2)}s`),ee("…",.4,`лимиты: maxTex2D=${e.limits.maxTextureDimension2D} storage=${(e.limits.maxStorageBufferBindingSize/(1<<20)).toFixed(0)} МБ`),Je(e.device,a=>{console.error("[gpu]",a),window.__wgpu={status:"error",error:a},ee("Ошибка GPU",-1,a)}),console.log(`[boot] pre-scene @${(performance.now()/1e3).toFixed(2)}s`);const i=Ke();window.__SHOTS__=i.shots,console.log(`[boot] scene built @${(performance.now()/1e3).toFixed(2)}s`),window.__DEBUG__={groups:i.groups.map(a=>({matId:a.matId,tris:a.count/3})),verts:i.vertexData.length/8,tris:i.indexData.length/3,lights:i.lights.length,probes:i.probes.length};const t=new Vt(e,i);try{await t.init()}catch(a){console.error(a),Te(`Инициализация рендерера: ${String(a.message??a)}`,"Смотрите консоль (F12) для деталей.");return}const s=new URLSearchParams(location.search),o=s.get("tier"),u=s.get("only");if(u&&(t.passFilter=new Set(u.split(",").map(a=>a.trim()).filter(Boolean))),t.setTier(o?Number(o):2),s.has("notaa")){t.toggles.taa=!1;const a=document.getElementById("tg-taa");a&&(a.checked=!1)}if(s.has("taayes")){t.toggles.taa=!0;const a=document.getElementById("tg-taa");a&&(a.checked=!0)}const l=(a,B,y)=>{if(s.has(a)){t.toggles[B]=!1;const x=document.getElementById(y);x&&(x.checked=!1)}};l("nossr","ssr","tg-ssr"),l("nolut","lut","tg-lut"),l("gino","gi","tg-gi");const m=(a,B)=>{const y=document.getElementById(a);y&&(y.checked=B)};s.get("froxel")==="0"&&(t.toggles.volfog=!1),s.get("decals")==="0"&&(t.toggles.decals=!1),s.get("sky")==="0"&&(t.toggles.sky=!1),s.get("cookie")==="0"&&(t.toggles.cookie=!1),s.get("layers")==="1"&&(t.toggles.layers=!0);const c=s.get("sunel");if(c!==null){t.uniforms.sunElevation=Number(c);const a=document.getElementById("sun-el");a&&(a.value=c)}const f=s.get("sunaz");if(f!==null){t.uniforms.sunAzimuth=Number(f);const a=document.getElementById("sun-az");a&&(a.value=f)}s.has("tlock")&&(t.uniforms.timeLock=100.25),m("tg-fog",t.toggles.volfog),m("tg-decals",t.toggles.decals),m("tg-sky",t.toggles.sky),m("tg-cookie",t.toggles.cookie),m("tg-layers",t.toggles.layers),m("tg-parts",t.toggles.parts),m("tg-char",t.toggles.char),s.get("mode")==="tps"&&(t.camera.mode="tps"),s.get("char")==="auto"&&(t.char.auto=!0),t.camera.target=[-8,2.2,0],t.camera.distance=30,t.camera.yaw=4.05,t.camera.pitch=.22,t.resize(),console.log(`[boot] renderer ready @${(performance.now()/1e3).toFixed(2)}s`),ee("Сцена собрана. Старт рендера…",1),Ft(t,{adapter:document.getElementById("hud-adapter"),fps:document.getElementById("hud-fps"),tier:document.getElementById("hud-tier")},()=>{},()=>document.pointerLockElement===n);const d=s.get("evbias");if(d!==null){const a=document.getElementById("ev-bias");a&&(a.value=d),t.uniforms.evBias=Number(d)}s.has("evlock")&&(t.uniforms.evLock=1);const r=s.get("dbg");if(r!==null){t.uniforms.debugMode=Number(r);const a=document.getElementById("tg-wire");a&&(a.checked=Number(r)===1)}window.__PROBE__=()=>t.debugSample(),window.__SNAPBUF__=async(a,B,y)=>{v=!0,await new Promise(x=>setTimeout(x,120));try{const x=Math.min(a??t.canvas.width,t.canvas.width),A=Math.min(B??t.canvas.height,t.canvas.height),R=new Uint8Array(x*A*4),V=320,E=180;let G=0;for(let O=0;O<A;O+=E)for(let U=0;U<x;U+=V){const H=Math.min(V,x-U),Y=Math.min(E,A-O),se=await t.debugSnapshot(H,Y,U,O);for(let q=0;q<Y;q++)R.set(se.rgba.subarray(q*H*4,(q+1)*H*4),((O+q)*x+U)*4);console.log(`[snap] tile ${G++} ok`)}console.log("[snap] tiles done"),console.log("[snap] png start");let F="";const N=49152;for(let O=0;O<R.length;O+=N)F+=btoa(String.fromCharCode(...R.subarray(O,Math.min(O+N,R.length))));const W={w:x,h:A,b64:F};if(y){const O=document.createElement("canvas");O.width=x,O.height=A;const U=O.getContext("2d"),H=U.createImageData(x,A);H.data.set(R),U.putImageData(H,0,0),W.png=O.toDataURL("image/png").split(",")[1],console.log("[snap] png done")}return W}finally{v=!1}},window.__SET_DBG__=a=>{t.uniforms.debugMode=a},window.__PROBEDATA__=()=>Array.from(t.uniforms.probeData.slice(0,40)),window.__STATS__=()=>t.readStats(),window.__PARTS__=a=>t.debugParts(a),window.__DISPSTAT__=()=>t.debugDisp(),window.__SAMPLES__=()=>t.debugSample(),window.__CAM_POSE__=(a,B)=>{const y=t.camera;y.target=B;const x=[a[0]-B[0],a[1]-B[1],a[2]-B[2]];y.distance=Math.max(2.2,Math.hypot(x[0],x[1],x[2])),y.yaw=Math.atan2(x[2],x[0]);const A=Math.hypot(x[0],x[2]);y.pitch=Math.atan2(x[1],A)},window.__ROW__=(a,B,y,x,A)=>t.debugRow(a,B,y,x,A),window.__CHAR__=()=>({pos:[...t.char.pos],yaw:t.char.yaw,speed:t.char.speed,phase:t.char.walkPhase,auto:t.char.auto}),window.__SET_CHAR__=(a,B,y)=>{t.char.pos=[a,1.2,B],t.char.auto=y??t.char.auto};const p=t.canvas;let h=!1,b=0,g=0,w=!1;p.addEventListener("pointerdown",a=>{document.pointerLockElement!==p&&(h=!0,w=a.button===2||a.button===1,b=a.clientX,g=a.clientY,p.setPointerCapture(a.pointerId))}),p.addEventListener("pointermove",a=>{if(!h)return;const B=a.clientX-b,y=a.clientY-g;b=a.clientX,g=a.clientY,t.camera.mode==="tps"?(t.charCamYaw-=B*.005,t.charCamPitch=Math.max(-.25,Math.min(.85,t.charCamPitch+y*.004))):w?t.camera.pan(B,y):t.camera.moveOrbit(B,y)}),p.addEventListener("pointerup",a=>{h=!1,p.releasePointerCapture(a.pointerId)}),p.addEventListener("contextmenu",a=>a.preventDefault()),p.addEventListener("wheel",a=>{a.preventDefault(),t.camera.zoom(a.deltaY)},{passive:!1});const P=new Set;document.addEventListener("keydown",a=>P.add(a.code.toLowerCase())),document.addEventListener("keyup",a=>P.delete(a.code.toLowerCase()));let L=0;window.addEventListener("resize",()=>{clearTimeout(L),L=window.setTimeout(()=>t.resize(),120)}),performance.now();let S=!1;const M=Number(s.get("fpscap")??0);let D=0,k=0,v=!1;const z=a=>{if(v){S&&requestAnimationFrame(z);return}if(M>0&&a-D<M){S&&requestAnimationFrame(z);return}D=a;const B=k>0?Math.min(a-k,100):16;if(k=a,window.__CAM_TICK__?.(B/1e3),t.camera.mode==="fly"&&t.camera.flyStep(B/1e3,P),t.camera.mode==="tps"&&!t.char.auto){const y=(P.has("keyd")?1:0)-(P.has("keya")?1:0),x=(P.has("keyw")?1:0)-(P.has("keys")?1:0);t.charInput={moveX:y,moveZ:x}}else t.charInput=null;try{t.render(B)}catch(y){console.error(y),ee("Ошибка кадра",-1,String(y.message??y)),S=!1;return}window.__FPS_TICK__?.(B),window.__wgpu={status:"running",adapter:e.adapterName,tier:pe[t.tierIndex].name},S&&requestAnimationFrame(z)};new URLSearchParams(location.search).has("still")?window.__wgpu={status:"running",adapter:e.adapterName,tier:"still"}:(S=!0,requestAnimationFrame(z)),setTimeout(()=>{Ot.classList.add("fade"),Ut.classList.remove("hidden")},450)}Nt().catch(n=>{console.error(n),Te(String(n.message??n),"Смотрите консоль (F12).")});

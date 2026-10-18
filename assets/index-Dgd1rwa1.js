(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&t(u)}).observe(document,{childList:!0,subtree:!0});function i(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(s){if(s.ep)return;s.ep=!0;const r=i(s);fetch(s.href,r)}})();function Ue(n){let e="",i="",t="";const s=n.info;s&&(e=s.vendor||"",i=s.architecture||"",t=s.description||"");const r=[e,i,t].filter(c=>c&&c.length>0);return{name:r.length?r.join(" · "):"WebGPU adapter",features:[...n.features]}}async function Ne(n){const e=navigator.gpu;if(!e)throw new Error("navigator.gpu недоступен — браузер без WebGPU");const i=[{powerPreference:"high-performance"},{},{forceFallbackAdapter:!0}],t=window.__GPUKEEP__??[];window.__GPUKEEP__=t;let s=null,r=null;for(const a of i){let d=null;try{d=await e.requestAdapter(a)}catch{d=null}if(!d)continue;let l;try{l=await d.requestDevice({label:"hdrp-webgpu-device",requiredLimits:{maxTextureDimension2D:Math.min(d.limits.maxTextureDimension2D,8192),maxStorageBufferBindingSize:Math.min(d.limits.maxStorageBufferBindingSize,1<<28)}})}catch{continue}const y=new Promise(w=>l.lost.then(()=>w(!0)));if(await Promise.race([y,new Promise(w=>setTimeout(()=>w(!1),350))])){try{l.destroy()}catch{}continue}s=l,r=d;break}if(r&&t.push(r),s&&t.push(s),!r||!s)throw new Error("Не получен рабочий GPUDevice (все кандидаты отклонены)");const{name:u}=Ue(r),c=n.getContext("webgpu");if(!c)throw new Error('canvas.getContext("webgpu") вернул null');const p=e.getPreferredCanvasFormat();c.configure({device:s,format:p,alphaMode:"opaque"});const o=globalThis;o.__devSeq=(o.__devSeq??0)+1;const h=o.__devSeq;window.__DEV_OK__=`#${h} @${(performance.now()/1e3).toFixed(2)}s`,s.lost.then(a=>{const d=`#${h} ${a.reason}: ${a.message} @${(performance.now()/1e3).toFixed(2)}s`;console.error(`[gpu] DEVICE LOST ${d}`),window.__DEVLOST__=d});const v={maxTextureDimension2D:s.limits.maxTextureDimension2D,maxBufferSize:s.limits.maxBufferSize,maxStorageBufferBindingSize:s.limits.maxStorageBufferBindingSize,maxComputeWorkgroupsPerDimension:s.limits.maxComputeWorkgroupsPerDimension,maxUniformBufferBindingSize:s.limits.maxUniformBufferBindingSize};return{device:s,context:c,canvas:n,format:p,adapterName:u,features:[...s.features],limits:v,maxTextureDim:s.limits.maxTextureDimension2D}}function We(n,e){n.addEventListener("uncapturederror",i=>{e(`GPU uncaptured error: ${i.error.message}`)})}const j=(n,e,i,t)=>{let[s,r,u]=[n,e,i];if(t.rz){const c=Math.cos(t.rz),p=Math.sin(t.rz),o=s*c-r*p,h=s*p+r*c;s=o,r=h}if(t.ry){const c=Math.cos(t.ry),p=Math.sin(t.ry),o=s*c+u*p,h=-s*p+u*c;s=o,u=h}return[s+t.translate[0],r+t.translate[1],u+t.translate[2]]},q=(n,e,i,t)=>{let[s,r,u]=[n,e,i];if(t.rz){const c=Math.cos(t.rz),p=Math.sin(t.rz),o=s*c-r*p,h=s*p+r*c;s=o,r=h}if(t.ry){const c=Math.cos(t.ry),p=Math.sin(t.ry),o=s*c+u*p,h=-s*p+u*c;s=o,u=h}return[s,r,u]};class He{pos=[];nrm=[];uv=[];idx=[];vert(e,i,t,s){return this.pos.push(e[0],e[1],e[2]),this.nrm.push(i[0],i[1],i[2]),this.uv.push(t,s),this.pos.length/3-1}quad(e,i,t,s){this.idx.push(e,i,t,e,t,s)}addBox(e,i,t){const s={translate:e,...t},r=i[0]/2,u=i[1]/2,c=i[2]/2,p=[{n:[0,0,1],corners:[[-r,-u,c],[r,-u,c],[r,u,c],[-r,u,c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,0,-1],corners:[[r,-u,-c],[-r,-u,-c],[-r,u,-c],[r,u,-c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[1,0,0],corners:[[r,-u,c],[r,-u,-c],[r,u,-c],[r,u,c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[-1,0,0],corners:[[-r,-u,-c],[-r,-u,c],[-r,u,c],[-r,u,-c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,1,0],corners:[[-r,u,c],[r,u,c],[r,u,-c],[-r,u,-c]],uv:[[0,0],[1,0],[1,1],[0,1]]},{n:[0,-1,0],corners:[[-r,-u,-c],[r,-u,-c],[r,-u,c],[-r,-u,c]],uv:[[0,0],[1,0],[1,1],[0,1]]}];for(const o of p){const h=q(o.n[0],o.n[1],o.n[2],s),v=o.corners.map((a,d)=>this.vert(j(a[0],a[1],a[2],s),h,o.uv[d][0],o.uv[d][1]));this.quad(v[0],v[1],v[2],v[3])}return this}addCylinder(e,i,t,s,r=10,u){const c={translate:e,...u},p=s/2,o=this.pos.length/3;for(let h=0;h<=r;h++){const v=h/r*Math.PI*2,a=Math.cos(v),d=Math.sin(v),l=(i-t)/s,y=Math.hypot(1,l);this.vert(j(a*i,-p,d*i,c),q(a/y,l/y,d/y,c),h/r*4,0),this.vert(j(a*t,p,d*t,c),q(a/y,l/y,d/y,c),h/r*4,1)}for(let h=0;h<r;h++){const v=o+h*2;this.quad(v,v+2,v+3,v+1)}if(t>.001){const h=this.vert(j(0,p,0,c),q(0,1,0,c),.5,.5);for(let v=0;v<r;v++){const a=v/r*Math.PI*2,d=(v+1)/r*Math.PI*2,l=this.vert(j(Math.cos(a)*t,p,Math.sin(a)*t,c),q(0,1,0,c),0,0),y=this.vert(j(Math.cos(d)*t,p,Math.sin(d)*t,c),q(0,1,0,c),0,0);this.quad(h,l,y,h)}}if(i>.001){const h=this.vert(j(0,-p,0,c),q(0,-1,0,c),.5,.5);for(let v=0;v<r;v++){const a=v/r*Math.PI*2,d=(v+1)/r*Math.PI*2,l=this.vert(j(Math.cos(a)*i,-p,Math.sin(a)*i,c),q(0,-1,0,c),0,0),y=this.vert(j(Math.cos(d)*i,-p,Math.sin(d)*i,c),q(0,-1,0,c),0,0);this.quad(h,y,l,h)}}return this}addSphere(e,i,t,s=12,r=8){const u=this.pos.length/3;for(let c=0;c<=r;c++){const p=c/r,o=p*Math.PI;for(let h=0;h<=s;h++){const v=h/s,a=v*Math.PI*2,d=[Math.sin(o)*Math.cos(a),Math.cos(o),Math.sin(o)*Math.sin(a)],l=[e[0]+d[0]*i,e[1]+d[1]*i,e[2]+d[2]*i];t&&t(l,d),this.vert(l,d,v*3,p*2)}}for(let c=0;c<r;c++)for(let p=0;p<s;p++){const o=u+c*(s+1)+p,h=o+s+1;this.quad(o,h,h+1,o+1)}return this}build(){const e=this.pos.length/3,i=new Float32Array(e*8);for(let t=0;t<e;t++)i.set([this.pos[t*3],this.pos[t*3+1],this.pos[t*3+2]],t*8),i.set([this.nrm[t*3],this.nrm[t*3+1],this.nrm[t*3+2]],t*8+3),i.set([this.uv[t*2],this.uv[t*2+1]],t*8+6);return{vertexData:i,indexData:new Uint32Array(this.idx)}}}const L={CONCRETE:0,PLASTER:1,WOOD_FLOOR:2,WOOD_DECK:3,METAL:4,FABRIC:5,FOLIAGE:6,ROCK:7,EMISSIVE:8};let fe=1337;function A(){return fe=fe*1664525+1013904223>>>0,fe/4294967296}function je(){fe=1337;const n=new Map,e=g=>{let B=n.get(g);return B||(B=new He,n.set(g,B)),B},i=0;e(L.CONCRETE).addBox([0,.6,0],[38,1.2,30]),e(L.CONCRETE).addBox([0,-2.2,0],[420,1,420]),e(L.WOOD_FLOOR).addBox([-11,1.22,0],[10,.05,12]),e(L.PLASTER).addBox([-16,2.65,-4],[.35,2.9,4]),e(L.PLASTER).addBox([-16,2.65,4],[.35,2.9,4]),e(L.PLASTER).addBox([-16,.65,0],[.35,1.1,4]),e(L.PLASTER).addBox([-16,3.75,0],[.35,1.2,4]),e(L.PLASTER).addBox([-11,2.85,6],[10,3.3,.35]),e(L.PLASTER).addBox([-11,2.85,-6],[10,3.3,.35]),e(L.PLASTER).addBox([-6,2.85,-3.6],[.35,3.3,4.8]),e(L.PLASTER).addBox([-6,2.85,3.6],[.35,3.3,4.8]),e(L.PLASTER).addBox([-6,3.6,0],[.35,1.8,2.4]),e(L.PLASTER).addBox([-11,4.65,0],[10,.3,12]),e(L.WOOD_FLOOR).addBox([-4.5,1.22,0],[3,.05,3]),e(L.PLASTER).addBox([-4.5,2.7,-1.5],[3,3,.3]),e(L.PLASTER).addBox([-4.5,2.7,1.5],[3,3,.3]),e(L.PLASTER).addBox([-4.5,4.35,0],[3,.3,3.3]),e(L.WOOD_FLOOR).addBox([1.5,1.22,0],[9,.05,9]),e(L.PLASTER).addBox([-3,3.35,-2.85],[.35,4.3,3.3]),e(L.PLASTER).addBox([-3,3.35,2.85],[.35,4.3,3.3]),e(L.PLASTER).addBox([-3,4.2,0],[.35,2,2.4]),e(L.PLASTER).addBox([1.5,3.35,4.5],[9,4.3,.35]),e(L.PLASTER).addBox([1.5,3.35,-4.5],[9,4.3,.35]),e(L.PLASTER).addBox([6,3.35,-3],[.35,4.3,3]),e(L.PLASTER).addBox([6,3.35,3],[.35,4.3,3]),e(L.PLASTER).addBox([6,4.2,0],[.35,2,3]),e(L.PLASTER).addBox([-.9,5.65,0],[4.2,.3,9]),e(L.PLASTER).addBox([4.5,5.65,0],[3,.3,9]),e(L.PLASTER).addBox([1.5,5.65,-3],[6,.3,3]),e(L.PLASTER).addBox([1.5,5.65,3],[6,.3,3]),e(L.CONCRETE).addBox([1.5,5.9,-1.55],[3.2,.4,.12]),e(L.CONCRETE).addBox([1.5,5.9,1.55],[3.2,.4,.12]),e(L.CONCRETE).addBox([-.05,5.9,0],[.12,.4,3.2]),e(L.CONCRETE).addBox([3.05,5.9,0],[.12,.4,3.2]),e(L.CONCRETE).addBox([4.6,1.5,3.2],[1.2,.6,1.2]);for(let g=0;g<5;g++){const B=A()*Math.PI*2;e(L.FOLIAGE).addSphere([4.6+Math.cos(B)*.35,1.95+A()*.3,3.2+Math.sin(B)*.35],.32+A()*.15,b=>{b[1]*=.7},8,6)}e(L.WOOD_FLOOR).addBox([11,1.22,0],[10,.05,10]),e(L.PLASTER).addBox([11,2.85,5],[10,3.3,.35]),e(L.PLASTER).addBox([11,2.85,-5],[10,3.3,.35]),e(L.PLASTER).addBox([16,2.85,-3.75],[.35,3.3,2.5]),e(L.PLASTER).addBox([16,2.85,3.75],[.35,3.3,2.5]),e(L.PLASTER).addBox([16,.6,0],[.35,1,5]),e(L.PLASTER).addBox([16,3.75,0],[.35,1.2,5]),e(L.PLASTER).addBox([11,4.65,0],[10,.3,10]),e(L.WOOD_FLOOR).addBox([14.3,1.75,-1.2],[2,1.05,5.2]),e(L.METAL).addBox([15.6,2.4,-1.2],[.08,.04,5.2]),e(L.PLASTER).addBox([15.75,3.1,-1.2],[.4,1.9,5.2]);for(const g of[-2.8,-1.4,0,1.4])e(L.FABRIC).addCylinder([13,1.55,g],.22,.24,.68,10),e(L.METAL).addCylinder([13,1.2,g],.05,.05,.35,8);e(L.FABRIC).addBox([8.2,1.6,-2.8],[1.1,.75,2.6]),e(L.FABRIC).addBox([7.8,2,-2.8],[.35,.8,2.6]),e(L.FABRIC).addBox([8.2,1.75,-3.9],[1,.45,.3]),e(L.FABRIC).addBox([8.2,1.75,-1.7],[1,.45,.3]),e(L.FABRIC).addBox([10,1.26,-1.5],[4.2,.03,3.2]);for(const g of[-2.6,.2])e(L.METAL).addCylinder([14.2,4,g],.008,.008,1.2,6),e(L.METAL).addCylinder([14.2,3.32,g],.16,.06,.16,12),e(L.EMISSIVE).addSphere([14.2,3.24,g],.055,void 0,8,6);e(L.METAL).addCylinder([1.5,5.5,0],.008,.008,1.6,6),e(L.METAL).addCylinder([1.5,4.62,0],.2,.07,.18,12),e(L.EMISSIVE).addSphere([1.5,4.52,0],.06,void 0,8,6),e(L.METAL).addCylinder([8.6,1.85,2.8],.02,.02,1.3,6),e(L.METAL).addCylinder([8.6,1.22,2.8],.16,.16,.04,10),e(L.EMISSIVE).addCylinder([8.6,2.62,2.8],.11,.14,.24,12);for(const g of[-1.15,1.15])e(L.EMISSIVE).addBox([-4.5,2.55,g],[.16,.1,.24]);for(const g of[-2.6,2.6])e(L.EMISSIVE).addCylinder([-11,4.42,g],.09,.09,.05,10);for(const g of[-4.6,4.6])e(L.METAL).addCylinder([-18.5,1.5,g],.06,.06,.62,8),e(L.EMISSIVE).addCylinder([-18.5,1.86,g],.045,.05,.1,8);for(const g of[-4.6,0,4.6])e(L.CONCRETE).addCylinder([-17.2,3,g],.22,.26,3.6,12);e(L.PLASTER).addBox([-17.2,5,0],[.9,.5,11]);for(let g=0;g<24;g++){const B=-17.4-g*1;e(L.WOOD_DECK).addBox([B,1.08,0],[.88,.09,3.6])}e(L.WOOD_DECK).addBox([-29,.92,-1.55],[24,.16,.28]),e(L.WOOD_DECK).addBox([-29,.92,1.55],[24,.16,.28]);for(const g of[-18,-22,-26,-30,-34,-38])for(const B of[-1.9,1.9])e(L.WOOD_DECK).addCylinder([g,.1,B],.15,.13,3,8);e(L.WOOD_DECK).addBox([-28.5,1.85,-1.72],[22,.07,.07]),e(L.WOOD_DECK).addBox([-28.5,1.85,1.72],[22,.07,.07]);for(let g=0;g<12;g++){const B=-18.5-g*1.8;e(L.WOOD_DECK).addBox([B,1.5,-1.72],[.06,.6,.06]),e(L.WOOD_DECK).addBox([B,1.5,1.72],[.06,.6,.06])}const t=[[-20.5,-.35,3.6,1.5],[-22.5,-.55,-2.8,1.9],[-25,-.3,1.6,1.2],[-27.5,-.5,-4.2,1.6],[-30,-.45,2.8,1.4],[-23.8,-.75,.4,1.1],[-19.4,-.6,-3.4,1.3],[-33,-.35,-1.2,1.7]];for(const[g,B,b,P]of t)e(L.ROCK).addSphere([g,B,b],P,x=>{const _=M=>Math.sin(x[0]*M+1.7)*Math.sin(x[1]*M*1.7+4.2)*Math.sin(x[2]*M*1.3+2.1),f=1+.28*_(2.1)+.14*_(4.7);x[0]=g+(x[0]-g)*f,x[1]=Math.max(B-P*.35,B+(x[1]-B)*f),x[2]=b+(x[2]-b)*f},14,9);const s=[];for(let g=0;g<9;g++)s.push([-14+g*3.4,0,10.4+A()*2.6]);for(let g=0;g<8;g++)s.push([-12+g*3.6,0,-10.2-A()*2.4]);for(const[g,,B]of s){const b=5+Math.floor(A()*4);for(let P=0;P<b;P++){const x=g+(A()-.5)*1.6,_=B+(A()-.5)*1.6,f=3+A()*1.8,M=(A()-.5)*.16,S=(A()-.5)*.16;e(L.FOLIAGE).addCylinder([x,1.2+f/2-.02,_],.035,.022,f,6,{rz:M,ry:S});const T=1.2+f*Math.cos(M),C=x+f*Math.sin(M)*-Math.sin(S)+0,F=_+f*Math.sin(M)*Math.cos(S)*.5,E=3+Math.floor(A()*3);for(let R=0;R<E;R++){const U=T-.25-A()*1.2,O=.35+A()*.45,I=A()*Math.PI*2;e(L.FOLIAGE).addBox([C+Math.cos(I)*O*.5,U,F+Math.sin(I)*O*.5],[O,.02,.09+A()*.06],{ry:I,rz:-.25-A()*.3})}}}const r=[];let u=0,c=0;const p=[],o=[];for(const[g,B]of[...n.entries()].sort((b,P)=>b[0]-P[0])){const{vertexData:b,indexData:P}=B.build();p.push(b),o.push(P),r.push({matId:g,firstIndex:c,count:P.length}),u+=b.length/8,c+=P.length}const h=p.reduce((g,B)=>g+B.length,0),v=o.reduce((g,B)=>g+B.length,0),a=new Float32Array(h),d=new Uint32Array(v);let l=0,y=0;for(let g=0;g<p.length;g++){a.set(p[g],l);const B=o[g],b=l/8;for(let P=0;P<B.length;P++)d[y+P]=B[P]+b;l+=p[g].length,y+=B.length}const m=[{pos:[14.2,3.1,-2.6],color:[1,.72,.45],intensity:40,range:9,layerMask:2},{pos:[14.2,3.1,.2],color:[1,.72,.45],intensity:40,range:9,layerMask:2},{pos:[1.5,4.4,0],color:[1,.82,.6],intensity:26,range:9,layerMask:2},{pos:[8.6,2.55,2.8],color:[1,.68,.42],intensity:26,range:7,layerMask:2},{pos:[-4.2,2.55,-1.15],color:[1,.75,.5],intensity:14,range:5,layerMask:2},{pos:[-4.2,2.55,1.15],color:[1,.75,.5],intensity:14,range:5,layerMask:2},{pos:[-11,4.15,-2.6],color:[.95,.9,.8],intensity:18,range:7,layerMask:2},{pos:[-11,4.15,2.6],color:[.95,.9,.8],intensity:18,range:7,layerMask:2},{pos:[-17.2,4.4,0],color:[.85,.92,1],intensity:55,range:14,spotDir:[-17.5,0,0],cosInner:.88,cosOuter:.6,layerMask:1},{pos:[-17,4.6,0],color:[.9,.95,1],intensity:2e4,range:9,spotDir:[17.5,-2.2,0],cosInner:.8,cosOuter:.5,layerMask:1},{pos:[-18.5,1.95,-2.5],color:[1,.8,.55],intensity:35,range:6,layerMask:1},{pos:[-18.5,1.95,2.5],color:[1,.8,.55],intensity:35,range:6,layerMask:1}],w=[{name:"Пирс",eye:[-37,2.6,.4],look:[-8,2.6,0]},{name:"Атриум",eye:[5,2.1,3.4],look:[-.5,2.4,-.6]},{name:"Бар",eye:[10.4,2,1.6],look:[14.6,1.6,-1.8]},{name:"Коридор",eye:[-6.2,1.95,0],look:[-1,1.7,.1]},{name:"Океан",eye:[-24,1.6,7.5],look:[-60,4,-4]},{name:"Обзор",eye:[27,22,25],look:[-4,.5,-1]}],D=[{pos:[-11,2.6,0],interior:.88,bounce:.55},{pos:[-4.5,2.4,0],interior:.92,bounce:.5},{pos:[1.5,2.6,0],interior:.62,bounce:.6},{pos:[11,2.4,0],interior:.8,bounce:.65},{pos:[0,1.9,9.5],interior:.12,bounce:.2},{pos:[-14,2.2,0],interior:.25,bounce:.25},{pos:[-24,2.2,0],interior:.04,bounce:.05},{pos:[-36,2.4,0],interior:0,bounce:0},{pos:[-40,1.4,-16],interior:0,bounce:0},{pos:[12,1.4,-16],interior:0,bounce:0}],z=[];for(let g=0;g<8;g++)z.push({pos:[-19.5-g*2.6+A()*.8,1.09,(A()-.5)*1.4],halfExt:[1+A()*.7,.06,.55+A()*.5],yaw:(A()-.5)*.5,mode:1,tint:[.52,.56,.62],maskScale:3.5+A()*2.5,maskThresh:.36+A()*.08});for(const[g,B]of[[-18,-1.9],[-18,1.9],[-22,-1.9],[-22,1.9],[-26,-1.9],[-26,1.9]])z.push({pos:[g,1.09,B],halfExt:[.75,.06,.75],mode:1,tint:[.78,.8,.85],maskScale:5,maskThresh:.3});for(const[g,B,b]of[[-20.5,.1,3.6],[-22.5,-.1,-2.8],[-25,.15,1.6],[-27.5,-.05,-4.2],[-30,.1,2.8],[-23.8,-.2,.4],[-19.4,-.1,-3.4],[-33,.2,-1.2]])z.push({pos:[g,B,b],halfExt:[1.3,.9,1.3],yaw:A()*3.1,mode:2,tint:[.1,.22,.09],gloss:.35,maskScale:2.2+A()*1.5,maskThresh:.5});for(let g=0;g<10;g++)z.push({pos:[-15+A()*30,1.22,-13+A()*26],halfExt:[1.4+A()*1.6,.05,1.2+A()*1.4],yaw:A()*3.1,mode:3,tint:[.55,.53,.5],gloss:.14,maskScale:1.8+A()*2,maskThresh:.4});for(let g=0;g<8;g++){const B=g<4?-16.1:16.1;z.push({pos:[B,1.6+A()*.7,-4.5+g*1.3],halfExt:[.25,.9+A()*.6,.5+A()*.5],mode:2,tint:[.38,.36,.33],gloss:.1,maskScale:2.6,maskThresh:.52})}for(let g=0;g<6;g++)z.push({pos:[-18.3-A()*4,1.1,(A()-.5)*2.6],halfExt:[.9+A()*.9,.05,.7+A()*.6],yaw:A()*3.1,mode:2,tint:[.55,.5,.4],gloss:.1,maskScale:2.4+A()*2,maskThresh:.44});for(let g=0;g<4;g++)z.push({pos:[-22-g*4.5,1.13,0],halfExt:[2.2,.05,.4],mode:3,tint:[.5,.47,.44],gloss:.34,maskScale:1.6,maskThresh:.4});return{vertexData:a,indexData:d,groups:r,lights:m,shots:w,probes:D,decals:z,volumes:[{pos:[-11,2.8,0],radius:7.5,density:.014,noiseScale:.9},{pos:[-4.5,2.6,0],radius:3.2,density:.02,noiseScale:1.2},{pos:[1.5,3,0],radius:6,density:.028,noiseScale:1},{pos:[11,2.8,0],radius:7,density:.014,noiseScale:.9},{pos:[-28,.4,0],radius:14,density:.006,noiseScale:.5},{pos:[-12,1.5,11],radius:8,density:.004,noiseScale:.7},{pos:[-12,1.5,-11],radius:8,density:.004,noiseScale:.7},{pos:[-17,2.5,0],radius:6,density:.004,noiseScale:.8}],waterLevel:i}}class qe{constructor(e){this.device=e}resources=new Map;pool=[];passes=[];current=null;frameIndex=0;texture(e,i){let t=this.resources.get(e);if((!t||t.desc.width!==i.width||t.desc.height!==i.height||t.desc.format!==i.format)&&(t&&t.texture&&this.retire(t.texture),t={desc:i,texture:null,view:null},this.resources.set(e,t)),!t.texture){const s=this.pool.pop()??null;s&&s.width===i.width&&s.height===i.height&&s.format===i.format?t.texture=s:(s&&this.retire(s),t.texture=this.device.createTexture({label:`rg:${e}`,size:[i.width,i.height],format:i.format,usage:i.usage})),t.view=t.texture.createView()}return t.view}persistent(e,i){return this.texture(e,i)}retire(e){this.pool.push(e),this.pool.length>24&&this.pool.shift()?.destroy()}async run(e,i,t){const s={name:e,kind:i,cpuMs:0};this.passes.push(s),this.current=s;const r=performance.now();await t(),s.cpuMs=performance.now()-r,this.current=null}beginFrame(){this.passes.length=0,this.frameIndex++}reset(e=!1){for(const i of this.resources.values())i.texture?.destroy(),i.texture=null,i.view=null;if(this.resources.clear(),!e){for(const i of this.pool)i.destroy();this.pool.length=0}}totalCpuMs(){return this.passes.reduce((e,i)=>e+i.cpuMs,0)}get dev(){return this.device}}function K(){const n=new Float32Array(16);return n[0]=n[5]=n[10]=n[15]=1,n}function Ye(n){return n.fill(0),n[0]=n[5]=n[10]=n[15]=1,n}function Ae(n,e,i){const t=e[0],s=e[1],r=e[2],u=e[3],c=e[4],p=e[5],o=e[6],h=e[7],v=e[8],a=e[9],d=e[10],l=e[11],y=e[12],m=e[13],w=e[14],D=e[15];for(let z=0;z<4;z++){const k=i[z*4],g=i[z*4+1],B=i[z*4+2],b=i[z*4+3];n[z*4]=k*t+g*c+B*v+b*y,n[z*4+1]=k*s+g*p+B*a+b*m,n[z*4+2]=k*r+g*o+B*d+b*w,n[z*4+3]=k*u+g*h+B*l+b*D}return n}function Xe(n,e,i,t,s){const r=1/Math.tan(e/2);return n.fill(0),n[0]=r/i,n[5]=r,n[10]=s/(t-s),n[14]=s*t/(t-s),n[11]=-1,n}function $e(n,e,i,t,s,r,u){return n.fill(0),n[0]=2/(i-e),n[5]=2/(s-t),n[10]=1/(r-u),n[12]=(e+i)/(e-i),n[13]=(s+t)/(t-s),n[14]=r/(r-u),n[15]=1,n}function Ce(n,e,i,t){let s=e[0]-i[0],r=e[1]-i[1],u=e[2]-i[2],c=Math.hypot(s,r,u);c<1e-8&&(s=0,r=0,u=1,c=1),s/=c,r/=c,u/=c;let p=t[1]*u-t[2]*r,o=t[2]*s-t[0]*u,h=t[0]*r-t[1]*s;if(c=Math.hypot(p,o,h),c<1e-8){const l=Math.abs(t[2])<.9?[0,0,1]:[1,0,0];p=l[1]*u-l[2]*r,o=l[2]*s-l[0]*u,h=l[0]*r-l[1]*s,c=Math.hypot(p,o,h)}p/=c,o/=c,h/=c;const v=r*h-u*o,a=u*p-s*h,d=s*o-r*p;return n[0]=p,n[1]=v,n[2]=s,n[3]=0,n[4]=o,n[5]=a,n[6]=r,n[7]=0,n[8]=h,n[9]=d,n[10]=u,n[11]=0,n[12]=-(p*e[0]+o*e[1]+h*e[2]),n[13]=-(v*e[0]+a*e[1]+d*e[2]),n[14]=-(s*e[0]+r*e[1]+u*e[2]),n[15]=1,n}function Ke(n,e){const i=e[0],t=e[1],s=e[2],r=e[3],u=e[4],c=e[5],p=e[6],o=e[7],h=e[8],v=e[9],a=e[10],d=e[11],l=e[12],y=e[13],m=e[14],w=e[15],D=i*c-t*u,z=i*p-s*u,k=i*o-r*u,g=t*p-s*c,B=t*o-r*c,b=s*o-r*p,P=h*y-v*l,x=h*m-a*l,_=h*w-d*l,f=v*m-a*y,M=v*w-d*y,S=a*w-d*m;let T=D*S-z*M+k*f+g*_-B*x+b*P;return T?(T=1/T,n[0]=(c*S-p*M+o*f)*T,n[1]=(s*M-t*S-r*f)*T,n[2]=(y*b-m*B+w*g)*T,n[3]=(a*B-v*b-d*g)*T,n[4]=(p*_-u*S-o*x)*T,n[5]=(i*S-s*_+r*x)*T,n[6]=(m*k-l*b-w*z)*T,n[7]=(h*b-a*k+d*z)*T,n[8]=(u*M-c*_+o*P)*T,n[9]=(t*_-i*M-r*P)*T,n[10]=(l*B-y*k+w*D)*T,n[11]=(v*k-h*B-d*D)*T,n[12]=(c*x-u*f-p*P)*T,n[13]=(i*f-t*x+s*P)*T,n[14]=(y*z-l*g-m*D)*T,n[15]=(h*g-v*z+a*D)*T,n):Ye(n)}function ie(n,e){return[n[0]-e[0],n[1]-e[1],n[2]-e[2]]}function le(n,e){return[n[0]+e[0],n[1]+e[1],n[2]+e[2]]}function ye(n,e){return[n[0]*e,n[1]*e,n[2]*e]}function Pe(n,e){return[n[1]*e[2]-n[2]*e[1],n[2]*e[0]-n[0]*e[2],n[0]*e[1]-n[1]*e[0]]}function Je(n){return Math.hypot(n[0],n[1],n[2])}function te(n){const e=Je(n)||1;return[n[0]/e,n[1]/e,n[2]/e]}function Te(n,e){let i=1,t=0,s=n;for(;s>0;)i/=e,t+=i*(s%e),s=Math.floor(s/e);return t}const Q=(n,e,i)=>Math.min(i,Math.max(e,n)),se=(n,e,i)=>n+(e-n)*i,Ze=(n,e,i)=>{const t=Q((i-n)/(e-n),0,1);return t*t*(3-2*t)},Y=n=>n*Math.PI/180;class Qe{target=[0,2,0];distance=26;yaw=Y(215);pitch=Y(14);position=[-30,2.4,2];flyYaw=Y(70);flyPitch=Y(4);mode="orbit";fovY=Y(52);near=.3;far=2400;view=K();proj=K();viewProj=K();invViewProj=K();prevViewProj=K();viewDir=[0,0,1];camPos=[0,0,0];hasPrev=!1;jitterEnabled=!0;jitterIdx=0;jitter=[0,0];eye(){if(this.mode==="fly")return this.position;const e=Math.cos(this.pitch);return[this.target[0]+this.distance*e*Math.cos(this.yaw),this.target[1]+this.distance*Math.sin(this.pitch),this.target[2]+this.distance*e*Math.sin(this.yaw)]}lookAtPoint(){return this.mode==="fly"?le(this.position,this.forward()):this.target}forward(){const e=Math.cos(this.flyPitch);return te([e*Math.cos(this.flyYaw),Math.sin(this.flyPitch),e*Math.sin(this.flyYaw)])}forwardOfView(){return te(ie(this.lookAtPoint(),this.eye()))}update(e){if(this.jitterEnabled){const r=(Te(this.jitterIdx%8+1,2)-.5)*2/Math.ceil(e*720),u=(Te(this.jitterIdx%8+1,3)-.5)*2/720;this.jitter=[r,u],this.jitterIdx++}else this.jitter=[0,0];const i=this.prevViewProj;this.hasPrev&&i.set(this.viewProj);const t=this.eye(),s=this.lookAtPoint();Ce(this.view,t,s,[0,1,0]),Xe(this.proj,this.fovY,e,this.near,this.far),this.proj[2]+=this.jitter[0],this.proj[13]+=this.jitter[1],Ae(this.viewProj,this.proj,this.view),Ke(this.invViewProj,this.viewProj),this.hasPrev||(i.set(this.viewProj),this.hasPrev=!0),this.camPos=t,this.viewDir=te(ie(s,t))}moveOrbit(e,i){this.yaw-=e*.005,this.pitch=Q(this.pitch+i*.005,Y(-85),Y(85))}zoom(e){this.distance=Q(this.distance*(e>0?1.12:.89),2.2,220)}pan(e,i){const t=this.forward(),s=te(Pe([0,1,0],t)),r=this.distance*.0016;this.target=le(this.target,le(ye(s,-e*r),ye([0,1,0],i*r)))}flyStep(e,i){const t=i.has("shiftleft")||i.has("shiftright")?26:7,s=this.forward(),r=te(Pe(s,[0,1,0])),u=[0,0,0];i.has("keyw")&&u.forEach((p,o)=>u[o]+=s[o]),i.has("keys")&&u.forEach((p,o)=>u[o]-=s[o]),i.has("keyd")&&u.forEach((p,o)=>u[o]+=r[o]),i.has("keya")&&u.forEach((p,o)=>u[o]-=r[o]),i.has("keye")&&(u[1]+=1),i.has("keyq")&&(u[1]-=1);const c=Math.hypot(...u);if(c>1e-4){const p=t*e/c;this.position=le(this.position,ye(u,p)),this.position[1]=Math.max(this.position[1],-1.5)}}animateTo(e,i){const t=i*i*(3-2*i),s=this.eye(),r=this.lookAtPoint(),u=[se(s[0],e.eye[0],t),se(s[1],e.eye[1],t),se(s[2],e.eye[2],t)],c=[se(r[0],e.look[0],t),se(r[1],e.look[1],t),se(r[2],e.look[2],t)];if(this.mode==="orbit"){this.distance=Q(Math.hypot(...ie(u,e.look)),2.2,220),this.target=c;const p=ie(u,c),o=Math.hypot(p[0],p[2]);this.yaw=Math.atan2(p[2],p[0]),this.pitch=Math.atan2(p[1],o)}else{this.position=u;const p=te(ie(c,u));this.flyYaw=Math.atan2(p[2],p[0]),this.flyPitch=Math.asin(Q(p[1],-1,1))}}}const Se=4,ze=[.025,.11,.32,.72,1],_e=10,De=20;class et{camData=new Float32Array(68);frameData=new Float32Array(124);cascadeData=[];lightData;probeData=new Float32Array(_e*De);decalData=new Float32Array(800);volumeData=new Float32Array(64);sunElevation=28;sunAzimuth=245;shadowDist=70;fogScale=.9;evBias=0;cloudCover=.42;bloomStrength=.06;caAmount=.55;debugMode=0;taaOn=1;lutOn=1;ssrOn=1;giOn=1;ssrStrength=1;evLock=0;fftOn=1;causticsOn=1;volFogOn=1;layersMode=0;cookieStrength=0;skyLutOn=1;timeLock=null;sunDir=[0,1,0];sunColor=[1,1,1];probes=[];bakedSun=null;constructor(e){for(let i=0;i<Se;i++)this.cascadeData.push(new Float32Array(16));this.lightData=new Float32Array(e.length*16),this.packLights(e)}setProbes(e){this.probes=e.slice(0,_e)}packLights(e){e.forEach((i,t)=>{const s=t*16;this.lightData[s]=i.pos[0],this.lightData[s+1]=i.pos[1],this.lightData[s+2]=i.pos[2],this.lightData[s+3]=i.range,this.lightData[s+4]=i.color[0],this.lightData[s+5]=i.color[1],this.lightData[s+6]=i.color[2],this.lightData[s+7]=i.intensity;const r=i.spotDir??[0,-1,0],u=Math.hypot(r[0],r[1],r[2])||1;this.lightData[s+8]=r[0]/u,this.lightData[s+9]=r[1]/u,this.lightData[s+10]=r[2]/u,this.lightData[s+11]=0,this.lightData[s+12]=i.cosInner??0,this.lightData[s+13]=i.cosOuter??0,this.lightData[s+14]=i.spotDir?1:0,this.lightData[s+15]=i.layerMask??7})}updateSun(){const e=Y(this.sunElevation),i=Y(this.sunAzimuth);this.sunDir=[Math.cos(e)*Math.sin(i),Math.sin(e),Math.cos(e)*Math.cos(i)];const t=1-Ze(6,26,this.sunElevation);this.sunColor=[1,.965-.42*t,.925-.66*t]}pack(e,i,t,s,r,u,c,p,o,h,v,a,d,l){const y=this.camData;y.set(e.view,0),y.set(e.viewProj,16),y.set(e.invViewProj,32),y.set(e.prevViewProj,48),y[64]=e.camPos[0],y[65]=e.camPos[1],y[66]=e.camPos[2],y[67]=1;const m=this.frameData;m[0]=this.sunDir[0],m[1]=this.sunDir[1],m[2]=this.sunDir[2],m[3]=0,m[4]=this.sunColor[0]*1e5,m[5]=this.sunColor[1]*1e5,m[6]=this.sunColor[2]*1e5,m[7]=1,m[8]=.00125,m[9]=.035,m[10]=.55,m[11]=this.timeLock??performance.now()/1e3,m[12]=i,m[13]=t,m[14]=1/i,m[15]=1/t,m[16]=e.near,m[17]=e.far,m[18]=v,m[19]=this.shadowDist;const w=ze;m[20]=w[1]*this.shadowDist,m[21]=w[2]*this.shadowDist,m[22]=w[3]*this.shadowDist,m[23]=w[4]*this.shadowDist,m[24]=o,m[25]=h,m[26]=r,m[27]=s,m[28]=this.evBias,m[29]=d,m[30]=l,m[31]=1.15,m[32]=this.cloudCover,m[33]=1,m[34]=this.fogScale,m[35]=a,m[36]=u,m[37]=c,m[38]=p,m[39]=Math.tan(e.fovY/2),m[40]=this.taaOn,m[41]=this.bloomStrength,m[42]=this.caAmount,m[43]=this.debugMode,m[44]=this.lutOn,m[45]=this.ssrOn*this.ssrStrength,m[46]=this.giOn,m[47]=this.evLock,m[48]=this.fftOn,m[49]=this.causticsOn,m[50]=.86,m[51]=1,m[52]=140,m[53]=48,m[54]=96,m[55]=54,m[56]=this.volFogOn,m[57]=this.layersMode,m[58]=this.cookieStrength,m[59]=this.skyLutOn}setDecalsAndVolumes(e,i){this.decalData.fill(0),e.slice(0,50).forEach((t,s)=>{const r=s*16;this.decalData[r]=t.pos[0],this.decalData[r+1]=t.pos[1],this.decalData[r+2]=t.pos[2],this.decalData[r+3]=t.yaw??0,this.decalData[r+4]=t.halfExt[0],this.decalData[r+5]=t.halfExt[1],this.decalData[r+6]=t.halfExt[2],this.decalData[r+7]=t.mode,this.decalData[r+8]=t.tint[0],this.decalData[r+9]=t.tint[1],this.decalData[r+10]=t.tint[2],this.decalData[r+11]=0,this.decalData[r+12]=t.gloss??.2,this.decalData[r+13]=t.maskScale??2.5,this.decalData[r+14]=t.maskThresh??.45,this.decalData[r+15]=0}),this.volumeData.fill(0),i.slice(0,8).forEach((t,s)=>{const r=s*8;this.volumeData[r]=t.pos[0],this.volumeData[r+1]=t.pos[1],this.volumeData[r+2]=t.pos[2],this.volumeData[r+3]=t.radius,this.volumeData[r+4]=t.density,this.volumeData[r+5]=0,this.volumeData[r+6]=t.noiseScale??1,this.volumeData[r+7]=1})}bakeSkyLut(){const p=[5802e-9,13558e-9,331e-7],o=3996e-9,h=44e-7,v=[65e-8,1881e-9,85e-9],a=.76,d=20,l=_=>{const f=Math.max(-65504,Math.min(65504,_)),M=new Float32Array(1),S=new Int32Array(M.buffer);M[0]=f;const T=S[0],C=T>>16&32768;let F=(T>>23&255)-127+15;const E=T&8388607;return F>=31?C|31744:F<=0?F<-10?C:C|(8388608|E)>>1-F>>13:C|F<<10|E>>13},y=_=>Math.max(0,1-Math.abs(_-25e3)/15e3),m=(_,f,M,S,T)=>{let C=0,F=0,E=0;const R=8;for(let U=0;U<R;U++){const O=T*Math.pow((U+.5)/R,2),I=Math.hypot(_+M*O,f+S*O)-636e4,W=T*(2*(U+.5)/R)/R;C+=Math.exp(-I/8500)*W,F+=Math.exp(-I/1200)*W,E+=y(I)*W}return[C,F,E]},w=_=>{const f=636e4*_,M=f*f-(636e4*636e4-646e4*646e4);return-f+Math.sqrt(Math.max(M,1e-6))},D=new Uint16Array(1536*24*4);for(let _=0;_<24;_++){const f=(_+.5)/24*(Math.PI/2),M=Math.cos(f),S=Math.sin(f);for(let T=0;T<32;T++){const C=(T+.5)/32*Math.PI;for(let F=0;F<48;F++){const E=(F+.5)/48*(Math.PI/2)-1e-4,R=Math.sin(E),O=Math.cos(E)*Math.cos(C),I=w(R),W=O*M+R*S,G=3/(16*Math.PI)*(1+W*W),N=a*a,X=(1-N)/(4*Math.PI*Math.pow(Math.max(1+N-2*a*W,1e-4),1.5));let J=[0,0,0];const ee=20;for(let re=0;re<ee;re++){const he=I*Math.pow((re+.5)/ee,2.2),Fe=I*2.2*Math.pow((re+.5)/ee,1.2)/ee,ge=O*he,pe=636e4+R*he,Le=Math.hypot(ge,pe)-636e4,Re=Math.exp(-Le/8500),Ee=Math.exp(-Le/1200),[me,ve,xe]=m(0,636e4,O,R,he),be=x(ge,pe,M,S);let ae=0,oe=0,ne=0;if(be>0){const[$,Oe,Ie]=m(ge,pe,M,S,be);ae=$,oe=Oe,ne=Ie}const Ve=[Math.exp(-(p[0]*me+(o+h)*ve+v[0]*xe)),Math.exp(-(p[1]*me+(o+h)*ve+v[1]*xe)),Math.exp(-(p[2]*me+(o+h)*ve+v[2]*xe))],Ge=[Math.exp(-(p[0]*ae+(o+h)*oe+v[0]*ne)),Math.exp(-(p[1]*ae+(o+h)*oe+v[1]*ne)),Math.exp(-(p[2]*ae+(o+h)*oe+v[2]*ne))];if(!(be<=0))for(let $=0;$<3;$++)J[$]+=Ve[$]*(p[$]*Re*G+o*Ee*X)*Ge[$]*Fe*d}const H=((_*32+T)*48+F)*4;D[H]=l(J[0]*1.7),D[H+1]=l(J[1]*1.7),D[H+2]=l(J[2]*1.7),D[H+3]=0}}}const z=Math.min(47,Math.floor(28/90*48)),g=((Math.min(23,Math.floor(28/90*24))*32+Math.floor(32*.5))*48+z)*4,B=(.1+.26+.6)*4200;let b=0;for(let _=0;_<3;_++)b+=Me(D[g+_]);let P=b>1e-6?B/b:0;(!isFinite(P)||P<=0||P>1e6)&&(P=0);for(let _=0;_<D.length;_+=4)for(let f=0;f<3;f++)D[_+f]=l(Math.min(6e4,Math.max(0,Me(D[_+f])*P)));return D;function x(_,f,M,S){const T=_*M+f*S,C=T*T-(_*_+f*f-646e4*646e4);if(C<0)return-1;const F=-T+Math.sqrt(C),E=_*M+f*S,R=E*E-(_*_+f*f-636e4*636e4);return(R>=0?-E-Math.sqrt(R):1/0)>0?-1:F}}bakeProbes(){const e=this.sunElevation,i=this.sunAzimuth;if(this.bakedSun&&this.bakedSun.el===e&&this.bakedSun.az===i)return;this.bakedSun={el:e,az:i};const t=this.sunDir,s=[this.sunColor[0]*1e5,this.sunColor[1]*1e5,this.sunColor[2]*1e5],r=64,u=Math.PI*(3-Math.sqrt(5));for(let c=0;c<this.probes.length;c++){const p=this.probes[c],o=1-p.interior,h=c*De;this.probeData[h]=p.pos[0],this.probeData[h+1]=p.pos[1],this.probeData[h+2]=p.pos[2],this.probeData[h+3]=p.interior;let v=[0,0,0],a=[0,0,0],d=[0,0,0],l=[0,0,0];for(let y=0;y<r;y++){const m=1-2*((y+.5)/r),w=Math.sqrt(Math.max(1-m*m,1e-6)),D=y*u,z=[Math.cos(D)*w,m,Math.sin(D)*w],k=z[1]*.5+.5,g=[.5,.55,.64],B=[.3,.44,.75],b=[0,1,2].map(f=>(g[f]+(B[f]-g[f])*k)*.6),P=Q(z[0]*t[0]+z[1]*t[1]+z[2]*t[2],0,1)*.5+.5,x=18e-6*P*P,_=[0,1,2].map(f=>{const M=b[f]+s[f]*x,S=s[f]*.0013*(f===0?1:f===1?.86:.72)*(1+p.bounce*(f===0?.35:f===1?.12:-.1));return S+(M-S)*o});for(let f=0;f<3;f++)v[f]+=_[f]/r,a[f]+=_[f]*z[0]/r,d[f]+=_[f]*z[1]/r,l[f]+=_[f]*z[2]/r}this.probeData[h+4]=v[0],this.probeData[h+5]=v[1],this.probeData[h+6]=v[2],this.probeData[h+7]=0,this.probeData[h+8]=a[0],this.probeData[h+9]=a[1],this.probeData[h+10]=a[2],this.probeData[h+11]=0,this.probeData[h+12]=d[0],this.probeData[h+13]=d[1],this.probeData[h+14]=d[2],this.probeData[h+15]=0,this.probeData[h+16]=l[0],this.probeData[h+17]=l[1],this.probeData[h+18]=l[2],this.probeData[h+19]=0}}updateCascades(e){const i=ze,t=e.invViewProj;for(let s=0;s<Se;s++){const r=i[s]*this.shadowDist,u=i[s+1]*this.shadowDist,c=[],p=w=>(e.far-e.near*e.far/w)/(e.far-e.near);for(const[w,D]of[[-1,-1],[1,-1],[1,1],[-1,1]])for(const z of[Math.max(r,e.near+.5),u]){const k=[w,D,Q(p(z),0,.9999)],g=t,B=g[0]*k[0]+g[4]*k[1]+g[8]*k[2]+g[12],b=g[1]*k[0]+g[5]*k[1]+g[9]*k[2]+g[13],P=g[2]*k[0]+g[6]*k[1]+g[10]*k[2]+g[14],x=g[3]*k[0]+g[7]*k[1]+g[11]*k[2]+g[15];c.push([B/x,b/x,P/x])}let o=0,h=0,v=0;for(const w of c)o+=w[0],h+=w[1],v+=w[2];o/=8,h/=8,v/=8;let a=0;for(const w of c)a=Math.max(a,Math.hypot(w[0]-o,w[1]-h,w[2]-v));a=Math.max(a,2.5);const d=[o-this.sunDir[0]*(a+30),h-this.sunDir[1]*(a+30),v-this.sunDir[2]*(a+30)],l=K();Ce(l,d,[o,h,v],[0,1,0]);const y=K();$e(y,-a,a,-a,a,1,(a+30)*2+10);const m=K();Ae(m,y,l),this.cascadeData[s].set(m)}}cascadeTexelWorld(){return 2*this.shadowDist*.35/1024}}function Me(n){const e=(n&32768)>>15,i=(n&31744)>>10,t=n&1023;let s;return i===0?s=t*2**-24:i===31?s=t?NaN:1/0:s=(1+t/1024)*2**(i-15),(e?-1:1)*s}const V=`
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
`,tt=`
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
  // M5: g0.a packs matId (low nibble) + light layer (high nibble):
  // bit0 Exterior, bit1 Interior, bit2 Lamps (HDRP Light Layers)
  o.g0 = vec4f(m.albedo, f32((in.matId & 0xF) | (layerOf(in.worldPos, in.matId) << 4)) / 255.0);
  o.g1 = vec4f(m.N, m.gloss);
  let F0 = mix(vec3f(0.04), m.albedo, m.metallic);
  o.g2 = vec4f(F0, m.metallic);
  return o;
}
`,st=`
@group(0) @binding(0) var<uniform> cascadeMat : mat4x4f;

@vertex
fn vs_shadow(@location(0) pos : vec3f, @location(1) nrm : vec3f, @location(2) uv : vec2f) -> @builtin(position) vec4f {
  return cascadeMat * vec4f(pos, 1.0);
}
`,it=`
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
`,rt=`
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
`,at=`
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
`,ot=`
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
`,we=`
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
`,nt=`
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
`,ke=`
@fragment
fn fs_ocean() -> @location(0) vec4f {
  return vec4f(0.05, 0.20, 0.30, 1.0);
}
`,lt=`
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
`,ct=`
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
`,ft=`
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
`,ut=`
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
`,dt=`
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
`,ht=`
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
`,gt=`
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
`,pt=`
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
`,mt=`
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
`,vt=`
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
`,xt=`
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
`,bt=`
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
`,ue=[{name:"Performant",shadowAtlas:1024,ssao:!1,taa:!1,ssr:!1,fft:!1,oceanNear:96,oceanFar:48,volfog:!1,volHQ:!1},{name:"Balanced",shadowAtlas:2048,ssao:!0,taa:!1,ssr:!0,fft:!0,oceanNear:160,oceanFar:72,volfog:!0,volHQ:!1},{name:"High",shadowAtlas:4096,ssao:!0,taa:!0,ssr:!0,fft:!0,oceanNear:224,oceanFar:88,volfog:!0,volHQ:!0}],ce=6,yt=24,wt=50,_t=8;class Bt{graph;camera=new Qe;uniforms;tierIndex=2;toggles={ssao:!0,taa:!0,bloom:!0,ocean:!0,ssr:!0,lut:!0,gi:!0,fft:!0,caus:!0,volfog:!0,decals:!0,layers:!1,sky:!0,cookie:!0};lastFrameCpuMs=0;frameNo=0;fftDiv=1;dev;canvasPrivate;ctx;scene;sceneVB;sceneIB;camBuf;frameBuf;cascadeBuf=[];lightsBuf;statsBuf;meshConstBufs=[];whiteTex;blackTex;oceanNearVB;oceanNearIB;oceanNearCount=0;oceanFarVB;oceanFarIB;oceanFarCount=0;pShadow;pGbuffer;pCull;pSsao;pBlur;pLighting;pTaa;pSsr;pRefl;pOcean;pGen;pFft;pPack;pExpAccum;pExpFinal;pBloomPre;pBloomDown;pBloomUp;pTonemap;pFogInject;pFogIntegrate;pDecals;bglGlobal;bglMesh;bglCull;bglSsao;bglBlur;bglLighting;bglOcean;bglGen;bglFft;bglPack;bglSsr;bglRefl;bglTaa;bglExp;bglBloom0;bglBloom1;bglTonemap;bglFogInject;bglFogIntegrate;bglDecals;gridCountsBuf;gridIndicesBuf;destBufs=[];bgGlobal;bgCascade=[];bgMesh=[];bgCull;bgSsao;bgBlur;bgLightingAo;bgLightingWhite;bgSsr;bgRefl;bgOcean;bgGen;bgFft=[];bgPack;fftPassBufs=[];fftA0View;fftA1View;fftB0View;fftB1View;dispView;bgFogInject;bgFogIntegrate;bgDecals;bgTaa;bgExp;bgTonemapBloom;bgTonemapBlack;bgBloom=[];bloomPasses=[];shadowView;g0View;g1View;g2View;g0mView;g1mView;g2mView;depthView;hdrAView;hdrA2View;ssrHalfView;hdrBView;hdrCView;historyView;bloomViews=[];aoHalfView;aoHalf2View;volFogAView;volFogBView;skyLutTex;skyLutView;decalBuf;volumeBuf;whiteView;blackView;smpRep;probesBuf;lutTex;lutView;W=0;H=0;atlas=2048;zerobuffer=new Uint32Array(0);constructor(e,i){this.ctx=e,this.dev=e.device,this.canvasPrivate=e.canvas,this.graph=new qe(this.dev),this.scene=i,this.uniforms=new et(i.lights)}put(e,i,t=0){this.dev.queue.writeBuffer(e,t,i)}get tier(){return ue[this.tierIndex]}volDims(){const e=Number(new URLSearchParams(location.search).get("volq")??0);return e===2?[48,27,24]:e===1?[64,36,32]:this.tier.volHQ?[96,54,48]:[64,36,32]}bakeSkyLut(){const e=this.dev,i=48,t=32,s=24,r=this.uniforms.bakeSkyLut();this.skyLutTex=e.createTexture({size:[i,t,s],dimension:"3d",format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.skyLutTex},r,{bytesPerRow:i*8,rowsPerImage:t},[i,t,s]),this.skyLutView=this.skyLutTex.createView({dimension:"3d"})}get canvas(){return this.canvasPrivate}adapterNameShort(){const e=this.ctx.adapterName;return e.length>46?e.slice(0,44)+"…":e}async init(){const e=this.dev;this.uniforms.updateSun(),this.uniforms.setProbes(this.scene.probes),this.uniforms.bakeProbes(),this.probesBuf=e.createBuffer({size:_e*80,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.probesBuf,this.uniforms.probeData),this.bakeLut(),this.bakeSkyLut(),this.sceneVB=e.createBuffer({size:this.scene.vertexData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneVB,this.scene.vertexData),this.sceneIB=e.createBuffer({size:this.scene.indexData.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.sceneIB,this.scene.indexData),this.camBuf=e.createBuffer({size:272,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.frameBuf=e.createBuffer({size:496,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});for(let v=0;v<4;v++){const a=e.createBuffer({size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.cascadeBuf.push(a),this.bgCascade.push(e.createBindGroup({layout:this.bglMeshAfter(),entries:[{binding:0,resource:{buffer:a}}]}))}const i=this.scene.lights.length*64;this.lightsBuf=e.createBuffer({size:i,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.lightsBuf,this.uniforms.lightData),this.uniforms.setDecalsAndVolumes(this.scene.decals,this.scene.volumes),this.decalBuf=e.createBuffer({size:wt*64,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.decalBuf,this.uniforms.decalData),this.volumeBuf=e.createBuffer({size:_t*32,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.put(this.volumeBuf,this.uniforms.volumeData);const[t,s,r]=this.volDims(),u=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING,c=e.createTexture({size:[t,s,r],dimension:"3d",format:"rgba16float",usage:u}),p=e.createTexture({size:[t,s,r],dimension:"3d",format:"rgba16float",usage:u});this._volTex=[c,p],this.volFogAView=c.createView({dimension:"3d"}),this.volFogBView=p.createView({dimension:"3d"}),this.statsBuf=e.createBuffer({size:272,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.put(this.statsBuf,new Float32Array([-3,.02,0]),256);for(const v of this.scene.groups){const a=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(a,new Float32Array([v.matId,0,0,0])),this.meshConstBufs.push(a)}this.whiteTex=e.createTexture({size:[4,4],format:"r8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.whiteTex},new Uint8Array(16).fill(255),{bytesPerRow:4,rowsPerImage:4},[4,4]),this.blackTex=e.createTexture({size:[4,4],format:"rgba16float",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.blackTex},new Float32Array(64),{bytesPerRow:32,rowsPerImage:4},[4,4]),this.whiteView=this.whiteTex.createView(),this.blackView=this.blackTex.createView(),this.createPipelines(),this.initFft();const o=new URLSearchParams(location.search);o.get("fft")==="0"&&(this.toggles.fft=!1),o.get("caus")==="0"&&(this.toggles.caus=!1),o.get("froxel")==="0"&&(this.toggles.volfog=!1),o.get("decals")==="0"&&(this.toggles.decals=!1),o.get("sky")==="0"&&(this.toggles.sky=!1),o.get("cookie")==="0"&&(this.toggles.cookie=!1),o.get("layers")==="1"&&(this.toggles.layers=!0);const h=Number(o.get("fftdiv")??0);h>=1&&(this.fftDiv=Math.floor(h));for(const v of this.scene.groups)this.bgMesh.push(e.createBindGroup({layout:this.bglMesh,entries:[{binding:0,resource:{buffer:this.meshConstBufs[this.bgMesh.length]}}]}));this.rebuildOcean()}bglMeshAfter(){return this.bglMesh||(this.bglMesh=this.dev.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]})),this.bglMesh}rebuildOcean(){const e=this.dev,i=Number(new URLSearchParams(location.search).get("oceansize")??0),t=i>0?i:this.tier.oceanNear;this.oceanNearVB?.destroy(),this.oceanNearIB?.destroy(),this.oceanFarVB?.destroy(),this.oceanFarIB?.destroy();const s=this.makeGrid(t,380,-14,0,0),r=this.makeDisk(Math.max(this.tier.oceanFar>>1,24),Math.max(this.tier.oceanFar*2,96),1500,-14,0,-.35);this.oceanNearVB=e.createBuffer({size:s.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearVB,s.pos),this.oceanNearIB=e.createBuffer({size:s.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanNearIB,s.idx),this.oceanNearCount=s.idx.length,this.oceanFarVB=e.createBuffer({size:r.pos.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarVB,r.pos),this.oceanFarIB=e.createBuffer({size:r.idx.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this.put(this.oceanFarIB,r.idx),this.oceanFarCount=r.idx.length}makeDisk(e,i,t,s,r,u){const c=new Float32Array((e+1)*i*3);for(let h=0;h<=e;h++){const v=h/e*t;for(let a=0;a<i;a++){const d=a/i*Math.PI*2,l=(h*i+a)*3;c[l]=s+Math.cos(d)*v,c[l+1]=u,c[l+2]=r+Math.sin(d)*v}}const p=new Uint32Array(e*i*6);let o=0;for(let h=0;h<e;h++)for(let v=0;v<i;v++){const a=(v+1)%i,d=h*i+v,l=(h+1)*i+v;p[o++]=d,p[o++]=l,p[o++]=l+a-v,p[o++]=d,p[o++]=l+a-v,p[o++]=d+(a-v)}return{pos:c,idx:p}}makeGrid(e,i,t,s,r){const u=new Float32Array(e*e*3),c=i/(e-1);for(let v=0;v<e;v++)for(let a=0;a<e;a++){const d=(v*e+a)*3;u[d]=t-i/2+a*c,u[d+1]=r,u[d+2]=s-i/2+v*c}const p=(e-1)*(e-1),o=new Uint32Array(p*6);let h=0;for(let v=0;v<e-1;v++)for(let a=0;a<e-1;a++){const d=v*e+a;o[h++]=d,o[h++]=d+e,o[h++]=d+e+1,o[h++]=d,o[h++]=d+e+1,o[h++]=d+1}return{pos:u,idx:o}}createPipelines(){const e=this.dev,i=this.module(V+tt),t=this.module(V+st),s=this.module(V+it),r=this.module(V+rt),u=this.module(V+at),c=this.module(V+ot),p=this.module(V+ut),o=this.module(V+dt),h=new URLSearchParams(location.search).get("ocean")??"full";let v;if(h==="flat")v=V+nt+ke;else if(h==="constfs"){const R=we.indexOf("@fragment");v=V+we.slice(0,R)+ke}else v=V+we;const a=this.module(v),d=this.module(V+lt),l=this.module(ct),y=this.module(ft),m=this.module(V+ht),w=this.module(V+gt),D=this.module(V+pt),z=this.module(V+mt),k=this.module(V+vt),g=this.module(V+xt),B=this.module(V+bt),b=GPUShaderStage.FRAGMENT,P=GPUShaderStage.VERTEX,x=GPUShaderStage.COMPUTE,_={sampleType:"float"};this.bglGlobal=e.createBindGroupLayout({entries:[{binding:0,visibility:P|b|x,buffer:{type:"uniform"}},{binding:1,visibility:P|b|x,buffer:{type:"uniform"}},{binding:2,visibility:b|x,texture:{sampleType:"depth"}},{binding:3,visibility:b|x,sampler:{type:"comparison"}},{binding:4,visibility:b,texture:{sampleType:"float",viewDimension:"3d"}},{binding:5,visibility:b,sampler:{type:"filtering"}}]}),this.bglCull=e.createBindGroupLayout({entries:[{binding:0,visibility:x,buffer:{type:"read-only-storage"}},{binding:1,visibility:x,buffer:{type:"storage"}},{binding:2,visibility:x,buffer:{type:"storage"}},{binding:3,visibility:x,texture:{sampleType:"depth"}},{binding:4,visibility:x,buffer:{type:"uniform"}},{binding:5,visibility:x,buffer:{type:"uniform"}}]}),this.bglSsao=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:{sampleType:"depth"}},{binding:1,visibility:b,texture:_}]}),this.bglBlur=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,sampler:{type:"filtering"}}]}),this.bglLighting=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,texture:_},{binding:2,visibility:b,texture:_},{binding:3,visibility:b,texture:{sampleType:"depth"}},{binding:4,visibility:b,texture:_},{binding:5,visibility:b,buffer:{type:"read-only-storage"}},{binding:6,visibility:b,buffer:{type:"read-only-storage"}},{binding:7,visibility:b,buffer:{type:"read-only-storage"}},{binding:8,visibility:b,buffer:{type:"read-only-storage"}},{binding:9,visibility:b,texture:{sampleType:"float",viewDimension:"3d"}},{binding:10,visibility:b,texture:{sampleType:"float",viewDimension:"3d"}},{binding:11,visibility:b,sampler:{type:"filtering"}}]}),this.bglOcean=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,texture:{sampleType:"depth"}},{binding:2,visibility:b,sampler:{type:"filtering"}},{binding:3,visibility:P|b,texture:_},{binding:4,visibility:P|b,sampler:{type:"filtering"}},{binding:5,visibility:b,texture:{sampleType:"float",viewDimension:"3d"}},{binding:6,visibility:b,texture:{sampleType:"float",viewDimension:"3d"}}]}),this.bglGen=e.createBindGroupLayout({entries:[{binding:0,visibility:x,buffer:{type:"uniform"}},{binding:1,visibility:x,storageTexture:{access:"write-only",format:"rgba32float"}},{binding:2,visibility:x,storageTexture:{access:"write-only",format:"rgba32float"}}]}),this.bglFft=e.createBindGroupLayout({entries:[{binding:0,visibility:x,buffer:{type:"uniform"}},{binding:1,visibility:x,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:2,visibility:x,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:3,visibility:x,storageTexture:{access:"write-only",format:"rgba32float"}},{binding:4,visibility:x,storageTexture:{access:"write-only",format:"rgba32float"}}]}),this.bglPack=e.createBindGroupLayout({entries:[{binding:0,visibility:x,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:1,visibility:x,storageTexture:{access:"read-only",format:"rgba32float"}},{binding:2,visibility:x,storageTexture:{access:"write-only",format:"rgba16float"}}]}),this.bglSsr=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,texture:_},{binding:2,visibility:b,texture:_},{binding:3,visibility:b,texture:{sampleType:"depth"}},{binding:4,visibility:b,texture:_},{binding:5,visibility:b,sampler:{type:"filtering"}},{binding:6,visibility:b,texture:{sampleType:"float",viewDimension:"3d"}}]}),this.bglRefl=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,texture:_},{binding:2,visibility:b,texture:_},{binding:3,visibility:b,texture:_},{binding:4,visibility:b,texture:{sampleType:"depth"}},{binding:5,visibility:b,sampler:{type:"filtering"}}]}),this.bglTaa=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,texture:_},{binding:2,visibility:b,texture:{sampleType:"depth"}},{binding:3,visibility:b,sampler:{type:"filtering"}}]}),this.bglExp=e.createBindGroupLayout({entries:[{binding:0,visibility:x,texture:_},{binding:1,visibility:x,buffer:{type:"storage"}},{binding:2,visibility:x,buffer:{type:"uniform"}}]}),this.bglBloom0=e.createBindGroupLayout({entries:[{binding:0,visibility:b,buffer:{type:"uniform"}},{binding:1,visibility:b,buffer:{type:"uniform"}}]}),this.bglBloom1=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,sampler:{type:"filtering"}},{binding:2,visibility:b,buffer:{type:"read-only-storage"}}]}),this.bglTonemap=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,texture:_},{binding:2,visibility:b,buffer:{type:"read-only-storage"}},{binding:3,visibility:b,sampler:{type:"filtering"}},{binding:4,visibility:b,texture:{sampleType:"float",viewDimension:"3d"}}]}),this.bglFogInject=e.createBindGroupLayout({entries:[{binding:0,visibility:x,buffer:{type:"read-only-storage"}},{binding:1,visibility:x,buffer:{type:"read-only-storage"}},{binding:2,visibility:x,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"3d"}}]}),this.bglFogIntegrate=e.createBindGroupLayout({entries:[{binding:0,visibility:x,texture:{sampleType:"float",viewDimension:"3d"}},{binding:1,visibility:x,storageTexture:{access:"write-only",format:"rgba16float",viewDimension:"3d"}}]}),this.bglDecals=e.createBindGroupLayout({entries:[{binding:0,visibility:b,texture:_},{binding:1,visibility:b,texture:_},{binding:2,visibility:b,texture:_},{binding:3,visibility:b,texture:{sampleType:"depth"}},{binding:4,visibility:b,buffer:{type:"read-only-storage"}}]}),this.bglMeshAfter();const f={arrayStride:32,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x3"},{shaderLocation:2,offset:24,format:"float32x2"}]},M={arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:"float32x3"}]},S=(R,U,O)=>({module:R,entryPoint:U,targets:O}),T=R=>({vertex:{module:R,entryPoint:"vs_fs"}});this.pShadow=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglMesh]}),vertex:{module:t,entryPoint:"vs_shadow",buffers:[f]},depthStencil:{format:"depth24plus",depthWriteEnabled:!0,depthCompare:"less"}}),this.pGbuffer=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglMesh]}),vertex:{module:i,entryPoint:"vs_mesh",buffers:[f]},fragment:S(i,"fs_gbuffer",[{format:"rgba8unorm"},{format:"rgba16float"},{format:"rgba8unorm"}]),depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less"},primitive:{cullMode:"back"}}),this.pCull=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglCull]}),compute:{module:s,entryPoint:"cullMain"}}),this.pSsao=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsao]}),...T(r),fragment:S(r,"fs_ssao",[{format:"r8unorm"}])}),this.pBlur=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglBlur]}),...T(u),fragment:S(u,"fs_aoBlur",[{format:"r8unorm"}])}),this.pLighting=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglLighting]}),...T(c),fragment:S(c,"fs_lighting",[{format:"rgba16float"}])}),this.pTaa=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTaa]}),...T(m),fragment:S(m,"fs_taa",[{format:"rgba16float"}])}),this.pSsr=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglSsr]}),...T(p),fragment:S(p,"fs_ssr",[{format:"rgba16float"}])}),this.pRefl=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglRefl]}),...T(o),fragment:S(o,"fs_refl",[{format:"rgba16float"}])});const C=new URLSearchParams(location.search).get("odepth")==="0",F=new URLSearchParams(location.search).get("obgl")==="0";this.pOcean=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:F?[this.bglGlobal]:[this.bglGlobal,this.bglOcean]}),vertex:{module:a,entryPoint:"vs_ocean",buffers:[M]},fragment:S(a,"fs_ocean",[{format:"rgba16float"}]),...C?{}:{depthStencil:{format:"depth32float",depthWriteEnabled:!1,depthCompare:"less"}},primitive:{cullMode:"none"}}),this.pGen=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGen]}),compute:{module:d,entryPoint:"genSpectrum"}}),this.pFft=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglFft]}),compute:{module:l,entryPoint:"fftPass"}}),this.pPack=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglPack]}),compute:{module:y,entryPoint:"packDisp"}}),this.pExpAccum=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:w,entryPoint:"expAccum"}}),this.pExpFinal=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglExp]}),compute:{module:w,entryPoint:"expFinal"}});const E={color:{srcFactor:"one",dstFactor:"one",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one",operation:"add"}};this.pBloomPre=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...T(D),fragment:S(D,"fs_bloomPrefilter",[{format:"rgba16float"}])}),this.pBloomDown=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...T(D),fragment:S(D,"fs_bloomDown",[{format:"rgba16float"}])}),this.pBloomUp=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglBloom0,this.bglBloom1]}),...T(D),fragment:S(D,"fs_bloomUp",[{format:"rgba16float",blend:E}])}),this.pTonemap=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglTonemap]}),...T(z),fragment:S(z,"fs_tonemap",[{format:this.ctx.format}])}),this.pFogInject=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglFogInject]}),compute:{module:k,entryPoint:"fogInject"}}),this.pFogIntegrate=e.createComputePipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglFogIntegrate]}),compute:{module:g,entryPoint:"fogIntegrate"}}),this.pDecals=e.createRenderPipeline({layout:e.createPipelineLayout({bindGroupLayouts:[this.bglGlobal,this.bglDecals]}),...T(B),fragment:S(B,"fs_decals",[{format:"rgba8unorm"},{format:"rgba16float"},{format:"rgba8unorm"}])})}module(e){return this.dev.createShaderModule({code:e})}initFft(){const e=this.dev,i=256,t=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING,s=()=>{const l=e.createTexture({size:[i,i],format:"rgba32float",usage:t});return[l,l.createView()]},[r,u]=s(),[c,p]=s(),[o,h]=s(),[v,a]=s();this.fftA0View=u,this.fftA1View=p,this.fftB0View=h,this.fftB1View=a,this._fftTex=[r,c,o,v];const d=e.createTexture({size:[i,i],format:"rgba16float",usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.COPY_SRC});this._dispTex=d,this.dispView=d.createView(),e.queue.writeTexture({texture:d},new Float32Array(i*i*4),{bytesPerRow:i*8,rowsPerImage:i},[i,i]),this.bgGen=e.createBindGroup({layout:this.bglGen,entries:[{binding:0,resource:{buffer:this.frameBuf}},{binding:1,resource:this.fftA0View},{binding:2,resource:this.fftB0View}]}),this.fftPassBufs=[],this.bgFft=[];for(let l=0;l<16;l++){const y=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(y,new Float32Array([1<<l%8,l<8?1:0,0,0])),this.fftPassBufs.push(y);const m=l%2===0?this.fftA0View:this.fftA1View,w=l%2===0?this.fftA1View:this.fftA0View,D=l%2===0?this.fftB0View:this.fftB1View,z=l%2===0?this.fftB1View:this.fftB0View;this.bgFft.push(e.createBindGroup({layout:this.bglFft,entries:[{binding:0,resource:{buffer:y}},{binding:1,resource:m},{binding:2,resource:D},{binding:3,resource:w},{binding:4,resource:z}]}))}this.bgPack=e.createBindGroup({layout:this.bglPack,entries:[{binding:0,resource:this.fftA0View},{binding:1,resource:this.fftB0View},{binding:2,resource:this.dispView}]})}bakeLut(){const e=this.dev,i=32,t=o=>Math.min(1,Math.max(0,o)),s=new Uint8Array(i*i*i*4),r=1.055,u=1.07,c=[.9,.96,1.08],p=[1.06,1,.92];for(let o=0;o<i;o++)for(let h=0;h<i;h++)for(let v=0;v<i;v++){const a=((o*i+h)*i+v)*4;let d=[Math.pow((v+.5)/i,1/2.2),Math.pow((h+.5)/i,1/2.2),Math.pow((o+.5)/i,1/2.2)];const l=.2126*d[0]+.7152*d[1]+.0722*d[2];d=d.map(w=>t((w-.5)*r+.5)),d=d.map(w=>t(l+(w-l)*u));const y=1-t((l-.35)/.4),m=t((l-.45)/.35);d=d.map((w,D)=>t(w+(c[D]-1)*y*.055+(p[D]-1)*m*.055)),s[a]=d[0]*255,s[a+1]=d[1]*255,s[a+2]=d[2]*255,s[a+3]=255}this.lutTex=e.createTexture({size:[i,i,i],dimension:"3d",format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}),e.queue.writeTexture({texture:this.lutTex},s,{bytesPerRow:i*4,rowsPerImage:i},[i,i,i]),this.lutView=this.lutTex.createView({dimension:"3d"})}setTier(e){this.tierIndex=Math.max(0,Math.min(ue.length-1,e)),this.toggles.taa=this.tier.taa,this.toggles.ssao=this.tier.ssao,this.toggles.ssr=this.tier.ssr,this.rebuildOcean(),this.W=0,this.rebuildTargets()}resize(){this.W=0,this.rebuildTargets()}rebuildTargets(){const e=this.dev,i=Math.min(window.devicePixelRatio||1,2),t=Math.max(2,Math.floor(this.canvas.clientWidth*i)),s=Math.max(2,Math.floor(this.canvas.clientHeight*i));if(t===this.W&&s===this.H)return;this.W=t,this.H=s,this.canvas.width=t,this.canvas.height=s;const[r,u,c]=this.volDims(),p=this._volSize,o=`${r}x${u}x${c}`;if(p!==o||!this.volFogAView){const P=this._volTex;P&&P.forEach(M=>M.destroy());const x=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING,_=e.createTexture({size:[r,u,c],dimension:"3d",format:"rgba16float",usage:x}),f=e.createTexture({size:[r,u,c],dimension:"3d",format:"rgba16float",usage:x});this._volTex=[_,f],this.volFogAView=_.createView({dimension:"3d"}),this.volFogBView=f.createView({dimension:"3d"}),this._volSize=o}this.graph.reset(!0);const h=GPUTextureUsage.RENDER_ATTACHMENT,v=GPUTextureUsage.TEXTURE_BINDING,a=GPUTextureUsage.COPY_SRC,d=GPUTextureUsage.COPY_DST,l=h|v|a|d,y=Math.ceil(t/2),m=Math.ceil(s/2);this.atlas=Math.min(this.tier.shadowAtlas,this.ctx.maxTextureDim),this.g0View=this.graph.texture("g0",{width:t,height:s,format:"rgba8unorm",usage:l}),this.g1View=this.graph.texture("g1",{width:t,height:s,format:"rgba16float",usage:l}),this.g2View=this.graph.texture("g2",{width:t,height:s,format:"rgba8unorm",usage:l}),this.g0mView=this.graph.texture("g0m",{width:t,height:s,format:"rgba8unorm",usage:l}),this.g1mView=this.graph.texture("g1m",{width:t,height:s,format:"rgba16float",usage:l}),this.g2mView=this.graph.texture("g2m",{width:t,height:s,format:"rgba8unorm",usage:l}),this.depthView=this.graph.texture("depth",{width:t,height:s,format:"depth32float",usage:l}),this.hdrAView=this.graph.texture("hdrA",{width:t,height:s,format:"rgba16float",usage:l}),this.hdrA2View=this.graph.texture("hdrA2",{width:t,height:s,format:"rgba16float",usage:l}),this.ssrHalfView=this.graph.texture("ssrHalf",{width:y,height:m,format:"rgba16float",usage:l}),this.hdrBView=this.graph.texture("hdrB",{width:t,height:s,format:"rgba16float",usage:l}),this.hdrCView=this.graph.texture("hdrC",{width:t,height:s,format:"rgba16float",usage:l}),this.historyView=this.graph.texture("history",{width:t,height:s,format:"rgba16float",usage:v|GPUTextureUsage.COPY_DST|a}),this.shadowView=this.graph.texture("shadowAtlas",{width:this.atlas,height:this.atlas,format:"depth24plus",usage:l}),this.aoHalfView=this.graph.texture("aoHalf",{width:y,height:m,format:"r8unorm",usage:l}),this.aoHalf2View=this.graph.texture("aoHalf2",{width:y,height:m,format:"r8unorm",usage:l}),this.bloomViews=[];let w=y,D=m;for(let P=0;P<ce;P++){const x=this.graph.texture(`bloom${P}`,{width:Math.max(w,2),height:Math.max(D,2),format:"rgba16float",usage:l});this.bloomViews.push(x),w=Math.max(w>>1,2),D=Math.max(D>>1,2)}const z=Math.ceil(t/16),k=Math.ceil(s/16);this.gridCountsBuf?.destroy(),this.gridIndicesBuf?.destroy(),this.gridCountsBuf=e.createBuffer({size:z*k*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.gridIndicesBuf=e.createBuffer({size:z*k*yt*4,usage:GPUBufferUsage.STORAGE}),this.zerobuffer=new Uint32Array(z*k);for(const P of this.destBufs)P.destroy();this.destBufs=[],w=y,D=m;for(let P=0;P<ce;P++){const x=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.put(x,new Float32Array([w,D,1/w,1/D])),this.destBufs.push(x),w=Math.max(w>>1,2),D=Math.max(D>>1,2)}const g=e.createSampler({magFilter:"linear",minFilter:"linear"});this.smpRep=e.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"repeat",addressModeV:"repeat"}),this.bgGlobal=e.createBindGroup({layout:this.bglGlobal,entries:[{binding:0,resource:{buffer:this.camBuf}},{binding:1,resource:{buffer:this.frameBuf}},{binding:2,resource:this.shadowView},{binding:3,resource:e.createSampler({compare:"less"})},{binding:4,resource:this.skyLutView},{binding:5,resource:g}]}),this.bgCull=e.createBindGroup({layout:this.bglCull,entries:[{binding:0,resource:{buffer:this.lightsBuf}},{binding:1,resource:{buffer:this.gridCountsBuf}},{binding:2,resource:{buffer:this.gridIndicesBuf}},{binding:3,resource:this.depthView},{binding:4,resource:{buffer:this.camBuf}},{binding:5,resource:{buffer:this.frameBuf}}]}),this.bgSsao=e.createBindGroup({layout:this.bglSsao,entries:[{binding:0,resource:this.depthView},{binding:1,resource:this.g1View}]}),this.bgBlur=e.createBindGroup({layout:this.bglBlur,entries:[{binding:0,resource:this.aoHalfView},{binding:1,resource:g}]});const B=P=>[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:P},{binding:5,resource:{buffer:this.lightsBuf}},{binding:6,resource:{buffer:this.gridCountsBuf}},{binding:7,resource:{buffer:this.gridIndicesBuf}},{binding:8,resource:{buffer:this.probesBuf}},{binding:9,resource:this.volFogBView},{binding:10,resource:this.skyLutView},{binding:11,resource:g}];this.bgLightingAo=e.createBindGroup({layout:this.bglLighting,entries:B(this.aoHalf2View)}),this.bgLightingWhite=e.createBindGroup({layout:this.bglLighting,entries:B(this.whiteView)}),this.bgSsr=e.createBindGroup({layout:this.bglSsr,entries:[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:this.hdrAView},{binding:5,resource:g},{binding:6,resource:this.skyLutView}]}),this.bgRefl=e.createBindGroup({layout:this.bglRefl,entries:[{binding:0,resource:this.hdrAView},{binding:1,resource:this.ssrHalfView},{binding:2,resource:this.g1View},{binding:3,resource:this.g2View},{binding:4,resource:this.depthView},{binding:5,resource:g}]}),this.bgOcean=e.createBindGroup({layout:this.bglOcean,entries:[{binding:0,resource:this.hdrBView},{binding:1,resource:this.depthView},{binding:2,resource:g},{binding:3,resource:this.dispView},{binding:4,resource:this.smpRep},{binding:5,resource:this.skyLutView},{binding:6,resource:this.volFogBView}]}),this.bgFogInject=e.createBindGroup({layout:this.bglFogInject,entries:[{binding:0,resource:{buffer:this.volumeBuf}},{binding:1,resource:{buffer:this.lightsBuf}},{binding:2,resource:this.volFogAView}]}),this.bgFogIntegrate=e.createBindGroup({layout:this.bglFogIntegrate,entries:[{binding:0,resource:this.volFogAView},{binding:1,resource:this.volFogBView}]}),this.bgDecals=e.createBindGroup({layout:this.bglDecals,entries:[{binding:0,resource:this.g0View},{binding:1,resource:this.g1View},{binding:2,resource:this.g2View},{binding:3,resource:this.depthView},{binding:4,resource:{buffer:this.decalBuf}}]}),this.bgTaa=e.createBindGroup({layout:this.bglTaa,entries:[{binding:0,resource:this.hdrA2View},{binding:1,resource:this.historyView},{binding:2,resource:this.depthView},{binding:3,resource:g}]}),this.bgExp=e.createBindGroup({layout:this.bglExp,entries:[{binding:0,resource:this.hdrCView},{binding:1,resource:{buffer:this.statsBuf}},{binding:2,resource:{buffer:this.frameBuf}}]}),this.bloomPasses=[],this.bgBloom=[],this.bloomPasses.push({kind:"pre",src:this.hdrCView,dst:this.bloomViews[0],mip:0});for(let P=1;P<ce;P++)this.bloomPasses.push({kind:"down",src:this.bloomViews[P-1],dst:this.bloomViews[P],mip:P});for(let P=ce-2;P>=0;P--)this.bloomPasses.push({kind:"up",src:this.bloomViews[P+1],dst:this.bloomViews[P],mip:P});this.bloomPasses.forEach(P=>{const x=e.createBindGroup({layout:this.bglBloom0,entries:[{binding:0,resource:{buffer:this.frameBuf}},{binding:1,resource:{buffer:this.destBufs[P.mip]}}]}),_=e.createBindGroup({layout:this.bglBloom1,entries:[{binding:0,resource:P.src},{binding:1,resource:g},{binding:2,resource:{buffer:this.statsBuf}}]});this.bgBloom.push([x,_])});const b=P=>[{binding:0,resource:this.hdrCView},{binding:1,resource:P},{binding:2,resource:{buffer:this.statsBuf}},{binding:3,resource:g},{binding:4,resource:this.lutView}];this.bgTonemapBloom=e.createBindGroup({layout:this.bglTonemap,entries:b(this.bloomViews[0])}),this.bgTonemapBlack=e.createBindGroup({layout:this.bglTonemap,entries:b(this.blackView)})}passFilter=null;want(e){return!this.passFilter||this.passFilter.has(e)}render(e){const i=this.dev,t=performance.now(),s=this.W,r=this.H;if(s<4||r<4)return;this.graph.beginFrame();const u=this.camera;u.jitterEnabled=this.toggles.taa,this.uniforms.taaOn=this.toggles.taa?1:0,u.update(s/r),this.uniforms.updateSun(),this.uniforms.updateCascades(u);const c=Math.ceil(s/16),p=Math.ceil(r/16);this.uniforms.pack(u,s,r,e/1e3,this.scene.lights.length,this.uniforms.cascadeTexelWorld(),1/this.atlas,1.6,c,p,this.scene.waterLevel,4200,-22,2),this.put(this.camBuf,this.uniforms.camData),this.put(this.frameBuf,this.uniforms.frameData);for(let a=0;a<4;a++)this.put(this.cascadeBuf[a],this.uniforms.cascadeData[a]);this.put(this.gridCountsBuf,this.zerobuffer),this.uniforms.lutOn=this.toggles.lut?1:0,this.uniforms.ssrOn=this.toggles.ssr&&this.tier.ssr?1:0,this.uniforms.giOn=this.toggles.gi?1:0,this.uniforms.fftOn=this.toggles.fft&&this.tier.fft?1:0,this.uniforms.causticsOn=this.toggles.caus?1:0,this.uniforms.volFogOn=this.toggles.volfog&&this.tier.volfog?1:0,this.uniforms.layersMode=this.toggles.layers?1:0,this.uniforms.cookieStrength=this.toggles.cookie?1:0,this.uniforms.skyLutOn=this.toggles.sky?1:0,this.uniforms.bakeProbes(),this.put(this.probesBuf,this.uniforms.probeData);const o=i.createCommandEncoder();if(this.want("shadow")){const a=o.beginRenderPass({colorAttachments:[],depthStencilAttachment:{view:this.shadowView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});a.setPipeline(this.pShadow),a.setVertexBuffer(0,this.sceneVB),a.setIndexBuffer(this.sceneIB,"uint32");const d=this.atlas/2;for(let l=0;l<4;l++){a.setViewport((l&1)*d,(l>>1)*d,d,d,0,1),a.setScissorRect((l&1)*d,(l>>1)*d,d,d),a.setBindGroup(0,this.bgCascade[l]);for(const y of this.scene.groups)a.drawIndexed(y.count,1,y.firstIndex)}a.end()}if(this.want("gbuffer")){const a=o.beginRenderPass({colorAttachments:[{view:this.g0View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g1View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g2View,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this.depthView,depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});a.setPipeline(this.pGbuffer),a.setBindGroup(0,this.bgGlobal),a.setVertexBuffer(0,this.sceneVB),a.setIndexBuffer(this.sceneIB,"uint32"),this.scene.groups.forEach((d,l)=>{a.setBindGroup(1,this.bgMesh[l]),a.drawIndexed(d.count,1,d.firstIndex)}),a.end()}if(this.want("decals")&&this.toggles.decals){const a=o.beginRenderPass({colorAttachments:[{view:this.g0mView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g1mView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"},{view:this.g2mView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});a.setPipeline(this.pDecals),a.setBindGroup(0,this.bgGlobal),a.setBindGroup(1,this.bgDecals),a.draw(3),a.end(),o.copyTextureToTexture({texture:this.graphTexture("g0m")},{texture:this.graphTexture("g0")},[s,r,1]),o.copyTextureToTexture({texture:this.graphTexture("g1m")},{texture:this.graphTexture("g1")},[s,r,1]),o.copyTextureToTexture({texture:this.graphTexture("g2m")},{texture:this.graphTexture("g2")},[s,r,1])}if(this.want("cull")){const a=o.beginComputePass();a.setPipeline(this.pCull),a.setBindGroup(0,this.bgCull),a.dispatchWorkgroups(c,p),a.end()}if(this.want("volfog")&&this.uniforms.volFogOn>0){const[a,d,l]=this.volDims(),y=o.beginComputePass();y.setPipeline(this.pFogInject),y.setBindGroup(0,this.bgGlobal),y.setBindGroup(1,this.bgFogInject),y.dispatchWorkgroups(Math.ceil(a/8),Math.ceil(d/8),Math.ceil(l/4)),y.setPipeline(this.pFogIntegrate),y.setBindGroup(0,this.bgGlobal),y.setBindGroup(1,this.bgFogIntegrate),y.dispatchWorkgroups(Math.ceil(a/8),Math.ceil(d/8)),y.end()}const h=this.want("ssao")&&this.toggles.ssao&&this.tier.ssao;if(h){const a=Math.ceil(s/2),d=Math.ceil(r/2),l=o.beginRenderPass({colorAttachments:[{view:this.aoHalfView,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});l.setPipeline(this.pSsao),l.setBindGroup(0,this.bgGlobal),l.setBindGroup(1,this.bgSsao),l.setViewport(0,0,a,d,0,1),l.draw(3),l.end();const y=o.beginRenderPass({colorAttachments:[{view:this.aoHalf2View,clearValue:{r:1,g:1,b:1,a:1},loadOp:"clear",storeOp:"store"}]});y.setPipeline(this.pBlur),y.setBindGroup(0,this.bgGlobal),y.setBindGroup(1,this.bgBlur),y.setViewport(0,0,a,d,0,1),y.draw(3),y.end()}if(this.want("lighting")){const a=o.beginRenderPass({colorAttachments:[{view:this.hdrAView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});a.setPipeline(this.pLighting),a.setBindGroup(0,this.bgGlobal),a.setBindGroup(1,h?this.bgLightingAo:this.bgLightingWhite),a.draw(3),a.end()}if(this.want("ssr")&&this.toggles.ssr&&this.tier.ssr){const a=Math.ceil(s/2),d=Math.ceil(r/2),l=o.beginRenderPass({colorAttachments:[{view:this.ssrHalfView,clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});l.setPipeline(this.pSsr),l.setBindGroup(0,this.bgGlobal),l.setBindGroup(1,this.bgSsr),l.setViewport(0,0,a,d,0,1),l.draw(3),l.end()}if(this.want("refl")){const a=o.beginRenderPass({colorAttachments:[{view:this.hdrA2View,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});a.setPipeline(this.pRefl),a.setBindGroup(0,this.bgGlobal),a.setBindGroup(1,this.bgRefl),a.draw(3),a.end()}if(this.want("taa")){const a=o.beginRenderPass({colorAttachments:[{view:this.hdrBView,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});a.setPipeline(this.pTaa),a.setBindGroup(0,this.bgGlobal),a.setBindGroup(1,this.bgTaa),a.draw(3),a.end(),o.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("history")},[s,r,1])}if(o.copyTextureToTexture({texture:this.graphTexture("hdrB")},{texture:this.graphTexture("hdrC")},[s,r,1]),this.frameNo++,this.uniforms.fftOn>0&&this.frameNo%this.fftDiv===0&&this.want("fft")){const a=o.beginComputePass();a.setPipeline(this.pGen),a.setBindGroup(0,this.bgGen),a.dispatchWorkgroups(32,32),a.setPipeline(this.pFft);for(let d=0;d<16;d++)a.setBindGroup(0,this.bgFft[d]),a.dispatchWorkgroups(32,32);a.setPipeline(this.pPack),a.setBindGroup(0,this.bgPack),a.dispatchWorkgroups(32,32),a.end()}if(this.want("ocean")&&this.toggles.ocean){const a=new URLSearchParams(location.search).get("odepth")==="0",d=new URLSearchParams(location.search).get("oload")!=="clear",l=o.beginRenderPass({colorAttachments:[{view:this.hdrCView,loadOp:d?"load":"clear",clearValue:{r:0,g:0,b:0,a:1},storeOp:"store"}],...a?{}:{depthStencilAttachment:{view:this.depthView,depthReadOnly:!0}}});l.setPipeline(this.pOcean),l.setBindGroup(0,this.bgGlobal),new URLSearchParams(location.search).get("obgl")!=="0"&&l.setBindGroup(1,this.bgOcean),l.setVertexBuffer(0,this.oceanNearVB),l.setIndexBuffer(this.oceanNearIB,"uint32"),l.drawIndexed(this.oceanNearCount),new URLSearchParams(location.search).get("ofar")!=="0"&&(l.setVertexBuffer(0,this.oceanFarVB),l.setIndexBuffer(this.oceanFarIB,"uint32"),l.drawIndexed(this.oceanFarCount)),l.end()}if(this.want("exposure")){const a=o.beginComputePass();a.setPipeline(this.pExpAccum),a.setBindGroup(0,this.bgExp),a.dispatchWorkgroups(Math.ceil(s/4/8),Math.ceil(r/4/8)),a.setPipeline(this.pExpFinal),a.dispatchWorkgroups(1,1,1),a.end()}if(this.want("bloom")&&this.toggles.bloom&&this.bloomPasses.forEach((a,d)=>{const l=a.kind==="pre"?this.pBloomPre:a.kind==="down"?this.pBloomDown:this.pBloomUp,y=Math.max(Math.ceil(s/2)>>a.mip,2),m=Math.max(Math.ceil(r/2)>>a.mip,2),w=o.beginRenderPass({colorAttachments:[{view:a.dst,clearValue:{r:0,g:0,b:0,a:1},loadOp:a.kind==="up"?"load":"clear",storeOp:"store"}]});w.setPipeline(l),w.setBindGroup(0,this.bgBloom[d][0]),w.setBindGroup(1,this.bgBloom[d][1]),w.setViewport(0,0,y,m,0,1),w.draw(3),w.end()}),this.want("tonemap")){const d=new URLSearchParams(location.search).get("ttex")==="1"?this.graph.texture("tonemapTex",{width:s,height:r,format:this.ctx.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}):this.ctx.context.getCurrentTexture().createView(),l=o.beginRenderPass({colorAttachments:[{view:d,clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}]});l.setPipeline(this.pTonemap),l.setBindGroup(0,this.bgGlobal),l.setBindGroup(1,this.toggles.bloom?this.bgTonemapBloom:this.bgTonemapBlack),l.setViewport(0,0,s,r,0,1),l.draw(3),l.end()}i.queue.submit([o.finish()]),this.lastFrameCpuMs=performance.now()-t,window.__FRAME_N__=window.__FRAME_N__===void 0?performance.now()/1e3:window.__FRAME_N__}async debugSnapshot(e,i,t=0,s=0){const r=this.dev,u=Math.min(e??this.W,this.W),c=Math.min(i??this.H,this.H),p=this.graphTexture("tonemapTex"),o=Math.ceil(u*4/256)*256,h=r.createBuffer({size:o*c,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),v=r.createCommandEncoder();v.copyTextureToBuffer({texture:p,origin:[t,s,0]},{buffer:h,bytesPerRow:o,rowsPerImage:c},[u,c,1]),r.queue.submit([v.finish()]),await h.mapAsync(GPUMapMode.READ);const a=new Uint8Array(h.getMappedRange()),d=new Uint8Array(u*c*4);for(let l=0;l<c;l++)for(let y=0;y<u;y++){const m=l*o+y*4,w=l*u*4+y*4;d[w]=a[m+2],d[w+1]=a[m+1],d[w+2]=a[m],d[w+3]=255}return h.unmap(),h.destroy(),{w:u,h:c,rgba:d}}async debugRow(e,i,t,s,r=16){const u=this.dev,c=[];for(let m=t;m<=s;m+=r)c.push(Math.min(m,this.W-1));const p=c.length,o=256,h=this.graphTexture(e),v=u.createBuffer({size:o*p,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),a=u.createCommandEncoder();c.forEach((m,w)=>{a.copyTextureToBuffer({texture:h,origin:[m,Math.min(i,this.H-1),0]},{buffer:v,offset:w*o,bytesPerRow:o,rowsPerImage:1},[1,1,1])}),u.queue.submit([a.finish()]),await v.mapAsync(GPUMapMode.READ);const d=new Uint8Array(v.getMappedRange()),l=(m,w)=>{const D=m|w<<8,z=(D&32768)>>15,k=(D&31744)>>10,g=D&1023;let B;return k===0?B=g*2**-24:k===31?B=g?NaN:1/0:B=(1+g/1024)*2**(k-15),(z?-1:1)*B},y={x:c};for(let m=0;m<p;m++){const w=m*o;y[`p${m}`]=[l(d[w],d[w+1]),l(d[w+2],d[w+3])]}return v.unmap(),v.destroy(),y}async debugSample(){const e=this.dev,i=this.W,t=this.H,s=[["g0",this.graphTexture("g0"),i>>1,t>>1,"all"],["hdrA_c",this.graphTexture("hdrA"),i>>1,t>>1,"all"],["hdrA_q",this.graphTexture("hdrA"),i>>2,t>>1,"all"],["hdrA_3q",this.graphTexture("hdrA"),3*i>>2,3*t>>2,"all"],["hdrA_sky",this.graphTexture("hdrA"),i>>1,Math.max(2,t*.08|0),"all"],["hdrC_c",this.graphTexture("hdrC"),i>>1,t>>1,"all"]],r=e.createCommandEncoder(),u={};for(const[p,o,h,v,a]of s)u[p]=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),r.copyTextureToBuffer({texture:o,origin:[h,v,0],aspect:a},{buffer:u[p],bytesPerRow:256,rowsPerImage:1},[1,1,1]);e.queue.submit([r.finish()]);const c={};for(const[p]of s){await u[p].mapAsync(GPUMapMode.READ);const o=new Uint8Array(u[p].getMappedRange());c[p]=Array.from(o.slice(0,8)),u[p].unmap(),u[p].destroy()}return c}forceEv(e){this.dev.queue.writeBuffer(this.statsBuf,256,new Float32Array([e]))}async debugDisp(){const e=this.dev,i=64,t=8,s=Math.ceil(i*8/256)*256,r=e.createBuffer({size:s*t,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),u=e.createCommandEncoder();u.copyTextureToBuffer({texture:this._dispTex,origin:[0,0,0]},{buffer:r,bytesPerRow:s,rowsPerImage:t},[i,t,1]),e.queue.submit([u.finish()]),await r.mapAsync(GPUMapMode.READ);const c=new Uint8Array(r.getMappedRange()),p=new DataView(c.buffer),o=y=>{const m=p.getUint16(y,!0),w=(m&32768)>>15,D=(m&31744)>>10,z=m&1023;let k;return D===0?k=z*2**-24:D===31?k=z?NaN:1/0:k=(1+z/1024)*2**(D-15),(w?-1:1)*k};let h=1e9,v=-1e9,a=0,d=0,l=0;for(let y=0;y<t;y++)for(let m=0;m<i;m++){const w=y*s+m*8,D=o(w),z=o(w+2),k=o(w+4);h=Math.min(h,z),v=Math.max(v,z),a+=z*z,d=Math.max(d,Math.abs(D),Math.abs(k)),l++}return r.unmap(),r.destroy(),{hMin:h,hMax:v,hRms:Math.sqrt(a/Math.max(l,1)),dMax:d}}async readStats(){const e=this.dev,i=e.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),t=e.createCommandEncoder();t.copyBufferToBuffer(this.statsBuf,256,i,0,12),e.queue.submit([t.finish()]),await i.mapAsync(GPUMapMode.READ);const s=new Float32Array(i.getMappedRange()),r={ev:s[0],avg:s[1]};return i.unmap(),i.destroy(),r}graphTexture(e){const i=this.graph.resources.get(e);if(!i||!i.texture)throw new Error(`graph texture ${e} missing`);return i.texture}}function Lt(n,e,i,t){const s=x=>document.getElementById(x),u=[...s("tier-seg").querySelectorAll("button")],c=()=>{u.forEach(x=>x.classList.toggle("active",Number(x.dataset.tier)===n.tierIndex)),s("hud-tier").textContent=`tier · ${ue[n.tierIndex].name}`};u.forEach(x=>x.addEventListener("click",()=>{n.setTier(Number(x.dataset.tier)),s("tg-ssao").checked=n.toggles.ssao,s("tg-taa").checked=n.toggles.taa,s("tg-ssr").checked=n.toggles.ssr,c()})),c();const p=(x,_,f,M)=>{const S=s(x),T=s(_),C=()=>{const F=Number(S.value);M(F),T.textContent=f(F)};S.addEventListener("input",C),C()};p("sun-el","val-sun-el",x=>`${x}°`,x=>{n.uniforms.sunElevation=x}),p("sun-az","val-sun-az",x=>`${x}°`,x=>{n.uniforms.sunAzimuth=x}),p("ev-bias","val-ev",x=>x.toFixed(1),x=>{n.uniforms.evBias=x}),p("fog-dens","val-fog",x=>x.toFixed(2),x=>{n.uniforms.fogScale=x});const o=(x,_)=>{const f=s(x);f.checked=n.toggles[_],f.addEventListener("change",()=>{n.toggles[_]=f.checked})};o("tg-ssao","ssao"),o("tg-taa","taa"),o("tg-bloom","bloom"),o("tg-ocean","ocean"),o("tg-ssr","ssr"),o("tg-lut","lut"),o("tg-gi","gi"),o("tg-fft","fft"),o("tg-caus","caus"),o("tg-fog","volfog"),o("tg-decals","decals"),o("tg-layers","layers"),o("tg-sky","sky"),o("tg-cookie","cookie");const h=s("tg-wire");h.addEventListener("change",()=>{n.uniforms.debugMode=h.checked?1:0});const v=s("shots");n.uniforms;const a=n.camera,d=window.__SHOTS__??[];let l=-1,y={eye:[0,0,0],look:[0,0,0]};window.__CAM_ANIM__=(x,_)=>{y=_,l=0},d.forEach((x,_)=>{const f=document.createElement("button");f.textContent=`${_+1}. ${x.name}`,f.title=`Точка съёмки ${_+1}`,f.addEventListener("click",()=>{document.exitPointerLock?.();const M={eye:a.eye(),look:a.lookAtPoint()};window.__CAM_ANIM__?.(M,{eye:x.eye,look:x.look})}),v.appendChild(f)}),window.__CAM_TICK__=x=>{l<0||(l=Math.min(l+x/1.4,1),a.animateTo(y,l),l>=1&&(l=-1))};const m=s("btn-fly"),w=()=>{m.textContent=t()?"Орбитальный режим":"Свободный полёт"};m.addEventListener("click",()=>{if(t())document.exitPointerLock?.();else{a.position=a.eye();const x=a.forwardOfView();a.flyYaw=Math.atan2(x[2],x[0]),a.flyPitch=Math.asin(Math.max(-1,Math.min(1,x[1]))),a.mode="fly",n.canvas.requestPointerLock?.()}w()}),document.addEventListener("pointerlockchange",()=>{!t()&&a.mode==="fly"&&(a.mode="orbit"),w()});const D=s("hud-panel"),z=s("hud-toggle"),k=x=>{D.classList.toggle("collapsed",x),z.style.display=x?"block":"none"};z.addEventListener("click",()=>k(!1)),document.addEventListener("keydown",x=>{(x.key==="h"||x.key==="H")&&k(!D.classList.contains("collapsed"))});const g=s("fps-graph"),B=g.getContext("2d"),b=[];let P=16.6;window.__FPS_TICK__=x=>{P=P*.9+x*.1,b.push(x),b.length>110&&b.shift(),B.clearRect(0,0,g.width,g.height),B.strokeStyle="rgba(242,106,27,0.35)",B.beginPath(),B.moveTo(0,g.height-16.6/40*g.height),B.lineTo(g.width,g.height-16.6/40*g.height),B.stroke(),B.strokeStyle="#F26A1B",B.beginPath(),b.forEach((_,f)=>{const M=f/109*g.width,S=g.height-Math.min(_/40,1)*g.height;f===0?B.moveTo(M,S):B.lineTo(M,S)}),B.stroke(),s("hud-fps").textContent=`${(1e3/Math.max(P,.01)).toFixed(0)} fps · ${P.toFixed(1)} ms`},e.adapter.textContent=n.adapterNameShort()}const Pt=document.getElementById("boot"),Tt=document.getElementById("boot-status"),St=document.getElementById("boot-bar-fill"),de=document.getElementById("boot-detail"),zt=document.getElementById("hud");function Z(n,e=-1,i=""){Tt.textContent=n,e>=0&&(St.style.width=`${Math.round(e*100)}%`),i&&(de.textContent+=(de.textContent?`
`:"")+i)}function Be(n,e){Z("Не удалось запустить WebGPU",1);const i=[n,"",e];de.textContent=i.join(`
`),de.style.color="#d89a55",window.__wgpu={status:"unsupported",error:n}}async function Dt(){const n=document.getElementById("gpu");Z("Запрос GPU-адаптера…",.1);let e;try{e=await Ne(n)}catch(f){Be(String(f.message??f),["Поддержка WebGPU:","· Chrome / Edge 113+ (Windows, macOS, ChromeOS)","· Firefox 141+ (Windows)","· Safari 26+ (macOS, iOS)","","Если браузер поддерживает — включите флаг или проверьте, что аппаратное ускорение активно."].join(`
`));return}Z("Компиляция пайплайнов…",.35,`адаптер: ${e.adapterName}`),console.log(`[boot] device ok @${(performance.now()/1e3).toFixed(2)}s`),Z("…",.4,`лимиты: maxTex2D=${e.limits.maxTextureDimension2D} storage=${(e.limits.maxStorageBufferBindingSize/(1<<20)).toFixed(0)} МБ`),We(e.device,f=>{console.error("[gpu]",f),window.__wgpu={status:"error",error:f},Z("Ошибка GPU",-1,f)}),console.log(`[boot] pre-scene @${(performance.now()/1e3).toFixed(2)}s`);const i=je();window.__SHOTS__=i.shots,console.log(`[boot] scene built @${(performance.now()/1e3).toFixed(2)}s`),window.__DEBUG__={groups:i.groups.map(f=>({matId:f.matId,tris:f.count/3})),verts:i.vertexData.length/8,tris:i.indexData.length/3,lights:i.lights.length,probes:i.probes.length};const t=new Bt(e,i);try{await t.init()}catch(f){console.error(f),Be(`Инициализация рендерера: ${String(f.message??f)}`,"Смотрите консоль (F12) для деталей.");return}const s=new URLSearchParams(location.search),r=s.get("tier"),u=s.get("only");if(u&&(t.passFilter=new Set(u.split(",").map(f=>f.trim()).filter(Boolean))),t.setTier(r?Number(r):2),s.has("notaa")){t.toggles.taa=!1;const f=document.getElementById("tg-taa");f&&(f.checked=!1)}if(s.has("taayes")){t.toggles.taa=!0;const f=document.getElementById("tg-taa");f&&(f.checked=!0)}const c=(f,M,S)=>{if(s.has(f)){t.toggles[M]=!1;const T=document.getElementById(S);T&&(T.checked=!1)}};c("nossr","ssr","tg-ssr"),c("nolut","lut","tg-lut"),c("gino","gi","tg-gi");const p=(f,M)=>{const S=document.getElementById(f);S&&(S.checked=M)};s.get("froxel")==="0"&&(t.toggles.volfog=!1),s.get("decals")==="0"&&(t.toggles.decals=!1),s.get("sky")==="0"&&(t.toggles.sky=!1),s.get("cookie")==="0"&&(t.toggles.cookie=!1),s.get("layers")==="1"&&(t.toggles.layers=!0);const o=s.get("sunel");if(o!==null){t.uniforms.sunElevation=Number(o);const f=document.getElementById("sun-el");f&&(f.value=o)}const h=s.get("sunaz");if(h!==null){t.uniforms.sunAzimuth=Number(h);const f=document.getElementById("sun-az");f&&(f.value=h)}s.has("tlock")&&(t.uniforms.timeLock=100.25),p("tg-fog",t.toggles.volfog),p("tg-decals",t.toggles.decals),p("tg-sky",t.toggles.sky),p("tg-cookie",t.toggles.cookie),p("tg-layers",t.toggles.layers),t.camera.target=[-8,2.2,0],t.camera.distance=30,t.camera.yaw=4.05,t.camera.pitch=.22,t.resize(),console.log(`[boot] renderer ready @${(performance.now()/1e3).toFixed(2)}s`),Z("Сцена собрана. Старт рендера…",1),Lt(t,{adapter:document.getElementById("hud-adapter"),fps:document.getElementById("hud-fps"),tier:document.getElementById("hud-tier")},()=>{},()=>document.pointerLockElement===n);const v=s.get("evbias");if(v!==null){const f=document.getElementById("ev-bias");f&&(f.value=v),t.uniforms.evBias=Number(v)}s.has("evlock")&&(t.uniforms.evLock=1);const a=s.get("dbg");if(a!==null){t.uniforms.debugMode=Number(a);const f=document.getElementById("tg-wire");f&&(f.checked=Number(a)===1)}window.__PROBE__=()=>t.debugSample(),window.__SNAPBUF__=async(f,M,S)=>{P=!0,await new Promise(T=>setTimeout(T,120));try{const T=Math.min(f??t.canvas.width,t.canvas.width),C=Math.min(M??t.canvas.height,t.canvas.height),F=new Uint8Array(T*C*4),E=320,R=180;let U=0;for(let G=0;G<C;G+=R)for(let N=0;N<T;N+=E){const X=Math.min(E,T-N),J=Math.min(R,C-G),ee=await t.debugSnapshot(X,J,N,G);for(let H=0;H<J;H++)F.set(ee.rgba.subarray(H*X*4,(H+1)*X*4),((G+H)*T+N)*4);console.log(`[snap] tile ${U++} ok`)}console.log("[snap] tiles done"),console.log("[snap] png start");let O="";const I=49152;for(let G=0;G<F.length;G+=I)O+=btoa(String.fromCharCode(...F.subarray(G,Math.min(G+I,F.length))));const W={w:T,h:C,b64:O};if(S){const G=document.createElement("canvas");G.width=T,G.height=C;const N=G.getContext("2d"),X=N.createImageData(T,C);X.data.set(F),N.putImageData(X,0,0),W.png=G.toDataURL("image/png").split(",")[1],console.log("[snap] png done")}return W}finally{P=!1}},window.__SET_DBG__=f=>{t.uniforms.debugMode=f},window.__PROBEDATA__=()=>Array.from(t.uniforms.probeData.slice(0,40)),window.__STATS__=()=>t.readStats(),window.__DISPSTAT__=()=>t.debugDisp(),window.__SAMPLES__=()=>t.debugSample(),window.__CAM_POSE__=(f,M)=>{const S=t.camera;S.target=M;const T=[f[0]-M[0],f[1]-M[1],f[2]-M[2]];S.distance=Math.max(2.2,Math.hypot(T[0],T[1],T[2])),S.yaw=Math.atan2(T[2],T[0]);const C=Math.hypot(T[0],T[2]);S.pitch=Math.atan2(T[1],C)},window.__ROW__=(f,M,S,T,C)=>t.debugRow(f,M,S,T,C);const d=t.canvas;let l=!1,y=0,m=0,w=!1;d.addEventListener("pointerdown",f=>{document.pointerLockElement!==d&&(l=!0,w=f.button===2||f.button===1,y=f.clientX,m=f.clientY,d.setPointerCapture(f.pointerId))}),d.addEventListener("pointermove",f=>{if(!l)return;const M=f.clientX-y,S=f.clientY-m;y=f.clientX,m=f.clientY,w?t.camera.pan(M,S):t.camera.moveOrbit(M,S)}),d.addEventListener("pointerup",f=>{l=!1,d.releasePointerCapture(f.pointerId)}),d.addEventListener("contextmenu",f=>f.preventDefault()),d.addEventListener("wheel",f=>{f.preventDefault(),t.camera.zoom(f.deltaY)},{passive:!1});const D=new Set;document.addEventListener("keydown",f=>D.add(f.code.toLowerCase())),document.addEventListener("keyup",f=>D.delete(f.code.toLowerCase()));let z=0;window.addEventListener("resize",()=>{clearTimeout(z),z=window.setTimeout(()=>t.resize(),120)}),performance.now();let k=!1;const g=Number(s.get("fpscap")??0);let B=0,b=0,P=!1;const x=f=>{if(P){k&&requestAnimationFrame(x);return}if(g>0&&f-B<g){k&&requestAnimationFrame(x);return}B=f;const M=b>0?Math.min(f-b,100):16;b=f,window.__CAM_TICK__?.(M/1e3),t.camera.mode==="fly"&&t.camera.flyStep(M/1e3,D);try{t.render(M)}catch(S){console.error(S),Z("Ошибка кадра",-1,String(S.message??S)),k=!1;return}window.__FPS_TICK__?.(M),window.__wgpu={status:"running",adapter:e.adapterName,tier:ue[t.tierIndex].name},k&&requestAnimationFrame(x)};new URLSearchParams(location.search).has("still")?window.__wgpu={status:"running",adapter:e.adapterName,tier:"still"}:(k=!0,requestAnimationFrame(x)),setTimeout(()=>{Pt.classList.add("fade"),zt.classList.remove("hidden")},450)}Dt().catch(n=>{console.error(n),Be(String(n.message??n),"Смотрите консоль (F12).")});

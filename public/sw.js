if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const d=e=>i(e,t),c={module:{uri:t},exports:o,require:d};s[t]=Promise.all(n.map((e=>c[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.021b9941.js",revision:null},{url:"assets/index.ecb2271d.css",revision:null},{url:"index.html",revision:"a063fc3f555f4a77d9cbdfef6f766996"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/192.png",revision:"c67bcbc2408bf626e7bede0e858ba03b"},{url:"icons/512.png",revision:"00e16d60d5e9fdb9a519b0873877ad55"},{url:"manifest.webmanifest",revision:"94d7dfa30f9b0c786f8db6e52990673b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const c=e=>i(e,t),d={module:{uri:t},exports:o,require:c};s[t]=Promise.all(n.map((e=>d[e]||c(e)))).then((e=>(r(...e),o)))}}define(["./workbox-27b29e6f"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.0e25aff6.css",revision:null},{url:"assets/index.3aadefa2.js",revision:null},{url:"index.html",revision:"cdbec4864d3a352a02444cf10f536bc3"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/192.png",revision:"c67bcbc2408bf626e7bede0e858ba03b"},{url:"icons/512.png",revision:"00e16d60d5e9fdb9a519b0873877ad55"},{url:"manifest.webmanifest",revision:"3cf35f84848b2d3737f6173cf543e430"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
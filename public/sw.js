if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const d=e=>i(e,c),o={module:{uri:c},exports:t,require:d};s[c]=Promise.all(n.map((e=>o[e]||d(e)))).then((e=>(r(...e),t)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.88cf7e83.css",revision:null},{url:"assets/index.9d66dfc4.js",revision:null},{url:"index.html",revision:"84cac996cd2cb8dd7e8c4d13d95f42a7"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/192.png",revision:"c67bcbc2408bf626e7bede0e858ba03b"},{url:"icons/512.png",revision:"00e16d60d5e9fdb9a519b0873877ad55"},{url:"manifest.webmanifest",revision:"f01e6c7a816fdd850ba7902c82c07b40"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(i[f])return;let o={};const t=e=>s(e,f),d={module:{uri:f},exports:o,require:t};i[f]=Promise.all(n.map((e=>d[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BVdq1QEy.css",revision:null},{url:"assets/index-CSCdwums.js",revision:null},{url:"favicon.svg",revision:"bae7da69b3b90f7019f32ef3d4ab7bc5"},{url:"icons/icon192x192.svg",revision:"bae7da69b3b90f7019f32ef3d4ab7bc5"},{url:"icons/icon512x512.svg",revision:"f8372a43ca24fad18012ebfd863f9e6f"},{url:"index.html",revision:"805f78fa0daeb70f210ff5e2e74dbee8"},{url:"logo.svg",revision:"f8372a43ca24fad18012ebfd863f9e6f"},{url:"registerSW.js",revision:"bd8f819637413316888e17a67245450e"},{url:"manifest.webmanifest",revision:"4526708a62163addd4b3b4c6a44f464f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));

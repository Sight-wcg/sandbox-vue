var re=Object.defineProperty;var P=Object.getOwnPropertySymbols;var ie=Object.prototype.hasOwnProperty,oe=Object.prototype.propertyIsEnumerable;var V=(s,e,t)=>e in s?re(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,A=(s,e)=>{for(var t in e||(e={}))ie.call(e,t)&&V(s,t,e[t]);if(P)for(var t of P(e))oe.call(e,t)&&V(s,t,e[t]);return s};var g=(s,e,t)=>(V(s,typeof e!="symbol"?e+"":e,t),t);import{c as O,a as U,u as ae,F as k,r as z,b as N,w as R,o as d,d as m,e as M,f as c,g as ce,h as T,i as le,j as ue,k as pe,t as $,l as u,m as B,n as J,p as y,q as de,s as me,v as f,_ as he,x as fe,y as ve,z as ge,A as H,B as W,C as q,R as ye,D as _e,E as be}from"./vendor.92b76ff1.js";const we=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerpolicy&&(i.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?i.credentials="include":r.crossorigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}};we();const ke="modulepreload",K={},xe="/layui-vue-playground/",G=function(e,t){return!t||t.length===0?e():Promise.all(t.map(n=>{if(n=`${xe}${n}`,n in K)return;K[n]=!0;const r=n.endsWith(".css"),i=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${i}`))return;const o=document.createElement("link");if(o.rel=r?"stylesheet":ke,r||(o.as="script",o.crossOrigin=""),o.href=n,document.head.appendChild(o),r)return new Promise((a,C)=>{o.addEventListener("load",a),o.addEventListener("error",C)})})).then(()=>e())};var Ce=`<script setup lang="ts">\r
import { ref } from 'vue'\r
\r
const msg = ref('Hello World!')\r
<\/script>\r
\r
<template>\r
  <h1>{{ msg }}</h1>\r
  <lay-input v-model="msg" style="width:350px" />\r
</template>`;const h={title:"sandbox-vue",UIPackage:"@layui/layui-vue",minSupportedVersion:"0.2.5",filterPreRelease:!1,defaultAppTemplate:Ce.trim()},Y=[{name:"unpkg",url:"https://unpkg.com/"},{name:"jsdelivr",url:"https://cdn.jsdelivr.net/npm/"},{name:"skypack",url:"https://cdn.skypack.dev/"},{name:"custom",url:"({}).BASE_URLlib"}],Z=[{name:"@vue/runtime-dom",version:"",path:"/dist/runtime-dom.esm-browser.js",stylePath:"",description:"",source:"unpkg"},{name:"@vue/compiler-sfc",version:"",path:"/dist/compiler-sfc.esm-browser.js",stylePath:"",description:"\u7F16\u8BD1 SFC \u7EC4\u4EF6",source:"unpkg"},{name:"@vue/shared",version:"",path:"/dist/shared.esm-bundler.js",stylePath:"",description:"",source:"unpkg"},{name:"@layui/layui-vue",version:"",path:"/lib/index.js",stylePath:"/lib/index.css",description:"layui-vue\u7EC4\u4EF6\u5E93",source:"unpkg"},{name:"@layui/layer-vue",version:"",path:"/lib/layer-vue.es.js",stylePath:"",description:"layer\u5F39\u5C42",source:"unpkg"}],$e=s=>{var e;return(e=Y.find(t=>t.name===s))!=null?e:Y[0]},je=s=>Z.find(e=>e.name===s),b=(s,e,t)=>{const n=je(s);if(!n)return;let{name:r,version:i,path:o,stylePath:a,source:C}=n;return i=i?`@${i}`:"",i=e?`@${e}`:i,`${$e(C).url}${r}${i}${t?a:o}`},Ie=s=>{const e=b("@vue/compiler-sfc",s),t=b("@vue/runtime-dom",s);return{compilerSfc:e,runtimeDom:t}},Q=({vue:s,UILib:e}={})=>{const t=[];return Z.forEach((n,r)=>{n.name.startsWith("@vue")?n.name==="@vue/runtime-dom"?t[r]=["vue",b(n.name,s)]:t[r]=[n.name,b(n.name,s)]:n.name===h.UIPackage?t[r]=[n.name,b(n.name,e)]:t[r]=[n.name,b(n.name)]}),Object.fromEntries(t)},X=s=>ae(`https://data.jsdelivr.com/v1/package/npm/${s}`,{initialData:[],afterFetch:e=>(e.data=e.data.versions,e)}).json().data,Se=(s,e,t)=>{let n=X(s);return O(()=>{if(n.value.length===0)return[];let r=n.value.filter(i=>U(i,e,">="));if(t){const i=[];let o=r[0].includes("-");for(const a of r)if(a.includes("-")?o&&i.push(a):(i.push(a),o=!1),i.length>=30)break;r=i}return r})},Ee=()=>{let s=X("vue");return O(()=>s.value.filter(e=>U(e,"3.2.0",">=")))};function Le(s){return btoa(unescape(encodeURIComponent(s)))}function Fe(s){return decodeURIComponent(escape(atob(s)))}const j="PlaygroundMain.vue",E="App.vue",x="LibInstall.js",I=h.UIPackage,Ve=`
<script setup>
import App from './App.vue'
import { setupLib } from './${x}'
setupLib()
<\/script>
<template>
  <App />
</template>`.trim();var se;const Ae=(se=h.defaultAppTemplate)!=null?se:`
<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello World!')
<\/script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg" style="width:350px"/>
</template>
`.trim(),ee=s=>`
import { getCurrentInstance } from 'vue'
import UILibName from '${I}'

let installed = false

// \u9996\u5148\u52A0\u8F7D\u6837\u5F0F,\u9632\u6B62\u9875\u9762\u95EA\u70C1
await loadStyle()

export function setupLib() {
  if(installed) return
  const instance = getCurrentInstance()
  instance.appContext.app.use(UILibName)
  installed = true
}

export function loadStyle() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
  	link.rel = 'stylesheet'
  	link.href = '${b(I,s,!0)}'
    link.onload = resolve
    link.onerror = reject
  	document.body.appendChild(link)

    const style = document.createElement("style")
    style.type = 'text/css'
    style.innerHTML = 'body{margin:8px !important;}'
    document.head.appendChild(style)
  })
}
`,te=!0;class Me{constructor({serializedState:e="",versions:t={vue:"",UILib:""}}){g(this,"state");g(this,"compiler");g(this,"options");g(this,"versions");g(this,"initialShowOutput",!1);g(this,"initialOutputMode","preview");g(this,"pendingCompiler",null);let n={};if(e){const r=JSON.parse(Fe(e));for(const i of Object.keys(r))n[i]=new k(i,r[i])}else n[E]=new k(E,Ae);n[j]=new k(j,Ve,te),this.state=z({mainFile:j,files:n,activeFile:n[E],errors:[],vueRuntimeURL:""}),this.versions=t,this.initImportMap()}async init(){await this.setVueVersion(this.versions.vue),this.state.files[x]=new k(x,ee("").trim(),te);for(const e of Object.values(this.state.files))N(this,e);R(()=>N(this,this.state.activeFile))}setActive(e){this.state.files[e].hidden||(this.state.activeFile=this.state.files[e])}addFile(e){const t=typeof e=="string"?new k(e):e;this.state.files[t.filename]=t,this.setActive(t.filename)}deleteFile(e){if(e===x||e===j){alert(`You cannot remove it, because ${I} requires it.`);return}confirm(`Are you sure you want to delete ${e}?`)&&(this.state.activeFile.filename===e&&this.setActive(E),delete this.state.files[e])}simplifyImportMaps(){const e=this.getImportMap(),t=Object.keys(Q({}));return e.imports=Object.fromEntries(Object.entries(e.imports).filter(([n])=>!t.includes(n))),JSON.stringify(e)}serialize(){const e=JSON.stringify(Object.fromEntries(Object.entries(this.getFiles()).map(([t,n])=>{if(t==="import-map.json")try{const r=this.simplifyImportMaps();return[t,r]}catch{}return[t,n]})));return`#${Le(e)}`}getFiles(){const e={};for(const t of Object.values(this.state.files))t.hidden||(e[t.filename]=t.code);return e}initImportMap(){this.state.files["import-map.json"]||(this.state.files["import-map.json"]=new k("import-map.json",JSON.stringify({imports:{}},null,2)))}getImportMap(){try{return JSON.parse(this.state.files["import-map.json"].code)}catch(e){return this.state.errors=[`Syntax error in import-map.json: ${e.message}`],{}}}setImportMap(e){this.state.files["import-map.json"].code=JSON.stringify(e,null,2)}addDeps(){const e=this.getImportMap();e.imports=A(A({},e.imports),Q({vue:this.versions.vue,UILib:this.versions.UILib})),this.setImportMap(e)}async setVersion(e,t){switch(e){case"UILib":await this.setUILibVersion(t);break;case"vue":await this.setVueVersion(t);break}}async setUILibVersion(e){this.state.files[x].code=ee(e).trim(),this.versions.UILib=e,this.addDeps(),console.info(`[${I}/playground] Now using ${I} version: ${e}`)}async setVueVersion(e){const{compilerSfc:t,runtimeDom:n}=Ie(e);!t||!n||(this.pendingCompiler=G(()=>import(t),[]),this.compiler=await this.pendingCompiler,this.pendingCompiler=null,this.state.vueRuntimeURL=n,this.versions.vue=e,this.addDeps(),console.info(`[@vue/repl] Now using Vue version: ${e}`))}}var De="/layui-vue-playground/logo.svg",S=(s,e)=>{const t=s.__vccOpts||s;for(const[n,r]of e)t[n]=r;return t};const Pe={},Oe={width:"1.7em",height:"1.7em",viewBox:"0 0 24 24"},Ue=M('<g fill="#666"><rect x="4" y="18" width="16" height="2" rx="1" ry="1"></rect><rect x="3" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 5 18)"></rect><rect x="17" y="17" width="4" height="2" rx="1" ry="1" transform="rotate(-90 19 18)"></rect><path d="M12 15a1 1 0 0 1-.58-.18l-4-2.82a1 1 0 0 1-.24-1.39a1 1 0 0 1 1.4-.24L12 12.76l3.4-2.56a1 1 0 0 1 1.2 1.6l-4 3a1 1 0 0 1-.6.2z"></path><path d="M12 13a1 1 0 0 1-1-1V4a1 1 0 0 1 2 0v8a1 1 0 0 1-1 1z"></path></g>',1),ze=[Ue];function Ne(s,e){return d(),m("svg",Oe,ze)}var Re=S(Pe,[["render",Ne]]);const Te={},Be={width:"1.7em",height:"1.7em",viewBox:"0 0 24 24"},Je=c("path",{fill:"#666",d:"M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"},null,-1),He=[Je];function We(s,e){return d(),m("svg",Be,He)}var qe=S(Te,[["render",We]]);const Ke={},Ge={width:"1.4em",height:"1.4em",viewBox:"0 0 24 24"},Ye=M('<g fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M8.59 13.51l6.83 3.98"></path><path d="M15.41 6.51l-6.82 3.98"></path></g>',1),Ze=[Ye];function Qe(s,e){return d(),m("svg",Ge,Ze)}var Xe=S(Ke,[["render",Qe]]);const et={},tt={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},st=c("path",{fill:"#666",d:"M12.1,22c-0.3,0-0.6,0-0.9,0c-5.5-0.5-9.5-5.4-9-10.9c0.4-4.8,4.2-8.6,9-9c0.4,0,0.8,0.2,1,0.5c0.2,0.3,0.2,0.8-0.1,1.1c-2,2.7-1.4,6.4,1.3,8.4c2.1,1.6,5,1.6,7.1,0c0.3-0.2,0.7-0.3,1.1-0.1c0.3,0.2,0.5,0.6,0.5,1c-0.2,2.7-1.5,5.1-3.6,6.8C16.6,21.2,14.4,22,12.1,22zM9.3,4.4c-2.9,1-5,3.6-5.2,6.8c-0.4,4.4,2.8,8.3,7.2,8.7c2.1,0.2,4.2-0.4,5.8-1.8c1.1-0.9,1.9-2.1,2.4-3.4c-2.5,0.9-5.3,0.5-7.5-1.1C9.2,11.4,8.1,7.7,9.3,4.4z"},null,-1),nt=[st];function rt(s,e){return d(),m("svg",tt,nt)}var it=S(et,[["render",rt]]);const ot={},at={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},ct=M('<path d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4C16,9.8,14.2,8,12,8z"></path><path d="M12,4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,3.6,12.6,4,12,4z"></path><path d="M12,24c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,23.6,12.6,24,12,24z"></path><path d="M5.6,6.6c-0.3,0-0.5-0.1-0.7-0.3L3.5,4.9c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C6.2,6.5,5.9,6.6,5.6,6.6z"></path><path d="M19.8,20.8c-0.3,0-0.5-0.1-0.7-0.3l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C20.3,20.7,20,20.8,19.8,20.8z"></path><path d="M3,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S3.6,13,3,13z"></path><path d="M23,13h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path><path d="M4.2,20.8c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C4.7,20.7,4.5,20.8,4.2,20.8z"></path><path d="M18.4,6.6c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C18.9,6.5,18.6,6.6,18.4,6.6z"></path>',9),lt=[ct];function ut(s,e){return d(),m("svg",at,lt)}var pt=S(ot,[["render",ut]]),dt=`<!DOCTYPE html>\r
<html lang="en">\r
\r
<head>\r
  <meta charset="UTF-8" />\r
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\r
  <title>Vite App</title>\r
</head>\r
\r
<body>\r
  <div id="app"></div>\r
  <script type="module" src="/src/main.ts"><\/script>\r
</body>\r
\r
</html>`,mt=`import { createApp } from "vue";\r
import App from "./App.vue";\r
import "@layui/layui-vue/lib/index.css";\r
import Layui from "@layui/layui-vue";\r
\r
const app = createApp(App);\r
\r
app.use(Layui).mount("#app");`,ht=`{\r
  "name": "layui-vue-example-project",\r
  "version": "0.0.1",\r
  "scripts": {\r
    "dev": "vite",\r
    "build": "vue-tsc --noEmit && vite build",\r
    "serve": "vite preview"\r
  },\r
  "dependencies": {\r
    "@layui/layui-vue": "^0.3.7",\r
    "vue": "^3.2.30"\r
  },\r
  "devDependencies": {\r
    "@vitejs/plugin-vue": "^2.2.0",\r
    "@vue/compiler-sfc": "^3.2.30",\r
    "typescript": "^4.4.3",\r
    "less": "^4.1.2",\r
    "vite": "^2.8.1",\r
    "vue-tsc": "^0.31.2"\r
  },\r
  "keywords": [],\r
  "description": ""\r
}`,ft=`import { defineConfig } from 'vite'\r
import vue from '@vitejs/plugin-vue'\r
\r
// https://vitejs.dev/config/\r
export default defineConfig({\r
  plugins: [vue()],\r
  css: {\r
    preprocessorOptions: {\r
      less: {\r
        javascriptEnabled: true,\r
      },\r
    },\r
  },\r
})\r
`,vt=`# Vue 3 + Vite\r
\r
This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 \`<script setup>\` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.\r
\r
## Recommended IDE Setup\r
\r
- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)`,gt=`{\r
  "compilerOptions": {\r
    "target": "esnext",\r
    "module": "esnext",\r
    "moduleResolution": "node",\r
    "strict": true,\r
    "jsx": "preserve",\r
    "sourceMap": true,\r
    "resolveJsonModule": true,\r
    "esModuleInterop": true,\r
    "lib": [\r
      "esnext",\r
      "dom"\r
    ],\r
    "types": [\r
      "vite/client"\r
    ]\r
  },\r
  "include": [\r
    "src/**/*.ts",\r
    "src/**/*.d.ts",\r
    "src/**/*.tsx",\r
    "src/**/*.vue"\r
  ]\r
}`;async function yt(s){const{default:e}=await G(()=>import("./jszip.min.e2f8ac8e.js").then(function(a){return a.j}),["assets/jszip.min.e2f8ac8e.js","assets/vendor.92b76ff1.js"]),t=new e,n=[j,x,"import-map.json"];t.file("index.html",dt),t.file("package.json",ht),t.file("tsconfig.json",gt),t.file("vite.config.js",ft),t.file("README.md",vt);const r=t.folder("src");r.file("main.ts",mt);const i=s.getFiles();for(const a in i)n.includes(a)||r.file(a,i[a]);const o=await t.generateAsync({type:"blob"});ce.exports.saveAs(o,"layui-vue-example-project.zip")}const _t=c("img",{alt:"logo",src:De},null,-1),bt={class:"lt-sm-hidden"},wt={class:"links"},kt={class:"mr-1",style:{"margin-left":"15px"}},xt=["onUpdate:modelValue","onChange"],Ct=c("option",{disabled:"",value:""},"\u8BF7\u9009\u62E9",-1),$t=["value"],jt={title:"View on Gitee",class:"github"},It={href:"https://gitee.com/layui-vue/layui-vue",target:"_blank"},St=T({props:{store:null,fullscreenTarget:null},setup(s){const e="0.0.6",t="1.0.0";document.title=h.title;const n=z({UILib:{text:`${h.UIPackage}`,published:Se(h.UIPackage,h.minSupportedVersion,h.filterPreRelease),active:s.store.versions.UILib},vue:{text:"Vue",published:Ee(),active:s.store.versions.vue}});async function r(v,p){f.load(2,{},()=>{}),n[v].active="loading...",await s.store.setVersion(v,p),n[v].active=p,f.closeAll()}async function i(){const{share:v,isSupported:p}=ge();p?v({title:`${h.title}`,text:`\u6765\u81EA ${h.title} \u7684\u5206\u4EAB!`,url:location.href}):o()}async function o(){const{isSupported:v,copy:p}=de(),F=me("clipboard-write");let l=!1;if(v&&F.value==="granted")p(location.href),l=!0;else{let _=document.createElement("input");_.value=location.href,document.body.appendChild(_),_.select(),document.execCommand("Copy"),_.remove(),l=!0}l?f.msg("\u94FE\u63A5\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F",{time:1e3},()=>{}):f.msg("\u5206\u4EAB\u5931\u8D25",{time:1e3},()=>{})}async function a(){f.confirm("\u4E0B\u8F7D\u9879\u76EE\u6587\u4EF6?",{title:"\u6D88\u606F",icon:3,btn:[{text:"\u786E\u5B9A",async callback(){await yt(s.store),f.closeAll()}},{text:"\u53D6\u6D88",callback(){f.closeAll()}}]},()=>{})}const C=le(),L=ue(C),{isFullscreen:ne,toggle:D}=pe(s.fullscreenTarget);return(v,p)=>{const F=he;return d(),m("nav",null,[c("h1",null,[_t,c("span",bt,[c("span",null,$(u(h).title),1),c("small",null,"(v"+$(u(e))+", repl v"+$(u(t))+")",1)])]),c("div",wt,[(d(!0),m(B,null,J(u(n),(l,_)=>(d(),m("div",{key:_,class:"flex items-center lt-lg-hidden"},[c("span",kt,$(l.text)+" :",1),fe(c("select",{"onUpdate:modelValue":w=>l.active=w,onChange:w=>r(_,l.active),style:{width:"150px"}},[Ct,(d(!0),m(B,null,J(l.published,w=>(d(),m("option",{value:w,key:w},$(w),9,$t))),128))],40,xt),[[ve,l.active]])]))),128)),c("button",{title:"Fullscreen",class:"fullscreen",onClick:p[0]||(p[0]=(...l)=>u(D)&&u(D)(...l))},[y(F,{size:"18px",type:u(ne)?"layui-icon-screen-restore":"layui-icon-screen-full",style:{"font-weight":"500"}},null,8,["type"])]),c("button",{title:"Toggle dark mode",class:"toggle-dark",onClick:p[1]||(p[1]=(...l)=>u(L)&&u(L)(...l))},[y(pt,{class:"light"}),y(it,{class:"dark"})]),c("button",{title:"Share",class:"share",onClick:i},[y(Xe)]),c("button",{title:"Download",class:"download",onClick:a},[y(Re)]),c("button",jt,[c("a",It,[y(qe)])])])])}}});const Et={key:0,class:"antialiased"},Lt=T({setup(s){const e=H(!0),t=f.load(2,{},()=>{}),n=H(null),r={script:{reactivityTransform:!0}},i=new Me({serializedState:location.hash.slice(1)});return i.init().then(()=>{e.value=!1,f.close(t)}),R(()=>history.replaceState({},"",i.serialize())),(o,a)=>e.value?_e("",!0):(d(),m("div",Et,[y(St,{store:u(i),fullscreenTarget:n.value},null,8,["store","fullscreenTarget"]),y(u(ye),{ref_key:"repl",ref:n,store:u(i),"show-compile-output":"","auto-resize":"","sfc-options":r,"clear-console":!1,onKeydown:[a[0]||(a[0]=W(q(()=>{},["ctrl","prevent"]),["s"])),a[1]||(a[1]=W(q(()=>{},["meta","prevent"]),["s"]))]},null,8,["store"])]))}});be(Lt).mount("#app");

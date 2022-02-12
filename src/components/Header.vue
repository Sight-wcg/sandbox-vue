<script setup lang="ts">
import Download  from '@/icons/Download.vue'
import Github from '@/icons/Github.vue'
import Share from '@/icons/Share.vue'
import Moon from '@/icons/Moon.vue'
import Sun from '@/icons/Sun.vue'
import {
  getSupportedLayuiVueVersions,
  getSupportedVueVersions,
} from '../utils/dependency'
import type { ComputedRef } from 'vue'
import type { ReplStore, VersionKey } from '../store'
import { downloadProject } from '../download/download'

const appVersion = import.meta.env.APP_VERSION
const replVersion = import.meta.env.REPL_VERSION

const { store, fullscreenTarget} = defineProps<{
  store: ReplStore,
  fullscreenTarget: any
}>()

const versions = reactive<
  Record<
    VersionKey,
    {
      text: string
      published: ComputedRef<string[]>
      active: string
    }
  >
>({
  layuiVue: {
    text: 'layui-vue',
    published: getSupportedLayuiVueVersions(),
    active: store.versions.layuiVue,
  },
  vue: {
    text: 'Vue',
    published: getSupportedVueVersions(),
    active: store.versions.vue,
  },
})

async function setVersion(key: VersionKey, v: string) {
  versions[key].active = `loading...`
  await store.setVersion(key, v)
  versions[key].active = v
}

async function copyLink() {
  await navigator.clipboard.writeText(location.href)
  //alert('Sharable URL has been copied to clipboard.')
  layer.msg('链接已复制到剪贴板', { time: 1000 , offset:['30%','50%']}, () => {});
}

async function downloadExample() {
    layer.confirm("下载项目文件?", { 
    title: '消息',
    icon: 3,
    offset: ['40%', '50%'],
    btn: [{ 
      text: '确定',
      async callback() { 
        await downloadProject(store)
        layer.closeAll() 
      } 
    }, { 
      text: '取消',
      callback() { 
        layer.closeAll()
      } 
    }
  ]}, 
  () => {})
}

const isDark = useDark();
const toggleDark = useToggle(isDark);

const { isFullscreen, toggle } = useFullscreen(fullscreenTarget)

</script>

<template>
  <nav>
    <h1>
      <img alt="logo" src="/logo.svg" />
      <span class="lt-sm-hidden">
        <span>Layui Vue Playground</span>
        <small> (v{{ appVersion }}, repl v{{ replVersion }}) </small>
      </span>
    </h1>

    <!-- 版本选择 -->
    <div class="links">
      <div
        v-for="(v, key) of versions"
        :key="key"
        class="flex items-center lt-lg-hidden"
      >
        <span class="mr-1" style="margin-left: 15px;">{{ v.text }} Version:</span>
        <select 
          v-model="v.active"
          @change="setVersion(key, v.active)"
          style="width: 150px"
          >
          <option selected value="latest">{{v.published[0]}}</option>
          <template v-for="(ver,index) of v.published" >
            <option 
              v-if="index != 0" 
              :value="ver" 
              :key="ver">
              {{ver}}
            </option>
          </template>
        </select>
      </div>

      
      <button title="Fullscreen" class="fullscreen" @click="toggle">
        <LayIcon :type="(isFullscreen ? 'layui-icon-screen-restore' : 'layui-icon-screen-full')" />
      </button>

      <button title="Toggle dark mode" class="toggle-dark" @click="toggleDark()">
        <Sun class="light" />
        <Moon class="dark" />
      </button>

      <button title="Share" class="share" @click="copyLink">
        <share />
      </button>

      <button title="Download" class="download" @click="downloadExample">
        <Download/>
      </button>

      <button title="View on Gitee" class="github">
        <a
          href="https://gitee.com/layui-vue/layui-vue"
          target="_blank"
        >
          <github />
        </a>
      </button>
    </div>
  </nav>
</template>

<style>
nav {
  --base: #24292E;
  --bg: #fff;
  --bg-light: #fff;
  --border: #ddd;

  color: var(--base);
  height: var(--nav-height);
  box-sizing: border-box;
  padding: 0 1em;
  background-color: var(--bg);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.33);
  position: relative;
  z-index: 999;
  display: flex;
  justify-content: space-between;
}

.dark nav {
  --base: #ddd;
  --bg: #363A47;
  --bg-light: #242424;
  --border: #383838;

  box-shadow: none;
  border-bottom: 1px solid var(--border);
}

h1 {
  margin: 0;
  line-height: var(--nav-height);
  font-weight: 300;
  display: inline-block;
  vertical-align: middle;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", Tahoma, Arial, sans-serif;
}

h1 img {
  height: 24px;
  vertical-align: middle;
  margin-right: 10px;
  position: relative;
  top: -2px;
}

@media (max-width: 480px) {
  h1 span {
    display: none;
  }
}

.links {
  display: flex;
}

.version {
  display: inline-block;
  margin-right: 12px;
  position: relative;
}

.active-version {
  cursor: pointer;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  line-height: var(--nav-height);
  padding-right: 15px;
}

.active-version:after {
  content: '';
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #aaa;
  position: absolute;
  right: 0;
  top: 22px;
}

.version:hover .active-version:after {
  border-top-color: var(--base);
}

.dark .fullscreen{
  color: #666
}

.toggle-dark svg {
  width: 18px;
  height: 18px;
  fill: #666;
}

.toggle-dark .dark,
.dark .toggle-dark .light {
  display: none;
}
.dark .toggle-dark .dark {
  display: inline-block;
}

.dark .version:hover .active-version:after {
  border-top-color: #fff;
}

.versions {
  display: none;
  position: absolute;
  left: 0;
  top: 40px;
  background-color: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 4px;
  list-style-type: none;
  padding: 8px;
  margin: 0;
  width: 200px;
  max-height: calc(100vh - 70px);
  overflow: scroll;
}

.versions a {
  display: block;
  padding: 6px 12px;
  text-decoration: none;
  cursor: pointer;
  color: var(--base);
}

.versions a:hover {
  color: #3ca877;
}

.versions.expanded {
  display: block;
}

.share,
.github,
.download,
.fullscreen {
  margin: 0 2px;
}
</style>

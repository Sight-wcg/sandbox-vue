<script setup lang="ts">
import Download from '@/icons/Download.vue'
import Github from '@/icons/Github.vue'
import Format from '@/icons/Format.vue'
import Share from '@/icons/Share.vue'
import Moon from '@/icons/Moon.vue'
import Sun from '@/icons/Sun.vue'
import FullScreen from '@/icons/FullScreen.vue'
import ExitFullScreen from '@/icons/ExitFullScreen.vue'
import {
  getSupportedVersions,
  getSupportedVueVersions,
} from '../utils/dependency'
import { preferSFC, UIPackage } from '../store'
import { downloadProject } from '../download/download'
import { config } from '../config/sandbox.config'
import type { ReplStore, VersionKey } from '../store'
import type { ComputedRef } from 'vue'

const appVersion = import.meta.env.APP_VERSION
const replVersion = import.meta.env.REPL_VERSION

document.title = config.title

const { store, format: formatCode } = defineProps<{
  store: ReplStore
  format: Function
}>()

const emits = defineEmits<{
  (e: 'changeTheme', isDark: boolean): void;
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
  UILib: {
    text: `${UIPackage.value}`,
    published: getSupportedVersions(
      UIPackage.value,
      config.minSupportedVersion,
      config.filterPreRelease
    ),
    active: store.versions.UILib,
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

// async function onShare() {
//   const { share, isSupported } = useShare()
//   if (isSupported) {
//     share({
//       title: `${config.title}`,
//       text: `来自 ${config.title} 的分享!`,
//       url: location.href,
//     })
//   } else {
//     copyLink()
//   }
// }

async function copyLink() {
  const { isSupported, copy } = useClipboard()
  const permissionWrite = usePermission('clipboard-write')
  let successful = false
  if (isSupported && permissionWrite.value === 'granted') {
    copy(location.href)
    successful = true
  } else {
    let inputEl = document.createElement('input')
    inputEl.value = location.href
    document.body.append(inputEl)
    inputEl.select() 
    document.execCommand('Copy') 
    inputEl.remove()
    successful = true
  }
  if (successful) {
    alert('Sharable URL has been copied to clipboard.')
  } else {
    alert('copy failed!')
  }
}

// async function downloadExample() {
//   layer.confirm(
//     '下载项目文件?',
//     {
//       title: '消息',
//       icon: 3,
//       btn: [
//         {
//           text: '确定',
//           async callback() {
//             await downloadProject(store)
//             layer.closeAll()
//           },
//         },
//         {
//           text: '取消',
//           callback() {
//             layer.closeAll()
//           },
//         },
//       ],
//     },
//     () => {}
//   )
// }

const isDark = useDark()
const toggleDark = useToggle(isDark)

watch(isDark, (newVal) => {
  emits('changeTheme', isDark.value)
},{
  immediate:true
})

const { isFullscreen, toggle } = useFullscreen()

const UILibActiveRef = ref(versions.UILib.published[0])
const vueActiveRef = ref(versions.vue.published[0])
const activeLibRef = ref(preferSFC.value ? 'layuivue' : 'layui')

const favicon = computed(() => preferSFC.value ? 'layui-vue.png' : 'layui.svg')

useFavicon(favicon)

watch(
  () => [versions.UILib.published, versions.vue.published],
  () => {
    UILibActiveRef.value = versions.UILib.published[0]
    vueActiveRef.value = versions.vue.published[0]
  }
)

const toggleLib = () => {
  let layuiPlaygroundUrl =
    window.location.origin +
    window.location.pathname +
    (window.location.search.includes('deps=layui') ? '' : '?deps=layui')

  window.location.href = layuiPlaygroundUrl
}
</script>

<template>
  <nav>
    <h1>
      <img alt="logo" src="/layui-vue.png" />
      <span class="lt-sm-hidden">
        <span>{{ config.title }}</span>
        <small>(v{{ appVersion }}, repl v{{ replVersion }})</small>
      </span>
    </h1>

    <!-- 版本选择 -->
    <div class="links">
      <!-- <div v-for="(v, key) of versions" :key="key" class="flex items-center lt-lg-hidden">
        <span class="mr-1" style="margin-left: 15px;">{{ v.text }} :</span>
        <select v-model="v.active" @change="setVersion(key, v.active)" style="width: 150px">
          <option disabled value>请选择</option>
          <option v-for="(ver) of v.published" :value="ver" :key="ver">{{ ver }}</option>
        </select>
      </div> -->
      <div class="flex items-center lt-lg-hidden">
        <select v-model="activeLibRef" style="border: none" @change="toggleLib()">
          <option value="layuivue">LayuiVue</option>
          <option value="layui">Layui</option>
        </select>
        <div>
          <span class="mr-1" style="margin-left: 15px">{{ versions.UILib.text }} :</span>
          <select v-model="UILibActiveRef" style="width: 150px" @change="setVersion('UILib', UILibActiveRef)">
            <option v-for="ver of versions.UILib.published" :key="ver" :value="ver">
              {{ ver }}
            </option>
          </select>
        </div>
        <div v-if="preferSFC">
          <span class="mr-1" style="margin-left: 15px">{{ versions.vue.text }} :</span>
          <select v-model="vueActiveRef" style="width: 150px" @change="setVersion('vue', vueActiveRef)">
            <option v-for="ver of versions.vue.published" :key="ver" :value="ver">
              {{ ver }}
            </option>
          </select>
        </div>
      </div>

      <button class="format" title="ctrl + shift + F format" @click="formatCode()">
        <Format />
      </button>

      

      <button title="Fullscreen" class="fullscreen" @click="toggle">
        <!-- <LayIcon size="18px" :type="
          isFullscreen
            ? 'layui-icon-screen-restore'
            : 'layui-icon-screen-full'
        " style="font-weight: 500" /> -->
        <ExitFullScreen v-if="isFullscreen"></ExitFullScreen>
        <FullScreen v-else></FullScreen>
        
      </button>

      <button title="Toggle dark mode" class="toggle-dark" @click="toggleDark()">
        <Sun class="light" />
        <Moon class="dark" />
      </button>

      <button title="Share" class="share" @click="copyLink">
        <share />
      </button>

      <button v-if="preferSFC" title="Download" class="download" @click="downloadProject(store)">
        <Download />
      </button>

      <button title="View on Gitee" class="github">
        <a href="https://gitee.com/layui-vue/layui-vue" target="_blank">
          <github />
        </a>
      </button>
    </div>
  </nav>
</template>

<style>
nav {
  --base: #24292e;
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

.dark {
  color-scheme: dark;
}

.dark nav {
  --base: #ddd;
  --bg: #363a47;
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
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', Tahoma, Arial,
    sans-serif;
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

.dark .fullscreen {
  color: #aaa;
}
.dark svg > path {
  fill: #aaa;
}
.dark .download svg > g {
  fill: #aaa;
}
.dark .share svg > g {
  stroke: #aaa;
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

.format
.share,
.github,
.download,
.fullscreen {
  margin: 0 2px;
}

nav .button {
  --nav-button: #42b883;
  padding: 3px 15px;
  background-color: var(--nav-button);
  border: none;
  outline: none;
  color: #fff;
  margin: 0.5rem 0;
  border-bottom: 2px solid var(--nav-button);
  text-shadow: 1px 1px 1px var(--nav-button);
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  vertical-align: middle;
}
</style>

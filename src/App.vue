<script setup lang="ts">
import { Repl } from '@vue/repl'
import { ReplStore, preferSFC } from './store'
import Header from './components/Header.vue'
import type { BuiltInParserName } from 'prettier'
import type { SFCOptions } from '@vue/repl'

const loading = ref(true)

const layerLoadingId = layer.load(2, {}, () => {})

const repl = ref<HTMLElement | null>(null)

// enable experimental features
const sfcOptions: SFCOptions = {
  script: {
    reactivityTransform: true,
  },
}

const handleKeydown = (evt: KeyboardEvent) => {
  if ((evt.ctrlKey || evt.metaKey) && evt.code === 'KeyS') {
    evt.preventDefault()
    return
  }
  if ((evt.altKey || evt.ctrlKey) && evt.shiftKey && evt.code === 'KeyF') {
    evt.preventDefault()
    formatCode()
    return
  }
}

const formatCode = async () => {
  const [format, parserHtml, parserTypeScript, parserBabel, parserPostcss] =
    await Promise.all([
      import('prettier/standalone').then((r) => r.format),
      import('prettier/parser-html').then((m) => m.default),
      import('prettier/parser-typescript').then((m) => m.default),
      import('prettier/parser-babel').then((m) => m.default),
      import('prettier/parser-postcss').then((m) => m.default),
    ])
  const file = store.state.activeFile
  let parser: BuiltInParserName
  if (file.filename.endsWith('.vue')) {
    parser = 'vue'
  } else if (file.filename.endsWith('.js')) {
    parser = 'babel'
  } else if (file.filename.endsWith('.ts')) {
    parser = 'typescript'
  } else if (file.filename.endsWith('.json')) {
    parser = 'json'
  } else if (file.filename.endsWith('.html')) {
    parser = 'html'
  } else {
    return
  }
  file.code = format(file.code, {
    parser,
    plugins: [parserHtml, parserTypeScript, parserBabel, parserPostcss],
    semi: false,
    singleQuote: true,
  })
}

const store = new ReplStore({
  serializedState: location.hash.slice(1),
})
store.init().then(() => {
  loading.value = false
  layer.close(layerLoadingId)
})

// persist state
watchEffect(() => history.replaceState({}, '', store.serialize()))
</script>

<template>
  <div v-if="!loading" class="antialiased">
    <Header :store="store" :format="formatCode" />
    <Repl
      ref="repl"
      :store="store"
      :show-import-map="true"
      :show-compile-output="preferSFC"
      auto-resize
      :sfc-options="sfcOptions"
      :clear-console="false"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style>
body {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  --base: #444;
  --nav-height: 50px;
}

.vue-repl {
  height: calc(100vh - var(--nav-height));
}

.dark .vue-repl {
  --bg: #1f2428 !important;
  --bg-soft: #24292e !important;
}

.dark .vue-repl,
.vue-repl {
  --color-branding: #5fb878 !important;
  --color-branding-dark: #5fb878 !important;
}

button {
  border: none;
  outline: none;
  cursor: pointer;
  margin: 0;
  background-color: transparent;
}

.loading {
  height: 100vh;
}
</style>

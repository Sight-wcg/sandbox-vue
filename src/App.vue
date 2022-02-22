<script setup lang="ts">
import { Repl } from '@vue/repl'
import { ReplStore } from './store_'
import Header from './components/Header.vue'
import type { SFCOptions } from '@vue/repl'

const loading = ref(true)

const layerLoadingId = layer.load(2, {}, () => { })

const repl = ref<HTMLElement | null>(null)

// enable experimental features
const sfcOptions: SFCOptions = {
  script: {
    reactivityTransform: true,
  },
}

const store = new ReplStore({
  serializedState: location.hash.slice(1),
})
store.init().then(() => {
  loading.value = false
  layer.close(layerLoadingId);
})

// persist state
watchEffect(() => history.replaceState({}, '', store.serialize()))
</script>

<template>
  <div v-if="!loading" class="antialiased">
    <Header :store="store" :fullscreenTarget="repl" />
    <Repl
      ref="repl"
      :store="store"
      show-compile-output
      auto-resize
      :sfc-options="sfcOptions"
      :clear-console="false"
      @keydown.ctrl.s.prevent
      @keydown.meta.s.prevent
    />
  </div>
</template>

<style>
body {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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

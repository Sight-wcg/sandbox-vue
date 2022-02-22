<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <lay-input v-model="msg" style="width:350px" />
  <!-- <el-input v-model="msg" style="width:350px" /> -->
</template>
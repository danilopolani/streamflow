<script lang="ts" setup>
import { NPageHeader } from 'naive-ui';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  title: { type: String, required: true },
});
</script>

<template>
  <n-page-header
    :title="$props.title"
    class="p-3 cursor-default"
    @back="router.back()">
    <template #extra>
      <slot name="extra"></slot>
    </template>
  </n-page-header>
</template>

<template>
    <ClientOnly>
        <div class="min-h-dvh bg-[url(backgroundImg.jpg)] bg-cover bg-center">
            <slot/>
        </div>
    </ClientOnly>
</template>

<script setup>
import { ClientOnly } from '#components'
useHead({
  title: 'Mulder'
})
</script>

<style>

</style>
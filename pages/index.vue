<template>
    <div class="flex flex-col justify-between items-center px-4 py-8 bg-[rgba(0,0,0,0.65)] min-h-dvh">
        <p class="text-4xl text-white font-thin">Mulder</p>
        <form class="flex flex-col w-full gap-4 mb-12">
            <input type="text" placeholder="Email"/>
            <input type="password" placeholder="Password"/>
            <button type="button" @click="router.push('/stocks')" class="flex items-center active:scale-90 justify-center mt-16 p-2 rounded-[5px] text-lg text-white bg-primary-500">Login</button>
        </form>
        <p class="text-xs text-white">© Mulder leather 2025</p>
    </div>
</template>

<script setup>
const router = useRouter()
</script>

<style scoped>
input {
    @apply p-2 bg-transparent text-white focus:outline-0 focus:border-white border-b-[2px] border-gray-500
}
</style>
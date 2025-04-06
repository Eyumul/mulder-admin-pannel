<template>
    <div class="flex flex-col justify-between items-center px-4 py-8 bg-[rgba(0,0,0,0.65)] min-h-dvh">
        <p class="text-4xl text-white font-thin">Mulder</p>
        <form @submit.prevent="() => (login())" class="relative pb-12 flex flex-col w-full gap-4 mb-12">
            <input v-model="email" type="text" placeholder="Email"/>
            <input v-model="password" type="password" placeholder="Password"/>
            <!-- <button type="button" @click="router.push('/')" class="flex items-center active:scale-90 justify-center mt-16 p-2 rounded-[5px] text-lg text-white bg-primary-500">Login</button> -->
            <button type="submit" class="flex items-center active:scale-90 justify-center mt-16 p-2 rounded-[5px] text-lg text-white bg-primary-500">
                <span v-if="!isLoading">Login</span>
                <span v-else class="flex items-center gap-2">
                    <icon name="line-md:loading-twotone-loop" class="size-4"/>
                    <p>Loading...</p>
                </span>
            </button>
            <p v-if="errorMessage" class="absolute bottom-0 w-full text-center mt-4 text-red-500 text-sm">{{ errorMessage }}</p>
        </form>
        <p class="text-xs text-white">© Mulder leather 2025</p>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['auth']
})

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false); // Loading indicator
const client = useSupabaseClient()
const errorMessage = ref(null)

const login = async () => {
    errorMessage.value = null // Reset error message
    isLoading.value = true; // Start loading
    const { data, error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })

    if (error) {
        console.error('Login Error:', error.message)
        errorMessage.value = error.message
        isLoading.value = false; // Stop loading on error
    } else {
        console.log('Logged in successfully:', data.user.user_metadata.name) // Retrieve name
    }
}

const user = useSupabaseUser()
onMounted(() => {
    watchEffect(() => {
        if(user.value) {
            navigateTo('/')
        }
    })
})
</script>

<style scoped>
input {
    @apply p-2 bg-transparent text-white focus:outline-0 focus:border-white border-b-[2px] border-gray-500
}
</style>
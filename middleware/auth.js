export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()
    if (!user.value && to.path === '/'){
        navigateTo('/login')
    } else if (user.value && to.path === '/login'){
        navigateTo('/')
    }
})
<template>
    <div>
        <p class="text-5xl font-bold text-green-500">Hello world</p>
        <div v-for="stock in stocks.stock" :key="stock.id">
            <p>Name: <span class="font-black text-blue-500">{{ stock.name }}</span></p>
            <p>Amount: <span class="font-black text-blue-500">{{ stock.amount }}</span></p>
            <hr/>
        </div>
    </div>
</template>

<script setup>
const query = gql`
    query MyQuery {
        stock {
            amount
            id
            name
        }
    }
`
const { data: stocks } = await useAsyncQuery(query)
</script>

<style scoped>

</style>
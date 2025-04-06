<template>
    <div class="relative min-h-dvh bg-black text-white flex flex-col items-center">
        <!-- Header -->
        <div class="fixed top-0 flex flex-col gap-6 w-full bg-primary-950 px-4 py-4">
            <div class="flex justify-between items-center w-full">
                <p class="font-bold text-primary-200 text-2xl">Stocks Record</p>
                <button @click="logout()">
                    <icon class="text-primary-500 text-2xl" name="fluent:arrow-exit-20-filled"/>
                </button>
            </div>
            <div class="flex items-end justify-between w-full">
                <input
                    v-model="searchText"
                    @input="handleSearch"
                    type="search"
                    placeholder="Search for stocks here"
                    class="p-2 bg-transparent text-white focus:outline-0"
                />
                <label class="flex flex-col gap-2 items-end cursor-pointer">
                    <span class="text-xs font-medium text-gray-900 dark:text-gray-300">Edit mode</span>
                    <input type="checkbox" v-model="isEditModeOn" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600 dark:peer-checked:bg-primary-600"></div>
                </label>
            </div>
        </div>

        <!-- main content -->
        <div class="h-[calc(100vh-204px)] pb-[96px] px-4 mt-[136px] w-full overflow-auto">
            <ClientOnly>
                <table class="w-full">
                    <thead>
                        <tr class="sticky top-0 bg-black z-10 text-sm text-primary-500 border-b-[1px] border-primary-500">
                            <th class="relative text-start">
                                Item
                                <icon @click="resetChanges()" name="material-symbols:refresh" :class="isEditModeOn ? '' : 'hidden'" class="text-primary-500 font-black absolute left-2 text-lg cursor-pointer"/>
                            </th>
                            <th class="text-center">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="font-bold" v-for="stock in stockList" :key="stock.id">
                            <td class="relative text-sm uppercase">
                                <icon @click="deleteStock(stock.id)" name="fluent:delete-12-regular" :class="isEditModeOn ? '' : 'hidden'" class="text-red-500 font-black absolute left-2 text-xl cursor-pointer"/>
                                <input v-if="isEditModeOn" size="5" v-model="stock.name" class="bg-transparent focus:outline-0"/>
                                <p v-else class="text-primary-200">{{ stock.name }}</p>
                            </td>
                            <td class="flex justify-center items-center relative text-center">
                                <icon
                                    v-if="isEditModeOn && isStockModified(stock)"
                                    name="fluent:save-20-filled"
                                    class="text-green-400 absolute left-3 text-xl cursor-pointer"
                                    @click="saveStock(stock)"
                                />
                                <div v-if="isEditModeOn">
                                    <div v-if="stock.metrics == 'pcs'" class="flex h-8 items-center justify-center">
                                        <div @click="stock.amount++" class="flex justify-center items-center cursor-pointer px-2 h-full rounded-l-[5px] bg-primary-500 text-white font-black text-lg">
                                            <icon name="fluent:add-12-regular"/>
                                        </div>
                                        <input type="number" v-model="stock.amount" class="bg-transparent h-full w-9 px-[2px] focus:outline-0 border-y-[1px] border-primary-900 text-center"/>
                                        <div @click="stock.amount > 0 ? stock.amount-- : null" class="flex justify-center items-center cursor-pointer px-2 h-full rounded-r-[5px] bg-primary-500 text-white font-black text-lg">
                                            <icon name="fluent:minimize-24-regular"/>
                                        </div>
                                    </div>
                                    <div v-else-if="stock.metrics == 'sqf'" class="flex relative h-8 items-center justify-center">
                                        <input type="number" v-model="stock.amount" class="bg-transparent h-full w-[106px] px-[4px] pr-[24px] focus:outline-0 border-[2px] rounded-[5px] border-primary-900 text-center"/>
                                        <p class="text-[10px] right-2 absolute text-primary-500">Sqf</p>
                                    </div>
                                </div>
                                <p v-else class="text-2xl">{{ stock.amount }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </ClientOnly>
        </div>
        
        <!-- footer -->
        <div class="fixed bottom-0 flex w-full bg-primary-950 px-4 py-3">
            <button @click="isModalOpen=true" class="flex items-center w-full active:scale-90 justify-center p-3 rounded-[5px] text-sm text-white bg-primary-500">Add Stock</button>
        </div>

        <!-- modal -->
        <Modal :isOpen="isModalOpen" @cancel="cancelModal()" @close="isModalOpen = false" @save="addStock(stockAmount, stockName, stockMetrics)">
            <div class="flex flex-col mt-6 mb-8 gap-2">
                <input v-model="stockName" @input="isValidName = true" :class="!isValidName ? 'border-red-500' : ''" class="p-2 bg-transparent text-white focus:outline-0 focus:border-white border-b-[2px] border-gray-500" type="text" placeholder="Enter Item name"/>
                <input v-model="stockAmount" @input="isValidAmount = true" :class="!isValidAmount ? 'border-red-500' : ''" class="p-2 bg-transparent text-white focus:outline-0 focus:border-white border-b-[2px] border-gray-500" type="number" placeholder="Enter amount"/>
                <select v-model="stockMetrics" @change="isValidMetrics = true" required :class="!isValidMetrics ? 'border-red-500' : ''" class="p-2 pl-[5px] bg-transparent focus:outline-0 focus:border-white border-b-[2px] border-gray-500">
                    <option value="" disabled selected hidden>Select Metrics</option>
                    <option value="pcs">pcs</option>
                    <option vlaue="sqf">sqf</option>
                </select>
                <p v-if="!isValidName || !isValidAmount || !isValidMetrics" class="p-2 text-red-400">Validation Error</p>
            </div>
        </Modal>
    </div>
</template>

<script setup>
import { ClientOnly } from '#components'

definePageMeta({
    layout:''
});

definePageMeta({
    middleware: ['auth']
})

const isModalOpen = ref(false);
const isEditModeOn = ref(false);
const stockName = ref('');
const stockAmount = ref('');
const stockMetrics = ref('');
const isValidName = ref(true);
const isValidAmount = ref(true);
const isValidMetrics = ref(true);
const stockList = ref([]);   // Local modifiable copy
const originalStockList = ref([]);
const searchText = ref('');
const client = useSupabaseClient();
const user = useSupabaseUser();

const searchQuery = gql`
  query SearchStocks($search: String!) {
    stock(where: { name: { _ilike: $search } }) {
      id
      name
      amount
      metrics
    }
  }
`;
const { result: stocks, refetch } = useQuery(searchQuery, {
    search: '%%' // default: returns all
});

const insertStockMutation = gql`
    mutation MyMutation($amount: Float!, $name: String!, $metrics: String!) {
        insert_stock_one(object: { amount: $amount, name: $name, metrics: $metrics }) {
            amount
            id
            name
            metrics
        }
    }
`;
const { mutate:insertMutation, onDone, onError } = useMutation(insertStockMutation);

const deleteStockMutation = gql`
    mutation MyMutation($id: Int!) {
        delete_stock_by_pk(id: $id) {
            name
        }
    }
`;
const {mutate:deletionMutation} = useMutation(deleteStockMutation);

const updateStockMutation = gql`
  mutation UpdateStock($id: Int!, $amount: Float!, $name: String!) {
    update_stock_by_pk(pk_columns: { id: $id }, _set: { amount: $amount, name: $name }) {
      id
      name
      amount
    }
  }
`;
const { mutate: updateStock } = useMutation(updateStockMutation);

const addStock = async (itemAmount, itemName, itemMetrics) => {
    if (stockName.value == '' || stockAmount.value == '' || stockMetrics.value == ''){
        stockName.value == '' ? isValidName.value = false : isValidName.value = true;
        stockAmount.value == '' ? isValidAmount.value = false : isValidAmount.value = true;
        stockMetrics.value == '' ? isValidMetrics.value = false : isValidMetrics.value = true;
    } else {
        try {
            await insertMutation({
                name: itemName,
                amount: itemAmount,
                metrics: itemMetrics
            });
            cancelModal();
            await refetch();
            onDone((result) => {
                console.log("Inserted:", result.data.insert_stock_one);
            });
    
            onError((error) => {
                console.error("Error inserting stock:", error);
            });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    }
};

const saveStock = async (stock) => {
  try {
    await updateStock({
      id: stock.id,
      name: stock.name,
      amount: stock.amount
    });
    // Update the originalStockList entry
    const index = originalStockList.value.findIndex(s => s.id === stock.id);
    if (index !== -1) {
      originalStockList.value[index] = { ...stock };
    }
    await refetch();
    console.log("Updated:", stock);
  } catch (error) {
    console.error("Error updating stock:", error);
  }
};

const deleteStock = async (itemId) => {
    if (confirm('⚠️ Are you sure? ' + itemId + ' will be removed')){
        try {
            await deletionMutation({
                id: itemId
            });
            await refetch();
        } catch (error) {
            console.error("Unexpected error: ", error);
        }
    }
}

const cancelModal = () => {
    // clear input values
    stockName.value = '';
    stockAmount.value = '';
    stockMetrics.value = '';
    isValidName.value = true;
    isValidAmount.value = true;
    isValidMetrics.value = true;
    // close the modal
    isModalOpen.value = false;
}

// Watch the query result and update the local list
watchEffect(() => {
  if (stocks.value?.stock) {
    // Clone the data so it's no longer read-only
    stockList.value = stocks.value.stock.map(s => ({ ...s }));
  }
});

watchEffect(() => {
  if (stocks.value?.stock) {
    const original = stocks.value.stock.map(s => ({ ...s }));
    originalStockList.value = original;
    stockList.value = original.map(s => ({ ...s })); // separate clone for editing
  }
});

const resetChanges = () => {
  stockList.value = originalStockList.value.map(s => ({ ...s }));
};

const isStockModified = (stock) => {
  const original = originalStockList.value.find(s => s.id === stock.id);
  if (!original) return false;
  return stock.name !== original.name || stock.amount !== original.amount;
};

// Debounced handler for search
const handleSearch = () => {
  const keyword = searchText.value.trim();

  // if empty input, return all
  const searchParam = keyword === '' ? '%%' : `%${keyword}%`;

  refetch({ search: searchParam });
};

// function to log out
const logout = async () => {
    await client.auth.signOut()
    navigateTo('/login')
}

// send not loged in user to login page
onMounted(() => {
    watchEffect(() => {
        if(!user.value) {
            navigateTo('/login')
        } else {
            // insert or update the user information

            // logedInUser.value.name = user.value.user_metadata.name,
            // logedInUser.value.email = user.value.email
        }
    })
})
</script>

<style scoped>
td, th {
    @apply py-6 px-12
}

/* tr:not(:last-child) {
    @apply border-b-[1px] border-[#dddddd];
} */

/* td:not(:last-child) {
    @apply border-r-[1px] border-[#dddddd];
} */

tr:nth-child(even) {
    @apply bg-gray-800
}

select:invalid { 
    @apply text-gray-400 
}

option {
    @apply bg-black text-white
}
</style>
<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                <div class="bg-primary-950 text-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                    <!-- Modal Header -->
                    <div class="flex justify-between items-center">
                        <h2 class="text-lg text-primary-200 font-bold">Add Item</h2>
                        <button @click="closeModal" class="text-primary-500 text-3xl">
                            <icon name="ic:round-close" />
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="mt-4">
                        <slot />
                    </div>

                    <!-- Modal Footer -->
                    <div class="mt-6 flex justify-end gap-3">
                        <button @click="cancelModal" class="px-4 py-[2px] border-[2px] border-primary-200 rounded-[5px] text-primary-200">
                            Cancel
                        </button>
                        <button @click="saveItem" class="px-4 py-[2px] bg-primary-500 rounded-[5px] text-white">
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
  
  <script setup>
  defineProps({
    isOpen: Boolean
  });
  
  const emit = defineEmits(["close", "save", "cancel"]);
  
  const closeModal = () => {
    emit("close");
  };
  const cancelModal = () => {
    emit("cancel");
  }
  const saveItem = () => {
    emit("save");
  };
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  </style>
  
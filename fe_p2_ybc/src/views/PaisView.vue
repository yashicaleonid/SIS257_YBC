<script setup lang="ts">
import PaisList from '@/components/pais/PaisList.vue'
import PaisSave from '@/components/pais/PaisSave.vue'
import type { Pais } from '@/models/pais'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const paisListRef = ref<typeof PaisList | null>(null)
const paisEdit = ref<any>(null)

function handleCreate() {
  paisEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(pais: Pais) {
  paisEdit.value = pais
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  paisListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="m-7 flex flex-column overflow-hidden">
    <h2>Países</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" class="col-3" />
    <PaisList ref="paisListRef" @edit="handleEdit" />
    <PaisSave
      :mostrar="mostrarDialog"
      :pais="paisEdit"
      :modoEdicion="!!paisEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>

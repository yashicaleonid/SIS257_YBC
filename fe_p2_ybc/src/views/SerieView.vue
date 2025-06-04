<script setup lang="ts">
import SerieList from '@/components/serie/SerieList.vue'
import SerieSave from '@/components/serie/SerieSave.vue'
import type { Serie } from '@/models/serie'
import { Button } from 'primevue'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const serieListRef = ref<typeof SerieList | null>(null)
const serieEdit = ref<any>(null)

function handleCreate() {
  serieEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(serie: Serie) {
  serieEdit.value = serie
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  serieListRef.value?.obtenerLista()
}
</script>

<template>
  <div class="m-7 flex flex-column overflow-hidden">
    <h2>Series</h2>
    <Button label="Crear Nuevo" icon="pi pi-plus" @click="handleCreate" class="col-3" />
    <SerieList ref="serieListRef" @edit="handleEdit" />
    <SerieSave
      :mostrar="mostrarDialog"
      :serie="serieEdit"
      :modoEdicion="!!serieEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>

<style scoped></style>

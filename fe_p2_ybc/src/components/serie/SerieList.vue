<script setup lang="ts">
import type { Serie } from '@/models/serie'
import http from '@/plugins/axios'
import { ref, onMounted, computed } from 'vue'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const ENDPOINT = 'series'
const series = ref<Serie[]>([])
const emit = defineEmits(['edit'])
const serieDelete = ref<Serie | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  series.value = await http.get(ENDPOINT).then((response) => response.data)
}

const seriesFiltradas = computed(() => {
  return series.value.filter(
    (serie) =>
      serie.titulo.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.director.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      serie.pais.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

function emitirEdicion(serie: Serie) {
  emit('edit', serie)
}

function mostrarEliminarConfirm(serie: Serie) {
  serieDelete.value = serie
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  if (!serieDelete.value?.id) return
  await http.delete(`${ENDPOINT}/${serieDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-2">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText
          v-model="busqueda"
          type="text"
          placeholder="Buscar por título o director o país o tipo de clasificación"
        />
      </InputGroup>
    </div>
    <DataTable
      :value="seriesFiltradas"
      paginator
      scrollable
      scrollHeight="flex"
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
      tableStyle="min-width: 50rem"
    >
      <Column field="titulo" header="Título" sortable />
      <Column field="director" header="Director" sortable />
      <Column field="temporadas" header="Temporadas" />
      <Column field="fechaEstreno" header="Fecha de Estreno" />
      <Column field="pais.descripcion" header="País" />
      <Column header="Acciones" frozen alignFrozen="right" style="min-width: 120px">
        <template #body="{ data }">
          <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(data)" />
          <Button
            icon="pi pi-trash"
            aria-label="Eliminar"
            severity="danger"
            text
            @click="mostrarEliminarConfirm(data)"
          />
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar esta serie?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>

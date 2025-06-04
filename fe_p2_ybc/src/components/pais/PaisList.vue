<script setup lang="ts">
import type { Pais } from '@/models/pais'
import http from '@/plugins/axios'
import { Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue'
import Button from 'primevue/button'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'paises' 
const paises = ref<Pais[]>([])
const emit = defineEmits(['edit'])
const paisDelete = ref<Pais | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  paises.value = await http.get(ENDPOINT).then((response) => response.data)
}

const paisesFiltrados = computed(() => {
  return paises.value.filter((pais) =>
    pais.descripcion.toLowerCase().includes(busqueda.value.toLowerCase()),
  )
})

function emitirEdicion(pais: Pais) {
  emit('edit', pais)
}

function mostrarEliminarConfirm(pais: Pais) {
  paisDelete.value = pais
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  if (!paisDelete.value?.id) return
  try {
    await http.delete(`${ENDPOINT}/${paisDelete.value?.id}`)
    obtenerLista()
    mostrarConfirmDialog.value = false
  } catch (error: any) {
    alert('No se puede eliminar el país porque tiene series asociadas')
    mostrarConfirmDialog.value = false
  }
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <div class="col-7 pl-0 mt-3">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-search"></i></InputGroupAddon>
        <InputText v-model="busqueda" type="text" placeholder="Buscar por descripción" />
      </InputGroup>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nro</th>
          <th>Descripcion</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pais, index) in paisesFiltrados" :key="pais.id">
          <td>{{ index + 1 }}</td>
          <td>{{ pais.descripcion }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(pais)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              severity="danger"
              text
              @click="mostrarEliminarConfirm(pais)"
            />
          </td>
        </tr>
        <tr v-if="paisesFiltrados.length === 0">
          <td colspan="4">No se encontraron resultados.</td>
        </tr>
      </tbody>
    </table>
    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
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

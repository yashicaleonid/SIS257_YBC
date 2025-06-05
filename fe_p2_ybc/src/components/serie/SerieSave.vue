<script setup lang="ts">
import type { Serie } from '@/models/serie'
import type { Pais } from '@/models/pais'
import http from '@/plugins/axios'
import { Select } from 'primevue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import { ref, computed, watch } from 'vue'

const plataformas = [
  { label: 'Netflix', value: 'Netflix' },
  { label: 'Disney+', value: 'Disney+' },
  { label: 'Max', value: 'Max' },
  { label: 'Paramount+', value: 'Paramount+' },
  { label: 'Amazon Premium', value: 'Amazon Premium' }
]

const props = defineProps({
  mostrar: Boolean,
  serie: {
    type: Object as () => Serie,
    default: () => ({}) as Serie,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const paises = ref<Pais[]>([])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const serie = ref<Serie>({ ...(props.serie || { pais: { id: 0 } }) })

async function obtenerPaises() {
  paises.value = await http.get('paises').then((response) => response.data)
}

async function handleSave() {
  try {
    const body = {
      idPais: serie.value.pais.id,
      titulo: serie.value.titulo,
      sinopsis: serie.value.sinopsis,
      director: serie.value.director,
      temporadas: serie.value.temporadas,
      plataforma_principal: serie.value.plataforma_principal,
      fechaEstreno: serie.value.fechaEstreno
        ? serie.value.fechaEstreno.toISOString().split('T')[0] 
        : null,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${serie.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    serie.value = {} as Serie
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}

watch(
  () => props.mostrar,
  (nuevoValor) => {
    if (nuevoValor) {
      obtenerPaises()
      if (props.modoEdicion) {
        serie.value = { ...props.serie }
        if (serie.value.fechaEstreno && !(serie.value.fechaEstreno instanceof Date)) {
          serie.value.fechaEstreno = new Date(serie.value.fechaEstreno)
        }
      } else {

        serie.value = {
          titulo: '',
          sinopsis: '',
          director: '',
          temporadas: 1,
          plataforma_principal: '',
          fechaEstreno: new Date(),
          pais: { id: 0, descripcion: '' },
        }
      }
    }
  },
)
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="(props.modoEdicion ? 'Editar' : 'Crear') + ' Serie'"
      style="width: 30rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="pais" class="font-semibold w-3">País</label>
        <Select
          id="pais"
          v-model="serie.pais.id"
          :options="paises"
          optionLabel="descripcion"
          optionValue="id"
          placeholder="Seleccione un país"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="titulo" class="font-semibold w-3">Título</label>
        <InputText
          id="titulo"
          v-model="serie.titulo"
          class="flex-auto"
          autocomplete="off"
          autofocus
          maxlength="250"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="sinopsis" class="font-semibold w-3">Sinopsis</label>
        <InputText
          id="sinopsis"
          v-model="serie.sinopsis"
          class="flex-auto"
          autocomplete="off"
          maxlength="5000"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="director" class="font-semibold w-3">Director</label>
        <InputText
          id="director"
          v-model="serie.director"
          class="flex-auto"
          autocomplete="off"
          maxlength="100"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="temporadas" class="font-semibold w-3">Temporadas</label>
        <InputNumber v-model="serie.temporadas" class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fecha_estreno" class="font-semibold w-3">Fecha de estreno</label>
        <Calendar v-model="serie.fechaEstreno" date-format="yy-mm-dd" showIcon class="flex-auto" />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="plataforma_principal" class="font-semibold w-3">Plataforma Principal</label>
        <Select
          id="plataforma_principal"
          v-model="serie.plataforma_principal"
          :options="plataformas"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleccione una plataforma"
          class="flex-auto"
          autofocus
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

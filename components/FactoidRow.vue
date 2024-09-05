<template>
    <v-col>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field density="compact" v-model="row.label" label="Labelを入力" outlined />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
        </v-col>
        <v-col cols="12" md="1">
          <v-btn @click="removeRow" color="red">DEL</v-btn>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn @click="addChild">ADD SUBTYPE</v-btn>
        </v-col>
      </v-row>
  
      <v-col v-for="(child, childIndex) in row.children" :key="childIndex" class="pl-15">
        <FactoidRow :row="child" :removeRow="() => removeChild(childIndex)" />
      </v-col>
    </v-col>
  </template>
  
  <script>
  export default {
    name: "FactoidRow",
    props: {
      row: {
        type: Object,
        child: Array,
        required: true,
      },
      removeRow: {
        type: Function,
        required: true,
      },
    },
    methods: {
        addChild() {
        if (!this.row.children) {
            this.row.children = [];
        }
        this.row.children.push({ label: "", id: "", children: [] });
        },
        removeChild(index) {
        this.row.children.splice(index, 1);
        },
    },
  };
  </script>
  
<template>
    <v-app>
        <v-container>
            <div class="main-container">
                <p>Editorに設定ファイルとしてアップロードするJSONをインターフェイス上で編集することができます。</p>
            </div>

            <!--ファクトイド・タイプの入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">ファクトイドのタイプを設定</p>
                    <v-btn class="add-button" @click="addFactoidTypeRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in factoidTypeRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.label" label="Labelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeFactoidTypeRow(index)">削除</v-btn>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-btn @click="addFactoidSubTypeRow(index)">サブタイプを入力</v-btn>
                            </v-col>
                        </v-row>
                        <v-col v-for="(child, childIndex) in row.children" :key="childIndex" class="pl-15">
                            <v-row>
                                **
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeFactoidSubTypeRow(index, childIndex)">削除</v-btn>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-btn @click="addFactoidSub2TypeRow(index, childIndex)">サブサブタイプを入力</v-btn>
                                </v-col>
                            </v-row>
                            <v-col v-for="(grandChild, grandChildIndex) in child.children" :key="grandChildIndex" class="pl-15">
                            <v-row>
                                ***
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeFactoidSub2TypeRow(index, childIndex, grandChildIndex)">削除</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        </v-col>
                    </v-col>
                    <!--{{ factoidTypeRows }}-->
                </div>
            </v-card>

            <!--ファクトイドデータ項目の入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">ファクトイドのデータ入力項目を設定</p>
                    <v-btn class="add-button" @click="addFactoidDataRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in factoidDataRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.title" label="Titleを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.label" label="Labelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.model" label="Modelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <treeselect
                                    :multiple="false"
                                    :options="dataTypes"
                                    placeholder="Typeを選択"
                                    v-model="row.type"
                                />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeFactoidDataRow(index)">削除</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!--{{ factoidDataRows }}-->
                </div>
            </v-card>

            <!--エンティティ・タイプの入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">エンティティのタイプを設定</p>
                    <v-btn class="add-button" @click="addEntityTypeRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in entityTypeRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.label" label="Labelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeEntityTypeRow(index)">削除</v-btn>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-btn @click="addEntitySubTypeRow(index)">サブタイプを入力</v-btn>
                            </v-col>
                        </v-row>
                        <v-col v-for="(child, childIndex) in row.children" :key="childIndex" class="pl-15">
                            <v-row>
                                **
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeEntitySubTypeRow(index, childIndex)">削除</v-btn>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-btn @click="addEntitySub2TypeRow(index, childIndex)">サブサブタイプを入力</v-btn>
                                </v-col>
                            </v-row>
                            <v-col v-for="(grandChild, grandChildIndex) in child.children" :key="grandChildIndex" class="pl-15">
                            <v-row>
                                ***
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeEntitySub2TypeRow(index, childIndex, grandChildIndex)">削除</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        </v-col>
                    </v-col>
                    <!--{{ factoidTypeRows }}-->
                </div>
            </v-card>

            <!--エンティティデータ項目の入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">エンティティのデータ入力項目を設定</p>
                    <v-btn class="add-button" @click="addEntityDataRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in entityDataRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.title" label="Titleを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.label" label="Labelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.model" label="Modelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <treeselect
                                    :multiple="true"
                                    :options="entityTypes"
                                    placeholder="対象タイプを選択"
                                    v-model="row.attachedType"
                                />
                            </v-col>
                            <v-col cols="12" md="2">
                                <treeselect
                                    :multiple="false"
                                    :options="dataTypes"
                                    placeholder="Typeを選択"
                                    v-model="row.type"
                                />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeEntityDataRow(index)">削除</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!--{{ factoidDataRows }}-->
                </div>
            </v-card>

            <!--エッジ・タイプの入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">エッジのタイプを設定</p>
                    <v-btn class="add-button" @click="addEdgeTypeRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in edgeTypeRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.label" label="Labelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeEdgeTypeRow(index)">削除</v-btn>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-btn @click="addEdgeSubTypeRow(index)">サブタイプを入力</v-btn>
                            </v-col>
                        </v-row>
                        <v-col v-for="(child, childIndex) in row.children" :key="childIndex" class="pl-15">
                            <v-row>
                                **
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeEdgeSubTypeRow(index, childIndex)">削除</v-btn>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-btn @click="addEdgeSub2TypeRow(index, childIndex)">サブサブタイプを入力</v-btn>
                                </v-col>
                            </v-row>
                            <v-col v-for="(grandChild, grandChildIndex) in child.children" :key="grandChildIndex" class="pl-15">
                            <v-row>
                                ***
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeEdgeSub2TypeRow(index, childIndex, grandChildIndex)">削除</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        </v-col>
                    </v-col>
                    <!--{{ factoidTypeRows }}-->
                </div>
            </v-card>

            <!--ファクトイド関係・タイプの入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">ファクトイド・リレーションのタイプを設定</p>
                    <v-btn class="add-button" @click="addFactoidRelationTypeRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in factoidRelationTypeRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.label" label="Labelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeFactoidRelationTypeRow(index)">削除</v-btn>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-btn @click="addFactoidRelationSubTypeRow(index)">サブタイプを入力</v-btn>
                            </v-col>
                        </v-row>
                        <v-col v-for="(child, childIndex) in row.children" :key="childIndex" class="pl-15">
                            <v-row>
                                **
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeFactoidRelationSubTypeRow(index, childIndex)">削除</v-btn>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-btn @click="addFactoidRelationSub2TypeRow(index, childIndex)">サブサブタイプを入力</v-btn>
                                </v-col>
                            </v-row>
                            <v-col v-for="(grandChild, grandChildIndex) in child.children" :key="grandChildIndex" class="pl-15">
                            <v-row>
                                ***
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeFactoidRelationSub2TypeRow(index, childIndex, grandChildIndex)">削除</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        </v-col>
                    </v-col>
                    <!--{{ factoidTypeRows }}-->
                </div>
            </v-card>

            <!--prefixの入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">prefixを設定</p>
                    <v-btn class="add-button" @click="addPrefixRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in prefixRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.label" label="prefixを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.id" label="名前空間URIを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removePrefixRow(index)">削除</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!--{{ factoidTypeRows }}-->
                </div>
            </v-card>

            <!--colorの入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">配色を設定</p>
                    <v-btn class="add-button" @click="addColorRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in colorRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.label" label="色を入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="6">
                                <treeselect
                                    :multiple="false"
                                    :options="colorTypes"
                                    placeholder="色を紐づけるタイプを選択"
                                    v-model="row.type"
                                />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeColorRow(index)">削除</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!--{{ colorRows }}-->
                </div>
            </v-card>

            <!--キュレーション・タイプの入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">キュレーションのタイプを設定</p>
                    <v-btn class="add-button" @click="addCurationTypeRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in curationTypeRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.label" label="Labelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeCurationTypeRow(index)">削除</v-btn>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-btn @click="addCurationSubTypeRow(index)">サブタイプを入力</v-btn>
                            </v-col>
                        </v-row>
                        <v-col v-for="(child, childIndex) in row.children" :key="childIndex" class="pl-15">
                            <v-row>
                                **
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="child.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeCurationSubTypeRow(index, childIndex)">削除</v-btn>
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-btn @click="addCurationSub2TypeRow(index, childIndex)">サブサブタイプを入力</v-btn>
                                </v-col>
                            </v-row>
                            <v-col v-for="(grandChild, grandChildIndex) in child.children" :key="grandChildIndex" class="pl-15">
                            <v-row>
                                ***
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.label" label="Labelを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="3">
                                    <v-text-field density="compact" v-model="grandChild.id" label="IDを入力"
                                        outlined />
                                </v-col>
                                <v-col cols="12" md="1">
                                    <v-btn @click="removeCurationSub2TypeRow(index, childIndex, grandChildIndex)">削除</v-btn>
                                </v-col>
                            </v-row>
                        </v-col>
                        </v-col>
                    </v-col>
                    <!--{{ factoidTypeRows }}-->
                </div>
            </v-card>

            <!--キュレーションデータ項目の入力カード-->
            <v-card class="input-card">
                <div>
                    <p class="card-title">キュレーションのデータ入力項目を設定</p>
                    <v-btn class="add-button" @click="addCurationDataRow">+</v-btn>
                    <v-col class="input-row" v-for="(row, index) in curationDataRows" :key="index">
                        <v-row>
                            *
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.title" label="Titleを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.label" label="Labelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.model" label="Modelを入力"
                                    outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-text-field density="compact" v-model="row.id" label="IDを入力" outlined />
                            </v-col>
                            <v-col cols="12" md="2">
                                <treeselect
                                    :multiple="true"
                                    :options="curationTypes"
                                    placeholder="対象タイプを選択"
                                    v-model="row.attachedType"
                                />
                            </v-col>
                            <v-col cols="12" md="2">
                                <treeselect
                                    :multiple="false"
                                    :options="dataTypes"
                                    placeholder="Typeを選択"
                                    v-model="row.type"
                                />
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="removeCurationDataRow(index)">削除</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                    <!--{{ curationDataRows }}-->
                </div>
            </v-card>

            <v-btn class="dl-button" @click="downloadJSON">JSONダウンロード</v-btn>
            <!--{{colorTypes}}-->
        </v-container>
    </v-app>
</template>

<script setup>
import { ref, watch } from "vue";
import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";

const factoidTypeLabel = ref("");
const factoidTypeId = ref("");
const factoidTypeRows = ref([]);

const factoidDataTitle = ref("");
const factoidDataLabel = ref("");
const factoidDataModel = ref("");
const factoidDataType = ref(null);
const factoidDataId = ref("");
const factoidDataRows = ref([]);

const entityTypeLabel = ref("");
const entityTypeId = ref("");
const entityTypeRows = ref([]);

const entityDataTitle = ref("");
const entityDataLabel = ref("");
const entityDataModel = ref("");
const entityDataType = ref(null);
const entityDataId = ref("");
const entityDataAttachedType = ref(null);
const entityDataRows = ref([]);

const curationTypeLabel = ref("");
const curationTypeId = ref("");
const curationTypeRows = ref([]);

const curationDataTitle = ref("");
const curationDataLabel = ref("");
const curationDataModel = ref("");
const curationDataType = ref(null);
const curationDataId = ref("");
const curationDataAttachedType = ref(null);
const curationDataRows = ref([]);

const edgeTypeLabel = ref("");
const edgeTypeId = ref("");
const edgeTypeRows = ref([]);

const factoidRelationTypeLabel = ref("");
const factoidRelationTypeId = ref("");
const factoidRelationTypeRows = ref([]);

const prefixLabel = ref("");
const prefixId = ref("");
const prefixRows = ref([]);

const colorLabel = ref("");
const colorId = ref("");
const colorRows = ref([]);


const dataTypes = ref([
    {
        "id": "text",
        "label": "TEXT",
    },
    {
        "id": "uri",
        "label": "URI"
    },
    {
        "id": "number",
        "label": "NUMBER"
    }
])

const entityTypes = ref(null)
watch(entityTypeRows.value, (val) => {
    const types = []
    for (const row of val) {
        types.push({
            "label": row.label,
            "id": row.id
        })
        if (row.children) {
            for (const child of row.children) {
                types.push({
                    "label": child.label,
                    "id": child.id
                })
                if (child.children) {
                    for (const grandChild of child.children) {
                        types.push({
                            "label": grandChild.label,
                            "id": grandChild.id
                        })
                    }
                }
            }
        }
    }
    entityTypes.value = types
});

const curationTypes = ref(null)
watch(curationTypeRows.value, (val) => {
    const types = []
    for (const row of val) {
        types.push({
            "label": row.label,
            "id": row.id
        })
        if (row.children) {
            for (const child of row.children) {
                types.push({
                    "label": child.label,
                    "id": child.id
                })
                if (child.children) {
                    for (const grandChild of child.children) {
                        types.push({
                            "label": grandChild.label,
                            "id": grandChild.id
                        })
                    }
                }
            }
        }
    }
    curationTypes.value = types
});

const colorTypes = ref(null);
watch([entityTypeRows.value, factoidTypeRows.value], () => {
    const types = [];
    for (const row of [...entityTypeRows.value, ...factoidTypeRows.value]) {
        types.push({
            "label": row.label,
            "id": row.id
        });
        if (row.children) {
            for (const child of row.children) {
                types.push({
                    "label": child.label,
                    "id": child.id
                });
                if (child.children) {
                    for (const grandChild of child.children) {
                        types.push({
                            "label": grandChild.label,
                            "id": grandChild.id
                        });
                    }
                }
            }
        }
    }
    colorTypes.value = types;
});

//ファクトイドタイプの追加・削除
function addFactoidTypeRow() {
    factoidTypeRows.value.push({ label: factoidTypeLabel.value, id: factoidTypeId.value });
};

function addFactoidSubTypeRow(index) {
    if (!factoidTypeRows.value[index].children) {
        factoidTypeRows.value[index].children = [];
    };
    factoidTypeRows.value[index].children.push({ label: factoidTypeLabel.value, id: factoidTypeId.value });
};

function addFactoidSub2TypeRow(index, childIndex) {
    if (!factoidTypeRows.value[index].children[childIndex].children) {
        factoidTypeRows.value[index].children[childIndex].children = [];
    };
    factoidTypeRows.value[index].children[childIndex].children.push({ label: factoidTypeLabel.value, id: factoidTypeId.value });
};

function removeFactoidTypeRow(index) {
    factoidTypeRows.value.splice(index, 1);
};

function removeFactoidSubTypeRow(index, childIndex) {
    factoidTypeRows.value[index].children.splice(childIndex, 1);
};
function removeFactoidSub2TypeRow(index, childIndex, grandChildIndex) {
    factoidTypeRows.value[index].children[childIndex].children.splice(grandChildIndex, 1);
};

//ファクトイドデータ項目の追加・削除
function addFactoidDataRow() {
    factoidDataRows.value.push({ 
        title: factoidDataTitle.value,
        label: factoidDataLabel.value, 
        id: factoidDataId.value,
        model: factoidDataModel.value,
        type: factoidDataType.value
    });
};

function removeFactoidDataRow(index) {
    factoidDataRows.value.splice(index, 1);
};

//エンティティタイプの追加・削除
function addEntityTypeRow() {
    entityTypeRows.value.push({ label: entityTypeLabel.value, id: entityTypeId.value });
};

function addEntitySubTypeRow(index) {
    if (!entityTypeRows.value[index].children) {
        entityTypeRows.value[index].children = [];
    };
    entityTypeRows.value[index].children.push({ label: entityTypeLabel.value, id: entityTypeId.value });
};

function addEntitySub2TypeRow(index, childIndex) {
    if (!entityTypeRows.value[index].children[childIndex].children) {
        entityTypeRows.value[index].children[childIndex].children = [];
    };
    entityTypeRows.value[index].children[childIndex].children.push({ label: entityTypeLabel.value, id: entityTypeId.value });
};

function removeEntityTypeRow(index) {
    entityTypeRows.value.splice(index, 1);
};

function removeEntitySubTypeRow(index, childIndex) {
    entityTypeRows.value[index].children.splice(childIndex, 1);
};
function removeEntitySub2TypeRow(index, childIndex, grandChildIndex) {
    entityTypeRows.value[index].children[childIndex].children.splice(grandChildIndex, 1);
};

//エンティティデータ項目の追加・削除
function addEntityDataRow() {
    entityDataRows.value.push({ 
        title: entityDataTitle.value,
        label: entityDataLabel.value, 
        id: entityDataId.value,
        attachedType: entityDataAttachedType.value,
        model: entityDataModel.value,
        type: entityDataType.value
    });
};

function removeEntityDataRow(index) {
    entityDataRows.value.splice(index, 1);
};

//キュレーションタイプの追加・削除
function addCurationTypeRow() {
    curationTypeRows.value.push({ label: curationTypeLabel.value, id: curationTypeId.value });
};

function addCurationSubTypeRow(index) {
    if (!curationTypeRows.value[index].children) {
        curationTypeRows.value[index].children = [];
    };
    curationTypeRows.value[index].children.push({ label: curationTypeLabel.value, id: curationTypeId.value });
};

function addCurationSub2TypeRow(index, childIndex) {
    if (!curationTypeRows.value[index].children[childIndex].children) {
        curationTypeRows.value[index].children[childIndex].children = [];
    };
    curationTypeRows.value[index].children[childIndex].children.push({ label: curationTypeLabel.value, id: curationTypeId.value });
};

function removeCurationTypeRow(index) {
    curationTypeRows.value.splice(index, 1);
};

function removeCurationSubTypeRow(index, childIndex) {
    curationTypeRows.value[index].children.splice(childIndex, 1);
};
function removeCurationSub2TypeRow(index, childIndex, grandChildIndex) {
    curationTypeRows.value[index].children[childIndex].children.splice(grandChildIndex, 1);
};

//キュレーションデータ項目の追加・削除
function addCurationDataRow() {
    curationDataRows.value.push({ 
        title: curationDataTitle.value,
        label: curationDataLabel.value, 
        id: curationDataId.value,
        attachedType: curationDataAttachedType.value,
        model: curationDataModel.value,
        type: curationDataType.value
    });
};

function removeCurationDataRow(index) {
    curationDataRows.value.splice(index, 1);
};

//エッジタイプの追加・削除
function addEdgeTypeRow() {
    edgeTypeRows.value.push({ label: edgeTypeLabel.value, id: edgeTypeId.value });
};

function addEdgeSubTypeRow(index) {
    if (!edgeTypeRows.value[index].children) {
        edgeTypeRows.value[index].children = [];
    };
    edgeTypeRows.value[index].children.push({ label: edgeTypeLabel.value, id: edgeTypeId.value });
};

function addEdgeSub2TypeRow(index, childIndex) {
    if (!edgeTypeRows.value[index].children[childIndex].children) {
        edgeTypeRows.value[index].children[childIndex].children = [];
    };
    edgeTypeRows.value[index].children[childIndex].children.push({ label: edgeTypeLabel.value, id: edgeTypeId.value });
};

function removeEdgeTypeRow(index) {
    edgeTypeRows.value.splice(index, 1);
};

function removeEdgeSubTypeRow(index, childIndex) {
    edgeTypeRows.value[index].children.splice(childIndex, 1);
};
function removeEdgeSub2TypeRow(index, childIndex, grandChildIndex) {
    edgeTypeRows.value[index].children[childIndex].children.splice(grandChildIndex, 1);
};

//ファクトイド関係タイプの追加・削除
function addFactoidRelationTypeRow() {
    factoidRelationTypeRows.value.push({ label: factoidRelationTypeLabel.value, id: factoidRelationTypeId.value });
};

function addFactoidRelationSubTypeRow(index) {
    if (!factoidRelationTypeRows.value[index].children) {
        factoidRelationTypeRows.value[index].children = [];
    };
    factoidRelationTypeRows.value[index].children.push({ label: factoidRelationTypeLabel.value, id: factoidRelationTypeId.value });
};

function addFactoidRelationSub2TypeRow(index, childIndex) {
    if (!factoidRelationTypeRows.value[index].children[childIndex].children) {
        factoidRelationTypeRows.value[index].children[childIndex].children = [];
    };
    factoidRelationTypeRows.value[index].children[childIndex].children.push({ label: factoidRelationTypeLabel.value, id: factoidRelationTypeId.value });
};

function removeFactoidRelationTypeRow(index) {
    factoidRelationTypeRows.value.splice(index, 1);
};

function removeFactoidRelationSubTypeRow(index, childIndex) {
    factoidRelationTypeRows.value[index].children.splice(childIndex, 1);
};
function removeFactoidRelationSub2TypeRow(index, childIndex, grandChildIndex) {
    factoidRelationTypeRows.value[index].children[childIndex].children.splice(grandChildIndex, 1);
};

//prefixの追加・削除
function addPrefixRow() {
    prefixRows.value.push({ label: prefixLabel.value, id: prefixId.value });
};

function removePrefixRow(index) {
    prefixRows.value.splice(index, 1);
};

//colorの追加・削除
function addColorRow() {
    colorRows.value.push({ label: colorLabel.value, id: colorId.value });
};

function removeColorRow(index) {
    colorRows.value.splice(index, 1);
};



function downloadJSON() {

    const colorData = {}
    for (const row of colorRows.value) {
        colorData[row.type] = row.label;
    }

    const data = {
        "NodeTypeSelect": {
            "data": factoidTypeRows.value
        },
        "EntityTypeSelect": {
            "data": entityTypeRows.value
        },
        "CurationTypeSelect": {
            "data": curationTypeRows.value
        },
        "EdgeTypeSelect": {
            "data": edgeTypeRows.value
        },
        "FactoidRelationSelect": {
            "data": factoidRelationTypeRows.value
        },
        "NodeData": {
            "data": factoidDataRows.value
        },
        "EntityData": {
            "data": entityDataRows.value
        },
        "CurationData": {
            "data": curationDataRows.value
        },
        "Prefixes": {
            "data": prefixRows.value
        },
        "Colors": {
            "data": colorData
        }
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "settings.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

</script>

<style>
.main-container {
    /*max-width: 1200px;*/
    color: #666;
    margin: 20px auto;
    padding: 20px;
    font-weight: bold;
}

.input-card {
    /*width: 800px;*/
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 60px;
    padding: 20px;
    max-height: 300px;
    overflow-y: auto;
}

.card-title {
    font-size: large;
    font-weight: bold;
}

.add-button {
    margin-top: 20px;
    margin-bottom: 10px;
}

.dl-button {
    margin-top: 20px;
    margin-left: 20px;
}

.input-row {
    margin-top: 10px;
}
</style>
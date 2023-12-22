<script setup lang="ts">
import CETEI from "CETEIcean";

interface Entity {
    "@context": string;
    "@id": string;
    "@type": string;
    "http://www.w3.org/2000/01/rdf-schema#label"?: string;
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#referencesEntity"?: string;
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasTag"?: string[];
}

const teiHTML = ref<string>("");
const { $OpenSeadragon, /*$Annotorious*/ } = useNuxtApp();
const route = useRoute();
const manifest: string = route.query.manifest
    ? String(route.query.manifest)
    : "https://dl.ndl.go.jp/api/iiif/1307825/manifest.json";

const canvasImageMap: { [key: string]: string } = {};

const currentIndex = ref(0);
const text = ref("");
const uri = ref("");
const height = ref(0);
const result = ref<Entity>({} as Entity);

const CETEIcean = new CETEI();
CETEIcean.getHTML5(
    "https://raw.githubusercontent.com/TEIC/CETEIcean/master/test/testTEI.xml",
    function (data: HTMLElement) {
        teiHTML.value = data.outerHTML;
    }
);

// async
onMounted(async () => {
    height.value = window.innerHeight - 64;

    const res = await fetch(manifest);
    const json = await res.json();

    const canvases = json.sequences[0].canvases;

    const tileSources = canvases.map((canvas: any) => {
        const infoUrl = canvas.images[0].resource["@id"].replace(
            "/full/full/0/default.jpg",
            "/info.json"
        );
        canvasImageMap[infoUrl] = canvas["@id"];
        return infoUrl;
    });

    const config: any = {
        sequenceMode: true,
        id: "osd",
        tileSources,
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
    };

    const viewer = $OpenSeadragon(config);

    viewer.addHandler("page", function (event) {
        currentIndex.value = event.page;
    });

});

</script>
<template>
    <v-container>
        <v-row dense>
            <v-col sm="6">
                <div>
                    <div id="tei" v-html="teiHTML" />
                </div>
            </v-col>
            <v-col sm="6">
                <div id="osd" style="width: 100%; background-color: black" :style="`height: ${height * 0.99}px`"></div>
            </v-col>
        </v-row>
    </v-container>
</template>
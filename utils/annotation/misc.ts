// 定数のURL設定
const defaultPrefixes = [/*{
    "id": "https://junjun7613.github.io/MicroKnowledge/himiko.owl#",
    "label": "ex"
    },*/
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/factoid/",
        "label": "factoid",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/reference/",
        "label": "entity"
    }/*,
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/property/",
        "label":"property"
    }*/
]

const defaultColors = {
    "https://junjun7613.github.io/MicroKnowledge/class/EventFactoid": 'red',
    "https://junjun7613.github.io/MicroKnowledge/class/Dedication": 'darkred',
    //"https://junjun7613.github.io/MicroKnowledge/himiko.owl#ContactFactoid": 'crimson',
    //"https://junjun7613.github.io/MicroKnowledge/himiko.owl#StatementFactoid": 'coral',
    //"https://junjun7613.github.io/MicroKnowledge/himiko.owl#ThoughtFactoid": 'lightcoral',
    "https://junjun7613.github.io/MicroKnowledge/class/StateOfAffairsFactoid": 'blue',
    //"https://junjun7613.github.io/MicroKnowledge/himiko.owl#SituationFactoid": 'mediumblue',
    "https://junjun7613.github.io/MicroKnowledge/class/OfficeFactoid": 'royalblue',
    //"https://junjun7613.github.io/MicroKnowledge/himiko.owl#OccupationFactoid": 'deepskyblue',
    //"https://junjun7613.github.io/MicroKnowledge/himiko.owl#PossessionFactoid": 'lightskyblue',
    "https://junjun7613.github.io/MicroKnowledge/class/RelationsipFactoid": 'green',
    "https://junjun7613.github.io/MicroKnowledge/class/FamilialRelationshipFactoid": 'seagreen',
    "https://junjun7613.github.io/MicroKnowledge/class/SocialRelationshipFactoid": 'mediumseagreen',
    //"https://junjun7613.github.io/MicroKnowledge/himiko.owl#GeoFactoid": 'olive',
    "https://junjun7613.github.io/MicroKnowledge/class/PersonReference": 'turquoise',
    "https://junjun7613.github.io/MicroKnowledge/class/OrgReference": 'indianred',
    "https://junjun7613.github.io/MicroKnowledge/class/PlaceReference": 'limegreen',
    "https://junjun7613.github.io/MicroKnowledge/class/DateReference": 'gold',
    "https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference": 'indigo',
    "https://junjun7613.github.io/MicroKnowledge/class/OfficeReference": 'darkorange',
    "https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference": 'blueviolet'
}

const defaultNodeTypeSelect = [
    {
        "id": 'https://junjun7613.github.io/MicroKnowledge/class/EventFactoid',
        "label": "Event",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Dedication',
                "label": "Dedication",
            },
        ],
    },
    {
        "id": 'https://junjun7613.github.io/MicroKnowledge/class/StateOfAffairsFactoid',
        "label": "State of Affairs",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/OfficeFactoid',
                "label": "Office",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/RelationsipFactoid',
                "label": "Relationship",
                "children": [
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/FamilialRelationshipFactoid',
                        "label": "FamilialRelationship",
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/SocialRelationshipFactoid',
                        "label": "SocialRelationship",
                    }
                ],
            }
        ],
    },
];

const defaultEntityTypeSelect = [
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PersonReference",
        "label": "Person",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/OrgReference",
        "label": "Organization",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PlaceReference",
        "label": "Place",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/DateReference",
        "label": "Date",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference",
        "label": "Object",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference",
        "label": "Concept",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/OfficeReference',
                "label": "Office",
            },
        ],
    }
];

const defaultEdgeTypeSelect = [
    {
        "label": "Dedication",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/dedication',
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/property/dedicant',
                "label": "Dedicant",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/property/dedicatee',
                "label": "Dedicatee",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/property/dedicated',
                "label": "Dedicated",
            },
        ],
    },
    {
        "label": "Office",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/office',
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/property/officeHolder',
                "label": "Holder",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/property/officeHolded',
                "label": "Holded",
            },
        ],
    },
];

const defaultCurationTypeSelect = [
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PersonReference",
        "label": "Person",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/OrgReference",
        "label": "Organization",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PlaceReference",
        "label": "Place",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/DateReference",
        "label": "Date",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference",
        "label": "Physical object",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference",
        "label": "Conceptual object",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/OfficeReference',
                "label": "Office",
            },
        ],
    }
];

const defaultFactoidRelationSelect = [
    {
        "label": "Because",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/because',
    },
    {
        "label": "Therefore",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/therefore',
    },
    {
        "label": "During",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/during',
    }
];

const defaultEntityData = [
    /*
    { 
        title: "役割を入力", 
        label: "Role", 
        model: "roleInput", 
        type: "text", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/himiko.owl#PersonReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasRole" 
    },
    */
    { 
        title: "外部URIを入力", 
        label: "External URI", 
        model: "externalURIInput", 
        type: "uri", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference", "https://junjun7613.github.io/MicroKnowledge/class/OrgReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/class/referencesEntity" 
    },
]

const defaultNodeData = [
    { 
        title: "コメントを入力", 
        label: "Comment", 
        model: "comment", 
        type: "text", 
        id: "https://junjun7613.github.io/MicroKnowledge/property/hasComment" 
    },
    { 
        title: "典拠情報を入力", 
        label: "Source", 
        model: "sourceCitation", 
        type: "uri", 
        id: "https://junjun7613.github.io/MicroKnowledge/property/hasSourceCitation" 
    },
]

const defaultCurationData = [
    { 
        title: "翻刻", 
        label: "Transcription", 
        model: "transcription", 
        type: "text", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/property/hasTranscriotion" 
    },
    { 
        title: "コメント", 
        label: "Comment", 
        model: "comment", 
        type: "text", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference", "https://junjun7613.github.io/MicroKnowledge/class/OrgReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/property/hasComment" 
    },
]

// エクスポート
export {
    defaultPrefixes,
    defaultColors,
    defaultNodeTypeSelect,
    defaultEntityTypeSelect,
    defaultEdgeTypeSelect,
    defaultCurationTypeSelect,
    defaultFactoidRelationSelect,
    defaultEntityData,
    defaultNodeData,
    defaultCurationData,
};
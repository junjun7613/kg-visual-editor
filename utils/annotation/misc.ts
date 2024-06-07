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
        "label": "出来事",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Dedication',
                "label": "奉献",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Honoring',
                "label": "顕彰",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Mourning',
                "label": "追悼",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Decree',
                "label": "決議",
            },
        ],
    },
    {
        "id": 'https://junjun7613.github.io/MicroKnowledge/class/StateOfAffairsFactoid',
        "label": "状態・状況",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/OfficeFactoid',
                "label": "役職在任",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/AffiliationFactoid',
                "label": "所属",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/StatusFactoid',
                "label": "身分",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/RelationsipFactoid',
                "label": "関係",
                "children": [
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/FamilialRelationshipFactoid',
                        "label": "親族関係",
                        "children": [
                            {
                                "id": 'https://junjun7613.github.io/MicroKnowledge/class/HusbandWifeFactoid',
                                "label": "夫ー妻",
                            },
                            {
                                "id": 'https://junjun7613.github.io/MicroKnowledge/class/FatherSonFactoid',
                                "label": "父ー子",
                            },
                        ],
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/SocialRelationshipFactoid',
                        "label": "社会関係",
                        "children": [
                            {
                                "id": 'https://junjun7613.github.io/MicroKnowledge/class/PatronageFactoid',
                                "label": "パトロネジ",
                            },
                            {
                                "id": 'https://junjun7613.github.io/MicroKnowledge/class/ExSlaveFactoid',
                                "label": "被解放関係",
                            },
                        ],
                    }
                ],
            }
        ],
    },
];

const defaultEntityTypeSelect = [
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PersonReference",
        "label": "人物",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/OrgReference",
        "label": "組織・集団",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PlaceReference",
        "label": "場所",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/DateReference",
        "label": "日時",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference",
        "label": "モノ",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference",
        "label": "概念・概念的モノ",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/OfficeReference',
                "label": "役職",
            },
        ],
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/LexiconReference",
        "label": "語彙",
    }
];

const defaultEdgeTypeSelect = [
    {
        "label": "主体・主語",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/subject',
    },
    {
        "label": "述部・述語",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/predicate',
    },
    {
        "label": "直接的な対象（直接目的語）",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/directObject',
    },
    {
        "label": "間接的な対象（関節目的語）",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/indirectObject',
    },
    {
        "label": "始まり",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/hasStartTime',
    },
    {
        "label": "終わり",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/hasEndTime',
    },
    {
        "label": "場所",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/hasLocation',
    },
    {
        "label": "関連する人・組織・モノ・概念",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/hasRelatedEntity',
    },
];

const defaultCurationTypeSelect = [
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PersonReference",
        "label": "人物",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/OrgReference",
        "label": "組織・集団",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PlaceReference",
        "label": "場所",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/DateReference",
        "label": "日時",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference",
        "label": "モノ",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference",
        "label": "概念・概念的モノ",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/OfficeReference',
                "label": "役職",
            },
        ],
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/class/LexiconReference",
        "label": "語彙",
    }
];

const defaultEntityRelationSelect = [
    {
        "label": "なぜなら",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/because',
    },
    {
        "label": "それゆえ",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/therefore',
    }
];

const defaultFactoidRelationSelect = [
    {
        "label": "なぜなら",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/because',
    },
    {
        "label": "それゆえ",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/therefore',
    },
    {
        "label": "の間",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/during',
    },
    {
        "label": "の前に生じた",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/before',
    },
    {
        "label": "の後に生じた",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/after',
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
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference", "https://junjun7613.github.io/MicroKnowledge/class/OrgReference", "https://junjun7613.github.io/MicroKnowledge/class/PlaceReference", "https://junjun7613.github.io/MicroKnowledge/class/DateReference", "https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference", "https://junjun7613.github.io/MicroKnowledge/class/OfficeReference", "https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference", "https://junjun7613.github.io/MicroKnowledge/class/LexiconReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/class/referencesEntity" 
    },
    { 
        title: "（生物学的）性別", 
        label: "(Biological) Sex", 
        model: "SexInput", 
        type: "text", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/class/sex" 
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
        title: "典拠URIを入力", 
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
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference","https://junjun7613.github.io/MicroKnowledge/class/OrgReference","https://junjun7613.github.io/MicroKnowledge/class/PlaceReference","https://junjun7613.github.io/MicroKnowledge/class/DateReference","https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference","https://junjun7613.github.io/MicroKnowledge/class/OfficeReference","https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference","https://junjun7613.github.io/MicroKnowledge/class/LexiconReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/property/hasTranscriotion" 
    },
    { 
        title: "コメント", 
        label: "Comment", 
        model: "comment", 
        type: "text", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference", "https://junjun7613.github.io/MicroKnowledge/class/OrgReference", "https://junjun7613.github.io/MicroKnowledge/class/PlaceReference", "https://junjun7613.github.io/MicroKnowledge/class/DateReference", "https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference", "https://junjun7613.github.io/MicroKnowledge/class/OfficeReference", "https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference", "https://junjun7613.github.io/MicroKnowledge/class/LexiconReference"],
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
    defaultEntityRelationSelect,
    defaultFactoidRelationSelect,
    defaultEntityData,
    defaultNodeData,
    defaultCurationData,
};
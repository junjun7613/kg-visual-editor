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
        "label": "reference"
    }/*,
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/property/",
        "label":"property"
    }*/
]

const defaultColors = {
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#EventFactoid": 'red',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#ActionFactoid": 'darkred',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#ContactFactoid": 'crimson',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#StatementFactoid": 'coral',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#ThoughtFactoid": 'lightcoral',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#StateOfAffairsFactoid": 'blue',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#SituationFactoid": 'mediumblue',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#OfficeFactoid": 'royalblue',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#OccupationFactoid": 'deepskyblue',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#PossessionFactoid": 'lightskyblue',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#RelationsipFactoid": 'green',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#FamilialRelationshipFactoid": 'seagreen',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#SocialRelationshipFactoid": 'mediumseagreen',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#GeoFactoid": 'olive',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#PersonReference": 'turquoise',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#OrgReference": 'indianred',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#PlaceReference": 'limegreen',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#DateReference": 'gold',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#PhysicalObjReference": 'indigo',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#ConceptualObjReference": 'blueviolet'
}

const defaultNodeTypeSelect = [
    {
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#EventFactoid',
        "label": "Event",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#ActionFactoid',
                "label": "Action",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#ContactFactoid',
                "label": "Contact",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#StatementFactoid',
                "label": "Statement",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#ThoughtFactoid',
                "label": "Thought",
            },
        ],
    },
    {
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#StateOfAffairsFactoid',
        "label": "State of Affairs",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#SituationFactoid',
                "label": "Situation",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#OfficeFactoid',
                "label": "Office",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#OccupationFactoid',
                "label": "Occupation",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#PossessionFactoid',
                "label": "Possession",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#RelationsipFactoid',
                "label": "Relationship",
                "children": [
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#FamilialRelationshipFactoid',
                        "label": "FamilialRelationship",
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#SocialRelationshipFactoid',
                        "label": "SocialRelationship",
                    }
                ],
            }
        ],
    },
    {
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#GeoFactoid',
        "label": "Geography",
    }
];

const defaultEntityTypeSelect = [
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/himiko.owl#PersonReference",
        "label": "Person",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/himiko.owl#OrgReference",
        "label": "Organization",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/himiko.owl#PlaceReference",
        "label": "Place",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/himiko.owl#DateReference",
        "label": "Date",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/himiko.owl#PhysicalObjReference",
        "label": "Physical object",
    },
    {
        "id": "https://junjun7613.github.io/MicroKnowledge/himiko.owl#ConceptualObjReference",
        "label": "Conceptual object",
    }
];

const defaultEdgeTypeSelect = [
    {
        "label": "Subject",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#subject',
    },
    {
        "label": "Object",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#object',
    },
    {
        "label": "Of",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#of',
    },
    {
        "label": "At",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#at',
    },
    {
        "label": "To",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#to',
    },
    {
        "label": "On",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#on',
    },
    {
        "label": "In",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#in',
    },
    {
        "label": "For",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#for',
    },
    {
        "label": "By",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#by',
    },
    {
        "label": "With",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#with',
    },
    {
        "labe": "From",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#from',
    },
    {
        "label": "Before",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#before',
    },
    {
        "label": "After",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#after',
    },
    {
        "label": "About",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#about',
    },
    {
        "label": "Near",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#near',
    },
    {
        "label": "Until",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#until',
    },
    {
        "label": "As",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#as',
    }
];

const defaultFactoidRelationSelect = [
    {
        "label": "Because",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#because',
    },
    {
        "label": "Therefore",
        "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#therefore',
    }
];

const defaultEntityData = [
    { 
        title: "ラベルを入力", 
        label: "label", 
        model: "label", 
        type: "text", 
        id: "https://junjun7613.github.io/MicroKnowledge/himiko.owl#label" 
    },
    { 
        title: "役割を入力", 
        label: "Role", 
        model: "roleInput", 
        type: "text", 
        id: "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasRole" 
    },
    { 
        title: "外部URIを入力", 
        label: "External URI", 
        model: "externalURIInput", 
        type: "uri", 
        id: "https://junjun7613.github.io/MicroKnowledge/himiko.owl#referencesEntity" 
    },
]

const defaultNodeData = [
    { 
        title: "ラベルを入力", 
        label: "label", 
        model: "label", 
        type: "text", 
        id: "https://junjun7613.github.io/MicroKnowledge/himiko.owl#label" 
    },
    { 
        title: "詳細タイプを入力", 
        label: "Type Detail", 
        model: "detailedType", 
        type: "text", 
        id: "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasDetailedType" 
    },
    { 
        title: "史料（文字列）を入力", 
        label: "Source", 
        model: "sourceCitation", 
        type: "text", 
        id: "https://junjun7613.github.io/MicroKnowledge/himiko.owl#hasSourceCitation" 
    },
]

// エクスポート
export {
    defaultPrefixes,
    defaultColors,
    defaultNodeTypeSelect,
    defaultEntityTypeSelect,
    defaultEdgeTypeSelect,
    defaultFactoidRelationSelect,
    defaultEntityData,
    defaultNodeData
};
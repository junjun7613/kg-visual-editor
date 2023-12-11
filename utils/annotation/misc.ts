// 定数のURL設定
const defaultPrefixes = [{
    "id": "https://junjun7613.github.io/MicroKnowledge/himiko.owl#",
    "label": "ex"
    },
    {
    "id": "https://junjun7613.github.io/MicroKnowledge/factoid/",
    "label": "factoid",
    },
    {
    "id": "https://junjun7613.github.io/MicroKnowledge/reference/",
    "label":"reference"
    }
]

const defaultColors = {
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#ActionFactoid": 'red',
    "https://junjun7613.github.io/MicroKnowledge/himiko.owl#ContactFactoid": 'blue'
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
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#labelFactoid',
                "label": "label",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/himiko.owl#PropertyFactoid',
                "label": "Property",
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
      "id": "$https://junjun7613.github.io/MicroKnowledge/himiko.owl#PersonReference",
      "label": "Person",
    },
    {
      "id": "$https://junjun7613.github.io/MicroKnowledge/himiko.owl#OrgReference",
      "label": "Organization",
    },
    {
        "id": "$https://junjun7613.github.io/MicroKnowledge/himiko.owl#PlaceReference",
        "label": "Place",
    },
    {
        "id": "$https://junjun7613.github.io/MicroKnowledge/himiko.owl#DateReference",
        "label": "Date",
    },
    {
        "id": "$https://junjun7613.github.io/MicroKnowledge/himiko.owl#PhysicalObjReference",
        "label": "Physical object",
    },
    {
        "id": "$https://junjun7613.github.io/MicroKnowledge/himiko.owl#ConceptualObjReference",
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

// エクスポート
export {
    defaultPrefixes,
    defaultColors,
    defaultNodeTypeSelect,
    defaultEntityTypeSelect,
    defaultEdgeTypeSelect
};
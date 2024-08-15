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
    "https://junjun7613.github.io/MicroKnowledge/class/Honoring": 'red',
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
        "id": 'https://junjun7613.github.io/MicroKnowledge/class/Activity',
        "label": "Activity",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Dedication',
                "label": "Dedication",
                "children": [
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/DivineDedication',
                        "label": 'Divine dedication'
                    }
                ]
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Honoring',
                "label": "Honoring",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Mourning',
                "label": "Mourning",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Decree',
                "label": "Decree",
                "children": [
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/MunicipalDecree',
                        "label": 'Municipal decree',
                    }
                ]
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Donation',
                "label": "Donation",
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Transaction',
                "label": "Transaction",
            },
        ],
    },
    {
        "id": 'https://junjun7613.github.io/MicroKnowledge/class/StateOfAffairsFactoid',
        "label": "State of affairs",
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/OfficeHold',
                "label": "Office",
                "children": [
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/StateOfficeHold',
                        "label": 'State office-hold'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/MunicialOfficeHold',
                        "label": 'Municipal office-hold'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/VillageOfficeHold',
                        "label": 'Village office-hold'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/ProvateOfficeHold',
                        "label": 'Private office-hold'
                    }
                ]
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Affiliation',
                "label": "Affiliation",
                "children": [
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/Citizen',
                        "label": 'is citizen of'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/Member',
                        "label": 'is member of'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/Patron',
                        "label": 'is patron of'
                    }
                ]
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Status',
                "label": "Status",
                "children": [
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/Senatorial',
                        "label": 'Senatorial'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/Equites',
                        "label": 'Equites'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/Equites',
                        "label": 'Equites'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/Decuriones',
                        "label": 'Decuriones'
                    },
                    {
                        "id": 'https://junjun7613.github.io/MicroKnowledge/class/possessor',
                        "label": 'Possessor'
                    }
                ]
            },
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/class/Relation',
                "label": "Relation",
                "children": [
                    {
                        "id": 'http://data.snapdrgn.net/ontology/snap#AllianceWith',
                        "label": "Alliance with",
                        "children": [
                            {
                                "id": 'http://data.snapdrgn.net/ontology/snap#FriendshipFor',
                                "label": "Friendship for",
                            },
                        ],
                    },
                    {
                        "id": 'http://data.snapdrgn.net/ontology/snap#ExtendedHouseholdOf',
                        "label": "Extended househod of",
                        "children": [
                            {
                                "id": 'http://data.snapdrgn.net/ontology/snap#SlaveOf',
                                "label": "Slave of",
                                "children":[
                                    {
                                        "id": 'http://data.snapdrgn.net/ontology/snap#HouseSlaveOf',
                                        "label": 'House slave of',
                                    }
                                ],
                            },
                            {
                                "id": 'http://data.snapdrgn.net/ontology/snap#HouseHoldOf',
                                "label": "Household of",
                                "children":[
                                    {
                                        "id": 'http://data.snapdrgn.net/ontology/snap#HouseSlaveOf',
                                        "label": 'House slave of',
                                    }
                                ],
                            },
                            {
                                "id": 'http://data.snapdrgn.net/ontology/snap#FreedSlaveOf',
                                "label": "Freed slave of",
                                "children":[
                                    {
                                        "id": 'http://data.snapdrgn.net/ontology/snap#FreedmanOf',
                                        "label": 'Freed man of',
                                    },
                                    {
                                        "id": 'http://data.snapdrgn.net/ontology/snap#FreedwomanOf',
                                        "label": 'Freed woman of',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "id": 'http://data.snapdrgn.net/ontology/snap#QualifierRelationship',
                        "label": 'Qualifier relationship',
                        "children": [
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#ClaimedFamilyRelationship',
                                "label":'Claimed family relationship',
                            },
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#AcknowledgedFamilyRelationship',
                                "label":'Acknowledged family relationship',
                            },
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#StepFamilyRelationship',
                                "label":'Step family relationship',
                            },
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#InLawFamilyRelationship',
                                "label":'In law family relationship',
                            },
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#AdoptedFamilyRelationship',
                                "label":'Adopted family relationship',
                            },
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#FosterFamilyRelationship',
                                "label":'Foster family relationship',
                            },
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#HalfFamilyRelationship',
                                "label":'Half family relationship',
                            },
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#MaternalFamilyRelationship',
                                "label":'Maternal family relationship',
                            },
                            {
                                "id":'http://data.snapdrgn.net/ontology/snap#PaternalFamilyRelationship',
                                "label":'Paternal family relationship',
                            },
                        ]
                    },
                    {
                        "id":'http://data.snapdrgn.net/ontology/snap#KinOf',
                        "label": 'Kin of',
                        "children": [
                            {
                                "id": 'http://data.snapdrgn.net/ontology/snap#FamilyOf',
                                "label": 'Family of',
                                "children": [
                                    {
                                        "id": 'http://data.snapdrgn.net/ontology/snap#HereditaryFamilyOf',
                                        "label": 'Hereditary family of',
                                        "children": [
                                            {
                                                "id": 'http://data.snapdrgn.net/ontology/snap#SiblingOf',
                                                "label": 'Sibling of',
                                                "children": [
                                                    {
                                                        "id": 'http://data.snapdrgn.net/ontology/snap#BrotherOf',
                                                        "label": 'Brother of'
                                                    },
                                                    {
                                                        "id": 'http://data.snapdrgn.net/ontology/snap#SisterOf',
                                                        "label": 'Sister of'
                                                    }
                                                ]
                                            },
                                            {
                                                "id": 'http://data.snapdrgn.net/ontology/snap#ParentOf',
                                                "label": 'Parent of',
                                                "children": [
                                                    {
                                                        "id": 'http://data.snapdrgn.net/ontology/snap#MotherOf',
                                                        "label": 'Mother of'
                                                    },
                                                    {
                                                        "id": 'http://data.snapdrgn.net/ontology/snap#FatherOf',
                                                        "label": 'Father of'
                                                    }
                                                ]
                                            },
                                            {
                                                "id": 'http://data.snapdrgn.net/ontology/snap#ChildOf',
                                                "label": 'Child of',
                                                "children": [
                                                    {
                                                        "id": 'http://data.snapdrgn.net/ontology/snap#DaughterOf',
                                                        "label": 'Daughter of'
                                                    },
                                                    {
                                                        "id": 'http://data.snapdrgn.net/ontology/snap#SonOf',
                                                        "label": 'Son of'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "id": 'http://data.snapdrgn.net/ontology/snap#EmnityFor',
                        "label": 'Emnity for'
                    },
                    {
                        "id": 'http://data.snapdrgn.net/ontology/snap#ProfessionalRelationship',
                        "label": 'Professional relationship'
                    },
                    {
                        "id": 'http://data.snapdrgn.net/ontology/snap#IntimateRelationshipWith',
                        "label": 'Intimate relationship with',
                        "children": [
                            {
                                "id": 'http://data.snapdrgn.net/ontology/snap#SeriousIntimateRelationshipWith',
                                "laebel": 'Serious intimate relationship with',
                                "children": [
                                    {
                                        "id": 'http://data.snapdrgn.net/ontology/snap#LegallyRecognizedRelationshipWith',
                                        "label": 'Legally recognized relationship with'
                                    }
                                ]
                            },
                            {
                                "id": 'http://data.snapdrgn.net/ontology/snap#CasualIntimateRelationshipWith',
                                "laebel": 'Casual intimate relationship with',
                            }
                        ]
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
        "label": "relation",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/relation',
        "children": [
            {
                "id": 'https://junjun7613.github.io/MicroKnowledge/property/alliedWith',
                "label": 'allied with'
            }
        ]
    },
    {
        "label": "夫婦",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/spouse',
    },
    {
        "label": "友人",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/friend',
    }
];

const defaultFactoidRelationSelect = [
    {
        "label": "因果関係",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/causalRelation',
        "children": [
            {
                "label": "なぜなら",
                "id": 'https://junjun7613.github.io/MicroKnowledge/property/because',
            },
            {
                "label": "それゆえ",
                "id": 'https://junjun7613.github.io/MicroKnowledge/property/therefore',
            },
        ]
    },
    {
        "label": "時系列",
        "id": 'https://junjun7613.github.io/MicroKnowledge/property/chronologicalRelation',
        "children": [
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
        ]
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
        title: "典拠データを入力", 
        label: "External URI", 
        model: "externalURIInput", 
        type: "uri", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference", "https://junjun7613.github.io/MicroKnowledge/class/OrgReference", "https://junjun7613.github.io/MicroKnowledge/class/PlaceReference", "https://junjun7613.github.io/MicroKnowledge/class/DateReference", "https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference", "https://junjun7613.github.io/MicroKnowledge/class/OfficeReference", "https://junjun7613.github.io/MicroKnowledge/class/ConceptualObjReference", "https://junjun7613.github.io/MicroKnowledge/class/LexiconReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/class/referencesEntity" 
    },
    { 
        title: "ジェンダー", 
        label: "Gender", 
        model: "SexInput", 
        type: "text", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PersonReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/class/sex" 
    },
    { 
        title: "単位", 
        label: "Unit", 
        model: "UnitInput", 
        type: "text", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/class/unity" 
    },
    { 
        title: "数量", 
        label: "Quantity", 
        model: "QuantityInput", 
        type: "text", 
        attachedType: ["https://junjun7613.github.io/MicroKnowledge/class/PhysicalObjReference"],
        id: "https://junjun7613.github.io/MicroKnowledge/class/quantity" 
    },
]

const defaultNodeData = [
    { 
        title: "コメント", 
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
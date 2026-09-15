
export type ServiceLevel = 'All' | 'INDIAN ARMY' | 'INDIAN NAVY' | 'INDIAN AIR FORCE' | 'TRI-SERVICE COMMANDS';

export interface ReferenceSource {
  label: string;
  url: string;
  note: string;
}

export interface Command {
  name: string;
  hq: string;
  coverage: string;
  hqCoordinates: [number, number];
  coverageStates: string[];
  bases?: { name: string; coordinates: [number, number] }[];
  sources?: ReferenceSource[];
}

export interface ForceOrganization {
  approximateStrength: string;
  officers: string[];
  jcos: string[];
  ors: string[];
}

export interface NotableHero {
  name: string;
  slug: string;
  award: string;
  note: string;
}

export interface UnitDetail {
  name: string;
  type: string;
  service: string;
  motto: string;
  warCry: string;
  strength: string;
  baseLocation: string;
  history: string;
  victories: string;
  heroes: string;
  notableHeroes?: NotableHero[];
  sources?: ReferenceSource[];
}

export interface Force {
  name: ServiceLevel;
  organization: ForceOrganization;
  commands: Command[];
  sources?: ReferenceSource[];
}

export type PublishedCommand = Command & { sources: ReferenceSource[] };
export type PublishedForce = Omit<Force, "commands" | "sources"> & { commands: PublishedCommand[]; sources: ReferenceSource[] };
export type PublishedUnitDetail = Omit<UnitDetail, "sources"> & { sources: ReferenceSource[] };

export const FORCES_DATA: Force[] = [
  {
    name: 'INDIAN ARMY',
    organization: {
      approximateStrength: 'Current personnel strength is not shown; authorised and active totals vary by source and date.',
      officers: ['General', 'Lieutenant General', 'Major General', 'Brigadier', 'Colonel', 'Lieutenant Colonel', 'Major', 'Captain', 'Lieutenant'],
      jcos: ['Subedar Major', 'Subedar', 'Naib Subedar'],
      ors: ['Havildar', 'Naik', 'Lance Naik', 'Sepoy']
    },
    commands: [
    {
        "name": "Northern Command",
        "hq": "Udhampur",
        "coverage": "Jammu & Kashmir, Ladakh",
        "hqCoordinates": [
            32.9255,
            75.1354
        ],
        "coverageStates": [
            "Jammu and Kashmir",
            "Himachal Pradesh",
            "Punjab",
            "Ladakh"
        ],
        "bases": [
            {
                "name": "Srinagar (15 Corps)",
                "coordinates": [
                    34.0837,
                    74.7973
                ]
            },
            {
                "name": "Nagrota (16 Corps)",
                "coordinates": [
                    32.7937,
                    74.9126
                ]
            },
            {
                "name": "Leh (14 Corps)",
                "coordinates": [
                    34.1526,
                    77.5771
                ]
            },
            {
                "name": "Akhnoor Base",
                "coordinates": [
                    32.8804,
                    74.735
                ]
            },
            {
                "name": "Poonch Garrison",
                "coordinates": [
                    33.7712,
                    74.0934
                ]
            },
            {
                "name": "Rajouri Base",
                "coordinates": [
                    33.3828,
                    74.3015
                ]
            },
            {
                "name": "Kupwara Camp",
                "coordinates": [
                    34.5262,
                    74.2546
                ]
            },
            {
                "name": "Baramulla Garrison",
                "coordinates": [
                    34.1983,
                    74.3644
                ]
            },
            {
                "name": "Kargil Base",
                "coordinates": [
                    34.5539,
                    76.1349
                ]
            },
            {
                "name": "Dras Post",
                "coordinates": [
                    34.43,
                    75.76
                ]
            },
            {
                "name": "Awantipora Camp",
                "coordinates": [
                    33.9248,
                    75.0189
                ]
            }
        ]
    },
    {
        "name": "Western Command",
        "hq": "Chandimandir",
        "coverage": "Punjab, Haryana, Delhi, Himachal Pradesh",
        "hqCoordinates": [
            30.7161,
            76.8834
        ],
        "coverageStates": [
            "Punjab",
            "Haryana",
            "Delhi",
            "Himachal Pradesh"
        ],
        "bases": [
            {
                "name": "Ambala (2 Corps)",
                "coordinates": [
                    30.3752,
                    76.7821
                ]
            },
            {
                "name": "Jalandhar (11 Corps)",
                "coordinates": [
                    31.326,
                    75.5762
                ]
            },
            {
                "name": "Pathankot Base",
                "coordinates": [
                    32.2658,
                    75.6468
                ]
            },
            {
                "name": "Amritsar Cantt",
                "coordinates": [
                    31.634,
                    74.8723
                ]
            },
            {
                "name": "Firozpur Cantt",
                "coordinates": [
                    30.912,
                    74.612
                ]
            },
            {
                "name": "Ludhiana Cantt",
                "coordinates": [
                    30.901,
                    75.8523
                ]
            },
            {
                "name": "Patiala Cantt",
                "coordinates": [
                    30.33,
                    76.3869
                ]
            },
            {
                "name": "Hisar Cantt",
                "coordinates": [
                    29.1492,
                    75.7217
                ]
            },
            {
                "name": "Kapurthala Base",
                "coordinates": [
                    31.38,
                    75.38
                ]
            },
            {
                "name": "Palampur Cantt",
                "coordinates": [
                    32.1109,
                    76.5363
                ]
            }
        ]
    },
    {
        "name": "Eastern Command",
        "hq": "Kolkata",
        "coverage": "West Bengal, Sikkim, North East States",
        "hqCoordinates": [
            22.5726,
            88.3639
        ],
        "coverageStates": [
            "West Bengal",
            "Sikkim",
            "Assam",
            "Arunachal Pradesh",
            "Meghalaya",
            "Nagaland",
            "Manipur",
            "Mizoram",
            "Tripura"
        ],
        "bases": [
            {
                "name": "Tezpur (4 Corps)",
                "coordinates": [
                    26.6528,
                    92.7926
                ]
            },
            {
                "name": "Sukna (33 Corps)",
                "coordinates": [
                    26.7904,
                    88.3601
                ]
            },
            {
                "name": "Dimapur (3 Corps)",
                "coordinates": [
                    25.906,
                    93.7259
                ]
            },
            {
                "name": "Panagarh Base",
                "coordinates": [
                    23.456,
                    87.427
                ]
            },
            {
                "name": "Rangia Cantt",
                "coordinates": [
                    26.435,
                    91.626
                ]
            },
            {
                "name": "Tenga Valley Post",
                "coordinates": [
                    27.2,
                    92.42
                ]
            },
            {
                "name": "Zakhama Cantt",
                "coordinates": [
                    25.592,
                    94.135
                ]
            },
            {
                "name": "Binnaguri Cantt",
                "coordinates": [
                    26.756,
                    89.043
                ]
            },
            {
                "name": "Leimakhong Base",
                "coordinates": [
                    24.935,
                    93.84
                ]
            },
            {
                "name": "Agartala Cantt",
                "coordinates": [
                    23.8315,
                    91.2868
                ]
            }
        ]
    },
    {
        "name": "Southern Command",
        "hq": "Pune",
        "coverage": "Maharashtra, Gujarat, Rajasthan, Southern States",
        "hqCoordinates": [
            18.5204,
            73.8567
        ],
        "coverageStates": [
            "Maharashtra",
            "Gujarat",
            "Goa",
            "Karnataka",
            "Kerala",
            "Tamil Nadu",
            "Andhra Pradesh"
        ],
        "bases": [
            {
                "name": "Bhopal (21 Corps)",
                "coordinates": [
                    23.2599,
                    77.4126
                ]
            },
            {
                "name": "Jodhpur (12 Corps)",
                "coordinates": [
                    26.2389,
                    73.0243
                ]
            },
            {
                "name": "Ahmednagar Cantt",
                "coordinates": [
                    19.0952,
                    74.7496
                ]
            },
            {
                "name": "Secunderabad Cantt",
                "coordinates": [
                    17.4399,
                    78.4983
                ]
            },
            {
                "name": "Deolali Cantt",
                "coordinates": [
                    19.932,
                    73.83
                ]
            },
            {
                "name": "Wellington Cantt",
                "coordinates": [
                    11.366,
                    76.786
                ]
            },
            {
                "name": "Belagavi Cantt",
                "coordinates": [
                    15.8497,
                    74.5055
                ]
            },
            {
                "name": "Chennai Cantt",
                "coordinates": [
                    13.0827,
                    80.2707
                ]
            },
            {
                "name": "Thiruvananthapuram Cantt",
                "coordinates": [
                    8.5241,
                    76.9366
                ]
            },
            {
                "name": "Bhuj Cantt",
                "coordinates": [
                    23.242,
                    69.6669
                ]
            }
        ]
    },
    {
        "name": "South Western Command",
        "hq": "Jaipur",
        "coverage": "Rajasthan, parts of Punjab and Haryana",
        "hqCoordinates": [
            26.9124,
            75.7873
        ],
        "coverageStates": [
            "Rajasthan",
            "Haryana",
            "Punjab"
        ],
        "bases": [
            {
                "name": "Mathura (1 Corps)",
                "coordinates": [
                    27.4924,
                    77.6737
                ]
            },
            {
                "name": "Bathinda (10 Corps)",
                "coordinates": [
                    30.211,
                    74.9455
                ]
            },
            {
                "name": "Bikaner Cantt",
                "coordinates": [
                    28.0229,
                    73.3119
                ]
            },
            {
                "name": "Suratgarh Base",
                "coordinates": [
                    29.319,
                    73.896
                ]
            },
            {
                "name": "Alwar Cantt",
                "coordinates": [
                    27.553,
                    76.6346
                ]
            },
            {
                "name": "Kota Cantt",
                "coordinates": [
                    25.2138,
                    75.8648
                ]
            },
            {
                "name": "Ganganagar Cantt",
                "coordinates": [
                    29.9038,
                    73.8772
                ]
            },
            {
                "name": "Bharatpur Cantt",
                "coordinates": [
                    27.2152,
                    77.49
                ]
            },
            {
                "name": "Sriganganagar Base",
                "coordinates": [
                    29.908,
                    73.879
                ]
            },
            {
                "name": "Jaisalmer Military Station",
                "coordinates": [
                    26.9157,
                    70.9083
                ]
            }
        ]
    },
    {
        "name": "Central Command",
        "hq": "Lucknow",
        "coverage": "Uttar Pradesh, Uttarakhand, Madhya Pradesh, Bihar, Odisha, Jharkhand, Chhattisgarh",
        "hqCoordinates": [
            26.8467,
            80.9462
        ],
        "coverageStates": [
            "Uttar Pradesh",
            "Uttaranchal",
            "Madhya Pradesh",
            "Bihar",
            "Orissa",
            "Jharkhand",
            "Chhattisgarh",
            "Uttarakhand"
        ],
        "bases": [
            {
                "name": "Meerut Cantt",
                "coordinates": [
                    29.0064,
                    77.7121
                ]
            },
            {
                "name": "Bareilly Cantt",
                "coordinates": [
                    28.367,
                    79.4304
                ]
            },
            {
                "name": "Agra Cantt",
                "coordinates": [
                    27.1598,
                    77.9634
                ]
            },
            {
                "name": "Jabalpur Cantt",
                "coordinates": [
                    23.1815,
                    79.9864
                ]
            },
            {
                "name": "Mhow Cantt",
                "coordinates": [
                    22.551,
                    75.762
                ]
            },
            {
                "name": "Roorkee Cantt",
                "coordinates": [
                    29.8543,
                    77.888
                ]
            },
            {
                "name": "Danapur Cantt",
                "coordinates": [
                    25.6264,
                    85.045
                ]
            },
            {
                "name": "Ramgarh Cantt",
                "coordinates": [
                    23.63,
                    85.52
                ]
            },
            {
                "name": "Gwalior Cantt",
                "coordinates": [
                    26.2183,
                    78.1828
                ]
            },
            {
                "name": "Kanpur Cantt",
                "coordinates": [
                    26.4499,
                    80.3319
                ]
            }
        ]
    }
]
  },
  {
    name: 'INDIAN NAVY',
    organization: {
      approximateStrength: 'Current personnel strength is not shown; authorised and active totals vary by source and date.',
      officers: ['Admiral', 'Vice Admiral', 'Rear Admiral', 'Commodore', 'Captain', 'Commander', 'Lieutenant Commander', 'Lieutenant', 'Sub Lieutenant'],
      jcos: ['Master Chief Petty Officer I', 'Master Chief Petty Officer II', 'Chief Petty Officer'],
      ors: ['Petty Officer', 'Leading Seaman', 'Seaman I', 'Seaman II']
    },
    commands: [
      {
        name: 'Western Naval Command', hq: 'Mumbai', coverage: 'Arabian Sea', hqCoordinates: [18.9220, 72.8347], coverageStates: ['Maharashtra', 'Gujarat', 'Goa', 'Karnataka', 'Kerala', 'Lakshadweep'],
        bases: [{name: 'INS Kadamba (Karwar)', coordinates: [14.7645, 74.1374]}, {name: 'INS Vajrakosh', coordinates: [14.8000, 74.1200]}, {name: 'INS Dwarka', coordinates: [22.2400, 68.9600]}, {name: 'INS Sardar Patel', coordinates: [21.6400, 69.6000]}, {name: 'INS Shivaji', coordinates: [18.7500, 73.3800]}, {name: 'INS Valsura', coordinates: [22.4500, 70.0600]}, {name: 'INS Hamla', coordinates: [19.1800, 72.8200]}, {name: 'INS Trata', coordinates: [18.9200, 72.8200]}, {name: 'INS Shikra', coordinates: [18.9000, 72.8200]}, {name: 'INS Tanaji', coordinates: [19.0100, 72.8500]}]
      },
      {
        name: 'Eastern Naval Command', hq: 'Visakhapatnam', coverage: 'Bay of Bengal', hqCoordinates: [17.6868, 83.2185], coverageStates: ['Andhra Pradesh', 'Orissa', 'West Bengal', 'Tamil Nadu'],
        bases: [{name: 'INS Kalinga', coordinates: [17.8500, 83.4200]}, {name: 'INS Circars', coordinates: [17.6900, 83.2800]}, {name: 'INS Virbahu', coordinates: [17.6950, 83.2750]}, {name: 'INS Eksila', coordinates: [17.7000, 83.2700]}, {name: 'INS Dega', coordinates: [17.7200, 83.2200]}, {name: 'INS Netaji Subhash', coordinates: [22.5500, 88.3300]}, {name: 'INS Adyar', coordinates: [13.0800, 80.2800]}, {name: 'INS Rajali', coordinates: [12.9100, 79.6800]}, {name: 'INS Parundu', coordinates: [9.3500, 78.9600]}, {name: 'INS Karna', coordinates: [17.7100, 83.2900]}]
      }
    ]
  },
  {
    name: 'INDIAN AIR FORCE',
    organization: {
      approximateStrength: 'Current personnel strength is not shown; authorised and active totals vary by source and date.',
      officers: ['Air Chief Marshal', 'Air Marshal', 'Air Vice Marshal', 'Air Commodore', 'Group Captain', 'Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer'],
      jcos: ['Master Warrant Officer', 'Warrant Officer', 'Junior Warrant Officer'],
      ors: ['Sergeant', 'Corporal', 'Leading Aircraftsman', 'Aircraftsman']
    },
    commands: [
      {
        name: 'Western Air Command', hq: 'New Delhi', coverage: 'North India, Delhi, Haryana, Punjab, Rajasthan', hqCoordinates: [28.6139, 77.2090], coverageStates: ['Delhi', 'Haryana', 'Punjab', 'Jammu and Kashmir', 'Himachal Pradesh'],
        bases: [{name: 'Ambala AFS', coordinates: [30.3705, 76.8157]}, {name: 'Adampur AFS', coordinates: [31.4339, 75.7217]}, {name: 'Halwara AFS', coordinates: [30.7516, 75.6268]}, {name: 'Pathankot AFS', coordinates: [32.2340, 75.6340]}, {name: 'Srinagar AFS', coordinates: [33.9880, 74.7740]}, {name: 'Awantipora AFS', coordinates: [33.9180, 75.0160]}, {name: 'Chandigarh AFS', coordinates: [30.6730, 76.7880]}, {name: 'Hindon AFS', coordinates: [28.7080, 77.3600]}, {name: 'Sirsa AFS', coordinates: [29.5600, 75.0200]}, {name: 'Faridkot AFS', coordinates: [30.6700, 74.7500]}]
      },
      {
        name: 'Eastern Air Command', hq: 'Shillong', coverage: 'East & North East India', hqCoordinates: [25.5788, 91.8933], coverageStates: ['Assam', 'Meghalaya', 'Arunachal Pradesh', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'West Bengal', 'Sikkim'],
        bases: [{name: 'Tezpur AFS', coordinates: [26.6269, 92.7847]}, {name: 'Chabua AFS', coordinates: [27.4789, 95.1764]}, {name: 'Hasimara AFS', coordinates: [26.7456, 89.3400]}, {name: 'Kalaikunda AFS', coordinates: [22.3381, 87.2185]}, {name: 'Baghdogra AFS', coordinates: [26.6811, 88.3286]}]
      },
      {
        name: 'Central Air Command', hq: 'Prayagraj', coverage: 'Central India, Uttar Pradesh, Madhya Pradesh', hqCoordinates: [25.4358, 81.8463], coverageStates: ['Uttar Pradesh', 'Madhya Pradesh', 'Uttaranchal', 'Bihar', 'Uttarakhand'],
        bases: [{name: 'Gwalior AFS', coordinates: [26.2917, 78.2257]}, {name: 'Agra AFS', coordinates: [27.1558, 77.9609]}, {name: 'Bareilly AFS', coordinates: [28.4208, 79.4503]}, {name: 'Gorakhpur AFS', coordinates: [26.7397, 83.4497]}]
      },
      {
        name: 'South Western Air Command', hq: 'Gandhinagar', coverage: 'Gujarat, Maharashtra, Rajasthan', hqCoordinates: [23.2156, 72.6369], coverageStates: ['Gujarat', 'Maharashtra', 'Rajasthan'],
        bases: [{name: 'Jodhpur AFS', coordinates: [26.2621, 73.0487]}, {name: 'Bhuj AFS', coordinates: [23.2847, 69.6644]}, {name: 'Naliya AFS', coordinates: [23.2389, 68.8683]}, {name: 'Pune AFS', coordinates: [18.5822, 73.9197]}]
      },
      {
        name: 'Southern Air Command', hq: 'Thiruvananthapuram', coverage: 'Southern India, Island territories', hqCoordinates: [8.5241, 76.9366], coverageStates: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Lakshadweep'],
        bases: [{name: 'Sulur AFS', coordinates: [11.0134, 77.1593]}, {name: 'Thanjavur AFS', coordinates: [10.7225, 79.1044]}, {name: 'Bidar AFS', coordinates: [17.9078, 77.4878]}]
      },
      {
        name: 'Training Command', hq: 'Bengaluru', coverage: 'Training establishments', hqCoordinates: [12.9716, 77.5946], coverageStates: [],
        bases: [{name: 'AFA Dundigal', coordinates: [17.6258, 78.4069]}]
      },
      {
        name: 'Maintenance Command', hq: 'Nagpur', coverage: 'Maintenance and overhaul facilities', hqCoordinates: [21.1458, 79.0882], coverageStates: [],
        bases: []
      }
    ]
  },
  {
    name: 'TRI-SERVICE COMMANDS',
    organization: {
      approximateStrength: 'Joint forces drawn from Army, Navy, and Air Force',
      officers: ['Tri-Service Staff Officers'],
      jcos: ['Tri-Service NCOs'],
      ors: ['Tri-Service Personnel']
    },
    commands: [
      {
        name: 'Andaman and Nicobar Command', hq: 'Sri Vijaya Puram (Port Blair)', coverage: 'Andaman and Nicobar Islands and surrounding maritime approaches', hqCoordinates: [11.6234, 92.7265], coverageStates: ['Andaman and Nicobar'],
        bases: [{name: 'INS Utkrosh', coordinates: [11.6427, 92.7303]}, {name: 'INS Baaz', coordinates: [6.9945, 93.8964]}, {name: 'INS Kohassa', coordinates: [13.2500, 93.0000]}, {name: 'INS Kardip', coordinates: [8.1800, 93.5300]}, {name: 'INS Jarawa', coordinates: [11.6600, 92.7400]}, {name: 'Carnic AFS', coordinates: [9.1500, 92.7700]}, {name: 'Shibpur AFS', coordinates: [13.2600, 93.0100]}, {name: 'Birchgunj Military Station', coordinates: [11.6200, 92.7100]}, {name: 'Brichgunj Base', coordinates: [11.6300, 92.7200]}, {name: 'Rangat Base', coordinates: [12.5000, 92.9500]}]
      }
    ]
  }
];

/** Curated, public-facing unit profiles with unit traditions and linked awardee records. */
export const RENOWNED_UNITS: UnitDetail[] = [
  {
    name: "4 Kumaon Regiment",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Parakramo Vijayate — Valour Triumphs",
    warCry: "Kalika Mata Ki Jai",
    strength: "Infantry regiment with multiple battalions; strength varies by battalion and tasking.",
    baseLocation: "Kumaon Regimental Centre, Ranikhet, Uttarakhand",
    history: "The 4th Battalion, Kumaon Regiment is associated with the defence of Budgam and Srinagar in 1947, where Major Somnath Sharma led his company while wounded.",
    victories: "Budgam (1947) and the regiment’s later service in major Himalayan and conventional operations.",
    heroes: "Major Somnath Sharma was the first recipient of India’s Param Vir Chakra.",
    notableHeroes: [{ name: "Maj. Somnath Sharma", slug: "maj-somnath-sharma", award: "Param Vir Chakra", note: "Led 4 Kumaon at Budgam in 1947." }],
  },
  {
    name: "13 JAK Rifles",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Prashasta Ranveerta — Valour in Battle is Praiseworthy",
    warCry: "Durge Mata Ki Jai",
    strength: "Infantry battalion within the Jammu and Kashmir Rifles; operational strength varies by deployment.",
    baseLocation: "JAK Rifles Regimental Centre, Jabalpur, Madhya Pradesh",
    history: "The battalion is closely associated with the 1999 Kargil conflict, including the assaults on Point 5140 and Point 4875.",
    victories: "Operation Vijay actions at Point 5140 and Point 4875 in the Kargil theatre.",
    heroes: "Captain Vikram Batra and Rifleman Sanjay Kumar received the Param Vir Chakra for Kargil gallantry.",
    notableHeroes: [
      { name: "Vikram Batra", slug: "vikram-batra", award: "Param Vir Chakra", note: "Led the capture of Point 5140 and Point 4875 during Kargil." },
      { name: "Sanjay Kumar", slug: "sanjay-kumar", award: "Param Vir Chakra", note: "Displayed exceptional gallantry during the capture of a feature in Mushkoh Valley." },
    ],
  },
  {
    name: "18 Grenadiers",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Sarvada Shaktishali — Always Powerful",
    warCry: "Jai Bajrang Bali",
    strength: "Infantry battalion of The Grenadiers; strength varies by establishment and deployment.",
    baseLocation: "The Grenadiers Regimental Centre, Jabalpur, Madhya Pradesh",
    history: "The battalion is remembered for the assault on Tiger Hill during Operation Vijay in 1999.",
    victories: "Capture of Tiger Hill and associated high-altitude operations in the Kargil theatre.",
    heroes: "Grenadier Yogendra Singh Yadav received the Param Vir Chakra for his actions on Tiger Hill.",
    notableHeroes: [{ name: "Yogendra Singh Yadav", slug: "yogendra-singh-yadav", award: "Param Vir Chakra", note: "Scaled the Tiger Hill position under intense fire during Operation Vijay." }],
  },
  {
    name: "11 Gorkha Rifles",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Yatraham Vijayastatra — I am where victory is",
    warCry: "Jai Mahakali, Ayo Gorkhali",
    strength: "Gorkha infantry regiment with multiple battalions; strength varies by battalion and tasking.",
    baseLocation: "Regimental Centre, Lucknow, Uttar Pradesh",
    history: "Re-raised after Independence, the regiment has served in the major operations undertaken by the Indian Army, including the Kargil conflict.",
    victories: "Battle honours and operational service across Jammu and Kashmir, the North East and the Kargil theatre.",
    heroes: "Captain Manoj Kumar Pandey received the Param Vir Chakra posthumously during Operation Vijay.",
    notableHeroes: [{ name: "Lt. Manoj Kumar Pandey", slug: "lt-manoj-kumar-pandey", award: "Param Vir Chakra", note: "Led the assault on Khalubar Ridge during Operation Vijay." }],
  },
  {
    name: "Rajputana Rifles",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Veer Bhogya Vasundhara — The brave shall inherit the earth",
    warCry: "Raja Ramachandra Ki Jai",
    strength: "Rifle regiment with multiple battalions; strength varies by battalion and deployment.",
    baseLocation: "Regimental Centre, Delhi Cantonment",
    history: "India’s oldest rifle regiment traces a long lineage through colonial and post-Independence campaigns.",
    victories: "Battle honours include service in the World Wars, the 1947–48 Jammu and Kashmir operations and Kargil-era actions.",
    heroes: "Piru Singh was awarded the Param Vir Chakra for his actions with 6 Rajputana Rifles in 1948.",
    notableHeroes: [
      { name: "Piru Singh", slug: "piru-singh", award: "Param Vir Chakra", note: "Fought with 6 Rajputana Rifles in the 1948 Jammu and Kashmir operations." },
      { name: "Rajinder Singh", slug: "rajinder-singh", award: "Kirti Chakra", note: "Recorded in the public award roster with 2 Rajputana Rifles." },
    ],
  },
  {
    name: "Sikh Regiment",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Nischay Kar Apni Jeet Karon — With determination, I will be triumphant",
    warCry: "Bole So Nihal, Sat Sri Akal",
    strength: "Infantry regiment with multiple battalions; strength varies by battalion and operational role.",
    baseLocation: "Regimental Centre, Ramgarh Cantonment, Jharkhand",
    history: "Raised in 1846, the regiment has served in successive campaigns from the World Wars through post-Independence operations.",
    victories: "Battle honours span the 1947–48, 1965 and 1971 wars and subsequent operational deployments.",
    heroes: "Param Vir Chakra awardee Subedar Joginder Singh is among the regiment’s most renowned gallantry figures.",
    notableHeroes: [{ name: "Joginder Singh", slug: "joginder-singh", award: "Param Vir Chakra", note: "Led his platoon in the defence of Bum La during the 1962 war." }],
  },
  {
    name: "Jat Regiment",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Sangathan Va Veerta — Unity and Valour",
    warCry: "Jat Balwan, Jai Bhagwan",
    strength: "Infantry regiment with multiple battalions; strength varies by battalion and deployment.",
    baseLocation: "Regimental Centre, Bareilly, Uttar Pradesh",
    history: "The Jat Regiment has a long record of service in the World Wars and India’s post-Independence conflicts.",
    victories: "Battle honours include service in the 1947–48, 1965 and 1971 wars and later counter-insurgency operations.",
    heroes: "Colonel Jojan Thomas served with the Jat Regiment before his later Rashtriya Rifles posting and was awarded the Ashoka Chakra posthumously.",
    notableHeroes: [
      { name: "Jojan Thomas", slug: "jojan-thomas", award: "Ashoka Chakra", note: "Served with the Jat Regiment before his later Rashtriya Rifles posting." },
      { name: "Shatrujeet Kotwal", slug: "shatrujeet-kotwal", award: "Kirti Chakra", note: "Recorded in the public award roster with 3 JAT." },
    ],
  },
  {
    name: "Parachute Regiment",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Shatrujeet — Conqueror of the enemy",
    warCry: "Balidan Param Dharma — Sacrifice is Supreme Duty",
    strength: "Airborne and special forces regiment comprising parachute and Parachute (Special Forces) battalions.",
    baseLocation: "Parachute Regiment Training Centre, Bengaluru, Karnataka; specialised training at Agra",
    history: "The regiment has served in airborne, special operations and expeditionary roles across India’s major post-Independence theatres.",
    victories: "Battle honours include Tangail in 1971, Chachro, Siachen and operations in Jammu and Kashmir and the North East.",
    heroes: "The regiment’s battalions have received numerous Ashoka Chakra, Maha Vir Chakra, Kirti Chakra, Vir Chakra and Shaurya Chakra awards, including the linked Para (SF) awardees.",
    notableHeroes: [
      { name: "Mohan Nath Goswami", slug: "mohan-goswami", award: "Ashoka Chakra", note: "Served with 9 Para (SF) during the 2015 Kupwara operation." },
      { name: "Mohit Sharma", slug: "mohit-sharma", award: "Ashoka Chakra", note: "Served with 1 Para (SF) during counter-terrorism operations." },
      { name: "Vikas Sharma", slug: "vikas-sharma", award: "Kirti Chakra", note: "Recorded in the public award roster with 6 Para." },
    ],
  },
  {
    name: "10 Para (Special Forces)",
    type: "Special Forces Battalion",
    service: "INDIAN ARMY",
    motto: "Shatrujeet — Conqueror of the enemy",
    warCry: "Balidan Param Dharma — Sacrifice is Supreme Duty",
    strength: "Special forces battalion; establishment and tasking are not published as a fixed public figure.",
    baseLocation: "Parachute Regiment Training Centre, Bengaluru, Karnataka",
    history: "A Parachute Regiment special forces battalion associated with desert warfare training and counter-terrorism operations.",
    victories: "Operational service includes counter-terrorism operations in Jammu and Kashmir; individual operational details are not presented as live information.",
    heroes: "Captain Pawan Kumar was awarded the Shaurya Chakra posthumously for his gallantry during the 2016 Pampore operation while serving with 10 Para (SF).",
    notableHeroes: [{ name: "Capt. Pawan Kumar", slug: "capt-pawan-kumar", award: "Shaurya Chakra", note: "Served with 10 Para (SF) during the 2016 Pampore operation." }],
  },
  {
    name: "21 Para (Special Forces)",
    type: "Special Forces Battalion",
    service: "INDIAN ARMY",
    motto: "Shatrujeet — Conqueror of the enemy",
    warCry: "Balidan Param Dharma — Sacrifice is Supreme Duty",
    strength: "Special forces battalion; establishment and tasking are not published as a fixed public figure.",
    baseLocation: "Parachute Regiment Training Centre, Bengaluru, Karnataka",
    history: "A Parachute Regiment special forces battalion trained for special operations and high-risk missions.",
    victories: "Service record includes counter-insurgency and special operations; individual operational details are not presented as live information.",
    heroes: "Major Suhash Chand Punia was awarded the Kirti Chakra for gallantry while serving with 21 Para (Special Forces).",
    notableHeroes: [{ name: "Subhash Chand Punia", slug: "subhash-chand-punia", award: "Kirti Chakra", note: "Recorded in the public award roster with 21 Para (Special Forces)." }],
  },
  {
    name: "3 Gorkha Rifles",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Kayar Hunu Bhanda Marnu Ramro — Better to die than live like a coward",
    warCry: "Jai Maa Kali, Ayo Gorkhali",
    strength: "Gorkha infantry regiment with multiple battalions; strength varies by battalion and deployment.",
    baseLocation: "Regimental Centre, Varanasi, Uttar Pradesh",
    history: "The regiment carries the Gorkha infantry tradition through successive campaigns and post-Independence operations.",
    victories: "Battle honours include service in the World Wars and India’s major post-Independence theatres.",
    heroes: "Lieutenant Colonel Jagannath Raoji Chitnis of 3 Gorkha Rifles was awarded the Ashoka Chakra posthumously.",
    notableHeroes: [{ name: "Jagannath Raoji Chitnis", slug: "jagannath-raoji-chitnis", award: "Ashoka Chakra", note: "Served with 3 Gorkha Rifles." }],
  },
  {
    name: "15 Maratha Light Infantry",
    type: "Regiment",
    service: "INDIAN ARMY",
    motto: "Duty, Honour, Courage",
    warCry: "Bole Chhatrapati Shivaji Maharaj Ki Jai",
    strength: "Infantry regiment with multiple battalions; strength varies by battalion and deployment.",
    baseLocation: "Maratha Light Infantry Regimental Centre, Belgaum, Karnataka",
    history: "The regiment’s battalions serve in conventional and counter-insurgency roles across India’s operational theatres.",
    victories: "Battle honours and operational service include high-altitude and counter-insurgency deployments.",
    heroes: "Lieutenant Navdeep Singh of 15 Maratha Light Infantry received the Ashoka Chakra posthumously.",
    notableHeroes: [{ name: "Navdeep Singh", slug: "navdeep-singh", award: "Ashoka Chakra", note: "Served with 15 Maratha Light Infantry." }],
  },
  {
    name: "Western Fleet",
    type: "Fleet",
    service: "INDIAN NAVY",
    motto: "Sham No Varunah — May Varuna be auspicious unto us (Indian Navy motto)",
    warCry: "No separate fleet-level war cry is publicly documented",
    strength: "Task-organised carrier, surface combatant, replenishment and aviation assets; composition changes with the mission.",
    baseLocation: "Mumbai, Maharashtra — Western Naval Command",
    history: "The principal fleet formation on the Arabian Sea, responsible for maritime approaches to India’s western seaboard.",
    victories: "Fleet units supported the 1971 naval actions in the Arabian Sea and have continued maritime security and sea-control operations.",
    heroes: "Fleet traditions are carried by the gallantry records of Indian Navy personnel; the service motto is shown here because fleets do not publish a separate war cry.",
    notableHeroes: [{ name: "Laxminarayan Ramdas", slug: "laxminarayan-ramdas", award: "Vir Chakra", note: "Linked Navy gallantry record." }],
  },
  {
    name: "Eastern Fleet",
    type: "Fleet",
    service: "INDIAN NAVY",
    motto: "Sham No Varunah — May Varuna be auspicious unto us (Indian Navy motto)",
    warCry: "No separate fleet-level war cry is publicly documented",
    strength: "Task-organised surface, submarine, aviation and support assets; composition changes with the mission.",
    baseLocation: "Visakhapatnam, Andhra Pradesh — Eastern Naval Command",
    history: "The fleet protects India’s eastern maritime approaches and supports operations across the Bay of Bengal and wider Indo-Pacific.",
    victories: "Eastern Fleet units took part in the 1971 Bay of Bengal operations and continue regional maritime-security deployments.",
    heroes: "Fleet traditions are carried by the gallantry records of Indian Navy personnel; the service motto is shown here because fleets do not publish a separate war cry.",
    notableHeroes: [{ name: "Santosh Kumar Gupta", slug: "santosh-kumar-gupta", award: "Maha Vir Chakra", note: "Linked Navy gallantry record." }],
  },
  {
    name: "Submarine Squadron 8",
    type: "Submarine Squadron",
    service: "INDIAN NAVY",
    motto: "Sham No Varunah — May Varuna be auspicious unto us (Indian Navy motto)",
    warCry: "No separate squadron-level war cry is publicly documented",
    strength: "Submarine force element; boat numbers and composition vary with refit, training and deployment cycles.",
    baseLocation: "Visakhapatnam, Andhra Pradesh — submarine operating hub",
    history: "Represents the Indian Navy’s undersea arm and its role in deterrence, surveillance and sea denial.",
    victories: "Undersea patrols and fleet exercises contribute to maritime deterrence; individual patrol details are not presented as live operational data.",
    heroes: "See the linked Navy gallantry record for a decorated service member; the fleet motto is used where no squadron cry is publicly documented.",
    notableHeroes: [{ name: "Shivinder Singh Bains", slug: "shivinder-singh-bains", award: "Vir Chakra", note: "Linked Navy gallantry record." }],
  },
  {
    name: "INAS 300 (White Tigers)",
    type: "Naval Air Squadron",
    service: "INDIAN NAVY",
    motto: "Sham No Varunah — May Varuna be auspicious unto us (Indian Navy motto)",
    warCry: "No separate squadron-level war cry is publicly documented",
    strength: "Carrier aviation squadron; aircraft and personnel strength varies with the embarked air wing and training cycle.",
    baseLocation: "INS Hansa, Goa; carrier operations are task-dependent",
    history: "The White Tigers are a landmark Indian naval aviation squadron, associated with carrier-borne fighter operations and the evolution of the Navy’s air arm.",
    victories: "Carrier aviation sorties and maritime air operations across the squadron’s service history.",
    heroes: "The service motto is shown because no separate squadron war cry is publicly documented.",
  },
  {
    name: "No. 1 Squadron (The Tigers)",
    type: "Fighter Squadron",
    service: "INDIAN AIR FORCE",
    motto: "Nabhah Sparsham Diptam — Touch the Sky with Glory (IAF motto)",
    warCry: "No separate squadron-level war cry is publicly documented",
    strength: "Fighter squadron establishment; aircraft and personnel strength varies by platform and station.",
    baseLocation: "IAF station assignment varies by era and aircraft type",
    history: "One of the Indian Air Force’s historic fighter squadrons, with service across successive aircraft generations and operational theatres.",
    victories: "Operational service in the 1965 and 1971 wars and later air operations.",
    heroes: "Air Commodore Ajjamada B. Devaiah received the Maha Vir Chakra for exceptional gallantry in the 1965 war.",
    notableHeroes: [{ name: "Ajjamada B. Devaiah", slug: "ajjamada-b-devaiah", award: "Maha Vir Chakra", note: "Fighter pilot remembered for exceptional gallantry in the 1965 war." }],
  },
  {
    name: "No. 18 Squadron (Flying Bullets)",
    type: "Fighter Squadron",
    service: "INDIAN AIR FORCE",
    motto: "Sahasam Vijayate — Courage Triumphs",
    warCry: "No separate squadron-level war cry is publicly documented",
    strength: "Fighter squadron establishment; aircraft and personnel strength varies by platform and station.",
    baseLocation: "Air Force Station Sulur, Tamil Nadu",
    history: "Formed in 1965, the Flying Bullets served as defenders of the Kashmir Valley during the 1971 war and later became an early Tejas operator.",
    victories: "Combat air patrol and escort duties in 1971, followed by continued fighter operations and indigenous Tejas conversion.",
    heroes: "Flying Officer Nirmal Jit Singh Sekhon received the Param Vir Chakra for his defence of Srinagar airfield in 1971.",
    notableHeroes: [{ name: "Nirmal Jit Singh Sekhon", slug: "nirmal-jit-singh-sekhon", award: "Param Vir Chakra", note: "Defended Srinagar airfield during the 1971 war." }],
  },
  {
    name: "No. 22 Squadron (Swifts)",
    type: "Fighter Squadron",
    service: "INDIAN AIR FORCE",
    motto: "Nabhah Sparsham Diptam — Touch the Sky with Glory (IAF motto)",
    warCry: "No separate squadron-level war cry is publicly documented",
    strength: "Fighter squadron establishment; aircraft and personnel strength varies by platform and station.",
    baseLocation: "Air Force Station Hasimara, West Bengal",
    history: "The Swifts have served in fighter operations across the eastern theatre and received the President’s Standard alongside No. 18 Squadron.",
    victories: "Operational service across the eastern air defence and fighter-control environment.",
    heroes: "The IAF motto is shown because no separate squadron war cry is publicly documented.",
  },
  {
    name: "No. 51 Squadron (Sword Arms)",
    type: "Fighter Squadron",
    service: "INDIAN AIR FORCE",
    motto: "Nabhah Sparsham Diptam — Touch the Sky with Glory (IAF motto)",
    warCry: "No separate squadron-level war cry is publicly documented",
    strength: "Fighter squadron establishment; aircraft and personnel strength varies by platform and station.",
    baseLocation: "Srinagar, Jammu and Kashmir — historical association",
    history: "The Sword Arms are associated with the defence of the Kashmir Valley and modern air-combat operations.",
    victories: "Air-defence and combat-air-patrol service in the northern theatre.",
    heroes: "Wing Commander Abhinandan Varthaman received the Vir Chakra for his actions during the 2019 air engagement.",
    notableHeroes: [{ name: "Wg Cdr. Abhinandan Varthaman", slug: "wg-cdr-abhinandan-varthaman", award: "Vir Chakra", note: "Decorated for gallantry during the 2019 air engagement." }],
  },
];

const COMMAND_SOURCES: Record<ServiceLevel, ReferenceSource[]> = {
  All: [],
  "INDIAN ARMY": [{ label: "Army command headquarters listing", url: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2022/jan/doc20221259101.pdf", note: "Ministry of Defence command-level listing; HQ points are city-centre references" }],
  "INDIAN NAVY": [{ label: "Armed Forces command directory", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1859149&lang=2&reg=48", note: "Ministry of Defence release naming service commands" }],
  "INDIAN AIR FORCE": [{ label: "Armed Forces command directory", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1859149&lang=2&reg=48", note: "Ministry of Defence release naming service commands" }],
  "TRI-SERVICE COMMANDS": [{ label: "Andaman and Nicobar Command", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2267569&lang=2&reg=48", note: "Ministry of Defence release describing the command and its headquarters, 2026" }],
};

const UNIT_SERVICE_SOURCES: Record<string, ReferenceSource[]> = {
  "INDIAN ARMY": [{ label: "Gallantry Awards portal", url: "https://www.gallantryawards.gov.in/", note: "Ministry of Defence awardee records used to verify linked names, awards and units" }],
  "INDIAN NAVY": [{ label: "Armed Forces command directory", url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1859149&lang=2&reg=48", note: "Ministry of Defence release naming the naval commands; unit-level histories are cited separately" }],
  "INDIAN AIR FORCE": [{ label: "The Story of the Indian Air Force", url: "https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=153257&lang=2&reg=48", note: "Government of India historical overview, 7 October 2024" }],
};

const UNIT_REFERENCE_URLS: Record<string, ReferenceSource[]> = {
  "4 Kumaon Regiment": [{ label: "Kumaon Regiment", url: "https://en.wikipedia.org/wiki/Kumaon_Regiment", note: "Wikipedia unit history and traditions; checked against the official Somnath Sharma award record" }],
  "13 JAK Rifles": [{ label: "Jammu and Kashmir Rifles", url: "https://en.wikipedia.org/wiki/Jammu_and_Kashmir_Rifles", note: "Wikipedia unit history and traditions; Kargil awardee links are verified in official records" }],
  "18 Grenadiers": [{ label: "The Grenadiers", url: "https://en.wikipedia.org/wiki/The_Grenadiers", note: "Wikipedia regimental history; Tiger Hill details are anchored to official histories" }],
  "11 Gorkha Rifles": [{ label: "11th Gorkha Rifles", url: "https://en.wikipedia.org/wiki/11th_Gorkha_Rifles", note: "Wikipedia regimental history and traditions" }],
  "Rajputana Rifles": [{ label: "Rajputana Rifles", url: "https://en.wikipedia.org/wiki/Rajputana_Rifles", note: "Wikipedia regimental history and traditions" }],
  "Sikh Regiment": [{ label: "Sikh Regiment", url: "https://en.wikipedia.org/wiki/Sikh_Regiment", note: "Wikipedia regimental history and traditions" }],
  "Jat Regiment": [{ label: "Jat Regiment", url: "https://en.wikipedia.org/wiki/Jat_Regiment", note: "Wikipedia regimental history and traditions" }],
  "Parachute Regiment": [{ label: "Parachute Regiment", url: "https://en.wikipedia.org/wiki/Parachute_Regiment_(India)", note: "Wikipedia regimental history and organisation" }],
  "10 Para (Special Forces)": [{ label: "Para (Special Forces)", url: "https://en.wikipedia.org/wiki/Para_(Special_Forces)", note: "Wikipedia formation history; current operational details are deliberately excluded" }],
  "21 Para (Special Forces)": [{ label: "Para (Special Forces)", url: "https://en.wikipedia.org/wiki/Para_(Special_Forces)", note: "Wikipedia formation history; current operational details are deliberately excluded" }],
  "3 Gorkha Rifles": [{ label: "3rd Gorkha Rifles", url: "https://en.wikipedia.org/wiki/3rd_Gorkha_Rifles", note: "Wikipedia regimental history and traditions" }],
  "15 Maratha Light Infantry": [{ label: "Maratha Light Infantry", url: "https://en.wikipedia.org/wiki/Maratha_Light_Infantry", note: "Wikipedia regimental history and traditions" }],
  "Western Fleet": [{ label: "Western Fleet", url: "https://en.wikipedia.org/wiki/Western_Fleet_(India)", note: "Wikipedia fleet history; current composition and deployments are not published here" }],
  "Eastern Fleet": [{ label: "Eastern Fleet", url: "https://en.wikipedia.org/wiki/Eastern_Fleet_(India)", note: "Wikipedia fleet history; current composition and deployments are not published here" }],
  "Submarine Squadron 8": [{ label: "Indian Navy submarine arm", url: "https://en.wikipedia.org/wiki/Submarines_of_the_Indian_Navy", note: "Wikipedia historical overview; patrol and readiness data are excluded" }],
  "INAS 300 (White Tigers)": [{ label: "Golden Jubilee of INAS 300", url: "https://www.pib.gov.in/newsite/erelcontent.aspx?lang=2&reg=48&relid=63017", note: "Indian Navy / Ministry of Defence squadron history" }],
  "No. 1 Squadron (The Tigers)": [{ label: "No. 1 Squadron IAF", url: "https://en.wikipedia.org/wiki/No._1_Squadron_IAF", note: "Wikipedia squadron history; operational claims are cross-checked against official IAF histories" }],
  "No. 18 Squadron (Flying Bullets)": [{ label: "President's Standard to 18 and 22 Squadrons", url: "https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=131735", note: "Indian Air Force / Ministry of Defence squadron history, 2015" }],
  "No. 22 Squadron (Swifts)": [{ label: "President's Standard to 18 and 22 Squadrons", url: "https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=131735", note: "Indian Air Force / Ministry of Defence squadron history, 2015" }],
  "No. 51 Squadron (Sword Arms)": [{ label: "No. 51 Squadron IAF", url: "https://en.wikipedia.org/wiki/No._51_Squadron_IAF", note: "Wikipedia squadron history; the linked award is verified in the official gallantry directory" }],
};

function publishUnit(unit: UnitDetail): PublishedUnitDetail {
  return { ...unit, sources: [...(UNIT_SERVICE_SOURCES[unit.service] ?? []), ...(UNIT_REFERENCE_URLS[unit.name] ?? [])] };
}

function publishForce(force: Force): PublishedForce {
  const sources = force.sources ?? COMMAND_SOURCES[force.name];
  return { ...force, sources, commands: force.commands.map((command) => {
    const publicCommand = { ...command, sources: command.sources ?? sources };
    delete publicCommand.bases;
    return publicCommand;
  }) };
}

export function getRenownedUnitsForService(service: ServiceLevel): PublishedUnitDetail[] {
  return (service === "All" ? RENOWNED_UNITS : RENOWNED_UNITS.filter((unit) => unit.service === service)).map(publishUnit);
}

export function getForcesForService(service: ServiceLevel): PublishedForce[] {
  return (service === 'All' ? FORCES_DATA : FORCES_DATA.filter((force) => force.name === service)).map(publishForce);
}

export const UNITS_DATA: UnitDetail[] = [
    {
        "name": "Parachute Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Parachute Regiment",
        "warCry": "Victory to Parachute Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Parachute Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Mechanised Infantry Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Mechanised Infantry Regiment",
        "warCry": "Victory to Mechanised Infantry Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Mechanised Infantry Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Brigade of The Guards",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Brigade of The Guards",
        "warCry": "Victory to Brigade of The Guards!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Brigade of The Guards is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Rajputana Rifles",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Rajputana Rifles",
        "warCry": "Victory to Rajputana Rifles!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Rajputana Rifles is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Rajput Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Rajput Regiment",
        "warCry": "Victory to Rajput Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Rajput Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Jat Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Jat Regiment",
        "warCry": "Victory to Jat Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Jat Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Sikh Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Sikh Regiment",
        "warCry": "Victory to Sikh Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Sikh Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Sikh Light Infantry",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Sikh Light Infantry",
        "warCry": "Victory to Sikh Light Infantry!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Sikh Light Infantry is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Dogra Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Dogra Regiment",
        "warCry": "Victory to Dogra Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Dogra Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Garhwal Rifles",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Garhwal Rifles",
        "warCry": "Victory to Garhwal Rifles!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Garhwal Rifles is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Kumaon Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Kumaon Regiment",
        "warCry": "Victory to Kumaon Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Kumaon Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Assam Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Assam Regiment",
        "warCry": "Victory to Assam Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Assam Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Bihar Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Bihar Regiment",
        "warCry": "Victory to Bihar Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Bihar Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Mahar Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Mahar Regiment",
        "warCry": "Victory to Mahar Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Mahar Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Jammu & Kashmir Rifles",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Jammu & Kashmir Rifles",
        "warCry": "Victory to Jammu & Kashmir Rifles!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Jammu & Kashmir Rifles is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Jammu & Kashmir Light Infantry",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Jammu & Kashmir Light Infantry",
        "warCry": "Victory to Jammu & Kashmir Light Infantry!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Jammu & Kashmir Light Infantry is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Naga Regiment",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Naga Regiment",
        "warCry": "Victory to Naga Regiment!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Naga Regiment is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Gorkha Rifles (1st, 3rd, 4th, 5th, 8th, 9th, 11th)",
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": "Valour and Honor of Gorkha Rifles (1st, 3rd, 4th, 5th, 8th, 9th, 11th)",
        "warCry": "Victory to Gorkha Rifles (1st, 3rd, 4th, 5th, 8th, 9th, 11th)!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": "The Gorkha Rifles (1st, 3rd, 4th, 5th, 8th, 9th, 11th) is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    },
    {
        "name": "Western Fleet",
        "type": "Fleet",
        "service": "INDIAN NAVY",
        "motto": "Sham No Varunah",
        "warCry": "Jai Hind",
        "strength": "Classified (multiple vessels and thousands of personnel)",
        "baseLocation": "Mumbai / Visakhapatnam",
        "history": "Western Fleet is a premier operational unit of the Indian Navy, securing India's maritime borders and conducting strategic operations in the Indian Ocean Region.",
        "victories": "Operation Trident, Operation Python, Anti-piracy deployments.",
        "heroes": "Decorated admirals and naval commandos (MARCOS)."
    },
    {
        "name": "Eastern Fleet",
        "type": "Fleet",
        "service": "INDIAN NAVY",
        "motto": "Sham No Varunah",
        "warCry": "Jai Hind",
        "strength": "Classified (multiple vessels and thousands of personnel)",
        "baseLocation": "Mumbai / Visakhapatnam",
        "history": "Eastern Fleet is a premier operational unit of the Indian Navy, securing India's maritime borders and conducting strategic operations in the Indian Ocean Region.",
        "victories": "Operation Trident, Operation Python, Anti-piracy deployments.",
        "heroes": "Decorated admirals and naval commandos (MARCOS)."
    },
    {
        "name": "Submarine Squadron 8",
        "type": "Squadron",
        "service": "INDIAN NAVY",
        "motto": "Sham No Varunah",
        "warCry": "Jai Hind",
        "strength": "Classified (multiple vessels and thousands of personnel)",
        "baseLocation": "Mumbai / Visakhapatnam",
        "history": "Submarine Squadron 8 is a premier operational unit of the Indian Navy, securing India's maritime borders and conducting strategic operations in the Indian Ocean Region.",
        "victories": "Operation Trident, Operation Python, Anti-piracy deployments.",
        "heroes": "Decorated admirals and naval commandos (MARCOS)."
    },
    {
        "name": "Submarine Squadron 9",
        "type": "Squadron",
        "service": "INDIAN NAVY",
        "motto": "Sham No Varunah",
        "warCry": "Jai Hind",
        "strength": "Classified (multiple vessels and thousands of personnel)",
        "baseLocation": "Mumbai / Visakhapatnam",
        "history": "Submarine Squadron 9 is a premier operational unit of the Indian Navy, securing India's maritime borders and conducting strategic operations in the Indian Ocean Region.",
        "victories": "Operation Trident, Operation Python, Anti-piracy deployments.",
        "heroes": "Decorated admirals and naval commandos (MARCOS)."
    },
    {
        "name": "INAS 300 (White Tigers)",
        "type": "Squadron",
        "service": "INDIAN NAVY",
        "motto": "Sham No Varunah",
        "warCry": "Jai Hind",
        "strength": "Classified (multiple vessels and thousands of personnel)",
        "baseLocation": "Mumbai / Visakhapatnam",
        "history": "INAS 300 (White Tigers) is a premier operational unit of the Indian Navy, securing India's maritime borders and conducting strategic operations in the Indian Ocean Region.",
        "victories": "Operation Trident, Operation Python, Anti-piracy deployments.",
        "heroes": "Decorated admirals and naval commandos (MARCOS)."
    },
    {
        "name": "No. 1 Squadron (The Tigers)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 1 Squadron (The Tigers) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 2 Squadron (Winged Arrows)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 2 Squadron (Winged Arrows) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 3 Squadron (Cobras)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 3 Squadron (Cobras) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 4 Squadron (Oorials)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 4 Squadron (Oorials) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 7 Squadron (Battle Axes)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 7 Squadron (Battle Axes) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 8 Squadron (Eight Pursoots)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 8 Squadron (Eight Pursoots) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 9 Squadron (Wolfpack)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 9 Squadron (Wolfpack) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 18 Squadron (Flying Bullets)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 18 Squadron (Flying Bullets) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 222 Squadron (Tigersharks)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 222 Squadron (Tigersharks) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 101 Squadron (Falcons)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 101 Squadron (Falcons) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    },
    {
        "name": "No. 24 Squadron (Hunting Hawks)",
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": "No. 24 Squadron (Hunting Hawks) is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    }
];

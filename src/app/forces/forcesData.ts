
export type ServiceLevel = 'All' | 'INDIAN ARMY' | 'INDIAN NAVY' | 'INDIAN AIR FORCE' | 'TRI-SERVICE COMMANDS';

export interface Command {
  name: string;
  hq: string;
  coverage: string;
  hqCoordinates: [number, number];
  coverageStates: string[];
  bases?: { name: string; coordinates: [number, number] }[];
}

export interface ForceOrganization {
  approximateStrength: string;
  officers: string[];
  jcos: string[];
  ors: string[];
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
}

export interface Force {
  name: ServiceLevel;
  organization: ForceOrganization;
  commands: Command[];
}

export const FORCES_DATA: Force[] = [
  {
    name: 'INDIAN ARMY',
    organization: {
      approximateStrength: '1,237,117 Active personnel',
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
      approximateStrength: '67,252 Active personnel',
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
      approximateStrength: '170,576 Active personnel',
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
        name: 'Andaman and Nicobar Command', hq: 'Port Blair', coverage: 'Andaman and Nicobar Islands, Bay of Bengal', hqCoordinates: [11.6234, 92.7265], coverageStates: ['Andaman and Nicobar'],
        bases: [{name: 'INS Utkrosh', coordinates: [11.6427, 92.7303]}, {name: 'INS Baaz', coordinates: [6.9945, 93.8964]}, {name: 'INS Kohassa', coordinates: [13.2500, 93.0000]}, {name: 'INS Kardip', coordinates: [8.1800, 93.5300]}, {name: 'INS Jarawa', coordinates: [11.6600, 92.7400]}, {name: 'Carnic AFS', coordinates: [9.1500, 92.7700]}, {name: 'Shibpur AFS', coordinates: [13.2600, 93.0100]}, {name: 'Birchgunj Military Station', coordinates: [11.6200, 92.7100]}, {name: 'Brichgunj Base', coordinates: [11.6300, 92.7200]}, {name: 'Rangat Base', coordinates: [12.5000, 92.9500]}]
      }
    ]
  }
];

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

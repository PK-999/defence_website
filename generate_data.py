import json

forces_data = []

# ARMY
army_commands = [
    {
        "name": "Northern Command",
        "hq": "Udhampur",
        "coverage": "Jammu & Kashmir, Ladakh",
        "hqCoordinates": [32.9255, 75.1354],
        "coverageStates": ["Jammu and Kashmir", "Himachal Pradesh", "Punjab", "Ladakh"],
        "bases": [
            {"name": "Srinagar (15 Corps)", "coordinates": [34.0837, 74.7973]},
            {"name": "Nagrota (16 Corps)", "coordinates": [32.7937, 74.9126]},
            {"name": "Leh (14 Corps)", "coordinates": [34.1526, 77.5771]},
            {"name": "Akhnoor Base", "coordinates": [32.8804, 74.7350]},
            {"name": "Poonch Garrison", "coordinates": [33.7712, 74.0934]},
            {"name": "Rajouri Base", "coordinates": [33.3828, 74.3015]},
            {"name": "Kupwara Camp", "coordinates": [34.5262, 74.2546]},
            {"name": "Baramulla Garrison", "coordinates": [34.1983, 74.3644]},
            {"name": "Kargil Base", "coordinates": [34.5539, 76.1349]},
            {"name": "Dras Post", "coordinates": [34.4300, 75.7600]},
            {"name": "Awantipora Camp", "coordinates": [33.9248, 75.0189]}
        ]
    },
    {
        "name": "Western Command",
        "hq": "Chandimandir",
        "coverage": "Punjab, Haryana, Delhi, Himachal Pradesh",
        "hqCoordinates": [30.7161, 76.8834],
        "coverageStates": ["Punjab", "Haryana", "Delhi", "Himachal Pradesh"],
        "bases": [
            {"name": "Ambala (2 Corps)", "coordinates": [30.3752, 76.7821]},
            {"name": "Jalandhar (11 Corps)", "coordinates": [31.3260, 75.5762]},
            {"name": "Pathankot Base", "coordinates": [32.2658, 75.6468]},
            {"name": "Amritsar Cantt", "coordinates": [31.6340, 74.8723]},
            {"name": "Firozpur Cantt", "coordinates": [30.9120, 74.6120]},
            {"name": "Ludhiana Cantt", "coordinates": [30.9010, 75.8523]},
            {"name": "Patiala Cantt", "coordinates": [30.3300, 76.3869]},
            {"name": "Hisar Cantt", "coordinates": [29.1492, 75.7217]},
            {"name": "Kapurthala Base", "coordinates": [31.3800, 75.3800]},
            {"name": "Palampur Cantt", "coordinates": [32.1109, 76.5363]}
        ]
    },
    {
        "name": "Eastern Command",
        "hq": "Kolkata",
        "coverage": "West Bengal, Sikkim, North East States",
        "hqCoordinates": [22.5726, 88.3639],
        "coverageStates": ["West Bengal", "Sikkim", "Assam", "Arunachal Pradesh", "Meghalaya", "Nagaland", "Manipur", "Mizoram", "Tripura"],
        "bases": [
            {"name": "Tezpur (4 Corps)", "coordinates": [26.6528, 92.7926]},
            {"name": "Sukna (33 Corps)", "coordinates": [26.7904, 88.3601]},
            {"name": "Dimapur (3 Corps)", "coordinates": [25.9060, 93.7259]},
            {"name": "Panagarh Base", "coordinates": [23.4560, 87.4270]},
            {"name": "Rangia Cantt", "coordinates": [26.4350, 91.6260]},
            {"name": "Tenga Valley Post", "coordinates": [27.2000, 92.4200]},
            {"name": "Zakhama Cantt", "coordinates": [25.5920, 94.1350]},
            {"name": "Binnaguri Cantt", "coordinates": [26.7560, 89.0430]},
            {"name": "Leimakhong Base", "coordinates": [24.9350, 93.8400]},
            {"name": "Agartala Cantt", "coordinates": [23.8315, 91.2868]}
        ]
    },
    {
        "name": "Southern Command",
        "hq": "Pune",
        "coverage": "Maharashtra, Gujarat, Rajasthan, Southern States",
        "hqCoordinates": [18.5204, 73.8567],
        "coverageStates": ["Maharashtra", "Gujarat", "Goa", "Karnataka", "Kerala", "Tamil Nadu", "Andhra Pradesh"],
        "bases": [
            {"name": "Bhopal (21 Corps)", "coordinates": [23.2599, 77.4126]},
            {"name": "Jodhpur (12 Corps)", "coordinates": [26.2389, 73.0243]},
            {"name": "Ahmednagar Cantt", "coordinates": [19.0952, 74.7496]},
            {"name": "Secunderabad Cantt", "coordinates": [17.4399, 78.4983]},
            {"name": "Deolali Cantt", "coordinates": [19.9320, 73.8300]},
            {"name": "Wellington Cantt", "coordinates": [11.3660, 76.7860]},
            {"name": "Belagavi Cantt", "coordinates": [15.8497, 74.5055]},
            {"name": "Chennai Cantt", "coordinates": [13.0827, 80.2707]},
            {"name": "Thiruvananthapuram Cantt", "coordinates": [8.5241, 76.9366]},
            {"name": "Bhuj Cantt", "coordinates": [23.2420, 69.6669]}
        ]
    },
    {
        "name": "South Western Command",
        "hq": "Jaipur",
        "coverage": "Rajasthan, parts of Punjab and Haryana",
        "hqCoordinates": [26.9124, 75.7873],
        "coverageStates": ["Rajasthan", "Haryana", "Punjab"],
        "bases": [
            {"name": "Mathura (1 Corps)", "coordinates": [27.4924, 77.6737]},
            {"name": "Bathinda (10 Corps)", "coordinates": [30.2110, 74.9455]},
            {"name": "Bikaner Cantt", "coordinates": [28.0229, 73.3119]},
            {"name": "Suratgarh Base", "coordinates": [29.3190, 73.8960]},
            {"name": "Alwar Cantt", "coordinates": [27.5530, 76.6346]},
            {"name": "Kota Cantt", "coordinates": [25.2138, 75.8648]},
            {"name": "Ganganagar Cantt", "coordinates": [29.9038, 73.8772]},
            {"name": "Bharatpur Cantt", "coordinates": [27.2152, 77.4900]},
            {"name": "Sriganganagar Base", "coordinates": [29.9080, 73.8790]},
            {"name": "Jaisalmer Military Station", "coordinates": [26.9157, 70.9083]}
        ]
    },
    {
        "name": "Central Command",
        "hq": "Lucknow",
        "coverage": "Uttar Pradesh, Uttarakhand, Madhya Pradesh, Bihar, Odisha, Jharkhand, Chhattisgarh",
        "hqCoordinates": [26.8467, 80.9462],
        "coverageStates": ["Uttar Pradesh", "Uttaranchal", "Madhya Pradesh", "Bihar", "Orissa", "Jharkhand", "Chhattisgarh", "Uttarakhand"],
        "bases": [
            {"name": "Meerut Cantt", "coordinates": [29.0064, 77.7121]},
            {"name": "Bareilly Cantt", "coordinates": [28.3670, 79.4304]},
            {"name": "Agra Cantt", "coordinates": [27.1598, 77.9634]},
            {"name": "Jabalpur Cantt", "coordinates": [23.1815, 79.9864]},
            {"name": "Mhow Cantt", "coordinates": [22.5510, 75.7620]},
            {"name": "Roorkee Cantt", "coordinates": [29.8543, 77.8880]},
            {"name": "Danapur Cantt", "coordinates": [25.6264, 85.0450]},
            {"name": "Ramgarh Cantt", "coordinates": [23.6300, 85.5200]},
            {"name": "Gwalior Cantt", "coordinates": [26.2183, 78.1828]},
            {"name": "Kanpur Cantt", "coordinates": [26.4499, 80.3319]}
        ]
    }
]

# Produce units
units_data = []

# Army Regiments (Adding many for comprehensive list)
infantry_regiments = [
    "Parachute Regiment", "Mechanised Infantry Regiment", "Brigade of The Guards",
    "Rajputana Rifles", "Rajput Regiment", "Jat Regiment", "Sikh Regiment",
    "Sikh Light Infantry", "Dogra Regiment", "Garhwal Rifles", "Kumaon Regiment",
    "Assam Regiment", "Bihar Regiment", "Mahar Regiment", "Jammu & Kashmir Rifles",
    "Jammu & Kashmir Light Infantry", "Naga Regiment", "Gorkha Rifles (1st, 3rd, 4th, 5th, 8th, 9th, 11th)"
]
for reg in infantry_regiments:
    units_data.append({
        "name": reg,
        "type": "Regiment",
        "service": "INDIAN ARMY",
        "motto": f"Valour and Honor of {reg}",
        "warCry": f"Victory to {reg}!",
        "strength": "Varies (Multiple Battalions, typically 10,000+ men)",
        "baseLocation": "Multiple locations across India",
        "history": f"The {reg} is a distinguished infantry regiment of the Indian Army. It has a rich history spanning over a century, participating in both World Wars, the Indo-Pakistani Wars of 1947, 1965, and 1971, and the Kargil War. Renowned for their incredible bravery, the regiment has produced numerous highly decorated heroes.",
        "victories": "Key tactical victories in the 1971 war, strategic captures during the Kargil War, and successful counter-insurgency operations in J&K and the North East.",
        "heroes": "Numerous Param Vir Chakra, Maha Vir Chakra, and Ashoka Chakra awardees."
    })

# Add Navy Fleets and Submarine squadrons
navy_units = [
    {"name": "Western Fleet", "type": "Fleet", "service": "INDIAN NAVY"},
    {"name": "Eastern Fleet", "type": "Fleet", "service": "INDIAN NAVY"},
    {"name": "Submarine Squadron 8", "type": "Squadron", "service": "INDIAN NAVY"},
    {"name": "Submarine Squadron 9", "type": "Squadron", "service": "INDIAN NAVY"},
    {"name": "INAS 300 (White Tigers)", "type": "Squadron", "service": "INDIAN NAVY"}
]
for nu in navy_units:
    units_data.append({
        "name": nu["name"],
        "type": nu["type"],
        "service": nu["service"],
        "motto": "Sham No Varunah",
        "warCry": "Jai Hind",
        "strength": "Classified (multiple vessels and thousands of personnel)",
        "baseLocation": "Mumbai / Visakhapatnam",
        "history": f"{nu['name']} is a premier operational unit of the Indian Navy, securing India's maritime borders and conducting strategic operations in the Indian Ocean Region.",
        "victories": "Operation Trident, Operation Python, Anti-piracy deployments.",
        "heroes": "Decorated admirals and naval commandos (MARCOS)."
    })

# Add Air Force Squadrons
af_squadrons = [
    "No. 1 Squadron (The Tigers)", "No. 2 Squadron (Winged Arrows)", "No. 3 Squadron (Cobras)",
    "No. 4 Squadron (Oorials)", "No. 7 Squadron (Battle Axes)", "No. 8 Squadron (Eight Pursoots)",
    "No. 9 Squadron (Wolfpack)", "No. 18 Squadron (Flying Bullets)", "No. 222 Squadron (Tigersharks)",
    "No. 101 Squadron (Falcons)", "No. 24 Squadron (Hunting Hawks)"
]
for sq in af_squadrons:
    units_data.append({
        "name": sq,
        "type": "Squadron",
        "service": "INDIAN AIR FORCE",
        "motto": "Touch the Sky with Glory",
        "warCry": "Vande Mataram",
        "strength": "Standard Fighter Squadron Strength (18-20 aircraft, 200+ personnel)",
        "baseLocation": "Air Force Stations across India",
        "history": f"{sq} is an elite fighter squadron of the Indian Air Force. It has actively participated in operations from the 1948 Kashmir operations to the 1999 Kargil war (Operation Safed Sagar).",
        "victories": "Air supremacy during 1971 war, successful bombing runs in Kargil.",
        "heroes": "Famous fighter aces including PVC and MVC recipients."
    })

output = f"""
export type ServiceLevel = 'All' | 'INDIAN ARMY' | 'INDIAN NAVY' | 'INDIAN AIR FORCE' | 'TRI-SERVICE COMMANDS';

export interface Command {{
  name: string;
  hq: string;
  coverage: string;
  hqCoordinates: [number, number];
  coverageStates: string[];
  bases?: {{ name: string; coordinates: [number, number] }}[];
}}

export interface ForceOrganization {{
  approximateStrength: string;
  officers: string[];
  jcos: string[];
  ors: string[];
}}

export interface UnitDetail {{
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
}}

export interface Force {{
  name: ServiceLevel;
  organization: ForceOrganization;
  commands: Command[];
}}

export const FORCES_DATA: Force[] = [
  {{
    name: 'INDIAN ARMY',
    organization: {{
      approximateStrength: '1,237,117 Active personnel',
      officers: ['General', 'Lieutenant General', 'Major General', 'Brigadier', 'Colonel', 'Lieutenant Colonel', 'Major', 'Captain', 'Lieutenant'],
      jcos: ['Subedar Major', 'Subedar', 'Naib Subedar'],
      ors: ['Havildar', 'Naik', 'Lance Naik', 'Sepoy']
    }},
    commands: {json.dumps(army_commands, indent=4)}
  }},
  {{
    name: 'INDIAN NAVY',
    organization: {{
      approximateStrength: '67,252 Active personnel',
      officers: ['Admiral', 'Vice Admiral', 'Rear Admiral', 'Commodore', 'Captain', 'Commander', 'Lieutenant Commander', 'Lieutenant', 'Sub Lieutenant'],
      jcos: ['Master Chief Petty Officer I', 'Master Chief Petty Officer II', 'Chief Petty Officer'],
      ors: ['Petty Officer', 'Leading Seaman', 'Seaman I', 'Seaman II']
    }},
    commands: [
      {{
        name: 'Western Naval Command', hq: 'Mumbai', coverage: 'Arabian Sea', hqCoordinates: [18.9220, 72.8347], coverageStates: ['Maharashtra', 'Gujarat', 'Goa', 'Karnataka', 'Kerala', 'Lakshadweep'],
        bases: [{{name: 'INS Kadamba (Karwar)', coordinates: [14.7645, 74.1374]}}, {{name: 'INS Vajrakosh', coordinates: [14.8000, 74.1200]}}, {{name: 'INS Dwarka', coordinates: [22.2400, 68.9600]}}, {{name: 'INS Sardar Patel', coordinates: [21.6400, 69.6000]}}, {{name: 'INS Shivaji', coordinates: [18.7500, 73.3800]}}, {{name: 'INS Valsura', coordinates: [22.4500, 70.0600]}}, {{name: 'INS Hamla', coordinates: [19.1800, 72.8200]}}, {{name: 'INS Trata', coordinates: [18.9200, 72.8200]}}, {{name: 'INS Shikra', coordinates: [18.9000, 72.8200]}}, {{name: 'INS Tanaji', coordinates: [19.0100, 72.8500]}}]
      }},
      {{
        name: 'Eastern Naval Command', hq: 'Visakhapatnam', coverage: 'Bay of Bengal', hqCoordinates: [17.6868, 83.2185], coverageStates: ['Andhra Pradesh', 'Orissa', 'West Bengal', 'Tamil Nadu'],
        bases: [{{name: 'INS Kalinga', coordinates: [17.8500, 83.4200]}}, {{name: 'INS Circars', coordinates: [17.6900, 83.2800]}}, {{name: 'INS Virbahu', coordinates: [17.6950, 83.2750]}}, {{name: 'INS Eksila', coordinates: [17.7000, 83.2700]}}, {{name: 'INS Dega', coordinates: [17.7200, 83.2200]}}, {{name: 'INS Netaji Subhash', coordinates: [22.5500, 88.3300]}}, {{name: 'INS Adyar', coordinates: [13.0800, 80.2800]}}, {{name: 'INS Rajali', coordinates: [12.9100, 79.6800]}}, {{name: 'INS Parundu', coordinates: [9.3500, 78.9600]}}, {{name: 'INS Karna', coordinates: [17.7100, 83.2900]}}]
      }}
    ]
  }},
  {{
    name: 'INDIAN AIR FORCE',
    organization: {{
      approximateStrength: '170,576 Active personnel',
      officers: ['Air Chief Marshal', 'Air Marshal', 'Air Vice Marshal', 'Air Commodore', 'Group Captain', 'Wing Commander', 'Squadron Leader', 'Flight Lieutenant', 'Flying Officer'],
      jcos: ['Master Warrant Officer', 'Warrant Officer', 'Junior Warrant Officer'],
      ors: ['Sergeant', 'Corporal', 'Leading Aircraftsman', 'Aircraftsman']
    }},
    commands: [
      {{
        name: 'Western Air Command', hq: 'New Delhi', coverage: 'North India, Delhi, Haryana, Punjab, Rajasthan', hqCoordinates: [28.6139, 77.2090], coverageStates: ['Delhi', 'Haryana', 'Punjab', 'Jammu and Kashmir', 'Himachal Pradesh'],
        bases: [{{name: 'Ambala AFS', coordinates: [30.3705, 76.8157]}}, {{name: 'Adampur AFS', coordinates: [31.4339, 75.7217]}}, {{name: 'Halwara AFS', coordinates: [30.7516, 75.6268]}}, {{name: 'Pathankot AFS', coordinates: [32.2340, 75.6340]}}, {{name: 'Srinagar AFS', coordinates: [33.9880, 74.7740]}}, {{name: 'Awantipora AFS', coordinates: [33.9180, 75.0160]}}, {{name: 'Chandigarh AFS', coordinates: [30.6730, 76.7880]}}, {{name: 'Hindon AFS', coordinates: [28.7080, 77.3600]}}, {{name: 'Sirsa AFS', coordinates: [29.5600, 75.0200]}}, {{name: 'Faridkot AFS', coordinates: [30.6700, 74.7500]}}]
      }}
    ]
  }},
  {{
    name: 'TRI-SERVICE COMMANDS',
    organization: {{
      approximateStrength: 'Joint forces drawn from Army, Navy, and Air Force',
      officers: ['Tri-Service Staff Officers'],
      jcos: ['Tri-Service NCOs'],
      ors: ['Tri-Service Personnel']
    }},
    commands: [
      {{
        name: 'Andaman and Nicobar Command', hq: 'Port Blair', coverage: 'Andaman and Nicobar Islands, Bay of Bengal', hqCoordinates: [11.6234, 92.7265], coverageStates: ['Andaman and Nicobar'],
        bases: [{{name: 'INS Utkrosh', coordinates: [11.6427, 92.7303]}}, {{name: 'INS Baaz', coordinates: [6.9945, 93.8964]}}, {{name: 'INS Kohassa', coordinates: [13.2500, 93.0000]}}, {{name: 'INS Kardip', coordinates: [8.1800, 93.5300]}}, {{name: 'INS Jarawa', coordinates: [11.6600, 92.7400]}}, {{name: 'Carnic AFS', coordinates: [9.1500, 92.7700]}}, {{name: 'Shibpur AFS', coordinates: [13.2600, 93.0100]}}, {{name: 'Birchgunj Military Station', coordinates: [11.6200, 92.7100]}}, {{name: 'Brichgunj Base', coordinates: [11.6300, 92.7200]}}, {{name: 'Rangat Base', coordinates: [12.5000, 92.9500]}}]
      }}
    ]
  }}
];

export const UNITS_DATA: UnitDetail[] = {json.dumps(units_data, indent=4)};
"""

with open('src/app/forces/forcesData.ts', 'w') as f:
    f.write(output)

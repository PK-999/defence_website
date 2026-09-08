import json
import os

iaf_data = [
    # 1. Active Fighter & Combat Fleet (2026)
    {"title": "Sukhoi Su-30MKI", "domain": "Air", "category": "Fighter Aircraft", "origin": "Russia/India", "summary": "Heavy, all-weather, long-range fighter.", "specs": json.dumps({"Dimensions": "L: 21.9 m / W: 14.7 m / H: 6.36 m", "MTOW": "38,800 kg", "Payload": "8,000 kg", "Weapons": "BrahMos-A, Astra Mk1, R-77, R-73, Rudram-1, Kh-59, Spice bombs", "Inducted": "2002", "Squadrons": "~12-14 Squadrons (Nos. 2, 4, 8, 15, 20, 24, 30, 31, 102, 106, 220, 221, 222)"})},
    {"title": "Dassault Rafale", "domain": "Air", "category": "Multirole Fighter", "origin": "France", "summary": "Twin-engine, canard delta wing, multirole fighter aircraft.", "specs": json.dumps({"Dimensions": "L: 15.27 m / W: 10.90 m / H: 5.34 m", "MTOW": "24,500 kg", "Payload": "9,500 kg", "Weapons": "Meteor BVR, MICA (IR/RF), SCALP EG cruise missiles, HAMMER smart bombs", "Inducted": "2020", "Squadrons": "2 Squadrons (No. 17 Golden Arrows, No. 101 Falcons)"})},
    {"title": "HAL Tejas", "domain": "Air", "category": "Fighter Aircraft", "origin": "India", "summary": "Indigenous 4.5 generation light combat aircraft.", "specs": json.dumps({"Dimensions": "L: 13.2 m / W: 8.2 m / H: 4.4 m", "MTOW": "13,500 kg", "Payload": "5,300 kg", "Weapons": "Astra Mk1, Python-5, Derby BVR, R-73, Kh-59ME, Laser-Guided Bombs", "Inducted": "2016", "Squadrons": "2 Squadrons (No. 45 Flying Daggers, No. 18 Flying Bullets)"})},
    {"title": "Dassault Mirage 2000", "domain": "Air", "category": "Fighter Aircraft", "origin": "France", "summary": "Delta wing multirole fighter, upgraded to I / TI.", "specs": json.dumps({"Dimensions": "L: 14.36 m / W: 9.13 m / H: 5.2 m", "MTOW": "17,000 kg", "Payload": "6,300 kg", "Weapons": "MICA (IR/RF), Spice 2000 precision bombs, AS-30L, Popeye", "Inducted": "1985", "Squadrons": "3 Squadrons (No. 1 Tigers, No. 7 Battle Axes, No. 9 Wolfpack)"})},
    {"title": "Mikoyan MiG-29", "domain": "Air", "category": "Air Superiority Fighter", "origin": "Soviet Union", "summary": "Twin-engine fighter aircraft.", "specs": json.dumps({"Dimensions": "L: 17.32 m / W: 11.36 m / H: 4.73 m", "MTOW": "18,000 kg", "Payload": "4,500 kg", "Weapons": "R-77 BVR, R-73, Kh-31A/P anti-radiation missiles, unguided bombs", "Inducted": "1986", "Squadrons": "3 Squadrons (No. 29 First Supersonics, No. 47 Black Archers, No. 223 Tridents)"})},
    {"title": "SEPECAT Jaguar", "domain": "Air", "category": "Attack Aircraft", "origin": "United Kingdom", "summary": "Anglo-French ground attack aircraft.", "specs": json.dumps({"Dimensions": "L: 16.83 m / W: 8.69 m / H: 4.89 m", "MTOW": "15,700 kg", "Payload": "4,770 kg", "Weapons": "CBU-105 Sensor Fuzed Weapons, Harpoon Block II, ASRAAM over-wing missiles", "Inducted": "1979", "Squadrons": "5-6 Squadrons (Nos. 5, 6, 14, 16, 27, 224)"})},

    # 2. Active Transport & Special Mission Fleet
    {"title": "Boeing C-17 Globemaster III", "domain": "Air", "category": "Transport Aircraft", "origin": "United States", "summary": "Heavy-lift tactical deployment.", "specs": json.dumps({"Dimensions": "L: 53.0 m / W: 51.75 m / H: 16.8 m", "MTOW": "265,350 kg", "Payload": "77,500 kg", "Inducted": "2013", "Squadrons": "1 Squadron (No. 81 Skylords)"})},
    {"title": "Lockheed Martin C-130J-30", "domain": "Air", "category": "Transport Aircraft", "origin": "United States", "summary": "Special operations, high-altitude drops.", "specs": json.dumps({"Dimensions": "L: 34.37 m / W: 40.41 m / H: 11.84 m", "MTOW": "74,389 kg", "Payload": "19,900 kg", "Inducted": "2011", "Squadrons": "2 Squadrons (No. 77 Veera Chinar, No. 87)"})},
    {"title": "Ilyushin Il-76 / Il-78", "domain": "Air", "category": "Transport/Tanker", "origin": "Soviet Union", "summary": "Heavy strategic airlift or aerial refuelling.", "specs": json.dumps({"Dimensions": "L: 46.59 m / W: 50.50 m / H: 14.76 m", "MTOW": "190,000 kg", "Payload": "47,000 kg", "Inducted": "1985", "Squadrons": "2 Squadrons (No. 44 Mighty Jets, No. 78 Battle Cry)"})},
    {"title": "Antonov An-32", "domain": "Air", "category": "Transport Aircraft", "origin": "Soviet Union", "summary": "Twin-engine turboprop tactical workhorse for high-altitude logistics.", "specs": json.dumps({"Dimensions": "L: 27.62 m / W: 29.20 m / H: 8.75 m", "MTOW": "27,000 kg", "Payload": "6,700 kg", "Inducted": "1984", "Squadrons": "~5-6 Squadrons (Nos. 12, 25, 33, 43, 48)"})},
    {"title": "Airbus C-295MW", "domain": "Air", "category": "Transport Aircraft", "origin": "Spain/India", "summary": "Modern light tactical transport.", "specs": json.dumps({"Dimensions": "L: 24.45 m / W: 25.81 m / H: 8.60 m", "MTOW": "23,200 kg", "Payload": "7,050 kg", "Inducted": "2023", "Squadrons": "Fleet expanding (No. 11 Rhinos initial conversion)"})},
    {"title": "Dornier Do-228", "domain": "Air", "category": "Transport Aircraft", "origin": "Germany/India", "summary": "Light utility, VIP transport, and route surveying.", "specs": json.dumps({"Dimensions": "L: 16.56 m / W: 16.97 m / H: 4.86 m", "MTOW": "6,575 kg", "Payload": "2,057 kg", "Inducted": "1988", "Squadrons": "Multiple Units (No. 19, No. 41)"})},
    {"title": "A-50EI AWACS / Netra", "domain": "Air", "category": "AEW&C", "origin": "Russia/India", "summary": "Airborne Early Warning.", "specs": json.dumps({"Dimensions": "Varies by airframe platform", "Weapons": "ELTA EL/W-2090 radar array / DRDO indigenous AESA array.", "Inducted": "2009", "Squadrons": "2 Units (No. 50 Sqn, No. 200 Sqn)"})},

    # 3. Active Rotary Fleet
    {"title": "Mil Mi-17", "domain": "Air", "category": "Transport Helicopter", "origin": "Russia", "summary": "Medium twin-turbine transport helicopter.", "specs": json.dumps({"Dimensions": "L: 18.42 m / W: 2.50 m / H: 4.76 m", "MTOW": "13,000 kg", "Payload": "4,000 kg", "Weapons": "Shturm-V missiles, S-8 rocket pods, 23mm gun pods", "Inducted": "1981", "Squadrons": "~15+ Helicopter Units"})},
    {"title": "Boeing AH-64E Apache", "domain": "Air", "category": "Attack Helicopter", "origin": "United States", "summary": "Dedicated attack helicopter.", "specs": json.dumps({"Dimensions": "L: 17.73 m / W: 5.20 m / H: 3.87 m", "MTOW": "10,433 kg", "Weapons": "16x Hellfire missiles, Hydra 70mm rockets, 30mm chain gun", "Inducted": "2019", "Squadrons": "2 Units (e.g., No. 125 Helicopter Unit)"})},
    {"title": "Boeing CH-47F Chinook", "domain": "Air", "category": "Heavy Lift Helicopter", "origin": "United States", "summary": "External cargo/heavy artillery hook-lifting.", "specs": json.dumps({"Dimensions": "L: 30.10 m / W: 4.80 m / H: 5.70 m", "MTOW": "22,680 kg", "Payload": "10,800 kg sling", "Inducted": "2019", "Squadrons": "1 Unit (No. 126 Helicopter Flight)"})},
    {"title": "HAL Dhruv / Rudra", "domain": "Air", "category": "Utility/Attack Helicopter", "origin": "India", "summary": "Utility and Light Attack.", "specs": json.dumps({"Dimensions": "L: 15.87 m / W: 2.80 m / H: 4.98 m", "MTOW": "5,500 kg", "Payload": "1,500 kg", "Weapons": "Helina anti-tank missiles, 70mm rockets, 20mm turret gun", "Inducted": "2002", "Squadrons": "Multiple Units (e.g., 151 HU, 114 HU, etc.)"})},
    {"title": "HAL Prachand (LCH)", "domain": "Air", "category": "Attack Helicopter", "origin": "India", "summary": "Light Combat Helicopter.", "specs": json.dumps({"Dimensions": "L: 15.80 m / W: 4.70 m / H: 4.70 m", "MTOW": "5,800 kg", "Weapons": "Mistral air-to-air missiles, FZ231 70mm rocket pods, 20mm M621 gun", "Inducted": "2022", "Squadrons": "1 Unit (No. 143 Helicopter Unit)"})},
    {"title": "Chetak / Cheetah", "domain": "Air", "category": "Light Utility Helicopter", "origin": "France/India", "summary": "Light utility, casualty evacuation, Siachen Glacier lifeline duty.", "specs": json.dumps({"Dimensions": "L: 12.84 m / W: 2.60 m / H: 3.00 m", "MTOW": "2,200 kg", "Payload": "500 kg", "Inducted": "1962", "Squadrons": "Phasing out"})},

    # 4. Historical & Decommissioned Fleet
    {"title": "Mikoyan MiG-21", "domain": "Air", "category": "Historical Fighter", "origin": "Soviet Union", "summary": "Legacy supersonic fighter aircraft.", "specs": json.dumps({"Dimensions": "L: 14.50 m / W: 7.15 m", "MTOW": "10,400 kg", "Payload": "1,000-2,000 kg", "Weapons": "R-73, R-77, Kopyo radar, 23mm GSh-23 gun", "Inducted": "1963", "Squadrons": "Peak 28+ Squadrons"})},
    {"title": "Mikoyan MiG-27 / MiG-23", "domain": "Air", "category": "Historical Attack Aircraft", "origin": "Soviet Union", "summary": "Legacy ground attack aircraft.", "specs": json.dumps({"Dimensions": "L: 17.08 m / W: 13.97 m", "MTOW": "20,300 kg", "Payload": "4,000 kg", "Weapons": "30mm GSh-6-30 rotary cannon, Kh-25 missiles, unguided pods", "Inducted": "1980", "Squadrons": "7-9 Squadrons"})},
    {"title": "Mikoyan MiG-25R", "domain": "Air", "category": "Historical Reconnaissance", "origin": "Soviet Union", "summary": "Strategic high-altitude camera reconnaissance and ELINT sensory payloads.", "specs": json.dumps({"Dimensions": "L: 23.82 m / W: 13.42 m", "MTOW": "41,200 kg", "Inducted": "1981", "Squadrons": "1 Squadron (No. 102 Squadron)"})},
    {"title": "HAL HF-24 Marut", "domain": "Air", "category": "Historical Fighter", "origin": "India", "summary": "First Indian designed and built jet fighter.", "specs": json.dumps({"Dimensions": "L: 15.86 m / W: 9.00 m", "MTOW": "10,900 kg", "Payload": "1,800 kg", "Weapons": "4x 30mm ADEN guns, internal pack of fifty 68mm rockets", "Inducted": "1967", "Squadrons": "3 Squadrons (Nos. 10, 31, 220)"})},
    {"title": "Folland Gnat / HAL Ajeet", "domain": "Air", "category": "Historical Fighter", "origin": "United Kingdom", "summary": "Small, light swept-wing fighter and attack aircraft.", "specs": json.dumps({"Dimensions": "L: 8.74 m / W: 6.75 m", "MTOW": "4,100 kg", "Payload": "500-1,000 kg", "Weapons": "2x 30mm ADEN cannons, 2x 500 lb bombs underwing", "Inducted": "1958", "Squadrons": "8 Squadrons"})},
    {"title": "English Electric Canberra", "domain": "Air", "category": "Historical Bomber", "origin": "United Kingdom", "summary": "First-generation jet-powered light bomber.", "specs": json.dumps({"Dimensions": "L: 19.96 m / W: 19.51 m", "MTOW": "24,900 kg", "Payload": "2,700 kg internal bomb bay capacity", "Weapons": "4x 20mm Hispano cannons", "Inducted": "1957", "Squadrons": "5 Squadrons"})},
    {"title": "Hawker Hunter", "domain": "Air", "category": "Historical Fighter", "origin": "United Kingdom", "summary": "Transonic British jet-powered fighter aircraft.", "specs": json.dumps({"Dimensions": "L: 14.00 m / W: 10.26 m", "MTOW": "11,158 kg", "Payload": "1,360 kg external", "Weapons": "4x 30mm ADEN cannons, 68mm rockets, unguided bombs", "Inducted": "1957", "Squadrons": "8 Squadrons"})},
    {"title": "Consolidated B-24 Liberator", "domain": "Air", "category": "Historical Bomber", "origin": "United States", "summary": "American heavy bomber.", "specs": json.dumps({"Dimensions": "L: 20.47 m / W: 33.53 m", "MTOW": "29,500 kg", "Payload": "3,600 kg bombs", "Weapons": "Up to ten 0.50 caliber M2 Browning gun mounts", "Inducted": "1948", "Squadrons": "2 Squadrons"})},
    {"title": "Dassault Ouragan / Mystère", "domain": "Air", "category": "Historical Fighter", "origin": "France", "summary": "French fighter-bomber aircraft.", "specs": json.dumps({"Dimensions": "L: 12.89 m / W: 11.12 m", "MTOW": "9,500 kg", "Payload": "1,000 kg", "Weapons": "2x 30mm cannons, Matra internal folding rocket pack", "Inducted": "1953", "Squadrons": "4-5 Squadrons"})},
    {"title": "Westland Wapiti Mk IIA", "domain": "Air", "category": "Historical Biplane", "origin": "United Kingdom", "summary": "Two-seat general-purpose military single-engine biplane.", "specs": json.dumps({"Dimensions": "L: 9.81 m / W: 14.15 m", "MTOW": "2,450 kg", "Weapons": "1x forward Vickers gun, 1x rear Lewis gun, 260 kg bomb racks", "Inducted": "1933", "Squadrons": "1 Flight / Sqn (The founding 'A' Flight, No. 1 Sqn)"})}
]

# Read existing equipment
filepath = 'data/equipment.json'
with open(filepath, 'r') as f:
    existing_data = json.load(f)

# Convert existing to a dict to update or append
existing_dict = {item['title']: item for item in existing_data}

for eq in iaf_data:
    if eq["title"] in existing_dict:
        # Update specs and details
        existing = existing_dict[eq["title"]]
        existing["specs"] = eq.get("specs", "[]")
        existing["summary"] = eq["summary"]
        existing["category"] = eq["category"]
    else:
        new_item = {
            "title": eq["title"],
            "slug": eq["title"].lower().replace(' ', '-').replace('/', '-'),
            "domain": eq["domain"],
            "category": eq["category"],
            "summary": eq["summary"],
            "status": "Published",
            "developmentModel": "Indigenous" if "India" in eq["origin"] else "Imported",
            "serviceStatus": "Deployed" if "Historical" not in eq["category"] else "Retired",
            "originCountries": f'["{eq["origin"]}"]',
            "specs": eq.get("specs", "[]"),
            "content": f"{eq['title']} is a {eq['category'].lower()} currently deployed by the Indian Armed Forces. Origin: {eq['origin']}."
        }
        existing_data.append(new_item)

with open(filepath, 'w') as f:
    json.dump(existing_data, f, indent=2)

print(f"Updated {filepath} with IAF data. Total equipment: {len(existing_data)}")

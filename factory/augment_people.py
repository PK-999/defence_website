import json
import re

def infer_branch(text):
    text = text.lower()
    if any(x in text for x in ["indian air force", "air force", "iaf", "flying officer", "wing commander", "squadron"]):
        return "Air Force"
    if any(x in text for x in ["indian navy", "navy", "naval", "ins ", "admiral", "commodore"]):
        return "Navy"
    if any(x in text for x in ["indian army", "army", "regiment", "battalion", "rifles", "gurkha", "sikh", "jat", "rajput", "grenadier", "infantry", "cavalry", "artillery"]):
        return "Army"
    return "Army" # default to Army for heroes if unknown, as it's the largest branch

def extract_decorations(text):
    medals = ["Param Vir Chakra", "Maha Vir Chakra", "Vir Chakra", "Ashoka Chakra", "Kirti Chakra", "Shaurya Chakra", "Sena Medal", "Nao Sena Medal", "Vayu Sena Medal", "Param Vishisht Seva Medal", "Ati Vishisht Seva Medal", "Vishisht Seva Medal", "Padma Vibhushan", "Padma Bhushan", "Padma Shri", "Military Cross"]
    found = []
    for m in medals:
        if m.lower() in text.lower():
            found.append(m)
    return found

def extract_conflict(text):
    conflicts = {
        "Kargil War": ["kargil", "operation vijay", "tiger hill", "tololing"],
        "1971 Indo-Pakistani War": ["1971", "basantar", "hilli", "east pakistan", "bangladesh liberation"],
        "1965 Indo-Pakistani War": ["1965", "asal uttar", "chawinda", "haji pir"],
        "1962 Sino-Indian War": ["1962", "sino-indian", "rezang la", "namka chu", "walong", "bum la"],
        "1947 Indo-Pakistani War": ["1947", "1948", "badgam", "tithwal", "poonch", "zozi la"],
        "Operation Blue Star": ["blue star", "golden temple"],
        "Operation Pawan": ["pawan", "sri lanka", "ipkf"],
        "Counter Insurgency": ["counter-insurgency", "counter insurgency", "kupwara", "pampore", "kashmir", "rashtriya rifles", "militants", "terrorists", "insurgents"],
        "Siachen Conflict": ["siachen", "operation meghdoot", "bana post"]
    }
    
    text = text.lower()
    for conflict, keywords in conflicts.items():
        if any(kw in text for kw in keywords):
            return conflict
    return ""

def extract_year(text):
    match = re.search(r'\b(194[78]|196[25]|1971|198[47]|1999|20[0-2][0-9])\b', text)
    if match:
        return match.group(1)
    return ""

def process_file(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
        
    for p in data:
        text = (p.get("summary", "") + " " + p.get("content", "")).replace('\n', ' ')
        
        if not p.get("serviceBranch"):
            p["serviceBranch"] = infer_branch(text)
            
        current_decs = []
        if p.get("decorations"):
            if isinstance(p["decorations"], str):
                try:
                    current_decs = json.loads(p["decorations"])
                except:
                    pass
            elif isinstance(p["decorations"], list):
                current_decs = p["decorations"]
                
        new_decs = extract_decorations(text)
        # Merge unique
        all_decs = list(set(current_decs + new_decs))
        if all_decs:
            p["decorations"] = json.dumps(all_decs)
        else:
            p["decorations"] = "[]"
            
        if not p.get("conflict"):
            p["conflict"] = extract_conflict(text)
            
        if not p.get("year"):
            p["year"] = extract_year(text)

    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

process_file('data/people.json')
process_file('data/people_scraped.json')
print("Augmented people data.")

import json
import os

def generate():
    os.makedirs('data', exist_ok=True)
    
    equipment = [
        # ARMY (Land) - MBTs & Armoured Vehicles
        {"title": "Arjun MBT", "domain": "Land", "category": "Main Battle Tank", "origin": "India", "summary": "Third generation main battle tank developed by DRDO.", "conflicts": []},
        {"title": "T-90S Bhishma", "domain": "Land", "category": "Main Battle Tank", "origin": "Russia", "summary": "Third generation Russian-origin MBT.", "conflicts": []},
        {"title": "T-72 Ajeya", "domain": "Land", "category": "Main Battle Tank", "origin": "Soviet Union", "summary": "Second generation MBT.", "conflicts": []},
        {"title": "Centurion Tank", "domain": "Land", "category": "Main Battle Tank", "origin": "United Kingdom", "summary": "British-made MBT crucial in the 1965 war.", "conflicts": [{"slug": "indo-pak-1965"}, {"slug": "indo-pak-1971"}]},
        {"title": "Bofors FH-77B", "domain": "Land", "category": "Towed Artillery", "origin": "Sweden", "summary": "155mm howitzer famously used in the Kargil War.", "conflicts": [{"slug": "kargil-1999"}]},
        
        # AIR FORCE (Air)
        {"title": "Mirage 2000", "domain": "Air", "category": "Fighter Aircraft", "origin": "France", "summary": "Delta wing multirole fighter, crucial during Kargil.", "conflicts": [{"slug": "kargil-1999"}]},
        {"title": "Hawker Hunter", "domain": "Air", "category": "Fighter Aircraft", "origin": "United Kingdom", "summary": "Transonic British jet fighter.", "conflicts": [{"slug": "indo-pak-1965"}, {"slug": "indo-pak-1971"}]},
        {"title": "Folland Gnat", "domain": "Air", "category": "Fighter Aircraft", "origin": "United Kingdom", "summary": "Compact swept-wing fighter, nicknamed 'Sabre Slayer'.", "conflicts": [{"slug": "indo-pak-1965"}, {"slug": "indo-pak-1971"}]},
        {"title": "Mil Mi-17", "domain": "Air", "category": "Transport Helicopter", "origin": "Russia", "summary": "Medium twin-turbine transport helicopter.", "conflicts": [{"slug": "kargil-1999"}]},

        # NAVY (Sea)
        {"title": "INS Vikrant (R11)", "domain": "Sea", "category": "Aircraft Carrier", "origin": "United Kingdom", "summary": "First aircraft carrier of the Indian Navy.", "conflicts": [{"slug": "goa-1961"}, {"slug": "indo-pak-1971"}]},
        {"title": "Vidyut-class Missile Boat", "domain": "Sea", "category": "Missile Boat", "origin": "Soviet Union", "summary": "Fast attack craft used in Operation Trident.", "conflicts": [{"slug": "indo-pak-1971"}]},
    ]

    out = []
    for eq in equipment:
        
        # Create detailed markdown content
        content = f"""## Overview
The {eq['title']} is a highly capable {eq['category'].lower()} originally developed in {eq['origin']}. It serves as a critical component in the Indian Armed Forces' {eq['domain']} operations.

## Operational History
This equipment has seen extensive deployment and has proved its mettle in numerous high-stakes operations. Its robust design and firepower have repeatedly turned the tide of battle.

## Technical Specifications
* **Domain:** {eq['domain']}
* **Category:** {eq['category']}
* **Status:** Active Deployment
"""

        if "Bofors" in eq['title']:
            content += "\n**Kargil War Performance:** The Bofors howitzer became a household name during the Kargil War, where its shoot-and-scoot capability and devastating high-altitude accuracy shattered enemy bunkers on steep cliffs, providing essential cover for advancing infantry."
        elif "Mirage" in eq['title']:
            content += "\n**Kargil War Performance:** The Mirage 2000s were instrumental in Operation Safed Sagar, utilizing laser-guided bombs to destroy heavily fortified Pakistani logistical bases like Muntho Dhalo, changing the course of the war."
        elif "Gnat" in eq['title']:
            content += "\n**Sabre Slayer:** During the 1965 war, the tiny Folland Gnat consistently outmaneuvered the technically superior Pakistani F-86 Sabres, earning the legendary moniker 'Sabre Slayer'."
        elif "Vidyut" in eq['title']:
            content += "\n**Operation Trident:** These boats, armed with Styx missiles, successfully penetrated Karachi harbor defenses in 1971, marking one of the most successful naval operations in modern history."
        
        out.append({
            "title": eq["title"],
            "slug": eq["title"].lower().replace(' ', '-').replace('/', '-').replace('(', '').replace(')', ''),
            "domain": eq["domain"],
            "category": eq["category"],
            "summary": eq["summary"],
            "status": "Published",
            "developmentModel": "Indigenous" if "India" in eq["origin"] else "Imported",
            "serviceStatus": "Deployed",
            "originCountries": f'["{eq["origin"]}"]',
            "specs": "[]",
            "content": content,
            "conflicts": { "connect": eq["conflicts"] }
        })
    
    with open('data/equipment.json', 'w') as f:
        json.dump(out, f, indent=2)
    print(f"Generated {len(out)} equipment items.")

if __name__ == '__main__':
    generate()

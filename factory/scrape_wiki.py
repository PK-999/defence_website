import requests
from bs4 import BeautifulSoup
import json
import uuid

def fetch_operations():
    url = "https://en.wikipedia.org/wiki/List_of_military_operations_of_India"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    operations = []
    
    # Wiki pages usually have tables of operations
    for table in soup.find_all('table', class_='wikitable'):
        rows = table.find_all('tr')
        for row in rows[1:]:
            cols = row.find_all(['td', 'th'])
            if len(cols) >= 3:
                name = cols[0].text.strip()
                date_str = cols[1].text.strip()
                summary = cols[2].text.strip()
                
                # Try to clean up name (remove refs like [1])
                name = name.split('[')[0].strip()
                summary = summary.split('[')[0].strip()
                
                operations.append({
                    "title": name,
                    "slug": name.lower().replace(' ', '-').replace("'", ""),
                    "category": "Operation",
                    "status": "Published",
                    "dateStart": date_str,
                    "summary": summary[:200],
                    "content": summary
                })
                
    with open('data/operations_exhaustive.json', 'w') as f:
        json.dump(operations, f, indent=2)
    print(f"Scraped {len(operations)} operations.")

def fetch_equipment():
    urls = [
        ("https://en.wikipedia.org/wiki/List_of_equipment_of_the_Indian_Army", "Land"),
        ("https://en.wikipedia.org/wiki/List_of_active_Indian_military_aircraft", "Air"),
        ("https://en.wikipedia.org/wiki/List_of_active_Indian_Navy_ships", "Sea")
    ]
    
    equipment = []
    
    for url, domain in urls:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for table in soup.find_all('table', class_='wikitable'):
            rows = table.find_all('tr')
            for row in rows[1:]:
                cols = row.find_all('td')
                if len(cols) >= 3:
                    name = cols[0].text.strip()
                    origin = cols[1].text.strip()
                    type_cat = cols[2].text.strip()
                    
                    name = name.split('[')[0].strip()
                    type_cat = type_cat.split('[')[0].strip()
                    
                    equipment.append({
                        "title": name,
                        "slug": name.lower().replace(' ', '-').replace('/', '-'),
                        "domain": domain,
                        "category": type_cat,
                        "summary": f"{origin} {type_cat}",
                        "status": "Published",
                        "developmentModel": "Imported" if "India" not in origin else "Indigenous",
                        "serviceStatus": "Deployed",
                        "originCountries": f'["{origin}"]',
                        "specs": "[]",
                        "content": f"{name} is a {type_cat} of origin {origin}, used by the Indian Armed Forces."
                    })
                    
    # Deduplicate by slug
    seen = set()
    deduped = []
    for eq in equipment:
        if eq['slug'] not in seen and len(eq['slug']) > 0:
            seen.add(eq['slug'])
            deduped.append(eq)
            
    with open('data/equipment_exhaustive.json', 'w') as f:
        json.dump(deduped, f, indent=2)
    print(f"Scraped {len(deduped)} equipment items.")

if __name__ == "__main__":
    fetch_operations()
    fetch_equipment()

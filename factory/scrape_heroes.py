import json
import time
from SPARQLWrapper import SPARQLWrapper, JSON
import wikipedia
import dateparser
from datetime import datetime

# Medal Wikidata IDs
MEDALS = {
    "wd:Q1650629": "Param Vir Chakra",
    "wd:Q2684997": "Maha Vir Chakra",
    "wd:Q2640487": "Vir Chakra",
    "wd:Q1196605": "Ashoka Chakra",
    "wd:Q1860255": "Kirti Chakra"
}

def format_date(date_str):
    if not date_str:
        return ""
    # Wikidata dates are often ISO format like +1923-01-31T00:00:00Z
    try:
        dt = dateparser.parse(date_str)
        if dt:
            return dt.strftime("%d-%m-%Y")
    except:
        pass
    return date_str

def main():
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    sparql.setReturnFormat(JSON)

    medal_values = " ".join(MEDALS.keys())
    
    query = f"""
    SELECT ?personLabel ?medalLabel ?birthDate ?deathDate ?wikipediaLink WHERE {{
      ?person wdt:P166 ?medal.
      VALUES ?medal {{ {medal_values} }}
      
      OPTIONAL {{ ?person wdt:P569 ?birthDate. }}
      OPTIONAL {{ ?person wdt:P570 ?deathDate. }}
      OPTIONAL {{
        ?wikipediaLink schema:about ?person;
                       schema:inLanguage "en";
                       schema:isPartOf <https://en.wikipedia.org/>.
      }}
      
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """
    
    # We use LIMIT 50 for this test iteration. If we want all 2100, we remove the limit.
    # But since Wikipedia API takes ~1s per person, 2100 requests will take 35 mins.
    # Let's start by doing 50 to see it works.
    
    sparql.setQuery(query)
    sparql.addCustomHttpHeader("User-Agent", "DefenceWebsite/1.0 (contact@example.com)")
    
    print("Executing SPARQL query...")
    ret = sparql.queryAndConvert()
    results = ret["results"]["bindings"]
    print(f"Found {len(results)} raw results.")
    
    heroes = []
    seen_slugs = set()
    
    for idx, r in enumerate(results):
        name = r.get("personLabel", {}).get("value", "")
        if not name or name.startswith("Q"):
            continue
            
        slug = name.lower().replace(' ', '-').replace('.', '')
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)
        
        medal_label = r.get("medalLabel", {}).get("value", "")
        birth_raw = r.get("birthDate", {}).get("value", "")
        death_raw = r.get("deathDate", {}).get("value", "")
        wiki_url = r.get("wikipediaLink", {}).get("value", "")
        
        birth = format_date(birth_raw)
        death = format_date(death_raw)
        
        # Fetch biography from Wikipedia
        summary = ""
        if wiki_url:
            page_title = wiki_url.split("/")[-1]
            try:
                # Use wikipedia package to get summary
                summary = wikipedia.summary(page_title, auto_suggest=False)
            except Exception as e:
                summary = f"{name} is an awardee of the {medal_label}. (Biography not available)"
        else:
            summary = f"{name} is an awardee of the {medal_label}. (Wikipedia page missing)"
            
        heroes.append({
            "title": name,
            "fullName": name,
            "slug": slug,
            "rank": "Unknown", # Rank is often hard to extract from Wikidata reliably
            "status": "Published",
            "birthDate": birth,
            "deathDate": death,
            "summary": summary[:200] + "..." if len(summary) > 200 else summary,
            "content": summary
        })
        
        if idx % 10 == 0:
            print(f"Processed {idx}/{len(results)}")
            
        time.sleep(0.1) # Be nice to Wikipedia API
        
    with open("data/people_scraped.json", "w") as f:
        json.dump(heroes, f, indent=2)
        
    print(f"Saved {len(heroes)} heroes to data/people_scraped.json")

if __name__ == "__main__":
    main()

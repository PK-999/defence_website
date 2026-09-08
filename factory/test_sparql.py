import requests

query = """
SELECT ?personLabel ?medalLabel WHERE {
  ?person wdt:P166 ?medal.
  VALUES ?medal { wd:Q646678 wd:Q3282216 wd:Q3560599 wd:Q2866632 }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 100
"""

url = 'https://query.wikidata.org/sparql'
r = requests.get(url, params={'format': 'json', 'query': query})
data = r.json()
print(f"Results: {len(data['results']['bindings'])}")

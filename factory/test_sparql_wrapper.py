from SPARQLWrapper import SPARQLWrapper, JSON

sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
sparql.setReturnFormat(JSON)

query = """
SELECT ?personLabel WHERE {
  ?person wdt:P166 wd:Q646678 .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
} LIMIT 10
"""
sparql.setQuery(query)
sparql.addCustomHttpHeader("User-Agent", "DefenceWebsite/1.0")

try:
    ret = sparql.queryAndConvert()
    results = ret["results"]["bindings"]
    print(f"Found {len(results)} results")
    for r in results:
        name = r.get("personLabel", {}).get("value", "N/A")
        print(name)
except Exception as e:
    print("Error:", e)

import json

filepath = 'data/equipment.json'
with open(filepath, 'r') as f:
    data = json.load(f)

for eq in data:
    if "Historical" in eq["category"]:
        eq["category"] = eq["category"].replace("Historical ", "")
        eq["serviceStatus"] = "Retired"
    
    # Also standardize "Deployed" vs "Active" if needed
    if eq["serviceStatus"] == "Active":
        eq["serviceStatus"] = "Deployed"

with open(filepath, 'w') as f:
    json.dump(data, f, indent=2)

print("Fixed equipment categories and statuses.")

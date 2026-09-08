import json

def generate():
    people = [
        # 21 Param Vir Chakra Awardees
        {"title": "Maj. Somnath Sharma", "rank": "Major", "birth": "31-01-1923", "death": "03-11-1947", "decorations": ["Param Vir Chakra"], "summary": "First recipient of the Param Vir Chakra, posthumously awarded for actions during the Battle of Badgam in 1947."},
        {"title": "Naik Jadunath Singh", "rank": "Naik", "birth": "21-11-1916", "death": "06-02-1948", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for actions during the Indo-Pakistani War of 1947."},
        {"title": "2nd Lt. Rama Raghoba Rane", "rank": "Second Lieutenant", "birth": "26-06-1918", "death": "11-07-1994", "decorations": ["Param Vir Chakra"], "summary": "Awarded the PVC for clearing minefields during the Indo-Pakistani War of 1947."},
        {"title": "CHM Piru Singh", "rank": "Company Havildar Major", "birth": "20-05-1918", "death": "18-07-1948", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for bravery in the Battle of Tithwal."},
        {"title": "L/Nk Karam Singh", "rank": "Lance Naik", "birth": "15-09-1915", "death": "20-01-1993", "decorations": ["Param Vir Chakra", "Military Medal"], "summary": "Awarded the PVC for repelling Pakistani attacks at Richhmar Gali."},
        {"title": "Capt. Gurbachan Singh Salaria", "rank": "Captain", "birth": "29-11-1935", "death": "05-12-1961", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for UN peacekeeping operations in the Congo."},
        {"title": "Maj. Dhan Singh Thapa", "rank": "Major", "birth": "10-04-1928", "death": "06-09-2005", "decorations": ["Param Vir Chakra"], "summary": "Awarded the PVC for actions at Sirijap during the 1962 Sino-Indian War."},
        {"title": "Sub. Joginder Singh", "rank": "Subedar", "birth": "26-09-1921", "death": "23-10-1962", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for the Battle of Bum La during the 1962 Sino-Indian War."},
        {"title": "Maj. Shaitan Singh", "rank": "Major", "birth": "01-12-1924", "death": "18-11-1962", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for leading the Battle of Rezang La in 1962."},
        {"title": "CQMH Abdul Hamid", "rank": "Company Quarter Master Havildar", "birth": "01-07-1933", "death": "10-09-1965", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for destroying Pakistani Patton tanks in the Battle of Asal Uttar."},
        {"title": "Lt. Col. Ardeshir Tarapore", "rank": "Lieutenant Colonel", "birth": "18-08-1923", "death": "16-09-1965", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for commanding the Poona Horse in the Battle of Chawinda."},
        {"title": "L/Nk Albert Ekka", "rank": "Lance Naik", "birth": "27-12-1942", "death": "03-12-1971", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC during the Battle of Hilli in 1971."},
        {"title": "Fg Off. Nirmal Jit Singh Sekhon", "rank": "Flying Officer", "birth": "17-07-1943", "death": "14-12-1971", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC; only IAF officer to receive it. Defended Srinagar air base."},
        {"title": "2nd Lt. Arun Khetarpal", "rank": "Second Lieutenant", "birth": "14-10-1950", "death": "16-12-1971", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for destroying Pakistani tanks at the Battle of Basantar."},
        {"title": "Maj. Hoshiar Singh", "rank": "Major", "birth": "05-05-1936", "death": "06-12-1998", "decorations": ["Param Vir Chakra"], "summary": "Awarded the PVC for actions at the Battle of Basantar in 1971."},
        {"title": "Nb Sub. Bana Singh", "rank": "Naib Subedar", "birth": "06-01-1949", "death": None, "decorations": ["Param Vir Chakra"], "summary": "Awarded the PVC for capturing the Quaid Post (renamed Bana Post) in Siachen in 1987."},
        {"title": "Maj. Ramaswamy Parameswaran", "rank": "Major", "birth": "13-09-1946", "death": "25-11-1987", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC during Operation Pawan in Sri Lanka."},
        {"title": "Capt. Vikram Batra", "rank": "Captain", "birth": "09-09-1974", "death": "07-07-1999", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for capturing Point 5140 and Point 4875 during the Kargil War."},
        {"title": "Lt. Manoj Kumar Pandey", "rank": "Lieutenant", "birth": "25-06-1975", "death": "03-07-1999", "decorations": ["Param Vir Chakra"], "summary": "Posthumously awarded the PVC for clearing enemy bunkers at Jubar Top during the Kargil War."},
        {"title": "Gdr. Yogendra Singh Yadav", "rank": "Grenadier", "birth": "10-05-1980", "death": None, "decorations": ["Param Vir Chakra"], "summary": "Awarded the PVC for actions during the Battle of Tiger Hill. Youngest recipient."},
        {"title": "Rfn. Sanjay Kumar", "rank": "Rifleman", "birth": "03-03-1976", "death": None, "decorations": ["Param Vir Chakra"], "summary": "Awarded the PVC for capturing Area Flat Top during the Kargil War."},
        
        # Maha Vir Chakra (MVC) & Vir Chakra (VrC) Awardees
        {"title": "Brig. Rajinder Singh", "rank": "Brigadier", "birth": "14-06-1899", "death": "26-10-1947", "decorations": ["Maha Vir Chakra"], "summary": "First recipient of the Maha Vir Chakra, posthumously awarded for defending Kashmir in 1947."},
        {"title": "Lt. Gen. Sagat Singh", "rank": "Lieutenant General", "birth": "14-07-1919", "death": "26-09-2001", "decorations": ["Param Vishisht Seva Medal", "Padma Bhushan"], "summary": "Key architect of the 1971 victory in East Pakistan, renowned for his use of helicopters during the Meghna heli bridge."},
        {"title": "Wg Cdr. Abhinandan Varthaman", "rank": "Wing Commander", "birth": "21-06-1983", "death": None, "decorations": ["Vir Chakra"], "summary": "IAF pilot awarded the Vir Chakra for shooting down a Pakistani F-16 during the 2019 border skirmish."},
        {"title": "Maj. Gen. Ian Cardozo", "rank": "Major General", "birth": "01-01-1937", "death": None, "decorations": ["Sena Medal", "Ati Vishisht Seva Medal"], "summary": "Highly decorated officer, first war-disabled officer of the Indian Army to command a battalion and a brigade."},
        
        # Peacetime Gallantry (Ashoka Chakra, Kirti Chakra, Shaurya Chakra)
        {"title": "Hav. Hangpan Dada", "rank": "Havildar", "birth": "02-10-1979", "death": "26-05-2016", "decorations": ["Ashoka Chakra"], "summary": "Posthumously awarded the Ashoka Chakra for neutralizing four terrorists in Kupwara, Jammu and Kashmir."},
        {"title": "Maj. Mohit Sharma", "rank": "Major", "birth": "13-01-1978", "death": "21-03-2009", "decorations": ["Ashoka Chakra", "Sena Medal"], "summary": "Posthumously awarded the Ashoka Chakra for his courage in counter-terrorism operations in Kupwara."},
        {"title": "Capt. Anshuman Singh", "rank": "Captain", "birth": "01-01-1997", "death": "19-07-2023", "decorations": ["Kirti Chakra"], "summary": "Army medical officer posthumously awarded the Kirti Chakra for rescuing individuals from a fire at the Siachen Glacier."},
        {"title": "Capt. Pawan Kumar", "rank": "Captain", "birth": "15-01-1993", "death": "21-02-2016", "decorations": ["Shaurya Chakra"], "summary": "Posthumously awarded the Shaurya Chakra for leading operations against terrorists in Pampore."},
        
        # Distinguished Service Medals
        {"title": "Admiral Karambir Singh", "rank": "Admiral", "birth": "03-11-1959", "death": None, "decorations": ["Param Vishisht Seva Medal", "Ati Vishisht Seva Medal"], "summary": "Former Chief of the Naval Staff, highly decorated for distinguished service."},
        {"title": "Air Chief Marshal B. S. Dhanoa", "rank": "Air Chief Marshal", "birth": "07-09-1957", "death": None, "decorations": ["Param Vishisht Seva Medal", "Ati Vishisht Seva Medal", "Yudh Seva Medal", "Vayu Sena Medal"], "summary": "Commanded the IAF during the Balakot airstrikes, highly decorated across multiple categories."},
        
        # High Ranking Officials & Other Medals
        {"title": "Field Marshal Sam Manekshaw", "rank": "Field Marshal", "birth": "03-04-1914", "death": "27-06-2008", "decorations": ["Military Cross", "Padma Vibhushan", "Padma Bhushan"], "summary": "Chief of the Army Staff during the 1971 Indo-Pakistani War."},
        {"title": "Field Marshal K. M. Cariappa", "rank": "Field Marshal", "birth": "28-01-1899", "death": "15-05-1993", "decorations": ["Order of the British Empire"], "summary": "First Indian Commander-in-Chief of the Indian Army."},
        {"title": "Marshal of the IAF Arjan Singh", "rank": "Marshal of the Air Force", "birth": "15-04-1919", "death": "16-09-2017", "decorations": ["Distinguished Flying Cross", "Padma Vibhushan"], "summary": "Chief of the Air Staff during the 1965 Indo-Pakistani War."}
    ]

    out = []
    for p in people:
        # Infer service branch
        service = "Army"
        if p["rank"] in ["Wing Commander", "Flying Officer", "Air Chief Marshal", "Marshal of the Air Force"]:
            service = "Air Force"
        elif p["rank"] in ["Admiral", "Commodore", "Captain (Navy)"]:
            service = "Navy"

        out.append({
            "title": p["title"],
            "fullName": p["title"].replace("Capt. ", "").replace("Maj. ", "").replace("Lt. ", "").replace("2nd ", ""),
            "slug": p["title"].lower().replace(' ', '-').replace('.', ''),
            "rank": p["rank"],
            "status": "Published",
            "birthDate": p["birth"],
            "deathDate": p["death"] if p["death"] else "",
            "serviceBranch": service,
            "decorations": json.dumps(p.get("decorations", [])),
            "summary": p["summary"],
            "content": f"{p['title']} ({p['rank']}) was an Indian military hero. Known for: {p['summary']}",
        })
    
    with open('data/people.json', 'w') as f:
        json.dump(out, f, indent=2)
    print(f"Generated {len(out)} people.")

if __name__ == '__main__':
    generate()

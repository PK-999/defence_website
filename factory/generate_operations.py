import json
import os

def generate():
    os.makedirs('data', exist_ok=True)
    
    # OPERATIONS
    operations = [
        # 1947 War
        {
            "title": "Battle of Badgam",
            "slug": "battle-of-badgam-1947",
            "category": "Battle",
            "dateStart": "03-11-1947",
            "status": "Published",
            "summary": "Major Somnath Sharma leads a legendary defense against tribal raiders.",
            "content": """The Battle of Badgam was a critical defensive engagement during the Indo-Pakistani War of 1947. 

**The Looming Threat**
By early November 1947, tribal Lashkars had reached the outskirts of Srinagar, threatening the vital airfield that was the only lifeline for Indian reinforcements. D Company of the 4th Battalion, Kumaon Regiment, led by Major Somnath Sharma, was tasked with establishing a fighting patrol to Badgam village to check the infiltrators' advance.

**The Ambush**
On November 3rd, the patrol was surrounded by a numerically overwhelming force of over 500 tribal raiders from the Gulmarg direction. Despite being heavily outnumbered and taking severe casualties, the company held its ground. Major Sharma, with his right arm in plaster due to a previous hockey injury, personally rushed from trench to trench under heavy fire to distribute ammunition and encourage his men.

**"I shall not withdraw an inch..."**
His last radio transmission to Brigade Headquarters remains one of the most famous in Indian military history: 
*"The enemies are only 50 yards from us. We are heavily outnumbered. We are under devastating fire. I shall not withdraw an inch but will fight to our last man and our last round."*

Shortly after, a mortar shell landed on his position, killing him instantly. By the time a relief force arrived, the raiders had suffered heavy casualties and their advance was stalled, saving Srinagar airfield. Major Somnath Sharma was posthumously awarded India's first Param Vir Chakra.""",
            "coordinates": "[34.0133, 74.7214]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Battle_of_Badgam",
            "conflicts": { "connect": [{"slug": "indo-pak-1947"}] }
        },
        {
            "title": "Operation Bison (Zoji La)",
            "slug": "operation-bison-1948",
            "category": "Military Operation",
            "dateStart": "01-11-1948",
            "status": "Published",
            "summary": "Historic employment of tanks at high altitude.",
            "content": """Operation Bison was an unprecedented military maneuver by the Indian Army during the 1947-48 war, aimed at breaking the Pakistani stronghold over the Zoji La pass and relieving the garrison at Leh.

**The Challenge**
Zoji La, situated at an altitude of 11,575 feet, was heavily fortified by Pakistani forces (Gilgit Scouts and tribal militias). Previous Indian infantry assaults had failed due to the sheer geographical dominance of the defenders and brutal weather conditions.

**Tanks in the Sky**
Major General K.S. Thimayya took the audacious decision to deploy Stuart Mk-VI light tanks of the 7th Light Cavalry. The tanks were dismantled, their turrets removed, and they were winched up the treacherous mountain tracks in extreme secrecy. Once at the assembly areas, they were reassembled.

**The Assault**
On 1 November 1948, amidst a blinding blizzard, the tanks launched a surprise assault. The sight of tanks at such an altitude completely demoralized the Pakistani defenders, who had believed it was impossible. The tanks blasted the enemy bunkers, leading to the swift capture of the pass and securing Ladakh for India.""",
            "coordinates": "[34.2797, 75.4608]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Operation_Bison",
            "conflicts": { "connect": [{"slug": "indo-pak-1947"}] }
        },
        # 1961 Goa
        {
            "title": "Naval Action at Mormugao",
            "slug": "naval-action-mormugao-1961",
            "category": "Naval Battle",
            "dateStart": "18-12-1961",
            "status": "Published",
            "summary": "INS Betwa and INS Beas engage the Portuguese sloop NRP Afonso de Albuquerque.",
            "content": """During Operation Vijay, the Indian Navy was tasked with securing the Goan coastline and neutralizing Portuguese naval assets.

The most significant naval action occurred at Mormugao harbor. The Portuguese sloop *NRP Afonso de Albuquerque*, commanded by Captain António da Cunha Aragão, was anchored in the bay. When Indian frigates *INS Betwa* and *INS Beas* approached, the Portuguese ship opened fire. 

A fierce gun duel ensued. The Indian ships, equipped with superior 4.5-inch guns, scored multiple direct hits on the *Afonso*. With his ship severely damaged and taking on water, Captain Aragão, who was wounded in the engagement, ordered his crew to abandon ship and beached the vessel to prevent it from sinking. The capture of Mormugao effectively ended Portuguese naval resistance in Goa.""",
            "coordinates": "[15.4128, 73.7925]",
            "referenceUrl": "https://en.wikipedia.org/wiki/NRP_Afonso_de_Albuquerque",
            "conflicts": { "connect": [{"slug": "goa-1961"}] }
        },
        # 1962 Sino-Indian War
        {
            "title": "Battle of Namka Chu",
            "slug": "battle-of-namka-chu-1962",
            "category": "Battle",
            "dateStart": "20-10-1962",
            "status": "Published",
            "summary": "Initial massive Chinese assault marking the start of the 1962 war.",
            "content": """The Battle of Namka Chu was the opening engagement of the Sino-Indian War of 1962. It took place along the Namka Chu river in the North-East Frontier Agency (NEFA, now Arunachal Pradesh).

Indian forces, primarily the 7th Infantry Brigade, were deployed in a precarious position along the river, lacking proper winter clothing, adequate ammunition, and artillery support. 

On the morning of October 20, 1962, the People's Liberation Army (PLA) launched a massive, coordinated surprise attack. Preceded by heavy mortar fire, the Chinese forces crossed the river at multiple points, overwhelming the scattered Indian outposts. The Indian troops fought valiantly but were completely outgunned and outmaneuvered. The brigade was effectively destroyed within hours, leading to a rapid Chinese advance into NEFA.""",
            "coordinates": "[27.7656, 91.7371]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Battle_of_Namka_Chu",
            "conflicts": { "connect": [{"slug": "sino-indian-1962"}] }
        },
        {
            "title": "Battle of Rezang La",
            "slug": "battle-of-rezang-la-1962",
            "category": "Battle",
            "dateStart": "18-11-1962",
            "status": "Published",
            "summary": "Ahir Company's legendary last stand in Ladakh.",
            "content": """The Battle of Rezang La is one of the most celebrated examples of a "last stand" in Indian military history.

**The Setting**
Rezang La is a mountain pass on the south-eastern approach to Chushul Valley in Ladakh, situated at a staggering altitude of 16,000 feet. C Company of the 13th Kumaon battalion, comprising 120 Ahir troops commanded by Major Shaitan Singh, was defending the pass.

**The Chinese Assault**
On the freezing morning of November 18, 1962, the Chinese PLA launched a massive wave attack against the Indian positions. The Indian troops had no artillery support and were isolated. Despite being outnumbered by a factor of 10 to 1, the C Company held their ground.

**The Last Stand**
Major Shaitan Singh moved from platoon to platoon under heavy machine-gun fire, motivating his men to fight to the last man and the last round. Even after running out of ammunition, the Indian soldiers engaged the Chinese in brutal hand-to-hand combat using bayonets and bare hands. 

Of the 120 men in the company, 114 were killed, 5 were captured (who later escaped), and 1 was sent back to tell the tale. Their sacrifice halted the Chinese advance into Chushul. Major Shaitan Singh was posthumously awarded the Param Vir Chakra. When the site was visited months later, the frozen bodies of the Indian soldiers were found still holding their weapons, surrounded by hundreds of Chinese casualties.""",
            "coordinates": "[33.4357, 78.8351]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Battle_of_Rezang_La",
            "conflicts": { "connect": [{"slug": "sino-indian-1962"}] }
        },
        # 1965 War
        {
            "title": "Battle of Haji Pir",
            "slug": "battle-of-haji-pir-1965",
            "category": "Battle",
            "dateStart": "28-08-1965",
            "status": "Published",
            "summary": "Daring capture of the strategic Haji Pir Pass.",
            "content": """The Battle of Haji Pir Pass was a daring and strategically vital operation during the 1965 Indo-Pakistani War.

**The Objective**
The Haji Pir Pass was the primary infiltration route used by Pakistani forces during Operation Gibraltar to send militants into Jammu and Kashmir. To cut off this logistical artery, the Indian Army launched a bold offensive to capture the pass.

**The Assault**
The assault was led by the 1st Para battalion under the command of Major Ranjit Singh Dayal. Approaching through treacherous, steep mountainous terrain in heavy rain, the Indian paratroopers launched a surprise attack on the Pakistani positions. 

Major Dayal's innovative tactics, including a risky flanking maneuver up a sheer cliff face, completely caught the defenders off guard. The successful capture of the pass was a major psychological and tactical victory for India, severely crippling Pakistan's infiltration operations.""",
            "coordinates": "[33.9535, 74.0535]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Battle_of_Haji_Pir_Pass",
            "conflicts": { "connect": [{"slug": "indo-pak-1965"}] }
        },
        {
            "title": "Battle of Asal Uttar",
            "slug": "battle-of-asal-uttar",
            "category": "Battle",
            "dateStart": "08-09-1965",
            "dateEnd": "10-09-1965",
            "status": "Published",
            "summary": "One of the largest tank battles fought during the Indo-Pakistani War of 1965.",
            "content": """The Battle of Asal Uttar (meaning "Fitting Reply") was a massive tank engagement that proved to be a turning point in the 1965 Indo-Pakistani War.

**The Pakistani Thrust**
Pakistan launched a major armored thrust towards the Indian town of Khem Karan in Punjab, utilizing their newly acquired, technologically superior M48 Patton tanks. Their objective was to capture Amritsar and the bridge over the Beas River, effectively cutting off Punjab.

**The Indian Trap**
The Indian forces, primarily the 4th Mountain Division and armored regiments equipped with older Centurion and Sherman tanks, fell back to form a horseshoe-shaped defensive line around the village of Asal Uttar. They deliberately breached canals to flood the surrounding sugarcane fields, creating a muddy trap.

**The Graveyard of Pattons**
As the heavy Pakistani Pattons advanced into the trap, they bogged down in the mud. Indian tanks and anti-tank teams, hidden in the tall sugarcane, opened fire at close range. In the ensuing carnage, over 100 Pakistani tanks were destroyed or captured.

**CQMH Abdul Hamid**
Company Quarter Master Havildar Abdul Hamid of the 4th Grenadiers achieved legendary status during this battle. Using a Jeep-mounted recoilless gun, he systematically destroyed three Pakistani Patton tanks and severely damaged a fourth before being killed by tank fire. He was posthumously awarded the Param Vir Chakra.""",
            "coordinates": "[31.1448, 74.5517]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Battle_of_Asal_Uttar",
            "conflicts": { "connect": [{"slug": "indo-pak-1965"}] }
        },
        # 1971 War
        {
            "title": "Operation Trident",
            "slug": "operation-trident",
            "category": "Naval Operation",
            "dateStart": "04-12-1971",
            "dateEnd": "05-12-1971",
            "status": "Published",
            "summary": "Offensive operation by the Indian Navy on Pakistan's port city of Karachi.",
            "content": """Operation Trident was a devastating and historically significant naval offensive launched by the Indian Navy against the Pakistani port city of Karachi during the 1971 War.

**The Plan**
Karachi was the headquarters of the Pakistani Navy and the hub of its maritime trade. The Indian Navy devised a bold plan to attack the heavily defended harbor using Vidyut-class missile boats (*INS Nipat*, *INS Nirghat*, and *INS Veer*), escorted by anti-submarine corvettes. 

**First Use of Anti-Ship Missiles**
On the night of December 4-5, the task force approached Karachi. This operation marked the first use of anti-ship missiles in combat in the region. The missile boats fired their Styx missiles with deadly accuracy.

**The Destruction**
*INS Nirghat* sank the Pakistani destroyer *PNS Khaibar*. *INS Nipat* destroyed a merchant vessel carrying critical ammunition and severely damaged another destroyer. The task force also struck the Keamari oil storage tanks in Karachi, causing a massive fire that burned for days, crippling Pakistan's fuel reserves.

The operation was executed flawlessly, with no Indian casualties, and December 4 is now celebrated annually as Navy Day in India.""",
            "coordinates": "[24.8607, 66.9905]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Operation_Trident_(1971)",
            "conflicts": { "connect": [{"slug": "indo-pak-1971"}] }
        },
        {
            "title": "Battle of Longewala",
            "slug": "battle-of-longewala",
            "category": "Battle",
            "dateStart": "04-12-1971",
            "dateEnd": "07-12-1971",
            "status": "Published",
            "summary": "Defensive battle in the western sector.",
            "content": """The Battle of Longewala is a legendary defensive stand that thwarted a major Pakistani armored offensive into the Thar Desert of Rajasthan.

**The Attack**
On the night of December 4, 1971, a massive Pakistani force comprising an infantry brigade backed by a regiment of T-59 and Sherman tanks advanced toward the isolated Indian border post of Longewala. 

**The Defense**
The post was defended by just 120 soldiers of the 23rd Battalion, Punjab Regiment, commanded by Major Kuldip Singh Chandpuri. Lacking anti-tank weapons and artillery, the Indian soldiers relied on MMGs, recoilless rifles, and sheer grit. Major Chandpuri refused orders to retreat, opting to hold the post.

Using the dunes to their advantage and laying dummy minefields, the small Indian force managed to stall the Pakistani armor throughout the night, destroying several tanks. 

**Death from Above**
As dawn broke, the Indian Air Force arrived. Four Hawker Hunter jets from the Jaisalmer base unleashed havoc on the exposed Pakistani tanks, which had no air cover. The desert terrain offered no place to hide, and the IAF decimated the Pakistani armored column, destroying or capturing over 30 tanks. Major Chandpuri was awarded the Maha Vir Chakra for his leadership.""",
            "coordinates": "[27.5255, 70.1585]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Battle_of_Longewala",
            "conflicts": { "connect": [{"slug": "indo-pak-1971"}] }
        },
        {
            "title": "Tangail Airdrop",
            "slug": "tangail-airdrop-1971",
            "category": "Airborne Operation",
            "dateStart": "11-12-1971",
            "status": "Published",
            "summary": "Largest airborne operation by Indian forces.",
            "content": """The Tangail Airdrop was a massive and highly successful airborne operation that accelerated the fall of Dhaka and the surrender of Pakistani forces in East Pakistan.

**The Objective**
The objective was to capture the Poongli Bridge over the Jamuna River, cutting off the retreat of the Pakistani 93rd Brigade from Mymensingh to Dhaka, and to link up with the advancing Maratha Light Infantry.

**The Drop**
On December 11, 1971, a fleet of An-12, C-119, and Caribou transport aircraft dropped approximately 700 paratroopers of the 2nd Battalion, Parachute Regiment (2 PARA). It was the largest airborne operation mounted by India. 

**The Aftermath**
The drop was largely accurate, and the paratroopers quickly secured the bridge after a fierce firefight. The operation caused panic among the retreating Pakistani forces and paved the way for the Indian Army's rapid advance toward Dhaka, leading to the surrender just five days later.""",
            "coordinates": "[24.2513, 89.9167]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Tangail_Airdrop",
            "conflicts": { "connect": [{"slug": "indo-pak-1971"}] }
        },
        # Siachen
        {
            "title": "Operation Rajiv (Capture of Quaid Post)",
            "slug": "operation-rajiv-1987",
            "category": "High Altitude Assault",
            "dateStart": "23-06-1987",
            "dateEnd": "26-06-1987",
            "status": "Published",
            "summary": "Capture of a strategic post on the Siachen glacier.",
            "content": """Operation Rajiv was a seemingly impossible assault on the highest peak in the Siachen Glacier region, demonstrating unparalleled human endurance and combat skill.

**Quaid Post**
At an elevation of 21,153 feet, the Pakistani 'Quaid Post' dominated the Saltoro Ridge, allowing Pakistani forces to direct artillery fire onto Indian supply routes. The post was essentially a sheer ice wall with a 90-degree incline, considered impregnable.

**The Assault**
After multiple failed attempts and the loss of the task force commander, 2nd Lt. Rajiv Pande, the mission fell to Naib Subedar Bana Singh and a small team of five men from the 8th Jammu and Kashmir Light Infantry. 

On June 26, 1987, in the midst of a raging blizzard and temperatures plummeting to -50°C, Bana Singh and his team scaled the 1500-foot ice wall in complete darkness. 

**The Capture**
Reaching the top undetected, they found a single Pakistani bunker. Bana Singh hurled a grenade inside and charged with his bayonet, engaging in brutal hand-to-hand combat. All Pakistani defenders were killed, and the post was captured. In honor of his incredible bravery, the post was renamed "Bana Top", and Bana Singh was awarded the Param Vir Chakra.""",
            "coordinates": "[35.2100, 77.0200]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Operation_Rajiv",
            "conflicts": { "connect": [{"slug": "siachen-1984"}] }
        },
        # Kargil
        {
            "title": "Infiltration Discovered",
            "slug": "kargil-infiltration-discovered",
            "category": "Turning Point",
            "dateStart": "03-05-1999",
            "status": "Published",
            "summary": "Local shepherds report armed men on the heights.",
            "content": """The Kargil War began not with a massive bombardment, but with a quiet discovery by local civilians.

On May 3, 1999, local shepherds Tashi Namgyal and others were searching for a lost yak in the rugged Banju area of the Batalik sector. Instead of their yak, they spotted unknown armed men clad in black pathan suits constructing stone bunkers on the ridgelines. 

Realizing these were not Indian soldiers, they rushed down to inform the local Indian Army post. The Army dispatched initial patrols, including one led by Captain Saurabh Kalia, to investigate the reports. Kalia's patrol was ambushed and captured alive, brutally tortured, and their mutilated bodies later returned. This shocking event confirmed the massive scale of the Pakistani infiltration and marked the beginning of the Kargil War.""",
            "coordinates": "[34.6186, 76.1558]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Kargil_War",
            "conflicts": { "connect": [{"slug": "kargil-1999"}] }
        },
        {
            "title": "Battle of Tololing",
            "slug": "kargil-battle-of-tololing",
            "category": "Battle",
            "dateStart": "13-06-1999",
            "dateEnd": "14-06-1999",
            "status": "Published",
            "summary": "Crucial victory secures the strategic peak.",
            "content": """The Battle of Tololing was the turning point of the Kargil War. The Tololing peak was a dominant feature overlooking the vital Srinagar-Leh highway (NH-1D). Its capture was essential to secure the supply lines.

For weeks, Indian forces had suffered heavy casualties attempting frontal assaults up the barren, steep slopes under constant enemy fire. 

**The Final Assault**
The task finally fell to the 2nd Rajputana Rifles. On the night of June 13, following a massive artillery barrage, the infantry began their climb. Major Vivek Gupta and his men engaged in fierce, close-quarter combat. Despite losing several officers and men, the Rajputana Rifles finally secured the peak on the morning of June 14. 

This victory broke the psychological barrier, proving that the infiltrators could be evicted from the heights, and set the stage for subsequent successful operations.""",
            "coordinates": "[34.4533, 76.0022]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Battle_of_Tololing",
            "conflicts": { "connect": [{"slug": "kargil-1999"}] }
        },
        {
            "title": "Capture of Point 5140",
            "slug": "kargil-point-5140",
            "category": "Battle",
            "dateStart": "20-06-1999",
            "status": "Published",
            "summary": "Capt. Vikram Batra leads the assault.",
            "content": """Point 5140 was the highest peak in the Tololing complex, offering a commanding view of the entire region. Its capture was critical for the Indian Army.

The 13th Jammu and Kashmir Rifles (13 JAK RIF) were tasked with the assault. The attack was launched from two directions, with Captain Vikram Batra leading one of the teams. 

Scaling a sheer rock cliff, Batra and his men completely surprised the Pakistani defenders. In the ensuing close-quarters firefight, Batra personally killed three enemy soldiers. The peak was captured with zero Indian casualties—a remarkable military feat. 

It was after this victory that Captain Batra radioed his famous success signal, **"Yeh Dil Maange More!"** (This heart wants more!), which became the iconic catchphrase of the Kargil War.""",
            "coordinates": "[34.4550, 75.9900]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Vikram_Batra",
            "conflicts": { "connect": [{"slug": "kargil-1999"}] }
        },
        {
            "title": "Capture of Tiger Hill",
            "slug": "kargil-tiger-hill",
            "category": "Battle",
            "dateStart": "04-07-1999",
            "dateEnd": "08-07-1999",
            "status": "Published",
            "summary": "The most prominent peak falls after a grueling assault.",
            "content": """Tiger Hill was the most prominent and heavily fortified peak in the Drass sector. Its pointed, conical silhouette became the visual symbol of the Kargil War.

**The Strategy**
The 18 Grenadiers, along with the 8th Sikh Regiment, were tasked with the assault. A multi-directional attack was planned, supported by devastating direct fire from Bofors howitzers and IAF airstrikes.

**The Vertical Limit**
A specialized commando 'Ghatak' platoon, including Grenadier Yogendra Singh Yadav, was ordered to scale a sheer 1000-foot vertical cliff face to take the enemy by surprise from the rear. Despite being hit by multiple bullets and shrapnel, Yadav continued to climb, lobbing grenades into enemy bunkers and killing several defenders in hand-to-hand combat, facilitating the capture of the top.

The final capture of Tiger Hill was a massive strategic and psychological blow to Pakistan, effectively signaling the end of the conflict.""",
            "coordinates": "[34.4633, 75.9861]",
            "referenceUrl": "https://en.wikipedia.org/wiki/Battle_of_Tiger_Hill",
            "conflicts": { "connect": [{"slug": "kargil-1999"}] }
        }
    ]
    with open('data/operations.json', 'w') as f:
        json.dump(operations, f, indent=2)
        
    print("Generated operations.")

if __name__ == '__main__':
    generate()

import sqlite3
import re

RANKS = [
    "Field Marshal", "General", "Lieutenant General", "Lt. General", "Lt Gen", "Major General", "Maj. General", "Brigadier", "Colonel", "Lieutenant Colonel", "Lt. Colonel", "Lt Col", "Major", "Captain", "Lieutenant", "Lt.", "Second Lieutenant", "2nd Lt.", "Subedar Major", "Subedar", "Naib Subedar", "Havildar", "CHM", "Naik", "Lance Naik", "L/Nk", "Sepoy", "Rifleman", "Grenadier",
    "Marshal of the Indian Air Force", "Air Chief Marshal", "Air Marshal", "Air Vice Marshal", "Air Commodore", "Group Captain", "Wing Commander", "Squadron Leader", "Flight Lieutenant", "Flt Lt", "Flying Officer", "Pilot Officer", "Master Warrant Officer", "Warrant Officer", "Junior Warrant Officer", "Sergeant", "Sgt", "Corporal", "Cpl", "Leading Aircraftsman", "Aircraftsman",
    "Admiral of the Fleet", "Admiral", "Vice Admiral", "Rear Admiral", "Commodore", "Commander", "Lieutenant Commander", "Sub Lieutenant", "Acting Sub Lieutenant", "Master Chief Petty Officer", "Chief Petty Officer", "Petty Officer", "Leading Seaman", "Seaman"
]

# Sort ranks by length descending to match longest first (e.g. "Lieutenant General" before "Lieutenant")
RANKS.sort(key=len, reverse=True)

def get_rank(content):
    if not content: return "Unknown"
    # Check the first 200 chars for a rank
    prefix = content[:200].replace('\n', ' ')
    for r in RANKS:
        # Match rank as a whole word
        pattern = r'\b' + re.escape(r) + r'\b'
        if re.search(pattern, prefix, re.IGNORECASE):
            # Return proper case
            return r
    return "Unknown"

def get_better_summary(content):
    if not content: return ""
    # Remove newlines
    c = content.replace('\n', ' ')
    # Split by '. ' to get sentences
    sentences = c.split('. ')
    if len(sentences) == 0:
        return c[:200]
    
    first_sentence = sentences[0]
    if not first_sentence.endswith('.'):
        first_sentence += '.'
        
    if len(sentences) > 1 and len(first_sentence) < 80:
        second_sentence = sentences[1]
        if not second_sentence.endswith('.'):
            second_sentence += '.'
        return first_sentence + " " + second_sentence
    
    return first_sentence

def main():
    conn = sqlite3.connect('prisma/dev.db')
    c = conn.cursor()
    
    c.execute("SELECT id, rank, summary, content FROM Person")
    rows = c.fetchall()
    
    updates = []
    for row in rows:
        pid, rank, summary, content = row
        new_rank = rank
        new_summary = summary
        
        if rank == "Unknown" or not rank:
            extracted = get_rank(content)
            if extracted != "Unknown":
                new_rank = extracted
                
        # Always rewrite summary to ensure it's not the ugly truncated version
        if content:
            new_summary = get_better_summary(content)
            
        if new_rank != rank or new_summary != summary:
            updates.append((new_rank, new_summary, pid))
            
    if updates:
        c.executemany("UPDATE Person SET rank = ?, summary = ? WHERE id = ?", updates)
        conn.commit()
        print(f"Updated {len(updates)} records.")
    else:
        print("No updates needed.")
        
    conn.close()

if __name__ == "__main__":
    main()

import re
import json

# --------------------------
# Raw data (2022)
# --------------------------
raw_lines = """
September: 
23rd
$37
Anthony’s adidas sweatshirt for his birthday

October:
7th
$10
Stupid chinese books i accidently threw away that i had to pay for
8th
$10.35
Some food at Kopp’s (chicken ltm and 1 scoop vanilla ice cream if you wanna be specific)
8th
$7.35
Burger for edward out of the kindness of my heart…and also partly his birthday
10th
$5
Some chicken thingies from kwik trip, had cooper pay for them, payed him back a 5 when it was just 3.99
11th
$27
Food at culvers, treating cooper and lokland as well
11th
$3
Nachos money that I owed David
16th
$50
Backpack that I actually needed
21st
$25
Chipotle food for me and cooper

November:
1st
$2
I don't even know, owed anthony for something he kept bugging me for
2nd
$19
Food at Murfs, treat cooper and lokland too
4th
$10
Coaches’ gift money (volleyball)
7th
$25
Jonathan’s birthday gift, I think it was pre-workout or something? 
11th
$13
Chipotle food…this time for just myself
13th
$30
Birthday gift (JBL) speaker for sandy
20th
$106
Christmas spending spree #1
21st
$14
Little portion for gift for dad
21st
$76
Christmas spending spree #2
25th
$10
Food at mall
25th
$41
Link’s awakening
26th
$88
Christmas spending spree #3
29th
$15
Chipotle food

December:
3rd
$3.18
2 McChickens…heh
3rd
$9
Arm sleeve for anthony 
3rd
$6
Fleece slippers for me
3rd
$8
New wallet 
4th
$5
Bake sale stuff
4th
$96
Christmas spending spree #4
6th
$1
One singular cookie
7th
$15
Fish medicine for my sick fishies
9th
$11
Jersey Mike’s Chipotle chicken sub
12th
$18
Christmas spending “spree” #5
12th
$16
Split gift w/ anthony for sandy
13th
$3
School lunch food mashed potatoes
14th
$10
Part of anthony’s gift (supplements)
16th
$17
Christmas spending “spree” #6
16th
$7
Yummy gummy bears
16th
$10
White elephant (smol lego set 🙂)
22nd
$6
Part of sweater gift for mom
22nd
$20
Bag thing gift for mom
23rd
$100
Bought a jacket. Good purchase.
24th
$40
Dad’s gift of airpods
25th
$0.60
Art of war
30th
$17.77
Candies for me, nate, and ethan
30th
$3.49
Pencils
30th
$6.99
Pencil holder (and it even came with built-in post it notes!)
30th
$2
Just gave anthony and jonathan a dollar each for no reason at all
31st
$10
Nike sweatshirt from jonathan (brand new with a family discount heh)
31st
$4
Pretzels
"""

# --------------------------
# Month name → number mapping
# --------------------------
month_map = {
    "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
    "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
}

# --------------------------
# Parse raw data
# --------------------------
raw_lines = raw_lines.strip().split("\n")
parsed_entries = []
current_year = 2022
current_month = None

i = 0
while i < len(raw_lines):
    line = raw_lines[i].strip()
    
    if not line:
        i += 1
        continue

    # Month header
    month_match = re.match(r'^(January|February|March|April|May|June|July|August|September|October|November|December):$', line)
    if month_match:
        current_month = month_map[month_match.group(1)]
        i += 1
        continue

    # Day line
    day_match = re.match(r'^(\d+)(st|nd|rd|th)$', line)
    if day_match and current_month:
        day = int(day_match.group(1))

        # Price and item
        if i + 2 < len(raw_lines):
            price_line = raw_lines[i + 1].strip()
            item_line = raw_lines[i + 2].strip()

            try:
                price = float(price_line.replace("$", ""))
            except ValueError:
                i += 1
                continue

            parsed_entries.append({
                "year": current_year,
                "month": current_month,
                "day": day,
                "price": price,
                "item": item_line
            })

        i += 3
        continue

    i += 1

# --------------------------
# Save to JSON for review
# --------------------------
with open("2022_parsed.json", "w", encoding="utf-8") as f:
    json.dump(parsed_entries, f, indent=2)

print(f"Parsed {len(parsed_entries)} entries.")

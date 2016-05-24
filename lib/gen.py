import random
import json
'''
names = ["Black Jack",  "Black Belle",  "Black Rose",  "Panther",  "Dark Star",  "Zorro",  "Blackie",  "Onyx",  "Ebony",  "Midnight",  "Black Beauty",  "Shadow",  "Eclipse",  "Smoky",  "Inky",  "Indigo",  "Stormy",  "Raven",  "Bud",  "Buddy",  "Amigo",  "Murphy",  "Charlie",  "Waldo",  "Cisco",  "Mac",  "Wilber",  "Toby",  "Ed",  "Sherman",  "Rosco",  "Chester",  "Barney",  "Chico",  "Festus",  "Shadowfax",  "Flicka",  "Dreamer",  "Copper",  "coppersmith",  "CopperPenny",  "Penny",  "Red Man",  "Ginger",  "Rojo",  "Scarlett",  "Red Baron",  "Rusty",  "Ruby",  "Nutmeg",  "Cherry"]
names = map(lambda x: x.lower().strip(), names)

min_bet_val = 50 # in INR
max_bet_val = 500 # in INR
pay_off_percent = 1.2

horses = []

for name in names:
	runs = random.randint(0, 10)
	wins = random.randint(0, runs)
	min_bet = random.randint(min_bet_val, max_bet_val)
	payoff = int(pay_off_percent * min_bet)
	horses.append({
		"name": name,
		"minBet": min_bet,
		"payoff": payoff,
		"totalRuns": runs,
		"totalWins": wins
		})

for h in horses:
	assert h['payoff'] >= h['minBet']

with open('horse_data.json', 'w') as fd:
	fd.write(json.dumps(horses))
'''

def main():
	n, s = raw_input(), raw_input()
	q = int(raw_input())
	
	count = {}
	for c in s:
		if c in count:
			count[c] += 1
		else:
			count[c] = 1

	for i in xrange(q):
		x, y = raw_input().split()
		nx, ny = 0, 0
		if x in count:
			nx = count[x]
		if y in count:
			ny = count[y]
		print nx * ny


main()
mkdir homework
cd homework
touch blank
for i in {1..5}; do echo Hello >> greetings.txt; done
for i in {1..5}; do cp greetings.txt $i.txt; done
echo cat > pets.txt
echo dog >> pets.txt
echo hamster >> pets.txt
echo cat > commands.txt
echo ls >> commands.txt
echo pwd >> commands.txt
cat pets.txt commands.txt | sort | uniq > lovetyCommands.txt

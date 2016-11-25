sed '/^$/d' data/adcode.json > data/adcode.json.1
sed 's/^/\"&/g' data/adcode.json.1 > data/adcode.json.2
sed 's/$/&\",/g' data/adcode.json.2 > data/adcode.json.3
#sed 's/$/&,/g' data/adcode.json.2 > data/adcode.json.3

file = open('tsla.csv', 'r')
json = open('TSLA.json', 'w')

string = file.readline()


res = []
while(string):
    res.append(string.split(',')[0:2])
    res[-1][1] = float(res[-1][1][1:])
    string = file.readline()

json.write('{ "data" : [')

for i in range(len(res)):
    json.write('{')
    json.write('"date" : "' + res[i][0] + '",')
    json.write('"price" : ' + str(res[i][1]))
    json.write('}')

    if i != len(res) - 1:
        json.write(',')

json.write(']}')

file.close()
json.close()
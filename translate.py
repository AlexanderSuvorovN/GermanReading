import time
import mysql.connector
import re
import datetime
import calendar
#
# MAIN
#
filename_de = 'de.txt'
filename_en = 'en.txt'
#
# open file de.txt and read all the lines
fde = open(filename_de, 'r', encoding="utf-8")
words_de = []
for x in fde:
	words_de.append(x.strip().lower())
fde.close()
#
# open file en.txt and read all the lines
fen = open(filename_en, 'r', encoding="utf-8")
words_en = []
for x in fen:
	words_en.append(x.strip().lower())
fen.close()
#
# if number of lines don't match then report error
if len(words_de) != len(words_en):
	print('Number of words in the input files don\'t match:')
	print('\tde.txt: ' + len(words_de))
	print('\ten.txt: ' + len(words_en))
	sys.exit()
#
# connect to the database
print("Connecting to database...")
try:
	cnx = mysql.connector.connect(
		host="localhost",
		database="german",
		user="german",
		passwd="cE8vQ4yO0fs38l",
		charset='utf8',
		use_unicode=True)
except mysql.connector.Error as err:
	if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
		print("Something is wrong with your user name or password")
	elif err.errno == errorcode.ER_BAD_DB_ERROR:
		print("Database does not exist")
	else:
		print(err)
cursor = cnx.cursor(dictionary=True)
#
# go through words in files and add translation if necessary
ix = 0
words_added = 0
for x in words_de:
	query = "SELECT `word_de`, `word_en` FROM `x_words_de_en` WHERE `word_de` = '"+words_de[ix]+"' AND `word_en` = '"+words_en[ix]+"'"
	cursor.execute(query)
	fetch = cursor.fetchone()
	if fetch == None:
		query1 = "INSERT IGNORE INTO `words_de` (`word`) VALUES (%(word)s)"
		query2 = "INSERT IGNORE INTO `words_en` (`word`) VALUES (%(word)s)"
		query3 = "INSERT INTO `x_words_de_en` (`word_de`, `word_en`) VALUES (%(word_de)s, %(word_en)s)"
		data1 = {'word': words_de[ix]}
		data2 = {'word': words_en[ix]}
		data3 = {'word_de': words_de[ix], 'word_en': words_en[ix]}
		cursor.execute(query1, data1)
		cursor.execute(query2, data2)
		cursor.execute(query3, data3)
		cnx.commit()
		words_added += 1
		print(f'words "{words_de[ix]}" - "{words_en[ix]}" have been added to dictionary')
	# print(f'{words_de[ix]} - {words_en[ix]}')
	ix += 1
# close database
cursor.close()
cnx.close()
# report success and exit
print(f'Added {words_added} words')
print('Complete.')


#		for key in rates[currency]['data']:
#		fxrec = {}
#		fxrec['date'] = key
#		fxrec['x_from'] = rates[currency]['x_from'].upper()
#		fxrec['x_to'] = rates[currency]['x_to'].upper()
#		fxrec['unit'] = rates[currency]['unit']
#		fxrec['forward_rate'] = rates[currency]['data'][key]['forward_rate']
#		#fxrec['reverse_rate'] = rates[currency]['data'][key]['reverse_rate']

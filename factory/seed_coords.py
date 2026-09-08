import sqlite3
import json

coords = {
    'operation-meghdoot': '[35.2100, 77.0100]',
    'operation-rajiv': '[35.2100, 77.0100]',
    'operation-safed-sagar': '[34.5200, 75.8100]',
    'operation-vijay-1999': '[34.5539, 76.1349]',
    'operation-talwar': '[23.8315, 68.2120]',
    'operation-trident': '[24.8607, 66.9905]',
    'operation-python': '[24.8607, 66.9905]',
    'operation-ablaze': '[31.6340, 74.8723]',
    'operation-riddle': '[31.5204, 74.3587]',
    'operation-blue-star': '[31.6200, 74.8765]',
    'operation-black-thunder': '[31.6200, 74.8765]',
    'operation-pawan': '[9.6615, 80.0255]',
    'operation-cactus': '[4.1755, 73.5093]',
    '2016-uri-surgical-strikes': '[34.0911, 74.0400]',
    '2019-balakot-airstrike': '[34.5533, 73.3512]'
}

conn = sqlite3.connect('prisma/dev.db')
c = conn.cursor()

for slug, c_str in coords.items():
    c.execute("UPDATE Operation SET coordinates = ? WHERE slug = ?", (c_str, slug))

conn.commit()
conn.close()
print("Updated coordinates.")

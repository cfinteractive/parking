#!/usr/bin/env python

import json
import yaml
from sys import argv

def strip_javascript(string):
    string = string.replace('parking.lots = ', '')
    string = string.replace('];', ']')
    return string

with open('js/lots-data.js', 'r', encoding='utf-8') as f:
    data = strip_javascript(f.read())
    lots = json.loads(data)

# print(json.dumps(lots, indent=2, sort_keys=True))
# print(lots[int(argv[1])])

print('---')
print('layout: lot')
print('prefix: ../../')
print(yaml.dump(lots[0], default_flow_style=False))
print('---')

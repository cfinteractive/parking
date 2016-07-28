import os
import json
import re
import csv
from operator import attrgetter

class LotList:
    """Holds a list of unique lot data points

    May be initialized with a list of LotData objects.
    """
    def __init__(self, lots=None):
        self.lots = []
        if lots != None:
            for lot in lots:
                self.add(lot)

    def __repr__(self):
        for lot in self.lots:
            return "LotList(%d lots)" % len(self.lots)

    def __str__(self):
        return str(self.lots)

    def add(self, lot):
        if not isinstance(lot, LotData):
            raise ValueError('Input must be a LotData object')
        if lot not in self.lots:
            self.lots.append(lot)
            self.lots.sort(key=attrgetter('title', 'address', 'date'))

    def summary(self):
        for lot in self.lots:
            print lot

    def csv(self, outfile):
        fieldnames = ['title',
                      'address',
                      'date',
                      'rate_1h',
                      'rate_2h',
                      'rate_3h',
                      'rate_4h',
                      'rate_evening',
                      'rate_weekend',
                     ]
        with open(outfile, 'wb') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            for lot in self.lots:
                writer.writerow(lot.to_dict())


class LotData:
    "Stores data for a lot on a specific date"
    def __init__(self, title, address, date,
                 rate_1h, rate_2h, rate_3h, rate_4h,
                 rate_evening, rate_weekend):
        self.title = title
        self.address = address
        self.date = unicode(date, 'utf-8')
        self.rate_1h = rate_1h
        self.rate_2h = rate_2h
        self.rate_3h = rate_3h
        self.rate_4h = rate_4h
        self.rate_evening = rate_evening
        self.rate_weekend = rate_weekend

    def __repr__(self):
        return repr((self.title,
                    self.address,
                    self.date,
                    self.rate_1h,
                    self.rate_2h,
                    self.rate_3h,
                    self.rate_4h,
                    self.rate_evening,
                    self.rate_weekend,
                    ))

    def __eq__(self, other):
        if (self.title == other.title and
                self.address == other.address and
                self.rate_1h == other.rate_1h and
                self.rate_2h == other.rate_2h and
                self.rate_3h == other.rate_3h and
                self.rate_3h == other.rate_3h and
                self.rate_evening == other.rate_evening and
                self.rate_weekend == other.rate_weekend):
            return True
        else:
            return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def to_dict(self):
        return {'title': self.title,
                'address': self.address,
                'date': self.date,
                'rate_1h': self.rate_1h,
                'rate_2h': self.rate_2h,
                'rate_3h': self.rate_3h,
                'rate_4h': self.rate_4h,
                'rate_evening': self.rate_evening,
                'rate_weekend': self.rate_weekend,
               }


def clean_json(path):
    """Removes extraneous code and comments from JSON

    Strips the parking.lots variable definition from beginning and end of
    the lots-data.js file. Also removes comments, which aren't valid JSON.
    """
    with open(path) as fp:
        text = fp.read()
        text = text.replace('parking.lots = [', '[')
        text = text.replace('];', ']')
        text = re.sub(r'^\s*//.*$', '', text, flags=re.M)
        return text


if __name__ == "__main__":
    lotlist = LotList()
    for file in os.listdir('data'):
        path = os.path.join('data', file)
        lots = clean_json(path)
        if (lots == ''):
            continue
        lots = json.loads(lots)
        for lot in lots:
            lotlist.add(
                LotData(
                    lot['title'],
                    lot['address'],
                    file,
                    lot['rate_1h'],
                    lot['rate_2h'],
                    lot['rate_3h'],
                    lot['rate_4h'],
                    lot['rate_evening'],
                    lot['rate_weekend']
                )
            )

    lotlist.csv('parking-prices.csv')


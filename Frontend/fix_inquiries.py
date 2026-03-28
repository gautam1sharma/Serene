import re

with open('C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/dealer/CustomerInquiries.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replacements
text = text.replace('inq.firstName + \' \' + inq.lastName', 'inq.customerName')
text = text.replace('{inq.firstName} {inq.lastName}', '{inq.customerName}')
text = text.replace('{inq.email}', '{inq.customerEmail}')
text = text.replace('{inq.car ? ${inq.car.make}  : \'Vehicle Interest\'}', '{inq.carModel || \'Vehicle Interest\'}')

text = text.replace('{selected.firstName} {selected.lastName}', '{selected.customerName}')
text = text.replace('{selected.email}', '{selected.customerEmail}')
text = text.replace('{selected.phone', '{selected.customerPhone')
text = text.replace('selected.car?.images?.[0]', 'undefined')
text = text.replace('{selected.car ? ${selected.car.year}   : \'Generic Inquiry\'}', '{selected.carModel || \'Generic Inquiry\'}')
text = text.replace('{selected.car?.trim || \'Standard\'}', '{\'Standard\'}')
text = text.replace('{selected.car?.price ? $ : \'Contact Dealer\'}', '{\'Contact Dealer\'}')

with open('C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/dealer/CustomerInquiries.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated successfully.')

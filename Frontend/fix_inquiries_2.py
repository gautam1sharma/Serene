import re

with open('C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/dealer/CustomerInquiries.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Using regex to replace the specific offending lines
text = re.sub(r'\{inq\.car \? [^}]+ : \'Vehicle Interest\'\}', '{inq.carModel || \'Vehicle Interest\'}', text)
text = re.sub(r'\{selected\.car \? [^}]+ : \'Generic Inquiry\'\}', '{selected.carModel || \'Generic Inquiry\'}', text)
text = re.sub(r'\{selected\.car\?\.price \? [^}]+ : \'Contact Dealer\'\}', "{'Contact Dealer'}", text)
text = text.replace("src={undefined ||", "src={'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400'} //")

with open('C:/Users/Gautam/Desktop/My/Project/Serene/Frontend/src/dashboards/dealer/CustomerInquiries.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Cleaned car fields.')

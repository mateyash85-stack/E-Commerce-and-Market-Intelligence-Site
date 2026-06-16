"""Insert products directly into DB — no HTTP, no connection drops."""
import random
from config.database import SessionLocal, Product

db = SessionLocal()
current = db.query(Product).count()
print(f"Current: {current}. Need {1000 - current} more.")

CATEGORIES = {
    "Electronics": [
        ("Wireless Earbuds", "True wireless earbuds with ANC and 30hr battery"),
        ("Bluetooth Speaker", "Portable waterproof speaker with 360° surround sound"),
        ("Smart LED Bulb", "16M colour WiFi smart bulb, voice control compatible"),
        ("USB-C Hub", "7-in-1 USB-C hub with HDMI and PD charging"),
        ("Mechanical Keyboard", "TKL RGB mechanical keyboard with tactile switches"),
        ("Gaming Mouse", "12000 DPI high-precision optical gaming mouse"),
        ("Laptop Stand", "Adjustable aluminium ergonomic laptop stand"),
        ("Webcam 1080p", "1080p HD webcam with built-in mic and auto light correction"),
        ("Portable Charger 20000mAh", "20000mAh fast-charge power bank dual USB"),
        ("Smart Watch Fitness", "Fitness tracker with GPS, SpO2 and AMOLED display"),
        ("15W Wireless Charger", "15W Qi wireless charging pad all devices"),
        ("1TB External SSD", "1TB portable SSD 1050 MB/s USB 3.2"),
        ("Gaming Headset 7.1", "7.1 surround sound gaming headset retractable mic"),
        ("4K Webcam Wide", "4K HDR 90° wide angle webcam"),
        ("Smart WiFi Plug", "WiFi smart plug with energy monitoring Alexa Google"),
        ("Dual Dash Cam 4K", "4K front and rear dual dash cam with GPS night vision"),
        ("Full HD Projector", "Full HD 200 ANSI lumen portable projector HDMI"),
        ("Over-Ear ANC Headphones", "Over-ear ANC 40hr playtime foldable headphones"),
        ("WiFi Photo Frame 10in", "10 inch WiFi digital photo frame auto-rotate"),
        ("Adjustable Tablet Stand", "Multi-angle desk adjustable tablet stand"),
    ],
    "Sports": [
        ("Eco Yoga Mat 6mm", "6mm non-slip eco-friendly TPE yoga mat with strap"),
        ("Resistance Band Set 5pc", "5-piece latex resistance bands strength training"),
        ("EPP Foam Roller", "High-density foam roller for muscle recovery"),
        ("Speed Jump Rope", "Speed rope with ball bearings adjustable cable"),
        ("Vinyl Kettlebell", "Cast iron vinyl coated kettlebell multi-weight"),
        ("Weight Lifting Gloves", "Gym gloves with wrist support anti-slip grip"),
        ("Sports Bottle 750ml", "750ml BPA-free sports bottle with time markers"),
        ("Waterproof Running Belt", "Waterproof waist belt with phone pouch"),
        ("Adjustable Ankle Weights", "Sand-filled ankle weights for cardio"),
        ("Doorframe Pull Up Bar", "No-screw pull-up bar foam grips"),
        ("Push Up Handles", "Ergonomic push-up handles for deeper activation"),
        ("Adjustable Dumbbell 20kg", "Adjustable 20kg dumbbell set chrome handles"),
        ("Padded Cycling Gloves", "Half-finger cycling gloves touchscreen tips"),
        ("Anti-Fog Swim Goggles", "UV swimming goggles adjustable strap"),
        ("Graphite Tennis Racket", "Lightweight graphite pre-strung tennis racket"),
        ("Badminton Combo Set", "2-racket badminton set with shuttlecocks net"),
        ("Size 5 Football", "FIFA approved size 5 match football butyl bladder"),
        ("Kashmir Willow Bat", "Grade 1 Kashmir willow cricket bat full grip"),
        ("PU Boxing Gloves", "PU leather training boxing gloves wrist wrap"),
        ("Anti-Fatigue Skip Mat", "Anti-fatigue jump rope mat marked jump zone"),
    ],
    "Fashion": [
        ("RFID Leather Wallet", "Slim bifold RFID blocking genuine leather wallet"),
        ("30L Waterproof Backpack", "30L waterproof canvas laptop backpack"),
        ("UV400 Aviator Sunglasses", "UV400 polarized aviator sunglasses metal frame"),
        ("Reversible Leather Belt", "Reversible genuine leather automatic buckle belt"),
        ("Mesh Strap Watch", "Minimalist quartz stainless steel mesh strap watch"),
        ("Merino Wool Scarf", "Soft merino wool scarf neutral tones"),
        ("Structured Baseball Cap", "Structured cotton embroidered baseball cap"),
        ("Canvas Zip Tote", "Heavy canvas tote with zip pocket adjustable strap"),
        ("Fleece Beanie", "Chunky knit fleece-lined warm beanie hat"),
        ("Jacquard Silk Tie", "100% mulberry silk jacquard weave tie"),
        ("Touchscreen Leather Gloves", "Touchscreen compatible genuine leather driving gloves"),
        ("Passport Travel Wallet", "RFID travel wallet with passport and card slots"),
        ("Vegan Crossbody Bag", "Compact vegan leather crossbody adjustable bag"),
        ("UV Reversible Bucket Hat", "Reversible UV cotton bucket hat"),
        ("Padded Laptop Messenger", "15.6 inch padded laptop messenger bag"),
        ("40L Sports Duffel", "40L duffel bag shoe compartment wet/dry pocket"),
        ("Waterproof Fanny Pack", "Waterproof multi-compartment waist pack"),
        ("Polyester Drawstring Bag", "Lightweight polyester drawstring sports bag"),
        ("Y-Back Suspenders", "Adjustable elastic Y-back metal clip suspenders"),
        ("Velvet Bow Tie", "Pre-tied adjustable velvet formal bow tie"),
    ],
    "Home": [
        ("12-Cup Coffee Maker", "12-cup programmable drip coffee maker thermal carafe"),
        ("HEPA Air Purifier", "HEPA air purifier 40sqm rooms sleep mode"),
        ("LiDAR Robot Vacuum", "LiDAR navigation robot vacuum auto-empty"),
        ("7-in-1 Instant Pot", "7-in-1 electric pressure slow rice cooker"),
        ("800W Stand Mixer 5L", "800W stand mixer 5L bowl dough hook whisk"),
        ("1000W Hand Blender", "1000W immersion blender stainless blade chopper"),
        ("Convection Toaster Oven", "Convection air fry toaster oven digital"),
        ("Temperature Control Kettle", "1.7L fast-boil temperature control kettle"),
        ("Fuzzy Logic Rice Cooker", "1.8L fuzzy logic rice cooker steamer basket"),
        ("1200W Food Processor", "1200W 3L food processor multiple discs"),
        ("Portable Induction Cooktop", "2000W portable induction cooktop 9 settings"),
        ("5.5L Digital Air Fryer", "5.5L 8-preset dishwasher safe air fryer"),
        ("Cold Press Juicer", "Slow juicer reverse function easy clean"),
        ("Non-Stick Sandwich Maker", "Non-stick sandwich maker indicator light"),
        ("20L Solo Microwave", "20L solo microwave 700W child lock"),
        ("RO+UV Water Purifier", "8-stage RO+UV water purifier TDS controller"),
        ("Cool Mist Humidifier 4L", "4L ultrasonic cool mist humidifier night light"),
        ("3-Speed Table Fan", "400mm 3-speed tilt adjustable table fan"),
        ("Ceramic Room Heater", "1500W ceramic heater thermostat overheat protection"),
        ("Wet/Dry Electric Grinder", "150W dry/wet steel jar electric grinder"),
    ],
    "Beauty": [
        ("Vitamin C Brightening Serum", "Vitamin C brightening serum hyaluronic acid 30ml"),
        ("SPF50 Oil-Free Moisturizer", "Oil-free moisturizer SPF 50 PA+++ daily use"),
        ("Tinted Lip Balm Set 6pc", "6-shade tinted lip balm shea butter vitamin E"),
        ("12-Shade Eye Palette", "12-shade neutral eyeshadow palette mirror brush"),
        ("20-Length Beard Trimmer", "Corded/cordless beard trimmer 20 length settings"),
        ("Ceramic Hair Straightener", "Ceramic plate variable temperature hair straightener"),
        ("32mm Curling Wand", "32mm tourmaline ceramic curling wand with glove"),
        ("Salicylic Acid Face Wash", "Salicylic acid face wash oily acne skin 100ml"),
        ("SPF60 Matte Sunscreen", "SPF 60 PA++++ matte finish sunscreen 100ml"),
        ("Collagen Sheet Masks 10pk", "10-pack Korean collagen sheet masks hydration"),
        ("Gel Nail Polish 12-Shade", "12-shade long-lasting gel nail polish set"),
        ("Floral EDP 100ml", "Floral woody Eau de Parfum 100ml"),
        ("Retinol Eye Cream 15ml", "Retinol eye cream dark circles fine lines 15ml"),
        ("AHA BHA Toner 150ml", "Alcohol-free AHA/BHA pore minimising toner 150ml"),
        ("Microneedle Derma Roller", "0.5mm titanium microneedle derma roller"),
        ("Jade Facial Roller Set", "Natural jade roller with gua sha stone"),
        ("Micellar Cleansing Water", "3-in-1 micellar water sensitive skin 400ml"),
        ("4-Colour Blush Palette", "Baked blush highlight contour palette"),
        ("16hr Setting Spray", "Waterproof makeup setting spray 100ml"),
        ("Argan Oil Hair Mask", "Deep conditioning argan oil hair mask 200ml"),
    ],
    "Books": [
        ("Atomic Habits", "James Clear – Tiny changes remarkable results"),
        ("Deep Work", "Cal Newport – Focused success in distracted world"),
        ("Psychology of Money", "Morgan Housel – Timeless money lessons"),
        ("Think and Grow Rich", "Napoleon Hill – Classic success guide"),
        ("Rich Dad Poor Dad", "Robert Kiyosaki – Money mindset masterclass"),
        ("The Alchemist", "Paulo Coelho – Follow your dreams fable"),
        ("Sapiens", "Yuval Noah Harari – Brief history of humankind"),
        ("Zero to One", "Peter Thiel – Notes on startups and future"),
        ("The Lean Startup", "Eric Ries – Continuous innovation guide"),
        ("Thinking Fast and Slow", "Daniel Kahneman – Two systems of thought"),
        ("Start with Why", "Simon Sinek – How great leaders inspire action"),
        ("Good to Great", "Jim Collins – Why some companies leap"),
        ("The 4-Hour Workweek", "Timothy Ferriss – Escape the 9-5 system"),
        ("Ikigai", "Japanese secret to long and happy life"),
        ("The 48 Laws of Power", "Robert Greene – Timeless laws of power"),
        ("Man's Search for Meaning", "Viktor Frankl – Holocaust psychiatrist memoir"),
        ("The Art of War", "Sun Tzu – Ancient military strategy"),
        ("Shoe Dog", "Phil Knight – Nike creator memoir"),
        ("Hard Thing About Hard Things", "Ben Horowitz – Building business playbook"),
        ("Elon Musk Biography", "Tesla SpaceX quest for fantastic future"),
    ],
    "Toys & Games": [
        ("LEGO Classic 400pc", "400-piece LEGO classic brick set ages 4+"),
        ("4WD RC Off-Road Car", "1:18 scale 4WD off-road RC car 2.4GHz"),
        ("Magnetic Chess Set", "Magnetic travel chess folding board"),
        ("3x3 Speed Cube", "Original 3x3 smooth turning speed cube"),
        ("1000pc Landscape Puzzle", "1000-piece scenic landscape jigsaw puzzle"),
        ("Toddler Building Blocks 100pc", "100-piece interlocking building blocks"),
        ("720p Mini Drone", "Foldable mini drone 720p camera 20min flight"),
        ("Premium Playing Cards 2pk", "Plastic-coated premium playing cards 2 decks"),
        ("UNO Family Card Game", "Classic UNO card game 2-10 players"),
        ("Monopoly India Edition", "Monopoly board game Indian city edition"),
        ("Portable Table Tennis", "Portable table tennis net 2 paddles 6 balls"),
        ("Full Size Carrom Board", "Carrom board with coins striker and powder"),
        ("Classic Scrabble Game", "Scrabble crossword board game for families"),
        ("12-Dart Nerf Blaster", "12-dart Nerf foam blaster with tactical rail"),
        ("Play-Doh 10 Colour Set", "10-colour Play-Doh set with modelling tools"),
        ("Magnetic Drawing Board A4", "A4 magnetic drawing writing board for kids"),
        ("Speed Cube Set 5pc", "Set of 5 speed cubes 2x2 3x3 4x4 pyramid"),
        ("High-Pressure Water Soaker", "1L tank high-pressure water gun soaker"),
        ("Pro Bearing Yo-Yo", "Professional bearing yo-yo with extra strings"),
        ("Sisal Dart Board Set", "18-inch sisal fiber dart board 6 steel darts"),
    ],
    "Kitchen": [
        ("8-Inch German Chef Knife", "German high carbon stainless steel chef knife"),
        ("Bamboo Cutting Board Set 3pc", "3-piece colour-coded bamboo cutting boards"),
        ("Pre-Seasoned Cast Iron 10in", "Pre-seasoned 10-inch cast iron skillet"),
        ("Ceramic Non-Stick Pan 24cm", "24cm Teflon-free ceramic non-stick frying pan"),
        ("Stainless Mixing Bowl Set 4pc", "4-piece stainless steel mixing bowls with lids"),
        ("7-Piece Measuring Set", "7-piece stainless measuring cup and spoon set"),
        ("5-Piece Silicone Spatula Set", "5-piece heat resistant silicone utensil set"),
        ("Wall Spice Rack 12 Jars", "Wall-mounted spice rack 12 glass jars labels"),
        ("Glass Oil Dispenser 2pk", "2-piece glass oil and vinegar dispensers"),
        ("Multipurpose Kitchen Shears", "Multipurpose kitchen scissors soft grip"),
        ("3L Stainless Colander", "3L stainless steel colander extended handles"),
        ("4-Sided Box Grater", "4-sided stainless box grater with container"),
        ("Granite Mortar and Pestle", "Granite mortar and pestle for spices"),
        ("12-Blade Veg Chopper", "Manual 12-blade vegetable chopper container"),
        ("Instant Read Thermometer", "Digital instant read meat thermometer probe"),
        ("Tapered Rolling Pin", "French tapered beech wood rolling pin"),
        ("5L Pressure Cooker ISI", "5L ISI certified aluminium pressure cooker"),
        ("Electric Can Opener", "Smooth edge safety electric can opener"),
        ("Bar Tool Set", "Bottle opener corkscrew ice tong set"),
        ("5kg Digital Kitchen Scale", "5kg digital kitchen scale with tare function"),
    ],
    "Stationery": [
        ("Medium Nib Fountain Pen", "Medium nib fountain pen converter ink cartridges"),
        ("A5 Dot Grid Notebook 192pg", "192-page A5 hardcover dot grid lay-flat notebook"),
        ("5-Compartment Bamboo Organiser", "Bamboo desk organiser 5 compartments drawer"),
        ("Colour Sticky Notes 10pk", "10-pack assorted size colour sticky notes"),
        ("12-Pack Pastel Highlighters", "Pastel and neon highlighters chisel tip set"),
        ("20pc Gel Pen Assorted", "20 fine tip gel pens assorted colour set"),
        ("Washi Tape Set 15pc", "15 decorative washi tapes for journaling craft"),
        ("Correction Tape 5pk 5mmx6m", "5-pack white correction tape 5mm x 6m"),
        ("Full Strip Stapler Kit", "Stapler with 5000 staples and remover"),
        ("4-Piece Clear Ruler Set", "4-piece acrylic ruler and protractor set"),
        ("H2-8B Drawing Pencil Set", "12 graphite drawing pencils H2 to 8B"),
        ("24-Colour Watercolour Set", "24-colour professional watercolour pan set"),
        ("5-Nib Calligraphy Set", "Calligraphy pen set ink practice sheets"),
        ("Assorted Binder Clips 60pc", "60-piece assorted binder clips metal box"),
        ("30-Sheet Paper Puncher", "3-hole 30-sheet capacity chip tray puncher"),
        ("Undated Weekly Planner", "Undated planner habit tracker goal pages"),
        ("Large Double-Zip Pencil Case", "Double zipper large capacity pencil case"),
        ("500-Sheet Index Card Set", "500-sheet ruled and blank index cards 4x6"),
        ("Washable Glue Sticks 12pk", "12-pack washable school and office glue sticks"),
        ("3-Piece Scissors Set", "3-piece multipurpose scissors office and craft"),
    ],
    "Automotive": [
        ("4K Dual Dash Cam GPS", "4K UHD front rear dash cam GPS night vision"),
        ("150PSI Digital Tyre Inflator", "Digital auto shut-off tyre inflator 150PSI"),
        ("12V HEPA Car Vacuum", "12V car vacuum HEPA filter 3m cord"),
        ("Magnetic Dashboard Mount", "360° magnetic dashboard car phone holder"),
        ("800A Lithium Jump Starter", "800A lithium jump starter + 20000mAh powerbank"),
        ("PU Leather Seat Covers 5-Seat", "Universal PU leather car seat cover set"),
        ("Anti-Slip Wheel Cover 15in", "15-inch anti-slip microfiber steering cover"),
        ("Charcoal Car Air Purifier", "Activated charcoal car air purifier deodoriser"),
        ("Bluetooth OBD2 Scanner", "Bluetooth OBD2 diagnostic scanner Android iOS"),
        ("Car Polish and Wax Kit", "Polish wax kit with applicator microfibre cloth"),
        ("4-Sensor Parking Kit", "Ultrasonic reverse parking sensor with buzzer"),
        ("Universal Rubber Floor Mats", "Universal rubber car floor mats set of 4"),
        ("Foldable Windshield Shade", "Foldable reflective windshield sun shade"),
        ("RGB Car LED Strip Lights", "RGB interior LED strip lights app control"),
        ("Real-Time GPS Tracker", "GPS tracker geofencing SOS alert"),
        ("65W Dual Port Car Charger", "65W USB-A/C fast charging car charger"),
        ("Heavy Duty Bike Chain Lock", "1.5m combination chain lock for bikes"),
        ("Adjustable Cycling Helmet", "Adult cycling helmet adjustable fit rear LED"),
        ("100PSI Floor Bike Pump", "100PSI floor pump dual head valve gauge"),
        ("Universal Bike Rear Rack", "Adjustable steel rear cargo rack for bikes"),
    ],
}

IMAGES = {
    "Electronics":  ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400","https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400","https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400","https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400"],
    "Sports":       ["https://images.unsplash.com/photo-1601925228932-ee4cceafae79?w=400","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400","https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400","https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"],
    "Fashion":      ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400","https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400","https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400"],
    "Home":         ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400","https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400","https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400","https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400"],
    "Beauty":       ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400","https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400","https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400","https://images.unsplash.com/photo-1503236823255-94d871a157c1?w=400"],
    "Books":        ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400","https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400","https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400"],
    "Toys & Games": ["https://images.unsplash.com/photo-1555448248-2571daf6344b?w=400","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400","https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400"],
    "Kitchen":      ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400","https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400","https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400"],
    "Stationery":   ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400","https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400","https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400"],
    "Automotive":   ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400","https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400","https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400"],
}

PRICE_RANGES = {
    "Electronics":(299,4999),"Sports":(99,1999),"Fashion":(149,2999),
    "Home":(199,3999),"Beauty":(49,999),"Books":(199,799),
    "Toys & Games":(99,1499),"Kitchen":(149,2499),"Stationery":(29,599),
    "Automotive":(199,3499),
}

VARIANTS = ["Pro","Plus","Lite","Mini","Max","Ultra","Elite","Premium",
            "Basic","Advanced","Classic","Modern","Smart","Deluxe","Select",
            "V2","X","HD","SE","Edition"]

categories = list(CATEGORIES.keys())
needed = 1000 - current
batch = []

for i in range(needed):
    cat = categories[i % len(categories)]
    items = CATEGORIES[cat]
    base_name, desc = items[i % len(items)]
    v = VARIANTS[(i // len(categories)) % len(VARIANTS)]
    name = f"{base_name} {v}" if i >= len(categories) else base_name

    lo, hi = PRICE_RANGES[cat]
    price = round(random.uniform(lo, hi) / 83.5, 2)
    stock = random.randint(5, 300)
    if random.random() < 0.04:
        stock = 0
    rating = round(random.uniform(3.5, 5.0), 1)
    reviews = random.randint(10, 3000)
    imgs = IMAGES.get(cat, [""])
    image_url = imgs[i % len(imgs)]

    batch.append(Product(
        name=name, description=desc, price=price,
        category=cat, image_url=image_url,
        stock=stock, rating=rating, reviews_count=reviews,
    ))

    if len(batch) == 100:
        db.add_all(batch)
        db.commit()
        total_now = current + i + 1
        print(f"  Inserted batch — total so far: {total_now}")
        batch = []

if batch:
    db.add_all(batch)
    db.commit()

final = db.query(Product).count()
db.close()
print(f"\n✓ Done! Total products in DB: {final}")

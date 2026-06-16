"""Seed remaining products to reach 1000 total."""
import requests, random, sys

BASE_URL = "http://127.0.0.1:8000"

resp = requests.post(f"{BASE_URL}/api/auth/login",
                     data={"username": "admin@shop.com", "password": "admin123"})
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

from config.database import SessionLocal, Product as P
db = SessionLocal()
current = db.query(P).count()
db.close()
print(f"Current products: {current}. Will add {1000 - current} more.")

CATEGORIES = {
    "Electronics": [
        ("Wireless Earbuds", "True wireless earbuds with ANC and 30hr battery"),
        ("Bluetooth Speaker", "Portable waterproof speaker with 360° sound"),
        ("Smart LED Bulb", "16M colour WiFi smart bulb, voice control"),
        ("USB-C Hub", "7-in-1 USB-C hub with HDMI and PD charging"),
        ("Mechanical Keyboard", "TKL RGB mechanical keyboard"),
        ("Gaming Mouse", "12000 DPI optical gaming mouse"),
        ("Laptop Stand", "Adjustable aluminium laptop stand"),
        ("Webcam HD", "1080p HD webcam with built-in mic"),
        ("Portable Charger", "20000mAh fast-charge power bank"),
        ("Smart Watch", "Fitness tracker with GPS and AMOLED display"),
        ("Wireless Charger", "15W Qi wireless charging pad"),
        ("External SSD", "1TB portable SSD 1050 MB/s USB 3.2"),
        ("Gaming Headset", "7.1 surround sound gaming headset"),
        ("4K Webcam", "4K HDR 90° wide angle webcam"),
        ("Smart Plug", "WiFi smart plug with energy monitoring"),
        ("Dash Cam", "2.5K front dash cam with night vision"),
        ("Mini Projector", "Full HD 200 ANSI lumen portable projector"),
        ("Noise Cancelling Headphones", "Over-ear ANC 40hr playtime headphones"),
        ("Digital Photo Frame", "10 inch WiFi digital photo frame"),
        ("Tablet Stand", "Multi-angle adjustable tablet stand"),
    ],
    "Sports": [
        ("Yoga Mat", "6mm non-slip eco TPE yoga mat"),
        ("Resistance Bands", "5-piece latex resistance band set"),
        ("Foam Roller", "High-density EPP foam roller"),
        ("Jump Rope", "Speed jump rope with ball bearings"),
        ("Kettlebell", "Cast iron vinyl coated kettlebell"),
        ("Gym Gloves", "Weight lifting gloves with wrist support"),
        ("Sports Water Bottle", "750ml BPA-free sports bottle"),
        ("Running Belt", "Waterproof running waist belt"),
        ("Ankle Weights", "Adjustable sand-filled ankle weights"),
        ("Pull Up Bar", "No-screw doorframe pull-up bar"),
        ("Push Up Handles", "Ergonomic push-up handle set"),
        ("Dumbbell Set", "Adjustable 20kg dumbbell set"),
        ("Cycling Gloves", "Half-finger padded cycling gloves"),
        ("Swimming Goggles", "Anti-fog UV swimming goggles"),
        ("Tennis Racket", "Lightweight graphite tennis racket"),
        ("Badminton Set", "2-racket badminton set with net"),
        ("Football", "Size 5 FIFA approved match football"),
        ("Cricket Bat", "Kashmir willow Grade 1 cricket bat"),
        ("Boxing Gloves", "PU leather training boxing gloves"),
        ("Skipping Mat", "Anti-fatigue jump rope mat"),
    ],
    "Fashion": [
        ("Leather Wallet", "Slim bifold RFID blocking leather wallet"),
        ("Canvas Backpack", "30L waterproof laptop backpack"),
        ("Polarized Sunglasses", "UV400 polarized aviator sunglasses"),
        ("Leather Belt", "Reversible genuine leather belt"),
        ("Casual Watch", "Minimalist quartz mesh strap watch"),
        ("Wool Scarf", "Soft merino wool scarf"),
        ("Baseball Cap", "Structured cotton embroidered cap"),
        ("Tote Bag", "Heavy canvas tote with zip pocket"),
        ("Beanie Hat", "Chunky knit fleece-lined beanie"),
        ("Silk Tie", "100% mulberry silk jacquard tie"),
        ("Leather Gloves", "Touchscreen compatible driving gloves"),
        ("Travel Wallet", "RFID passport holder travel wallet"),
        ("Crossbody Bag", "Vegan leather adjustable crossbody bag"),
        ("Bucket Hat", "Reversible UV cotton bucket hat"),
        ("Laptop Bag", "15.6 inch padded messenger bag"),
        ("Gym Bag", "40L duffel with shoe compartment"),
        ("Fanny Pack", "Waterproof multi-pocket waist pack"),
        ("Drawstring Bag", "Lightweight polyester drawstring bag"),
        ("Suspenders", "Y-back elastic adjustable suspenders"),
        ("Bow Tie", "Pre-tied velvet formal bow tie"),
    ],
    "Home": [
        ("Coffee Maker", "12-cup programmable drip coffee maker"),
        ("Air Purifier", "HEPA air purifier for 40sqm rooms"),
        ("Robot Vacuum", "LiDAR navigation robot vacuum"),
        ("Instant Pot", "7-in-1 electric pressure cooker"),
        ("Stand Mixer", "800W 5L bowl stand mixer"),
        ("Hand Blender", "1000W immersion blender with chopper"),
        ("Toaster Oven", "Convection and air fry toaster oven"),
        ("Electric Kettle", "1.7L temperature control kettle"),
        ("Rice Cooker", "1.8L fuzzy logic rice cooker"),
        ("Food Processor", "1200W 3L food processor"),
        ("Induction Cooktop", "2000W portable induction cooktop"),
        ("Air Fryer", "5.5L 8-preset digital air fryer"),
        ("Slow Juicer", "Cold press juicer with reverse function"),
        ("Sandwich Maker", "Non-stick sandwich maker"),
        ("Microwave Oven", "20L 700W solo microwave"),
        ("Water Purifier", "8-stage RO+UV water purifier"),
        ("Humidifier", "4L ultrasonic cool mist humidifier"),
        ("Table Fan", "400mm 3-speed tilt table fan"),
        ("Room Heater", "1500W ceramic heater with thermostat"),
        ("Electric Grinder", "150W dry/wet steel jar grinder"),
    ],
    "Beauty": [
        ("Vitamin C Serum", "Brightening face serum with HA 30ml"),
        ("SPF Moisturizer", "Oil-free SPF 50 PA+++ daily moisturizer"),
        ("Lip Balm Set", "6-shade tinted lip balm set"),
        ("Eyeshadow Palette", "12-shade neutral eye palette with mirror"),
        ("Beard Trimmer", "20-length corded/cordless beard trimmer"),
        ("Hair Straightener", "Variable temp ceramic hair straightener"),
        ("Curling Wand", "32mm tourmaline ceramic curling wand"),
        ("Salicylic Face Wash", "Salicylic acid face wash 100ml"),
        ("Sunscreen Lotion", "SPF 60 PA++++ matte sunscreen 100ml"),
        ("Korean Sheet Masks", "10-pack collagen hydrating sheet masks"),
        ("Nail Polish Set", "12-shade gel nail polish set"),
        ("Eau de Parfum", "Floral woody perfume 100ml"),
        ("Retinol Eye Cream", "Eye cream for dark circles 15ml"),
        ("AHA/BHA Toner", "Pore-minimising toner 150ml"),
        ("Derma Roller", "0.5mm titanium microneedle roller"),
        ("Jade Roller Set", "Jade roller with gua sha stone"),
        ("Micellar Water", "3-in-1 cleansing water 400ml"),
        ("Blush Palette", "4-colour highlight and blush palette"),
        ("Setting Spray", "16hr waterproof makeup setting spray"),
        ("Argan Hair Mask", "Deep conditioning hair mask 200ml"),
    ],
    "Books": [
        ("Atomic Habits", "James Clear – Tiny changes remarkable results"),
        ("Deep Work", "Cal Newport – Focused success rules"),
        ("Psychology of Money", "Morgan Housel – Timeless money lessons"),
        ("Think Grow Rich", "Napoleon Hill – Classic success guide"),
        ("Rich Dad Poor Dad", "Robert Kiyosaki – Money mindset book"),
        ("The Alchemist", "Paulo Coelho – Follow your dreams"),
        ("Sapiens", "Yuval Noah Harari – Brief history of humankind"),
        ("Zero to One", "Peter Thiel – Building the future"),
        ("The Lean Startup", "Eric Ries – Continuous innovation"),
        ("Thinking Fast Slow", "Daniel Kahneman – Two thinking systems"),
        ("Start with Why", "Simon Sinek – How great leaders inspire"),
        ("Good to Great", "Jim Collins – Why companies make the leap"),
        ("4-Hour Workweek", "Timothy Ferriss – Escape the 9-5"),
        ("Ikigai", "The Japanese secret to a long happy life"),
        ("48 Laws of Power", "Robert Greene – Laws of power"),
        ("Man Search Meaning", "Viktor Frankl – Holocaust psychiatrist's path"),
        ("The Art of War", "Sun Tzu – Ancient strategy treatise"),
        ("Shoe Dog", "Phil Knight – Nike founder memoir"),
        ("Hard Thing About Hard Things", "Ben Horowitz – Building a business"),
        ("Elon Musk Bio", "Tesla SpaceX and the quest for the future"),
    ],
    "Toys & Games": [
        ("LEGO Classic Set", "400-piece LEGO classic brick set ages 4+"),
        ("RC Car 4WD", "1:18 scale 4WD off-road RC car"),
        ("Chess Set", "Magnetic travel chess set folding board"),
        ("Speed Cube", "Original 3x3 smooth speed cube"),
        ("1000pc Jigsaw Puzzle", "Scenic landscape 1000-piece jigsaw puzzle"),
        ("Building Blocks", "100-piece interlocking toddler blocks"),
        ("Mini Drone", "Foldable drone with 720p camera"),
        ("Playing Cards", "Premium plastic-coated cards 2 decks"),
        ("UNO Card Game", "Classic UNO for 2-10 players"),
        ("Monopoly India", "Monopoly with Indian city edition"),
        ("Table Tennis Set", "Portable net set with 2 paddles"),
        ("Carrom Board", "Full-size carrom board with coins"),
        ("Scrabble Game", "Classic Scrabble crossword game"),
        ("Nerf Blaster", "12-dart Nerf foam blaster"),
        ("Play-Doh 10 Colour", "10-colour Play-Doh set with tools"),
        ("Magnetic Drawing Board", "A4 magnetic drawing board for kids"),
        ("Speed Cube Set 5pc", "Set of 5 speed cubes 2x2 to 4x4"),
        ("Water Gun Soaker", "High-pressure 1L tank water gun"),
        ("Professional Yo-Yo", "Bearing yo-yo with extra strings"),
        ("Dart Board Set", "Sisal fiber dart board with 6 darts"),
    ],
    "Kitchen": [
        ("Chef Knife 8in", "German high carbon stainless chef knife"),
        ("Bamboo Cutting Boards", "3-piece colour-coded bamboo boards"),
        ("Cast Iron Skillet", "Pre-seasoned 10-inch cast iron skillet"),
        ("Ceramic Non-Stick Pan", "24cm Teflon-free ceramic frying pan"),
        ("Mixing Bowl Set", "4-piece stainless steel bowl set with lids"),
        ("Measuring Cups", "7-piece steel measuring cup and spoon set"),
        ("Silicone Spatula Set", "5-piece heat resistant spatula set"),
        ("Spice Rack 12jar", "Wall-mounted spice rack with 12 glass jars"),
        ("Oil Dispenser Set", "2-piece glass oil and vinegar dispensers"),
        ("Kitchen Scissors", "Multipurpose shears with soft-grip handle"),
        ("Stainless Colander", "3L stainless steel colander"),
        ("Box Grater", "4-sided stainless grater with container"),
        ("Granite Mortar", "Granite mortar and pestle for spices"),
        ("Vegetable Chopper", "Manual 12-blade vegetable chopper"),
        ("Digital Thermometer", "Instant read meat thermometer"),
        ("French Rolling Pin", "Tapered beech wood rolling pin"),
        ("Pressure Cooker 5L", "5L ISI aluminium pressure cooker"),
        ("Can Opener Electric", "Smooth edge safety electric can opener"),
        ("Bottle Opener Set", "Bar tool set with corkscrew and tong"),
        ("Kitchen Scale", "5kg digital kitchen scale with tare function"),
    ],
    "Stationery": [
        ("Fountain Pen", "Medium nib fountain pen with converter"),
        ("Dot Grid Notebook A5", "192-page A5 hardcover dot grid notebook"),
        ("Desk Organiser Bamboo", "5-compartment bamboo desk organiser"),
        ("Sticky Notes Set", "10-pack colour sticky notes assorted sizes"),
        ("Pastel Highlighters", "12-pack pastel and neon highlighters"),
        ("Gel Pen Set 20pc", "20 fine tip gel pens assorted colours"),
        ("Washi Tape 15 Pack", "15 decorative washi tapes for journaling"),
        ("Correction Tape 5pk", "5-pack white correction tape 5mm x 6m"),
        ("Stapler Kit", "Full strip stapler with 5000 staples"),
        ("Clear Ruler Set", "4-piece acrylic ruler and protractor set"),
        ("Drawing Pencil Set", "12 graphite pencils H2 to 8B"),
        ("Watercolour Pan Set", "24-colour professional watercolour set"),
        ("Calligraphy Set", "5-nib calligraphy pen with ink and sheets"),
        ("Binder Clips 60pc", "Assorted binder clips metal box set"),
        ("3-Hole Puncher", "30-sheet capacity paper puncher"),
        ("Undated Planner", "Weekly planner with habit tracker"),
        ("Pencil Case Large", "Double zipper large capacity pencil case"),
        ("Index Cards 500", "500-sheet ruled and blank index cards"),
        ("Glue Sticks 12pk", "12-pack washable glue sticks"),
        ("Scissors Set 3pc", "3-piece multipurpose scissors set"),
    ],
    "Automotive": [
        ("4K Dash Cam", "4K front+rear dual dash cam with GPS"),
        ("Digital Tyre Inflator", "150PSI digital auto shut-off inflator"),
        ("Car Vacuum", "12V HEPA filter car vacuum cleaner"),
        ("Magnetic Phone Mount", "360° magnetic dashboard phone holder"),
        ("Lithium Jump Starter", "800A peak lithium jump starter + powerbank"),
        ("Car Seat Covers", "Universal PU leather seat cover set 5 seats"),
        ("Steering Wheel Cover", "15-inch anti-slip microfiber wheel cover"),
        ("Car Air Freshener", "Activated charcoal car air purifier"),
        ("OBD2 Scanner BT", "Bluetooth OBD2 diagnostic scanner"),
        ("Car Wax Kit", "Polish and wax kit with microfibre cloth"),
        ("Parking Sensors", "4-sensor ultrasonic reverse parking kit"),
        ("Rubber Floor Mats", "Universal fit rubber floor mats set of 4"),
        ("Windshield Shade", "Foldable reflective windshield sunshade"),
        ("Car LED Strip", "RGB interior LED strip lights app control"),
        ("GPS Tracker", "Real-time GPS tracker with geofencing"),
        ("65W Car Charger", "Dual USB-A/C 65W fast car charger"),
        ("Bike Lock Chain", "1.5m heavy-duty combination chain lock"),
        ("Cycling Helmet", "Adjustable adult cycling helmet with LED"),
        ("Floor Bike Pump", "100PSI floor pump with dual head valve"),
        ("Bike Rear Rack", "Universal adjustable steel bike rear rack"),
    ],
}

IMAGES = {
    "Electronics":  ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400","https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400","https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400","https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400"],
    "Sports":       ["https://images.unsplash.com/photo-1601925228932-ee4cceafae79?w=400","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400","https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400","https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"],
    "Fashion":      ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400","https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400","https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"],
    "Home":         ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400","https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400","https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"],
    "Beauty":       ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400","https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400","https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400"],
    "Books":        ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400","https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400","https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"],
    "Toys & Games": ["https://images.unsplash.com/photo-1555448248-2571daf6344b?w=400","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    "Kitchen":      ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400","https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400"],
    "Stationery":   ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400","https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400"],
    "Automotive":   ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400","https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400"],
}

PRICE_RANGES = {
    "Electronics":(299,4999),"Sports":(99,1999),"Fashion":(149,2999),
    "Home":(199,3999),"Beauty":(49,999),"Books":(199,799),
    "Toys & Games":(99,1499),"Kitchen":(149,2499),"Stationery":(29,599),
    "Automotive":(199,3499),
}

VARIANTS = ["Pro","Plus","Lite","Mini","Max","Ultra","Elite","Premium","Basic",
            "Advanced","Classic","Modern","Smart","Deluxe","Select","V2","X","HD","Plus+","SE"]

categories = list(CATEGORIES.keys())
needed = 1000 - current
success = failed = 0

for i in range(needed):
    cat = categories[i % len(categories)]
    items = CATEGORIES[cat]
    base = items[i % len(items)]
    name, desc = base
    v = VARIANTS[(i // len(categories)) % len(VARIANTS)]
    if i >= len(categories):
        name = f"{name} {v}"

    lo, hi = PRICE_RANGES[cat]
    price = round(random.uniform(lo, hi) / 83.5, 2)
    stock = random.randint(5, 300)
    if random.random() < 0.05:
        stock = 0
    rating = round(random.uniform(3.5, 5.0), 1)
    reviews = random.randint(10, 3000)
    imgs = IMAGES.get(cat, [""])
    image_url = imgs[i % len(imgs)]

    r = requests.post(f"{BASE_URL}/api/products", json={
        "name": name, "description": desc, "price": price,
        "category": cat, "image_url": image_url,
        "stock": stock, "rating": rating, "reviews_count": reviews,
    }, headers=headers)

    if r.status_code == 201:
        success += 1
    else:
        failed += 1
    if (i + 1) % 100 == 0:
        print(f"  {i+1}/{needed} — {success} ok, {failed} failed")

print(f"\nDone! Added {success}, failed {failed}.")

from config.database import SessionLocal, Product as P
db = SessionLocal()
print(f"Total in DB: {db.query(P).count()}")
db.close()

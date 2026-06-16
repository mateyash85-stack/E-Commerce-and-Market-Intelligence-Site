"""
Seed 1000 products into the database via the backend API.
Run: python seed_products.py
"""
import requests
import random
import sys

BASE_URL = "http://127.0.0.1:8000"

# ── Admin login ──────────────────────────────────────────────────────────────
resp = requests.post(f"{BASE_URL}/api/auth/login",
                     data={"username": "admin@shop.com", "password": "admin123"})
if resp.status_code != 200:
    print("Login failed:", resp.text); sys.exit(1)
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Logged in as admin ✓")

# ── Product data pools ───────────────────────────────────────────────────────
CATEGORIES = {
    "Electronics": [
        ("Wireless Earbuds", "True wireless earbuds with active noise cancellation and 30hr battery"),
        ("Bluetooth Speaker", "Portable waterproof speaker with 360° surround sound"),
        ("Smart LED Bulb", "16 million colour WiFi smart bulb, voice control compatible"),
        ("USB-C Hub", "7-in-1 USB-C hub with HDMI, SD card, and PD charging"),
        ("Mechanical Keyboard", "TKL mechanical keyboard with RGB backlighting and tactile switches"),
        ("Gaming Mouse", "High-precision optical gaming mouse with 12000 DPI sensor"),
        ("Laptop Stand", "Adjustable aluminium laptop stand for better ergonomics"),
        ("Webcam HD", "1080p HD webcam with built-in microphone and auto light correction"),
        ("Portable Charger", "20000mAh power bank with fast charging and dual USB-A/C output"),
        ("Smart Watch", "Fitness tracker with heart rate, SpO2, GPS and AMOLED display"),
        ("Wireless Charger", "15W Qi wireless charging pad compatible with all Qi devices"),
        ("SSD External", "1TB portable SSD with 1050 MB/s read speed and USB 3.2"),
        ("Gaming Headset", "7.1 surround sound gaming headset with retractable microphone"),
        ("4K Webcam", "4K ultra HD webcam with HDR and 90° wide angle lens"),
        ("Smart Plug", "WiFi smart plug with energy monitoring, works with Alexa & Google"),
        ("Digital Photo Frame", "10 inch WiFi digital photo frame with auto-rotate display"),
        ("Dash Cam", "2.5K front dash camera with night vision and loop recording"),
        ("Mini Projector", "Full HD portable projector with 200 ANSI lumens and HDMI input"),
        ("Noise Cancelling Headphones", "Over-ear ANC headphones with 40hr playtime and foldable design"),
        ("Tablet Stand", "Adjustable multi-angle tablet stand for desk and bed use"),
    ],
    "Sports": [
        ("Yoga Mat", "6mm non-slip eco-friendly TPE yoga mat with carry strap"),
        ("Resistance Bands Set", "Set of 5 latex resistance bands for strength and mobility training"),
        ("Foam Roller", "High-density EPP foam roller for muscle recovery and massage"),
        ("Jump Rope", "Speed jump rope with ball bearings and adjustable steel cable"),
        ("Kettlebell", "Cast iron kettlebell with vinyl coating, available in multiple weights"),
        ("Gym Gloves", "Weight lifting gloves with wrist support and anti-slip grip"),
        ("Water Bottle Sports", "750ml BPA-free sports bottle with time markers"),
        ("Running Belt", "Waterproof running waist belt with phone pouch and key holder"),
        ("Ankle Weights", "Adjustable sand-filled ankle weights for cardio and strength"),
        ("Pull Up Bar", "Doorframe pull-up bar with foam grips, no screws required"),
        ("Skipping Mat", "Anti-fatigue jump rope mat with marked jump zone"),
        ("Push Up Handles", "Ergonomic push-up handles for deeper chest activation"),
        ("Dumbbell Set", "Adjustable 20kg dumbbell set with chrome plated handles"),
        ("Cycling Gloves", "Half-finger padded cycling gloves with touchscreen tips"),
        ("Swimming Goggles", "Anti-fog UV-protected swimming goggles with adjustable strap"),
        ("Tennis Racket", "Lightweight graphite tennis racket with pre-strung frame"),
        ("Badminton Set", "Complete badminton set with 2 rackets, shuttlecocks and net"),
        ("Football", "Size 5 FIFA approved match football with butyl bladder"),
        ("Cricket Bat", "Kashmir willow cricket bat grade 1 with full grip and cover"),
        ("Boxing Gloves", "PU leather boxing training gloves with wrist wrap support"),
    ],
    "Fashion": [
        ("Leather Wallet", "Genuine leather slim bifold wallet with RFID blocking"),
        ("Canvas Backpack", "30L waterproof canvas backpack with laptop compartment"),
        ("Sunglasses Polarized", "UV400 polarized aviator sunglasses with metal frame"),
        ("Belt Leather", "Genuine leather reversible belt with automatic buckle"),
        ("Casual Watch", "Minimalist quartz watch with stainless steel mesh strap"),
        ("Scarf Wool", "Soft merino wool scarf in neutral tones"),
        ("Baseball Cap", "Structured cotton baseball cap with embroidered logo"),
        ("Tote Bag", "Heavy canvas tote bag with zip pocket and adjustable strap"),
        ("Beanie Hat", "Chunky knit beanie with fleece lining for extra warmth"),
        ("Silk Tie", "100% mulberry silk tie in jacquard weave pattern"),
        ("Leather Gloves", "Touchscreen compatible genuine leather driving gloves"),
        ("Travel Wallet", "RFID blocking travel wallet with passport holder and card slots"),
        ("Crossbody Bag", "Compact vegan leather crossbody bag with adjustable strap"),
        ("Bucket Hat", "Reversible cotton bucket hat with UV protection"),
        ("Suspenders", "Adjustable elastic Y-back suspenders with metal clips"),
        ("Bow Tie", "Pre-tied adjustable velvet bow tie for formal occasions"),
        ("Laptop Bag", "15.6 inch padded laptop messenger bag with organizer pockets"),
        ("Gym Bag", "40L duffel bag with shoe compartment and wet/dry separation"),
        ("Fanny Pack", "Waterproof waist pack with multiple compartments"),
        ("Drawstring Bag", "Lightweight polyester drawstring bag for sports and school"),
    ],
    "Home": [
        ("Coffee Maker", "12-cup programmable drip coffee maker with thermal carafe"),
        ("Air Purifier", "HEPA air purifier for rooms up to 40 sqm with sleep mode"),
        ("Robot Vacuum", "Smart robot vacuum with LiDAR navigation and auto-empty station"),
        ("Instant Pot", "7-in-1 multi cooker: pressure cooker, slow cooker, rice cooker"),
        ("Stand Mixer", "800W stand mixer with 5L bowl, dough hook and whisk"),
        ("Hand Blender", "1000W immersion blender with stainless steel blade and chopper"),
        ("Toaster Oven", "Digital toaster oven with convection and air fry function"),
        ("Electric Kettle", "1.7L fast-boil electric kettle with temperature control"),
        ("Rice Cooker", "1.8L fuzzy logic rice cooker with steamer basket"),
        ("Food Processor", "1200W food processor with 3L bowl and multiple discs"),
        ("Induction Cooktop", "2000W portable induction cooktop with 9 heat settings"),
        ("Air Fryer", "5.5L digital air fryer with 8 cooking presets and dishwasher safe basket"),
        ("Juicer", "Cold press slow juicer with reverse function and easy clean design"),
        ("Sandwich Maker", "Non-stick sandwich maker with indicator light"),
        ("Electric Grinder", "150W dry/wet electric grinder with stainless steel jar"),
        ("Microwave Oven", "20L solo microwave with 700W power and child lock"),
        ("Water Purifier", "8-stage RO+UV water purifier with TDS controller"),
        ("Humidifier", "Ultrasonic cool mist humidifier with 4L tank and night light"),
        ("Table Fan", "400mm high-speed table fan with 3 speed settings and tilt head"),
        ("Room Heater", "1500W ceramic room heater with thermostat and overheat protection"),
    ],
    "Beauty": [
        ("Face Serum", "Vitamin C brightening face serum with hyaluronic acid, 30ml"),
        ("Moisturizer SPF", "Oil-free moisturizer with SPF 50 PA+++ for daily use"),
        ("Lip Balm Set", "Set of 6 tinted lip balms with shea butter and vitamin E"),
        ("Eyeshadow Palette", "12-shade neutral eyeshadow palette with mirror and brush"),
        ("Beard Trimmer", "Corded/cordless beard trimmer with 20 length settings"),
        ("Hair Straightener", "Ceramic plate hair straightener with variable temperature"),
        ("Curling Wand", "32mm tourmaline ceramic curling wand with heat glove"),
        ("Face Wash", "Salicylic acid face wash for oily and acne-prone skin, 100ml"),
        ("Sunscreen Lotion", "SPF 60 PA++++ sunscreen with matte finish, 100ml"),
        ("Sheet Mask Pack", "Pack of 10 Korean collagen sheet masks for hydration"),
        ("Nail Polish Set", "Set of 12 long-lasting gel nail polish with base and top coat"),
        ("Perfume", "Eau de parfum with floral and woody notes, 100ml"),
        ("Eye Cream", "Retinol eye cream for dark circles and fine lines, 15ml"),
        ("Toner", "Alcohol-free AHA/BHA toner for pore minimising, 150ml"),
        ("Derma Roller", "0.5mm titanium microneedle derma roller for collagen stimulation"),
        ("Jade Roller", "Natural jade facial roller with gua sha stone for lymphatic drainage"),
        ("Micellar Water", "3-in-1 micellar cleansing water for sensitive skin, 400ml"),
        ("Blush Palette", "4-colour baked blush palette with highlight and contour shades"),
        ("Setting Spray", "Waterproof makeup setting spray for 16hr hold, 100ml"),
        ("Hair Mask", "Deep conditioning argan oil hair mask for damaged hair, 200ml"),
    ],
    "Books": [
        ("Atomic Habits", "Tiny changes, remarkable results – James Clear"),
        ("Deep Work", "Rules for focused success in a distracted world – Cal Newport"),
        ("The Psychology of Money", "Timeless lessons on wealth, greed and happiness – Morgan Housel"),
        ("Think and Grow Rich", "Napoleon Hill's classic guide to success and personal achievement"),
        ("Rich Dad Poor Dad", "What the rich teach their kids about money – Robert Kiyosaki"),
        ("The Alchemist", "A magical story about following your dreams – Paulo Coelho"),
        ("Sapiens", "A brief history of humankind – Yuval Noah Harari"),
        ("Zero to One", "Notes on startups, or how to build the future – Peter Thiel"),
        ("The Lean Startup", "How today's entrepreneurs use continuous innovation – Eric Ries"),
        ("Thinking Fast and Slow", "The two systems that drive the way we think – Daniel Kahneman"),
        ("Start with Why", "How great leaders inspire everyone to take action – Simon Sinek"),
        ("Good to Great", "Why some companies make the leap and others don't – Jim Collins"),
        ("The 4-Hour Workweek", "Escape the 9-5, live anywhere – Timothy Ferriss"),
        ("Ikigai", "The Japanese secret to a long and happy life"),
        ("The 48 Laws of Power", "48 laws to acquire, observe and defend against power – Robert Greene"),
        ("Man's Search for Meaning", "A psychiatrist's path through the Holocaust – Viktor Frankl"),
        ("The Art of War", "Sun Tzu's ancient military treatise on strategy"),
        ("Elon Musk Biography", "Tesla, SpaceX and the quest for a fantastic future"),
        ("Shoe Dog", "A memoir by the creator of Nike – Phil Knight"),
        ("The Hard Thing About Hard Things", "Building a business when there are no easy answers"),
    ],
    "Toys & Games": [
        ("LEGO Classic Set", "400-piece LEGO classic brick set for ages 4+"),
        ("Remote Control Car", "1:18 scale 4WD off-road RC car with 2.4GHz remote"),
        ("Board Game Chess", "Magnetic travel chess set with folding board"),
        ("Rubik's Cube", "Original 3x3 speed cube with smooth turning mechanism"),
        ("Jigsaw Puzzle 1000pc", "1000-piece scenic landscape jigsaw puzzle for adults"),
        ("Building Blocks", "100-piece interlocking building blocks for toddlers"),
        ("Drone Camera", "Foldable mini drone with 720p camera and 20min flight time"),
        ("Playing Cards Deck", "Premium plastic-coated playing cards, set of 2 decks"),
        ("UNO Card Game", "Classic UNO card game for 2-10 players"),
        ("Monopoly Board Game", "Classic Monopoly board game with updated Indian edition"),
        ("Table Tennis Set", "Portable table tennis net set with 2 paddles and 6 balls"),
        ("Carrom Board", "Full-size carrom board with coins, striker and powder"),
        ("Scrabble Board Game", "Classic Scrabble crossword board game for families"),
        ("Nerf Blaster", "12-dart Nerf foam blaster with tactical rail"),
        ("Play-Doh Set", "10-colour Play-Doh modelling compound set with tools"),
        ("Magnetic Drawing Board", "A4 size magnetic drawing and writing board for kids"),
        ("Puzzle Cube Set", "Set of 5 speed cubes including 2x2, 3x3, 4x4 and pyramid"),
        ("Water Gun", "High-pressure water soaker gun with 1L tank capacity"),
        ("Yo-Yo", "Professional bearing yo-yo with extra string set"),
        ("Dart Board Set", "18-inch sisal fiber dart board with 6 steel tip darts"),
    ],
    "Kitchen": [
        ("Chef Knife", "8-inch German high carbon stainless steel chef knife"),
        ("Cutting Board Set", "Set of 3 colour-coded bamboo cutting boards"),
        ("Cast Iron Skillet", "Pre-seasoned 10-inch cast iron skillet for all cooktops"),
        ("Non-Stick Pan", "24cm Teflon-free ceramic non-stick frying pan"),
        ("Mixing Bowl Set", "Set of 4 stainless steel mixing bowls with lids"),
        ("Measuring Cup Set", "7-piece stainless steel measuring cup and spoon set"),
        ("Peeler Set", "3-in-1 Y-peeler set for vegetables and fruits"),
        ("Spice Rack", "Wall-mounted spice rack with 12 glass jars and labels"),
        ("Oil Dispenser Set", "Set of 2 glass oil and vinegar dispensers with drip-free nozzle"),
        ("Kitchen Scissors", "Multipurpose kitchen shears with soft-grip handles"),
        ("Colander", "3L stainless steel colander with extended handles"),
        ("Grater Box", "4-sided stainless steel box grater with container"),
        ("Mortar and Pestle", "Granite mortar and pestle for grinding spices"),
        ("Vegetable Chopper", "Manual 12-blade vegetable chopper with container"),
        ("Can Opener", "Smooth edge safety electric can opener"),
        ("Bottle Opener Set", "Bar tool set with bottle opener, corkscrew and ice tong"),
        ("Kitchen Thermometer", "Instant read digital meat thermometer with foldable probe"),
        ("Rolling Pin", "French tapered beech wood rolling pin for baking"),
        ("Silicone Spatula Set", "5-piece heat resistant silicone cooking utensil set"),
        ("Pressure Cooker", "5L ISI certified aluminium pressure cooker with safety valve"),
    ],
    "Stationery": [
        ("Fountain Pen", "Medium nib fountain pen with converter and ink cartridges"),
        ("Notebook A5", "192-page dot grid A5 hardcover notebook, lay-flat binding"),
        ("Desk Organiser", "Bamboo desk organiser with 5 compartments and drawer"),
        ("Sticky Notes Set", "Set of 10 packs colour sticky notes in assorted sizes"),
        ("Highlighter Set", "Set of 12 pastel and neon highlighters, chisel tip"),
        ("Gel Pen Set", "Set of 20 fine tip gel pens in assorted colours"),
        ("Washi Tape Set", "Set of 15 decorative washi tapes for journaling and craft"),
        ("Correction Tape", "Pack of 5 white correction tape 5mm × 6m"),
        ("Stapler Set", "Full strip stapler with 5000 staples and staple remover"),
        ("Scissors Set", "Set of 3 multipurpose scissors for office and craft"),
        ("Ruler Set", "Set of 4 clear acrylic rulers: 15cm, 30cm, 45cm and protractor"),
        ("Glue Sticks", "Pack of 12 washable glue sticks for school and office"),
        ("Index Card Set", "500-sheet blank and ruled index card set, 4x6 inch"),
        ("Planner 2025", "Undated weekly planner with habit tracker and goal setting pages"),
        ("Pencil Case", "Large capacity double zipper pencil case with dividers"),
        ("Drawing Pencil Set", "Set of 12 graphite drawing pencils H2 to 8B with sharpener"),
        ("Watercolour Set", "24-colour professional watercolour pan set with brush"),
        ("Calligraphy Set", "Calligraphy pen set with 5 nibs, ink and practice sheets"),
        ("Binder Clips Set", "Assorted size binder clips set of 60 in metal box"),
        ("Paper Puncher", "3-hole paper puncher with 30-sheet capacity and chip tray"),
    ],
    "Automotive": [
        ("Car Dash Camera", "4K UHD front and rear dual dash cam with GPS and night vision"),
        ("Tyre Inflator", "Digital portable tyre inflator with auto shut-off, 150PSI"),
        ("Car Vacuum Cleaner", "12V corded car vacuum with HEPA filter and 3m cord"),
        ("Car Phone Mount", "360° adjustable magnetic car phone holder for dashboard"),
        ("Jump Starter", "800A peak portable lithium jump starter with power bank"),
        ("Car Seat Cover", "Universal fit PU leather car seat cover set for 5 seats"),
        ("Steering Wheel Cover", "15 inch anti-slip microfiber steering wheel cover"),
        ("Car Air Freshener", "Activated charcoal car air purifier and deodoriser"),
        ("OBD2 Scanner", "Bluetooth OBD2 diagnostic scanner for Android and iOS"),
        ("Car Wax Kit", "Car polish and wax kit with applicator pads and microfibre cloth"),
        ("Reverse Parking Sensor", "4-sensor ultrasonic reverse parking sensor with buzzer"),
        ("Car Floor Mats", "Universal fit rubber car floor mats, set of 4"),
        ("Windshield Sunshade", "Foldable reflective windshield sun shade for all cars"),
        ("Car LED Lights", "RGB interior car LED strip lights with app control"),
        ("Bike Lock", "1.5m heavy-duty chain bike lock with combination"),
        ("Bike Helmet", "Adult cycling helmet with adjustable fit and rear LED"),
        ("Cycling Gloves", "Half-finger padded cycling gloves with touch-screen tips"),
        ("Bike Pump", "100PSI floor bike pump with pressure gauge and dual head valve"),
        ("GPS Tracker", "Real-time GPS tracker with geo-fencing and SOS alert"),
        ("Car Charger", "65W dual port USB-A/C car charger with fast charging"),
    ],
}

UNSPLASH_IMAGES = {
    "Electronics": [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400",
        "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400",
        "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400",
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
    ],
    "Sports": [
        "https://images.unsplash.com/photo-1601925228932-ee4cceafae79?w=400",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
        "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400",
    ],
    "Fashion": [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400",
    ],
    "Home": [
        "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400",
        "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400",
    ],
    "Beauty": [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
        "https://images.unsplash.com/photo-1503236823255-94d871a157c1?w=400",
    ],
    "Books": [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
    ],
    "Toys & Games": [
        "https://images.unsplash.com/photo-1555448248-2571daf6344b?w=400",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400",
    ],
    "Kitchen": [
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400",
        "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400",
    ],
    "Stationery": [
        "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400",
        "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400",
        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400",
    ],
    "Automotive": [
        "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400",
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
    ],
}

PRICE_RANGES = {
    "Electronics":  (299, 4999),
    "Sports":       (99,  1999),
    "Fashion":      (149, 2999),
    "Home":         (199, 3999),
    "Beauty":       (49,  999),
    "Books":        (199, 799),
    "Toys & Games": (99,  1499),
    "Kitchen":      (149, 2499),
    "Stationery":   (29,  599),
    "Automotive":   (199, 3499),
}

# ── Build 1000 products ──────────────────────────────────────────────────────
products = []
categories = list(CATEGORIES.keys())

for i in range(1000):
    cat = categories[i % len(categories)]
    items = CATEGORIES[cat]
    base = items[i % len(items)]
    name, desc = base
    suffix_num = i // len(categories) + 1
    if suffix_num > 1:
        variants = ["Pro", "Plus", "Lite", "Mini", "Max", "Ultra", "Elite", "Premium",
                    "Basic", "Advanced", "Classic", "Modern", "Smart", "Deluxe", "Select"]
        variant = variants[(i // len(categories)) % len(variants)]
        name = f"{name} {variant}"

    lo, hi = PRICE_RANGES[cat]
    price = round(random.uniform(lo, hi) / 83.5, 2)   # store as USD
    stock = random.randint(0, 200)
    if stock == 0 and random.random() > 0.1:           # only ~5% out of stock
        stock = random.randint(5, 50)
    rating = round(random.uniform(3.2, 5.0), 1)
    reviews = random.randint(5, 2000)
    images = UNSPLASH_IMAGES.get(cat, [])
    image_url = images[i % len(images)] if images else ""

    products.append({
        "name": name,
        "description": desc,
        "price": price,
        "category": cat,
        "image_url": image_url,
        "stock": stock,
        "rating": rating,
        "reviews_count": reviews,
    })

# ── POST to API ──────────────────────────────────────────────────────────────
print(f"Seeding {len(products)} products...")
success, failed = 0, 0

for idx, p in enumerate(products, 1):
    r = requests.post(f"{BASE_URL}/api/products", json=p, headers=headers)
    if r.status_code == 201:
        success += 1
    else:
        failed += 1
        print(f"  ✗ [{idx}] {p['name']}: {r.status_code} {r.text[:80]}")
    if idx % 100 == 0:
        print(f"  Progress: {idx}/1000 — {success} ok, {failed} failed")

print(f"\nDone! {success} products created, {failed} failed.")

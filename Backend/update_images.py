"""
Update product images based on product name keywords.
Run from the Backend folder:
  python update_images.py
"""
from config.database import SessionLocal, Product

# Keyword-to-image mapping (checked against Unsplash)
IMAGE_MAP = [
    # Electronics
    ("wireless earbuds",        "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400"),
    ("bluetooth speaker",       "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400"),
    ("smart led bulb",          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"),
    ("usb-c hub",               "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400"),
    ("mechanical keyboard",     "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400"),
    ("gaming mouse",            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400"),
    ("laptop stand",            "https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=400"),
    ("webcam",                  "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400"),
    ("portable charger",        "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=400"),
    ("power bank",              "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=400"),
    ("smart watch",             "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"),
    ("wireless charger",        "https://images.unsplash.com/photo-1586495777744-4e6232bf5529?w=400"),
    ("external ssd",            "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400"),
    ("gaming headset",          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"),
    ("noise cancelling headphones", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"),
    ("headphones",              "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"),
    ("smart plug",              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"),
    ("dash cam",                "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400"),
    ("projector",               "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400"),
    ("tablet stand",            "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400"),
    ("digital photo frame",     "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400"),

    # Sports
    ("yoga mat",                "https://images.unsplash.com/photo-1601925228932-ee4cceafae79?w=400"),
    ("resistance band",         "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"),
    ("foam roller",             "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"),
    ("jump rope",               "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400"),
    ("kettlebell",              "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400"),
    ("gym gloves",              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"),
    ("water bottle",            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"),
    ("running belt",            "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400"),
    ("ankle weights",           "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"),
    ("pull up bar",             "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"),
    ("push up handles",         "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400"),
    ("dumbbell",                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400"),
    ("cycling gloves",          "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400"),
    ("swimming goggles",        "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400"),
    ("tennis racket",           "https://images.unsplash.com/photo-1617529497471-9218633199c0?w=400"),
    ("badminton",               "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400"),
    ("football",                "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400"),
    ("cricket bat",             "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400"),
    ("boxing gloves",           "https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=400"),
    ("skipping mat",            "https://images.unsplash.com/photo-1601925228932-ee4cceafae79?w=400"),

    # Fashion
    ("leather wallet",          "https://images.unsplash.com/photo-1627123424574-724758594785?w=400"),
    ("backpack",                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"),
    ("sunglasses",              "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"),
    ("leather belt",            "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400"),
    ("casual watch",            "https://images.unsplash.com/photo-1542496658-e33a6d0d2f5f?w=400"),
    ("scarf",                   "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400"),
    ("baseball cap",            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400"),
    ("tote bag",                "https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=400"),
    ("beanie",                  "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400"),
    ("silk tie",                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400"),
    ("leather gloves",          "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=400"),
    ("travel wallet",           "https://images.unsplash.com/photo-1553531087-b25d4bc3e4d5?w=400"),
    ("crossbody bag",           "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400"),
    ("bucket hat",              "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400"),
    ("laptop bag",              "https://images.unsplash.com/photo-1553531087-b25d4bc3e4d5?w=400"),
    ("gym bag",                 "https://images.unsplash.com/photo-1553531087-b25d4bc3e4d5?w=400"),
    ("fanny pack",              "https://images.unsplash.com/photo-1553531087-b25d4bc3e4d5?w=400"),
    ("drawstring bag",          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"),
    ("suspenders",              "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400"),
    ("bow tie",                 "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400"),

    # Home
    ("coffee maker",            "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400"),
    ("air purifier",            "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400"),
    ("robot vacuum",            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"),
    ("instant pot",             "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("stand mixer",             "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"),
    ("hand blender",            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("toaster oven",            "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"),
    ("electric kettle",         "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400"),
    ("rice cooker",             "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("food processor",          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("induction cooktop",       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("air fryer",               "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"),
    ("juicer",                  "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400"),
    ("sandwich maker",          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("electric grinder",        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400"),
    ("microwave",               "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"),
    ("water purifier",          "https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=400"),
    ("humidifier",              "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400"),
    ("table fan",               "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"),
    ("room heater",             "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400"),

    # Beauty
    ("face serum",              "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"),
    ("vitamin c serum",         "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"),
    ("moisturizer",             "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"),
    ("lip balm",                "https://images.unsplash.com/photo-1586495985437-5285b67f3ace?w=400"),
    ("eyeshadow palette",       "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400"),
    ("beard trimmer",           "https://images.unsplash.com/photo-1621607512214-68297480165e?w=400"),
    ("hair straightener",       "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400"),
    ("curling wand",            "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400"),
    ("face wash",               "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"),
    ("sunscreen",               "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"),
    ("sheet mask",              "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400"),
    ("nail polish",             "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400"),
    ("perfume",                 "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400"),
    ("eye cream",               "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"),
    ("toner",                   "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"),
    ("derma roller",            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400"),
    ("jade roller",             "https://images.unsplash.com/photo-1586495985437-5285b67f3ace?w=400"),
    ("micellar water",          "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400"),
    ("blush palette",           "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400"),
    ("setting spray",           "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400"),
    ("hair mask",               "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400"),

    # Books
    ("atomic habits",           "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"),
    ("deep work",               "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"),
    ("psychology of money",     "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400"),
    ("think and grow",          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"),
    ("rich dad",                "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400"),
    ("the alchemist",           "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400"),
    ("sapiens",                 "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400"),
    ("zero to one",             "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"),
    ("lean startup",            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400"),
    ("thinking fast",           "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400"),
    ("start with why",          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"),
    ("good to great",           "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"),
    ("4-hour workweek",         "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400"),
    ("ikigai",                  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"),
    ("48 laws of power",        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"),
    ("man's search",            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400"),
    ("art of war",              "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400"),
    ("elon musk",               "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400"),
    ("shoe dog",                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"),
    ("hard thing",              "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"),

    # Toys & Games
    ("lego",                    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400"),
    ("remote control car",      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"),
    ("chess",                   "https://images.unsplash.com/photo-1560174038-594dfc3c5a94?w=400"),
    ("rubik",                   "https://images.unsplash.com/photo-1591991731833-b4807cf7a1b0?w=400"),
    ("speed cube",              "https://images.unsplash.com/photo-1591991731833-b4807cf7a1b0?w=400"),
    ("jigsaw puzzle",           "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400"),
    ("building blocks",         "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400"),
    ("drone",                   "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=400"),
    ("playing cards",           "https://images.unsplash.com/photo-1541278107931-e006523892df?w=400"),
    ("uno",                     "https://images.unsplash.com/photo-1541278107931-e006523892df?w=400"),
    ("monopoly",                "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400"),
    ("table tennis",            "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400"),
    ("carrom",                  "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400"),
    ("scrabble",                "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400"),
    ("nerf",                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"),
    ("play-doh",                "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400"),
    ("magnetic drawing",        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400"),
    ("water gun",               "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"),
    ("yo-yo",                   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"),
    ("dart board",              "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400"),

    # Kitchen
    ("chef knife",              "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400"),
    ("cutting board",           "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("cast iron skillet",       "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400"),
    ("non-stick pan",           "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400"),
    ("mixing bowl",             "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400"),
    ("measuring cup",           "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400"),
    ("silicone spatula",        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("spice rack",              "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=400"),
    ("oil dispenser",           "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=400"),
    ("kitchen scissors",        "https://images.unsplash.com/photo-1583453056836-756b8f645fa2?w=400"),
    ("colander",                "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400"),
    ("grater",                  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("mortar and pestle",       "https://images.unsplash.com/photo-1588449668365-d15e397f6787?w=400"),
    ("vegetable chopper",       "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("thermometer",             "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400"),
    ("rolling pin",             "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400"),
    ("pressure cooker",         "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400"),
    ("can opener",              "https://images.unsplash.com/photo-1583453056836-756b8f645fa2?w=400"),
    ("bottle opener",           "https://images.unsplash.com/photo-1583453056836-756b8f645fa2?w=400"),
    ("kitchen scale",           "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400"),

    # Stationery
    ("fountain pen",            "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400"),
    ("notebook",                "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400"),
    ("desk organiser",          "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
    ("sticky notes",            "https://images.unsplash.com/photo-1602615576820-ea14cf4b79ca?w=400"),
    ("highlighter",             "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400"),
    ("gel pen",                 "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400"),
    ("washi tape",              "https://images.unsplash.com/photo-1602615576820-ea14cf4b79ca?w=400"),
    ("correction tape",         "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
    ("stapler",                 "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
    ("ruler",                   "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400"),
    ("drawing pencil",          "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400"),
    ("watercolour",             "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400"),
    ("calligraphy",             "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400"),
    ("binder clips",            "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
    ("paper puncher",           "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
    ("planner",                 "https://images.unsplash.com/photo-1602615576820-ea14cf4b79ca?w=400"),
    ("pencil case",             "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400"),
    ("index card",              "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400"),
    ("glue stick",              "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400"),
    ("scissors",                "https://images.unsplash.com/photo-1583453056836-756b8f645fa2?w=400"),

    # Automotive
    ("dash cam",                "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400"),
    ("tyre inflator",           "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"),
    ("car vacuum",              "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400"),
    ("car phone mount",         "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"),
    ("jump starter",            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"),
    ("seat cover",              "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400"),
    ("steering wheel cover",    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"),
    ("car air freshener",       "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400"),
    ("obd2 scanner",            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"),
    ("car wax",                 "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400"),
    ("parking sensor",          "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400"),
    ("floor mats",              "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400"),
    ("windshield",              "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"),
    ("car led",                 "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400"),
    ("gps tracker",             "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"),
    ("car charger",             "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400"),
    ("bike lock",               "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400"),
    ("cycling helmet",          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"),
    ("bike pump",               "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400"),
    ("bike rack",               "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400"),
]


def find_image(name: str, description: str) -> str | None:
    """Return the best-matching image URL for a product name+description."""
    combined = (name + " " + description).lower()
    best_match = None
    best_len = 0
    for keyword, url in IMAGE_MAP:
        if keyword in combined and len(keyword) > best_len:
            best_match = url
            best_len = len(keyword)
    return best_match


def main():
    db = SessionLocal()
    products = db.query(Product).all()
    total = len(products)
    updated = 0
    skipped = 0

    print(f"Processing {total} products...")

    for p in products:
        new_url = find_image(p.name or "", p.description or "")
        if new_url and new_url != p.image_url:
            p.image_url = new_url
            updated += 1
        else:
            skipped += 1

    db.commit()
    db.close()
    print(f"\nDone!")
    print(f"  Updated : {updated}")
    print(f"  Skipped : {skipped} (already correct or no match)")


if __name__ == "__main__":
    main()

"""Fix images on local SQLite ecommerce.db based on product name keywords."""
import traceback, sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "ecommerce.db")

IMAGE_MAP = {
    "wireless headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&auto=format&fit=crop",
    "wireless earbuds": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&q=80&auto=format&fit=crop",
    "smart watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80&auto=format&fit=crop",
    "coffee maker": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&q=80&auto=format&fit=crop",
    "running shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop",
    "yoga mat": "https://images.unsplash.com/photo-1601925228932-ee4cceafae79?w=400&q=80&auto=format&fit=crop",
    "desk lamp": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80&auto=format&fit=crop",
    "backpack": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&auto=format&fit=crop",
    "sunglasses": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80&auto=format&fit=crop",
}

VARIANTS = [" Pro"," Plus"," Lite"," Mini"," Max"," Ultra"," Elite"," Premium",
            " Basic"," Advanced"," Classic"," Modern"," Smart"," Deluxe"," Select",
            " V2"," V3"," X"," HD"," SE"," Edition"," Plus+"]

def find_url(name, description):
    name = name.strip()
    for v in VARIANTS:
        if name.endswith(v):
            name = name[:-len(v)].strip()
    combined = name.lower() + " " + (description or "").lower()
    best_key, best_len = None, 0
    for key, url in IMAGE_MAP.items():
        if key in combined and len(key) > best_len:
            best_key, best_len = key, len(key)
    return IMAGE_MAP[best_key] if best_key else None

try:
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("SELECT id, name, description, image_url FROM products")
    rows = cur.fetchall()

    updated = 0
    for pid, name, desc, old_url in rows:
        new_url = find_url(name or "", desc or "")
        if new_url and new_url != old_url:
            cur.execute("UPDATE products SET image_url=? WHERE id=?", (new_url, pid))
            updated += 1

    con.commit()
    con.close()

    with open("sqlite_images.txt", "w", encoding="utf-8") as f:
        f.write(f"Total products: {len(rows)}\nImages updated: {updated}\n")

except Exception:
    with open("sqlite_images.txt", "w", encoding="utf-8") as f:
        f.write(traceback.format_exc())

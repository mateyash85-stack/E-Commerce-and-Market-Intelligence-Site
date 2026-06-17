import sys
sys.stdout.reconfigure(line_buffering=True)
from config.database import SessionLocal, Product

db = SessionLocal()
products = db.query(Product).all()
print(f"Total products: {len(products)}")

for p in products[:10]:
    url = p.image_url or ""
    print(f"  [{p.id}] {p.name}")
    print(f"      {url[:80]}")

db.close()
print("Done")

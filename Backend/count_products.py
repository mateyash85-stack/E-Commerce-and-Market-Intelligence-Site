from config.database import SessionLocal, Product
db = SessionLocal()
print("Total products:", db.query(Product).count())
db.close()

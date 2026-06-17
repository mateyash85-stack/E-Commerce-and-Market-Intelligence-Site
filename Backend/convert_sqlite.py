"""Convert local SQLite ecommerce.db prices from USD to INR."""
import traceback, sqlite3, os

DB_PATH = os.path.join(os.path.dirname(__file__), "ecommerce.db")
USD_TO_INR = 83.5

try:
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    # Check current state
    cur.execute("SELECT id, name, price FROM products ORDER BY id LIMIT 5")
    before = cur.fetchall()

    # Products: only convert if still in USD range (< 500)
    cur.execute("UPDATE products SET price = ROUND(price * ?, 2) WHERE price < 500", (USD_TO_INR,))
    prod_updated = cur.rowcount

    # Orders: only convert if still in USD range (< 10000)
    cur.execute("UPDATE orders SET total = ROUND(total * ?, 2) WHERE total < 10000", (USD_TO_INR,))
    ord_updated = cur.rowcount

    # Order items: only convert if still in USD range (< 500)
    cur.execute("UPDATE order_items SET price = ROUND(price * ?, 2) WHERE price < 500", (USD_TO_INR,))
    item_updated = cur.rowcount

    con.commit()

    # Check after
    cur.execute("SELECT id, name, price FROM products ORDER BY id LIMIT 5")
    after = cur.fetchall()
    con.close()

    with open("sqlite_convert.txt", "w", encoding="utf-8") as f:
        f.write("BEFORE:\n")
        for r in before:
            f.write(f"  [{r[0]}] {r[1][:30]} -> {r[2]}\n")
        f.write(f"\nUpdated: products={prod_updated}, orders={ord_updated}, items={item_updated}\n")
        f.write("\nAFTER:\n")
        for r in after:
            f.write(f"  [{r[0]}] {r[1][:30]} -> {r[2]}\n")

except Exception:
    with open("sqlite_convert.txt", "w", encoding="utf-8") as f:
        f.write(traceback.format_exc())

"""
Convert all product prices and order totals/item prices from USD to INR.
Uses raw SQL to avoid ORM schema mismatch issues.
Run ONCE: python convert_to_inr.py
"""
import traceback

try:
    from config.database import engine
    from sqlalchemy import text

    USD_TO_INR = 83.5

    with engine.begin() as conn:
        # Products: only convert rows still in USD range (price < 500)
        r_prod = conn.execute(text(
            "UPDATE products SET price = ROUND(CAST(price * :rate AS NUMERIC), 2) "
            "WHERE price < 500"
        ), {"rate": USD_TO_INR})

        # Orders: only convert rows still in USD range (total < 10000)
        r_ord = conn.execute(text(
            "UPDATE orders SET total = ROUND(CAST(total * :rate AS NUMERIC), 2) "
            "WHERE total < 10000"
        ), {"rate": USD_TO_INR})

        # Order items: only convert rows still in USD range (price < 500)
        r_items = conn.execute(text(
            "UPDATE order_items SET price = ROUND(CAST(price * :rate AS NUMERIC), 2) "
            "WHERE price < 500"
        ), {"rate": USD_TO_INR})

    with open("convert_log.txt", "w") as f:
        f.write(f"Products rows updated : {r_prod.rowcount}\n")
        f.write(f"Orders rows updated   : {r_ord.rowcount}\n")
        f.write(f"Order items updated   : {r_items.rowcount}\n")
        f.write("Done!\n")

except Exception:
    with open("convert_log.txt", "w") as f:
        f.write(traceback.format_exc())

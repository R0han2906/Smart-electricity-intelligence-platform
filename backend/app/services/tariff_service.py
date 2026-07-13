MAHARASHTRA_TARIFF = [
    (100, 3.50),
    (200, 7.00),
    (200, 9.00),
    (float("inf"), 11.00)
]

def calculate_maharashtra_bill(units, slabs=MAHARASHTRA_TARIFF):
    remaining_units = units
    total_bill = 0

    for slab_units, rate in slabs:
        if remaining_units <= 0:
            break

        units_in_slab = min(remaining_units, slab_units)
        total_bill += units_in_slab * rate
        remaining_units -= units_in_slab

    return round(total_bill, 2)
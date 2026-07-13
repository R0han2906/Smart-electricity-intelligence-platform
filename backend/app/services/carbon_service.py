INDIA_EMISSION_FACTOR = 0.82  # kg CO2 per kWh
TREE_ABSORPTION_YEARLY = 21   # kg CO2 per year
CAR_EMISSION_PER_KM = 0.192   # kg CO2 per km

def calculate_carbon_data(units):

    carbon = units * INDIA_EMISSION_FACTOR

    monthly_tree_absorption = TREE_ABSORPTION_YEARLY / 12
    trees = carbon / monthly_tree_absorption

    vehicle_km = carbon / CAR_EMISSION_PER_KM

    return {
        "carbon_kg": round(carbon, 2),
        "trees_required": round(trees, 2),
        "vehicle_km_equivalent": round(vehicle_km, 2)
    }
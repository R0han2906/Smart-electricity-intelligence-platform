def generate_ai_insights(predicted_units, last_month_units):

    insights = []

    change_pct = ((predicted_units - last_month_units) / last_month_units) * 100

    if change_pct > 10:
        insights.append("Projected usage is significantly higher than last month.")
    elif change_pct < -10:
        insights.append("Projected usage is significantly lower than last month.")

    if predicted_units > 500:
        insights.append("You are entering the highest electricity tariff slab.")

    carbon = predicted_units * 0.82
    if carbon > 600:
        insights.append("Your carbon footprint is relatively high this month.")

    return insights
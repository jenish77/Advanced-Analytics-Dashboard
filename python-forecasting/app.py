from flask import Flask, request, jsonify
from prophet import Prophet
import pandas as pd
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['data']
    horizon = request.json['horizon']
    df = pd.DataFrame(data)
    
    # Convert date to datetime and remove timezone information
    df['date'] = pd.to_datetime(df['date']).dt.tz_localize(None)
    df.sort_values('date', inplace=True)
    df['paymentStatus'] = df['paymentStatus'].astype(bool)
    
    categories = df['category'].unique()
    forecasts = {}
    highest_demand_categories = []

    for category in categories:
        category_data = df[df['category'] == category]
        daily_data = category_data.groupby('date').agg({'amount': 'sum'}).reset_index()
        daily_data.columns = ['ds', 'y']
        
        model = Prophet()
        model.fit(daily_data)
        
        future = model.make_future_dataframe(periods=horizon)
        forecast = model.predict(future)
        # model.plot_components(forecast).savefig('1.png')
        print(forecast)
        forecasts[category] = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_dict(orient='records')
        
        # Calculate the sum of predicted amounts over the forecast period
        total_future_demand = forecast['yhat'].sum()
        highest_demand_categories.append((category, total_future_demand))
    
    # Sort categories by predicted demand
    highest_demand_categories.sort(key=lambda x: x[1], reverse=True)
    
    result = {
        'forecasts': forecasts,
        'highest_demand_categories': highest_demand_categories[:5]  # Top 5 categories
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5001, debug=True)

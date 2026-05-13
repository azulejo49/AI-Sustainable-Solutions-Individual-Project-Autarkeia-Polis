# Autarkeia-Polis: AI & Data Engineering Pipelines
## The "Digital Overseer" Machine Learning Proof of Concept

This document contains the backend database schemas and Machine Learning mock-ups that power the Autarkeia-Polis smart city. The AI acts as a central physics engine, autonomously balancing energy, water, thermal mass, and biological systems.

## 🐝 Domain 1: Symbiotic Agriculture & Apiary Health
**Goal:** Monitor hive health autonomously and predict crop/ecosystem stability using acoustic anomaly detection.

### Database Schema (Time-Series)
```sql
CREATE TABLE apiary_telemetry (
    timestamp TIMESTAMP,
    hive_id VARCHAR(50),
    acoustic_freq_hz FLOAT,
    internal_temp_c FLOAT,
    health_status VARCHAR(20)
);
```

### Python ML Pipeline: Anomaly Detection (Isolation Forest)
```python
import pandas as pd
from sklearn.ensemble import IsolationForest

# Simulated IoT data from the Smart Apiaries
data = {
    'acoustic_freq_hz': [250, 248, 255, 120, 251, 249], # 120Hz indicates swarming or colony collapse
    'internal_temp_c': [34.5, 34.2, 34.6, 30.1, 34.4, 34.5]
}
df = pd.DataFrame(data)

# Train the Anomaly Detection Model
model = IsolationForest(contamination=0.15, random_state=42)
df['anomaly_score'] = model.fit_predict(df[['acoustic_freq_hz', 'internal_temp_c']])

# Evaluate and trigger autonomous alerts
print("--- Apiary Health Report ---")
for index, row in df.iterrows():
    if row['anomaly_score'] == -1:
        print(f"CRITICAL ALERT: Anomaly detected in Hive_{index}! Frequency dropped to {row['acoustic_freq_hz']}Hz.")
        print("ACTION: Dispatching drone for visual inspection of queen health.")
```

## 💧 Domain 2: Advanced Water Management (Qanats & Gravity)
**Goal:** Autonomously route water between summer towers and deep winter Qanats to prevent pipe freezing using predictive fluid routing.

### Database Schema
```sql
CREATE TABLE hydro_routing_telemetry (
    timestamp TIMESTAMP,
    node_id VARCHAR(50),
    ambient_temp_forecast_c FLOAT,
    hydrostatic_pressure_psi FLOAT,
    valve_status BOOLEAN
);
```

### Python ML Pipeline: Predictive Winter Routing
```python
def adaptive_water_routing(forecasted_temp_c, current_tower_level_pct):
    FREEZE_THRESHOLD = 2.0 # Trigger threshold in Celsius
    
    print(f"--- Hydrology Routing Update ---")
    print(f"Incoming 24hr weather forecast: {forecasted_temp_c}°C")
    
    if forecasted_temp_c <= FREEZE_THRESHOLD:
        print("ACTION: Freezing temperatures predicted. Opening descent valves.")
        print("ACTION: Draining Summer Gravity Towers into deep geothermal Winter Qanats.")
        return "QANAT_MODE_ACTIVE"
    elif forecasted_temp_c > FREEZE_THRESHOLD and current_tower_level_pct < 50:
        print("ACTION: Engaging Mechanical Windmills.")
        print("ACTION: Pumping water from Qanats back to Gravity Towers for passive pressure.")
        return "TOWER_MODE_ACTIVE"
    else:
        print("ACTION: System stable. Maintaining current fluid distribution.")
        return "SYSTEM_STABLE"

# Simulate a sudden winter drop in the region
status = adaptive_water_routing(-5.0, 80)
```

## 🌡️ Domain 3: Energy & Thermal Efficiency
**Goal:** Predict thermal drops based on meteorological data and pre-emptively route biochar waste-heat into the Ondol underfloor networks.

### Database Schema
```sql
CREATE TABLE thermal_mass_grid (
    timestamp TIMESTAMP,
    zone_id VARCHAR(50),
    trombe_wall_temp_c FLOAT,
    predicted_ambient_drop FLOAT,
    ondol_heat_transfer_kw FLOAT
);
```

### Python ML Pipeline: Forecasting Thermal Demand (Random Forest)
```python
from sklearn.ensemble import RandomForestRegressor

print("--- Thermal Mass Orchestration ---")

# Features: [Current Trombe Wall Temp (°C), Forecasted Outside Temp (°C), Wind Speed (km/h)]
X_train = [[22.0, 10.0, 15], [18.0, -2.0, 40], [25.0, 18.0, 5]]
# Target: Kilowatts of heat required from the Pyrolysis plant
y_train = [5.0, 45.0, 0.0] 

# Train the Thermal Predictor
thermal_ai = RandomForestRegressor(n_estimators=100, random_state=42)
thermal_ai.fit(X_train, y_train)

# Simulate a harsh winter night
current_state = [[15.0, -10.0, 50]] # Wall is cooling, outside is -10C, high wind
required_heat = thermal_ai.predict(current_state)

print(f"DATA: Extreme cold front and high wind detected.")
print(f"ACTION: Pre-emptively routing {required_heat[0]:.1f} kW of heat to Ondol network to buffer residential thermal mass.")
```

## ♻️ Domain 4: Waste-to-Value (Biochar Process Optimization)
**Goal:** Dynamically adjust the pyrolysis chamber heat and oxygen levels based on the moisture content of the daily organic waste harvest to yield optimal Terra Preta.

### Database Schema
```sql
CREATE TABLE pyrolysis_ops (
    batch_id INT PRIMARY KEY,
    moisture_content_pct FLOAT,
    chamber_temp_c FLOAT,
    oxygen_level_pct FLOAT,
    carbon_yield_pct FLOAT
);
```

### Python ML Pipeline: Dynamic Pyrolysis Adjustment
```python
def optimize_biochar_production(moisture_pct):
    print("--- Pyrolysis Chamber Optimization ---")
    # Base parameters for ideal dry organics
    optimal_temp_c = 450.0 
    oxygen_intake = 0.5 
    
    # Dynamic adjustment based on real-time computer vision/sensor data
    if moisture_pct > 40.0:
        print(f"DATA: High moisture ({moisture_pct}%) detected in Chinampas organic waste batch.")
        # Increase heat to flash off water, lower oxygen to prevent ash formation
        adjusted_temp = optimal_temp_c + (moisture_pct * 1.5)
        adjusted_oxygen = oxygen_intake * 0.8
        print(f"ACTION: Adjusting Chamber to {adjusted_temp:.1f}°C at {adjusted_oxygen:.2f}% O2.")
        return adjusted_temp, adjusted_oxygen
    else:
        print("DATA: Standard moisture detected. Proceeding with baseline pyrolysis.")
        return optimal_temp_c, oxygen_intake

# Simulate a wet batch of waste
temp, o2 = optimize_biochar_production(55.0)
```

## 🔋 Domain 5: Renewable Micro-Grid & Eco-Battery Dispatch
**Goal:** Autonomously forecast city-wide electrical demand and route power between solar/wind generation and Gravity/Redox Flow batteries.

### Database Schema
```sql
CREATE TABLE microgrid_telemetry (
    timestamp TIMESTAMP,
    weather_forecast_id INT,
    solar_gen_kw FLOAT,
    wind_gen_kw FLOAT,
    current_load_kw FLOAT,
    redox_battery_soc_pct FLOAT,
    gravity_storage_potential_kwh FLOAT
);
```

### Python ML Pipeline: Load Forecasting & Dispatch Logic (Gradient Boosting)
```python
from sklearn.ensemble import GradientBoostingRegressor

print("--- Micro-Grid Energy Dispatch ---")

# Simulated historical data: [Hour_of_day, Cloud_Cover_Pct, Wind_Speed_kmh]
X_train_grid = [
    [14, 10, 15],  # 2 PM, sunny, light wind (Low load, high solar)
    [20, 80, 5],   # 8 PM, cloudy, very low wind (Peak pod tram charging time)
    [2, 90, 10]    # 2 AM, dark, mild wind (Baseline IoT load)
]

# Target: Historical Grid Load in kW
y_train_grid = [150.0, 380.0, 85.0] 

# Train the Load Forecaster
load_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
load_model.fit(X_train_grid, y_train_grid)

def grid_orchestrator(current_weather_state, battery_soc_pct):
    # Predict the load for the upcoming hour
    predicted_load = load_model.predict([current_weather_state])[0]
    print(f"PREDICTION: Anticipated electrical grid load for the next hour is {predicted_load:.1f} kW.")
    
    # Autonomous Dispatch Logic
    if predicted_load > 300 and battery_soc_pct > 20:
        print("ACTION: Electrical deficit predicted due to weather/time. Pre-emptively engaging Gravity Energy Storage to cover impending peak load.")
        return "DISCHARGE_GRAVITY"
        
    elif predicted_load < 100:
        print("ACTION: Low load predicted. Routing all excess incoming solar/wind to charge Redox Flow batteries.")
        return "CHARGE_REDOX"
        
    else:
        print("ACTION: Grid generation and load are balanced. Maintaining direct distribution to active city nodes.")
        return "GRID_STABLE"

# Simulate an upcoming evening with heavy cloud cover
# State: 8 PM (20:00), 85% Cloud Cover, 2 km/h Wind
upcoming_state = [20, 85, 2]
current_battery = 90.0 # 90% State of Charge

system_status = grid_orchestrator(upcoming_state, current_battery)
```

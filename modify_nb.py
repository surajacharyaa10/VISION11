import nbformat

with open('plot_pizza_comparison.ipynb', 'r') as f:
    nb = nbformat.read(f, as_version=4)

interactive_cell_idx = -1
for i, cell in enumerate(nb.cells):
    if cell.cell_type == 'code' and "players_db = {" in cell.source and "Robert Lewandowski" in cell.source:
        interactive_cell_idx = i
        break

if interactive_cell_idx != -1:
    source = nb.cells[interactive_cell_idx].source
    
    # Replace the players_db section
    old_db_str = """players_db = {
    "Robert Lewandowski": {
        "percentiles": [99, 99, 87, 51, 62, 58, 45, 40, 27, 74, 77, 73],
        "actual": [41, 39.2, 0.31, 7.8, 3.2, 4.1, 2.8, 1.5, 0.9, 13.2, 9.1, 3.8],
        "color": "#1A78CF"
    },
    "Mohamed Salah": {
        "percentiles": [83, 75, 55, 62, 72, 92, 92, 79, 64, 92, 68, 31],
        "actual": [31, 24.8, 0.21, 8.9, 4.1, 5.8, 5.2, 3.2, 1.8, 16.3, 7.2, 1.9],
        "color": "#FF9300"
    },
    "Lionel Messi": {
        "percentiles": [95, 96, 75, 98, 99, 95, 99, 98, 97, 85, 45, 10],
        "actual": [30, 26.5, 0.15, 12.4, 6.2, 7.5, 8.5, 5.4, 4.5, 18.2, 4.1, 0.5],
        "color": "#8E44AD"
    },
    "Erling Haaland": {
        "percentiles": [99, 98, 95, 25, 40, 45, 20, 35, 45, 60, 50, 65],
        "actual": [27, 23.4, 0.33, 2.1, 1.8, 2.2, 1.2, 1.1, 1.1, 10.4, 5.2, 2.9],
        "color": "#27AE60"
    },
    "Kylian Mbappe": {
        "percentiles": [97, 95, 82, 85, 88, 94, 78, 95, 90, 70, 40, 20],
        "actual": [27, 22.8, 0.22, 9.2, 4.8, 6.5, 4.3, 4.8, 3.2, 12.8, 4.5, 0.8],
        "color": "#E74C3C"
    },
    "Kevin De Bruyne": {
        "percentiles": [70, 72, 45, 99, 99, 88, 99, 92, 75, 95, 75, 40],
        "actual": [6, 7.2, 0.08, 16.2, 7.1, 5.2, 9.8, 4.2, 2.1, 22.4, 8.5, 1.2],
        "color": "#F1C40F"
    }
}"""
    
    new_db_str = """import pandas as pd
import numpy as np

# Load CSV
df = pd.read_csv('big5_player_stats.csv', header=[0, 1])

# Clean the dataframe if necessary
if df.iloc[0, 0] == 'Rk':
    df = df.iloc[1:].copy()

player_col = df.columns[1]

stats_to_plot = [
    ('Per 90 Minutes', 'Gls'),
    ('Per 90 Minutes', 'Ast'),
    ('Per 90 Minutes', 'G+A'),
    ('Per 90 Minutes', 'G-PK'),
    ('Per 90 Minutes', 'G+A-PK'),
    ('Performance', 'PK')
]

for col in stats_to_plot:
    df[col] = pd.to_numeric(df[col], errors='coerce')

min_col = ('Playing Time', 'Min')
df[min_col] = pd.to_numeric(df[min_col], errors='coerce')
# Filter for players with more than 500 minutes played
df = df[df[min_col] > 500].copy()

# Add rank percentiles
for col in stats_to_plot:
    new_col = (col[0], col[1] + '_perc')
    df[new_col] = df[col].rank(pct=True) * 100

players_db = {}
colors = ["#1A78CF", "#FF9300", "#8E44AD", "#27AE60", "#E74C3C", "#F1C40F"]

for i, row in df.iterrows():
    player_name = row[player_col]
    # Skip duplicates (some players play for multiple clubs)
    if player_name in players_db:
        continue
    
    percentiles = []
    actuals = []
    for col in stats_to_plot:
        val = row[col]
        perc = row[(col[0], col[1] + '_perc')]
        percentiles.append(int(perc) if pd.notna(perc) else 0)
        actuals.append(round(val, 2) if pd.notna(val) else 0.0)
    
    players_db[player_name] = {
        "percentiles": percentiles,
        "actual": actuals,
        "color": colors[len(players_db) % len(colors)]
    }"""
    
    source = source.replace(old_db_str, new_db_str)
    
    # Replace params list
    old_params_str = """    params = [
        "Non-Penalty Goals", "npxG", "npxG per Shot", "xA",
        "Open Play\\nShot Creating Actions", "\\nPenalty Area\\nEntries",
        "Progressive Passes", "Progressive Carries", "Successful Dribbles",
        "\\nTouches\\nper Turnover", "pAdj\\nPress Regains", "Aerials Won"
    ]"""
    
    new_params_str = """    params = [
        "Goals\\nper 90", "Assists\\nper 90", "G+A\\nper 90",
        "Non-Penalty\\nGoals per 90", "Non-Penalty\\nG+A per 90", "Penalty Kicks\\nMade"
    ]"""
    
    source = source.replace(old_params_str, new_params_str)
    
    # Replace available players list printing slightly to prevent 2000+ players from printing
    old_print_str = """print("Available Players:")
player_names = list(players_db.keys())
for i, name in enumerate(player_names, 1):
    print(f"{i}. {name}")
print("-" * 40)"""
    new_print_str = """print(f"Loaded {len(players_db)} players from database.")
player_names = list(players_db.keys())
print("-" * 40)"""
    source = source.replace(old_print_str, new_print_str)
    
    nb.cells[interactive_cell_idx].source = source
    
    with open('plot_pizza_comparison.ipynb', 'w') as f:
        nbformat.write(nb, f)
    
    print("Notebook modified successfully.")
else:
    print("Could not find the target cell.")

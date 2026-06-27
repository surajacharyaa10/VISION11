import pandas as pd
import json

df = pd.read_csv('big5_player_stats.csv', header=[0, 1])

if df.iloc[0, 0] == 'Rk':
    df = df.iloc[1:].copy()

player_col = df.columns[1]

stats_to_plot = [
    ('Per 90 Minutes', 'Gls'),
    ('Per 90 Minutes', 'Ast'),
    ('Per 90 Minutes', 'G+A'),
    ('Per 90 Minutes', 'G-PK'),
    ('Per 90 Minutes', 'G+A-PK')
]

for col in stats_to_plot:
    df[col] = pd.to_numeric(df[col], errors='coerce')

min_col = ('Playing Time', 'Min')
df[min_col] = pd.to_numeric(df[min_col], errors='coerce')
df = df[df[min_col] > 500].copy()

# Add rank percentiles
for col in stats_to_plot:
    new_col = (col[0], col[1] + '_perc')
    df[new_col] = df[col].rank(pct=True) * 100

lew_row = df[df[player_col] == 'Robert Lewandowski']
if not lew_row.empty:
    lew_idx = lew_row.index[0]
    percentiles = []
    actuals = []
    for col in stats_to_plot:
        val = lew_row[col].values[0]
        perc = lew_row[(col[0], col[1] + '_perc')].values[0]
        percentiles.append(int(perc))
        actuals.append(val)
    print("Lewandowski Percentiles:", percentiles)
    print("Lewandowski Actuals:", actuals)
else:
    print("Robert Lewandowski not found. First 5 players:", df[player_col].head().values)

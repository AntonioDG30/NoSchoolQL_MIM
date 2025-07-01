# -*- coding: utf-8 -*-
import pandas as pd
import os

# -----------------------------
# CONFIGURAZIONE PERCORSI
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_puliti')
OUTPUT_FILE = os.path.join(INPUT_DIR, 'statistiche_base.csv')

# -----------------------------
# CARICAMENTO FILE PULITI
# -----------------------------
df_scuole = pd.read_csv(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'))
df_cittadinanza = pd.read_csv(os.path.join(INPUT_DIR, 'stu_cittadinanza_pulito.csv'))
df_indirizzi = pd.read_csv(os.path.join(INPUT_DIR, 'stu_indirizzi_pulito.csv'))

# -----------------------------
# CONVERSIONE SICURA CAMPI NUMERICI
# -----------------------------
def to_int_safe(x):
    try:
        return int(x)
    except:
        return 0

for col in ['alunni', 'alunnicittadinanzaitaliana', 'alunnicittadinanzanonitaliana']:
    df_cittadinanza[col] = df_cittadinanza[col].map(to_int_safe)

for col in ['alunnimaschi', 'alunnifemmine']:
    df_indirizzi[col] = df_indirizzi[col].map(to_int_safe)

df_indirizzi['totale'] = df_indirizzi['alunnimaschi'] + df_indirizzi['alunnifemmine']

# -----------------------------
# STATISTICHE PER SCUOLA
# -----------------------------
agg_cittad = df_cittadinanza.groupby('codicescuola').agg({
    'alunni': 'sum',
    'alunnicittadinanzaitaliana': 'sum',
    'alunnicittadinanzanonitaliana': 'sum'
}).reset_index()

agg_indirizzi = df_indirizzi.groupby('codicescuola').agg({
    'indirizzo': 'nunique',
    'totale': 'sum'
}).rename(columns={'indirizzo': 'num_indirizzi', 'totale': 'alunni_da_indirizzi'}).reset_index()

# Merge con dati anagrafici
statistiche = df_scuole[['codicescuola', 'regione', 'provincia', 'descrizionecomune']].drop_duplicates()
statistiche = statistiche.merge(agg_cittad, on='codicescuola', how='left')
statistiche = statistiche.merge(agg_indirizzi, on='codicescuola', how='left')

# Percentuali italiani/stranieri
statistiche['perc_italiani'] = statistiche.apply(
    lambda row: round(row['alunnicittadinanzaitaliana'] / row['alunni'], 3) if row['alunni'] > 0 else 0, axis=1)
statistiche['perc_stranieri'] = statistiche.apply(
    lambda row: round(row['alunnicittadinanzanonitaliana'] / row['alunni'], 3) if row['alunni'] > 0 else 0, axis=1)

# -----------------------------
# STATISTICHE MASCHI/FEMMINE PER SCUOLA
# -----------------------------
agg_gender = df_indirizzi.groupby('codicescuola').agg({
    'alunnimaschi': 'sum',
    'alunnifemmine': 'sum'
}).reset_index()

agg_gender['totale'] = agg_gender['alunnimaschi'] + agg_gender['alunnifemmine']

agg_gender['perc_maschi'] = agg_gender.apply(
    lambda row: round(row['alunnimaschi'] / row['totale'], 3) if row['totale'] > 0 else 0, axis=1)
agg_gender['perc_femmine'] = agg_gender.apply(
    lambda row: round(row['alunnifemmine'] / row['totale'], 3) if row['totale'] > 0 else 0, axis=1)

statistiche = statistiche.merge(agg_gender, on='codicescuola', how='left')

# -----------------------------
# STATISTICHE REGIONALI + TIPO PERCORSO
# -----------------------------
df_temp = df_scuole[['codicescuola', 'regione']].merge(
    df_indirizzi[['codicescuola', 'tipopercorso', 'indirizzo', 'totale']],
    on='codicescuola', how='left'
)

stat_regione_percorso = df_temp.groupby(['regione', 'tipopercorso']).agg({
    'codicescuola': 'nunique',
    'indirizzo': 'nunique',
    'totale': 'sum'
}).rename(columns={
    'codicescuola': 'reg_num_scuole',
    'indirizzo': 'reg_num_indirizzi',
    'totale': 'reg_tot_studenti'
}).reset_index()

# Aggiunta media studenti per scuola per regione + tipo percorso
stat_regione_percorso['reg_media_studenti_per_scuola'] = stat_regione_percorso.apply(
    lambda row: round(row['reg_tot_studenti'] / row['reg_num_scuole'], 1) if row['reg_num_scuole'] > 0 else 0, axis=1
)

# Merge per regione e tipo percorso → aggiungo su ogni scuola la media regionale del suo percorso
df_scuole_percorso = df_indirizzi[['codicescuola', 'tipopercorso']].drop_duplicates()
df_scuole_percorso = df_scuole_percorso.merge(
    df_scuole[['codicescuola', 'regione']], on='codicescuola', how='left'
)
df_scuole_percorso = df_scuole_percorso.merge(
    stat_regione_percorso, on=['regione', 'tipopercorso'], how='left'
)

# Unione finale
statistiche = statistiche.merge(df_scuole_percorso.drop(columns=['regione']), on='codicescuola', how='left')

# -----------------------------
# SALVATAGGIO UNICO FILE
# -----------------------------
statistiche.to_csv(OUTPUT_FILE, index=False)
print(f"✅ File riepilogativo salvato in: {OUTPUT_FILE}")

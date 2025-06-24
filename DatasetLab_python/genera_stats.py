# -*- coding: utf-8 -*-
# Specifico l'encoding UTF-8 per garantire la corretta lettura/scrittura di caratteri speciali

import pandas as pd  # Importo la libreria pandas per gestire i DataFrame
import os            # Importo os per gestire i percorsi dei file

# -----------------------------
# CONFIGURAZIONE PERCORSI
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))               # Ottengo il percorso assoluto della cartella contenente lo script
INPUT_DIR = os.path.join(BASE_DIR, 'file/dataset_puliti')                        # Definisco la cartella 'dataset_puliti' dove ho salvato i file puliti
OUTPUT_FILE = os.path.join(INPUT_DIR, 'statistiche_simulazione.csv')  # Definisco il percorso del file CSV finale che conterrà le statistiche

# -----------------------------
# CARICAMENTO FILE PULITI
# -----------------------------
df_scuole = pd.read_csv(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'))           # Carico l'anagrafica delle scuole pulita
df_cittadinanza = pd.read_csv(os.path.join(INPUT_DIR, 'stu_cittadinanza_pulito.csv'))      # Carico il file con i dati di cittadinanza
df_indirizzi = pd.read_csv(os.path.join(INPUT_DIR, 'stu_indirizzi_pulito.csv'))            # Carico il file con i dati per indirizzo

# Conversione numerica sicura
def to_int_safe(x):
    # Funzione per convertire in intero, restituendo 0 in caso di errore o valore mancante
    try:
        return int(x)
    except:
        return 0

# Applico la conversione sicura alle colonne numeriche del file cittadinanza
for col in ['alunni', 'alunnicittadinanzaitaliana', 'alunnicittadinanzanonitaliana']:
    if col in df_cittadinanza.columns:
        df_cittadinanza[col] = df_cittadinanza[col].map(to_int_safe)

# Applico la conversione sicura alle colonne numeriche del file indirizzi
for col in ['alunnimaschi', 'alunnifemmine']:
    if col in df_indirizzi.columns:
        df_indirizzi[col] = df_indirizzi[col].map(to_int_safe)

# -----------------------------
# AGGREGAZIONE CITTADINANZA PER SCUOLA
# -----------------------------
agg_cittad = df_cittadinanza.groupby('codicescuola').agg({
    'alunni': 'sum',
    'alunnicittadinanzaitaliana': 'sum',
    'alunnicittadinanzanonitaliana': 'sum'
}).reset_index()  # Raggruppo per scuola e sommo il numero totale di studenti italiani/non italiani

# -----------------------------
# AGGREGAZIONE PER SCUOLA E INDIRIZZO
# -----------------------------
df_indirizzi['totale'] = df_indirizzi['alunnimaschi'] + df_indirizzi['alunnifemmine']  # Calcolo il totale studenti per indirizzo

agg_ind = df_indirizzi.groupby(['codicescuola', 'indirizzo']).agg({
    'alunnimaschi': 'sum',
    'alunnifemmine': 'sum',
    'totale': 'sum'
}).reset_index()  # Raggruppo per scuola e indirizzo e sommo i dati per ottenere il totale per ciascun indirizzo

# Merge cittadinanza + indirizzi
statistiche = agg_ind.merge(agg_cittad, on='codicescuola', how='left')  # Unisco le due aggregazioni per ottenere un unico dataset

# -----------------------------
# CALCOLO PERCENTUALI
# -----------------------------
# Calcolo la percentuale di maschi sul totale degli studenti per indirizzo
statistiche['perc_maschi'] = statistiche.apply(
    lambda row: round(row['alunnimaschi'] / row['totale'], 3) if row['totale'] > 0 else 0, axis=1
)

# Calcolo la percentuale di femmine sul totale degli studenti per indirizzo
statistiche['perc_femmine'] = statistiche.apply(
    lambda row: round(row['alunnifemmine'] / row['totale'], 3) if row['totale'] > 0 else 0, axis=1
)

# Calcolo la percentuale di italiani sul totale degli studenti della scuola
statistiche['perc_italiani'] = statistiche.apply(
    lambda row: round(row['alunnicittadinanzaitaliana'] / row['alunni'], 3) if row['alunni'] > 0 else 0, axis=1
)

# Calcolo la percentuale di stranieri sul totale degli studenti della scuola
statistiche['perc_stranieri'] = statistiche.apply(
    lambda row: round(row['alunnicittadinanzanonitaliana'] / row['alunni'], 3) if row['alunni'] > 0 else 0, axis=1
)

# -----------------------------
# SALVATAGGIO RISULTATI
# -----------------------------
statistiche.to_csv(OUTPUT_FILE, index=False)  # Salvo il file CSV finale con le statistiche aggregate e calcolate

print(f"✅ Statistiche salvate in {OUTPUT_FILE}")  # Stampo conferma del salvataggio

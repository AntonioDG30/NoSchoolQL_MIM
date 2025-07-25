"""
================================================================================
MODULO DI CALCOLO STATISTICHE DI BASE
================================================================================
Questo script rappresenta la seconda fase della pipeline e si occupa di calcolare
statistiche aggregate dai dati puliti per supportare la generazione realistica
dei dati simulati.

Obiettivi principali:
1. Calcolare percentuali di studenti italiani/stranieri per scuola
2. Calcolare percentuali di maschi/femmine per scuola  
3. Aggregare informazioni per regione e tipo di percorso
4. Creare un file riepilogativo con tutte le statistiche necessarie

Queste statistiche verranno utilizzate dal modulo di generazione per creare
distribuzioni realistiche di studenti nelle classi simulate.

Autore: Antonio Di Giorgio
Data: Giugno 2025
================================================================================
"""

import pandas as pd
import os

# ============================================================================
# CONFIGURAZIONE
# ============================================================================
# Determino la directory base per i percorsi relativi
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Directory con i file puliti dalla fase precedente
INPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_puliti')

# File di output che conterrà tutte le statistiche
OUTPUT_FILE = os.path.join(INPUT_DIR, 'statistiche_base.csv')

# ============================================================================
# CARICAMENTO DATI
# ============================================================================
"""
Carico i tre file principali prodotti dalla fase di pulizia.
Ogni file contiene informazioni complementari che devo aggregare.
"""

# Anagrafica con informazioni geografiche e denominazioni
df_scuole = pd.read_csv(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'))

# Dati sulla cittadinanza degli studenti per anno di corso
df_cittadinanza = pd.read_csv(os.path.join(INPUT_DIR, 'stu_cittadinanza_pulito.csv'))

# Dati su indirizzi di studio e distribuzione per genere
df_indirizzi = pd.read_csv(os.path.join(INPUT_DIR, 'stu_indirizzi_pulito.csv'))


# ============================================================================
# FUNZIONI DI UTILITÀ
# ============================================================================
def to_int_safe(x):
    """
    Converto in modo sicuro un valore in intero.

    Gestisco i casi in cui il valore potrebbe essere NaN, stringa vuota
    o non convertibile, ritornando 0 come default.

    Args:
        x: Valore da convertire

    Returns:
        int: Valore convertito o 0 se non convertibile
    """
    try:
        return int(x)
    except:
        return 0


# ============================================================================
# FASE 1: CONVERSIONE CAMPI NUMERICI
# ============================================================================
"""
I dati MIUR a volte contengono valori non numerici o mancanti nei campi
che dovrebbero essere numerici. Li converto in modo sicuro.
"""

# Converto i campi numerici del dataset cittadinanza
for col in ['alunni', 'alunnicittadinanzaitaliana', 'alunnicittadinanzanonitaliana']:
    df_cittadinanza[col] = df_cittadinanza[col].map(to_int_safe)

# Converto i campi numerici del dataset indirizzi
for col in ['alunnimaschi', 'alunnifemmine']:
    df_indirizzi[col] = df_indirizzi[col].map(to_int_safe)

# Calcolo il totale studenti per controllo incrociato
df_indirizzi['totale'] = df_indirizzi['alunnimaschi'] + df_indirizzi['alunnifemmine']

# ============================================================================
# FASE 2: AGGREGAZIONE DATI CITTADINANZA
# ============================================================================
"""
Aggrego i dati di cittadinanza per scuola, sommando tutti gli anni di corso.
Questo mi dà il totale complessivo di studenti italiani e stranieri per scuola.
"""

agg_cittad = df_cittadinanza.groupby('codicescuola').agg({
    'alunni': 'sum',  # Totale studenti
    'alunnicittadinanzaitaliana': 'sum',  # Totale italiani
    'alunnicittadinanzanonitaliana': 'sum'  # Totale stranieri
}).reset_index()

# ============================================================================
# FASE 3: AGGREGAZIONE DATI INDIRIZZI
# ============================================================================
"""
Aggrego i dati degli indirizzi per calcolare il numero totale di indirizzi
offerti da ogni scuola e il totale studenti da questa fonte.
"""

agg_indirizzi = df_indirizzi.groupby('codicescuola').agg({
    'indirizzo': 'nunique',  # Numero di indirizzi diversi offerti
    'totale': 'sum'  # Totale studenti sommando tutti gli indirizzi
}).rename(columns={
    'indirizzo': 'num_indirizzi',
    'totale': 'alunni_da_indirizzi'
}).reset_index()

# ============================================================================
# FASE 4: CREAZIONE DATASET STATISTICHE BASE
# ============================================================================
"""
Creo il dataset principale delle statistiche unendo tutte le informazioni
aggregate con i dati anagrafici delle scuole.
"""

# Parto dai dati anagrafici essenziali
statistiche = df_scuole[['codicescuola', 'regione', 'provincia', 'descrizionecomune']].drop_duplicates()

# Aggiungo i dati aggregati sulla cittadinanza
statistiche = statistiche.merge(agg_cittad, on='codicescuola', how='left')

# Aggiungo i dati aggregati sugli indirizzi
statistiche = statistiche.merge(agg_indirizzi, on='codicescuola', how='left')

# ============================================================================
# FASE 5: CALCOLO PERCENTUALI CITTADINANZA
# ============================================================================
"""
Calcolo le percentuali di studenti italiani e stranieri per ogni scuola.
Queste percentuali saranno fondamentali per generare distribuzioni realistiche.
"""

# Percentuale studenti italiani
statistiche['perc_italiani'] = statistiche.apply(
    lambda row: round(row['alunnicittadinanzaitaliana'] / row['alunni'], 3)
    if row['alunni'] > 0 else 0,
    axis=1
)

# Percentuale studenti stranieri (complementare)
statistiche['perc_stranieri'] = statistiche.apply(
    lambda row: round(row['alunnicittadinanzanonitaliana'] / row['alunni'], 3)
    if row['alunni'] > 0 else 0,
    axis=1
)

# ============================================================================
# FASE 6: CALCOLO PERCENTUALI GENERE
# ============================================================================
"""
Calcolo le percentuali di maschi e femmine aggregando i dati per scuola.
Anche queste saranno essenziali per la generazione realistica.
"""

# Aggrego i dati di genere per scuola
agg_gender = df_indirizzi.groupby('codicescuola').agg({
    'alunnimaschi': 'sum',
    'alunnifemmine': 'sum'
}).reset_index()

# Calcolo il totale per le percentuali
agg_gender['totale'] = agg_gender['alunnimaschi'] + agg_gender['alunnifemmine']

# Calcolo percentuale maschi
agg_gender['perc_maschi'] = agg_gender.apply(
    lambda row: round(row['alunnimaschi'] / row['totale'], 3)
    if row['totale'] > 0 else 0,
    axis=1
)

# Calcolo percentuale femmine (complementare)
agg_gender['perc_femmine'] = agg_gender.apply(
    lambda row: round(row['alunnifemmine'] / row['totale'], 3)
    if row['totale'] > 0 else 0,
    axis=1
)

# Unisco le percentuali di genere al dataset principale
statistiche = statistiche.merge(agg_gender, on='codicescuola', how='left')

# ============================================================================
# FASE 7: STATISTICHE REGIONALI PER TIPO PERCORSO
# ============================================================================
"""
Calcolo statistiche aggregate per regione e tipo di percorso.
Queste informazioni possono essere utili per analisi comparative e
per verificare la rappresentatività del campione.
"""

# Preparo un dataset temporaneo unendo anagrafica e indirizzi
df_temp = df_scuole[['codicescuola', 'regione']].merge(
    df_indirizzi[['codicescuola', 'tipopercorso', 'indirizzo', 'totale']],
    on='codicescuola', how='left'
)

# Calcolo aggregati per regione e tipo percorso
stat_regione_percorso = df_temp.groupby(['regione', 'tipopercorso']).agg({
    'codicescuola': 'nunique',  # Numero scuole che offrono questo percorso
    'indirizzo': 'nunique',  # Numero indirizzi diversi nella regione
    'totale': 'sum'  # Totale studenti per questo percorso
}).rename(columns={
    'codicescuola': 'reg_num_scuole',
    'indirizzo': 'reg_num_indirizzi',
    'totale': 'reg_tot_studenti'
}).reset_index()

# Calcolo la media studenti per scuola a livello regionale
stat_regione_percorso['reg_media_studenti_per_scuola'] = stat_regione_percorso.apply(
    lambda row: round(row['reg_tot_studenti'] / row['reg_num_scuole'], 1)
    if row['reg_num_scuole'] > 0 else 0,
    axis=1
)

# ============================================================================
# FASE 8: INTEGRAZIONE STATISTICHE REGIONALI
# ============================================================================
"""
Aggiungo le statistiche regionali a ogni scuola per fornire contesto
e permettere confronti con le medie regionali.
"""

# Creo una tabella di lookup scuola -> tipo percorso principale
df_scuole_percorso = df_indirizzi[['codicescuola', 'tipopercorso']].drop_duplicates()

# Aggiungo la regione per il join
df_scuole_percorso = df_scuole_percorso.merge(
    df_scuole[['codicescuola', 'regione']], on='codicescuola', how='left'
)

# Aggiungo le statistiche regionali
df_scuole_percorso = df_scuole_percorso.merge(
    stat_regione_percorso, on=['regione', 'tipopercorso'], how='left'
)

# Integro nel dataset principale (rimuovo la regione duplicata)
statistiche = statistiche.merge(
    df_scuole_percorso.drop(columns=['regione']),
    on='codicescuola',
    how='left'
)

# ============================================================================
# SALVATAGGIO RISULTATI
# ============================================================================
"""
Salvo il file con tutte le statistiche calcolate.
Questo file sarà il riferimento principale per la fase di generazione.
"""

statistiche.to_csv(OUTPUT_FILE, index=False)
print(f"✅ File riepilogativo salvato in: {OUTPUT_FILE}")

# ============================================================================
# NOTE PER L'UTILIZZO
# ============================================================================
"""
Il file generato contiene per ogni scuola:
- Informazioni geografiche (regione, provincia, comune)
- Numero totale di studenti e distribuzione per cittadinanza
- Percentuali di italiani/stranieri
- Percentuali di maschi/femmine
- Numero di indirizzi offerti
- Statistiche regionali di confronto

Queste statistiche sono essenziali per:
1. Generare distribuzioni realistiche nella simulazione
2. Verificare la coerenza dei dati generati
3. Analizzare pattern geografici e per tipo di scuola
"""
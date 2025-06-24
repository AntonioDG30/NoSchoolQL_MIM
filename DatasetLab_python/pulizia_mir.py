# -*- coding: utf-8 -*-
# Specifica la codifica dei caratteri (UTF-8) per supportare caratteri speciali italiani nei file

import pandas as pd  # Importo la libreria pandas per la manipolazione dei dati tabellari
import os            # Importo os per operazioni sui file (es. creare directory)

# -----------------------------
# CONFIGURAZIONE PERCORSI
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # Ottengo il percorso assoluto della cartella contenente lo script


# Definisco i percorsi dei file CSV originali usati come input
PATH_ANAG_SCUOLE = os.path.join(BASE_DIR, '../file/dataset_originali/AnagScuole.csv')
PATH_ANAG_SCUOLE_PA = os.path.join(BASE_DIR, '../file/dataset_originali/AnagScuoleProvAutonome.csv')
PATH_STU_CITTAD = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Cittad.csv')
PATH_STU_INDIRIZZO = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Indirizzo.csv')
PATH_STU_CORSO_CLASSE = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Corso_Classe_Genere.csv')


# -----------------------------
# FUNZIONI DI UTILITÀ
# -----------------------------
def normalize_string(x):
    # Normalizza una stringa: rimuove spazi e converte in maiuscolo
    return str(x).strip().upper()

def clean_string_columns(df):
    # Applica la normalizzazione a tutte le colonne di tipo stringa in un DataFrame
    for col in df.select_dtypes(include='object'):
        df[col] = df[col].map(normalize_string)
    return df

def snake_case_columns(df):
    # Converte i nomi delle colonne in snake_case (minuscole e con underscore)
    df.columns = [col.lower().replace(" ", "_") for col in df.columns]
    return df

def report_stats(name, original_len, cleaned_df):
    # Stampa statistiche sulla pulizia del dataset: righe rimosse
    print(f"📊 {name}: {original_len} righe iniziali → {len(cleaned_df)} righe finali (rimossi {original_len - len(cleaned_df)} record)")

# -----------------------------
# 0. FILTRO SCUOLE SECONDARIE DI II GRADO
# -----------------------------
df_ordini = pd.read_csv(PATH_STU_CORSO_CLASSE, dtype=str)  # Carico il file con i codici scuola e ordini scolastici
df_ordini = clean_string_columns(df_ordini)                # Normalizzo i valori stringa
df_ordini = snake_case_columns(df_ordini)                  # Converto i nomi delle colonne in snake_case

# Estraggo solo i codici delle scuole secondarie di II grado
scuole_secondarie = df_ordini[df_ordini['ordinescuola'] == 'SCUOLA SECONDARIA II GRADO']['codicescuola'].unique()
scuole_secondarie = set(scuole_secondarie)  # Converto in set per operazioni rapide di membership

# -----------------------------
# 1. PULIZIA E UNIONE ANAGRAFICHE SCUOLE
# -----------------------------
# Elenco delle colonne da rimuovere nei file anagrafici
anagrafica_drop = [
    'ANNOSCOLASTICO', 'CAPSCUOLA', 'INDIRIZZOSCUOLA',
    'INDICAZIONESEDEDIRETTIVO', 'INDICAZIONESEDEOMNICOMPRENSIVO',
    'INDIRIZZOEMAILSCUOLA', 'INDIRIZZOPECSCUOLA', 'SITOWEBSCUOLA',
    'SEDESCOLASTICA'
]

anag1 = pd.read_csv(PATH_ANAG_SCUOLE, dtype=str)           # Carico il file principale delle scuole
anag2 = pd.read_csv(PATH_ANAG_SCUOLE_PA, dtype=str)        # Carico il file delle scuole delle province autonome
anag = pd.concat([anag1, anag2], ignore_index=True)        # Unisco i due DataFrame in uno solo
original_len = len(anag)                                   # Salvo il numero di righe iniziali

# Rimuovo le colonne non necessarie, se presenti
anag.drop(columns=[col for col in anagrafica_drop if col in anag.columns], inplace=True)
anag = clean_string_columns(anag)                          # Normalizzo i valori stringa
anag.drop_duplicates(subset=['CODICESCUOLA'], inplace=True)  # Rimuovo duplicati basati sul codice scuola
anag.dropna(subset=['CODICESCUOLA', 'DENOMINAZIONESCUOLA', 'REGIONE', 'DESCRIZIONECOMUNE'], inplace=True)  # Rimuovo righe con valori fondamentali mancanti
anag = snake_case_columns(anag)                            # Converto i nomi delle colonne in snake_case

# Filtro solo le scuole secondarie di II grado
anag = anag[anag['codicescuola'].isin(scuole_secondarie)]
report_stats("Anagrafica Scuole", original_len, anag)      # Stampo statistiche sulla pulizia

# -----------------------------
# 2. PULIZIA STU_CITTAD
# -----------------------------
# Elenco delle colonne da eliminare
stu_cittad_drop = ['ANNOSCOLASTICO', 'ORDINESCUOLA', 'ANNOCORSO']
stu_cittad = pd.read_csv(PATH_STU_CITTAD, dtype=str)       # Carico il file con i dati sulla cittadinanza
original_len = len(stu_cittad)                             # Salvo il numero iniziale di righe

# Normalizzo intestazioni e rimuovo colonne non necessarie
stu_cittad.columns = [normalize_string(col) for col in stu_cittad.columns]
stu_cittad.drop(columns=[normalize_string(col) for col in stu_cittad_drop if normalize_string(col) in stu_cittad.columns], inplace=True)
stu_cittad = clean_string_columns(stu_cittad)              # Normalizzo i valori stringa
stu_cittad.drop_duplicates(inplace=True)                   # Rimuovo duplicati
stu_cittad.dropna(subset=[
    'CODICESCUOLA', 'ALUNNI', 'ALUNNICITTADINANZAITALIANA', 'ALUNNICITTADINANZANONITALIANA'
], inplace=True)                                           # Rimuovo righe con dati fondamentali mancanti
stu_cittad = snake_case_columns(stu_cittad)                # Converto nomi colonne in snake_case

# Filtro solo le scuole secondarie
stu_cittad = stu_cittad[stu_cittad['codicescuola'].isin(scuole_secondarie)]
report_stats("Studenti Cittadinanza", original_len, stu_cittad)

# -----------------------------
# 4. PULIZIA STU_INDIRIZZO
# -----------------------------
# Elenco colonne da rimuovere
stu_indirizzo_drop = ['ANNOSCOLASTICO', 'ORDINESCUOLA']
stu_ind = pd.read_csv(PATH_STU_INDIRIZZO, dtype=str)       # Carico il file con gli indirizzi scolastici
original_len = len(stu_ind)                                # Salvo il numero iniziale di righe

# Normalizzo intestazioni e contenuti
stu_ind.columns = [normalize_string(col) for col in stu_ind.columns]
stu_ind.drop(columns=[normalize_string(col) for col in stu_indirizzo_drop if normalize_string(col) in stu_ind.columns], inplace=True)
stu_ind = clean_string_columns(stu_ind)                    # Normalizzo i valori stringa
stu_ind = snake_case_columns(stu_ind)                      # Converto intestazioni in snake_case
stu_ind.dropna(subset=[
    'codicescuola', 'tipopercorso', 'indirizzo', 'alunnimaschi', 'alunnifemmine'
], inplace=True)                                           # Elimino righe incomplete
stu_ind.drop_duplicates(inplace=True)                      # Elimino duplicati

# Filtro solo le scuole secondarie
stu_ind = stu_ind[stu_ind['codicescuola'].isin(scuole_secondarie)]
report_stats("Studenti per Indirizzo", original_len, stu_ind)

# -----------------------------
# SALVATAGGIO FILE PULITI
# -----------------------------
os.makedirs(os.path.join(BASE_DIR, '../file/dataset_puliti'), exist_ok=True)

# Salvo i file CSV puliti nella cartella dataset_pulito
anag.to_csv(os.path.join(BASE_DIR, '../file/dataset_puliti/anagrafica_scuole_pulita.csv'), index=False)
stu_cittad.to_csv(os.path.join(BASE_DIR, '../file/dataset_puliti/stu_cittadinanza_pulito.csv'), index=False)
stu_ind.to_csv(os.path.join(BASE_DIR, '../file/dataset_puliti/stu_indirizzi_pulito.csv'), index=False)



print("\n✅ Pulizia completata. File salvati nella cartella 'dataset_pulito'.")  # Messaggio di conferma

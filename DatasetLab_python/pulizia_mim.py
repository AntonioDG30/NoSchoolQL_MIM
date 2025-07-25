"""
================================================================================
MODULO DI PULIZIA DEI DATI MIUR
================================================================================
Questo script si occupa della prima fase della pipeline: pulire e preparare
i dati grezzi forniti dal MIUR (Ministero dell'Istruzione, dell'Università e della Ricerca).

Operazioni principali:
1. Caricamento dei file CSV originali del MIUR
2. Normalizzazione e pulizia dei dati (rimozione duplicati, valori mancanti, ecc.)
3. Filtraggio per le sole scuole secondarie di II grado
4. Campionamento opzionale per ridurre la dimensione del dataset
5. Salvataggio dei dati puliti per le fasi successive

Il modulo può operare in modalità ridotta per test rapidi o sviluppo.

Autore: Antonio Di Giorgio
Data: Giugno 2025
================================================================================
"""

import pandas as pd
import os

# ============================================================================
# CONFIGURAZIONE
# ============================================================================
# Modalità ridotta: se True, lavoro solo su un campione di scuole per velocizzare
ModalitaRidotta = True
NUM_SCUOLE = 200  # Numero di scuole da campionare in modalità ridotta

# Determino la directory base per costruire i percorsi relativi
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Percorsi dei file di input MIUR
# Questi file devono essere scaricati dal sito del MIUR e posizionati nella cartella indicata
PATH_ANAG_SCUOLE = os.path.join(BASE_DIR, '../file/dataset_originali/AnagScuole.csv')
PATH_ANAG_SCUOLE_PA = os.path.join(BASE_DIR, '../file/dataset_originali/AnagScuoleProvAutonome.csv')
PATH_STU_CITTAD = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Cittad.csv')
PATH_STU_INDIRIZZO = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Indirizzo.csv')
PATH_STU_CORSO_CLASSE = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Corso_Classe_Genere.csv')


# ============================================================================
# FUNZIONI DI UTILITÀ PER LA PULIZIA
# ============================================================================
def normalize_string(x):
    """
    Normalizzo una stringa rimuovendo spazi e convertendo in maiuscolo.

    Questa funzione garantisce uniformità nei dati testuali, fondamentale
    per i successivi confronti e join tra tabelle.

    Args:
        x: Valore da normalizzare (può essere di qualsiasi tipo)

    Returns:
        str: Stringa normalizzata in maiuscolo senza spazi iniziali/finali
    """
    return str(x).strip().upper()


def clean_string_columns(df):
    """
    Applico la normalizzazione a tutte le colonne testuali di un DataFrame.

    Questa operazione è cruciale per garantire che i join tra tabelle
    funzionino correttamente nonostante possibili differenze di formattazione.

    Args:
        df (pd.DataFrame): DataFrame da pulire

    Returns:
        pd.DataFrame: DataFrame con colonne testuali normalizzate
    """
    # Identifico solo le colonne di tipo object (stringhe)
    for col in df.select_dtypes(include='object'):
        df[col] = df[col].map(normalize_string)
    return df


def snake_case_columns(df):
    """
    Converto i nomi delle colonne in snake_case (minuscolo con underscore).

    Standardizzo i nomi delle colonne per facilitare l'accesso programmatico
    e mantenere coerenza con le convenzioni Python.

    Args:
        df (pd.DataFrame): DataFrame da modificare

    Returns:
        pd.DataFrame: DataFrame con nomi colonne in snake_case
    """
    df.columns = [col.lower().replace(" ", "_") for col in df.columns]
    return df


def report_stats(name, original_len, cleaned_df):
    """
    Riporto le statistiche di pulizia per monitorare quanti record sono stati rimossi.

    Args:
        name (str): Nome del dataset per il logging
        original_len (int): Numero di righe originali
        cleaned_df (pd.DataFrame): DataFrame pulito
    """
    print(f"📊 {name}: {original_len} → {len(cleaned_df)} righe (rimossi {original_len - len(cleaned_df)})")


def sort_dataframe(df):
    """
    Ordino il DataFrame secondo una gerarchia geografica standard.

    L'ordinamento facilita la lettura manuale dei dati e garantisce
    risultati deterministici tra esecuzioni diverse.

    Args:
        df (pd.DataFrame): DataFrame da ordinare

    Returns:
        pd.DataFrame: DataFrame ordinato
    """
    # Definisco l'ordine preferenziale delle colonne per il sorting
    sort_cols = [
        'codicescuola',
        'areageografica',
        'regione',
        'provincia',
        'codicecomunescuola',
        'descrizionecomune'
    ]
    # Uso solo le colonne effettivamente presenti nel DataFrame
    valid_cols = [col for col in sort_cols if col in df.columns]
    return df.sort_values(by=valid_cols)


# ============================================================================
# FASE 1: IDENTIFICAZIONE SCUOLE SECONDARIE DI II GRADO
# ============================================================================
"""
Prima di tutto devo identificare quali sono le scuole secondarie di II grado.
Questo mi serve per filtrare tutti gli altri dataset e lavorare solo con
le scuole di nostro interesse.
"""

# Carico il file che contiene l'ordine di scuola
df_ordini = pd.read_csv(PATH_STU_CORSO_CLASSE, dtype=str)
df_ordini = clean_string_columns(df_ordini)
df_ordini = snake_case_columns(df_ordini)

# Estraggo solo i codici delle scuole secondarie di II grado
# Questo set mi servirà per filtrare tutti gli altri dataset
scuole_secondarie = set(df_ordini[df_ordini['ordinescuola'] == 'SCUOLA SECONDARIA II GRADO']['codicescuola'])

# ============================================================================
# FASE 2: PULIZIA ANAGRAFICA SCUOLE
# ============================================================================
"""
L'anagrafica delle scuole contiene molte informazioni non necessarie per la
simulazione. Rimuovo le colonne superflue e pulisco i dati essenziali.
"""

# Colonne da rimuovere perché non necessarie per la simulazione
drop_cols_anag = [
    'ANNOSCOLASTICO',  # Sempre uguale per tutti
    'CAPSCUOLA',  # CAP non necessario
    'INDIRIZZOSCUOLA',  # Indirizzo fisico non necessario
    'INDICAZIONESEDEDIRETTIVO',  # Info amministrative non necessarie
    'INDICAZIONESEDEOMNICOMPRENSIVO',
    'INDIRIZZOEMAILSCUOLA',  # Contatti non necessari
    'INDIRIZZOPECSCUOLA',
    'SITOWEBSCUOLA',
    'SEDESCOLASTICA'
]

# Carico e unisco i due file di anagrafica (normale e province autonome)
anag1 = pd.read_csv(PATH_ANAG_SCUOLE, dtype=str)
anag2 = pd.read_csv(PATH_ANAG_SCUOLE_PA, dtype=str)
anag = pd.concat([anag1, anag2], ignore_index=True)
original_len = len(anag)

# Applico la pulizia
anag.drop(columns=[c for c in drop_cols_anag if c in anag.columns], inplace=True)
anag = clean_string_columns(anag)
anag.drop_duplicates(subset=['CODICESCUOLA'], inplace=True)

# Rimuovo record con dati essenziali mancanti
anag.dropna(subset=['CODICESCUOLA', 'DENOMINAZIONESCUOLA', 'REGIONE', 'DESCRIZIONECOMUNE'], inplace=True)

# Standardizzo i nomi delle colonne
anag = snake_case_columns(anag)

# Filtro solo le scuole secondarie di II grado
anag = anag[anag['codicescuola'].isin(scuole_secondarie)]
report_stats("Anagrafica Scuole", original_len, anag)

# ============================================================================
# FASE 3: PULIZIA DATI CITTADINANZA STUDENTI
# ============================================================================
"""
Questo dataset contiene informazioni sulla cittadinanza degli studenti.
È importante per generare una distribuzione realistica di studenti italiani
e stranieri nelle classi simulate.
"""

drop_cols_cittad = ['ANNOSCOLASTICO', 'ORDINESCUOLA']  # Già filtrati altrove
stu_cittad = pd.read_csv(PATH_STU_CITTAD, dtype=str)
original_len = len(stu_cittad)

# Normalizzo i nomi delle colonne prima di rimuoverle
stu_cittad.columns = [normalize_string(col) for col in stu_cittad.columns]
stu_cittad.drop(columns=[normalize_string(c) for c in drop_cols_cittad if normalize_string(c) in stu_cittad.columns],
                inplace=True)

# Pulizia standard
stu_cittad = clean_string_columns(stu_cittad)
stu_cittad.drop_duplicates(inplace=True)

# Rimuovo record con dati essenziali mancanti
stu_cittad.dropna(subset=[
    'CODICESCUOLA', 'ALUNNI', 'ALUNNICITTADINANZAITALIANA', 'ALUNNICITTADINANZANONITALIANA'
], inplace=True)

stu_cittad = snake_case_columns(stu_cittad)

# Filtro solo le scuole secondarie
stu_cittad = stu_cittad[stu_cittad['codicescuola'].isin(scuole_secondarie)]
report_stats("Studenti Cittadinanza", original_len, stu_cittad)

# ============================================================================
# FASE 4: PULIZIA DATI STUDENTI PER INDIRIZZO
# ============================================================================
"""
Questo dataset contiene il numero di studenti per indirizzo di studio,
divisi per genere. È fondamentale per ricreare la struttura delle classi.
"""

drop_cols_ind = ['ANNOSCOLASTICO', 'ORDINESCUOLA']
stu_ind = pd.read_csv(PATH_STU_INDIRIZZO, dtype=str)
original_len = len(stu_ind)

# Normalizzo i nomi delle colonne
stu_ind.columns = [normalize_string(col) for col in stu_ind.columns]
stu_ind.drop(columns=[normalize_string(c) for c in drop_cols_ind if normalize_string(c) in stu_ind.columns],
             inplace=True)

# Pulizia standard
stu_ind = clean_string_columns(stu_ind)
stu_ind = snake_case_columns(stu_ind)

# Rimuovo record con dati essenziali mancanti
stu_ind.dropna(subset=[
    'codicescuola', 'tipopercorso', 'indirizzo', 'alunnimaschi', 'alunnifemmine'
], inplace=True)
stu_ind.drop_duplicates(inplace=True)

# Filtro solo le scuole secondarie
stu_ind = stu_ind[stu_ind['codicescuola'].isin(scuole_secondarie)]
report_stats("Studenti per Indirizzo", original_len, stu_ind)

# ============================================================================
# FASE 5: CAMPIONAMENTO STRATIFICATO (MODALITÀ RIDOTTA)
# ============================================================================
"""
In modalità ridotta, seleziono un campione rappresentativo di scuole
mantenendo la diversità geografica e di tipologia di percorso.
"""

if ModalitaRidotta:
    # Creo un dataset con metadati per il campionamento stratificato
    meta_scuole = pd.merge(anag, stu_ind[['codicescuola', 'tipopercorso']], on='codicescuola', how='inner')
    meta_scuole = meta_scuole.drop_duplicates(subset=['codicescuola', 'tipopercorso'])

    # Raggruppo per regione e tipo di percorso per garantire rappresentatività
    gruppi = meta_scuole.groupby(['regione', 'tipopercorso'])
    scuole_per_gruppo = max(1, NUM_SCUOLE // len(gruppi))

    # Campiono da ogni gruppo proporzionalmente
    campione = pd.concat(
        [g.sample(n=min(scuole_per_gruppo, len(g)), random_state=42) for _, g in gruppi],
        ignore_index=True
    )

    # Se non ho raggiunto il numero target, aggiungo scuole extra
    scuole_attuali = set(campione['codicescuola'])
    if len(scuole_attuali) < NUM_SCUOLE:
        disponibili = set(meta_scuole['codicescuola']) - scuole_attuali
        extra = meta_scuole[meta_scuole['codicescuola'].isin(disponibili)].sample(
            n=NUM_SCUOLE - len(scuole_attuali), random_state=42
        )
        campione = pd.concat([campione, extra], ignore_index=True)

    # Filtro tutti i dataset con solo le scuole campionate
    scuole_finali = set(campione['codicescuola'])
    anag = anag[anag['codicescuola'].isin(scuole_finali)]
    stu_cittad = stu_cittad[stu_cittad['codicescuola'].isin(scuole_finali)]
    stu_ind = stu_ind[stu_ind['codicescuola'].isin(scuole_finali)]

    print(f"\n✅ Campione finale: {len(anag)} scuole (ridotto a {NUM_SCUOLE})")

# ============================================================================
# FASE 6: ORDINAMENTO E SALVATAGGIO
# ============================================================================
"""
Ordino i dataset per facilitare la consultazione manuale e garantire
risultati deterministici. Poi salvo tutto nella cartella di output.
"""

# Applico l'ordinamento standard a tutti i dataset
anag = sort_dataframe(anag)
stu_cittad = sort_dataframe(stu_cittad)
stu_ind = sort_dataframe(stu_ind)

# Creo la directory di output se non esiste
out_dir = os.path.join(BASE_DIR, '../file/dataset_puliti')
os.makedirs(out_dir, exist_ok=True)

# Salvo i file puliti
anag.to_csv(os.path.join(out_dir, 'anagrafica_scuole_pulita.csv'), index=False)
stu_cittad.to_csv(os.path.join(out_dir, 'stu_cittadinanza_pulito.csv'), index=False)
stu_ind.to_csv(os.path.join(out_dir, 'stu_indirizzi_pulito.csv'), index=False)

print("\n✅ File ordinati e salvati nella cartella 'dataset_puliti'.")

# ============================================================================
# VERIFICA FINALE DI COERENZA
# ============================================================================
"""
Verifico che tutti i codici scuola nei dataset di dettaglio siano presenti
nell'anagrafica. Questo garantisce l'integrità referenziale.
"""

codici = set(anag['codicescuola'])
assert set(stu_cittad['codicescuola']).issubset(codici), "⚠️ stu_cittad contiene codici non coerenti"
assert set(stu_ind['codicescuola']).issubset(codici), "⚠️ stu_ind contiene codici non coerenti"
print("✅ Verifica finale: tutti i file sono coerenti.")

# ============================================================================
# NOTE PER L'UTILIZZO
# ============================================================================
"""
Per modificare il comportamento di questo script:

1. Per lavorare con tutti i dati (non campionati):
   - Impostare ModalitaRidotta = False

2. Per cambiare il numero di scuole nel campione:
   - Modificare NUM_SCUOLE

3. Per aggiungere/rimuovere colonne dalla pulizia:
   - Modificare le liste drop_cols_*

Il campionamento stratificato garantisce rappresentatività geografica
e per tipo di percorso, fondamentale per analisi statistiche accurate.
"""
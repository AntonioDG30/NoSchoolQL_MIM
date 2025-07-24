"""
================================================================================
MODULO DI GENERAZIONE DATI SIMULATI
================================================================================
Questo è il cuore della pipeline: genera un dataset completo e realistico del
sistema scolastico italiano partendo dalle statistiche reali del MIUR.

Il modulo simula:
1. Classi con distribuzione realistica di studenti
2. Studenti con caratteristiche socio-demografiche (genere, cittadinanza, ESCS)
3. Docenti assegnati alle classi per materia
4. Voti degli studenti influenzati da fattori socio-demografici e didattici

La simulazione integra fattori realistici come:
- Differenze geografiche nel rendimento scolastico
- Impatto del background socio-economico (ESCS) 
- Difficoltà diverse delle materie
- Variabilità tra classi e docenti

Autore: [Il tuo nome]
Data: [Data di creazione]
================================================================================
"""

import os
import math
import random
import datetime
from collections import defaultdict, Counter
from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional

import pandas as pd
import numpy as np
from faker import Faker
import shutil

# ============================================================================
# CONFIGURAZIONE GLOBALE
# ============================================================================
"""
Definisco i parametri principali che controllano la simulazione.
Questi valori possono essere modificati per ottenere dataset con
caratteristiche diverse.
"""

SEED = None  # Seed per riproducibilità - impostare a None per risultati casuali

# Parametri per la generazione delle classi
MEDIA_ALUNNI_PER_CLASSE = 22  # Dimensione media delle classi
MEDIA_CLASSI_PER_DOCENTE = 4  # Numero medio di classi per docente
MIN_CLASSI_PER_DOCENTE = 3  # Minimo classi assegnate a un docente
MAX_CLASSI_PER_DOCENTE = 6  # Massimo classi assegnate a un docente

# Parametri per la generazione dei voti
PESO_MIN_VOTO = 1  # Voto minimo possibile
PESO_MAX_VOTO = 10  # Voto massimo possibile
SOFT_FLOOR_VOTO = 3  # Soglia soft per voti molto bassi (riduco probabilità sotto 3)

# Parametri ESCS (Economic, Social and Cultural Status)
ESCS_MIN = -2.86  # Valore minimo ESCS osservato nei dati reali
ESCS_MAX = 1.78  # Valore massimo ESCS osservato nei dati reali
ESCS_SOGLIA_BASSO = -0.35  # Soglia per ESCS considerato basso

# ============================================================================
# MAPPATURE GEOGRAFICHE E IMPATTI
# ============================================================================
"""
Definisco le mappature necessarie per associare province ad aree geografiche
e gli impatti che queste hanno sul rendimento scolastico.
"""

# Impatto dell'area geografica sul rendimento (basato su dati INVALSI reali)
GEOGRAFIA_IMPACT = {
    'NORD-OVEST': 0.5,  # Rendimento sopra la media
    'NORD-EST': 0.6,  # Rendimento più alto
    'CENTRO': 0.2,  # Leggermente sopra la media
    'SUD': -0.4,  # Sotto la media
    'ISOLE': -0.5  # Rendimento più basso
}

# Mappatura province -> area geografica
# Questa mappatura copre tutte le province italiane
PROVINCE_TO_AREA = {
    # NORD-OVEST
    'MI': 'NORD-OVEST', 'TO': 'NORD-OVEST', 'GE': 'NORD-OVEST', 'AO': 'NORD-OVEST',
    'VA': 'NORD-OVEST', 'CO': 'NORD-OVEST', 'SO': 'NORD-OVEST', 'NO': 'NORD-OVEST',
    'VB': 'NORD-OVEST', 'LC': 'NORD-OVEST', 'BI': 'NORD-OVEST', 'MB': 'NORD-OVEST',
    'LO': 'NORD-OVEST', 'PV': 'NORD-OVEST', 'CR': 'NORD-OVEST', 'MN': 'NORD-OVEST',
    'BS': 'NORD-OVEST', 'BG': 'NORD-OVEST', 'SP': 'NORD-OVEST', 'IM': 'NORD-OVEST',
    'SV': 'NORD-OVEST', 'AL': 'NORD-OVEST', 'AT': 'NORD-OVEST', 'CN': 'NORD-OVEST',
    'VC': 'NORD-OVEST',

    # NORD-EST
    'VE': 'NORD-EST', 'TV': 'NORD-EST', 'RO': 'NORD-EST', 'PD': 'NORD-EST',
    'VI': 'NORD-EST', 'VR': 'NORD-EST', 'BL': 'NORD-EST', 'TN': 'NORD-EST',
    'BZ': 'NORD-EST', 'TS': 'NORD-EST', 'UD': 'NORD-EST', 'GO': 'NORD-EST',
    'PN': 'NORD-EST', 'BO': 'NORD-EST', 'MO': 'NORD-EST', 'RE': 'NORD-EST',
    'PR': 'NORD-EST', 'FE': 'NORD-EST', 'RA': 'NORD-EST', 'FC': 'NORD-EST',
    'PC': 'NORD-EST', 'RN': 'NORD-EST',

    # CENTRO
    'FI': 'CENTRO', 'AR': 'CENTRO', 'SI': 'CENTRO', 'GR': 'CENTRO', 'PI': 'CENTRO',
    'LI': 'CENTRO', 'LU': 'CENTRO', 'PT': 'CENTRO', 'PO': 'CENTRO', 'MS': 'CENTRO',
    'PG': 'CENTRO', 'TR': 'CENTRO', 'AN': 'CENTRO', 'MC': 'CENTRO', 'PU': 'CENTRO',
    'AP': 'CENTRO', 'FM': 'CENTRO', 'RM': 'CENTRO', 'VT': 'CENTRO', 'RI': 'CENTRO',
    'LT': 'CENTRO', 'FR': 'CENTRO',

    # SUD
    'AQ': 'SUD', 'TE': 'SUD', 'PE': 'SUD', 'CH': 'SUD', 'CB': 'SUD', 'IS': 'SUD',
    'CE': 'SUD', 'BN': 'SUD', 'NA': 'SUD', 'AV': 'SUD', 'SA': 'SUD', 'FG': 'SUD',
    'BA': 'SUD', 'TA': 'SUD', 'BR': 'SUD', 'LE': 'SUD', 'BT': 'SUD', 'PZ': 'SUD',
    'MT': 'SUD', 'CS': 'SUD', 'CZ': 'SUD', 'RC': 'SUD', 'KR': 'SUD', 'VV': 'SUD',

    # ISOLE
    'PA': 'ISOLE', 'CT': 'ISOLE', 'ME': 'ISOLE', 'AG': 'ISOLE', 'CL': 'ISOLE',
    'EN': 'ISOLE', 'TP': 'ISOLE', 'RG': 'ISOLE', 'SR': 'ISOLE', 'SS': 'ISOLE',
    'NU': 'ISOLE', 'CA': 'ISOLE', 'OR': 'ISOLE', 'OT': 'ISOLE', 'OG': 'ISOLE',
    'VS': 'ISOLE', 'CI': 'ISOLE', 'SU': 'ISOLE'
}

# Impatto del tipo di scuola sul rendimento
TIPO_SCUOLA_IMPACT = {
    'LICEO SCIENTIFICO': 0.8,  # Alto rendimento medio
    'LICEO CLASSICO': 0.9,  # Rendimento più alto
    'LICEO LINGUISTICO': 0.5,  # Rendimento medio-alto
    'LICEO ARTISTICO': 0.3,  # Rendimento medio
    'ISTITUTO TECNICO INDUSTRIALE': -0.2,  # Leggermente sotto media
    'ISTITUTO TECNICO COMMERCIALE': -0.2,  # Leggermente sotto media
    'ISTITUTO PROFESSIONALE': -0.6  # Rendimento più basso
}

# Impatto della cittadinanza sul rendimento
CITTADINANZA_IMPACT = {
    'ITA': 0.0,  # Baseline
    'UE': -0.3,  # Leggero svantaggio
    'NON_UE': -0.6  # Svantaggio maggiore (barriere linguistiche/culturali)
}

# Impatto del quartile ESCS sul rendimento
ESCS_QUARTILE_IMPACT = {
    1: -0.8,  # Quartile più basso - forte svantaggio
    2: -0.3,  # Secondo quartile - svantaggio moderato
    3: 0.3,  # Terzo quartile - leggero vantaggio
    4: 0.8  # Quartile più alto - forte vantaggio
}

# ============================================================================
# CONFIGURAZIONE PERCORSI FILE
# ============================================================================
"""
Definisco i percorsi per leggere i dati di input e salvare i risultati.
"""

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_puliti')
OUTPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_definitivi')

# Creo la directory di output se non esiste
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ============================================================================
# INIZIALIZZAZIONE GENERATORI CASUALI
# ============================================================================
"""
Inizializzo i generatori di numeri casuali con il seed per garantire
riproducibilità dei risultati.
"""

if SEED is not None:
    random.seed(SEED)
    np.random.seed(SEED)

# Inizializzo Faker per generare nomi italiani realistici
faker = Faker('it_IT')
if SEED is not None:
    Faker.seed(SEED)


# ============================================================================
# FUNZIONI DI UTILITÀ GENERALI
# ============================================================================
def to_int_safe(x):
    """
    Converto in intero in modo sicuro gestendo valori non validi.

    Args:
        x: Valore da convertire

    Returns:
        int: Valore convertito o 0 se non convertibile
    """
    try:
        return int(x)
    except:
        return 0


def calcola_escs_quartile(escs: float) -> int:
    """
    Calcolo il quartile ESCS di uno studente.

    Divido l'intervallo ESCS in 4 parti uguali per determinare
    il quartile di appartenenza.

    Args:
        escs (float): Valore ESCS dello studente

    Returns:
        int: Quartile (1-4) di appartenenza
    """
    # Calcolo la posizione percentuale nell'intervallo ESCS
    percentile = (escs - ESCS_MIN) / (ESCS_MAX - ESCS_MIN) * 100

    # Assegno il quartile corrispondente
    if percentile <= 25:
        return 1
    elif percentile <= 50:
        return 2
    elif percentile <= 75:
        return 3
    else:
        return 4


def genera_escs_studente(area_geografica: str, tipo_scuola: str, cittadinanza: str) -> float:
    """
    Genero un valore ESCS realistico per uno studente.

    L'ESCS è influenzato da:
    - Area geografica (nord più alto, sud più basso)
    - Tipo di scuola (licei più alto, professionali più basso)
    - Cittadinanza (italiani più alto, stranieri più basso)

    Args:
        area_geografica (str): Area geografica della scuola
        tipo_scuola (str): Tipo di scuola frequentata
        cittadinanza (str): Cittadinanza dello studente (ITA/UE/NON_UE)

    Returns:
        float: Valore ESCS generato
    """
    # Parto da una distribuzione normale standard
    base_escs = np.random.normal(0, 1)

    # Applico modificatori basati sull'area geografica
    if area_geografica in ['NORD-OVEST', 'NORD-EST']:
        base_escs += 0.4
    elif area_geografica in ['SUD', 'ISOLE']:
        base_escs -= 0.5

    # Applico modificatori basati sul tipo di scuola
    if 'LICEO' in tipo_scuola:
        base_escs += 0.3
    elif 'PROFESSIONALE' in tipo_scuola:
        base_escs -= 0.4

    # Applico modificatori basati sulla cittadinanza
    if cittadinanza == 'NON_UE':
        base_escs -= 0.6
    elif cittadinanza == 'UE':
        base_escs -= 0.2

    # Mi assicuro che il valore sia nell'intervallo valido
    return np.clip(base_escs, ESCS_MIN, ESCS_MAX)


def estrai_provincia_da_codice(codice_scuola: str) -> str:
    """
    Estraggo la provincia dal codice meccanografico della scuola.

    I primi due caratteri del codice indicano la provincia.

    Args:
        codice_scuola (str): Codice meccanografico della scuola

    Returns:
        str: Sigla della provincia (es. 'MI', 'RM')
    """
    if len(codice_scuola) >= 2:
        return codice_scuola[:2].upper()
    return 'RM'  # Default Roma se non riesco a estrarre


def get_area_geografica(provincia: str) -> str:
    """
    Ottengo l'area geografica dalla provincia.

    Args:
        provincia (str): Sigla della provincia

    Returns:
        str: Area geografica corrispondente
    """
    return PROVINCE_TO_AREA.get(provincia, 'CENTRO')


# ============================================================================
# CONFIGURAZIONE MATERIE E PESI
# ============================================================================
"""
Definisco la configurazione delle materie scolastiche, includendo
i pesi per le diverse tipologie di valutazione.
"""

# Pesi delle tipologie di voto per materia
# Ogni materia ha una distribuzione diversa tra scritto, orale e pratico
TIPOLOGIA_PESI = {
    'ITALIANO': {'scritto': 0.45, 'orale': 0.45, 'pratico': 0.10},
    'MATEMATICA': {'scritto': 0.55, 'orale': 0.35, 'pratico': 0.10},
    'FISICA': {'scritto': 0.40, 'orale': 0.30, 'pratico': 0.30},
    'INFORMATICA': {'pratico': 0.55, 'scritto': 0.25, 'orale': 0.20},
    'SCIENZE MOTORIE E SPORTIVE': {'pratico': 0.70, 'orale': 0.20, 'scritto': 0.10},
    'SCIENZE MOTORIE': {'pratico': 0.70, 'orale': 0.20, 'scritto': 0.10},
    'EDUCAZIONE FISICA': {'pratico': 0.70, 'orale': 0.20, 'scritto': 0.10},
}

# Pesi default per materie non specificate
TIPOLOGIE_DEFAULT = {'scritto': 0.34, 'orale': 0.33, 'pratico': 0.33}

# Ordine standard delle tipologie
TIPOLOGIE_ORDINE = ['scritto', 'orale', 'pratico']

# Materie base comuni a tutti gli indirizzi
MATERIE_BASE_COMUNI_BIENNIO = [
    'Italiano', 'Matematica', 'Inglese', 'Storia', 'Geografia',
    'Scienze', 'Scienze Motorie', 'Educazione Civica'
]

MATERIE_BASE_COMUNI_TRIENNIO = [
    'Italiano', 'Matematica', 'Inglese', 'Storia',
    'Scienze Motorie', 'Educazione Civica'
]

# Materie specifiche per indirizzo
MATERIE_INDIRIZZO = {
    'LICEO SCIENTIFICO': {
        'biennio': ['Latino', 'Disegno', 'Fisica (Inizio 2 anno)'],
        'triennio': ['Latino', 'Fisica', 'Scienze Naturali', 'Disegno']
    },
    'LICEO CLASSICO': {
        'biennio': ['Latino', 'Greco'],
        'triennio': ['Latino', 'Greco', 'Filosofia']
    },
    'LICEO LINGUISTICO': {
        'biennio': ['Spagnolo', 'Francese'],
        'triennio': ['Spagnolo', 'Francese', 'Storia dell\'Arte']
    },
    'LICEO ARTISTICO': {
        'biennio': ['Discipline Pittoriche', 'Discipline Plastiche'],
        'triennio': ['Storia dell\'Arte', 'Discipline Pittoriche', 'Discipline Plastiche']
    },
    'ISTITUTO TECNICO INDUSTRIALE': {
        'biennio': ['Informatica', 'Tecnologia', 'Disegno Tecnico'],
        'triennio': ['Informatica', 'Sistemi e Reti', 'TPSIT', 'Telecomunicazioni']
    },
    'ISTITUTO TECNICO COMMERCIALE': {
        'biennio': ['Economia Aziendale', 'Diritto'],
        'triennio': ['Economia Aziendale', 'Diritto', 'Relazioni Internazionali']
    },
    'ISTITUTO PROFESSIONALE': {
        'biennio': ['Laboratorio', 'Tecnologia'],
        'triennio': ['Laboratorio', 'Tecnologia', 'Sicurezza']
    }
}

# Materie di fallback per indirizzi non mappati
FALLBACK_MATERIE = [
    'Italiano', 'Matematica', 'Inglese', 'Storia',
    'Scienze', 'Scienze Motorie', 'Educazione Civica'
]

# Media base per la generazione dei voti
BASE_MEDIA = 6.5

# Difficoltà relative delle materie (impatto sul voto medio)
MATERIA_DIFFICOLTA = defaultdict(lambda: 0.0, {
    'MATEMATICA': -1.0,  # Molto difficile
    'FISICA': -0.9,  # Molto difficile
    'INFORMATICA': -0.4,  # Moderatamente difficile
    'TPSIT': -0.5,  # Moderatamente difficile
    'SISTEMI E RETI': -0.6,  # Difficile
    'TELECOMUNICAZIONI': -0.5,  # Moderatamente difficile
    'LATINO': -0.6,  # Difficile
    'GRECO': -0.9,  # Molto difficile
    'FILOSOFIA': -0.3,  # Leggermente difficile
    'DISEGNO TECNICO': -0.2,  # Leggermente difficile
    'DISEGNO': -0.1,  # Quasi neutrale
    'SCIENZE NATURALI': -0.2,  # Leggermente difficile
    'ECONOMIA AZIENDALE': -0.3,  # Leggermente difficile
    'DIRITTO': -0.1,  # Quasi neutrale
    'RELAZIONI INTERNAZIONALI': -0.2,  # Leggermente difficile
    'STORIA': -0.2,  # Leggermente difficile
    'GEOGRAFIA': 0.1,  # Leggermente facile
    'INGLESE': 0.0,  # Neutrale
    'SPAGNOLO': 0.2,  # Facile
    'FRANCESE': 0.2,  # Facile
    'ITALIANO': -0.1,  # Quasi neutrale
    'STORIA DELL\'ARTE': 0.3,  # Facile
    'DISCIPLINE PITTORICHE': 0.3,  # Facile
    'DISCIPLINE PLASTICHE': 0.3,  # Facile
    'LABORATORIO': 0.4,  # Più facile
    'TECNOLOGIA': 0.0,  # Neutrale
    'SCIENZE': 0.0,  # Neutrale
    'SCIENZE MOTORIE': 0.7,  # Molto facile
    'SCIENZE MOTORIE E SPORTIVE': 0.7,  # Molto facile
    'EDUCAZIONE FISICA': 0.7,  # Molto facile
    'EDUCAZIONE CIVICA': 0.4,  # Facile
})

# ============================================================================
# FUNZIONI PER CATEGORIZZAZIONE E TIPOLOGIE
# ============================================================================
def categoria_materia(m):
    """
    Categorizzo una materia per determinare le sue caratteristiche.

    Le categorie influenzano la distribuzione dei voti e le tipologie
    di valutazione più appropriate.

    Args:
        m (str): Nome della materia

    Returns:
        str: Categoria ('HARD', 'UMANISTICA', 'LAB', 'DEFAULT')
    """
    m_up = m.upper()

    # Materie scientifiche/tecniche difficili
    if m_up in {'MATEMATICA', 'FISICA', 'LATINO', 'GRECO', 'SISTEMI E RETI', 'TPSIT', 'TELECOMUNICAZIONI'}:
        return 'HARD'

    # Materie umanistiche
    if m_up in {'ITALIANO', 'FILOSOFIA', 'STORIA', 'GEOGRAFIA', 'INGLESE', 'SPAGNOLO', 'FRANCESE', 'RELIGIONE'}:
        return 'UMANISTICA'

    # Materie pratiche/laboratoriali
    if any(k in m_up for k in ['LABORATORIO', 'DISCIPLINE', 'INFORMATICA', 'TECNOLOGIA',
                               'PLASTIC', 'PITTOR', 'MOTORIE', 'EDUCAZIONE FISICA',
                               'SCIENZE', 'TELECOMUNICAZIONI', 'TPSIT']):
        return 'LAB'

    return 'DEFAULT'


# Aggiustamenti per tipologia di voto basati sulla categoria materia
TIPOLOGIA_ADJUST = {
    'scritto': {
        'HARD': -0.2,  # Scritti più difficili nelle materie hard
        'UMANISTICA': -0.05,  # Leggera difficoltà negli scritti umanistici
        'LAB': -0.05,  # Scritti meno importanti nei lab
        'DEFAULT': -0.1
    },
    'orale': {
        'HARD': 0.0,  # Neutrale
        'UMANISTICA': 0.15,  # Orali più facili nelle materie umanistiche
        'LAB': 0.05,  # Leggero vantaggio
        'DEFAULT': 0.05
    },
    'pratico': {
        'HARD': 0.0,  # Poco rilevante
        'UMANISTICA': 0.05,  # Poco rilevante
        'LAB': 0.4,  # Molto più facile nei lab
        'DEFAULT': 0.1
    },
}


def tipologia_delta(materia, tipologia):
    """
    Calcolo l'aggiustamento del voto basato sulla tipologia di valutazione.

    Alcune materie sono più facili/difficili in certe tipologie di voto.

    Args:
        materia (str): Nome della materia
        tipologia (str): Tipo di voto ('scritto', 'orale', 'pratico')

    Returns:
        float: Delta da applicare al voto
    """
    cat = categoria_materia(materia)
    return TIPOLOGIA_ADJUST.get(tipologia, {}).get(cat, 0.0)


# ============================================================================
# CARICAMENTO DATI DI INPUT
# ============================================================================
"""
Carico i file prodotti dalle fasi precedenti della pipeline.
"""

print('Caricamento CSV di input...')

# Anagrafica scuole con informazioni geografiche
df_anag = pd.read_csv(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'))

# Studenti per indirizzo con distribuzione di genere
df_ind = pd.read_csv(os.path.join(INPUT_DIR, 'stu_indirizzi_pulito.csv'))

# Statistiche calcolate nella fase precedente
df_stats = pd.read_csv(os.path.join(INPUT_DIR, 'statistiche_base.csv'))

# Converto i campi numerici in modo sicuro
for col in ['alunnimaschi', 'alunnifemmine']:
    if col in df_ind.columns:
        df_ind[col] = df_ind[col].map(to_int_safe)

# Calcolo il totale studenti se non presente
if 'totale' not in df_ind.columns:
    df_ind['totale'] = df_ind['alunnimaschi'] + df_ind['alunnifemmine']

# Normalizzo i nomi degli indirizzi per confronti consistenti
if 'indirizzo' in df_ind.columns:
    df_ind['indirizzo_norm'] = df_ind['indirizzo'].str.upper().str.strip()
else:
    raise ValueError('Colonna indirizzo mancante in stu_indirizzi_pulito.csv')

# ============================================================================
# FASE 1: GENERAZIONE CLASSI
# ============================================================================
"""
Genero le classi per ogni scuola basandomi sul numero di studenti
per indirizzo e anno di corso.
"""

print('Generazione classi...')

# Strutture dati per la generazione
classi_generate = []
class_counter_per_school = {}  # Contatore progressivo per ID univoci
lettere_classi = defaultdict(lambda: defaultdict(int))  # Per assegnare lettere alle classi
lettere_disponibili = [chr(i) for i in range(ord('A'), ord('Z') + 1)]

# Itero su ogni combinazione scuola-indirizzo-anno
for _, row in df_ind.iterrows():
    codice_scuola = row['codicescuola']
    indirizzo_norm = row['indirizzo_norm']
    indirizzo_orig = row['indirizzo']
    annocorso = to_int_safe(row['annocorso'])
    totale = to_int_safe(row['totale'])

    # Skip se non ci sono studenti
    if totale <= 0:
        continue

    # Recupero le statistiche della scuola
    stats_row = df_stats[df_stats['codicescuola'] == codice_scuola].head(1)
    if stats_row.empty:
        continue

    # Estraggo le percentuali per generare distribuzioni realistiche
    perc_maschi = float(stats_row['perc_maschi'].values[0])
    perc_femmine = float(stats_row['perc_femmine'].values[0])
    perc_italiani = float(stats_row['perc_italiani'].values[0])
    perc_stranieri = float(stats_row['perc_stranieri'].values[0])

    # Calcolo il numero di classi necessarie
    num_classi = math.ceil(totale / MEDIA_ALUNNI_PER_CLASSE)

    # Distribuisco gli studenti tra le classi in modo equilibrato
    studenti_per_classe = [totale // num_classi] * num_classi
    # Distribuisco gli studenti rimanenti
    for i in range(totale % num_classi):
        studenti_per_classe[i] += 1

    # Determino l'area geografica dalla provincia
    provincia = estrai_provincia_da_codice(codice_scuola)
    area_geografica = get_area_geografica(provincia)

    # Genero ogni classe
    for num_studenti in studenti_per_classe:
        # Incremento il contatore per ID univoco
        class_counter_per_school.setdefault(codice_scuola, 0)
        class_counter_per_school[codice_scuola] += 1

        # Assegno la lettera alla classe (1A, 1B, 2A, ecc.)
        lettere_classi[codice_scuola][annocorso] += 1
        idx = lettere_classi[codice_scuola][annocorso] - 1
        if idx >= len(lettere_disponibili):
            idx = idx % len(lettere_disponibili)
        nome_classe = f"{annocorso}{lettere_disponibili[idx]}"

        # Genero ID univoco per la classe
        id_classe = f"{codice_scuola}_{class_counter_per_school[codice_scuola]:04d}"

        # Calcolo la distribuzione di genere nella classe
        num_maschi = round(num_studenti * perc_maschi)
        num_femmine = num_studenti - num_maschi

        # Calcolo la distribuzione di cittadinanza
        num_italiani = round(num_studenti * perc_italiani)
        num_stranieri = num_studenti - num_italiani

        # Suddivido gli stranieri tra UE e non-UE (stima 30% UE, 70% non-UE)
        num_stranieri_ue = round(num_stranieri * 0.3)
        num_stranieri_non_ue = num_stranieri - num_stranieri_ue

        # Aggiungo la classe generata
        classi_generate.append({
            'id_classe': id_classe,
            'codicescuola': codice_scuola,
            'indirizzo': indirizzo_orig,
            'indirizzo_norm': indirizzo_norm,
            'annocorso': annocorso,
            'nome_classe': nome_classe,
            'num_studenti': num_studenti,
            'num_maschi': num_maschi,
            'num_femmine': num_femmine,
            'num_italiani': num_italiani,
            'num_stranieri': num_stranieri,
            'num_stranieri_ue': num_stranieri_ue,
            'num_stranieri_non_ue': num_stranieri_non_ue,
            'provincia': provincia,
            'area_geografica': area_geografica
        })

# Salvo le classi generate
df_classi = pd.DataFrame(classi_generate)
df_classi.to_csv(os.path.join(OUTPUT_DIR, 'classi.csv'), index=False)
print(f"Classi generate: {len(df_classi)}")

# ============================================================================
# FASE 2: GENERAZIONE STUDENTI
# ============================================================================
"""
Genero gli studenti per ogni classe rispettando le distribuzioni
di genere, cittadinanza e caratteristiche socio-economiche.
"""

print('Generazione studenti con fattori socio-demografici...')

studenti = []
studente_counter = 1

# Dizionario per memorizzare i dati socio-demografici per uso futuro
studenti_socio_demo = {}

# Genero studenti per ogni classe
for _, row in df_classi.iterrows():
    id_classe = row['id_classe']
    num_studenti = int(row['num_studenti'])
    num_maschi = int(row['num_maschi'])
    num_femmine = int(row['num_femmine'])
    num_italiani = int(row['num_italiani'])
    num_stranieri_ue = int(row['num_stranieri_ue'])
    num_stranieri_non_ue = int(row['num_stranieri_non_ue'])
    area_geografica = row['area_geografica']
    indirizzo_norm = row['indirizzo_norm']

    # Creo le liste di caratteristiche da assegnare
    sesso_lista = ['M'] * num_maschi + ['F'] * num_femmine
    citt_lista = ['ITA'] * num_italiani + ['UE'] * num_stranieri_ue + ['NON_UE'] * num_stranieri_non_ue

    # Gestisco eventuali discrepanze di arrotondamento
    while len(sesso_lista) < num_studenti:
        sesso_lista.append(random.choice(['M', 'F']))
    while len(citt_lista) < num_studenti:
        citt_lista.append(random.choice(['ITA', 'UE', 'NON_UE']))

    # Randomizzo per evitare raggruppamenti artificiali
    random.shuffle(sesso_lista)
    random.shuffle(citt_lista)

    # Genero ogni studente della classe
    for i in range(num_studenti):
        sesso = sesso_lista[i]
        citt = citt_lista[i]

        # Genero nome e cognome appropriati alla cittadinanza
        if citt == 'ITA':
            nome = faker.first_name_male() if sesso == 'M' else faker.first_name_female()
            cognome = faker.last_name()
        else:
            # Uso nomi stranieri comuni per maggiore realismo
            nomi_stranieri_m = ['Mohamed', 'Alexandru', 'Ahmed', 'Andrei', 'Carlos', 'Ivan', 'Youssef']
            nomi_stranieri_f = ['Fatima', 'Maria', 'Elena', 'Sara', 'Ana', 'Amina', 'Sofia']
            cognomi_stranieri = ['Singh', 'Kumar', 'Hassan', 'Ali', 'Rodriguez', 'Popescu', 'Ivanov']

            nome = random.choice(nomi_stranieri_m if sesso == 'M' else nomi_stranieri_f)
            cognome = random.choice(cognomi_stranieri)

        # Genero ID univoco studente
        id_studente = f"STU{studente_counter:06d}"
        studente_counter += 1

        # Genero il valore ESCS basato sui fattori socio-demografici
        escs = genera_escs_studente(area_geografica, indirizzo_norm, citt)
        escs_quartile = calcola_escs_quartile(escs)

        # Aggiungo lo studente
        studenti.append({
            'id_studente': id_studente,
            'id_classe': id_classe,
            'nome': nome,
            'cognome': cognome,
            'sesso': sesso,
            'cittadinanza': citt,
            'escs': round(escs, 3),
            'escs_quartile': escs_quartile
        })

        # Memorizzo i dati socio-demografici per l'uso nella generazione voti
        studenti_socio_demo[id_studente] = {
            'area_geografica': area_geografica,
            'tipo_scuola': indirizzo_norm,
            'cittadinanza': citt,
            'escs': escs,
            'escs_quartile': escs_quartile
        }

# Salvo gli studenti generati
df_studenti = pd.DataFrame(studenti)
df_studenti.to_csv(os.path.join(OUTPUT_DIR, 'studenti.csv'), index=False)
print(f"Studenti generati: {len(df_studenti)}")

# ============================================================================
# FASE 3: ASSEGNAZIONE MATERIE ALLE CLASSI
# ============================================================================
"""
Determino quali materie sono insegnate in ogni classe basandomi
sull'indirizzo di studio e l'anno di corso.
"""

print('Assegnazione materie alle classi...')


def materie_per_classe(indirizzo_norm: str, anno: int) -> List[str]:
    """
    Determino le materie per una classe basandomi su indirizzo e anno.

    Il curriculum varia tra biennio (1-2) e triennio (3-5) e per
    tipo di scuola.

    Args:
        indirizzo_norm (str): Tipo di scuola normalizzato
        anno (int): Anno di corso (1-5)

    Returns:
        List[str]: Lista delle materie per questa classe
    """
    # Recupero la configurazione per questo indirizzo
    indir_map = MATERIE_INDIRIZZO.get(indirizzo_norm, None)
    if indir_map is None:
        # Se non trovo l'indirizzo, uso materie di default
        return FALLBACK_MATERIE

    # Determino se siamo nel biennio o triennio
    biennio = anno in (1, 2)
    key = 'biennio' if biennio else 'triennio'

    # Prendo le materie base e quelle specifiche
    base = MATERIE_BASE_COMUNI_BIENNIO if biennio else MATERIE_BASE_COMUNI_TRIENNIO
    spec = indir_map.get(key, [])

    # Pulisco eventuali annotazioni nelle materie
    cleaned = [m.replace(' (Inizio 2 anno)', '') for m in spec]

    # Unisco base e specifiche evitando duplicati
    tutte = base + cleaned
    seen = set()
    res = []
    for m in tutte:
        up = m.upper()
        if up not in seen:
            seen.add(up)
            res.append(m)

    return res


# Genero il mapping classe -> materie
materie_classe = {}
for _, row in df_classi.iterrows():
    materie_classe[row['id_classe']] = materie_per_classe(
        row['indirizzo_norm'],
        int(row['annocorso'])
    )

# ============================================================================
# FASE 4: GENERAZIONE DOCENTI E ASSEGNAZIONI
# ============================================================================
"""
Genero i docenti e li assegno alle classi. Ogni docente insegna
una specifica materia in più classi (cattedra).
"""

print('Generazione docenti...')

docenti = []
assegnazioni = []
docente_counter = 1

# Creo una lista di tutte le combinazioni classe-materia da coprire
classe_materia_records = []
for id_classe, mats in materie_classe.items():
    for m in mats:
        classe_materia_records.append((id_classe, m))

# Stimo il numero di docenti necessari
total_cattedre_teoriche = len(classe_materia_records)
stima_docenti = max(1, round(total_cattedre_teoriche / MEDIA_CLASSI_PER_DOCENTE))

# Raggruppo le classi per materia per facilitare l'assegnazione
materia_to_classi = defaultdict(list)
for c, m in classe_materia_records:
    materia_to_classi[m.upper()].append(c)

# Genero docenti per ogni materia
for materia_up, classi_list in materia_to_classi.items():
    # Randomizzo l'ordine delle classi per distribuzioni casuali
    random.shuffle(classi_list)

    # Assegno gruppi di classi ai docenti
    start = 0
    while start < len(classi_list):
        # Ogni docente prende un numero variabile di classi
        span = random.randint(MIN_CLASSI_PER_DOCENTE, MAX_CLASSI_PER_DOCENTE)
        subset = classi_list[start:start + span]
        if not subset:
            break
        start += span

        # Genero il docente
        id_docente = f"DOC{docente_counter:05d}"
        docente_counter += 1
        nome = faker.first_name()
        cognome = faker.last_name()
        materia_norm = materia_up.title()  # Formato leggibile

        docenti.append({
            'id_docente': id_docente,
            'nome': nome,
            'cognome': cognome,
            'materia': materia_norm
        })

        # Creo le assegnazioni per questo docente
        for cid in subset:
            assegnazioni.append({
                'id_docente': id_docente,
                'id_classe': cid,
                'materia': materia_norm
            })

# Verifico la copertura: ogni classe-materia deve avere un docente
coverage = {(a['id_classe'], a['materia'].upper()) for a in assegnazioni}
missing = []
for c, m in classe_materia_records:
    if (c, m.upper()) not in coverage:
        missing.append((c, m))

# Genero docenti aggiuntivi per coprire eventuali mancanze
for c, m in missing:
    id_docente = f"DOC{docente_counter:05d}"
    docente_counter += 1
    nome = faker.first_name()
    cognome = faker.last_name()

    docenti.append({
        'id_docente': id_docente,
        'nome': nome,
        'cognome': cognome,
        'materia': m
    })

    assegnazioni.append({
        'id_docente': id_docente,
        'id_classe': c,
        'materia': m
    })

print(f"Docenti generati: {len(docenti)} (stima iniziale ≈ {stima_docenti})")

# Salvo docenti e assegnazioni
df_docenti = pd.DataFrame(docenti)
df_assegnazioni = pd.DataFrame(assegnazioni)

# Rimuovo eventuali duplicati nelle assegnazioni
if not df_assegnazioni.empty:
    df_assegnazioni = df_assegnazioni.drop_duplicates(subset=['id_docente', 'id_classe', 'materia'])

df_docenti.to_csv(os.path.join(OUTPUT_DIR, 'docenti.csv'), index=False)
df_assegnazioni.to_csv(os.path.join(OUTPUT_DIR, 'assegnazioni_docenti.csv'), index=False)
print(f"Assegnazioni create: {len(df_assegnazioni)}")

# ============================================================================
# FASE 5: GENERAZIONE VOTI
# ============================================================================
"""
Genero i voti degli studenti considerando molteplici fattori:
- Abilità individuale dello studente
- Difficoltà della materia
- Fattori socio-demografici (ESCS, area geografica, cittadinanza)
- Effetto classe e docente
- Tipologia di valutazione (scritto/orale/pratico)
"""

print('Generazione voti con integrazione fattori socio-demografici...')

# Configurazione temporale per le date dei voti
DATA_INIZIO = datetime.date(2023, 9, 15)  # Inizio anno scolastico
DATA_FINE = datetime.date(2024, 5, 31)  # Fine anno scolastico
DELTA_GIORNI = (DATA_FINE - DATA_INIZIO).days

# Preparo le strutture dati per l'accesso efficiente
assegnazioni_per_classe = defaultdict(list)
for _, r in df_assegnazioni.iterrows():
    assegnazioni_per_classe[r['id_classe']].append((r['id_docente'], r['materia']))

voti_records = []
voto_counter = 1


# ============================================================================
# FUNZIONI PER LA GENERAZIONE DEI VOTI
# ============================================================================
def tronca(v, lo, hi):
    """
    Limito un valore tra un minimo e un massimo.

    Args:
        v: Valore da limitare
        lo: Limite inferiore
        hi: Limite superiore

    Returns:
        Valore limitato nell'intervallo [lo, hi]
    """
    return max(lo, min(hi, v))


# Genero abilità casuali per ogni studente (distribuzione normale)
abilita_studente = {}
for sid in df_studenti['id_studente']:
    # Ogni studente ha un'abilità generale che influenza tutti i voti
    abilita_studente[sid] = tronca(random.gauss(0, 0.6), -1.2, 1.2)

# Dizionario per memorizzare le specificità studente-materia
spec_studente_materia = {}

# Genero offset casuali per ogni combinazione classe-materia
# Questo simula l'effetto del docente e delle dinamiche di classe
offset_classe_materia = {}
for cid, mats in materie_classe.items():
    for m in mats:
        offset_classe_materia[(cid, m.upper())] = tronca(random.gauss(0, 0.4), -0.9, 0.9)


def calcola_socio_demografico(id_studente: str) -> float:
    """
    Calcolo l'impatto complessivo dei fattori socio-demografici sul rendimento.

    Combino gli effetti di:
    - Area geografica (nord/sud)
    - Tipo di scuola (liceo/tecnico/professionale)
    - Cittadinanza (italiana/straniera)
    - Quartile ESCS (status socio-economico)

    Args:
        id_studente (str): ID dello studente

    Returns:
        float: Impatto totale sul voto (-2 a +2 circa)
    """
    # Recupero i dati socio-demografici dello studente
    dati = studenti_socio_demo.get(id_studente, {})

    # Calcolo i singoli impatti
    geo_impact = GEOGRAFIA_IMPACT.get(dati.get('area_geografica', 'CENTRO'), 0.0)
    tipo_impact = TIPO_SCUOLA_IMPACT.get(dati.get('tipo_scuola', ''), 0.0)
    citt_impact = CITTADINANZA_IMPACT.get(dati.get('cittadinanza', 'ITA'), 0.0)
    escs_quartile = dati.get('escs_quartile', 2)
    escs_impact = ESCS_QUARTILE_IMPACT.get(escs_quartile, 0.0)

    # Combino gli impatti con pesi uguali
    # Potrei modificare i pesi per dare più importanza a certi fattori
    return geo_impact * 0.25 + tipo_impact * 0.25 + citt_impact * 0.25 + escs_impact * 0.25


def voto_generato(id_studente, id_classe, materia, tipologia):
    """
    Genero un voto realistico considerando tutti i fattori.

    Il modello considera:
    - Base media generale (6.5)
    - Difficoltà intrinseca della materia
    - Effetto classe/docente
    - Abilità generale dello studente
    - Specificità studente-materia (bravo/scarso in quella materia)
    - Tipologia di valutazione (scritto/orale/pratico)
    - Fattori socio-demografici
    - Rumore casuale

    Args:
        id_studente (str): ID dello studente
        id_classe (str): ID della classe
        materia (str): Nome della materia
        tipologia (str): Tipo di voto ('scritto', 'orale', 'pratico')

    Returns:
        int: Voto da 1 a 10
    """
    m_up = materia.upper()

    # Componenti del voto
    base = BASE_MEDIA  # 6.5
    diff = MATERIA_DIFFICOLTA[m_up]  # Difficoltà della materia
    cls_off = offset_classe_materia.get((id_classe, m_up), 0.0)  # Effetto classe
    stud = abilita_studente.get(id_studente, 0.0)  # Abilità generale studente

    # Genero o recupero la specificità studente-materia
    key_spec = (id_studente, m_up)
    if key_spec not in spec_studente_materia:
        # Ogni studente può essere particolarmente bravo o scarso in una materia
        spec_studente_materia[key_spec] = tronca(random.gauss(0, 0.3), -0.7, 0.7)
    spec = spec_studente_materia[key_spec]

    # Aggiustamento per tipologia
    tip_adj = tipologia_delta(materia, tipologia)

    # Impatto socio-demografico
    socio_demografico = calcola_socio_demografico(id_studente)

    # Rumore casuale per variabilità
    noise = random.gauss(0, 0.7)

    # Calcolo il voto finale sommando tutti i contributi
    val = base + diff + cls_off + stud + spec + tip_adj + socio_demografico + noise

    # Applico un "soft floor" a 3 per evitare troppi voti molto bassi
    if val < 3 and random.random() < 0.6:
        val = 3 + random.random() * 1.0

        # Limito al range valido e arrotondo
    val = max(PESO_MIN_VOTO, min(PESO_MAX_VOTO, val))
    return int(round(val))


def scegli_tipologie(materia: str, n: int) -> List[str]:
    """
    Scelgo quali tipologie di voto assegnare per una materia.

    La selezione si basa sui pesi specifici della materia
    (es. Matematica ha più scritti, Ed. Fisica più pratici).

    Args:
        materia (str): Nome della materia
        n (int): Numero di tipologie da scegliere

    Returns:
        List[str]: Lista delle tipologie selezionate
    """
    # Recupero i pesi per questa materia
    pesi = TIPOLOGIA_PESI.get(materia.upper(), TIPOLOGIE_DEFAULT)

    # Ordino per peso decrescente
    sorted_pesi = sorted(pesi.items(), key=lambda x: x[1], reverse=True)

    # Scelgo le tipologie più rilevanti
    if n >= 3:
        return ['scritto', 'orale', 'pratico']
    if n == 2:
        return [sorted_pesi[0][0], sorted_pesi[1][0]]
    return [sorted_pesi[0][0]]


def data_random():
    """
    Genero una data casuale nell'anno scolastico.

    Returns:
        str: Data in formato ISO (YYYY-MM-DD)
    """
    g = random.randint(0, DELTA_GIORNI)
    return (DATA_INIZIO + datetime.timedelta(days=g)).isoformat()


# ============================================================================
# GENERAZIONE EFFETTIVA DEI VOTI
# ============================================================================
"""
Per ogni studente, genero voti in tutte le materie della sua classe.
Il numero e tipo di voti varia per materia.
"""

for _, stud in df_studenti.iterrows():
    id_stu = stud['id_studente']
    cid = stud['id_classe']

    # Recupero le assegnazioni docenti per questa classe
    assegn = assegnazioni_per_classe.get(cid, [])

    # Per ogni materia nella classe
    for id_docente, materia in assegn:
        # Decido quanti voti generare (1-3, tipicamente 2)
        n_voti = random.choice([1, 2, 3])

        # Scelgo le tipologie appropriate per questa materia
        tipologie = scegli_tipologie(materia, n_voti)
        random.shuffle(tipologie)

        # Genero ogni voto
        for t in tipologie:
            id_voto = f"VOT{voto_counter:07d}"
            voto_counter += 1

            voti_records.append({
                'id_voto': id_voto,
                'id_studente': id_stu,
                'id_docente': id_docente,
                'materia': materia,
                'voto': voto_generato(id_stu, cid, materia, t),
                'tipologia': t,
                'data': data_random()
            })

# ============================================================================
# ANALISI DELL'IMPATTO DEI FATTORI SOCIO-DEMOGRAFICI
# ============================================================================
"""
Verifico che i fattori socio-demografici abbiano l'effetto atteso
stampando statistiche aggregate.
"""

print('Statistiche voti con fattori socio-demografici...')
if voti_records:
    # Creo un DataFrame temporaneo per l'analisi
    temp_df = pd.DataFrame(voti_records)

    # Aggiungo i dati degli studenti per l'analisi
    temp_df = temp_df.merge(df_studenti[['id_studente', 'cittadinanza', 'escs_quartile']], on='id_studente')

    # Media voti per cittadinanza
    print('\nMedia voti per cittadinanza:')
    print(temp_df.groupby('cittadinanza')['voto'].mean().round(2))

    # Media voti per quartile ESCS
    print('\nMedia voti per quartile ESCS:')
    print(temp_df.groupby('escs_quartile')['voto'].mean().round(2))

    # Aggiungo area geografica per l'analisi
    temp_df = temp_df.merge(df_studenti[['id_studente', 'id_classe']], on='id_studente')
    temp_df = temp_df.merge(df_classi[['id_classe', 'area_geografica']], on='id_classe')

    # Media voti per area geografica
    print('\nMedia voti per area geografica:')
    print(temp_df.groupby('area_geografica')['voto'].mean().round(2))

# Salvo i voti generati
print('Salvataggio voti...')
df_voti = pd.DataFrame(voti_records)
df_voti.to_csv(os.path.join(OUTPUT_DIR, 'voti.csv'), index=False)
print(f"Voti generati: {len(df_voti)}")

# ============================================================================
# STATISTICHE FINALI E COPIE FILE
# ============================================================================
"""
Stampo statistiche riassuntive e copio i file necessari nella
directory di output per avere tutto in un unico posto.
"""

print('\n=== STATISTICHE FINALI ===')
print(f'Totale studenti: {len(df_studenti)}')

# Statistiche cittadinanza
ita_count = len(df_studenti[df_studenti.cittadinanza == "ITA"])
ue_count = len(df_studenti[df_studenti.cittadinanza == "UE"])
non_ue_count = len(df_studenti[df_studenti.cittadinanza == "NON_UE"])

print(f'- Italiani: {ita_count} ({ita_count / len(df_studenti) * 100:.1f}%)')
print(f'- Stranieri UE: {ue_count} ({ue_count / len(df_studenti) * 100:.1f}%)')
print(f'- Stranieri non-UE: {non_ue_count} ({non_ue_count / len(df_studenti) * 100:.1f}%)')

# Distribuzione ESCS
print('\nDistribuzione ESCS:')
for q in range(1, 5):
    count = len(df_studenti[df_studenti.escs_quartile == q])
    print(f'- Quartile {q}: {count} studenti ({count / len(df_studenti) * 100:.1f}%)')

# Copio l'anagrafica nella directory di output per completezza
shutil.copy2(
    os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'),
    os.path.join(OUTPUT_DIR, 'anagrafica.csv')
)
print('Copia anagrafica completata.')

print('\n✅ Pipeline completata con integrazione fattori socio-demografici.')

# ============================================================================
# NOTE FINALI
# ============================================================================
"""
Il dataset generato include:
1. anagrafica.csv - Dati delle scuole
2. classi.csv - Classi generate con metadati
3. studenti.csv - Studenti con caratteristiche socio-demografiche
4. docenti.csv - Docenti generati
5. assegnazioni_docenti.csv - Mapping docenti-classi-materie
6. voti.csv - Voti con influenze realistiche

I voti sono influenzati da:
- Fattori geografici (nord/sud)
- Tipo di scuola (liceo/tecnico/professionale)
- Background socio-economico (ESCS)
- Cittadinanza
- Difficoltà delle materie
- Variabilità individuale

Questo produce un dataset realistico che riflette le disparità
educative osservate nel sistema scolastico italiano.
"""

if __name__ == '__main__':
    pass
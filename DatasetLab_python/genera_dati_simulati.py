# -*- coding: utf-8 -*-
"""
Generatore di dataset scolastici con integrazione di fattori socio-demografici
basati su dati ISTAT e MIUR.

Versione: 2.0
Autore: Sistema integrato con ricerca bibliografica
Data: Gennaio 2025
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

# -----------------------------
# CONFIGURAZIONE
# -----------------------------
SEED = 42  # Imposta a None per non fissare il seed
MEDIA_ALUNNI_PER_CLASSE = 22
MEDIA_CLASSI_PER_DOCENTE = 4  # target medio
MIN_CLASSI_PER_DOCENTE = 3
MAX_CLASSI_PER_DOCENTE = 6
PESO_MIN_VOTO = 1  # limite inferiore ammesso
PESO_MAX_VOTO = 10
SOFT_FLOOR_VOTO = 3  # al di sotto si rialza probabilmente ma non bloccante

# Nuovi parametri socio-demografici basati su dati ISTAT/MIUR
ESCS_MIN = -2.86
ESCS_MAX = 1.78
ESCS_SOGLIA_BASSO = -0.35

# Impatto geografico basato su INVALSI 2024 (normalizzato per scala 1-10)
GEOGRAFIA_IMPACT = {
    'NORD-OVEST': 0.5,  # Lombardia, Piemonte, Liguria, Valle d'Aosta
    'NORD-EST': 0.6,  # Veneto, Trentino-Alto Adige, Friuli-Venezia Giulia, Emilia-Romagna
    'CENTRO': 0.2,  # Toscana, Umbria, Marche, Lazio
    'SUD': -0.4,  # Abruzzo, Molise, Campania, Puglia, Basilicata, Calabria
    'ISOLE': -0.5  # Sicilia, Sardegna
}

# Mapping province -> area geografica (semplificato)
PROVINCE_TO_AREA = {
    # Nord-Ovest
    'MI': 'NORD-OVEST', 'TO': 'NORD-OVEST', 'GE': 'NORD-OVEST', 'AO': 'NORD-OVEST',
    'VA': 'NORD-OVEST', 'CO': 'NORD-OVEST', 'SO': 'NORD-OVEST', 'NO': 'NORD-OVEST',
    'VB': 'NORD-OVEST', 'LC': 'NORD-OVEST', 'BI': 'NORD-OVEST', 'MB': 'NORD-OVEST',
    'LO': 'NORD-OVEST', 'PV': 'NORD-OVEST', 'CR': 'NORD-OVEST', 'MN': 'NORD-OVEST',
    'BS': 'NORD-OVEST', 'BG': 'NORD-OVEST', 'SP': 'NORD-OVEST', 'IM': 'NORD-OVEST',
    'SV': 'NORD-OVEST', 'AL': 'NORD-OVEST', 'AT': 'NORD-OVEST', 'CN': 'NORD-OVEST',
    'VC': 'NORD-OVEST',
    # Nord-Est
    'VE': 'NORD-EST', 'TV': 'NORD-EST', 'RO': 'NORD-EST', 'PD': 'NORD-EST',
    'VI': 'NORD-EST', 'VR': 'NORD-EST', 'BL': 'NORD-EST', 'TN': 'NORD-EST',
    'BZ': 'NORD-EST', 'TS': 'NORD-EST', 'UD': 'NORD-EST', 'GO': 'NORD-EST',
    'PN': 'NORD-EST', 'BO': 'NORD-EST', 'MO': 'NORD-EST', 'RE': 'NORD-EST',
    'PR': 'NORD-EST', 'FE': 'NORD-EST', 'RA': 'NORD-EST', 'FC': 'NORD-EST',
    'PC': 'NORD-EST', 'RN': 'NORD-EST',
    # Centro
    'FI': 'CENTRO', 'AR': 'CENTRO', 'SI': 'CENTRO', 'GR': 'CENTRO', 'PI': 'CENTRO',
    'LI': 'CENTRO', 'LU': 'CENTRO', 'PT': 'CENTRO', 'PO': 'CENTRO', 'MS': 'CENTRO',
    'PG': 'CENTRO', 'TR': 'CENTRO', 'AN': 'CENTRO', 'MC': 'CENTRO', 'PU': 'CENTRO',
    'AP': 'CENTRO', 'FM': 'CENTRO', 'RM': 'CENTRO', 'VT': 'CENTRO', 'RI': 'CENTRO',
    'LT': 'CENTRO', 'FR': 'CENTRO',
    # Sud
    'AQ': 'SUD', 'TE': 'SUD', 'PE': 'SUD', 'CH': 'SUD', 'CB': 'SUD', 'IS': 'SUD',
    'CE': 'SUD', 'BN': 'SUD', 'NA': 'SUD', 'AV': 'SUD', 'SA': 'SUD', 'FG': 'SUD',
    'BA': 'SUD', 'TA': 'SUD', 'BR': 'SUD', 'LE': 'SUD', 'BT': 'SUD', 'PZ': 'SUD',
    'MT': 'SUD', 'CS': 'SUD', 'CZ': 'SUD', 'RC': 'SUD', 'KR': 'SUD', 'VV': 'SUD',
    # Isole
    'PA': 'ISOLE', 'CT': 'ISOLE', 'ME': 'ISOLE', 'AG': 'ISOLE', 'CL': 'ISOLE',
    'EN': 'ISOLE', 'TP': 'ISOLE', 'RG': 'ISOLE', 'SR': 'ISOLE', 'SS': 'ISOLE',
    'NU': 'ISOLE', 'CA': 'ISOLE', 'OR': 'ISOLE', 'OT': 'ISOLE', 'OG': 'ISOLE',
    'VS': 'ISOLE', 'CI': 'ISOLE', 'SU': 'ISOLE'
}

# Impatto tipo scuola basato su dati maturità
TIPO_SCUOLA_IMPACT = {
    'LICEO SCIENTIFICO': 0.8,
    'LICEO CLASSICO': 0.9,
    'LICEO LINGUISTICO': 0.5,
    'LICEO ARTISTICO': 0.3,
    'ISTITUTO TECNICO INDUSTRIALE': -0.2,
    'ISTITUTO TECNICO COMMERCIALE': -0.2,
    'ISTITUTO PROFESSIONALE': -0.6
}

# Impatto cittadinanza basato su dati INVALSI/ISTAT
CITTADINANZA_IMPACT = {
    'ITA': 0.0,
    'UE': -0.3,  # Studenti UE
    'NON_UE': -0.6  # Studenti extra-UE
}

# Impatto ESCS per quartile
ESCS_QUARTILE_IMPACT = {
    1: -0.8,  # Basso
    2: -0.3,  # Medio-basso
    3: 0.3,  # Medio-alto
    4: 0.8  # Alto
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_puliti')
OUTPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_definitivi')
os.makedirs(OUTPUT_DIR, exist_ok=True)

if SEED is not None:
    random.seed(SEED)
    np.random.seed(SEED)

faker = Faker('it_IT')
if SEED is not None:
    Faker.seed(SEED)


# -----------------------------
# UTILS
# -----------------------------

def to_int_safe(x):
    """Converte in intero in modo sicuro."""
    try:
        return int(x)
    except:
        return 0


def calcola_escs_quartile(escs: float) -> int:
    """
    Calcola il quartile ESCS basato sul valore.

    Args:
        escs: valore ESCS

    Returns:
        quartile (1-4)
    """
    # Normalizza in percentile 0-100
    percentile = (escs - ESCS_MIN) / (ESCS_MAX - ESCS_MIN) * 100

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
    Genera un valore ESCS realistico basato sui fattori socio-demografici.

    Args:
        area_geografica: macro-area geografica
        tipo_scuola: tipo di indirizzo scolastico
        cittadinanza: ITA/UE/NON_UE

    Returns:
        valore ESCS
    """
    # Base ESCS con distribuzione normale
    base_escs = np.random.normal(0, 1)

    # Aggiustamenti basati sui fattori
    if area_geografica in ['NORD-OVEST', 'NORD-EST']:
        base_escs += 0.4
    elif area_geografica in ['SUD', 'ISOLE']:
        base_escs -= 0.5

    if 'LICEO' in tipo_scuola:
        base_escs += 0.3
    elif 'PROFESSIONALE' in tipo_scuola:
        base_escs -= 0.4

    if cittadinanza == 'NON_UE':
        base_escs -= 0.6
    elif cittadinanza == 'UE':
        base_escs -= 0.2

    # Limita nei range validi
    return np.clip(base_escs, ESCS_MIN, ESCS_MAX)


def estrai_provincia_da_codice(codice_scuola: str) -> str:
    """
    Estrae la provincia dal codice scuola (primi 2 caratteri).

    Args:
        codice_scuola: codice meccanografico della scuola

    Returns:
        sigla provincia
    """
    if len(codice_scuola) >= 2:
        return codice_scuola[:2].upper()
    return 'RM'  # Default Roma


def get_area_geografica(provincia: str) -> str:
    """
    Ottiene l'area geografica dalla provincia.

    Args:
        provincia: sigla provincia

    Returns:
        area geografica
    """
    return PROVINCE_TO_AREA.get(provincia, 'CENTRO')


# Distribuzione tipologie per materia
TIPOLOGIA_PESI = {
    'ITALIANO': {'scritto': 0.45, 'orale': 0.45, 'pratico': 0.10},
    'MATEMATICA': {'scritto': 0.55, 'orale': 0.35, 'pratico': 0.10},
    'FISICA': {'scritto': 0.40, 'orale': 0.30, 'pratico': 0.30},
    'INFORMATICA': {'pratico': 0.55, 'scritto': 0.25, 'orale': 0.20},
    'SCIENZE MOTORIE E SPORTIVE': {'pratico': 0.70, 'orale': 0.20, 'scritto': 0.10},
    'SCIENZE MOTORIE': {'pratico': 0.70, 'orale': 0.20, 'scritto': 0.10},
    'EDUCAZIONE FISICA': {'pratico': 0.70, 'orale': 0.20, 'scritto': 0.10},
}

TIPOLOGIE_DEFAULT = {'scritto': 0.34, 'orale': 0.33, 'pratico': 0.33}
TIPOLOGIE_ORDINE = ['scritto', 'orale', 'pratico']

# Materie per indirizzo e anno
MATERIE_BASE_COMUNI_BIENNIO = [
    'Italiano', 'Matematica', 'Inglese', 'Storia', 'Geografia', 'Scienze', 'Scienze Motorie', 'Educazione Civica'
]
MATERIE_BASE_COMUNI_TRIENNIO = [
    'Italiano', 'Matematica', 'Inglese', 'Storia', 'Scienze Motorie', 'Educazione Civica'
]

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

FALLBACK_MATERIE = [
    'Italiano', 'Matematica', 'Inglese', 'Storia', 'Scienze', 'Scienze Motorie', 'Educazione Civica'
]

BASE_MEDIA = 6.5

MATERIA_DIFFICOLTA = defaultdict(lambda: 0.0, {
    'MATEMATICA': -1.0,
    'FISICA': -0.9,
    'INFORMATICA': -0.4,
    'TPSIT': -0.5,
    'SISTEMI E RETI': -0.6,
    'TELECOMUNICAZIONI': -0.5,
    'LATINO': -0.6,
    'GRECO': -0.9,
    'FILOSOFIA': -0.3,
    'DISEGNO TECNICO': -0.2,
    'DISEGNO': -0.1,
    'SCIENZE NATURALI': -0.2,
    'ECONOMIA AZIENDALE': -0.3,
    'DIRITTO': -0.1,
    'RELAZIONI INTERNAZIONALI': -0.2,
    'STORIA': -0.2,
    'GEOGRAFIA': 0.1,
    'INGLESE': 0.0,
    'SPAGNOLO': 0.2,
    'FRANCESE': 0.2,
    'ITALIANO': -0.1,
    'STORIA DELL\'ARTE': 0.3,
    'DISCIPLINE PITTORICHE': 0.3,
    'DISCIPLINE PLASTICHE': 0.3,
    'LABORATORIO': 0.4,
    'TECNOLOGIA': 0.0,
    'SCIENZE': 0.0,
    'SCIENZE MOTORIE': 0.7,
    'SCIENZE MOTORIE E SPORTIVE': 0.7,
    'EDUCAZIONE FISICA': 0.7,
    'EDUCAZIONE CIVICA': 0.4,
})


def categoria_materia(m):
    m_up = m.upper()
    if m_up in {'MATEMATICA', 'FISICA', 'LATINO', 'GRECO', 'SISTEMI E RETI', 'TPSIT', 'TELECOMUNICAZIONI'}:
        return 'HARD'
    if m_up in {'ITALIANO', 'FILOSOFIA', 'STORIA', 'GEOGRAFIA', 'INGLESE', 'SPAGNOLO', 'FRANCESE', 'RELIGIONE'}:
        return 'UMANISTICA'
    if any(k in m_up for k in ['LABORATORIO', 'DISCIPLINE', 'INFORMATICA', 'TECNOLOGIA', 'PLASTIC', 'PITTOR', 'MOTORIE',
                               'EDUCAZIONE FISICA', 'SCIENZE', 'TELECOMUNICAZIONI', 'TPSIT']):
        return 'LAB'
    return 'DEFAULT'


TIPOLOGIA_ADJUST = {
    'scritto': {'HARD': -0.2, 'UMANISTICA': -0.05, 'LAB': -0.05, 'DEFAULT': -0.1},
    'orale': {'HARD': 0.0, 'UMANISTICA': 0.15, 'LAB': 0.05, 'DEFAULT': 0.05},
    'pratico': {'HARD': 0.0, 'UMANISTICA': 0.05, 'LAB': 0.4, 'DEFAULT': 0.1},
}


def tipologia_delta(materia, tipologia):
    cat = categoria_materia(materia)
    return TIPOLOGIA_ADJUST.get(tipologia, {}).get(cat, 0.0)


# -----------------------------
# CARICAMENTO FILE INPUT
# -----------------------------
print('Caricamento CSV di input...')
df_anag = pd.read_csv(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'))
df_ind = pd.read_csv(os.path.join(INPUT_DIR, 'stu_indirizzi_pulito.csv'))
df_stats = pd.read_csv(os.path.join(INPUT_DIR, 'statistiche_base.csv'))

for col in ['alunnimaschi', 'alunnifemmine']:
    if col in df_ind.columns:
        df_ind[col] = df_ind[col].map(to_int_safe)

if 'totale' not in df_ind.columns:
    df_ind['totale'] = df_ind['alunnimaschi'] + df_ind['alunnifemmine']

# Normalizza indirizzo
if 'indirizzo' in df_ind.columns:
    df_ind['indirizzo_norm'] = df_ind['indirizzo'].str.upper().str.strip()
else:
    raise ValueError('Colonna indirizzo mancante in stu_indirizzi_pulito.csv')

# -----------------------------
# GENERAZIONE CLASSI
# -----------------------------
print('Generazione classi...')
classi_generate = []
class_counter_per_school = {}
lettere_classi = defaultdict(lambda: defaultdict(int))
lettere_disponibili = [chr(i) for i in range(ord('A'), ord('Z') + 1)]

for _, row in df_ind.iterrows():
    codice_scuola = row['codicescuola']
    indirizzo_norm = row['indirizzo_norm']
    indirizzo_orig = row['indirizzo']
    annocorso = to_int_safe(row['annocorso'])
    totale = to_int_safe(row['totale'])
    if totale <= 0:
        continue

    stats_row = df_stats[df_stats['codicescuola'] == codice_scuola].head(1)
    if stats_row.empty:
        continue
    perc_maschi = float(stats_row['perc_maschi'].values[0])
    perc_femmine = float(stats_row['perc_femmine'].values[0])
    perc_italiani = float(stats_row['perc_italiani'].values[0])
    perc_stranieri = float(stats_row['perc_stranieri'].values[0])

    num_classi = math.ceil(totale / MEDIA_ALUNNI_PER_CLASSE)

    studenti_per_classe = [totale // num_classi] * num_classi
    for i in range(totale % num_classi):
        studenti_per_classe[i] += 1

    # Estrai area geografica
    provincia = estrai_provincia_da_codice(codice_scuola)
    area_geografica = get_area_geografica(provincia)

    for num_studenti in studenti_per_classe:
        class_counter_per_school.setdefault(codice_scuola, 0)
        class_counter_per_school[codice_scuola] += 1
        lettere_classi[codice_scuola][annocorso] += 1
        idx = lettere_classi[codice_scuola][annocorso] - 1
        if idx >= len(lettere_disponibili):
            idx = idx % len(lettere_disponibili)
        nome_classe = f"{annocorso}{lettere_disponibili[idx]}"
        id_classe = f"{codice_scuola}_{class_counter_per_school[codice_scuola]:04d}"

        num_maschi = round(num_studenti * perc_maschi)
        num_femmine = num_studenti - num_maschi
        num_italiani = round(num_studenti * perc_italiani)
        num_stranieri = num_studenti - num_italiani

        # Distribuisci stranieri tra UE e extra-UE (30% UE, 70% extra-UE basato su dati ISTAT)
        num_stranieri_ue = round(num_stranieri * 0.3)
        num_stranieri_non_ue = num_stranieri - num_stranieri_ue

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

df_classi = pd.DataFrame(classi_generate)
df_classi.to_csv(os.path.join(OUTPUT_DIR, 'classi.csv'), index=False)
print(f"Classi generate: {len(df_classi)}")

# -----------------------------
# GENERAZIONE STUDENTI
# -----------------------------
print('Generazione studenti con fattori socio-demografici...')
studenti = []
studente_counter = 1

# Dizionario per memorizzare ESCS e fattori socio-demografici per ogni studente
studenti_socio_demo = {}

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

    sesso_lista = ['M'] * num_maschi + ['F'] * num_femmine
    citt_lista = ['ITA'] * num_italiani + ['UE'] * num_stranieri_ue + ['NON_UE'] * num_stranieri_non_ue

    while len(sesso_lista) < num_studenti:
        sesso_lista.append(random.choice(['M', 'F']))
    while len(citt_lista) < num_studenti:
        citt_lista.append(random.choice(['ITA', 'UE', 'NON_UE']))

    random.shuffle(sesso_lista)
    random.shuffle(citt_lista)

    for i in range(num_studenti):
        sesso = sesso_lista[i]
        citt = citt_lista[i]

        # Genera nome appropriato per cittadinanza
        if citt == 'ITA':
            nome = faker.first_name_male() if sesso == 'M' else faker.first_name_female()
            cognome = faker.last_name()
        else:
            # Nomi stranieri comuni
            nomi_stranieri_m = ['Mohamed', 'Alexandru', 'Ahmed', 'Andrei', 'Carlos', 'Ivan', 'Youssef']
            nomi_stranieri_f = ['Fatima', 'Maria', 'Elena', 'Sara', 'Ana', 'Amina', 'Sofia']
            cognomi_stranieri = ['Singh', 'Kumar', 'Hassan', 'Ali', 'Rodriguez', 'Popescu', 'Ivanov']

            nome = random.choice(nomi_stranieri_m if sesso == 'M' else nomi_stranieri_f)
            cognome = random.choice(cognomi_stranieri)

        id_studente = f"STU{studente_counter:06d}"
        studente_counter += 1

        # Genera ESCS per lo studente
        escs = genera_escs_studente(area_geografica, indirizzo_norm, citt)
        escs_quartile = calcola_escs_quartile(escs)

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

        # Memorizza dati socio-demografici
        studenti_socio_demo[id_studente] = {
            'area_geografica': area_geografica,
            'tipo_scuola': indirizzo_norm,
            'cittadinanza': citt,
            'escs': escs,
            'escs_quartile': escs_quartile
        }

df_studenti = pd.DataFrame(studenti)
df_studenti.to_csv(os.path.join(OUTPUT_DIR, 'studenti.csv'), index=False)
print(f"Studenti generati: {len(df_studenti)}")

# -----------------------------
# DEFINIZIONE MATERIE PER CLASSE
# -----------------------------
print('Assegnazione materie alle classi...')


def materie_per_classe(indirizzo_norm: str, anno: int) -> List[str]:
    """Determina le materie per una classe basandosi su indirizzo e anno."""
    indir_map = MATERIE_INDIRIZZO.get(indirizzo_norm, None)
    if indir_map is None:
        return FALLBACK_MATERIE
    biennio = anno in (1, 2)
    key = 'biennio' if biennio else 'triennio'
    base = MATERIE_BASE_COMUNI_BIENNIO if biennio else MATERIE_BASE_COMUNI_TRIENNIO
    spec = indir_map.get(key, [])
    # Pulizia nomi provvisori
    cleaned = [m.replace(' (Inizio 2 anno)', '') for m in spec]
    tutte = base + cleaned
    # Rimuove duplicati mantenendo ordine
    seen = set()
    res = []
    for m in tutte:
        up = m.upper()
        if up not in seen:
            seen.add(up)
            res.append(m)
    return res


# Build mapping class -> materie
materie_classe = {}
for _, row in df_classi.iterrows():
    materie_classe[row['id_classe']] = materie_per_classe(row['indirizzo_norm'], int(row['annocorso']))

# -----------------------------
# GENERAZIONE DOCENTI E ASSEGNAZIONI
# -----------------------------
print('Generazione docenti...')

docenti = []
assegnazioni = []
docente_counter = 1

# Per ottimizzare la distribuzione: raccogli tutte le (classe, materia)
classe_materia_records = []
for id_classe, mats in materie_classe.items():
    for m in mats:
        classe_materia_records.append((id_classe, m))

total_cattedre_teoriche = len(classe_materia_records)
# Stima docenti
stima_docenti = max(1, round(total_cattedre_teoriche / MEDIA_CLASSI_PER_DOCENTE))

# Strategia: per ogni materia globale raccogli le classi che la hanno
materia_to_classi = defaultdict(list)
for c, m in classe_materia_records:
    materia_to_classi[m.upper()].append(c)

for materia_up, classi_list in materia_to_classi.items():
    # chunk delle classi per quella materia
    random.shuffle(classi_list)
    start = 0
    while start < len(classi_list):
        span = random.randint(MIN_CLASSI_PER_DOCENTE, MAX_CLASSI_PER_DOCENTE)
        subset = classi_list[start:start + span]
        if not subset:
            break
        start += span
        id_docente = f"DOC{docente_counter:05d}"
        docente_counter += 1
        nome = faker.first_name()
        cognome = faker.last_name()
        materia_norm = materia_up.title()
        docenti.append({
            'id_docente': id_docente,
            'nome': nome,
            'cognome': cognome,
            'materia': materia_norm
        })
        for cid in subset:
            assegnazioni.append({
                'id_docente': id_docente,
                'id_classe': cid,
                'materia': materia_norm
            })

# Verifica copertura
coverage = {(a['id_classe'], a['materia'].upper()) for a in assegnazioni}
missing = []
for c, m in classe_materia_records:
    if (c, m.upper()) not in coverage:
        missing.append((c, m))

# Ripara eventuali missing
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

df_docenti = pd.DataFrame(docenti)
df_assegnazioni = pd.DataFrame(assegnazioni)

# Normalizza eventuali duplicati
if not df_assegnazioni.empty:
    df_assegnazioni = df_assegnazioni.drop_duplicates(subset=['id_docente', 'id_classe', 'materia'])

df_docenti.to_csv(os.path.join(OUTPUT_DIR, 'docenti.csv'), index=False)
df_assegnazioni.to_csv(os.path.join(OUTPUT_DIR, 'assegnazioni_docenti.csv'), index=False)
print(f"Assegnazioni create: {len(df_assegnazioni)}")

# -----------------------------
# GENERAZIONE VOTI CON FATTORI SOCIO-DEMOGRAFICI
# -----------------------------
print('Generazione voti con integrazione fattori socio-demografici...')

DATA_INIZIO = datetime.date(2023, 9, 15)
DATA_FINE = datetime.date(2024, 5, 31)
DELTA_GIORNI = (DATA_FINE - DATA_INIZIO).days

# Pre-indicizza assegnazioni
assegnazioni_per_classe = defaultdict(list)
for _, r in df_assegnazioni.iterrows():
    assegnazioni_per_classe[r['id_classe']].append((r['id_docente'], r['materia']))

voti_records = []
voto_counter = 1


# Profili di abilità
def tronca(v, lo, hi):
    return max(lo, min(hi, v))


abilita_studente = {}
for sid in df_studenti['id_studente']:
    abilita_studente[sid] = tronca(random.gauss(0, 0.6), -1.2, 1.2)

# Specializzazione studente-materia
spec_studente_materia = {}

# Offset classe-materia
offset_classe_materia = {}
for cid, mats in materie_classe.items():
    for m in mats:
        offset_classe_materia[(cid, m.upper())] = tronca(random.gauss(0, 0.4), -0.9, 0.9)


def calcola_socio_demografico(id_studente: str) -> float:
    """
    Calcola l'impatto complessivo dei fattori socio-demografici.

    Args:
        id_studente: ID dello studente

    Returns:
        impatto socio-demografico sul voto
    """
    dati = studenti_socio_demo.get(id_studente, {})

    # Impatto geografico
    geo_impact = GEOGRAFIA_IMPACT.get(dati.get('area_geografica', 'CENTRO'), 0.0)

    # Impatto tipo scuola
    tipo_impact = TIPO_SCUOLA_IMPACT.get(dati.get('tipo_scuola', ''), 0.0)

    # Impatto cittadinanza
    citt_impact = CITTADINANZA_IMPACT.get(dati.get('cittadinanza', 'ITA'), 0.0)

    # Impatto ESCS
    escs_quartile = dati.get('escs_quartile', 2)
    escs_impact = ESCS_QUARTILE_IMPACT.get(escs_quartile, 0.0)

    # Somma pesata degli impatti
    return geo_impact * 0.25 + tipo_impact * 0.25 + citt_impact * 0.25 + escs_impact * 0.25


def voto_generato(id_studente, id_classe, materia, tipologia):
    """
    Genera un voto tenendo conto di tutti i fattori, inclusi quelli socio-demografici.
    """
    m_up = materia.upper()
    base = BASE_MEDIA
    diff = MATERIA_DIFFICOLTA[m_up]
    cls_off = offset_classe_materia.get((id_classe, m_up), 0.0)
    stud = abilita_studente.get(id_studente, 0.0)

    key_spec = (id_studente, m_up)
    if key_spec not in spec_studente_materia:
        spec_studente_materia[key_spec] = tronca(random.gauss(0, 0.3), -0.7, 0.7)
    spec = spec_studente_materia[key_spec]

    tip_adj = tipologia_delta(materia, tipologia)

    # NUOVO: Integrazione fattori socio-demografici
    socio_demografico = calcola_socio_demografico(id_studente)

    noise = random.gauss(0, 0.7)

    # Formula aggiornata con fattore socio-demografico
    val = base + diff + cls_off + stud + spec + tip_adj + socio_demografico + noise

    # Leggera rialzata se molto basso
    if val < 3 and random.random() < 0.6:
        val = 3 + random.random() * 1.0  # 3–4

    val = max(PESO_MIN_VOTO, min(PESO_MAX_VOTO, val))
    return int(round(val))


def scegli_tipologie(materia: str, n: int) -> List[str]:
    """Sceglie le tipologie di valutazione per una materia."""
    pesi = TIPOLOGIA_PESI.get(materia.upper(), TIPOLOGIE_DEFAULT)
    sorted_pesi = sorted(pesi.items(), key=lambda x: x[1], reverse=True)
    if n >= 3:
        return ['scritto', 'orale', 'pratico']
    if n == 2:
        return [sorted_pesi[0][0], sorted_pesi[1][0]]
    return [sorted_pesi[0][0]]


def data_random():
    """Genera una data casuale nell'anno scolastico."""
    g = random.randint(0, DELTA_GIORNI)
    return (DATA_INIZIO + datetime.timedelta(days=g)).isoformat()


# Per ogni studente -> materie della classe -> 1..3 voti
for _, stud in df_studenti.iterrows():
    id_stu = stud['id_studente']
    cid = stud['id_classe']
    assegn = assegnazioni_per_classe.get(cid, [])

    for id_docente, materia in assegn:
        n_voti = random.choice([1, 2, 3])
        tipologie = scegli_tipologie(materia, n_voti)
        random.shuffle(tipologie)
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

# Statistiche riepilogo
print('Statistiche voti con fattori socio-demografici...')
if voti_records:
    temp_df = pd.DataFrame(voti_records)
    # Merge con dati studenti per analisi
    temp_df = temp_df.merge(df_studenti[['id_studente', 'cittadinanza', 'escs_quartile']], on='id_studente')

    print('\nMedia voti per cittadinanza:')
    print(temp_df.groupby('cittadinanza')['voto'].mean().round(2))

    print('\nMedia voti per quartile ESCS:')
    print(temp_df.groupby('escs_quartile')['voto'].mean().round(2))

    # Merge con dati classi per area geografica
    temp_df = temp_df.merge(df_studenti[['id_studente', 'id_classe']], on='id_studente')
    temp_df = temp_df.merge(df_classi[['id_classe', 'area_geografica']], on='id_classe')

    print('\nMedia voti per area geografica:')
    print(temp_df.groupby('area_geografica')['voto'].mean().round(2))

# Salvataggio
print('Salvataggio voti...')
df_voti = pd.DataFrame(voti_records)
df_voti.to_csv(os.path.join(OUTPUT_DIR, 'voti.csv'), index=False)
print(f"Voti generati: {len(df_voti)}")

# -----------------------------
# STATISTICHE FINALI
# -----------------------------
print('\n=== STATISTICHE FINALI ===')
print(f'Totale studenti: {len(df_studenti)}')
print(
    f'- Italiani: {len(df_studenti[df_studenti.cittadinanza == "ITA"])} ({len(df_studenti[df_studenti.cittadinanza == "ITA"]) / len(df_studenti) * 100:.1f}%)')
print(
    f'- Stranieri UE: {len(df_studenti[df_studenti.cittadinanza == "UE"])} ({len(df_studenti[df_studenti.cittadinanza == "UE"]) / len(df_studenti) * 100:.1f}%)')
print(
    f'- Stranieri non-UE: {len(df_studenti[df_studenti.cittadinanza == "NON_UE"])} ({len(df_studenti[df_studenti.cittadinanza == "NON_UE"]) / len(df_studenti) * 100:.1f}%)')

print('\nDistribuzione ESCS:')
for q in range(1, 5):
    count = len(df_studenti[df_studenti.escs_quartile == q])
    print(f'- Quartile {q}: {count} studenti ({count / len(df_studenti) * 100:.1f}%)')

# -----------------------------
# COPIA ANAGRAFICA
# -----------------------------
shutil.copy2(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'), os.path.join(OUTPUT_DIR, 'anagrafica.csv'))
print('Copia anagrafica completata.')

print('\n✅ Pipeline completata con integrazione fattori socio-demografici.')

if __name__ == '__main__':
    # Lo script è eseguibile direttamente.
    pass

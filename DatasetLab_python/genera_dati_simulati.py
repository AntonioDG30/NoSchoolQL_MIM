# -*- coding: utf-8 -*-
import pandas as pd
import os
import math
import random
from faker import Faker
import shutil

# -----------------------------
# CONFIGURAZIONE PERCORSI
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_puliti')
OUTPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_definitivi')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# -----------------------------
# CARICAMENTO FILE
# -----------------------------
df_anag = pd.read_csv(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'))
df_ind = pd.read_csv(os.path.join(INPUT_DIR, 'stu_indirizzi_pulito.csv'))
df_stats = pd.read_csv(os.path.join(INPUT_DIR, 'statistiche_base.csv'))

def to_int_safe(x):
    try:
        return int(x)
    except:
        return 0

for col in ['alunnimaschi', 'alunnifemmine']:
    df_ind[col] = df_ind[col].map(to_int_safe)

if 'totale' not in df_ind.columns:
    df_ind['totale'] = df_ind['alunnimaschi'] + df_ind['alunnifemmine']

# -----------------------------
# GENERAZIONE CLASSI
# -----------------------------
classi_generate = []
MEDIA_ALUNNI_PER_CLASSE = 22
class_counter_per_school = {}

for _, row in df_ind.iterrows():
    codice_scuola = row['codicescuola']
    indirizzo = row['indirizzo']
    annocorso = to_int_safe(row['annocorso'])
    totale = to_int_safe(row['totale'])

    if totale == 0:
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

    for num_studenti in studenti_per_classe:
        class_counter_per_school.setdefault(codice_scuola, 0)
        class_counter_per_school[codice_scuola] += 1
        id_classe = f"{codice_scuola}_{class_counter_per_school[codice_scuola]:04d}"

        num_maschi = round(num_studenti * perc_maschi)
        num_femmine = num_studenti - num_maschi
        num_italiani = round(num_studenti * perc_italiani)
        num_stranieri = num_studenti - num_italiani

        classi_generate.append({
            'id_classe': id_classe,
            'codicescuola': codice_scuola,
            'indirizzo': indirizzo,
            'annocorso': annocorso,
            'num_studenti': num_studenti,
            'num_maschi': num_maschi,
            'num_femmine': num_femmine,
            'num_italiani': num_italiani,
            'num_stranieri': num_stranieri
        })

df_classi = pd.DataFrame(classi_generate)
df_classi.to_csv(os.path.join(OUTPUT_DIR, 'classi.csv'), index=False)
print("✅ Classi generate e salvate.")

# -----------------------------
# GENERAZIONE STUDENTI
# -----------------------------
faker = Faker('it_IT')
faker.unique.clear()
studenti = []
studente_counter = 1

for _, row in df_classi.iterrows():
    id_classe = row['id_classe']
    num_studenti = int(row['num_studenti'])
    num_maschi = int(row['num_maschi'])
    num_femmine = int(row['num_femmine'])
    num_italiani = int(row['num_italiani'])
    num_stranieri = int(row['num_stranieri'])

    sesso_lista = ['M'] * num_maschi + ['F'] * num_femmine
    cittadinanza_lista = ['ITA'] * num_italiani + ['NON_ITA'] * num_stranieri

    while len(sesso_lista) < num_studenti:
        sesso_lista.append(random.choice(['M', 'F']))
    while len(cittadinanza_lista) < num_studenti:
        cittadinanza_lista.append(random.choice(['ITA', 'NON_ITA']))

    random.shuffle(sesso_lista)
    random.shuffle(cittadinanza_lista)

    for i in range(num_studenti):
        sesso = sesso_lista[i]
        cittadinanza = cittadinanza_lista[i]
        nome = faker.first_name_male() if sesso == 'M' else faker.first_name_female()
        cognome = faker.last_name()
        id_studente = f"STU{studente_counter:04d}"
        studente_counter += 1

        studenti.append({
            'id_studente': id_studente,
            'id_classe': id_classe,
            'nome': nome,
            'cognome': cognome,
            'sesso': sesso,
            'cittadinanza': cittadinanza
        })

df_studenti = pd.DataFrame(studenti)
df_studenti.to_csv(os.path.join(OUTPUT_DIR, 'studenti.csv'), index=False)
print("✅ Studenti generati e salvati.")

# -----------------------------
# GENERAZIONE DOCENTI
# -----------------------------
materie_comuni = ['Italiano', 'Matematica']
materie_per_indirizzo = {
    'LICEO SCIENTIFICO': ['Fisica', 'Latino', 'Scienze Naturali'],
    'LICEO CLASSICO': ['Latino', 'Greco', 'Filosofia'],
    'ISTITUTO TECNICO INDUSTRIALE': ['Informatica', 'Elettronica', 'Sistemi'],
    'ISTITUTO TECNICO COMMERCIALE': ['Economia', 'Diritto', 'Informatica'],
    'ISTITUTO PROFESSIONALE': ['Tecnologia', 'Laboratorio', 'Sicurezza'],
    'LICEO LINGUISTICO': ['Inglese', 'Francese', 'Spagnolo'],
    'LICEO ARTISTICO': ['Storia dell’Arte', 'Disegno', 'Scultura'],
}

docenti = []
assegnazioni = []
docente_counter = 1
faker.unique.clear()

gruppo_classi = df_classi.groupby(['codicescuola', 'indirizzo'])

for (codice_scuola, indirizzo), classi in gruppo_classi:
    classi_ids = classi['id_classe'].tolist()
    indirizzo_upper = indirizzo.upper()
    materie_spec = materie_per_indirizzo.get(indirizzo_upper, ['Scienze', 'Educazione Fisica', 'Storia'])
    materie_finali = materie_comuni + materie_spec
    random.shuffle(materie_finali)

    for materia in materie_finali:
        nome = faker.first_name()
        cognome = faker.last_name()
        id_docente = f"DOC{docente_counter:04d}"
        docente_counter += 1

        docenti.append({
            'id_docente': id_docente,
            'nome': nome,
            'cognome': cognome,
            'materia': materia,
            'codicescuola': codice_scuola
        })

        n_classi = random.randint(1, min(2, len(classi_ids)))
        classi_assegnate = random.sample(classi_ids, n_classi)

        for id_classe in classi_assegnate:
            assegnazioni.append({
                'id_docente': id_docente,
                'id_classe': id_classe,
                'materia': materia
            })

df_docenti = pd.DataFrame(docenti)
df_assegnazioni = pd.DataFrame(assegnazioni)
df_docenti.to_csv(os.path.join(OUTPUT_DIR, 'docenti.csv'), index=False)
df_assegnazioni.to_csv(os.path.join(OUTPUT_DIR, 'assegnazioni_docenti.csv'), index=False)
print("✅ Docenti generati e assegnazioni salvate.")

# -----------------------------
# GENERAZIONE VOTI
# -----------------------------
def genera_voto():
    voto = round(random.gauss(6.5, 1.5))
    return min(10, max(3, voto))

df_assegnazioni = pd.read_csv(os.path.join(OUTPUT_DIR, 'assegnazioni_docenti.csv'))
voti = []
voto_counter = 1
assegnazioni_per_classe = df_assegnazioni.groupby('id_classe')

for _, studente in df_studenti.iterrows():
    id_studente = studente['id_studente']
    id_classe = studente['id_classe']

    if id_classe not in assegnazioni_per_classe.groups:
        continue

    assegnazioni = assegnazioni_per_classe.get_group(id_classe)

    for _, riga in assegnazioni.iterrows():
        id_docente = riga['id_docente']
        materia = riga['materia']
        for _ in range(2):
            id_voto = f"VOT{voto_counter:04d}"
            voto_counter += 1
            voti.append({
                'id_voto': id_voto,
                'id_studente': id_studente,
                'id_docente': id_docente,
                'materia': materia,
                'voto': genera_voto()
            })

df_voti = pd.DataFrame(voti)
df_voti.to_csv(os.path.join(OUTPUT_DIR, 'voti.csv'), index=False)
print("✅ Voti generati e salvati.")


shutil.copy2(os.path.join(BASE_DIR, '../file/dataset_puliti', 'anagrafica_scuole_pulita.csv'), os.path.join(OUTPUT_DIR, 'anagrafica_scuole_pulita.csv'))
print("✅ File anagrafiche salvato.")

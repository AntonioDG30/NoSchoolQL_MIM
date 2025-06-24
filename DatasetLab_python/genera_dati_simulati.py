# -*- coding: utf-8 -*-
# Imposto l'encoding UTF-8 per supportare caratteri speciali

import pandas as pd       # Uso pandas per gestire tabelle e CSV
import os                 # Uso os per gestire i percorsi di file e cartelle
import random             # Uso random per generare dati casuali
from faker import Faker   # Uso Faker per generare nomi e cognomi fittizi in italiano
import shutil             # Uso shutil per copiare i file


# -----------------------------
# CONFIGURAZIONE
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))                           # Ottengo il percorso assoluto dello script
INPUT_FILE = os.path.join(BASE_DIR, 'file/dataset_puliti', 'statistiche_simulazione.csv')   # Percorso del file statistico di input
OUTPUT_DIR = os.path.join(BASE_DIR, 'file', 'dataset_definitivi')                       # Cartella dove salvo i CSV generati
STUDENTI_PER_CLASSE = 22                                                        # Numero medio di studenti per classe
random.seed(42)                                                                 # Fisso il seed per avere risultati ripetibili
fake = Faker('it_IT')                                                           # Inizializzo Faker in lingua italiana

# -----------------------------
# CREAZIONE CARTELLA
# -----------------------------
os.makedirs(OUTPUT_DIR, exist_ok=True)  # Creo la cartella 'dataset_definitivi' se non esiste già

# -----------------------------
# CARICAMENTO STATISTICHE
# -----------------------------
df = pd.read_csv(INPUT_FILE)            # Carico il file delle statistiche pre-aggregate
df = df[df['totale'] >= 5].copy()       # Considero solo le righe con almeno 5 studenti

# -----------------------------
# DIZIONARIO MATERIE PER INDIRIZZO
# -----------------------------
materie_generiche = ['Italiano', 'Matematica', 'Inglese', 'Storia']  # Materie comuni a tutti
materie_per_indirizzo = {                                            # Materie specifiche per indirizzo scolastico
    'liceo': materie_generiche + ['Latino', 'Filosofia', 'Fisica'],
    'industriale': materie_generiche + ['Informatica', 'Elettronica', 'Sistemi'],
    'linguistico': materie_generiche + ['Francese', 'Spagnolo', 'Tedesco'],
    'scientifico': materie_generiche + ['Fisica', 'Scienze', 'Disegno Tecnico'],
    'classico': materie_generiche + ['Greco', 'Latino', 'Filosofia']
}

# -----------------------------
# INIZIALIZZAZIONE STRUTTURE
# -----------------------------
studenti_rows = []       # Lista per le righe della tabella studenti
classi_rows = []         # Lista per le righe della tabella classi
percorsi_rows = []       # Lista per il legame tra classe e indirizzo
docenti_rows = []        # Lista delle classi con i docenti associati
voti_rows = []           # Lista di tutti i voti generati
assegnazioni_rows = []   # Lista per le assegnazioni materia-docente per ogni classe

# Genero un pool di 100 docenti fittizi con ID univoco
docenti_pool = [{'id_docente': f"DOC{str(i+1).zfill(4)}", 'nome': fake.name()} for i in range(100)]
docenti_usati = {}  # Dizionario per tenere traccia di quale docente insegna quale materia in ogni classe

student_id_counter = 1   # Contatore progressivo per gli ID studenti
classe_id_counter = 1    # Contatore progressivo per gli ID classi

# -----------------------------
# LOOP PRINCIPALE
# -----------------------------
for _, row in df.iterrows():               # Ciclo su ogni riga del file delle statistiche
    codice = row['codicescuola']           # Codice della scuola
    indirizzo = row['indirizzo']           # Nome dell'indirizzo scolastico
    totale = int(row['totale'])            # Numero totale di studenti

    indirizzo_lower = indirizzo.lower()    # Rendo l'indirizzo minuscolo per confrontarlo facilmente
    materie = materie_generiche.copy()     # Di default uso le materie generiche
    for chiave, mat in materie_per_indirizzo.items():  # Cerco una chiave coerente
        if chiave in indirizzo_lower:
            materie = mat
            break

    num_classi = max(1, totale // STUDENTI_PER_CLASSE)  # Calcolo il numero di classi necessarie
    classi_ids = []  # Tengo traccia degli ID delle classi generate

    for i in range(num_classi):                        # Creo ciascuna classe
        nome_classe = f"{random.randint(3, 5)}{chr(65 + i % 5)}"      # Es: 3A, 4B, 5C...
        id_classe = f"CL{classe_id_counter:04}"                      # Es: CL0001, CL0002...
        classe_id_counter += 1
        classi_ids.append(id_classe)

        classi_rows.append({                 # Salvo i dati della classe
            'id_classe': id_classe,
            'codicescuola': codice,
            'nome_classe': nome_classe
        })

        percorsi_rows.append({               # Associo la classe a un indirizzo
            'id_classe': id_classe,
            'indirizzo': indirizzo
        })

        for materia in materie:              # Per ogni materia assegno un docente
            docente = random.choice(docenti_pool)
            nome_docente = docente['nome']
            id_docente = docente['id_docente']

            assegnazioni_rows.append({       # Salvo l'assegnazione materia-docente-classe
                'id_classe': id_classe,
                'materia': materia,
                'id_docente': id_docente,
                'nome_docente': nome_docente
            })

            docenti_rows.append({            # Salvo la presenza del docente nella classe
                'id_classe': id_classe,
                'id_docente': id_docente,
                'nome_docente': nome_docente
            })

            docenti_usati[(id_classe, materia)] = id_docente  # Memorizzo l'abbinamento per generare voti coerenti

    for idx in range(totale):  # Generazione degli studenti
        id_studente = f"STU{student_id_counter:05}"  # Es: STU00001, STU00002...
        student_id_counter += 1
        id_classe = classi_ids[idx % num_classi]  # Assegno lo studente a una classe in modo bilanciato

        genere = 'M' if random.random() < row['perc_maschi'] else 'F'             # Genere basato sulla percentuale maschi
        cittadinanza = 'ITA' if random.random() < row['perc_italiani'] else 'NON_ITA'  # Cittadinanza basata sulla percentuale italiani

        nome = fake.first_name_male() if genere == 'M' else fake.first_name_female()  # Nome coerente con il genere
        cognome = fake.last_name()                                                   # Cognome casuale

        studenti_rows.append({             # Salvo i dati dello studente
            'id_studente': id_studente,
            'id_classe': id_classe,
            'nome': nome,
            'cognome': cognome,
            'genere': genere,
            'cittadinanza': cittadinanza
        })

        for materia in materie:            # Genero i voti dello studente per ogni materia
            num_voti = random.choice([2, 3])                        # Ogni materia ha 2 o 3 voti
            id_docente = docenti_usati.get((id_classe, materia))   # Recupero il docente che insegna quella materia
            for _ in range(num_voti):
                voto_base = random.randint(1, 9)                    # Parte intera del voto
                decimale = random.choice([0.25, 0.5, 0.75])         # Parte decimale casuale
                voto = round(min(voto_base + decimale, 10.0), 2)    # Somma con decimale, massimo 10

                voti_rows.append({              # Salvo il voto completo
                    'id_studente': id_studente,
                    'materia': materia,
                    'voto': voto,
                    'id_docente': id_docente
                })

# -----------------------------
# SALVATAGGIO FILE
# -----------------------------
# Esporto tutti i file generati come CSV
pd.DataFrame(studenti_rows).to_csv(os.path.join(OUTPUT_DIR, 'studenti.csv'), index=False)
pd.DataFrame(classi_rows).to_csv(os.path.join(OUTPUT_DIR, 'classi.csv'), index=False)
pd.DataFrame(percorsi_rows).to_csv(os.path.join(OUTPUT_DIR, 'percorsi.csv'), index=False)
pd.DataFrame(docenti_rows).to_csv(os.path.join(OUTPUT_DIR, 'docenti.csv'), index=False)
pd.DataFrame(assegnazioni_rows).to_csv(os.path.join(OUTPUT_DIR, 'assegnazioni_docenti.csv'), index=False)
pd.DataFrame(voti_rows).to_csv(os.path.join(OUTPUT_DIR, 'voti.csv'), index=False)
shutil.copy2(os.path.join(BASE_DIR, 'file/dataset_puliti', 'anagrafica_scuole_pulita.csv'), os.path.join(OUTPUT_DIR, 'anagrafica_scuole_pulita.csv'))


print("✅ File simulati con docenti generati in:", OUTPUT_DIR)  # Messaggio di conferma finale

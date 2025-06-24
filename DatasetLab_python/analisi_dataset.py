# -*- coding: utf-8 -*-
# Imposto la codifica UTF-8 per gestire correttamente i caratteri italiani

import pandas as pd       # Importo pandas per la gestione dei DataFrame
import os                 # Importo os per lavorare con i percorsi dei file
from collections import Counter  # Importo Counter per eventuali conteggi (anche se non usato esplicitamente qui)

# -------------------------------
# CONFIGURAZIONE
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))                             # Ottengo il percorso assoluto dello script
INPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_definitivi')                    # Cartella dove si trovano i CSV finali

# -------------------------------
# CARICAMENTO DEI FILE
# -------------------------------
studenti = pd.read_csv(os.path.join(INPUT_DIR, 'studenti.csv'))                  # Carico il file studenti
classi = pd.read_csv(os.path.join(INPUT_DIR, 'classi.csv'))                      # Carico il file classi
percorsi = pd.read_csv(os.path.join(INPUT_DIR, 'percorsi.csv'))                  # Carico il file percorsi (classi → indirizzi)
docenti = pd.read_csv(os.path.join(INPUT_DIR, 'docenti.csv'))                    # Carico il file con i docenti
assegnazioni = pd.read_csv(os.path.join(INPUT_DIR, 'assegnazioni_docenti.csv')) # Carico le assegnazioni materia-docente per classe
voti = pd.read_csv(os.path.join(INPUT_DIR, 'voti.csv'))                          # Carico i voti assegnati

# -------------------------------
# JOIN PRELIMINARI
# -------------------------------
# Unisco studenti con classi e indirizzi → per analisi complete
studenti_classi = studenti.merge(percorsi, on='id_classe').merge(classi, on='id_classe')

# Unisco voti con i dati dello studente (genere, cittadinanza, classe)
voti_espansi = voti.merge(studenti[['id_studente', 'genere', 'cittadinanza', 'id_classe']], on='id_studente')

# Unisco anche le assegnazioni (per sapere chi ha messo il voto) → uso suffisso per evitare conflitti
voti_espansi = voti_espansi.merge(
    assegnazioni[['id_classe', 'materia', 'id_docente', 'nome_docente']],
    on=['id_classe', 'materia'],
    how='left',
    suffixes=('', '_from_assegnazioni')  # Evito conflitti se ci sono già colonne col nome 'id_docente'
)

# Aggiungo anche l'informazione sull'indirizzo scolastico
voti_espansi = voti_espansi.merge(percorsi, on='id_classe')

# -------------------------------
# ANALISI GENERALE
# -------------------------------
print("📊 ANALISI GENERALE")
print(f"Scuole reali: {classi['codicescuola'].nunique()}")                       # Numero di scuole simulate
print(f"Classi totali simulate: {classi.shape[0]}")                              # Numero di classi totali
print(f"Studenti totali simulati: {studenti.shape[0]}")                          # Numero di studenti generati
print(f"Docenti unici simulati: {docenti['id_docente'].nunique()}")             # Numero di docenti distinti
print(f"Materie simulati totali assegnate: {assegnazioni['materia'].nunique()}")# Numero di materie simulate

# -------------------------------
# DISTRIBUZIONE PER INDIRIZZO
# -------------------------------
print("\n🏫 Studenti per indirizzo:")
print(studenti_classi['indirizzo'].value_counts())  # Numero di studenti per indirizzo scolastico

# -------------------------------
# STATISTICHE SUI VOTI
# -------------------------------
print("\n📈 Statistiche generali sui voti:")
print(voti['voto'].describe())  # Statistiche generali (media, min, max, quartili...)

# -------------------------------
# VOTI PER GENERE
# -------------------------------
print("\n👥 Media voti per genere:")
print(voti_espansi.groupby('genere')['voto'].mean())  # Calcolo media voti maschi/femmine

# -------------------------------
# VOTI PER CITTADINANZA
# -------------------------------
print("\n🌍 Media voti per cittadinanza:")
print(voti_espansi.groupby('cittadinanza')['voto'].mean())  # Media voti italiani/non italiani

# -------------------------------
# CLASSIFICA DOCENTI
# -------------------------------
print("\n🏅 Top 5 docenti per media voti assegnati:")
top_docenti = voti_espansi.groupby(
    ['id_docente_from_assegnazioni', 'nome_docente']
)['voto'].mean().sort_values(ascending=False)  # Media dei voti assegnati da ciascun docente
print(top_docenti.head(5))  # I primi 5 più "generosi"

print("\n❌ Bottom 5 docenti per media voti assegnati:")
print(top_docenti.tail(5))  # I 5 più "severi"

# -------------------------------
# CLASSIFICA MATERIE
# -------------------------------
print("\n📚 Materie più facili (media più alta):")
top_materie = voti_espansi.groupby('materia')['voto'].mean().sort_values(ascending=False)
print(top_materie.head(5))  # Materie con voti medi più alti

print("\n📚 Materie più difficili (media più bassa):")
print(top_materie.tail(5))  # Materie con voti medi più bassi

# -------------------------------
# DISTRIBUZIONE VOTI
# -------------------------------
print("\n📊 Distribuzione dei voti (frequenze arrotondate):")
voti_rounded = voti['voto'].round(1)  # Arrotondo i voti alla prima cifra decimale
print(voti_rounded.value_counts().sort_index())  # Mostro la distribuzione frequenze ordinata per voto

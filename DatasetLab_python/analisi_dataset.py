# -*- coding: utf-8 -*-
import pandas as pd
import os
import matplotlib.pyplot as plt

# -----------------------------
# CONFIGURAZIONE PERCORSI
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_puliti')
SIMULATED_DIR = os.path.join(BASE_DIR, '../file/dataset_simulati')

# -----------------------------
# CARICAMENTO DATASET
# -----------------------------
df_ind = pd.read_csv(os.path.join(INPUT_DIR, 'stu_indirizzi_pulito.csv'))
df_citt = pd.read_csv(os.path.join(INPUT_DIR, 'stu_cittadinanza_pulito.csv'))
df_anag = pd.read_csv(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'))

df_classi = pd.read_csv(os.path.join(SIMULATED_DIR, 'classi.csv'))
df_studenti = pd.read_csv(os.path.join(SIMULATED_DIR, 'studenti.csv'))
df_docenti = pd.read_csv(os.path.join(SIMULATED_DIR, 'docenti.csv'))
df_voti = pd.read_csv(os.path.join(SIMULATED_DIR, 'voti.csv'))
df_assegnazioni = pd.read_csv(os.path.join(SIMULATED_DIR, 'assegnazioni_docenti.csv'))

# -----------------------------
# FUNZIONI DI SUPPORTO
# -----------------------------
def percentuale_diff(sim, ori):
    if ori == 0:
        return 0
    return round((sim - ori) / ori * 100, 2)

# -----------------------------
# ANALISI MASCHI/FEMMINE
# -----------------------------
print("\n📊 ANALISI MASCHI/FEMMINE PER INDIRIZZO E ANNO:")
dati_genere = []

for _, row in df_ind.iterrows():
    scuola = row['codicescuola']
    indirizzo = row['indirizzo']
    anno = row['annocorso']

    mask = (
        (df_classi['codicescuola'] == scuola) &
        (df_classi['indirizzo'].str.upper() == indirizzo.upper()) &
        (df_classi['annocorso'] == anno)
    )
    classi_rilevanti = df_classi[mask]['id_classe'].tolist()
    studenti = df_studenti[df_studenti['id_classe'].isin(classi_rilevanti)]

    sim_m = (studenti['sesso'] == 'M').sum()
    sim_f = (studenti['sesso'] == 'F').sum()

    ori_m = row['alunnimaschi']
    ori_f = row['alunnifemmine']

    perc_m = percentuale_diff(sim_m, ori_m)
    perc_f = percentuale_diff(sim_f, ori_f)

    print(f"- {scuola} | {indirizzo} | anno {anno} → Maschi: {sim_m}/{ori_m} ({perc_m:+}%), Femmine: {sim_f}/{ori_f} ({perc_f:+}%)")

    dati_genere.append({
        'scuola': scuola,
        'indirizzo': indirizzo,
        'anno': anno,
        'Maschi Originali': ori_m,
        'Maschi Simulati': sim_m,
        'Femmine Originali': ori_f,
        'Femmine Simulati': sim_f
    })

# GRAFICO MASCHI/FEMMINE
df_genere = pd.DataFrame(dati_genere)
df_genere[['Maschi Originali', 'Maschi Simulati']].sum().plot(kind='bar', title="Totale Maschi - Originali vs Simulati")
plt.ylabel("Numero Studenti")
plt.tight_layout()
plt.show()

df_genere[['Femmine Originali', 'Femmine Simulati']].sum().plot(kind='bar', title="Totale Femmine - Originali vs Simulati")
plt.ylabel("Numero Studenti")
plt.tight_layout()
plt.show()

# -----------------------------
# ANALISI CITTADINANZA
# -----------------------------
print("\n📊 ANALISI CITTADINANZA PER SCUOLA E ANNO:")
dati_citt = []

for _, row in df_citt.iterrows():
    scuola = row['codicescuola']
    anno = row['annocorso']

    mask = (
        (df_classi['codicescuola'] == scuola) &
        (df_classi['annocorso'] == anno)
    )
    classi_rilevanti = df_classi[mask]['id_classe'].tolist()
    studenti = df_studenti[df_studenti['id_classe'].isin(classi_rilevanti)]

    sim_ita = (studenti['cittadinanza'] == 'ITA').sum()
    sim_nonita = (studenti['cittadinanza'] == 'NON_ITA').sum()

    ori_ita = row['alunnicittadinanzaitaliana']
    ori_nonita = row['alunnicittadinanzanonitaliana']

    perc_ita = percentuale_diff(sim_ita, ori_ita)
    perc_nonita = percentuale_diff(sim_nonita, ori_nonita)

    print(f"- {scuola} | anno {anno} → ITA: {sim_ita}/{ori_ita} ({perc_ita:+}%), NON_ITA: {sim_nonita}/{ori_nonita} ({perc_nonita:+}%)")

    dati_citt.append({
        'scuola': scuola,
        'anno': anno,
        'ITA Originali': ori_ita,
        'ITA Simulati': sim_ita,
        'NON_ITA Originali': ori_nonita,
        'NON_ITA Simulati': sim_nonita
    })

# GRAFICO CITTADINANZA
df_cittadinanza = pd.DataFrame(dati_citt)
df_cittadinanza[['ITA Originali', 'ITA Simulati']].sum().plot(kind='bar', title="Totale Italiani - Originali vs Simulati")
plt.ylabel("Numero Studenti")
plt.tight_layout()
plt.show()

df_cittadinanza[['NON_ITA Originali', 'NON_ITA Simulati']].sum().plot(kind='bar', title="Totale Non Italiani - Originali vs Simulati")
plt.ylabel("Numero Studenti")
plt.tight_layout()
plt.show()

# -----------------------------
# STATISTICHE FINALI
# -----------------------------
print("\n📌 STATISTICHE GENERALI SUL DATASET SIMULATO:")
print(f"🏫 Numero scuole simulate: {df_classi['codicescuola'].nunique()}")
print(f"🏷️ Numero classi: {len(df_classi)}")
print(f"👨‍🎓 Numero studenti: {len(df_studenti)}")
print(f"🧑‍🏫 Numero docenti: {len(df_docenti)}")
print(f"📚 Materie totali: {df_docenti['materia'].nunique()}")
print(f"📓 Assegnazioni docenti-classe: {len(df_assegnazioni)}")
print(f"📝 Numero voti registrati: {len(df_voti)}")

"""
================================================================================
MODULO DI ANALISI DEL DATASET SIMULATO
================================================================================
Questo script rappresenta l'ultima fase della pipeline e si occupa di verificare
la qualità e la coerenza del dataset simulato confrontandolo con i dati originali.

Obiettivi principali:
1. Confrontare le distribuzioni simulate con quelle originali (genere, cittadinanza)
2. Verificare che i numeri totali siano coerenti
3. Generare visualizzazioni per l'analisi
4. Produrre statistiche riassuntive del dataset generato

Questo modulo è essenziale per validare che la simulazione abbia prodotto
dati realistici e coerenti con le statistiche MIUR originali.

Autore: Antonio Di Giorgio
Data: Giugno 2025
================================================================================
"""

import pandas as pd
import os
import matplotlib.pyplot as plt

# ============================================================================
# CONFIGURAZIONE
# ============================================================================
"""
Definisco i percorsi per accedere ai dati originali puliti e ai dati
simulati generati dalle fasi precedenti.
"""

# Directory base
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Directory con i dati MIUR puliti (per confronto)
INPUT_DIR = os.path.join(BASE_DIR, '../file/dataset_puliti')

# Directory con i dati simulati da analizzare
SIMULATED_DIR = os.path.join(BASE_DIR, '../file/dataset_definitivi')

# ============================================================================
# CARICAMENTO DATI
# ============================================================================
"""
Carico sia i dati originali MIUR che quelli simulati per poterli confrontare.
"""

# --- Dati originali MIUR ---
# Studenti per indirizzo con distribuzione di genere
df_ind = pd.read_csv(os.path.join(INPUT_DIR, 'stu_indirizzi_pulito.csv'))

# Cittadinanza studenti per scuola e anno
df_citt = pd.read_csv(os.path.join(INPUT_DIR, 'stu_cittadinanza_pulito.csv'))

# Anagrafica scuole per informazioni aggiuntive
df_anag = pd.read_csv(os.path.join(INPUT_DIR, 'anagrafica_scuole_pulita.csv'))

# --- Dati simulati ---
# Classi generate con metadati
df_classi = pd.read_csv(os.path.join(SIMULATED_DIR, 'classi.csv'))

# Studenti con caratteristiche socio-demografiche
df_studenti = pd.read_csv(os.path.join(SIMULATED_DIR, 'studenti.csv'))

# Docenti generati
df_docenti = pd.read_csv(os.path.join(SIMULATED_DIR, 'docenti.csv'))

# Voti registrati
df_voti = pd.read_csv(os.path.join(SIMULATED_DIR, 'voti.csv'))

# Assegnazioni docenti alle classi
df_assegnazioni = pd.read_csv(os.path.join(SIMULATED_DIR, 'assegnazioni_docenti.csv'))


# ============================================================================
# FUNZIONI DI UTILITÀ
# ============================================================================
def percentuale_diff(sim, ori):
    """
    Calcolo la differenza percentuale tra valore simulato e originale.

    Questa funzione mi permette di quantificare quanto i dati simulati
    si discostano da quelli originali.

    Args:
        sim: Valore simulato
        ori: Valore originale

    Returns:
        float: Differenza percentuale (positiva se sim > ori)
    """
    if ori == 0:
        return 0
    return round((sim - ori) / ori * 100, 2)


# ============================================================================
# ANALISI 1: CONFRONTO DISTRIBUZIONE GENERE
# ============================================================================
"""
Confronto la distribuzione di maschi e femmine nel dataset simulato
con quella originale per verificare la fedeltà della simulazione.
"""

print("\n📊 ANALISI MASCHI/FEMMINE PER INDIRIZZO E ANNO:")

# Lista per raccogliere i dati di confronto
dati_genere = []

# Analizzo ogni combinazione scuola-indirizzo-anno presente nei dati originali
for _, row in df_ind.iterrows():
    scuola = row['codicescuola']
    indirizzo = row['indirizzo']
    anno = row['annocorso']

    # Filtro le classi simulate corrispondenti
    mask = (
            (df_classi['codicescuola'] == scuola) &
            (df_classi['indirizzo'].str.upper() == indirizzo.upper()) &
            (df_classi['annocorso'] == anno)
    )
    classi_rilevanti = df_classi[mask]['id_classe'].tolist()

    # Recupero gli studenti di queste classi
    studenti = df_studenti[df_studenti['id_classe'].isin(classi_rilevanti)]

    # Conto maschi e femmine nel dataset simulato
    sim_m = (studenti['sesso'] == 'M').sum()
    sim_f = (studenti['sesso'] == 'F').sum()

    # Recupero i valori originali
    ori_m = row['alunnimaschi']
    ori_f = row['alunnifemmine']

    # Calcolo le differenze percentuali
    perc_m = percentuale_diff(sim_m, ori_m)
    perc_f = percentuale_diff(sim_f, ori_f)

    # Stampo il confronto dettagliato
    print(f"- {scuola} | {indirizzo} | anno {anno} → "
          f"Maschi: {sim_m}/{ori_m} ({perc_m:+}%), "
          f"Femmine: {sim_f}/{ori_f} ({perc_f:+}%)")

    # Raccolgo i dati per l'analisi aggregata
    dati_genere.append({
        'scuola': scuola,
        'indirizzo': indirizzo,
        'anno': anno,
        'Maschi Originali': ori_m,
        'Maschi Simulati': sim_m,
        'Femmine Originali': ori_f,
        'Femmine Simulati': sim_f
    })

# Creo DataFrame per analisi e visualizzazioni
df_genere = pd.DataFrame(dati_genere)

# Visualizzazione 1: Confronto totale maschi
df_genere[['Maschi Originali', 'Maschi Simulati']].sum().plot(
    kind='bar',
    title="Totale Maschi - Originali vs Simulati"
)
plt.ylabel("Numero Studenti")
plt.tight_layout()
plt.show()

# Visualizzazione 2: Confronto totale femmine
df_genere[['Femmine Originali', 'Femmine Simulati']].sum().plot(
    kind='bar',
    title="Totale Femmine - Originali vs Simulati"
)
plt.ylabel("Numero Studenti")
plt.tight_layout()
plt.show()

# ============================================================================
# ANALISI 2: CONFRONTO DISTRIBUZIONE CITTADINANZA
# ============================================================================
"""
Verifico che la distribuzione di studenti italiani e stranieri sia
fedele ai dati originali. Questo è importante per garantire che il
dataset simulato rifletta la diversità presente nelle scuole reali.
"""

print("\n📊 ANALISI CITTADINANZA PER SCUOLA E ANNO:")

# Lista per raccogliere i dati di confronto
dati_citt = []

# Analizzo ogni combinazione scuola-anno presente nei dati originali
for _, row in df_citt.iterrows():
    scuola = row['codicescuola']
    anno = row['annocorso']

    # Filtro le classi simulate corrispondenti
    mask = (
            (df_classi['codicescuola'] == scuola) &
            (df_classi['annocorso'] == anno)
    )
    classi_rilevanti = df_classi[mask]['id_classe'].tolist()

    # Recupero gli studenti di queste classi
    studenti = df_studenti[df_studenti['id_classe'].isin(classi_rilevanti)]

    # Conto italiani e stranieri nel dataset simulato
    # Nota: nel simulato gli stranieri sono divisi in UE e NON_UE
    sim_ita = (studenti['cittadinanza'] == 'ITA').sum()
    sim_nonita = (studenti['cittadinanza'] != 'ITA').sum()  # UE + NON_UE

    # Recupero i valori originali
    ori_ita = row['alunnicittadinanzaitaliana']
    ori_nonita = row['alunnicittadinanzanonitaliana']

    # Calcolo le differenze percentuali
    perc_ita = percentuale_diff(sim_ita, ori_ita)
    perc_nonita = percentuale_diff(sim_nonita, ori_nonita)

    # Stampo il confronto dettagliato
    print(f"- {scuola} | anno {anno} → "
          f"ITA: {sim_ita}/{ori_ita} ({perc_ita:+}%), "
          f"NON_ITA: {sim_nonita}/{ori_nonita} ({perc_nonita:+}%)")

    # Raccolgo i dati per l'analisi aggregata
    dati_citt.append({
        'scuola': scuola,
        'anno': anno,
        'ITA Originali': ori_ita,
        'ITA Simulati': sim_ita,
        'NON_ITA Originali': ori_nonita,
        'NON_ITA Simulati': sim_nonita
    })

# Creo DataFrame per analisi e visualizzazioni
df_cittadinanza = pd.DataFrame(dati_citt)

# Visualizzazione 3: Confronto totale italiani
df_cittadinanza[['ITA Originali', 'ITA Simulati']].sum().plot(
    kind='bar',
    title="Totale Italiani - Originali vs Simulati"
)
plt.ylabel("Numero Studenti")
plt.tight_layout()
plt.show()

# Visualizzazione 4: Confronto totale stranieri
df_cittadinanza[['NON_ITA Originali', 'NON_ITA Simulati']].sum().plot(
    kind='bar',
    title="Totale Non Italiani - Originali vs Simulati"
)
plt.ylabel("Numero Studenti")
plt.tight_layout()
plt.show()

# ============================================================================
# STATISTICHE GENERALI SUL DATASET
# ============================================================================
"""
Produco statistiche riassuntive per dare una visione d'insieme del
dataset generato e verificare che tutti i componenti siano stati
creati correttamente.
"""

print("\n📌 STATISTICHE GENERALI SUL DATASET SIMULATO:")

# Conto le entità principali
print(f"🏫 Numero scuole simulate: {df_classi['codicescuola'].nunique()}")
print(f"🏷️ Numero classi: {len(df_classi)}")
print(f"👨‍🎓 Numero studenti: {len(df_studenti)}")
print(f"🧑‍🏫 Numero docenti: {len(df_docenti)}")
print(f"📚 Materie totali: {df_docenti['materia'].nunique()}")
print(f"📓 Assegnazioni docenti-classe: {len(df_assegnazioni)}")
print(f"📝 Numero voti registrati: {len(df_voti)}")

# ============================================================================
# NOTE FINALI E CONSIDERAZIONI
# ============================================================================
"""
Questo modulo di analisi è fondamentale per:

1. **Validazione**: Verifica che il dataset simulato sia fedele ai dati originali
2. **Debugging**: Identifica eventuali problemi nella generazione
3. **Documentazione**: Fornisce metriche sulla qualità della simulazione

I grafici prodotti mostrano visivamente quanto i dati simulati siano
vicini a quelli originali. Piccole differenze (< 5%) sono normali e
dovute agli arrotondamenti nella distribuzione degli studenti tra classi.

Se le differenze sono significative (> 10%), potrebbe essere necessario
rivedere gli algoritmi di generazione nel modulo genera_dati_simulati.py.

Il dataset finale può essere utilizzato per:
- Test di sistemi informativi scolastici
- Analisi statistiche sul sistema educativo
- Machine learning su dati educativi
- Formazione e dimostrazione di software gestionali

Tutti i dati sono completamente anonimi e rispettano la privacy.
"""
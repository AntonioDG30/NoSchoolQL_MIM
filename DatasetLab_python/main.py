"""
================================================================================
SCRIPT PRINCIPALE DI ORCHESTRAZIONE DELLA PIPELINE
================================================================================
Questo script coordina l'esecuzione sequenziale di tutti i moduli della pipeline
per la generazione di un dataset simulato del sistema scolastico italiano.

La pipeline è composta da 4 fasi principali:
1. Pulizia dei dati MIUR originali
2. Calcolo delle statistiche per la simulazione
3. Generazione dei dati simulati
4. Analisi del dataset prodotto

Autore: [Il tuo nome]
Data: [Data di creazione]
================================================================================
"""

import subprocess  # Per eseguire script Python esterni
import time  # Per misurare i tempi di esecuzione
import os  # Per gestire i percorsi dei file

# ============================================================================
# CONFIGURAZIONE
# ============================================================================
# Determino la directory corrente per costruire i percorsi relativi
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))


# ============================================================================
# FUNZIONI DI UTILITÀ
# ============================================================================
def esegui_script(nome_script, descrizione):
    """
    Eseguo uno script Python e monitoro il suo completamento.

    Questa funzione si occupa di:
    - Costruire il percorso completo dello script
    - Eseguirlo tramite subprocess
    - Misurare il tempo di esecuzione
    - Gestire eventuali errori fermando l'intera pipeline

    Args:
        nome_script (str): Nome del file Python da eseguire
        descrizione (str): Descrizione leggibile della fase per il logging

    Returns:
        None

    Raises:
        SystemExit: Se lo script fallisce, interrompo l'intera pipeline
    """
    # Costruisco il percorso completo dello script
    script_path = os.path.join(CURRENT_DIR, nome_script)

    # Informo l'utente dell'inizio della fase
    print(f"\nInizio: {descrizione} ({script_path})")

    # Registro il tempo di inizio per calcolare la durata
    inizio = time.time()

    try:
        # Eseguo lo script Python come processo separato
        # check=True solleva un'eccezione se lo script termina con errore
        subprocess.run(['python', script_path], check=True)

        # Calcolo e mostro il tempo impiegato
        durata = round(time.time() - inizio, 2)
        print(f"Completato: {descrizione} in {durata} secondi.")

    except subprocess.CalledProcessError as e:
        # Se lo script fallisce, informo l'utente e termino tutto
        print(f"❌ Errore durante l'esecuzione di {script_path}!")
        print(f"Dettagli: {e}")
        exit(1)  # Esco con codice di errore


# ============================================================================
# DEFINIZIONE DELLE FASI DELLA PIPELINE
# ============================================================================
# Definisco l'ordine preciso delle fasi e i loro script corrispondenti
# L'ordine è importante: ogni fase dipende dai risultati della precedente
fasi = [
    ('pulizia_mir.py', 'Pulizia dei file MIUR'),
    ('calcolo_statistiche.py', 'Generazione statistiche per simulazione'),
    ('genera_dati_simulati.py', 'Generazione dei dati simulati'),
    ('analisi_dataset.py', 'Analisi del dataset simulato')
]

# ============================================================================
# ESECUZIONE DELLA PIPELINE
# ============================================================================
# Messaggio di benvenuto che spiega cosa sta per accadere
print("🚀 Avvio pipeline completa: fasi 1 → 6\n")

# Eseguo ogni fase in sequenza
# Se una fase fallisce, la pipeline si interrompe automaticamente
for script, descrizione in fasi:
    esegui_script(script, descrizione)

# Se arrivo qui, tutte le fasi sono state completate con successo
print("\n🎉 Tutte le fasi completate con successo! Il dataset è pronto per essere usato.")

# ============================================================================
# NOTE PER L'UTILIZZO
# ============================================================================
"""
Per eseguire questo script:
    python main.py

Assicurarsi che:
- Tutti gli script delle fasi siano presenti nella stessa directory
- I file MIUR originali siano nella cartella ../file/dataset_originali/
- Si abbiano i permessi di scrittura nelle directory di output

In caso di errore:
- Controllare i log dell'ultima fase eseguita
- Verificare che i file di input esistano
- Controllare lo spazio su disco disponibile
"""
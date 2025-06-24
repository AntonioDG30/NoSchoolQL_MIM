# -*- coding: utf-8 -*-
# Imposto la codifica UTF-8 per supportare i caratteri italiani

import subprocess      # Uso subprocess per eseguire altri script Python come processi esterni
import time            # Uso time per misurare la durata di ogni fase
import os              # Uso os per gestire percorsi relativi e assoluti

# Percorso della cartella corrente dove si trova main.py
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

# Funzione per eseguire uno script e stampare messaggi leggibili
def esegui_script(nome_script, descrizione):
    script_path = os.path.join(CURRENT_DIR, nome_script)   # Calcolo il percorso assoluto dello script da eseguire
    print(f"\nInizio: {descrizione} ({script_path})")      # Stampo l'inizio della fase con descrizione
    inizio = time.time()                                   # Salvo il tempo iniziale

    try:
        subprocess.run(['python', script_path], check=True)   # Eseguo lo script con subprocess e controllo eventuali errori
        durata = round(time.time() - inizio, 2)               # Calcolo la durata della fase
        print(f"Completato: {descrizione} in {durata} secondi.")  # Messaggio di completamento
    except subprocess.CalledProcessError as e:                # In caso di errore
        print(f"❌ Errore durante l'esecuzione di {script_path}!")  # Messaggio d'errore personalizzato
        print(f"Dettagli: {e}")                                     # Mostro dettagli tecnici dell'eccezione
        exit(1)                                                    # Termino l'esecuzione dell'intera pipeline

# Ordine delle fasi
fasi = [
    ('pulizia_mir.py', 'Pulizia dei file MIUR'),                   # 1. Pulizia dei dati grezzi
    ('genera_stats.py', 'Generazione statistiche per simulazione'),# 2. Calcolo delle statistiche base
    ('genera_dati_simulati.py', 'Generazione dei dati simulati'),  # 3. Creazione del dataset fittizio
    ('analisi_dataset.py', 'Analisi del dataset simulato')         # 4. Analisi descrittiva finale
]

print("🚀 Avvio pipeline completa: fasi 1 → 6\n")  # Messaggio iniziale dell'intera pipeline

# Eseguo ogni fase una dopo l’altra
for script, descrizione in fasi:
    esegui_script(script, descrizione)

# Messaggio finale se tutto è andato bene
print("\n🎉 Tutte le fasi completate con successo! Il dataset è pronto per essere usato.")

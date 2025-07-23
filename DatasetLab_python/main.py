

import subprocess      
import time            
import os              

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

def esegui_script(nome_script, descrizione):
    script_path = os.path.join(CURRENT_DIR, nome_script)   
    print(f"\nInizio: {descrizione} ({script_path})")      
    inizio = time.time()                                  

    try:
        subprocess.run(['python', script_path], check=True)   
        durata = round(time.time() - inizio, 2)              
        print(f"Completato: {descrizione} in {durata} secondi.")  
    except subprocess.CalledProcessError as e:                
        print(f"❌ Errore durante l'esecuzione di {script_path}!")  
        print(f"Dettagli: {e}")                                     
        exit(1)                                                    

# Ordine delle fasi
fasi = [
    ('pulizia_mir.py', 'Pulizia dei file MIUR'),                   
    ('calcolo_statistiche.py', 'Generazione statistiche per simulazione'),
    ('genera_dati_simulati.py', 'Generazione dei dati simulati'),  
    ('analisi_dataset.py', 'Analisi del dataset simulato')        
]

print("🚀 Avvio pipeline completa: fasi 1 → 6\n") 
for script, descrizione in fasi:
    esegui_script(script, descrizione)

print("\n🎉 Tutte le fasi completate con successo! Il dataset è pronto per essere usato.")

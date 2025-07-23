import pandas as pd
import os


ModalitaRidotta = True
NUM_SCUOLE = 200

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

PATH_ANAG_SCUOLE = os.path.join(BASE_DIR, '../file/dataset_originali/AnagScuole.csv')
PATH_ANAG_SCUOLE_PA = os.path.join(BASE_DIR, '../file/dataset_originali/AnagScuoleProvAutonome.csv')
PATH_STU_CITTAD = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Cittad.csv')
PATH_STU_INDIRIZZO = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Indirizzo.csv')
PATH_STU_CORSO_CLASSE = os.path.join(BASE_DIR, '../file/dataset_originali/Stu_Corso_Classe_Genere.csv')


def normalize_string(x):
    return str(x).strip().upper()

def clean_string_columns(df):
    for col in df.select_dtypes(include='object'):
        df[col] = df[col].map(normalize_string)
    return df

def snake_case_columns(df):
    df.columns = [col.lower().replace(" ", "_") for col in df.columns]
    return df

def report_stats(name, original_len, cleaned_df):
    print(f"📊 {name}: {original_len} → {len(cleaned_df)} righe (rimossi {original_len - len(cleaned_df)})")

def sort_dataframe(df):
    sort_cols = [
        'codicescuola',
        'areageografica',
        'regione',
        'provincia',
        'codicecomunescuola',
        'descrizionecomune'
    ]
    valid_cols = [col for col in sort_cols if col in df.columns]
    return df.sort_values(by=valid_cols)


df_ordini = pd.read_csv(PATH_STU_CORSO_CLASSE, dtype=str)
df_ordini = clean_string_columns(df_ordini)
df_ordini = snake_case_columns(df_ordini)

scuole_secondarie = set(df_ordini[df_ordini['ordinescuola'] == 'SCUOLA SECONDARIA II GRADO']['codicescuola'])

drop_cols_anag = [
    'ANNOSCOLASTICO', 'CAPSCUOLA', 'INDIRIZZOSCUOLA',
    'INDICAZIONESEDEDIRETTIVO', 'INDICAZIONESEDEOMNICOMPRENSIVO',
    'INDIRIZZOEMAILSCUOLA', 'INDIRIZZOPECSCUOLA', 'SITOWEBSCUOLA',
    'SEDESCOLASTICA'
]

anag1 = pd.read_csv(PATH_ANAG_SCUOLE, dtype=str)
anag2 = pd.read_csv(PATH_ANAG_SCUOLE_PA, dtype=str)
anag = pd.concat([anag1, anag2], ignore_index=True)
original_len = len(anag)

anag.drop(columns=[c for c in drop_cols_anag if c in anag.columns], inplace=True)
anag = clean_string_columns(anag)
anag.drop_duplicates(subset=['CODICESCUOLA'], inplace=True)
anag.dropna(subset=['CODICESCUOLA', 'DENOMINAZIONESCUOLA', 'REGIONE', 'DESCRIZIONECOMUNE'], inplace=True)
anag = snake_case_columns(anag)
anag = anag[anag['codicescuola'].isin(scuole_secondarie)]
report_stats("Anagrafica Scuole", original_len, anag)


drop_cols_cittad = ['ANNOSCOLASTICO', 'ORDINESCUOLA']
stu_cittad = pd.read_csv(PATH_STU_CITTAD, dtype=str)
original_len = len(stu_cittad)

stu_cittad.columns = [normalize_string(col) for col in stu_cittad.columns]
stu_cittad.drop(columns=[normalize_string(c) for c in drop_cols_cittad if normalize_string(c) in stu_cittad.columns], inplace=True)
stu_cittad = clean_string_columns(stu_cittad)
stu_cittad.drop_duplicates(inplace=True)
stu_cittad.dropna(subset=[
    'CODICESCUOLA', 'ALUNNI', 'ALUNNICITTADINANZAITALIANA', 'ALUNNICITTADINANZANONITALIANA'
], inplace=True)
stu_cittad = snake_case_columns(stu_cittad)
stu_cittad = stu_cittad[stu_cittad['codicescuola'].isin(scuole_secondarie)]
report_stats("Studenti Cittadinanza", original_len, stu_cittad)


drop_cols_ind = ['ANNOSCOLASTICO', 'ORDINESCUOLA']
stu_ind = pd.read_csv(PATH_STU_INDIRIZZO, dtype=str)
original_len = len(stu_ind)

stu_ind.columns = [normalize_string(col) for col in stu_ind.columns]
stu_ind.drop(columns=[normalize_string(c) for c in drop_cols_ind if normalize_string(c) in stu_ind.columns], inplace=True)
stu_ind = clean_string_columns(stu_ind)
stu_ind = snake_case_columns(stu_ind)
stu_ind.dropna(subset=[
    'codicescuola', 'tipopercorso', 'indirizzo', 'alunnimaschi', 'alunnifemmine'
], inplace=True)
stu_ind.drop_duplicates(inplace=True)
stu_ind = stu_ind[stu_ind['codicescuola'].isin(scuole_secondarie)]
report_stats("Studenti per Indirizzo", original_len, stu_ind)


if ModalitaRidotta:
    meta_scuole = pd.merge(anag, stu_ind[['codicescuola', 'tipopercorso']], on='codicescuola', how='inner')
    meta_scuole = meta_scuole.drop_duplicates(subset=['codicescuola', 'tipopercorso'])

    gruppi = meta_scuole.groupby(['regione', 'tipopercorso'])
    scuole_per_gruppo = max(1, NUM_SCUOLE // len(gruppi))

    campione = pd.concat(
        [g.sample(n=min(scuole_per_gruppo, len(g)), random_state=42) for _, g in gruppi],
        ignore_index=True
    )

    scuole_attuali = set(campione['codicescuola'])
    if len(scuole_attuali) < NUM_SCUOLE:
        disponibili = set(meta_scuole['codicescuola']) - scuole_attuali
        extra = meta_scuole[meta_scuole['codicescuola'].isin(disponibili)].sample(
            n=NUM_SCUOLE - len(scuole_attuali), random_state=42
        )
        campione = pd.concat([campione, extra], ignore_index=True)

    scuole_finali = set(campione['codicescuola'])
    anag = anag[anag['codicescuola'].isin(scuole_finali)]
    stu_cittad = stu_cittad[stu_cittad['codicescuola'].isin(scuole_finali)]
    stu_ind = stu_ind[stu_ind['codicescuola'].isin(scuole_finali)]

    print(f"\n✅ Campione finale: {len(anag)} scuole (ridotto a {NUM_SCUOLE})")


anag = sort_dataframe(anag)
stu_cittad = sort_dataframe(stu_cittad)
stu_ind = sort_dataframe(stu_ind)

out_dir = os.path.join(BASE_DIR, '../file/dataset_puliti')
os.makedirs(out_dir, exist_ok=True)

anag.to_csv(os.path.join(out_dir, 'anagrafica_scuole_pulita.csv'), index=False)
stu_cittad.to_csv(os.path.join(out_dir, 'stu_cittadinanza_pulito.csv'), index=False)
stu_ind.to_csv(os.path.join(out_dir, 'stu_indirizzi_pulito.csv'), index=False)

print("\n✅ File ordinati e salvati nella cartella 'dataset_puliti'.")

codici = set(anag['codicescuola'])
assert set(stu_cittad['codicescuola']).issubset(codici), "⚠️ stu_cittad contiene codici non coerenti"
assert set(stu_ind['codicescuola']).issubset(codici), "⚠️ stu_ind contiene codici non coerenti"
print("✅ Verifica finale: tutti i file sono coerenti.")

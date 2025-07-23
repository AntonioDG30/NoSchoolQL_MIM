/**
 * SISTEMA DI TEMI PER L'APPLICAZIONE
 * 
 * Definisco i temi chiaro e scuro per l'interfaccia utente.
 * Ogni tema include:
 * - Colori di base (background, testi, bordi)
 * - Colori semantici (primary, success, danger, ecc.)
 * - Ombre e gradienti
 * - Colori specifici per i grafici
 * 
 * Il sistema supporta il cambio dinamico del tema e si integra
 * con le preferenze del sistema operativo.
 * 
 * @author Antonio Di Giorgio
 */

const temi = {
  // ===========================
  // TEMA CHIARO
  // ===========================
  light: {
    // Colori di sfondo
    background: '#f8fafc',                    // Sfondo principale grigio molto chiaro
    backgroundSecondary: '#ffffff',           // Sfondo secondario bianco puro
    backgroundTertiary: '#f1f5f9',           // Sfondo terziario grigio chiaro

    // Colori del testo
    text: '#0f172a',                         // Testo principale nero/blu molto scuro
    textSecondary: '#475569',                // Testo secondario grigio scuro
    textTertiary: '#94a3b8',                 // Testo terziario grigio medio

    // Colori dei bordi
    border: '#e2e8f0',                       // Bordo principale grigio chiaro
    borderSecondary: '#cbd5e1',              // Bordo secondario grigio medio

    // Sfondi specifici per componenti
    cardBackground: '#ffffff',               // Sfondo delle card
    cardHover: '#f8fafc',                   // Sfondo card on hover
    headerBackground: 'rgba(255, 255, 255, 0.9)', // Sfondo header con trasparenza
    sidebarBackground: '#ffffff',            // Sfondo sidebar

    // ===========================
    // COLORI SEMANTICI
    // ===========================
    
    // Colore primario (blu)
    primary: '#3b82f6',                      // Blu principale
    primaryHover: '#2563eb',                 // Blu hover (più scuro)
    primaryLight: '#dbeafe',                 // Blu chiaro per sfondi
    primaryDark: '#1e40af',                  // Blu molto scuro

    // Colore secondario (grigio)
    secondary: '#64748b',                    // Grigio principale
    secondaryHover: '#475569',               // Grigio hover
    secondaryLight: '#f1f5f9',               // Grigio chiaro

    // Colore successo (verde)
    success: '#10b981',                      // Verde principale
    successHover: '#059669',                 // Verde hover
    successLight: '#d1fae5',                 // Verde chiaro

    // Colore pericolo (rosso)
    danger: '#ef4444',                       // Rosso principale
    dangerHover: '#dc2626',                  // Rosso hover
    dangerLight: '#fee2e2',                  // Rosso chiaro

    // Colore avviso (giallo/arancione)
    warning: '#f59e0b',                      // Arancione principale
    warningHover: '#d97706',                 // Arancione hover
    warningLight: '#fef3c7',                 // Arancione chiaro

    // Colore informazione (blu)
    info: '#3b82f6',                         // Blu info
    infoHover: '#2563eb',                    // Blu info hover
    infoLight: '#dbeafe',                    // Blu info chiaro

    // ===========================
    // OMBRE
    // ===========================
    
    shadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.06)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.06)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.05)',
    shadowXl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)',

    // ===========================
    // GRADIENTI
    // ===========================
    
    gradientPrimary: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    gradientSecondary: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    gradientHero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',

    // ===========================
    // COLORI PER GRAFICI
    // ===========================
    
    chartColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  },

  // ===========================
  // TEMA SCURO
  // ===========================
  dark: {
    // Colori di sfondo
    background: '#0f172a',                    // Sfondo principale blu molto scuro
    backgroundSecondary: '#1e293b',           // Sfondo secondario blu scuro
    backgroundTertiary: '#334155',            // Sfondo terziario blu-grigio

    // Colori del testo
    text: '#f1f5f9',                         // Testo principale bianco/grigio chiaro
    textSecondary: '#cbd5e1',                // Testo secondario grigio chiaro
    textTertiary: '#94a3b8',                 // Testo terziario grigio medio

    // Colori dei bordi
    border: '#334155',                       // Bordo principale blu-grigio
    borderSecondary: '#475569',              // Bordo secondario grigio

    // Sfondi specifici per componenti
    cardBackground: '#1e293b',               // Sfondo delle card
    cardHover: '#334155',                    // Sfondo card on hover
    headerBackground: 'rgba(30, 41, 59, 0.9)', // Sfondo header con trasparenza
    sidebarBackground: '#1e293b',            // Sfondo sidebar

    // ===========================
    // COLORI SEMANTICI
    // ===========================
    
    // Colore primario (blu)
    primary: '#3b82f6',                      // Blu principale
    primaryHover: '#60a5fa',                 // Blu hover (più chiaro nel tema scuro)
    primaryLight: '#1e3a8a',                 // Blu scuro per sfondi
    primaryDark: '#1e40af',                  // Blu molto scuro

    // Colore secondario (grigio)
    secondary: '#64748b',                    // Grigio principale
    secondaryHover: '#94a3b8',               // Grigio hover
    secondaryLight: '#334155',               // Grigio scuro

    // Colore successo (verde)
    success: '#10b981',                      // Verde principale
    successHover: '#34d399',                 // Verde hover
    successLight: '#064e3b',                 // Verde scuro

    // Colore pericolo (rosso)
    danger: '#ef4444',                       // Rosso principale
    dangerHover: '#f87171',                  // Rosso hover
    dangerLight: '#7f1d1d',                  // Rosso scuro

    // Colore avviso (giallo/arancione)
    warning: '#f59e0b',                      // Arancione principale
    warningHover: '#fbbf24',                 // Arancione hover
    warningLight: '#78350f',                 // Arancione scuro

    // Colore informazione (blu)
    info: '#3b82f6',                         // Blu info
    infoHover: '#60a5fa',                    // Blu info hover
    infoLight: '#1e3a8a',                    // Blu info scuro

    // ===========================
    // OMBRE (più sottili nel tema scuro)
    // ===========================
    
    shadow: '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)',
    shadowXl: '0 20px 25px rgba(0, 0, 0, 0.3), 0 10px 10px rgba(0, 0, 0, 0.2)',

    // ===========================
    // GRADIENTI
    // ===========================
    
    gradientPrimary: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    gradientSecondary: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    gradientDanger: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
    gradientWarning: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    gradientHero: 'linear-gradient(135deg, #4c1d95 0%, #2e1065 100%)',

    // ===========================
    // COLORI PER GRAFICI
    // ===========================
    
    // Nel tema scuro uso colori più vivaci per i grafici per migliorare la leggibilità
    chartColors: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6']
  }
};

// ===========================
// FUNZIONI UTILITY PER I TEMI
// ===========================

/**
 * Ottengo il tema corrente basandomi sulla preferenza salvata o sul sistema.
 * 
 * Questa funzione controlla prima se l'utente ha salvato una preferenza
 * nel localStorage. Se non trova nulla, controlla le preferenze del sistema
 * operativo usando la media query 'prefers-color-scheme'.
 * 
 * @returns {string} 'light' o 'dark'
 */
export function ottieniTemaCorrente() {
  // Controllo prima il localStorage per una preferenza salvata
  const temaSalvato = localStorage.getItem('tema');
  
  if (temaSalvato && (temaSalvato === 'light' || temaSalvato === 'dark')) {
    return temaSalvato;
  }
  
  // Se non c'è una preferenza salvata, controllo le preferenze del sistema
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // Default al tema chiaro
  return 'light';
}

/**
 * Salvo la preferenza del tema nel localStorage.
 * 
 * @param {string} tema - 'light' o 'dark'
 */
export function salvaTemaPreferito(tema) {
  if (tema === 'light' || tema === 'dark') {
    localStorage.setItem('tema', tema);
  }
}

/**
 * Applico il tema all'elemento root del documento.
 * 
 * Questa funzione aggiunge o rimuove la classe 'dark' dall'elemento html,
 * che viene utilizzata dai CSS per applicare gli stili del tema scuro.
 * 
 * @param {string} tema - 'light' o 'dark'
 */
export function applicaTemaAlDocumento(tema) {
  const htmlElement = document.documentElement;
  
  if (tema === 'dark') {
    htmlElement.classList.add('dark');
  } else {
    htmlElement.classList.remove('dark');
  }
}

/**
 * Ottengo i colori del tema specificato.
 * 
 * @param {string} nomeTema - 'light' o 'dark'
 * @returns {Object} Oggetto con tutti i colori del tema
 */
export function ottieniColoriTema(nomeTema) {
  return temi[nomeTema] || temi.light;
}

/**
 * Genero una palette di colori per i grafici basandomi sul tema.
 * 
 * Questa funzione può generare palette con un numero variabile di colori,
 * ripetendo i colori base se necessario.
 * 
 * @param {string} nomeTema - 'light' o 'dark'
 * @param {number} numeroColori - Numero di colori richiesti
 * @returns {Array<string>} Array di colori esadecimali
 */
export function generaPaletteGrafici(nomeTema, numeroColori = 6) {
  const tema = temi[nomeTema] || temi.light;
  const coloriBase = tema.chartColors;
  const palette = [];
  
  // Genero la palette ripetendo i colori base se necessario
  for (let i = 0; i < numeroColori; i++) {
    palette.push(coloriBase[i % coloriBase.length]);
  }
  
  return palette;
}

// ===========================
// EXPORT DEFAULT
// ===========================

export default temi;
const globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* Animations */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes expandHeight {
    from {
      opacity: 0;
      max-height: 0;
      transform: scaleY(0);
    }
    to {
      opacity: 1;
      max-height: 1000px;
      transform: scaleY(1);
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Utility classes */
  .animate-slide-in {
    animation: slideIn 0.3s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInFromRight 0.3s ease-out;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-expand {
    animation: expandHeight 0.3s ease-out;
    transform-origin: top;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }

  /* Responsive utilities */
  @media (max-width: 1024px) {
    .hide-tablet {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .hide-mobile {
      display: none !important;
    }
    
    .mobile-full-width {
      width: 100% !important;
    }
    
    .mobile-stack {
      flex-direction: column !important;
    }
  }

  /* Smooth transitions for theme changes */
  * {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  /* Glass effect */
  .glass {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
  }

  /* Custom focus styles */
  input:focus, select:focus, textarea:focus, button:focus {
    outline: none;
  }
`;

// Inject global styles
if (typeof document !== 'undefined' && !document.getElementById('registro-modern-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'registro-modern-styles';
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}
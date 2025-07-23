const globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInDown {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInUp {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  @keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
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

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  .animate-slideIn {
    animation: slideIn 0.6s ease-out;
  }

  .animate-slide-in-down {
    animation: slideInDown 0.6s ease-out;
  }

  .animate-slide-in-up {
    animation: slideInUp 0.6s ease-out;
  }

  .animate-slide-in-left,
  .animate-slideInLeft {
    animation: slideInLeft 0.6s ease-out;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.6s ease-out;
  }

  .animate-scale-in,
  .animate-scaleIn {
    animation: scaleIn 0.6s ease-out;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  .animate-rotate {
    animation: spin 20s linear infinite;
  }

  .animate-wave {
    animation: wave 2s ease-in-out infinite;
  }

  .animate-expand {
    animation: expandHeight 0.3s ease-out;
    transform-origin: top;
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .skeleton-dark {
    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hover-lift:hover {
    transform: translateY(-6px);
  }

  .glass {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
  }

  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  input:focus,
  select:focus,
  textarea:focus,
  button:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    .hide-mobile {
      display: none !important;
    }

    .mobile-stack {
      flex-direction: column !important;
    }

    .mobile-full-width {
      width: 100% !important;
    }
  }

  @media (max-width: 1024px) {
    .hide-tablet {
      display: none !important;
    }
  }

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
`;

if (typeof document !== 'undefined' && !document.getElementById('global-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'global-styles';
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}

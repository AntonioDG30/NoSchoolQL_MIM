import { useTheme } from '../../../context/ThemeContext';


const ParticleBackground = () => {
  const [theme] = useTheme();
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    animationDuration: Math.random() * 20 + 10,
    animationDelay: Math.random() * 20
  }));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            backgroundColor: theme.primary,
            opacity: 0.1,
            left: `${particle.left}%`,
            bottom: '-20px',
            animation: `float ${particle.animationDuration}s ease-in-out ${particle.animationDelay}s infinite`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
import { useTheme } from '../../../context/AppContext';
import themes from '../../../theme/themes';

const Skeleton = ({ width = '60px', height = '32px' }) => {
  const [theme] = useTheme();
  
  return (
    <div
      className={theme.background === themes.dark.background ? 'skeleton-dark' : 'skeleton'}
      style={{
        width,
        height,
        borderRadius: '4px',
        display: 'inline-block'
      }}
    />
  );
};

export default Skeleton;
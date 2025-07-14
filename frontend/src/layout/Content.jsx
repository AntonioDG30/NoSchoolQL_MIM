const Content = ({ children }) => {
  const contentStyle = {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    overflowX: 'hidden'
  };

  return <div style={contentStyle}>{children}</div>;
};

export default Content;
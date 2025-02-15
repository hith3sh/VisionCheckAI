import React from 'react';
import { Outlet } from 'react-router-dom';

const styles = {
  container: {
    position: 'absolute',
    top: '200px',
    textAlign: 'center',
    width: '100%',
    fontSize: '70px',
    fontWeight: 'bold',
    color: 'grey',
  },
};

const NoPage = () => {
  return (
    <div style={styles.container}>
      ERROR 404. Page Not Found
      <Outlet />
    </div>
  );
};

export default NoPage;

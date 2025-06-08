// components/Footer.jsx
import React from 'react';

const Footer = () => (
  <footer
    style={{
      backgroundColor: '#222',
      color: '#eee',
      textAlign: 'center',
      padding: '1rem',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      marginTop: '20px'
    }}
  >
    © {new Date().getFullYear()} Made by Satyam Pandey. All rights reserved.
  </footer>
);

export default Footer;

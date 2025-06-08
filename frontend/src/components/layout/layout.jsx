import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 120px)', padding: '1rem' }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default Layout;

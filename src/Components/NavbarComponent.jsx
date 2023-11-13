import React, { useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';

function NavbarComponent({ darkMode, toggleDarkMode }) {
  return (
    <Navbar className={`bg-${darkMode ? 'dark' : 'light'} w-100`} style={{ width: '100%' }}>
      <Container>
        <Navbar.Brand>
          <i className={`fa-solid fa-file fa-beat-fade text-${darkMode ? 'light' : 'dark'}`}></i> Doc App
        </Navbar.Brand>
        <i className={`fa-solid ${darkMode ? 'fa-bolt' : 'fa-moon'} fs-2`} onClick={toggleDarkMode}></i>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;

// src/components/Sidebar/index.js

import React, { useState } from 'react';
import styles from './sidebar.module.css';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

  return (
    <div className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`} onClick={toggleSidebar}>
      <img className='logo'src="/logo.jpg" alt="Logo" />
      <a href="/"><i className="icon-home"></i><span className={styles.text}>Home</span></a>
      <a href="/financial"><i className="icon-service"><img src='/pasta-financeiro.svg'></img></i><span className={styles.text}>Financeiro</span></a>
      <a href="#services"><i className="icon-service"></i><span className={styles.text}>Serviços</span></a>
      <a href="#contact"><i className="icon-contact"></i><span className={styles.text}>Pessoas</span></a>
      
    </div>
  );
}

export default Sidebar;

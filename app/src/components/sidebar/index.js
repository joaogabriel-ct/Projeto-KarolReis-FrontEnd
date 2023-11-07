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
      <a href="/"><i className="fa fa-fw fa-home"></i><span className={styles.text}>Home</span></a>
      <a href="/financial"><i className="fa fa-fw fa-folder"></i><span className={styles.text}>Financeiro</span></a>
      <a href="/services"><i className="fa fa-fw fa-gear"></i><span className={styles.text}>Serviços</span></a>
      <a href="#contact"><i className="fa fa-fw fa-user"></i><span className={styles.text}>Pessoas</span></a>
      
    </div>
  );
}

export default Sidebar;

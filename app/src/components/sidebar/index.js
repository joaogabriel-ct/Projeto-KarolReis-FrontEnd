import React, { useState } from 'react';
import styles from './sidebar.module.css';
import Link from 'next/link';


function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`} onClick={toggleSidebar}>
            <img className='logo' src="/logo.jpg" alt="Logo" />
            <Link href="/home">
                <i className="fa fa-fw fa-home"></i><span className={styles.text}>Home</span>
            </Link>
            <Link href="/financeiro">
                <i className="fa fa-fw fa-folder"></i><span className={styles.text}>Financeiro</span>
            </Link>
            <Link href='/service'>
                <i className="fa fa-fw fa-gear"></i><span className={styles.text}>Serviços</span>
            </Link>
            <Link href="/pessoas">
                <i className="fa fa-fw fa-user"></i><span className={styles.text}>Pessoas</span>
            </Link>
        </div>
    );
}

export default Sidebar;

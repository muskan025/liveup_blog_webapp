/* eslint-disable react/prop-types */
import { createPortal } from 'react-dom'
import styles from "./styles/styles.module.css"
import { useEffect, useState } from 'react';

const Modal = ({isOpen,onClose,children}) => {

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 300);  
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen ) return null;
    
  return createPortal(
    <div className={`${styles.modal_overlay} ${!isOpen?styles.hide:''}`} onClick={onClose}>
      <div className={`${styles.modal_content} ${!isOpen ? styles.hide : ''}`} onClick={ e=>e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('portal')
  )
}

export default Modal

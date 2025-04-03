import Toast from 'react-bootstrap/Toast';
import { useState } from 'react';
import './toast.css'
import ToastContainer from 'react-bootstrap/ToastContainer';
const ToastTable = (showToast) => {
    const [show, setShow] = useState(showToast);

    return (
        <ToastContainer
            className="p-3 "
            position='top-start'
            
        >
            <Toast  onClose={() => setShow(false)} show={show} delay={3000} autohide>
                <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">Dados carregados</strong>
                </Toast.Header>
                <Toast.Body className='toast-style'>Em caso de faltar informações, atualizar a página.</Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastTable;
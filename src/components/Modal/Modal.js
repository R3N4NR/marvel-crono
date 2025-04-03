import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import './Modal.css'
const CoverModal = ({ src, show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="text-center">
                <Image className="cover" src={src} alt="movie-cover" fluid />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CoverModal;

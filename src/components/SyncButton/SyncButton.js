import axios from 'axios';
import { Button } from 'react-bootstrap';
import './button.css'
const SyncButton = () => {

    const ExecutarScript = async () => {
        try {
            const response = await axios.post("http://localhost:3001/run-script");
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao executar o script:", error);
        }
    }
    return (
        <>
            <Button onClick={ExecutarScript}>Executar Script</Button>
        </>
    )
}

export default SyncButton
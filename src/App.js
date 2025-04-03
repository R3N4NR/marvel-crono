import './App.css';
import { Container } from 'react-bootstrap';
import Header from './components/Header/Header';
import MainTable from './components/table/table';

function App() {
  return (
    <Container fluid className="bg-dark text-white min-vh-100 ">
      <Header />
      <MainTable />
    </Container>
  );
}

export default App;
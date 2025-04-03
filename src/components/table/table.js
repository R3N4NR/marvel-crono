import * as React from "react";
import { useEffect, useState } from "react";
import { Table, Header, HeaderRow, Body, Row as TableRow, HeaderCell, Cell } from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { io } from "socket.io-client";
import SyncButton from "../SyncButton/SyncButton";
import CoverModal from "../Modal/Modal";
import Loading from "../Spinner/Spinner";
import ToastTable from "../Toast/Toast";

const MainTable = () => {
  const [data, setData] = useState({ nodes: [] }); 
  const [loading, setLoading] = useState(true); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const SOCKET_URL = "http://localhost:3001";

  
  const fetchData = async () => {
    setLoading(true); 
    try {
      console.log("🔄 Buscando JSON...");
      const response = await fetch("http://localhost:3001/api/data/marvel_movies.json");
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

      const jsonData = await response.json();
      console.log("✅ JSON recebido:", jsonData);

      
      if (!Array.isArray(jsonData)) {
        console.error("❌ Estrutura inesperada do JSON:", jsonData);
        setData({ nodes: [] });
      } else {
        setData({ nodes: jsonData }); 
      }
    } catch (error) {
      console.error("❌ Erro ao buscar JSON:", error);
      setData({ nodes: [] }); 
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchData();
  }, []);

  
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("data_updated", (updatedData) => {
      console.log("🔄 Dados recebidos via WebSocket:", updatedData);
      setData({ nodes: updatedData });
      setShowToast(true);
    });

    return () => socket.disconnect();
  }, []);

  
  const handleButtonClick = () => {
    setLoading(true); 
    fetch("http://localhost:3001/run-script", { method: "POST" })
      .then((response) => response.json())
      .then(() => fetchData())
      .catch((error) => {
        console.error("Erro ao executar script:", error);
        setLoading(false);
      });
  };

  // Tema para a tabela
  const theme = useTheme({
    Table: `--data-table-library_grid-template-columns: 10% 30% 15% 15% 10% 20%;`,
  });

  return (
    <Container className="d-flex justify-content-center flex-column" fluid>
      {showToast && <ToastTable showToast={showToast} />}
      {loading ? (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Loading animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Loading>
        </Container>
      ) : data.nodes.length === 0 ? (
        <Container className="d-flex justify-content-center align-items-center flex-column">
          <SyncButton onClick={handleButtonClick} />
          <p>Arquivo JSON não encontrado ou vazio.</p>
        </Container>
      ) : (
        <Container className="d-flex justify-content-center flex-column" fluid>
          <Row className="d-flex justify-content-center">
            <Col className="d-flex justify-content-center">
              <Table data={data} theme={theme} layout={{ custom: true }}>
                {(tableList) => (
                  <>
                    <Header>
                      <HeaderRow>
                        <HeaderCell>Ranking</HeaderCell>
                        <HeaderCell>Título</HeaderCell>
                        <HeaderCell>Tomatômetro</HeaderCell>
                        <HeaderCell>Pipocômetro</HeaderCell>
                        <HeaderCell>Ano</HeaderCell>
                        <HeaderCell>Imagem</HeaderCell>
                      </HeaderRow>
                    </Header>
                    <Body>
                      {tableList.map((item) => (
                        <TableRow key={item.Ranking} item={item}>
                          <Cell>{item.Ranking}</Cell>
                          <Cell>{item?.Título || "Sem título"}</Cell>
                          <Cell>{item.Tomatometro || "N/A"}</Cell>
                          <Cell>{item.Pipocometro || "N/A"}</Cell>
                          <Cell>{item.Ano || "Desconhecido"}</Cell>
                          <Cell>
                            <Button  variant="link" onClick={() => setSelectedImage(item.Imagem)} style={{ padding: 0, border: "none" }}>
                              <Image
                                src={item.Imagem}
                                alt={item.Título || "Sem título"}
                                style={{ width: "80px", height: "110px", cursor: "pointer" }}
                              />
                            </Button>
                          </Cell>
                        </TableRow>
                      ))}
                    </Body>
                  </>
                )}
              </Table>
            </Col>
          </Row>
        </Container>
      )}

      {/* Modal para exibir imagens */}
      {selectedImage && (
        <CoverModal
          src={selectedImage}
          show={!!selectedImage}
          handleClose={() => setSelectedImage(null)}
        />
      )}
    </Container>
  );
};

export default MainTable;

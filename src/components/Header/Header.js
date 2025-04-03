import { Container, Row, Col, Image } from 'react-bootstrap';

const Header = () => {
  return (
    <Container className='bg-dark text-white' fluid>
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center mt-5">
          <Image src="/assets/art_header_2.jpg" width='30%' fluid />
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col className="d-flex justify-content-center mt-5">
          <h4>Os filmes da Marvel em ordem Cronológica</h4>
        </Col>
      </Row>
    </Container>
  );
};

export default Header;
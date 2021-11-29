import React, { useState, useEffect, useRef } from 'react';
// https://github.com/tensorflow/tfjs-models#readme
import * as mobilenet from '@tensorflow-models/mobilenet';
// Bootstrap
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
// Custom Components
import Spinner from './components/Spinner/Spinner';
// Custom Style
import styles from './App.module.css';

function App() {
  const [isModalLoading, setisModalLoading] = useState(false); // Boolean
  const [model, setModel] = useState(null); // Object
  const [imageURL, setImageURL] = useState(null); //

  const imageRef = useRef();

  const loadModel = async () => {
    setisModalLoading(true);
    try {
      // Load the mobilenet Model
      const model = await mobilenet.load();
      setModel(model);
      console.log(typeof model);
      setisModalLoading(false);
    } catch (error) {
      console.log(error);
      setisModalLoading(false);
    }
  };

  const uploadImage = (event) => {
    console.log(event);
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  // @param effect — Imperative function that can return a cleanup function
  // @param deps — If present, effect will only activate if the values in the list change.
  useEffect(() => {
    loadModel();
  }, []);

  if (isModalLoading) {
    return <Spinner />;
  }

  console.log(imageURL);

  return (
    <React.Fragment>
      <Container>
        {/* Header / Title */}
        <Row>
          <h1 className={styles.title}>Identification d'images</h1>
        </Row>
        {/* File Input */}
        <Row>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Choisir le fichier</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={uploadImage} />
          </Form.Group>
        </Row>
        <Row>
          <Col>
            {/* If imageURL is not null will show <Image> */}
            {imageURL && (
              <Image
                className="mb-2"
                alt="Aperçu du téléchargement"
                crossOrigin="anonymous"
                src={imageURL}
                ref={imageRef}
                thumbnail
              />
            )}
          </Col>
        </Row>
        {imageURL && (
          <Button className="float-end" variant="success" size="lg">
            Identifier l'image
          </Button>
        )}
      </Container>
    </React.Fragment>
  );
}

export default App;

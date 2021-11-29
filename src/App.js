import React, { useState, useEffect, useRef } from 'react';
// Import @tensorflow/tfjs-core
import * as tf from '@tensorflow/tfjs-core';
// Adds the WebGL backend to the global backend registry.
import '@tensorflow/tfjs-backend-webgl';
// https://github.com/tensorflow/tfjs-models#readme
import * as mobilenet from '@tensorflow-models/mobilenet';
// Bootstrap
import Accordion from 'react-bootstrap/Accordion';
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
  const [isModalLoading, setisModalLoading] = useState(false); // boolean
  const [model, setModel] = useState(null); // object
  const [imageURL, setImageURL] = useState(null); // string
  const [results, setResults] = useState([]); // object

  const imageRef = useRef();

  const loadModel = async () => {
    setisModalLoading(true);
    try {
      // Load the mobilenet Model
      const model = await mobilenet.load();
      setModel(model);
      console.log('loadModel() - const model ', model);
      setisModalLoading(false);
    } catch (error) {
      console.log(error);
      setisModalLoading(false);
    }
  };

  const uploadImage = (event) => {
    // console.log(event);
    const { files } = event.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      console.log('uploadImage() - const url ', url);
      setImageURL(url);
    } else {
      setImageURL(null);
    }
  };

  const identify = async () => {
    // `classify` takes an input image element and returns an array with top classes and their probabilities.
    // `current` points to the mounted element
    const results = await model.classify(imageRef.current);
    console.log('identify() - const results ', results);
    setResults(results);
  };

  // @param effect — Imperative function that can return a cleanup function
  // @param deps — If present, effect will only activate if the values in the list change.
  // Passing an empty object to deps will make it load only once
  useEffect(() => {
    loadModel();
  }, []);

  if (isModalLoading) {
    return <Spinner />;
  }

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
          <Col lg={9}>
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
          <Col lg={3}>
            {/* If imageURL is not null will show <Image> */}
            {results.length > 0 && (
              <React.Fragment>
                {results.map((element, index) => {
                  return (
                    <Accordion flush>
                      <Accordion.Item eventKey={index}>
                        <Accordion.Header>
                          {element.className} {index === 0 && `Best Guess`}
                        </Accordion.Header>
                        <Accordion.Body>
                          Classname: {element.className}
                          <br />
                          Probability: {(element.probability * 100).toFixed(2)}%
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  );
                })}
              </React.Fragment>
            )}
          </Col>
        </Row>
        {imageURL && (
          <Button className="float-end" variant="success" size="lg" onClick={identify}>
            Identifier l'image
          </Button>
        )}
      </Container>
    </React.Fragment>
  );
}

export default App;

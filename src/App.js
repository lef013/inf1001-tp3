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
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
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
  // const fileInputRef = useRef();
  const textInputUrlRef = useRef();

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

  // const fileChangeHandler = (event) => {
  //   // console.log(event);
  //   const { files } = event.target;
  //   if (files.length > 0) {
  //     const url = URL.createObjectURL(files[0]);
  //     console.log('fileChangeHandler() - const url ', url);
  //     setImageURL(url);
  //   } else {
  //     setImageURL(null);
  //   }
  // };

  const urlChangeHandler = (event) => {
    // console.log(event);
    setImageURL(event.target.value);
    console.log('urlChangeHandler() - value ', event.target.value);
  };

  const identify = async () => {
    // `classify` takes an input image element and returns an array with top classes and their probabilities.
    // `current` points to the mounted element
    textInputUrlRef.current.value = null;
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
          {/* <Col md={6}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Choisir le fichier</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={fileChangeHandler} />
            </Form.Group>
          </Col> */}
          <Col>
            <Form.Group controlId="formUrl" className="mb-3">
              <Form.Label>Copier un lien URL</Form.Label>
              <Form.Control type="text" placeholder="URL..." ref={textInputUrlRef} onChange={urlChangeHandler} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={9} className={styles.image__col}>
            {/* If imageURL is not null will show <Image> */}
            {imageURL && (
              <Image
                className={styles.image}
                alt="Aperçu du téléchargement"
                crossOrigin="anonymous"
                src={imageURL}
                ref={imageRef}
                thumbnail
              />
            )}
          </Col>
          <Col md={3}>
            {/* If imageURL is not null will show <Image> */}
            {results.length > 0 && (
              <React.Fragment>
                {results.map((element, index) => {
                  return (
                    <ListGroup as="ol" className="mb-2" key={index}>
                      <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{element.className}</div>
                          {(element.probability * 100).toFixed(2)}%
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
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

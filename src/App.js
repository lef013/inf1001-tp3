/*******************************************************************************
 * IMPORTS
 ******************************************************************************/
import React, { useState, useEffect, useRef } from 'react';
// Backend Web Graphic Librairy for the browser
import '@tensorflow/tfjs-backend-webgl';
// https://github.com/tensorflow/tfjs-models#readme
import * as mobilenet from '@tensorflow-models/mobilenet';
// Bootstrap
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
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
  /*******************************************************************************
   * STATE
   ******************************************************************************/
  // https://reactjs.org/docs/hooks-state.html
  const [isModalLoading, setisModalLoading] = useState(false); // boolean
  const [model, setModel] = useState(null); // object
  const [imageURL, setImageURL] = useState(null); // string
  const [results, setResults] = useState([]); // object
  const [showModelError, setShowModelError] = useState(false); // boolean

  /*******************************************************************************
   * UI / REF
   ******************************************************************************/
  // https://reactjs.org/docs/hooks-reference.html#useref
  const imageRef = useRef();
  const textInputUrlRef = useRef();

  /*******************************************************************************
   * ON MOUNT
   ******************************************************************************/
  // https://reactjs.org/docs/hooks-effect.html
  // Passing an empty object to deps will make it load only once
  // @param effect — Imperative function that can return a cleanup function
  // @param deps — If present, effect will only activate if the values in the list change.
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    setisModalLoading(true);
    try {
      // Load the mobilenet Model
      const model = await mobilenet.load();
      setModel(model);
      // console.log('loadModel() - const model ', model);
      setisModalLoading(false);
    } catch (error) {
      // console.log(error);
      setisModalLoading(false);
      setShowModelError(true);
    }
  };
  /*******************************************************************************
   * ON UPDATE
   ******************************************************************************/

  /*******************************************************************************
   * HANDLERS
   ******************************************************************************/
  const clickAlertHandler = () => {
    window.location.reload();
  };

  const urlChangeHandler = (event) => {
    // console.log(event);
    setImageURL(event.target.value);
    // console.log('urlChangeHandler() - value ', event.target.value);
    setResults([]);
  };

  const identifyHandler = async () => {
    // `classify` takes an input image element and returns an array with top classes and their probabilities.
    // `current` points to the mounted element
    textInputUrlRef.current.value = null;
    const results = await model.classify(imageRef.current);
    // console.log('identify() - const results ', results);
    setResults(results);
  };

  /*******************************************************************************
   * RETURN
   ******************************************************************************/
  if (isModalLoading) {
    return <Spinner />;
  }

  if (showModelError) {
    return (
      <Container>
        <Alert className={styles.alert} variant="danger" onClose={() => clickAlertHandler()} dismissible>
          <Alert.Heading>Erreur</Alert.Heading>
          <p>
            Ouvrir la console pour voir l'erreur.
            <br />
            En fermant cette alerte, vous allez rafraîchir la page.
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <Container>
        {/* Header / Title */}
        <Row>
          <h1 className={styles.title}>Identification d'images</h1>
        </Row>
        {/* File Input */}
        <Row className={styles.row_centerred}>
          <Col>
            <Form.Group controlId="formUrl" className="mb-3">
              <Form.Label>Copier un lien URL</Form.Label>
              <Form.Control type="text" placeholder="URL..." ref={textInputUrlRef} onChange={urlChangeHandler} />
            </Form.Group>
          </Col>
          <Col>
            <Button className={styles.button_photo} variant="info" href="https://picsum.photos/images" target="_blank">
              Picsum Photos
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={9} className={styles.image_col}>
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
            {/* If results is not null will show <ListGroup> */}
            {results.length > 0 && (
              <React.Fragment>
                {/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map */}
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
        {/* If imageURL is not null will show <Button> */}
        {imageURL && (
          <Row>
            <Col>
              <Button className={styles.button_identify} variant="success" size="lg" onClick={identifyHandler}>
                Identifier l'image
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </React.Fragment>
  );
}

export default App;

import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button, Card, ListGroup, ListGroupItem, Modal, Row, Col} from 'react-bootstrap';
import { useState } from "react";
import "./post.css";

function PostList() {
    const post = [
        {id:1, title:'www'},
        {id:2, title:'www1'},
        {id:3, title:'www2'},
        {id:4, title:'www3'},
        {id:5, title:'www4'}

    ]
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    return (
        <div>
            <Button className='newPost' variant='success' onClick={handleShow}>
                New Post
            </Button>

            <Modal show={show} onHide={handleClose}  className='postModal' size="lg" aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header closeButton>
                <Modal.Title>Post Your Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={6}>
                        <div className=''>
                            <label className='profileTitle' htmlFor="usernameInput">Topic</label>
                            <div>
                                <input 
                                    className="input"
                                    id="usernameInput" 
                                    type='text'
                                    value=''
                                />
                            </div>
                        </div>
                        </Col>
                        <Col xs={6}><div className=''>
                            <label className='profileTitle' >Tag</label>
                                <div>
                                    <select name="tag" id="tag" className='postTag'>
                                        <option value="volvo">Volvo</option>
                                        <option value="saab">Saab</option>
                                        <option value="mercedes">Mercedes</option>
                                        <option value="audi">Audi</option>
                                    </select>
                                </div>
                            </div>
                        </Col>
                        <div className='postTextArea'>
                            <label className='profileTitle' >Discipline</label>
                            <div>
                                <textarea 
                                    className="textArea"
                                    id="passwordInput" 
                                    type='text'
                                    value=''
                                />
                            </div>
                        </div>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Post
                </Button>
                </Modal.Footer>
            </Modal>
            {
                post.map(p=>
                    <div >
                        <Card className='postCard' id={p.id}>
                            <Card.Body>
                                <Card.Title>{p.title}</Card.Title>
                                <Card.Text>
                                Some quick example text to build on the card title and make up the bulk of
                                the card's content.
                                </Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem>Cras justo odio</ListGroupItem>
                                <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
                                <ListGroupItem>Vestibulum at eros</ListGroupItem>
                            </ListGroup>
                        </Card>
                    </div>
                )
            }
            
        </div>
    );

}

export default PostList;

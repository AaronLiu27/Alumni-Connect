import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button, Card, ListGroup, ListGroupItem, Modal, Row, Col} from 'react-bootstrap';
import { useState, useEffect } from "react";
import "./post.css";
import { lib } from 'crypto-js';

function PostList() {
    
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const getPost = () => {
        UserStore.getDataFromSessionStorage();
        
        axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts',
            
        )
        .then(function (response) {
            //console.log(response);
            setPosts(response.data)
            //console.log(posts)
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    useEffect(() => {getPost()}, [posts]);
    const [postTitle, setPostTitle] = useState('');
    const [postAuthor, setPostTitleAuthor] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postTime, setPostTime] = useState('');
    const[postActive, setPostActive] = useState('');
    const handlePost=(e)=>{
        setPost(e.target.id)
        setPostActive(e.target.id)
        axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts/post/'+post,
        
        )
        .then(function (response) {
            console.log(response);
            
            //console.log(posts)
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    return (
        <div>
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
            <Row>
                <Col xs={4}> 
                    <Button className='newPost' variant='success' onClick={handleShow}>
                        New Post
                    </Button>   
            {
                posts.map(p=>
                    <div className={p._id == postActive? 'post-active' : 'postList'} id={p._id}  onClick={handlePost} >
                            <div className='post-list-title' id={p._id} onClick={handlePost} >
                                {p.title}
                            </div>
                            <div className='post-list-author' id={p._id} onClick={handlePost} >
                                create by <a href={"/mainpage/personal/"+p.user}>{p.username}</a> on {p.createtime.slice(0,10)}
                            </div> 
                    </div>
                )
            }
                </Col>
                    <Col xs={8}>
                    <Card className='postCard' >
                            <Card.Body>
                            <Card.Title>{postTitle}</Card.Title>
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
                    </Col>
            </Row>
            
        </div>
    );

}

export default PostList;

import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button, Card, ListGroup, ListGroupItem, Modal, Row, Col} from 'react-bootstrap';
import { useState, useEffect } from "react";
import "./personal.css";
import { lib } from 'crypto-js';

function Personal(props) {
    
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const getPost = () => {
        UserStore.getDataFromSessionStorage();
        const requesturl = 'http://nyu-devops-alumniconnect.herokuapp.com/api/posts/user/' + props.match.params.name;
        axios.get(requesturl,
            {},{headers: { Authorization: UserStore.token }}
        )
        .then(function (response) {
            // console.log(response);
            setPosts(response.data)
            //console.log(posts)
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    useEffect(() => {getPost()}, []);
    const [postTile, setPostTitle] = useState('');
    const [postAuthor, setPostTitleAuthor] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postTime, setPostTime] = useState('');
    const[postActive, setPostActive] = useState('');
    const handlePost=(e)=>{
        setPost(e.target.id)
        setPostActive(e.target.id)
        console.log(post)
    }
    return (
        <div>
            <Row>
                <Col xs={4}> 
            {
                posts.map(p=>
                    <div className={p._id == postActive? 'post-active' : 'postList'} id={p._id}  onClick={handlePost} >
                            <div className='post-list-title' id={p._id}  onClick={handlePost}>
                                {p.title}
                            </div>
                            <div className='post-list-author' id={p._id}  onClick={handlePost}>
                                create by <a href={"/mainpage/personal/"+p.user}>{p.username}</a> on {p.createtime.slice(0,10)}
                            </div> 
                    </div>
                )
            }
                </Col>
                    <Col xs={8}>
                    <Card className='postCard' >
                            <Card.Body>
                            <Card.Title>{post}</Card.Title>
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

export default Personal;

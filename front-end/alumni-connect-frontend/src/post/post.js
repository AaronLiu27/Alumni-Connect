import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button, Card, ListGroup, ListGroupItem, Modal, Row, Col} from 'react-bootstrap';
import { useState, useEffect } from "react";
import CommentList from '../comment/comment';
import "./post.css";
import { lib } from 'crypto-js';

function PostList() {
    
    const [post, setPost] = useState('');
    const [inputTopic, setInputTopic] = useState('');
    const [inputContent, setInputContent] = useState('');
    const [inputTag, setInputTag] = useState('');
    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        console.log(inputTag)
        console.log(inputTopic)
        axios.post('http://nyu-devops-alumniconnect.herokuapp.com/api/posts/user/'+UserStore.id, {
            user: UserStore.id,
            username: UserStore.username,
            title: inputTopic,
            content: inputContent,
            tags: [inputTag]
          },
          {headers: { Authorization: UserStore.token}}
          )
          .then(function (response) {
            console.log(response);
            axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts',
                )
                .then(function (response) {
                    //console.log(response);
                    response.data = response.data.sort((a,b)=>{return a.createtime - b.createtime}).reverse();
                    setPosts(response.data)
                    //console.log(posts)
                })
                .catch(function (error) {
                    console.log(error);
                })
          })
          .catch(function (error) {
            console.log(error);
          });
        setShow(false)
    };
    const handleShow = () => setShow(true);
    const getPost = () => {
        UserStore.getDataFromSessionStorage();
        
        axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts',
            
        )
        .then(function (response) {
            //console.log(response);
            response.data = response.data.sort((a,b)=>{return a.createtime - b.createtime}).reverse();
            setPosts(response.data)
            //console.log(posts)
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    useEffect(() => {getPost()}, []);
    const [postTitle, setPostTitle] = useState('');
    const [postUid, setPostUid] = useState('');
    const [postAuthor, setPostAuthor] = useState('');
    const [postContent, setPostContent] = useState('');
    const [postTime, setPostTime] = useState('');
    const[postActive, setPostActive] = useState('');

    const handlePost=(e)=>{
        setPost(e.target.id)
        setPostActive(e.target.id)
        axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts/post/'+e.target.id,
        
        )
        .then(function (response) {
            console.log(response);
            setPostTitle(response.data.title)
            setPostAuthor(response.data.username)
            setPostUid(response.data.user)
            setPostContent(response.data.content)
            setPostTime(response.data.createtime)
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} className='postModal' size="lg" aria-labelledby="example-modal-sizes-title-lg">
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
                                     
                                    type='text'
                                    
                                    onChange={(e) => setInputTopic(e.target.value)}
                                />
                            </div>
                        </div>
                        </Col>
                        <Col xs={6}><div className=''>
                            <label className='profileTitle' >Tag</label>
                                <div>
                                    <select name="tag" id="tag" className='postTag'  onChange={(e) => setInputTag(e.target.value)}>
                                        <option value="Please select a tag" >Please select a tag</option>
                                        <option value="NYU student" >NYU student</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Policy issue">Policy issue</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </Col>
                        <div className='postTextArea'>
                            <label className='profileTitle' >Content</label>
                            <div>
                                <textarea 
                                    className="textArea"
                                     
                                    type='text'
                                    
                                    onChange={(e) => setInputContent(e.target.value)}
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
                    <div className={p._id == postActive? 'post-active' : 'postList'}  id={p._id} onClick={handlePost} >
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
                        {
                            postActive &&
                            <div>
                            <div className='postCard'>
                                <div className='post-list-title'>{postTitle}</div>
                                <div className='post-list-author'>
                                create by <a href={"/mainpage/personal/"+postUid}>{postAuthor}</a> on {postTime.slice(0,10)}
                                </div>
                                <div>{postContent}</div>  
                                  
                            </div>
                            <CommentList postid={post} postUid={postUid}/>
                            </div>
                        }
                         
                    </Col>
            </Row>
            
        </div>
    );

}

export default PostList;

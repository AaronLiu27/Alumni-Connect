import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button, Card, ListGroup, ListGroupItem, Modal, Row, Col} from 'react-bootstrap';
import { useState, useEffect } from "react";
import CommentList from '../comment/comment';
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

export default Personal;

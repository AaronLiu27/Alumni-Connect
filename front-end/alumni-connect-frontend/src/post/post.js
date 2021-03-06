import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button, Card, ListGroup, ListGroupItem, Modal, Row, Col, InputGroup,FormControl} from 'react-bootstrap';
import { useState, useEffect } from "react";
import CommentList from '../comment/comment';
import "./post.css";
import { lib } from 'crypto-js';

function PostList() {
    
    const [post, setPost] = useState('');
    const [inputTopic, setInputTopic] = useState('');
    const [inputContent, setInputContent] = useState('');
    const [inputTag, setInputTag] = useState('');
    const [tagArray,setTagArray] = useState([]);
    const [posts, setPosts] = useState([]);
    const [show, setShow] = useState(false);
    const [postsDup, setPostsDup] = useState([]);
    const handleClose = ()=>{
        setShow(false);
    }
    const handleNewPost = () => {
        console.log(inputTag)
        console.log(inputTopic)
        axios.post('http://nyu-devops-alumniconnect.herokuapp.com/api/posts/user/'+UserStore.id, {
            user: UserStore.id,
            username: UserStore.username,
            title: inputTopic,
            content: inputContent,
            tags: tagArray
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
                    setPostsDup(response.data)
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

    const SearchByTag = () => {
        if(postSearch === '') {
            alert("please input tag")
            return;
        }
        let TagPosts = postsDup.filter(p=>p.tags.indexOf(postSearch) != -1)
        setPosts(TagPosts)
        setPostSearch('')
    }

    const SearchByTitle = () => {
        if(postSearch === '') {
            alert("please input title")
            return;
        }
        let TitlePosts = postsDup.filter(p=>p.title == postSearch)
        setPosts(TitlePosts)
        setPostSearch('')
    }

    const SearchByUser = () => {
        if(postSearch === '') {
            alert("please input username")
            return;
        }
        let UserPosts = postsDup.filter(p=>p.username == postSearch)
        setPosts(UserPosts)
        setPostSearch('')
    }

    const getPost = () => {
        UserStore.getDataFromSessionStorage();
        
        axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts',
            
        )
        .then(function (response) {
            //console.log(response);
            response.data = response.data.sort((a,b)=>{return a.createtime - b.createtime}).reverse();
            setPosts(response.data)
            setPostsDup(response.data)
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
    const [postTags, setPostTags] = useState('');
    const[postActive, setPostActive] = useState('');
    const [postSearch, setPostSearch] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [editContent, setEditContent] = useState('');
    const handleTag=(e)=>{
        let res = e.target.value.split(" #")
        setTagArray(res)
    }

    const handleSearch=(e)=>{
        setPostSearch(e.target.value)
    }

    const editPost=()=>{
        setShowEdit(true)
    }
    const cancelUpdatePost =()=>{
        setShowEdit(false)
    }

    const updatePost=()=>{
        console.log(postTitle)
        console.log(editContent)
        console.log(postTags)
        axios.put('http://nyu-devops-alumniconnect.herokuapp.com/api/posts/post/'+postActive, {
            user: UserStore.id,
            username: UserStore.username,
            title: postTitle,
            content: editContent,
            tags: postTags
          },{headers: { Authorization: UserStore.token}})
          .then(function (response) {
            console.log(response);
            setShowEdit(false)
            axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts',
            )
            .then(function (response) {
                //console.log(response);
                response.data = response.data.sort((a,b)=>{return a.createtime - b.createtime}).reverse();
                setPosts(response.data)
                setPostsDup(response.data)
                setPostContent(editContent)
                //console.log(posts)
            })
            .catch(function (error) {
                console.log(error);
            })
          })
          .catch(function (error) {
            console.log(error);
          });
        

    }

    const deletePost=()=>{
        axios.delete('http://nyu-devops-alumniconnect.herokuapp.com/api/posts/post/'+ postActive,
            {headers: { Authorization: UserStore.token}}
        )
        .then(function (response) {
            //console.log(response);
            alert('post deleted')
            setPostActive('')
            axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts',
                )
                .then(function (response) {
                    //console.log(response);
                    response.data = response.data.sort((a,b)=>{return a.createtime - b.createtime}).reverse();
                    setPosts(response.data)
                    setPostsDup(response.data)
                    //console.log(posts)
                })
                .catch(function (error) {
                    console.log(error);
                })
            //console.log(posts)
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    const handleAllPost=()=>{
        axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/posts',
        )
        .then(function (response) {
            //console.log(response);
            response.data = response.data.sort((a,b)=>{return a.createtime - b.createtime}).reverse();
            setPosts(response.data)
            setPostsDup(response.data)
            console.log(posts)
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    const handleMyPost=()=>{
        let mypost = posts.filter(p=>p.user == UserStore.id)
        setPosts(mypost)
        setPostsDup(mypost)
    }

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
            setEditContent(response.data.content)
            setPostTime(response.data.createtime)
            setPostTags(response.data.tags)
            console.log(postTags)
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    const filtTag = (t) => {
        let TagPosts = postsDup.filter(p=>p.tags.indexOf(t) != -1)
        setPosts(TagPosts)
    }

    return (
        <div>
            <Modal show={show} onHide={handleClose} className='postModal' size="lg" aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header closeButton>
                <Modal.Title>Post Your Topic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs={4}>
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
                        <Col xs={6}>
                        
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
                        <div className='postTextArea'>
                            <label className='profileTitle' >Tag</label>
                                <div>
                                <textarea 
                                    className="textAreaTag"
                                    placeholder='e.g. #NYU_Student #NYU_Policy'
                                    type='text'
                                    
                                    onChange={handleTag}
                                />
                                </div>
                            </div>
                            </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleNewPost}>
                    Post
                </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Col xs={4}>
                    <Button className='newPost' variant='outline-info' onClick={handleAllPost}>
                        All Post
                    </Button> 
                    <Button className='newPost' variant='outline-info' onClick={handleMyPost}>
                        My Post
                    </Button> 
                    <Button className='newPost' variant='outline-success' onClick={handleShow}>
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
                    <InputGroup className='search_bar'>
                        <FormControl
                            placeholder="Input Tag/Title/User..."
                            value={postSearch ? postSearch : ''}
                            onChange={(e) => setPostSearch(e.target.value)}
                        />
                        <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={SearchByTag}>Search by Tag</Button>
                        <Button variant="outline-secondary" onClick={SearchByTitle}>Search by Title</Button>
                        <Button variant="outline-secondary" onClick={SearchByUser}>Search by User</Button>
                        
                        </InputGroup.Append>
                    </InputGroup>
                        {
                            showEdit&&
                            <div>
                                <div><textarea className='updateInput' value={editContent} onChange={(e) => setEditContent(e.target.value)}>
                                </textarea></div>
                                <Button  variant='outline-danger' onClick={cancelUpdatePost} className='cancelUpdate' >
                                        cancel
                                </Button>
                                <Button  variant='outline-success' onClick={updatePost} >
                                        update
                                </Button>
                            </div>
                        }
                        {
                            postActive && !showEdit &&
                            <div>
                            <div className='postCard'>
                                <div className='post-list-title'>{postTitle}</div>
                                
                                <div className='post-list-author'>
                                create by <a href={"/mainpage/personal/"+postUid}>{postAuthor}</a> on {postTime.slice(0,10)}
                                </div>
                                
                                <div>
                                    {postContent}
                                    
                                    {postTags&& postTags.map(t=>
                                        <a className="tags" onClick={ () => filtTag(t)}>
                                            {t.length > 0 ? "#"+t:null}
                                        </a>
                                    )}
                                    
                                    </div>  
                                {
                                    postUid == UserStore.id &&
                                    <div className='deleteBtn'> 
                                    <Button  variant='outline-success' onClick={editPost} className='editBtn'>
                                        edit
                                    </Button>
                                    <Button  variant='outline-danger' onClick={deletePost} >
                                        delete
                                    </Button> 
                                     
                                    </div>
                                }
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

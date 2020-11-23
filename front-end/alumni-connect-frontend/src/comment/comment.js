import React from 'react';
import UserStore from '../stores/UserStore';
import axios from 'axios';
import {Button, Card, ListGroup, ListGroupItem, Modal, Row, Col, InputGroup, FormControl} from 'react-bootstrap';
import { useState, useEffect } from "react";
import "./comment.css";

function CommentList(props) {
    const[comments, setComments] = useState([]);
    const[newcomment, setNewcomment] = useState('');
    const[postid, setPostid] = useState(props.postid);
    const getComment = () => {
        console.log("getting comments");
        axios.get('http://nyu-devops-alumniconnect.herokuapp.com/api/comments/post/'+props.postid, )
        .then(function (response) {
            console.log(response);
            response.data = response.data;
            setComments(response.data)
        })
        .catch(function (error) {
            setComments([]);
            console.log(error);
        })
    }
    const addComment = () => {
        console.log("Post id is " + props.postid);
        console.log("Comment content: " + newcomment);
        if(newcomment) {
            axios.post('http://nyu-devops-alumniconnect.herokuapp.com/api/comments/post/'+props.postid, {
                "post": props.postid,
                "user": UserStore.id,
                "username": UserStore.username,
                "content": newcomment
          },
          {headers: { Authorization: UserStore.token}}
          )
          .then(function (response) {
            console.log(response);
            alert("Comment add success!")
            getComment();
          })
          .catch(function (error) {
            console.log(error);
          });
        } else {
            alert("invalid comment");
        }
        setNewcomment('');
    }
    useEffect(() => {getComment()}, [props.postid]);
    // getComment();
    return(
        <div>
            
            {
                comments.map(comment => 
                    <div className='commentItem'>
                        <div className='comment-content' id={comment._id}>
                                {comment.content}
                        </div>
                        <div className='comment-author' id={comment._id}>
                            by <a href={"/mainpage/personal/"+comment.user}>{comment.username}</a> on {comment.createtime.slice(0,10)}
                        </div> 
                    </div>
                )
            }

            <InputGroup className="addComment">
                <FormControl
                    placeholder="leave your comment"
                    value={newcomment ? newcomment : ''}
                    onChange={(e) => setNewcomment(e.target.value)}
                />
                <InputGroup.Append>
                <Button variant="outline-secondary" onClick={() => addComment()}>Add Comment</Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    );
}

export default CommentList;
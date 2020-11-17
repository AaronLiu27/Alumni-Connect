import React from 'react';
import UserStore from '../stores/UserStore';
import axios from 'axios';
import {Button, Card, ListGroup, ListGroupItem, Modal, Row, Col} from 'react-bootstrap';
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
            response.data = response.data.sort((a,b)=>{return a.createtime - b.createtime}).reverse();
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
            <div className='addComment'>
                <input 
                    className="input"
                    id="commentInput" 
                    type='text'
                    plcaeholder='add a comment...'
                    value={newcomment ? newcomment : ''}
                    onChange={(e) => setNewcomment(e.target.value)}
                />
                <Button onClick={() => addComment()}>Add Comment</Button>
            </div>
            {
                comments.map(comment => 
                    <div className='commentItem'>
                        <div className='comment-content' id={comment._id}>
                                {comment.content}
                        </div>
                        <div className='comment-author' id={comment._id}>
                            create by {comment.username} on {comment.createtime.slice(0,10)}
                        </div> 
                    </div>
                )
            }
        </div>
    );
}

export default CommentList;
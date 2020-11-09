import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button, Card, ListGroup, ListGroupItem} from 'react-bootstrap';
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
    



    return (
        <div>
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

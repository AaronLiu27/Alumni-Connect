import React from 'react';
import SubmitButton from '../component/submitButton';
import UserStore from '../stores/UserStore';
import {useHistory} from "react-router-dom";
import axios from 'axios';
import {Route, Switch, Link, BrowserRouter as Router} from "react-router-dom";
import {Button} from 'react-bootstrap';
import { useState } from "react";
import "./post.css";

function PostList() {



    return (
        <div>
            Hi Post
        </div>
    );

}

export default PostList;

import json
import datetime

import pytest

import logging
from source.backend.app import app

from source.backend.settings import auth_url, username, password

logging.basicConfig(
    level=logging.INFO
)

logger = logging.getLogger(__name__)


# user used to create/modify/delete comments; originally no comment
userid = "5f7a3d5e41462499b1283a52"
# user which originally has comments
userid2 = "5f7968905510ad91c3510870"


postid = "5faac6137a2a44ea7bcf1169"
commentid = ""


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def newComment(time: datetime.datetime = None):
    now = time or datetime.datetime.now()
    return {
        "content": "Hello this is a new comment"+str(now),
    }


def test_comments_get(client):
    url = "http://localhost:5000/api/comments/"

    headers = {"Content-Type": "application/json"}

    auth_payload = {
        "username": username,
        "passwd": password
    }

    auth_res = client.post(
        auth_url,
        headers=headers, data=json.dumps(auth_payload, indent=4)
    )
    assert auth_res.status_code == 200
    auth_json = auth_res.json
    logger.debug(auth_json)

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = client.get(url, headers=headers)
    assert res.status_code == 200
    logger.debug(res.json)


def test_comments_post_post(client):
    url = "http://localhost:5000/api/comments/post/{}"

    # Additional headers
    headers = {"Content-Type": "application/json"}
    # Body
    payload = newComment()

    auth_payload = {
        "username": username,
        "passwd": password
    }

    auth_res = client.post(
        auth_url,
        headers=headers,
        data=json.dumps(auth_payload, indent=4)
    )

    assert auth_res.status_code == 200
    auth_json = auth_res.json
    logger.debug(auth_json)

    res = client.post(
        url.format(postid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )

    # Not authorized
    logger.debug(res.json)
    assert res.status_code == 401

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = client.post(
        url.format(postid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    assert res.status_code == 200
    logger.debug(res.json)
    global commentid
    commentid = res.json["_id"]


def test_comments_post_get(client):
    url = "http://localhost:5000/api/comments/post/{}"

    headers = {"Content-Type": "application/json"}

    res = client.get(
        url.format(postid),
        headers=headers,
    )
    assert res.status_code == 200
    logger.debug(res.json)


def test_comments_comment_put(client):
    url = "http://localhost:5000/api/comments/comment/{}"

    headers = {"Content-Type": "application/json"}

    auth_payload = {
        "username": username,
        "passwd": password
    }

    auth_res = client.post(
        auth_url,
        headers=headers, data=json.dumps(auth_payload, indent=4)
    )
    assert auth_res.status_code == 200
    auth_json = auth_res.json
    logger.debug(auth_json)

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    payload = newComment()
    logger.debug(payload)

    res = client.put(
        url.format(commentid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    logger.debug(res.json)
    assert res.status_code == 200
    assert res.json["updatetime"] != res.json["createtime"]


def test_comments_comment_get(client):
    url = "http://localhost:5000/api/comments/comment/{}"

    headers = {"Content-Type": "application/json"}

    res = client.get(
        url.format(commentid),
        headers=headers,
    )
    assert res.status_code == 200
    logger.debug(res.json)


def test_comments_user_get(client):
    url = "http://localhost:5000/api/comments/user/{}"

    headers = {"Content-Type": "application/json"}

    res = client.get(
        url.format(userid2),
        headers=headers,
    )
    assert res.status_code == 200
    logger.debug(res.json)


def test_comments_comment_delete(client):
    url = "http://localhost:5000/api/comments/comment/{}"

    headers = {"Content-Type": "application/json"}

    auth_payload = {
        "username": username,
        "passwd": password
    }

    auth_res = client.post(
        auth_url,
        headers=headers, data=json.dumps(auth_payload, indent=4)
    )
    assert auth_res.status_code == 200
    auth_json = auth_res.json
    logger.debug(auth_json)

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = client.delete(url.format(commentid), headers=headers)
    assert res.status_code == 200
    logger.debug(res.json)

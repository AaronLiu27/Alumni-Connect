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


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


userid = "5f7a3d5e41462499b1283a52"
random_userid = "5f7a3d5e41462499b1283a53"

postid = ""


def newPost(time: datetime.datetime = None):
    now = time or datetime.datetime.now()
    return {
        "user": "5f7a3d5e41462499b1283a52",
        "content": "Hello there, this is Tom from NYU!"+str(now),
        "tags": ["NYU"],
    }


def test_posts_get(client):
    url = "http://localhost:5000/api/posts/"

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


def test_posts_user_post(client):
    url = "http://localhost:5000/api/posts/user/{}"

    # Additional headers
    headers = {"Content-Type": "application/json"}
    # Body
    payload = newPost()

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
        url.format(userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )

    # Not authorized
    logger.debug(res.json)
    assert res.status_code == 401

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = client.post(
        url.format(userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    assert res.status_code == 200
    logger.debug(res.json)
    global postid
    postid = res.json["_id"]

    res = client.post(
        url.format(random_userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    assert res.status_code == 401


def test_posts_user_get(client):
    url = "http://localhost:5000/api/posts/user/{}"

    headers = {"Content-Type": "application/json"}

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

    res = client.get(
        url.format(userid),
        headers=headers
    )

    headers = {"Authorization": "Bearer "+auth_json['access_token']}

    res = client.get(url.format(userid), headers=headers)
    logger.debug(res.json)
    assert res.status_code == 200


def test_post_put(client):
    url = "http://localhost:5000/api/posts/post/{}"

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

    payload = newPost()
    logger.debug(payload)

    res = client.put(
        url.format(postid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    logger.debug(res.json)
    assert res.status_code == 200
    assert res.json["updatetime"] != res.json["createtime"]


def test_posts_post_get(client):
    url = "http://localhost:5000/api/posts/post/{}"

    res = client.get(url.format(postid))
    logger.debug(res.json)
    assert res.status_code == 200


def test_post_delete(client):
    url = "http://localhost:5000/api/posts/post/{}"

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

    res = client.delete(url.format(postid), headers=headers)
    assert res.status_code == 200
    logger.debug(res.json)


if __name__ == "__main__":
    test_posts_get(client)
    test_posts_user_post(client)
    test_posts_user_get(client)
    test_posts_post_get(client)
    # test_post_delete(client)

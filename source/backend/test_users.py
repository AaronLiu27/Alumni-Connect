import json
import random

import pytest

import logging
from source.backend.app import app

from source.backend.utils.random_string import get_random_string

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


def test_get_random_string(client):
    for i in range(100):
        length = random.randint(6, 24)
        username = get_random_string(length)
        assert " " not in username
        assert len(username) == length


def test_users_post(client):
    url = "http://localhost:5000/api/users/"
    username_len = random.randint(6, 24)
    passwd_len = random.randint(6, 24)
    domain_len = random.randint(3, 4)

    # Additional headers
    headers = {"Content-Type": "application/json"}

    # Body
    payload = {
        "username": get_random_string(username_len),
        "passwd": get_random_string(passwd_len),
        "email": "{}@{}.com".format(
            get_random_string(2, "ascii_lowercase") +
            get_random_string(4, "digits"),
            get_random_string(domain_len),
        ),
    }

    res0 = client.post(
        url,
        headers=headers,
        data=json.dumps(payload, indent=4)
    )

    # Added successfully
    assert res0.status_code == 307
    print(res0.json)

    res1 = client.post(
        url,
        headers=headers,
        data=json.dumps(payload, indent=4)
    )

    # Username already exists
    assert res1.status_code == 400
    print(res1.json)


def test_users_get(client):
    url = "http://localhost:5000/api/users/"

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
    print(auth_json)

    res = client.get(url, headers=headers)
    assert res.status_code == 401

    headers["Authorization"] = "Bearer "+auth_json['access_token']
    res = client.get(url, headers=headers)
    assert res.status_code == 200


def test_user_get(client):
    userid = "5f7a3d5e41462499b1283a52"
    random_userid = "5f7a3d5e41462499b1283a53"
    url = "http://localhost:5000/api/users/user/{}"

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
    print(auth_json)

    res = client.get(url.format(userid), headers=headers)
    assert res.status_code == 401

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = client.get(url.format(userid), headers=headers)
    assert res.status_code == 200

    res = client.get(url.format(random_userid), headers=headers)
    assert res.status_code == 404


if __name__ == "__main__":
    test_user_get()

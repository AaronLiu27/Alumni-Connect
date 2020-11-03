# from flask import jsonify
# import requests
import json
import pytest

import logging

import random

from source.backend.app import app
from source.backend.utils.random_string import get_random_string

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s : %(name)s : %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_login(client):
    url = "http://localhost:5000/api/auth/login"

    # Valid User
    username_valid = "testuser"
    password_valid = "test"

    # Invalid User
    username_invalid = "invaliduser"
    password_invalid = "pwdinvalid"

    # Additional headers
    headers = {"Content-Type": "application/json"}

    # Body
    payload_user_invalid = {
        "username": username_invalid,
        "passwd": password_invalid,
    }
    payload_pwd_wrong = {
        "username": username_valid,
        "passwd": password_invalid,
    }
    payload_valid = {
        "username": username_valid,
        "passwd": password_valid,
    }

    # Username not exist
    res0 = client.post(
        url,
        headers=headers,
        data=json.dumps(payload_user_invalid, indent=4))
    assert res0.status_code == 401

    # Password not correct
    res1 = client.post(
        url,
        headers=headers,
        data=json.dumps(payload_pwd_wrong, indent=4))
    assert res1.status_code == 401

    # Login successfully
    res2 = client.post(
        url,
        headers=headers,
        data=json.dumps(payload_valid, indent=4))
    assert res2.status_code == 200


def test_register(client):
    url = "http://localhost:5000/api/auth/register"
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


if __name__ == "__main__":
    test_login(client)

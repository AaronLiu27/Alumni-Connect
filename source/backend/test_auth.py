# from flask import jsonify
# import requests
import json
import pytest

import logging
from source.backend.app import app

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


if __name__ == "__main__":
    test_login(client)

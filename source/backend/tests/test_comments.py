import json


import pytest

import logging
from source.backend.app import app

from source.backend.settings import auth_url, username, password

logging.basicConfig(
    level=logging.INFO
)

logger = logging.getLogger(__name__)

userid = "5f7a3d5e41462499b1283a52"
random_userid = "5f7a3d5e41462499b1283a53"


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


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

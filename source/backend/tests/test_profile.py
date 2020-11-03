import json

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


def test_profile_post(client):
    firstname = "Tom"
    lastname = "Holland"
    age = 23
    discipline = "Biology"

    url = "http://localhost:5000/api/profiles/profile/user/{}"

    # Additional headers
    headers = {"Content-Type": "application/json"}
    # Body
    payload = {
        "user": userid,
        "firstname": firstname,
        "lastname": lastname,
        "age": age,
        "discipline": discipline,
    }

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
    print(auth_json)

    res = client.post(
        url.format(userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )

    # Added successfully
    assert res.status_code == 401
    print(res.json)

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = client.post(
        url.format(userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    assert res.status_code == 200
    print(res.json)

    res = client.post(
        url.format(random_userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    assert res.status_code == 401


def test_profile_get(client):
    url = "http://localhost:5000/api/profiles/profile/user/{}"

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

    res = client.get(
        url.format(userid),
        headers=headers
    )

    assert res.status_code == 401
    print(res.json)

    headers = {"Authorization": "Bearer "+auth_json['access_token']}

    res = client.get(url.format(userid), headers=headers)
    assert res.status_code == 200

    res = client.get(url.format(random_userid), headers=headers)
    assert res.status_code == 404


def test_profile_delete(client):
    url = "http://localhost:5000/api/profiles/profile/user/{}"

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

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = client.delete(url.format(userid), headers=headers)
    assert res.status_code == 200
    print(res.json)


if __name__ == "__main__":
    test_profile_post(client)
    test_profile_get(client)
    test_profile_delete(client)

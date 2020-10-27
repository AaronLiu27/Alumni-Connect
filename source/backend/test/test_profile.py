import requests
import json

import logging

from settings import auth_url, username, password

logging.basicConfig(
    level=logging.INFO
)

logger = logging.getLogger(__name__)


userid = "5f7a3d5e41462499b1283a52"
random_userid = "5f7a3d5e41462499b1283a53"


def test_profile_post():
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

    auth_res = requests.post(
        auth_url,
        headers=headers,
        data=json.dumps(auth_payload, indent=4)
    )

    assert auth_res.status_code == 200
    auth_json = auth_res.json()
    print(auth_json)

    res = requests.post(
        url.format(userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )

    # Added successfully
    assert res.status_code == 401
    print(res.json())

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = requests.post(
        url.format(userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    assert res.status_code == 200
    print(res.json())

    res = requests.post(
        url.format(random_userid),
        headers=headers,
        data=json.dumps(payload, indent=4)
    )
    assert res.status_code == 401


def test_profile_get():
    url = "http://localhost:5000/api/profiles/profile/user/{}"

    headers = {"Content-Type": "application/json"}

    auth_payload = {
        "username": username,
        "passwd": password
    }

    auth_res = requests.post(
        auth_url,
        headers=headers, data=json.dumps(auth_payload, indent=4)
    )
    assert auth_res.status_code == 200
    auth_json = auth_res.json()
    print(auth_json)

    res = requests.get(
        url.format(userid),
        headers=headers
    )

    assert res.status_code == 401
    print(res.json())

    headers = {"Authorization": "Bearer "+auth_json['access_token']}

    res = requests.get(url.format(userid), headers=headers)
    assert res.status_code == 200

    res = requests.get(url.format(random_userid), headers=headers)
    assert res.status_code == 404


def test_profile_delete():
    url = "http://localhost:5000/api/profiles/profile/user/{}"

    headers = {"Content-Type": "application/json"}

    auth_payload = {
        "username": username,
        "passwd": password
    }

    auth_res = requests.post(
        auth_url,
        headers=headers, data=json.dumps(auth_payload, indent=4)
    )
    assert auth_res.status_code == 200
    auth_json = auth_res.json()
    print(auth_json)

    headers["Authorization"] = "Bearer "+auth_json['access_token']

    res = requests.delete(url.format(userid), headers=headers)
    assert res.status_code == 200
    print(res.json())


if __name__ == "__main__":
    test_profile_post()
    test_profile_get()
    test_profile_delete()

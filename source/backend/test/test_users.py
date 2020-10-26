import requests
import json
import string
import random

import logging

from settings import auth_url, username, password

logging.basicConfig(
    level=logging.INFO
)

logger = logging.getLogger(__name__)



def get_random_string(length=8, type="ascii_letters"):
    letters = getattr(string, type, "")
    result_str = "".join(random.choice(letters) for i in range(length))
    while " " in result_str:
        result_str.replace(" ", random.choice(letters))
    logger.debug(f"Random username of length {length}: {result_str}")
    return result_str


def test_get_random_string():
    for i in range(100):
        length = random.randint(6, 24)
        username = get_random_string(length)
        assert " " not in username
        assert len(username) == length


def test_users_post():
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

    res0 = requests.post(
        url,
        headers=headers,
        data=json.dumps(payload, indent=4)
    )

    # Added successfully
    assert res0.status_code == 200
    print(res0.json())

    res1 = requests.post(url, headers=headers, data=json.dumps(payload, indent=4))

    # Username already exists
    assert res1.status_code == 400
    print(res1.json())


def test_users_get():
    url = "http://localhost:5000/api/users/"

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

    res = requests.get(url, headers=headers)
    assert res.status_code == 401

    headers["Authorization"] = "Bearer "+auth_json['access_token']
    res = requests.get(url, headers=headers)
    assert res.status_code == 200


def test_user_get():
    userid = "5f7a3d5e41462499b1283a52"
    random_userid = "5f7a3d5e41462499b1283a53"
    url = "http://localhost:5000/api/users/user/{}"

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

    res = requests.get(url.format(userid), headers=headers)
    assert res.status_code == 401

    headers["Authorization"] = "Bearer "+auth_json['access_token']
    
    res = requests.get(url.format(userid), headers=headers)
    assert res.status_code == 200

    res = requests.get(url.format(random_userid), headers=headers)
    assert res.status_code == 404



if __name__ == "__main__":
    test_user_get()

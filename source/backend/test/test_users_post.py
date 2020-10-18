import requests
import json
import string
import random

import logging

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s : %(name)s : %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


def get_random_username(length=8):
    # letters = string.ascii_lowercase
    letters = string.ascii_letters
    result_str = "".join(random.choice(letters) for i in range(length))
    while " " in result_str:
        result_str.replace(" ", random.choice(letters))
    logger.info(f"Random username of length {length}: {result_str}")
    return result_str


def test_get_random_username():
    for i in range(100):
        length = random.randint(6, 24)
        username = get_random_username(length)
        assert " " not in username
        assert len(username) == length


def test_users_post():
    url = "http://localhost:5000/api/users/"
    username_len = random.randint(6, 24)
    passwd_len = random.randint(6, 24)
    email_len = random.randint(6, 24)
    domain_len = random.randint(3, 10)

    # Additional headers
    headers = {"Content-Type": "application/json"}

    # Body
    payload = {
        "username": get_random_username(username_len),
        "passwd": get_random_username(passwd_len),
        "email": "{}@{}.com".format(
            get_random_username(email_len), get_random_username(domain_len)
        ),
    }

    res0 = requests.post(url, headers=headers, data=json.dumps(payload, indent=4))

    # Added successfully
    assert res0.status_code == 200
    print(res0.json())

    res1 = requests.post(url, headers=headers, data=json.dumps(payload, indent=4))

    # Username already exists
    assert res1.status_code == 400
    print(res0.text)


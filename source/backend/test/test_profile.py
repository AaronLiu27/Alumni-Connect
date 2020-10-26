import requests
import json
import pytest

from bson.objectid import ObjectId

import logging

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s : %(name)s : %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


# @pytest.mark.skipif(True)
def test_profile_post():
    # Valid user _id
    user = "5f7a3d5e41462499b1283a52"
    firstname = "Tom"
    lastname = "Holland"
    age = 23
    discipline = "Biology"

    url = "http://localhost:5000/api/profiles/profile/user/{}".format(user)

    # Additional headers
    headers = {"Content-Type": "application/json"}

    # Body
    payload = {
        "user": user,
        "firstname": firstname,
        "lastname": lastname,
        "age": age,
        "discipline": discipline,
    }

    res = requests.post(url, headers=headers, data=json.dumps(payload, indent=4))

    # Added successfully
    assert res.status_code == 401
    print(res.json())


if __name__ == "__main__":
    test_profile_post()

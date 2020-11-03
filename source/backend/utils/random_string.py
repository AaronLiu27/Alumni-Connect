def get_random_string(length=8, type="ascii_letters"):
    import random
    import string
    letters = getattr(string, type, "")
    result_str = "".join(random.choice(letters) for i in range(length))
    return result_str

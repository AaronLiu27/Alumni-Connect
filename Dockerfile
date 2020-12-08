FROM python:3-onbuild
WORKDIR /app
COPY . /app
RUN pip install --upgrade pip
RUN pip install -r requirements-dev.txt

CMD gunicorn -c gunicorn.conf.py wsgi:app -b 0.0.0.0:${PORT}

FROM python:3-onbuild
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["wsgi.py"]

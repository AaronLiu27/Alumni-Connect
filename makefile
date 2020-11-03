LINTER = flake8
SRC_DIR = source
REQ_DIR = requirements

FORCE:

prod: tests github

github: FORCE
	- git commit -a
	git push

tests: dev_env lint unit

unit: FORCE
	coverage run -m pytest $(SRC_DIR)/backend/
	coverage report -m

lint: FORCE
	- $(LINTER) *.py
	- $(LINTER) $(SRC_DIR)/backend/*.py
	- $(LINTER) $(SRC_DIR)/backend/*/*.py

dev_env: FORCE
	pip install -r $(REQ_DIR)/requirements-dev.txt

run_backend:
	python wsgi.py

clean:
	find . -name '*.pyc' -exec rm {} +

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
	coverage run -m pytest $(SRC_DIR)/backend/test/
	coverage report -m

lint: FORCE
	- $(LINTER) $(SRC_DIR)/*.py
	- $(LINTER) $(SRC_DIR)/backend/*.py

dev_env: FORCE
	pip install -r $(REQ_DIR)/requirements-dev.txt

run_backend: dev_env
	python3 $(SRC_DIR)/backend/app.py

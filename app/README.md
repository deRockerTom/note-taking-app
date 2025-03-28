# App

## How to setup development environment with uv

- Install uv
```bash
pipx install uv
```

- [Recommended] Add a virtual environment
```bash
uv venv --python 3.12
```

- Install dependencies
```bash
uv pip install -r requirements.txt -r requirements-dev.txt
```

## How to run tests
```bash
uv run pytest
```

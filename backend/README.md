## Backend Script

Must be compiled with pyinstaller and copied into the frontend executable folder.

TODO: add script to scaffold this all together, and iterate in CI

## Activate venv


source /home/edickinson/preql-studio/.venv/bin/activate

install local package
pip install /mnt/c/users/ethan/coding_projects/pypreql



## Building

Debug:
pyinstaller main.py  --noconsole  --name debug --hidden-import py-portfolio-index  --collect-all py_portfolio_index --hidden-import alpaca-py --collect-all uvicorn --noconfirm --clean --additional-hooks-dir extra-hooks

Release:
 pyinstaller main.py  --noconsole --onefile --name py-portfolio-ui-backend --hidden-import py-portfolio-index --collect-all py_portfolio_index  --hidden-import alpaca-py --collect-all uvicorn --noconfirm --clean --additional-hooks-dir extra-hooks
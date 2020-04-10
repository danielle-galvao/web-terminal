# web-terminal
[![PyPI version](https://badge.fury.io/py/web-terminal.svg)](https://badge.fury.io/py/web-terminal)
[![GitHub Stars](https://img.shields.io/github/stars/danielle-galvao/web-terminal.svg)](https://github.com/danielle-galvao/web-terminal/stargazers)
[![Client CI Workflow](https://github.com/danielle-galvao/web-terminal/workflows/Client%20CI/badge.svg)](https://github.com/danielle-galvao/web-terminal/actions?query=workflow%3A%22Client+CI%22)
[![Join the chat at https://gitter.im/web-terminal/community](https://badges.gitter.im/web-terminal/community.svg)](https://gitter.im/web-terminal/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

CSE 40677 Open Source Software Development -  Web Terminal Project

[Project Website - GitHub Pages](https://danielle-galvao.github.io/web-terminal/)

[Kanban Board](https://opensourcewebterminalproject.atlassian.net)

## Getting Started

### User

#### Installation

```sh
pip install web_terminal
```

#### Running

```sh
python3 -m web_terminal
```

### Developer

#### Prerequisites

```sh
pip install flask websockets
npm install -g @angular/cli
cd client
npm install
cd -
```

#### Running

```sh
cd client
ng build -- --configuration=flask
cd -
python web-terminal.py
```

build can optionally be run with `--prod` or `--watch`
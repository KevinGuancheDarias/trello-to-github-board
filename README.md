Trello to github board
======================

## Introduction

Trello to github board ia a command to easily migrate an existing Trello board to Github project board. This is a tiny tool I needed for my projects, and probably misses a lot of features, such as of v0.1.0 there is no way to make the user/password login method to work, forcing you to use a PAT (Personal Access Token) token

## Usage

1. Install nodejs in your system
2. Install the command `npm install -g trello-to-github-board`
3. Go to https://trello.com/b/your_board_id.json and save it with your preferred name
4. Create map file to map lists and labels, you may look inside `examples` folder in this repository
5. Run `trello-to-git-board parse trello_file.json -m mapfile.json`
6. Now you have a `output.json` file, that you can look for, and if everything seems ok, you can import it to your project board
7. Get a PAT from https://github.com/settings/tokens and then run from a bash script `$ GIT_TOKEN=token_value trello-to-git-board import output.json https://github.com/your_user/your_repo/projects/your_project_id`


## Contributing 
### :heart: Donating :heart:

This project is open source, and the only income comes from the donators, If you like the project, please donate, thank you :wine_glass:

[Donate Using Patreon](https://www.patreon.com/bePatron?u=13416760) | [![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=XYSG7NDRN5HM6&source=url)

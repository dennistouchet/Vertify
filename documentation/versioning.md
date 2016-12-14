# git hook for versioning

 git hooks are located in the directory

 `/vertifyui/git_hooks/`

## to enable the hook

    Copy the file from the `git_hooks` directory

    and add it to `.git/hooks/` folder

    rename it *post-commit*

    open terminal and update the permissions to the file:

    `chmod a+x post-commit`

    vertify permissions are updated to match the other hooks:

    `ls -l`

## Deploying code/tags/version

    When committing code a tag will automatically be created by the hook.

    If you would like to update the version in the repo simply add --follow-tags
    to your push.

    Ex: `git push --follow-tags`

## Versioning in VertifyUI

    You can see the current version running on the site by checking the bottom
    right most corner. The version will appear something like:

    `v0.9.3.94c427bd23b2103fc9ba7d7e1a15c1f7773c8a15`

# Viewing last 5 and output to log.txt

  git log --graph --pretty=format:'%h -%d %s (%cr) <%an>' --abbrev-commit -n 5 > log.txt

 # Alias color coded view all

  alias glog="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

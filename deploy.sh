_TMP_NODE_ENV=$NODE_ENV
_TMP_CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
git checkout -b gh-pages &&
    NODE_ENV=production npm run build &&
    cp public/* . &&
    git add . &&
    git commit -m "deploy" &&
    git push -u origin gh-pages --force &&
    git checkout $_TMP_CURRENT_BRANCH &&
    git branch -D gh-pages
NODE_ENV=$_TMP_NODE_ENV

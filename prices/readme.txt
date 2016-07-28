cd ~/projects/parking/downtownseattleparking.com
git log --pretty=tformat:%ci_%H --follow js/lots-data.js >| ../prices/lots-commits.txt
cd ~/projects/parking/prices


git log --pretty=tformat:%ci_%H --follow js/lots-data.js | sed -e 'h;s/\(.*\)_\(.*\)/git show \2:js\/lots-data.js >| "..\/prices\/\1"/;' >| ../prices/git-commands
sh ../prices/git-commands



local shell_script = [[
cd /root/workspace/lua/keepwork/npl_packages/nws/;
git reset --hard HEAD;
git pull origin master;
cd /root/workspace/lua/keepwork/;
git reset --hard HEAD;
git pull origin master;
r.js -o build.js;
./start.sh restart;
]]

os.execute(shell_script)



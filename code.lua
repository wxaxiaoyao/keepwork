

local shell_script = [[
cd /root/workspace/lua/keepwork/npl_packages/nws/;
git reset --hard HEAD;
git pull origin master;
cd /root/workspace/lua/keepwork/;
git reset --hard HEAD;
git pull origin master;
r.js -o build.js;
cd /root/workspace/lua/keepwork/vue/;
echo $PATH
/usr/local/bin/npm run build --scripts-prepend-node-path=/usr/bin;
cd /root/workspace/lua/keepwork/;
./start.sh restart;
]]

os.execute(shell_script)

--ngx.log(ngx.ERR, "-------------code-------------")



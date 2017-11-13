require("npl_packages/nws/npl_mod/nws/loader")

local test = nws.gettable("nws.test")

-- 加载测试文件
nws.import("model/demo_test")
nws.import("model/demo1_test")

-- 输出测试结果
test:output()

nws.log("单元测试结束")
nws.exit()

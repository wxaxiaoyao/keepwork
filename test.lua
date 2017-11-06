require("nws/src/test_loader")

local test = nws.gettable("nws.test")

-- 加载测试文件
nws.import("model/demo_test")
nws.import("model/demo1_test")

-- 输出测试结果
test:output()

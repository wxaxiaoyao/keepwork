
const = {}


-- DATA_SOURCE_TYPE
const.DATA_SOURCE_TYPE_GITLAB = "gitlab"
const.DATA_SOURCE_TYPE_GITHUB = "github"
const.DATA_SOURCE_PROJECT_NAME_PREFIX = "keepwork"
const.DEFAULT_DATA_SOURCE_NAME = "__keepwork__"
const.DEFAULT_DATA_SOURCE_PUBLIC_SITENAME = "__keepwork_public__"
const.DEFAULT_DATA_SOURCE_PRIVATE_SITENAME = "__keepwork_private__"
const.DEFAULT_DATA_SOURCE_PUBLIC_PROJECT_NAME = "syskeepworkpublic"
const.DEFAULT_DATA_SOURCE_PRIVATE_PROJECT_NAME = "syskeepworkprivate"


-- SITE_TYPE
const.SITE_TYPE_PERSONAL = 0
const.SITE_TYPE_ORGANIZATION = 1
const.SITE_TYPE_GAME = 2
const.SITE_TYPE_COMPANY = 3

-- 站点权限级别
const.FILE_ACCESS_FORBIT_LEVEL=10     -- 禁止读写
const.FILE_ACCESS_READ_LEVEL=20     -- 读
const.FILE_ACCESS_WRITE_LEVEL=30    -- 读写

return const


local util = require("util")


local token = "eyJhbGciOiJNRDUiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6Ind4YXRlc3QiLCJleHAiOjE1Mjk3Mzk1NTZ9.TVdZM05XRmlNRFZoTVdJNE5qRTRZV1kzT0dRNU1HVmxNV1V5TlRrMk1qVT0"

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6Ind4YXRlc3QiLCJleHAiOjE1Mjk3NDUxMjZ9.T1RZMVpXRmxNVFl4TnpjNE56TXpZbUl3TVRFd01EUXlZMlUxT1RJeVpXWT0"
local obj = util.decode_jwt(token, "keepwork")
for k, v in pairs(obj or {}) do
	print(k, v)
end
--print(util.encode_jwt({user_id=2, username = "wxatest"}, "keepwork", 3600 * 3600))
--print(util.decode_jwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6Ind4YXRlc3QiLCJleHAiOjE1Mjk3NDI2OTJ9.xWY97kBshkkyt2zXh9jOjUgcLhUbHHW0qREt8STe4Vo"))

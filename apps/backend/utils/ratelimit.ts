import redisClient from "@/lib/redis"


const SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

local windowStart = now - window

-- Remove old entries
redis.call("ZREMRANGEBYSCORE", key, 0, windowStart)

local count = redis.call("ZCARD", key)

if count >= limit then
    local oldest = redis.call("ZRANGE", key, 0, 0, "WITHSCORES")
    local oldestTime = tonumber(oldest[2])

    local retryAfter = math.floor((window - (now - oldestTime)) / 1000)
    retryAfter = math.max(retryAfter, 0)

    return {0, retryAfter}
end

-- Add current request
redis.call("ZADD", key, now, tostring(now))

-- Set expiry
redis.call("EXPIRE", key, math.ceil(window / 1000))

return {1, limit - count - 1}
`

export const checkIsAllowed = async (
  key: string,
  limit: number,
  windowSec: number
) => {
    const now = Date.now()
    const result = await redisClient.eval(
    SLIDING_WINDOW_LUA,
    {
        keys: [key],
        arguments: [
            now.toString(),
            (windowSec * 1000).toString(),
            limit.toString()
        ]
    }

)

return {
    allowed: result[0] === 1,
    retryAfter: result[1]
}
}
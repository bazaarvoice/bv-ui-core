import { default as getStatistics } from './statistics'

const typeMap = {
  statistics: getStatistics
}

function get (type, options = {}) {
  const call = typeMap[type]
  if (!call) {
    throw new TypeError(`Unsupported method: ${type}`)
  }
  return call(options)
}

export { get, getStatistics }

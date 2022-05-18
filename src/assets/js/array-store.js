import storage from 'good-storage'

// compare 自定义比较规则 只保存maxLen的数据
function inertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 插入
  arr.unshift(val)
  // 弹出最先喜欢的数据
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  // 删除数组的某一项
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function save(item, key, compare, maxLen) {
  // 没有数据就默认一个空数组[]
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

// 夹杂数据
export function load(key) {
  return storage.get(key, [])
}

export function clear(key) {
  storage.remove(key)
  return []
}

export function saveAll(items, key) {
  storage.set(key, items)
}

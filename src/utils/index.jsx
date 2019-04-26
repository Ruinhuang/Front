export const formateDate = (time) => {
  const checkTime = (time) => {
    return time < 10 ? "0" + time : time
  }
  if (!time) return '';
  let date = new Date(time);
  return date.getFullYear() + '-' + checkTime(date.getMonth() + 1) +
    '-' + checkTime(date.getDate()) + ' ' +
    checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" + checkTime(date.getSeconds());
}

export const goToUrl = p =>
  window.location.href = `${window.location.href.split('#')[0]}#${p}`

export const selectTag = (arr, items) => {
  // 非幂等
  items.forEach(item => {
    let position = arr.indexOf(item)
    if (position < 0) {
      arr.push(item)
    } else {
      arr.splice(position, 1)
    }
  });
  return arr
}

export const removeFromArray = (arr, items) => {
  // 非幂等
  items.forEach(item => {
    let position = arr.indexOf(item)
    if (position >= 0) {
      arr.splice(position, 1)
    }
  });
  return arr
}

export const pagination = (data, callback) => ({
  onChange: current => callback(current),
  current: parseInt(data.page),
  pageSize: parseInt(data.page_size),
  total: parseInt(data.total),
  showTotal: () => (`共${data.total}条数据`),
})


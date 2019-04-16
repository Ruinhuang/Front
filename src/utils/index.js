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

export const selectTag = (arr, item) => {
  let position = arr.indexOf(item)
  if (position < 0) {
    arr.push(item)
  } else {
    arr.splice(position, 1)
  }
  return arr
}

export const pagination = (data, callback) => ({
  onChange: current => callback(current),
  current: data.page,
  dataSize: data.data_size,
  total: data.total,
  showTotal:()=>(`共${data.total}条数据`),
})
  

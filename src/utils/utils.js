//src/utils/utils.js

export default {
    formateDate(time) {
        function checkTime(time){
          return time<10?"0"+time:time
        }
      if (!time) return '';
        let date = new Date(time);
        return date.getFullYear() + '-' + checkTime(date.getMonth() + 1) +
                '-' + checkTime(date.getDate()) + ' ' +
          checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" + checkTime(date.getSeconds());
    }
}
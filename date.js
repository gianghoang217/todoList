exports.getDate = function() {
  let today = new Date();
  //   var currentDay = today.getDay();
  //   var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleString("en-US", options);
  return day;
}


exports.getDay = function () {
    let today = new Date();
    //   var currentDay = today.getDay();
    //   var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let options = {
      weekday: "long",
    };
    let day = today.toLocaleString("en-US", options);
    return day;
  }
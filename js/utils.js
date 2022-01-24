export default {
  getDayOfWeek: function(date){
    date = date || new Date()
    if(typeof date == "string") {
      date = new Date(date)
    }
    try {
      return "日一二三四五六".charAt(date.getDay());
    } catch (error) {
      return ""
    }
  }
}

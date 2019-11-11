
const firstCharCapital = {
  install:  function(Vue) {
    Vue.filter('first-char-capital', (text) => {
      // remove empty chars on start of text
      while(text.length > 0) {
        if(text.substring(0, 1) == " ") {
          text = text.substring(1);
        }
        else {
          break;
        }
      }

      text = text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase()
      return text
    })
  }
}

export default firstCharCapital
import Cookies from 'js-cookie';


const SETTINGS = "settings";
const DATA = "init_data";

class CookieStorage {
  saveSettings(settings) {
    Cookies.set(SETTINGS, JSON.stringify(settings));
  }

  getSettings(settings) {
    let settings_cookie = Cookies.get(SETTINGS);
    if(settings_cookie) {
      return JSON.parse(settings_cookie);
    }
    return null;
  }

  saveData(data) {
    Cookies.set(DATA, JSON.stringify(data));
  }

  getData(data) {
    let init_data_cookie = Cookies.get(DATA);
    if(init_data_cookie) {
      return JSON.parse(init_data_cookie);
    }
    return null;
  }
}

export default CookieStorage;
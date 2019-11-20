import Cookies from 'js-cookie';


const SETTINGS = "settings";
const DATA = "init_data";
const MEETINGS = "meetings";

class CookieStorage {
  saveSettings(meeting_slugname, settings) {
    let meeting_key = `${meeting_slugname}_${SETTINGS}`;
    Cookies.set(meeting_key, JSON.stringify(settings));
  }

  getSettings(meeting_slugname) {
    let meeting_key = `${meeting_slugname}_${SETTINGS}`;
    let settings_cookie = Cookies.get(meeting_key);
    if(settings_cookie) {
      return JSON.parse(settings_cookie);
    }
    return null;
  }

  deleteSettings(meeting_slugname) {
    let meeting_key = `${meeting_slugname}_${SETTINGS}`;
    Cookies.remove(meeting_key)
  }

  saveData(meeting_slugname, data) {
    let meeting_key = `${meeting_slugname}_${DATA}`;
    Cookies.set(meeting_key, JSON.stringify(data));
  }

  getData(meeting_slugname) {
    let meeting_key = `${meeting_slugname}_${DATA}`;
    let init_data_cookie = Cookies.get(meeting_key);
    if(init_data_cookie) {
      return JSON.parse(init_data_cookie);
    }
    return null;
  }

  deleteData(meeting_slugname) {
    let meeting_key = `${meeting_slugname}_${DATA}`;
    Cookies.remove(meeting_key)
  }

  saveNewMeeting(meeting_slugname, meeting_name) {
    let meetings = this.getMeetings();
    meetings[meeting_slugname] = {
      slugname: meeting_slugname,
      name: meeting_name
    }
    Cookies.set(MEETINGS, JSON.stringify(meetings));
  }

  getMeetings() {
    let meetings_cookie = Cookies.get(MEETINGS);
    if(!meetings_cookie) {
      return {}
    }
    return JSON.parse(meetings_cookie);
  }

  getMeeting(meeting_slugname) {
    let meetings = this.getMeetings();
    if(meeting_slugname in meetings) {
      return meetings[meeting_slugname];
    }
    return null;
  }

  deleteMeeting(meeting_slugname) {
    let meetings = this.getMeetings();
    if(meeting_slugname in meetings) {

      this.deleteSettings()
      this.deleteData()

      delete meetings[meeting_slugname]
    }
    Cookies.set(MEETINGS, JSON.stringify(meetings));
  }
}

export default CookieStorage;
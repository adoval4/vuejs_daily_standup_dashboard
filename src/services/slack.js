import axios from 'axios';

class SlackClient {
  constructor(webhook_url) {
    this.webhook_url = webhook_url;
  }

  sendMessage(message) {
    axios.post(
      this.webhook_url,
      JSON.stringify({
        text: message
      })
    )
  }
}

export default SlackClient;


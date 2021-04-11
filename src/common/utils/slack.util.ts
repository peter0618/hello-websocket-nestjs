import * as Slack from 'slack-node';

export class SlackUtil {
  static send(u, m, c, e) {
    const webhookUri = 'https://hooks.slack.com/services/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';
    const slack = new Slack();
    slack.setWebhook(webhookUri);
    return new Promise(resolve => {
      slack.webhook(
        {
          username: u,
          text: m,
          channel: c,
          icon_emoji: e == null ? ':heavy_check_mark:' : e,
        },
        (err, response) => (err ? resolve(err) : resolve(response)),
      );
    });
  }
}

const getConfig = require('probot-config');

const defaultConfig = {
  requestInfoReplyComment:
    'The maintainers of this repository require that you fill out the issue template correctly.',
  requestInfoOn: {
    issue: true
  },
  requiredHeaders: [
    'Prerequisites',
    'Expected Behavior',
    'Current Behavior',
    'Possible Solution',
    'Your Environment'
  ]
};

module.exports = app => {
  async function receive(context) {
    const labels = await this.github.issues.listLabelsOnIssue();
    if (!labels.includes('bug')) return;

    const { title, body } = context.payload.issue;
    const lowerCaseBody = body.toLowerCase();

    try {
      const config = await getConfig(context, 'config.yml', defaultConfig);

      let invalid = false;

      if (!title || !body) {
        invalid = true;
      }

      const { requiredHeaders } = config;
      for (const header of requiredHeaders) {
        if (!lowerCaseBody.includes(header.toLowerCase())) {
          invalid = true;
        }
      }

      if (invalid) {
        const { requestInfoReplyComment: closeComment } = config;
        await this.github.issues.createComment({
          body: closeComment
        });
        this.github.issues.edit({ state: 'closed' });
      }
    } catch (err) {
      if (err.code !== 404) {
        throw err;
      }
    }
  }

  app.on(['issues.opened', 'issues.edited'], receive);
};

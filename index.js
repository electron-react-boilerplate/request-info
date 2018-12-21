const getConfig = require('probot-config');

const defaultConfig = {
  requestInfoReplyComment:
    'The maintainers of this repository require that you fill out the issue template correctly.',
  requiredHeaders: [
    'Prerequisites',
    'Expected Behavior',
    'Current Behavior',
    'Possible Solution',
    'Your Environment'
  ],
  requireBugLabel: true
};

module.exports = app => {
  async function receive(context) {
    const { data: labels } = await context.github.issues.listLabelsOnIssue(
      context.issue()
    );
    if (!labels.find(label => label.name === 'bug')) return;

    try {
      const config = await getConfig(context, 'config.yml', defaultConfig);

      let invalid = false;

      const { title, body } = context.payload.issue;
      const lowerCaseBody = body.toLowerCase();

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
        await context.github.issues.createComment(
          context.issue({ body: closeComment })
        );
        await context.github.issues.edit(context.issue({ state: 'closed' }));
      }
    } catch (err) {
      if (err.code !== 404) {
        throw err;
      }
    }
  }

  app.on(['issues.opened', 'issues.edited'], receive);
};

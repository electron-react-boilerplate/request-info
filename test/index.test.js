const nock = require('nock');
const myProbotApp = require('..');
const { Probot } = require('probot');
const payload = require('./fixtures/issues.opened');

const issueCreatedBody = { body: 'Thanks for opening this issue!' };

nock.disableNetConnect();

describe('My Probot app', () => {
  let probot;

  beforeEach(() => {
    probot = new Probot({});
    // Load our app into probot
    const app = probot.load(myProbotApp);

    // just return a test token
    app.app = () => 'test';
  });

  test('creates a comment when an issue is opened', async () => {
    // https://api.github.com/repos/hiimbex/testing-things/contents/.github/config.yml
    nock('https://api.github.com')
      .get('/repos/hiimbex/testing-things/contents/.github/config.yml')
      .reply(200, {
        data: {
          content: `
            requiredHeaders:
  - Prerequisites
  - Expected Behavior
  - Current Behavior
  - Possible Solution
  - Your Environment`
        }
      });

    nock('https://api.github.com')
      .get('/repos/hiimbex/testing-things/issues/1/labels')
      .reply(200, [
        {
          id: 208045946,
          node_id: 'MDU6TGFiZWwyMDgwNDU5NDY=',
          url: 'https://api.github.com/repos/octocat/Hello-World/labels/bug',
          name: 'bug',
          description: "Something isn't working",
          color: 'f29513',
          default: true
        },
        {
          id: 208045947,
          node_id: 'MDU6TGFiZWwyMDgwNDU5NDc=',
          url:
            'https://api.github.com/repos/octocat/Hello-World/labels/enhancement',
          name: 'enhancement',
          description: 'New feature or request',
          color: 'a2eeef',
          default: false
        }
      ]);

    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' });

    nock('https://api.github.com')
      .post('/repos/hiimbex/testing-things/issues/1/comments', body => {
        expect(body).toMatchObject(issueCreatedBody);
        return true;
      })
      .reply(200);

    await probot.receive({ name: 'issues', payload });
  });
});

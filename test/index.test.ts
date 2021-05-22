import { server, rest } from './mock/server';
import { CodeInsights } from '../src/index';

const url = process.env.BBS_HOST || 'https://local-test.example.org';
const accessToken = process.env.BBS_TOKEN || 'super-secret-token';
const repo = process.env.REPO || 'repo';
const project = process.env.PROJECT || 'some-project';
const commitId = process.env.COMMIT_ID || 'e69494baf07d6277393051cabece2ba56bad2a3a';

test('Create codeInsights object', () => {
    const codeInsights = new CodeInsights({
        url,
        accessToken
    }, {
        project,
        repo,
        commitId,
        reportKey: 'dev.test.bbs-code-insights'
    });
    expect(codeInsights).not.toBeNull();
});

test('Send report w/o annotations', async () => {
    const reportKey = 'dev.test.bbs-code-insights.wo-annotations';

    const codeInsights = new CodeInsights({
        url,
        accessToken
    }, {
        project,
        repo,
        commitId,
        reportKey
    });

    const handler = jest.fn((req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== `Bearer ${accessToken}`) {
            return res(ctx.status(405));
        }
        return res(ctx.json({
            'data': [
                {
                    'title': 'data.title',
                    'value': 9,
                    'type': 'NUMBER'
                }
            ],
            'createdDate': 12345,
            'details': 'This is the details of the report, it can be a longer string describing the report',
            'key': 'report.key',
            'link': 'http://integration.host.com',
            'logoUrl': 'http://integration.host.com/logo',
            'result': 'PASS',
            'title': 'report.title',
            'reporter': 'Reporter/tool that produced this report'
        }));
    });

    server.use(
        rest.put(`${url}/rest/insights/1.0/projects/${project}/` +
            `repos/${repo}/commits/${commitId}/reports/${reportKey}`,
            handler)
    );

    await codeInsights.createReport({
        title: 'some report that we created'
    });

    expect(handler).toBeCalledTimes(1);
});


test('Send report w/ annotations', async () => {
    const reportKey = 'dev.test.bbs-code-insights.w-annotations';

    const codeInsights = new CodeInsights({
        url,
        accessToken
    }, {
        project,
        repo,
        commitId,
        reportKey
    });

    const reportHandler = jest.fn((req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== `Bearer ${accessToken}`) {
            return res(ctx.status(405));
        }
        return res(ctx.json({
            'data': [
                {
                    'title': 'Some random number',
                    'value': 9,
                    'type': 'NUMBER'
                }
            ],
            'createdDate': 12345,
            'details': 'This is the details of the report, it can be a longer string describing the report',
            'key': 'report.key',
            'link': 'http://integration.host.com',
            'logoUrl': 'http://integration.host.com/logo',
            'result': 'PASS',
            'title': 'report.title',
            'reporter': 'Reporter/tool that produced this report'
        }));
    });

    server.use(
        rest.put(`${url}/rest/insights/1.0/projects/${project}/` +
            `repos/${repo}/commits/${commitId}/reports/${reportKey}`,
            reportHandler)
    );

    const annotationsHandler = jest.fn((req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== `Bearer ${accessToken}`) {
            return res(ctx.status(405));
        }
        return res(ctx.status(204));
    });

    server.use(
        rest.post(`${url}/rest/insights/1.0/projects/${project}/` +
            `repos/${repo}/commits/${commitId}/reports/${reportKey}/annotations`,
            annotationsHandler)
    );

    await codeInsights.createReport({
        title: 'Test Report2',
        reporter: 'jest',
        createdDate: new Date().getTime(),
        details: 'This report was created by a jest test, that runs within the bbs-code-insights repo',
        result: 'PASS',
        data: [
            {
                'title': 'Some random number',
                'value': 9,
                'type': 'NUMBER'
            }
        ]
    }, [
        {
            path: 'Frontend/app/src/app.js',
            line: 103,
            message: 'nice new change :+1: | emojis are not supported oO',
            severity: 'MEDIUM'
        }
    ]);

    expect(reportHandler).toBeCalledTimes(1);
    expect(annotationsHandler).toBeCalledTimes(1);
});
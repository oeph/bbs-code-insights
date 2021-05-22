import { server, rest } from './mock/server';
import { CodeInsights } from '../src/index';

test('Create codeInsights object', () => {
    const codeInsights = new CodeInsights({
        url: process.env.BBS_HOST as string,
        accessToken: process.env.BBS_TOKEN as string
    }, {
        project: 'MDM',
        repo: 'madam2',
        commitId: 'e69494baf07d6277393051cabece2ba56bad2a3a',
        reportKey: 'dev.test.bbs-code-insights'
    });
    expect(codeInsights).not.toBeNull();
});

test('Send report w/o annotations', async () => {
    const bbsHost = process.env.BBS_HOST as string;
    const commitId = 'e69494baf07d6277393051cabece2ba56bad2a3a';
    const reportKey = 'dev.test.bbs-code-insights.wo-annotations';

    const codeInsights = new CodeInsights({
        url: bbsHost,
        accessToken: process.env.BBS_TOKEN as string
    }, {
        project: 'MDM',
        repo: 'madam2',
        commitId,
        reportKey
    });

    const handler = jest.fn((req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== `Bearer ${process.env.BBS_TOKEN}`) {
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
        rest.put(`${bbsHost}/rest/insights/1.0/projects/MDM/` +
            `repos/madam2/commits/${commitId}/reports/${reportKey}`,
            handler)
    );

    await codeInsights.createReport({
        title: 'some report that we created'
    });

    expect(handler).toBeCalledTimes(1);
});


test('Send report w/ annotations', async () => {
    const bbsHost = process.env.BBS_HOST as string;
    const commitId = 'e69494baf07d6277393051cabece2ba56bad2a3a';
    const reportKey = 'dev.test.bbs-code-insights.w-annotations';

    const codeInsights = new CodeInsights({
        url: bbsHost,
        accessToken: process.env.BBS_TOKEN as string
    }, {
        project: 'MDM',
        repo: 'madam2',
        commitId,
        reportKey
    });

    const reportHandler = jest.fn((req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== `Bearer ${process.env.BBS_TOKEN}`) {
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
        rest.put(`${bbsHost}/rest/insights/1.0/projects/MDM/` +
            `repos/madam2/commits/${commitId}/reports/${reportKey}`,
            reportHandler)
    );

    const annotationsHandler = jest.fn((req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');
        if (authHeader !== `Bearer ${process.env.BBS_TOKEN}`) {
            return res(ctx.status(405));
        }
        return res(ctx.status(204));
    });

    server.use(
        rest.post(`${bbsHost}/rest/insights/1.0/projects/MDM/` +
            `repos/madam2/commits/${commitId}/reports/${reportKey}/annotations`,
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
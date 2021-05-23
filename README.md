![npm](https://img.shields.io/npm/v/bbs-code-insights?style=for-the-badge)
![npm](https://img.shields.io/npm/dy/bbs-code-insights?style=for-the-badge)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/oeph/bbs-code-insights?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/bbs-code-insights?style=for-the-badge)

# Code Insights for Bitbucket Server

Wrapper for [Code Insights](https://confluence.atlassian.com/bitbucketserver/code-insights-966660485.html) on Bitbucket Server

## Installation

```sh
npm install bbs-code-insights
```

## Usage

```javascript
const codeInsights = new CodeInsights(
    {
        url: 'https://your-bitbucket-server.example.org',
        accessToken: 'gp762nuuoqcoxypju8c569th9wz7q5',
    },
    {
        project: 'projectKey',
        repo: 'repositorySlug',
        commitId: '84eb815afaea6923b08a5514b978d0a404aaf121',
        reportKey: 'your.report.integration.key',
    }
);

await codeInsights.createReport({
    title: 'Special Test tool report',
    reporter: 'Special Tool Integration',
    details: 'This report was created by a integration for our special tool',
    result: 'PASS',
});
```

> For Access-Tokens refer to [Personal Access Tokens](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html)
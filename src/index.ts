import axios from 'axios';
import { Annotation, BitbucketProperties, CodeInsightProperties, Report } from './types';

export class CodeInsights {
    bitbucket: BitbucketProperties;
    config: CodeInsightProperties;

    constructor(bitbucket: BitbucketProperties, config: CodeInsightProperties) {
        this.bitbucket = bitbucket;
        this.config = config;
    }

    async createReport(report: Report, annotations?: Array<Annotation>): Promise<void> {
        const url = `${this.bitbucket.url}/rest/insights/1.0`
            + `/projects/${this.config.project}`
            + `/repos/${this.config.repo}`
            + `/commits/${this.config.commitId}`
            + `/reports/${this.config.reportKey}`;
        try {
            const reportResponse = await axios.put(url,
                {
                    ...report
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.bitbucket.accessToken}`
                    }
                }
            );
            if (reportResponse.status >= 300) {
                console.warn('Could not create report', reportResponse.statusText);
            }

            if (annotations) {
                const annotationResponse = await axios.post(
                    url + '/annotations',
                    { annotations },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.bitbucket.accessToken}`
                        }
                    }
                );
                if (annotationResponse.status >= 300) {
                    console.warn('Could not create report annotations', annotationResponse.statusText);
                }
            }
        } catch (error) {
            console.error(error);
            throw new Error('Could not create insights report');
        }
    }
}
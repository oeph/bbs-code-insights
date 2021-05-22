// Types are based on https://docs.atlassian.com/bitbucket-server/rest/7.13.0/bitbucket-code-insights-rest.html

export interface BitbucketProperties {
    url: string,
    accessToken: string
}

export interface CodeInsightProperties {
    /**
     * The project key
     */
    project: string,
    /**
     * The repository slug
     */
    repo: string,
    /**
     * The commit ID on which the report is recorded. This must be a full 40 character commit hash
     */
    commitId: string,
    /**
     * A unique string representing the report as chosen by the reporter. This should be unique 
     * enough to not clash with other report's keys. To do this, we recommend namespacing the 
     * key using reverse DNS
     */
    reportKey: string,
}

export interface Report {
    /**
     * A short string representing the name of the report
     * 
     * Max length: 450 characters (but we recommend that it is shorter so that the display is nicer)
     */
    title: string,
    /**
     * A string to describe the purpose of the report. This string may contain escaped newlines and 
     * if it does it will display the content accordingly.
     * 
     * Max length: 2000 characters
     */
    details?: string,
    /**
     * Indicates whether the report is in a passed or failed state
     */
    result?: 'PASS' | 'FAIL',
    /**
     * An array of data fields (described below) to display information on the report
     * 
     * Maximum 6 data fields
     */
    data?: Array<ReportData>,
    /**
     * Timestamp of the creation
     * 
     * Official api?
     */
    createdDate?: number,
    /**
     * A string to describe the tool or company who created the report
     * 
     * Max length: 450 characters
     */
    reporter?: string,
    /**
     * A URL linking to the results of the report in an external tool.
     */
    link?: string,
    /**
     * A URL to the report logo. If none is provided, the default insights logo will be used.
     */
    logoUrl?: string,
}

export interface ReportData {
    /**
     * A string describing what this data field represents
     */
    title: string,
    /**
     * The type of data contained in the value field. If not provided, then the value will 
     * be detected as a boolean, number or string. 
     */
    type: 'BOOLEAN' | 'DATE' | 'DURATION' | 'LINK' | 'NUMBER' | 'PERCENTAGE' | 'TEXT',
    value: string | number | boolean | ReportDataLink
}

export interface ReportDataLink {
    linktext: string,
    href: string,
}

export interface Annotation {
    /**
     * The path of the file on which this annotation should be placed. This is the path of the 
     * file relative to the git repository. If no path is provided, then it will appear in the 
     * overview modal on all pull requests where the tip of the branch is the given commit, 
     * regardless of which files were modified.
     */
    path: string,
    /**
     * The line number that the annotation should belong to. If no line number is provided, 
     * then it will default to 0 and in a pull request it will appear at the top of the file 
     * specified by the path field.
     * 
     * Restrictions: Non-negative integer
     */
    line: number,
    /**
     * The message to display to users
     * 
     * Restrictions: The maximum length accepted is 2000 characters, however the user interface
     * may truncate this value for display purposes. We recommend that the message is short and 
     * succinct, with further details available to the user if needed on the page linked to by 
     * the the annotation link.
     */
    message: string,
    /**
     * The severity of the annotation
     */
    severity: 'HIGH' | 'MEDIUM' | 'LOW',
    /**
     * If the caller requires a link to get or modify this annotation, then an ID must be provided. 
     * It is not used or required by Bitbucket, but only by the annotation creator for updating or 
     * deleting this specific annotation.
     * 
     * Restrictions: A string value shorter than 450 characters
     */
    externalId?: string,
    /**
     * An http or https URL representing the location of the annotation in the external tool
     */
    link?: string,
    /**
     * The type of annotation posted
     */
    type?: 'VULNERABILITY' | 'CODE_SMELL' | 'BUG'
}
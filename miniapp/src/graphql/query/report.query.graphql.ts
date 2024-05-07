import { gql } from "@apollo/client";

export const reportQuery = gql`
query report($filter: ReportFilter!) {
    report(filter: $filter) {
        classScheduleReport
        compGuidanceReport
        eduReformReport
        mentorshipReport
        monographReport
        paperReport
        sciResearchReport
        uGPGGuidanceReport
        startDate
        endDate
        teachers
    }
}
`

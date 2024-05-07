import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { ReportFilter, ReportResponse, Report } from "../models/models/report.model";
import { reportQuery } from "../models/graphql/query/report.query.graphql";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(
    private apollo: Apollo,
  ) { }

  getReport(filter: ReportFilter): Observable<Report | null> {
    return this.apollo.query({
      query: reportQuery,
      variables: {
        filter: filter
      }
    }).pipe(map((response: unknown) => {
      const report = (response as ReportResponse).data?.report;
      if (typeof report !== 'undefined' && report !== null) {
        return report;
      } else {
        return null;
      }
    }));
  }
}

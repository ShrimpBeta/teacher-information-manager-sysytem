import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { CreateSciResearchResponse, DeleteSciResearchResponse, EditSciResearch, SciResearch, SciResearchFilter, SciResearchPage, SciResearchResponse, SciResearchsByFilterResponse, UpdateSciResearchResponse } from "../models/models/sciResearch.model";
import { map, Observable } from "rxjs";
import { sciResearchQuery, sciResearchsByFilterQuery } from "../models/graphql/query/sciresearch.query.graphql";
import { createSciResearchMutation, deleteSciResearchMutation, updateSciResearchMutation } from "../models/graphql/mutation/sciresearch.mutation.graphql";

@Injectable({
  providedIn: 'root'
})
export class SciResearchService {

  constructor(
    private apollo: Apollo
  ) { }

  getSciResearch(id: string): Observable<SciResearch | null> {
    return this.apollo.query({
      query: sciResearchQuery,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let sciResearch = (response as SciResearchResponse).data?.sciResearch;
        if (typeof sciResearch !== 'undefined' && sciResearch !== null) {
          return sciResearch;
        }
        return null;
      })
    );
  }

  getSciResearchsByFilter(sciResearchFilter: SciResearchFilter, pageIndex: number, pageSize: number): Observable<SciResearchPage | null> {
    return this.apollo.query({
      query: sciResearchsByFilterQuery,
      variables: {
        filter: sciResearchFilter,
        offset: pageIndex * pageSize,
        limit: pageSize
      }
    }).pipe(
      map((response: unknown) => {
        let sciResearchs = (response as SciResearchsByFilterResponse).data?.sciResearchsByFilter as SciResearchPage;
        if (typeof sciResearchs !== 'undefined' && sciResearchs !== null) {
          return sciResearchs;
        }
        return null;
      })
    );
  }

  createSciResearch(newSciResearch: EditSciResearch): Observable<SciResearch | null> {
    return this.apollo.mutate({
      mutation: createSciResearchMutation,
      variables: {
        sciResearchData: newSciResearch
      }
    }).pipe(
      map((response: unknown) => {
        let sciResearch = (response as CreateSciResearchResponse).data?.createSciResearch;
        if (typeof sciResearch !== 'undefined' && sciResearch !== null) {
          return sciResearch;
        }
        return null;
      })
    );
  }

  updateSciResearch(id: string, updateSciResearch: EditSciResearch): Observable<SciResearch | null> {
    return this.apollo.mutate({
      mutation: updateSciResearchMutation,
      variables: {
        id: id,
        sciResearchData: updateSciResearch
      }
    }).pipe(
      map((response: unknown) => {
        let sciResearch = (response as UpdateSciResearchResponse).data?.updateSciResearch;
        if (typeof sciResearch !== 'undefined' && sciResearch !== null) {
          return sciResearch;
        }
        return null;
      })
    );
  }

  deleteSciResearch(id: string): Observable<SciResearch | null> {
    return this.apollo.mutate({
      mutation: deleteSciResearchMutation,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let sciResearch = (response as DeleteSciResearchResponse).data?.deleteSciResearch;
        if (typeof sciResearch !== 'undefined' && sciResearch !== null) {
          return sciResearch;
        }
        return null;
      })
    );
  }

}

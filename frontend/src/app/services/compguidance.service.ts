import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map, Observable, of } from "rxjs";
import { CompGuidance, CompGuidanceFilter, CompGuidancePage, CompGuidanceResponse, CompGuidancesByFilterResponse, CreateCompGuidanceResponse, DeleteCompGuidanceResponse, EditCompGuidance, UpdateCompGuidanceResponse } from "../models/models/compGuidance.model";
import { compGuidanceQuery, compGuidancesByFilterQuery } from "../models/graphql/query/compguidance.query.graphql";
import { createCompGuidanceMutation, deleteCompGuidanceMutation, updateCompGuidanceMutation } from "../models/graphql/mutation/compguidance.mutation.graphql";

@Injectable({
  providedIn: 'root'
})
export class CompGuidanceService {
  constructor(
    private apollo: Apollo,
  ) { }

  getCompGuidancesByFilter(compGuidanceFilter: CompGuidanceFilter, pageIndex: number, pageSize: number): Observable<CompGuidancePage | null> {
    return this.apollo.query({
      query: compGuidancesByFilterQuery,
      variables: {
        filter: compGuidanceFilter,
        offset: pageIndex * pageSize,
        limit: pageSize
      },
      fetchPolicy: 'network-only'
    })
      .pipe(
        map((response: unknown) => {
          let compGuidances = (response as CompGuidancesByFilterResponse).data?.compGuidancesByFilter as CompGuidancePage;
          if (typeof compGuidances !== 'undefined' && compGuidances !== null) {
            return compGuidances;
          }
          return null;
        })
      );
  }

  getCompGuidance(id: string): Observable<CompGuidance | null> {
    return this.apollo.query({
      query: compGuidanceQuery,
      variables: {
        id: id
      },
    })
      .pipe(
        map((response: unknown) => {
          let compGuidance = (response as CompGuidanceResponse).data?.compGuidance;
          if (typeof compGuidance !== 'undefined' && compGuidance !== null) {
            return compGuidance;
          }
          return null;
        })
      );
  }

  createCompGuidance(newCompGuidance: EditCompGuidance): Observable<CompGuidance | null> {
    return this.apollo.mutate({
      mutation: createCompGuidanceMutation,
      variables: {
        compGuidanceData: newCompGuidance
      }
    })
      .pipe(
        map((response: unknown) => {
          let compGuidance = (response as CreateCompGuidanceResponse).data?.createCompGuidance;
          if (typeof compGuidance !== 'undefined' && compGuidance !== null) {
            return compGuidance;
          }
          return null;
        })
      );
  }

  updateCompGuidance(id: string, updateCompGuidance: EditCompGuidance): Observable<CompGuidance | null> {
    return this.apollo.mutate({
      mutation: updateCompGuidanceMutation,
      variables: {
        id: id,
        compGuidanceData: updateCompGuidance
      }
    })
      .pipe(
        map((response: unknown) => {
          let compGuidance = (response as UpdateCompGuidanceResponse).data?.updateCompGuidance;
          if (typeof compGuidance !== 'undefined' && compGuidance !== null) {
            return compGuidance;
          }
          return null;
        })
      );
  }

  deleteCompGuidance(id: string): Observable<CompGuidance | null> {
    return this.apollo.mutate({
      mutation: deleteCompGuidanceMutation,
      variables: {
        id: id
      }
    })
      .pipe(
        map((response: unknown) => {
          let compGuidance = (response as DeleteCompGuidanceResponse).data?.deleteCompGuidance;
          if (typeof compGuidance !== 'undefined' && compGuidance !== null) {
            return compGuidance;
          }
          return null;
        })
      );
  }
}

import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map, Observable } from "rxjs";
import { uGPGGuidancesByFilterQuery, uGPUGGuidanceQuery } from "../models/graphql/query/ugpgguidance.query.graphql";
import { CreateUGPGGuidanceResponse, DeleteUGPGGuidanceResponse, EditUGPGGuidance, UGPGGuidance, UGPGGuidanceFilter, UGPGGuidanceResponse, UGPGGuidancesByFilterResponse, UpdateUGPGGuidanceResponse } from "../models/models/uGPGGuidance.model";
import { createUGPGGuidanceMutation, deleteUGPGGuidanceMutation, updateUGPGGuidanceMutation } from "../models/graphql/mutation/ugpgguidance.mutation.graphql";

@Injectable({
  providedIn: 'root'
})
export class UgpgguidanceService {
  constructor(
    private apollo: Apollo
  ) { }

  getUgpgguidance(id: string): Observable<UGPGGuidance | null> {
    return this.apollo.query({
      query: uGPUGGuidanceQuery,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let ugpgguidance = (response as UGPGGuidanceResponse).data?.uGPGGuidance;
        if (typeof ugpgguidance !== 'undefined' && ugpgguidance !== null) {
          return ugpgguidance;
        }
        return null;
      })
    );
  }

  getUgpgguidancesByFilter(ugpgguidanceFilter: UGPGGuidanceFilter): Observable<UGPGGuidance[] | null> {
    return this.apollo.query({
      query: uGPGGuidancesByFilterQuery,
      variables: {
        filter: ugpgguidanceFilter
      }
    }).pipe(
      map((response: unknown) => {
        let ugpgguidances = (response as UGPGGuidancesByFilterResponse).data?.uGPGGuidancesByFilter;
        if (typeof ugpgguidances !== 'undefined' && ugpgguidances !== null) {
          return ugpgguidances;
        }
        return null;
      })
    );
  }

  createUgpgguidance(newUgpgguidance: EditUGPGGuidance): Observable<UGPGGuidance | null> {
    return this.apollo.mutate({
      mutation: createUGPGGuidanceMutation,
      variables: {
        ugpgguidanceData: newUgpgguidance
      }
    }).pipe(
      map((response: unknown) => {
        let ugpgguidance = (response as CreateUGPGGuidanceResponse).data?.createUGPGGuidance;
        if (typeof ugpgguidance !== 'undefined' && ugpgguidance !== null) {
          return ugpgguidance;
        }
        return null;
      })
    );
  }

  updateUgpgguidance(id: string, updatedUgpgguidance: EditUGPGGuidance): Observable<UGPGGuidance | null> {
    return this.apollo.mutate({
      mutation: updateUGPGGuidanceMutation,
      variables: {
        id: id,
        ugpgguidanceData: updatedUgpgguidance
      }
    }).pipe(
      map((response: unknown) => {
        let ugpgguidance = (response as UpdateUGPGGuidanceResponse).data?.updateUGPGGuidance;
        if (typeof ugpgguidance !== 'undefined' && ugpgguidance !== null) {
          return ugpgguidance;
        }
        return null;
      })
    );
  }

  deleteUgpgguidance(id: string): Observable<string | null> {
    return this.apollo.mutate({
      mutation: deleteUGPGGuidanceMutation,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let id = (response as DeleteUGPGGuidanceResponse).data?.deleteUGPGGuidance?.id;
        if (typeof id !== 'undefined' && id !== null) {
          return id;
        }
        return null;
      })
    );
  }
}

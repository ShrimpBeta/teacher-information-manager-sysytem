import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map, Observable } from "rxjs";
import { uGPGGuidancesByFilterQuery, uGPUGGuidanceQuery } from "../models/graphql/query/ugpgguidance.query.graphql";
import { CreateUGPGGuidanceResponse, DeleteUGPGGuidanceResponse, EditUGPGGuidance, UGPGGuidance, UGPGGuidanceFilter, UGPGGuidancePage, UGPGGuidanceResponse, UGPGGuidancesByFilterResponse, UpdateUGPGGuidanceResponse, UploadUGPGGuidancesResponse } from "../models/models/uGPGGuidance.model";
import { createUGPGGuidanceMutation, deleteUGPGGuidanceMutation, updateUGPGGuidanceMutation, uploadUGPGGuidancesMutation } from "../models/graphql/mutation/ugpgguidance.mutation.graphql";

@Injectable({
  providedIn: 'root'
})
export class UGPGGuidanceService {
  constructor(
    private apollo: Apollo
  ) { }

  getUGPGGuidance(id: string): Observable<UGPGGuidance | null> {
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

  getUGPGGuidancesByFilter(ugpgguidanceFilter: UGPGGuidanceFilter, pageIndex: number, pageSize: number): Observable<UGPGGuidancePage | null> {
    return this.apollo.query({
      query: uGPGGuidancesByFilterQuery,
      variables: {
        filter: ugpgguidanceFilter,
        offset: pageIndex * pageSize,
        limit: pageSize
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map((response: unknown) => {
        let ugpgguidances = (response as UGPGGuidancesByFilterResponse).data?.uGPGGuidancesByFilter as UGPGGuidancePage;
        if (typeof ugpgguidances !== 'undefined' && ugpgguidances !== null) {
          return ugpgguidances;
        }
        return null;
      })
    );
  }

  createUGPGGuidance(newUgpgguidance: EditUGPGGuidance): Observable<UGPGGuidance | null> {
    return this.apollo.mutate({
      mutation: createUGPGGuidanceMutation,
      variables: {
        uGPGGuidanceData: newUgpgguidance
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

  updateUGPGGuidance(id: string, updatedUgpgguidance: EditUGPGGuidance): Observable<UGPGGuidance | null> {
    return this.apollo.mutate({
      mutation: updateUGPGGuidanceMutation,
      variables: {
        id: id,
        uGPGGuidanceData: updatedUgpgguidance
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

  deleteUGPGGuidance(id: string): Observable<string | null> {
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

  uploadFile(file:File):Observable<EditUGPGGuidance[] | null>{
    return this.apollo.mutate({
      mutation: uploadUGPGGuidancesMutation,
      variables: {
        file: file
      }
    }).pipe(
      map((response: unknown) => {
        let ugpgguidance = (response as UploadUGPGGuidancesResponse).data?.uploadUGPGGuidances;
        if (typeof ugpgguidance !== 'undefined' && ugpgguidance !== null) {
          return ugpgguidance;
        }
        return null;
      })
    );
  }
}

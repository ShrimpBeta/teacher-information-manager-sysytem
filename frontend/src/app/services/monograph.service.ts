import { Injectable } from "@angular/core";
import { CreateMonographResponse, DeleteMonographResponse, EditMonograph, Monograph, MonographFilter, MonographPage, MonographResponse, MonographsByFilterResponse, UpdateMonographResponse } from "../models/models/monograph.model";
import { map, Observable } from "rxjs";
import { Apollo } from "apollo-angular";
import { monographQuery, monographsByFilterQuery } from "../models/graphql/query/monograph.query.graphql";
import { createMonographMutation, deleteMonographMutation, updateMonographMutation } from "../models/graphql/mutation/monograph.mutation.graphql";


@Injectable({
  providedIn: 'root'
})
export class MonographService {

  constructor(
    private apollo: Apollo
  ) { }

  getMonograph(id: string): Observable<Monograph | null> {
    return this.apollo.query({
      query: monographQuery,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let monograph = (response as MonographResponse).data?.monograph;
        if (typeof monograph !== 'undefined' && monograph !== null) {
          return monograph;
        }
        return null;
      })
    );
  }

  getMonographsByFilter(monographFilter: MonographFilter, pageIndex: number, pageSize: number): Observable<MonographPage | null> {
    return this.apollo.query({
      query: monographsByFilterQuery,
      variables: {
        filter: monographFilter,
        offset: pageIndex * pageSize,
        limit: pageSize
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map((response: unknown) => {
        let monographs = (response as MonographsByFilterResponse).data?.monographsByFilter as MonographPage;
        if (typeof monographs !== 'undefined' && monographs !== null) {
          return monographs;
        }
        return null;
      })
    );
  }

  createMonograph(newMonograph: EditMonograph): Observable<Monograph | null> {
    return this.apollo.mutate({
      mutation: createMonographMutation,
      variables: {
        monographData: newMonograph
      }
    }).pipe(
      map((response: unknown) => {
        let monograph = (response as CreateMonographResponse).data?.createMonograph;
        if (typeof monograph !== 'undefined' && monograph !== null) {
          return monograph;
        }
        return null;
      })
    );
  }

  updateMonograph(id: string, updatedMonograph: EditMonograph): Observable<Monograph | null> {
    return this.apollo.mutate({
      mutation: updateMonographMutation,
      variables: {
        id: id,
        monographData: updatedMonograph
      }
    }).pipe(
      map((response: unknown) => {
        let monograph = (response as UpdateMonographResponse).data?.updateMonograph;
        if (typeof monograph !== 'undefined' && monograph !== null) {
          return monograph;
        }
        return null;
      })
    );
  }

  deleteMonograph(id: string): Observable<Monograph | null> {
    return this.apollo.mutate({
      mutation: deleteMonographMutation,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let monograph = (response as DeleteMonographResponse).data?.deleteMonograph;
        if (typeof monograph !== 'undefined' && monograph !== null) {
          return monograph;
        }
        return null;
      })
    );
  }

}

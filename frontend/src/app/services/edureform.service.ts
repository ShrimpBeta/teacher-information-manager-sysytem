import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map, Observable } from "rxjs";
import { CreateEduReformResponse, DeleteEduReformResponse, EditEduReform, EduReform, EduReformFilter, EduReformPage, EduReformResponse, EduReformsByFilterResponse, PreviewEduReform, UpdateEduReformResponse, UploadEduReformsResponse } from "../models/models/eduReform.model";
import { eduReformQuery, eduReformsByFilterQuery } from "../models/graphql/query/edureform.query.graphql";
import { createEduReformMutation, deleteEduReformMutation, updateEduReformMutation, uploadEduReformsMutation } from "../models/graphql/mutation/edureform.mutation.graphql";


@Injectable({
  providedIn: 'root'
})
export class EduReformService {

  constructor(
    private apollo: Apollo,
  ) { }

  getEduReform(id: string): Observable<EduReform | null> {
    return this.apollo.query({
      query: eduReformQuery,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let edureform = (response as EduReformResponse).data?.eduReform;
        if (typeof edureform !== 'undefined' && edureform !== null) {
          return edureform;
        }
        return null;
      })
    );
  }

  getEduReformsByFilter(eduReformFilter: EduReformFilter, pageIndex: number, pageSize: number): Observable<EduReformPage | null> {
    return this.apollo.query({
      query: eduReformsByFilterQuery,
      variables: {
        filter: eduReformFilter,
        offset: pageIndex * pageSize,
        limit: pageSize
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map((response: unknown) => {
        let edureforms = (response as EduReformsByFilterResponse).data?.eduReformsByFilter as EduReformPage;
        if (typeof edureforms !== 'undefined' && edureforms !== null) {
          return edureforms;
        }
        return null;
      })
    );
  }

  createEduReform(newEdureform: EditEduReform): Observable<EduReform | null> {
    return this.apollo.mutate({
      mutation: createEduReformMutation,
      variables: {
        eduReformData: newEdureform
      }
    }).pipe(
      map((response: unknown) => {
        let edureform = (response as CreateEduReformResponse).data?.createEduReform;
        if (typeof edureform !== 'undefined' && edureform !== null) {
          return edureform;
        }
        return null;
      })
    );
  }

  updateEduReform(id: string, edureform: EditEduReform): Observable<EduReform | null> {
    return this.apollo.mutate({
      mutation: updateEduReformMutation,
      variables: {
        id: id,
        eduReformData: edureform
      }
    }).pipe(
      map((response: unknown) => {
        let edureform = (response as UpdateEduReformResponse).data?.updateEduReform;
        if (typeof edureform !== 'undefined' && edureform !== null) {
          return edureform;
        }
        return null;
      })
    );
  }

  deleteEduReform(id: string): Observable<EduReform | null> {
    return this.apollo.mutate({
      mutation: deleteEduReformMutation,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let eduReform = (response as DeleteEduReformResponse).data?.deleteEduReform;
        if (typeof eduReform !== 'undefined' && eduReform !== null) {
          return eduReform;
        }
        return null;
      })
    );
  }

  uploadFile(file: File): Observable<PreviewEduReform[] | null> {
    return this.apollo.mutate({
      mutation: uploadEduReformsMutation,
      context: {
        useMultipart: true
      },
      variables: {
        file: file
      }
    }).pipe(
      map((response: unknown) => {
        let eduReforms = (response as UploadEduReformsResponse).data?.uploadEduReforms;
        if (typeof eduReforms !== 'undefined' && eduReforms !== null) {
          return eduReforms;
        }
        return null;
      })
    );
  }

}

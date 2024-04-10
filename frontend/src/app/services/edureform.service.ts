import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map, Observable } from "rxjs";
import { CreateEduReformResponse, DeleteEduReformResponse, EditEduReform, EduReform, EduReformFilter, EduReformResponse, EduReformsByFilterResponse, UpdateEduReformResponse } from "../models/models/eduReform.model";
import { eduReformQuery } from "../models/graphql/query/edureform.query.graphql";
import { createEduReformMutation } from "../models/graphql/mutation/edureform.mutation.graphql";


@Injectable({
  providedIn: 'root'
})
export class EduReformService {

  constructor(
    private apollo: Apollo,
  ) { }

  getEduReform(): Observable<EduReform | null> {
    return this.apollo.query({
      query: eduReformQuery,
      fetchPolicy: 'network-only'
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

  getEduReformsByFilter(eduReformFilter: EduReformFilter): Observable<EduReform[] | null> {
    return this.apollo.query({
      query: eduReformQuery,
      variables: {
        filter: eduReformFilter
      },
      fetchPolicy: 'network-only'
    }).pipe(
      map((response: unknown) => {
        let edureforms = (response as EduReformsByFilterResponse).data?.eduReformsByFilter;
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

  updateEduReform(edureform: EditEduReform): Observable<EduReform | null> {
    return this.apollo.mutate({
      mutation: createEduReformMutation,
      variables: {
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
      mutation: createEduReformMutation,
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

}

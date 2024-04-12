import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map, Observable } from "rxjs";
import { CreatePaperResponse, DeletePaperResponse, EditPaper, Paper, PaperFilter, PaperPage, PaperResponse, PapersByFilterResponse, UpdatePaperResponse } from "../models/models/paper.model";
import { paperQuery, papersByFilterQuery } from "../models/graphql/query/paper.query.graphql";
import { createPaperMutation, deletePaperMutation, updatePaperMutation } from "../models/graphql/mutation/paper.mutation.graphql";

@Injectable({
  providedIn: 'root'
})
export class PaperService {

  constructor(
    private apollo: Apollo,
  ) { }


  getPaper(id: string): Observable<Paper | null> {
    return this.apollo.query({
      query: paperQuery,
      variables: {
        id: id
      }
    })
      .pipe(
        map((response: unknown) => {
          let paper = (response as PaperResponse).data?.paper;
          if (typeof paper !== 'undefined' && paper !== null) {
            return paper;
          }
          return null;
        })
      );
  }

  getPapersByFilter(paperFilter: PaperFilter, pageIndex: number, pageSize: number): Observable<PaperPage | null> {
    return this.apollo.query({
      query: papersByFilterQuery,
      variables: {
        filter: paperFilter,
        offset: pageIndex * pageSize,
        limit: pageSize
      },
      fetchPolicy: 'network-only'
    })
      .pipe(
        map((response: unknown) => {
          let papers = (response as PapersByFilterResponse).data?.papersByFilter as PaperPage;
          if (typeof papers !== 'undefined' && papers !== null) {
            return papers;
          }
          return null;
        })
      );
  }

  createPaper(newPaper: EditPaper): Observable<Paper | null> {
    return this.apollo.mutate({
      mutation: createPaperMutation,
      variables: {
        paperData: newPaper
      }
    })
      .pipe(
        map((response: unknown) => {
          let paper = (response as CreatePaperResponse).data?.createPaper;
          if (typeof paper !== 'undefined' && paper !== null) {
            return paper;
          }
          return null;
        })
      );
  }

  updatePaper(id: string, updatedPaper: EditPaper): Observable<Paper | null> {
    return this.apollo.mutate({
      mutation: updatePaperMutation,
      variables: {
        id: id,
        paperData: updatedPaper
      }
    })
      .pipe(
        map((response: unknown) => {
          let paper = (response as UpdatePaperResponse).data?.updatePaper;
          if (typeof paper !== 'undefined' && paper !== null) {
            return paper;
          }
          return null;
        })
      );
  }


  deletePaper(id: string): Observable<boolean> {
    return this.apollo.mutate({
      mutation: deletePaperMutation,
      variables: {
        id: id
      }
    })
      .pipe(
        map((response: unknown) => {
          let paper = (response as DeletePaperResponse).data?.deletePaper;
          if (typeof paper !== 'undefined' && paper !== null) {
            return true;
          }
          return false;
        })
      );
  }
}

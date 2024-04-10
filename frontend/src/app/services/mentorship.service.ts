import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { CreateMentorshipResponse, DeleteMentorshipResponse, EditMentorship, Mentorship, MentorshipFilter, MentorshipResponse, MentorshipsByFilterResponse, UpdateMentorshipResponse } from "../models/models/mentorship.model";
import { Apollo } from "apollo-angular";
import { mentorshipQuery, mentorshipsByFilterQuery } from "../models/graphql/query/mentorship.query.graphql";
import { createMentorshipMutation, deleteMentorshipMutation, updateMentorshipMutation } from "../models/graphql/mutation/mentorship.mutation.graphql";

@Injectable({
  providedIn: 'root'
})
export class MentorshipService {

  constructor(
    private apollo: Apollo,
  ) { }

  getMentorship(id: string): Observable<Mentorship | null> {
    return this.apollo.query({
      query: mentorshipQuery,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let mentorship = (response as MentorshipResponse).data?.mentorship;
        if (typeof mentorship !== 'undefined' && mentorship !== null) {
          return mentorship;
        }
        return null;
      })
    );
  }

  getMentorshipsByFilter(mentorshipFilter: MentorshipFilter): Observable<Mentorship[] | null> {
    return this.apollo.query({
      query: mentorshipsByFilterQuery,
      variables: {
        filter: mentorshipFilter
      },
    }).pipe(
      map((response: unknown) => {
        let mentorships = (response as MentorshipsByFilterResponse).data?.mentorshipsByFilter;
        if (typeof mentorships !== 'undefined' && mentorships !== null) {
          return mentorships;
        }
        return null;
      })
    );
  }

  createMentorship(newMentorship: EditMentorship): Observable<Mentorship | null> {
    return this.apollo.mutate({
      mutation: createMentorshipMutation,
      variables: {
        mentorshipData: newMentorship
      }
    }).pipe(
      map((response: unknown) => {
        let mentorship = (response as CreateMentorshipResponse).data?.createMentorship;
        if (typeof mentorship !== 'undefined' && mentorship !== null) {
          return mentorship;
        }
        return null;
      })
    );
  }

  updateMentorship(id: string, updateMentorship: EditMentorship): Observable<Mentorship | null> {
    return this.apollo.mutate({
      mutation: updateMentorshipMutation,
      variables: {
        id: id,
        mentorshipData: updateMentorship
      }
    }).pipe(
      map((response: unknown) => {
        let mentorship = (response as UpdateMentorshipResponse).data?.updateMentorship;
        if (typeof mentorship !== 'undefined' && mentorship !== null) {
          return mentorship;
        }
        return null;
      })
    );
  }

  deleteMentorship(id: string): Observable<Mentorship | null> {
    return this.apollo.mutate({
      mutation: deleteMentorshipMutation,
      variables: {
        id: id
      }
    }).pipe(
      map((response: unknown) => {
        let mentorship = (response as DeleteMentorshipResponse).data?.deleteMentorship;
        if (typeof mentorship !== 'undefined' && mentorship !== null) {
          return mentorship;
        }
        return null;
      })
    );
  }
}

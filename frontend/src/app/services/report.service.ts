import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(
    private apollo: Apollo,
  ) { }

  getReport() {

  }
}

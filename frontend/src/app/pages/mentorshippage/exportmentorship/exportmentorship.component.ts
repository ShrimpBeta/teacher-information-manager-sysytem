import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/internal/Subject';
import { MentorshipService } from '../../../services/mentorship.service';
import { Mentorship, MentorshipFilter } from '../../../models/models/mentorship.model';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-exportmentorship',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatCheckboxModule],
  templateUrl: './exportmentorship.component.html',
  styleUrl: './exportmentorship.component.scss'
})
export class ExportmentorshipComponent implements OnInit, OnDestroy, AfterViewInit {
  private destory$ = new Subject<boolean>();

  mentorshipList: Mentorship[] = [];
  totalCount: number = 0;
  displayedColumns: string[] = ['select', 'projectName', 'studentNames', 'grade', 'createdAt', 'updatedAt'];

  dataSource!: MatTableDataSource<Mentorship>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Mentorship>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  exportSelectMentorship() {
    if (this.selection.selected.length == 0) {
      this.snackBar.open("请选择导出的数据", "关闭", {
        duration: 2000,
      });
      return;
    }

    let mentorshipExports: MentorshipExport[] = [];
    this.selection.selected.forEach(mentorship => {
      let mentorshipExport = new MentorshipExport();
      mentorshipExport.projectName = mentorship.projectName;
      mentorshipExport.studentNames = mentorship.studentNames.join(",");
      mentorshipExport.grade = mentorship.grade;
      mentorshipExport.guidanceDate = mentorship.guidanceDate;
      mentorshipExports.push(mentorshipExport);
    });

    let wb: XLSX.WorkBook = XLSX.utils.book_new();
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mentorshipExports);
    XLSX.utils.book_append_sheet(wb, ws, "导出数据");
    XLSX.writeFile(wb, "Mentorship.xlsx");
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private mentorshipService: MentorshipService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe(params => {
      this.mentorshipService.getMentorshipsByFilter(new MentorshipFilter(), 0, Number(params['count'])).
        pipe(takeUntil(this.destory$)).subscribe({
          next: (response) => {
            if (response) {
              this.mentorshipList = response.mentorships;
              this.totalCount = response.totalCount;
              this.dataSource = new MatTableDataSource(this.mentorshipList);
              this.dataSource.sort = this.sort;
            }
          },
          error: (error) => {
            this.snackBar.open("获取数据失败", "关闭", {
              duration: 2000,
            });
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
  }

  ngAfterViewInit(): void {
  }
}


export class MentorshipExport {
  projectName: string = ""
  studentNames: string = ""
  grade: string = ""
  guidanceDate?: Date
}

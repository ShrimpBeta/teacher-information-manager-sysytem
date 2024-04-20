import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import * as XLSX from 'xlsx';
import { Password, PasswordFilter, PasswordTrue } from '../../../models/models/password.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PasswordService } from '../../../services/password.service';

@Component({
  selector: 'app-exportpassword',
  standalone: true,
  imports: [MatTableModule, MatSortModule, DatePipe, MatButtonModule, MatCheckboxModule],
  templateUrl: './exportpassword.component.html',
  styleUrl: './exportpassword.component.scss'
})
export class ExportpasswordComponent implements OnInit, OnDestroy, AfterViewInit {
  private destory$ = new Subject<boolean>();

  passwordList: Password[] = []
  totalCount: number = 0;
  displayedColumns: string[] = ['select', 'url', 'appName', 'account', 'updatedAt', 'createdAt'];

  dataSource!: MatTableDataSource<Password>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Password>(true, []);

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

  exportSelectPassword() {
    if (this.selection.selected.length == 0) {
      this.snackBar.open('请选择要导出的密码', '关闭', {
        duration: 2000,
      });
      return;
    }

    let ids: string[] = this.selection.selected.map((password) => password.id);

    this.passwordService.getPasswordsTrue(ids)
      .pipe(takeUntil(this.destory$))
      .subscribe({
        next: (passwords) => {
          if (passwords) {
            let passwordExports: PasswordExport[] = passwords.map((password) => {
              let passwordExport = new PasswordExport();
              passwordExport.url = password.url;
              passwordExport.appName = password.appName;
              passwordExport.account = password.account;
              passwordExport.password = password.password;
              passwordExport.description = password.description;
              return passwordExport;
            });
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(passwordExports);
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
            XLSX.writeFile(wb, 'Password.xlsx');
          }
        },
        error: (error) => {
          console.error(error);
          this.snackBar.open('导出密码失败', '关闭', { duration: 2000 });
        }
      });

  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private passwordService: PasswordService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.destory$)).subscribe((params) => {
      this.passwordService.getPasswordsByFilter(new PasswordFilter(), 0, Number(params['count']))
        .pipe(takeUntil(this.destory$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.passwordList = response.passwords;
              this.totalCount = response.totalCount;
              this.dataSource = new MatTableDataSource(this.passwordList);
              this.dataSource.sort = this.sort;
            }
          },
          error: (error) => {
            console.error(error);
            this.snackBar.open('获取密数据失败', '关闭', { duration: 2000 });
          }
        });
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.destory$.next(true);
    this.destory$.complete();
  }
}


class PasswordExport {
  url: string = ""
  appName: string = ""
  account: string = ""
  password: string = ""
  description: string = ""
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password, PasswordFilter } from '../../../models/models/password.model';
import { Router, RouterLink } from '@angular/router';
import { PasswordService } from '../../../services/password.service';
import { Subject, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-overviewpassword',
  standalone: true,
  imports: [MatDividerModule, MatInputModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, MatButtonModule, ReactiveFormsModule, RouterLink, MatCardModule,
    DatePipe, MatTooltipModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatTableModule, MatSortModule, MatCheckboxModule],
  templateUrl: './overviewpassword.component.html',
  styleUrl: './overviewpassword.component.scss'
})
export class OverviewpasswordComponent implements OnInit, OnDestroy {

  SearchForm!: FormGroup;
  private destroy$ = new Subject<boolean>();
  // data
  passwordList: Password[] = [];
  // page
  totalCount: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [6, 10, 24, 50, 100];

  displayedColumns: string[] = ['select', 'action','url', 'appName', 'account', 'updatedAt', 'createdAt'];

  dataSource!: MatTableDataSource<Password>;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<Password>(true, []);

  isSearching: boolean = false;

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

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
      .pipe(takeUntil(this.destroy$))
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

  ngOnInit() {
    this.SearchForm = new FormGroup({
      keyword: new FormControl('')
    });

    this.getPasswordList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onSearch() {
    // reset page
    this.pageIndex = 0;
    // this.pageSize = 10;
    this.getPasswordList();
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.getPasswordList();
  }

  getPasswordList() {
    let passwordFilter = new PasswordFilter();
    if (this.SearchForm.get('keyword')?.value !== '') {
      passwordFilter.appName = this.SearchForm.get('keyword')?.value;
      passwordFilter.account = this.SearchForm.get('keyword')?.value;
      passwordFilter.url = this.SearchForm.get('keyword')?.value;
    }
    this.isSearching = true;
    this.passwordService.getPasswordsByFilter(passwordFilter, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (passwordsPage) => {
          if (passwordsPage) {
            this.passwordList = passwordsPage.passwords;
            this.totalCount = passwordsPage.totalCount;
            this.dataSource = new MatTableDataSource(this.passwordList);
            this.dataSource.sort = this.sort;
          } else {
            this.snackBar.open('获取数据失败', '关闭', {
              duration: 2000
            });
          }
          this.isSearching = false;
        },
        error: (error: unknown) => {
          console.error(error);
          this.snackBar.open('获取数据失败', '关闭', {
            duration: 2000
          });
          this.isSearching = false;
        }
      });
  }

  editPassword(password: Password) {
    this.router.navigate(['/main/password/edit', password.id]);
  }

  deletePassword(password: Password) {
    this.passwordService.deletePassword(password.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (passwords) => {
        if (passwords) {
          this.snackBar.open('删除密码成功', '关闭', {
            duration: 2000
          });
          if (this.passwordList.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.getPasswordList();
        } else {
          this.snackBar.open('删除密码失败', '关闭', {
            duration: 2000
          });
        }
      },
      error: (error: unknown) => {
        console.error(error);
        this.snackBar.open('删除密码失败', '关闭', {
          duration: 2000
        });
      }
    });
  }
}

class PasswordExport {
  url: string = ""
  appName: string = ""
  account: string = ""
  password: string = ""
  description: string = ""
}

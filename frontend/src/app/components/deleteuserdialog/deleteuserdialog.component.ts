import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-deleteuserdialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h1 mat-dialog-title>删除账户</h1>
    <div mat-dialog-content>你确定要删除账户吗？</div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close>取消</button>
      <button mat-button cdkFocusInitial mat-dialog-close="true">确定</button>
    </div>
  `,
})
export class DeleteuserdialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteuserdialogComponent>) { }
}

import { Component } from '@angular/core';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-deleteuserdialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>删除账户</h2>
    <div mat-dialog-content>
      <p>您确定要删除此账户吗？</p>
    </div>
    <div mat-dialog-actions style="display:flex;flex-direction:row; gap:20px; justify-content:center; margin-bottom:0.5rem;">
      <button mat-raised-button cdkFocusInitial color="primary" mat-dialog-close>取消</button>
      <button mat-raised-button color="warn" mat-dialog-close="true">确定</button>
    </div>
  `,
})
export class DeleteuserdialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteuserdialogComponent>) { }
}

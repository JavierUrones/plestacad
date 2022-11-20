import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss']
})
/**Define el componente modal para confirmar acciones */
export class ConfirmDialog implements OnInit {

  /**
   * Constructor
   * @param dialog dialogo modal
   * @param message mensaje a mostrar en el diálogo modal
   */
  constructor(
    public dialog: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
  /**  Define el comportamiento cuando se rechaza la acción. */
  close(): void {
    this.dialog.close(false);
  }
  /** Define el comportamiento cuando se confirma la acción. */
  confirm(): void {
    this.dialog.close(true);
  }

  ngOnInit() {
  }

}
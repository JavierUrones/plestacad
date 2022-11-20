import { Component } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
/**
 * Componente pricipal de la aplicación
 */
export class AppComponent {
  /** Titulo de la aplicación */
  title = 'plestacad-client';
  /**
   * Constructor
   * @param translate servicio de internacionalización
   */
  constructor(private translate: TranslateService,     private paginator: MatPaginatorIntl,
    ) {
    translate.setDefaultLang('es');
      this.paginator.firstPageLabel = 'Primera página';
      this.paginator.itemsPerPageLabel = "Elementos por página";
      this.paginator.lastPageLabel = "Última página";
      this.paginator.nextPageLabel = "Siguiente página";
      this.paginator.previousPageLabel = "Anterior página"
      this.paginator.getRangeLabel = this.getRangeLabel;
  }

    /** Determina el texto del paginador. */
    getRangeLabel(page: number, pageSize: number, length: number): string {
      if (length === 0) {
        return "Página 1 de 1";
      }
      const amountPages = Math.ceil(length / pageSize);
      return "Página " + page + 1 + " de " + amountPages;
    }
}

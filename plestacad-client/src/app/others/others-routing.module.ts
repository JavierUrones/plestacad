
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './contact/contact.component';
import { HelpComponent } from './help/help.component';
import { LegalInfoComponent } from './legal-info/legal-info.component';

/** Rutas del módulo others */
const routes: Routes = [
    {
        path: 'ayuda',
        component: HelpComponent,
        children: [

        ]
    },
    {
        path: 'aviso-legal', component: LegalInfoComponent
    },
    {
        path: 'contacto', component: ContactoComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OthersRoutingModule { }

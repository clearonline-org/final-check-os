import { Component, HostBinding } from '@angular/core';

@Component({
    moduleId: module.id,
      selector: 'app-module-footer',
    templateUrl: 'footer.component.html'
})

export class FooterComponent{
    test : Date = new Date();
}

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { startExternalStubPretender } from './stub-backend/stub-external-http.pretender';

if (environment.production) {
	enableProdMode();
}

if (environment.stubBackend) {
	startExternalStubPretender();
}

platformBrowserDynamic().bootstrapModule(AppModule);

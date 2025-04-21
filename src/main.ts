import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Importa la configuración
import { AppComponent } from './app/app.component'; // Importa el componente raíz

// Simplemente llama a bootstrapApplication con el componente y la configuración
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

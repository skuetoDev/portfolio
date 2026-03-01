import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly scriptUrl = environment.contactScriptUrl;

  // Google Apps Script no responde a preflight OPTIONS, por lo que usamos
  // mode: 'no-cors'. La petición llega y el email se envía, pero la respuesta
  // es opaca (no podemos leerla). Asumimos éxito si no hay error de red.
  async send(payload: ContactPayload): Promise<void> {
    await fetch(this.scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
}

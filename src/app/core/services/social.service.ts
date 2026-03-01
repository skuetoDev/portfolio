import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SocialNetwork } from '../models';

@Injectable({ providedIn: 'root' })
export class SocialService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  private readonly COLLECTION = 'social';

  // ── Obtener todas las redes ────────────────────────
  getNetworks(): Observable<SocialNetwork[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, this.COLLECTION);
      const q = query(ref, orderBy('order', 'asc'));
      return collectionData(q, { idField: 'id' }).pipe(
        map((docs) => docs.map((d) => this.mapNetwork(d))),
      );
    });
  }

  // ── Añadir red ─────────────────────────────────────
  addNetwork(network: Omit<SocialNetwork, 'id'>): Observable<any> {
    const ref = collection(this.firestore, this.COLLECTION);
    return from(addDoc(ref, network));
  }

  // ── Actualizar red ─────────────────────────────────
  updateNetwork(id: string, data: Partial<SocialNetwork>): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(updateDoc(docRef, { ...data }));
  }

  // ── Eliminar red ───────────────────────────────────
  deleteNetwork(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(deleteDoc(docRef));
  }

  // ── Toggle visibilidad ─────────────────────────────
  toggleVisibility(id: string, visible: boolean): Observable<void> {
    return this.updateNetwork(id, { visible });
  }

  private mapNetwork(data: any): SocialNetwork {
    return {
      id: data['id'],
      name: data['name'] || '',
      url: data['url'] || '',
      icon: data['icon'] || '',
      visible: data['visible'] ?? true,
      order: data['order'] || 0,
    };
  }
}

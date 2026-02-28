import { Injectable } from '@angular/core';
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
  Timestamp,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Work } from '../models';

@Injectable({ providedIn: 'root' })
export class WorksService {
  private readonly COLLECTION = 'works';

  constructor(
    private firestore: Firestore,
    private storage: Storage,
  ) {}

  // ── Obtener todos los trabajos ordenados ───────────
  getWorks(): Observable<Work[]> {
    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(ref, orderBy('order', 'asc'));

    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((d) => this.mapWork(d))),
    );
  }

  // ── Añadir trabajo ─────────────────────────────────
  addWork(work: Omit<Work, 'id'>): Observable<any> {
    const ref = collection(this.firestore, this.COLLECTION);
    return from(
      addDoc(ref, {
        ...work,
        createdAt: Timestamp.now(),
      }),
    );
  }

  // ── Actualizar trabajo ─────────────────────────────
  updateWork(id: string, data: Partial<Work>): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(updateDoc(docRef, { ...data }));
  }

  // ── Eliminar trabajo ───────────────────────────────
  deleteWork(id: string, mediaUrl?: string): Observable<void> {
    // Borra también el archivo de Storage si existe
    if (mediaUrl) {
      try {
        const storageRef = ref(this.storage, mediaUrl);
        deleteObject(storageRef).catch(() => {});
      } catch {}
    }
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(deleteDoc(docRef));
  }

  // ── Subir media (imagen o video) ───────────────────
  uploadMedia(
    file: File,
    workId: string,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const ext = file.name.split('.').pop();
      const path = `works/${workId}/${Date.now()}.${ext}`;
      const storageRef = ref(this.storage, path);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(Math.round(progress));
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        },
      );
    });
  }

  // ── Mapeador de Firestore a modelo ─────────────────
  private mapWork(data: any): Work {
    return {
      id: data['id'],
      title: data['title'] || '',
      description: data['description'] || '',
      descriptionI18n: data['descriptionI18n'] || {},
      mediaUrl: data['mediaUrl'] || '',
      mediaType: data['mediaType'] || 'image',
      technologies: data['technologies'] || [],
      order: data['order'] || 0,
      visible: data['visible'] ?? true,
      createdAt: data['createdAt']?.toDate?.() || new Date(),
    };
  }
}

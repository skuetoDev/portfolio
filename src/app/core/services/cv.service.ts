import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
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
import { CvProfile, Experience } from '../models';

@Injectable({ providedIn: 'root' })
export class CvService {
  // Documento único con ID fijo "profile"
  private readonly DOC_PATH = 'cv/profile';

  constructor(
    private firestore: Firestore,
    private storage: Storage,
  ) {}

  // ── Obtener perfil CV ──────────────────────────────
  getProfile(): Observable<CvProfile> {
    const docRef = doc(this.firestore, this.DOC_PATH);

    return docData(docRef).pipe(map((data: any) => this.mapProfile(data)));
  }

  // ── Actualizar experiencias ────────────────────────
  updateExperiences(experiences: Experience[]): Observable<void> {
    const docRef = doc(this.firestore, this.DOC_PATH);
    return from(
      updateDoc(docRef, {
        experiences,
        lastUpdated: Timestamp.now(),
      }),
    );
  }

  // ── Subir PDF del CV ───────────────────────────────
  uploadCvPdf(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const path = `cv/curriculum_${Date.now()}.pdf`;
      const storageRef = ref(this.storage, path);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        (snapshot) => {
          const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(Math.round(pct));
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          // Guarda la URL en Firestore
          const docRef = doc(this.firestore, this.DOC_PATH);
          await setDoc(
            docRef,
            {
              cvFileUrl: url,
              lastUpdated: Timestamp.now(),
            },
            { merge: true },
          );
          resolve(url);
        },
      );
    });
  }

  // ── Eliminar PDF anterior de Storage ──────────────
  deletePdf(url: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, url);
      return deleteObject(storageRef);
    } catch {
      return Promise.resolve();
    }
  }

  private mapProfile(data: any): CvProfile {
    return {
      cvFileUrl: data?.['cvFileUrl'] || '',
      lastUpdated: data?.['lastUpdated']?.toDate?.() || new Date(),
      experiences: (data?.['experiences'] || []).map((e: any) => ({
        company: e.company || '',
        role: e.role || '',
        roleI18n: e.roleI18n || {},
        startDate: e.startDate?.toDate?.() || new Date(),
        endDate: e.endDate?.toDate?.() || null,
        current: e.current ?? false,
        descriptionI18n: e.descriptionI18n || {},
        technologies: e.technologies || [],
      })),
    };
  }
}

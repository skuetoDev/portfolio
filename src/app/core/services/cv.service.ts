import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  doc,
  docData,
  setDoc,
  updateDoc,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CvProfile, Experience } from '../models';

@Injectable({ providedIn: 'root' })
export class CvService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  private readonly DOC_PATH = 'cv/profile';

  getProfile(): Observable<CvProfile> {
    return runInInjectionContext(this.injector, () => {
      const docRef = doc(this.firestore, this.DOC_PATH);
      return docData(docRef).pipe(map((data: any) => this.mapProfile(data)));
    });
  }

  updateExperiences(experiences: Experience[]): Observable<void> {
    const docRef = doc(this.firestore, this.DOC_PATH);
    return from(
      updateDoc(docRef, {
        experiences,
        lastUpdated: Timestamp.now(),
      }),
    );
  }

  // ── El CV PDF está en el repo: public/assets/cv/curriculum.pdf ──
  // Esta función solo actualiza la URL en Firestore
  updateCvUrl(url: string): Observable<void> {
    const docRef = doc(this.firestore, this.DOC_PATH);
    return from(
      setDoc(
        docRef,
        {
          cvFileUrl: url,
          lastUpdated: Timestamp.now(),
        },
        { merge: true },
      ),
    );
  }

  private mapProfile(data: any): CvProfile {
    return {
      cvFileUrl: data?.['cvFileUrl'] || './assets/cv/marioCV.pdf',
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

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
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Work } from '../models';

@Injectable({ providedIn: 'root' })
export class WorksService {
  private readonly COLLECTION = 'works';

  constructor(private firestore: Firestore) {}

  getWorks(): Observable<Work[]> {
    const ref = collection(this.firestore, this.COLLECTION);
    const q = query(ref, orderBy('order', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map((docs) => docs.map((d) => this.mapWork(d))),
    );
  }

  addWork(work: Omit<Work, 'id'>): Observable<any> {
    const ref = collection(this.firestore, this.COLLECTION);
    return from(
      addDoc(ref, {
        ...work,
        createdAt: Timestamp.now(),
      }),
    );
  }

  updateWork(id: string, data: Partial<Work>): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(updateDoc(docRef, { ...data }));
  }

  deleteWork(id: string): Observable<void> {
    const docRef = doc(this.firestore, this.COLLECTION, id);
    return from(deleteDoc(docRef));
  }

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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { createGuide } from 'src/app/interfaces/create-guide.interface';
import { Guide, Place, Section } from 'src/app/interfaces/guide.interface';

@Injectable({
  providedIn: 'root',
})
export class GuideService {
  private baseUrl = environment.API_URL + '/api/guide';
  constructor(private http: HttpClient) {}

  createGuide(data: createGuide) {
    return this.http.post<{ guide: Guide; message: string }>(
      `${this.baseUrl}/create`,
      data,
    );
  }

  getEditGuideDetails(guideId: string) {
    return this.http.get<{ guide: Guide; message: string }>(
      `${this.baseUrl}/${guideId}/editGuide`,
    );
  }

  deleteGuide(guideId: string) {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${guideId}`);
  }

  changeCoverphoto(guideId: string, body: { coverPhoto: string }) {
    return this.http.patch<{ coverPhoto: string; message: string }>(
      `${this.baseUrl}/${guideId}/coverPhoto`,
      body,
    );
  }

  changeName(guideId: string, body: { guideName: string }) {
    return this.http.patch<{ guideName: string; message: string }>(
      `${this.baseUrl}/${guideId}/name`,
      body,
    );
  }

  updateGeneralTips(guideId: string, body: { generalTips: string }) {
    return this.http.patch<{ generalTips: string; message: string }>(
      `${this.baseUrl}/${guideId}/generalTips`,
      body,
    );
  }

  updateWritersRelation(guideId: string, body: { writersRelation: string }) {
    return this.http.patch<{ writersRelation: string; message: string }>(
      `${this.baseUrl}/${guideId}/writersRelation`,
      body,
    );
  }

  addSection(guideId: string) {
    return this.http.post<{ section: Section; message: string }>(
      `${this.baseUrl}/${guideId}/section`,
      {},
    );
  }

  deleteSection(guideId: string, sectionId: string) {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${guideId}/section/${sectionId}`,
    );
  }

  updateSectionNote(
    guideId: string,
    sectionId: string,
    body: { note: string },
  ) {
    return this.http.patch<{ message: string; note: string }>(
      `${this.baseUrl}/${guideId}/section/${sectionId}/note`,
      body,
    );
  }
  updateSectionName(
    guideId: string,
    sectionId: string,
    body: { name: string },
  ) {
    return this.http.patch<{ message: string; name: string }>(
      `${this.baseUrl}/${guideId}/section/${sectionId}/name`,
      body,
    );
  }

  addPlaceToSection(
    guideId: string,
    sectionId: string,
    body: { place: Place },
  ) {
    return this.http.post<{ message: string; place: Place }>(
      `${this.baseUrl}/${guideId}/section/${sectionId}/place`,
      body,
    );
  }

  updateSectionPlaceDescription(
    guideId: string,
    sectionId: string,
    placeId: string,
    body: { description: string },
  ) {
    return this.http.patch<{ message: string; place: Place }>(
      `${this.baseUrl}/${guideId}/section/${sectionId}/place/${placeId}/description`,
      body,
    );
  }

  updateSectionPlaceImage(
    guideId: string,
    sectionId: string,
    placeId: string,
    body: { image: string },
  ) {
    return this.http.patch<{ message: string; place: Place }>(
      `${this.baseUrl}/${guideId}/section/${sectionId}/place/${placeId}/image`,
      body,
    );
  }

  deleteSectionPlace(guideId: string, sectionId: string, placeId: string) {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${guideId}/section/${sectionId}/place/${placeId}`,
    );
  }
}

import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Guide, Place, Section } from 'src/app/interfaces/guide.interface';
import { MapboxPlaceFeature } from 'src/app/interfaces/mapbox-interface';
import { GuideService } from 'src/app/services/guide/guide.service';
import { MapboxService } from 'src/app/services/mapbox/mapbox.service';
import * as guideEditActions from '../../../../store/editingGuide/guide-edit.actions';

@Component({
  selector: 'app-guide-section',
  templateUrl: './guide-section.component.html',
  styleUrls: ['./guide-section.component.scss'],
})
export class GuideSectionComponent implements OnInit, OnDestroy {
  @Input() guide: Guide | undefined;
  @Input() section: Section | undefined;
  @Input() sectionI: number | undefined;
  @Output() accordionClicked: EventEmitter<any> = new EventEmitter<any>();

  private ngUnsubscribe$ = new Subject<void>();
  places: Array<MapboxPlaceFeature> = [];
  inputControl = new FormControl();
  showResults = false;
  addPlaceLoading = false;
  deleteSectionLoading = false;
  sectionNoteSaving = false;
  changeTitleForm: FormGroup;
  changeTitleErrMessage = '';
  changeTitleLoading = false;
  nameChangingSection!: Section;
  placeDescriptionSaving = {
    value: false,
    index: 0,
  };
  placeImageLoading = {
    value: false,
    index: 0,
  };
  deletePlaceLoading = {
    value: false,
    index: 0,
  };

  constructor(
    private mapboxService: MapboxService,
    private store: Store,
    private guideService: GuideService,
    fb: FormBuilder,
  ) {
    this.changeTitleForm = fb.group({
      name: [''],
    });
  }

  ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((location: string) => {
          return this.mapboxService.getLocationData(location);
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((response) => {
        this.places = response.features;
      });
  }

  onFocus() {
    this.showResults = true;
  }
  blurResults() {
    setTimeout(() => {
      this.inputControl.setValue('');
      this.showResults = false;
    }, 200);
  }

  selectedPlaceIndex: number = -1;
  onKeyDown(event: KeyboardEvent, sectionId: string) {
    if (event.key === 'ArrowDown') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex + 1) % this.places.length;
    } else if (event.key === 'ArrowUp') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex - 1 + this.places.length) % this.places.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedPlaceIndex >= 0) {
        this.selectPlace(this.places[this.selectedPlaceIndex], sectionId);
        this.selectedPlaceIndex = -1;
      }
      (event.target as HTMLInputElement).blur();
    }
  }

  selectPlace(selectedPlace: MapboxPlaceFeature, sectionId: string) {
    this.inputControl.setValue('');
    const place = {
      name: selectedPlace.text,
      coordinates: selectedPlace.center,
      extendedName: selectedPlace.place_name,
    };
    this.addPlaceLoading = true;
    this.guideService
      .addPlaceToSection(this.guide?._id!, sectionId, { place: place })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            guideEditActions.addPlaceToSection({ sectionId, place: res.place }),
          );
          this.addPlaceLoading = false;
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.addPlaceLoading = false;
        },
      });
  }

  deleteSection(sectionId: string) {
    if (!this.deleteSectionLoading) {
      this.deleteSectionLoading = true;
      this.guideService
        .deleteSection(this.guide!._id!, sectionId)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: () => {
            this.deleteSectionLoading = false;
            this.store.dispatch(
              guideEditActions.deleteSection({ sectionId: sectionId }),
            );
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.deleteSectionLoading = false;
          },
        });
    }
  }

  updateSectionNote(sectionId: string, newValue: string) {
    if (newValue !== this.section!.note) {
      this.sectionNoteSaving = true;
      this.guideService
        .updateSectionNote(this.guide?._id!, sectionId, { note: newValue })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              guideEditActions.updateSectionNote({ sectionId, note: res.note }),
            );
            this.sectionNoteSaving = false;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.sectionNoteSaving = false;
          },
        });
    }
  }
  onPlaceClick(place: Place) {
    place = { ...place };
    this.accordionClicked.emit(place);
  }

  showChangeTitleModal() {
    const value = this.section?.name ?? '';
    this.changeTitleForm.patchValue({
      name: value,
    });
    this.changeTitleErrMessage = '';
    const changeTitleModal = document.getElementById(
      'changeTitleModal' + this.sectionI,
    ) as HTMLDialogElement;
    changeTitleModal.showModal();
  }
  closeChangeTitleModal() {
    this.changeTitleErrMessage = '';
    const changeTitleModal = document.getElementById(
      'changeTitleModal' + this.sectionI,
    ) as HTMLDialogElement;
    changeTitleModal.close();
  }
  submitChangeTitleForm() {
    const { name } = this.changeTitleForm.value;
    if (!this.changeTitleLoading && name != this.section?.name) {
      this.changeTitleLoading = true;
      this.guideService
        .updateSectionName(
          this.guide?._id!,
          this.section?._id!,
          this.changeTitleForm.value,
        )
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.changeTitleErrMessage = '';
            this.changeTitleLoading = false;
            this.store.dispatch(
              guideEditActions.updateSectionName({
                sectionId: this.section?._id!,
                name: res.name,
              }),
            );
            this.closeChangeTitleModal();
          },
          error: (errMessage) => {
            this.changeTitleErrMessage = errMessage;
            this.changeTitleLoading = false;
          },
        });
    } else {
      this.closeChangeTitleModal();
    }
  }

  updatePlaceDescription(
    newValue: string,
    placeIndex: number,
    placeId: string,
  ) {
    const oldValue = this.section?.places[placeIndex].description ?? '';
    if (newValue != oldValue) {
      this.placeDescriptionSaving = {
        value: true,
        index: placeIndex,
      };
      this.guideService
        .updateSectionPlaceDescription(
          this.guide?._id!,
          this.section?._id!,
          placeId,
          { description: newValue },
        )
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              guideEditActions.updatePlaceInSection({
                sectionId: this.section?._id!,
                placeId,
                updatedPlace: res.place,
              }),
            );

            this.placeDescriptionSaving = {
              value: false,
              index: placeIndex,
            };
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.placeDescriptionSaving = {
              value: false,
              index: placeIndex,
            };
          },
        });
    }
  }

  onFileSelected(event: any, placeIndex: number, placeId: string): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.changePlaceImage(base64String, placeIndex, placeId);
      };
      reader.readAsDataURL(file);
    }
  }

  changePlaceImage(
    base64String: string,
    placeIndex: number,
    placeId: string,
  ): void {
    this.placeImageLoading = { value: true, index: placeIndex };
    this.guideService
      .updateSectionPlaceImage(this.guide?._id!, this.section?._id!, placeId, {
        image: base64String,
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            guideEditActions.updatePlaceInSection({
              sectionId: this.section?._id!,
              placeId,
              updatedPlace: res.place,
            }),
          );
          this.placeImageLoading = { value: false, index: placeIndex };
        },
        error: (errMessage: string) => {
          this.placeImageLoading = { value: false, index: placeIndex };
        },
      });
  }

  deletePlace(placeIndex: number, placeId: string) {
    this.deletePlaceLoading = {
      value: true,
      index: placeIndex,
    };
    this.guideService
      .deleteSectionPlace(this.guide?._id!, this.section?._id!, placeId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            guideEditActions.deletePlaceInSection({
              sectionId: this.section?._id!,
              placeId,
            }),
          );
          this.deletePlaceLoading = {
            value: false,
            index: placeIndex,
          };
        },
        error: (errMessage: string) => {
          this.deletePlaceLoading = {
            value: false,
            index: placeIndex,
          };
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}

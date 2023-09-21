import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor(
    private mapboxService: MapboxService,
    private store: Store,
    private guideService: GuideService,
  ) {}

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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}

import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    Subject,
    debounceTime,
    distinctUntilChanged,
    switchMap,
    takeUntil,
} from 'rxjs';
import { MapboxPlaceFeature } from 'src/app/interfaces/mapbox-interface';
import { GuideService } from 'src/app/services/guide/guide.service';
import { MapboxService } from 'src/app/services/mapbox/mapbox.service';
import * as guideEditActions from '../../store/editingGuide/guide-edit.actions';

@Component({
  selector: 'app-create-guide',
  templateUrl: './create-guide.component.html',
  styleUrls: ['./create-guide.component.scss'],
})
export class CreateGuideComponent implements OnInit {
  createGuideForm!: FormGroup;
  inputControl = new FormControl();
  loading = false;
  showResults: boolean = false;
  showErrors: boolean = false;
  places: Array<MapboxPlaceFeature> = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private mapboxService: MapboxService,
    private guideService: GuideService,
    private router: Router,
    private store: Store,
  ) {
    this.createGuideForm = fb.group({
      place: ['', [Validators.required]],
    });
  }
  get fc() {
    return this.createGuideForm.controls;
  }
  ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((location: string) => {
          // Cancel previous request and start a new one
          return this.mapboxService.getLocationData(location);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((response) => {
        this.places = response.features;
      });
  }

  blurResults() {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }
  selectPlace(selectedPlace: any) {
    this.inputControl.setValue(selectedPlace.text);
    const place = {
      name: selectedPlace.text,
      coordinates: selectedPlace.center,
      extendedName: selectedPlace.place_name,
    };
    this.createGuideForm.patchValue({
      place: place,
    });
  }
  selectedPlaceIndex: number = 0;
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex + 1) % this.places.length;
    } else if (event.key === 'ArrowUp') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex - 1 + this.places.length) % this.places.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedPlaceIndex >= 0) {
        this.selectPlace(this.places[this.selectedPlaceIndex]);
        this.selectedPlaceIndex = 0;
      }
      (event.target as HTMLInputElement).blur();
    }
  }

  submitForm() {
    if (this.createGuideForm.invalid || this.loading) {
      this.showErrors = true;
      return;
    } else {
      this.loading = true;
      const formValues = this.createGuideForm.value;
      this.guideService.createGuide(formValues).subscribe({
        next: (response) => {
          const guide = response.guide;
          this.store.dispatch(
            guideEditActions.setEditingGuide({ guide: guide }),
          );
          this.loading = false;
          console.log(guide);
          this.router.navigate(['guide/edit', guide._id]);
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loading = false;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

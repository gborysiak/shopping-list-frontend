import {Component, OnInit, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Store} from "@ngrx/store";
import {ArchiveActions} from "../../store/archive/archive.actions";
import {selectAllPartArchive} from "../../store/archive/archive.selectors";
import {PartArchive} from "../../entities/PartArchive";
import {TableModule} from "primeng/table";

@Component({
    selector: 'app-archiv',
    templateUrl: './archiv.component.html',
    styleUrls: ['./archiv.component.scss'],
    standalone: false
})
export class ArchivComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  partsels!: PartArchive[];

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(ArchiveActions.loadArchive() );

    this.store.select(selectAllPartArchive).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(parts => this.partsels = [...parts]);
  }
}

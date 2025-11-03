import {Component, OnInit} from '@angular/core';
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
  partsels!: PartArchive[];

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(ArchiveActions.loadArchive() );

    this.store.select(selectAllPartArchive).subscribe(parts => this.partsels = [...parts]);
  }
}

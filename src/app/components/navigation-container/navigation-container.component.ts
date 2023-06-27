import { MatSnackBar } from '@angular/material/snack-bar';
import { MiscService } from './../../services/misc.service';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { getAuth } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { Component, HostBinding, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DatabaseConnectionService } from 'src/app/services/database-connection.service';

@Component({
  selector: 'app-navigation-container',
  templateUrl: './navigation-container.component.html',
  styleUrls: ['./navigation-container.component.scss']
})
export class NavigationContainerComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private breakpointObserver: BreakpointObserver, private miscService: MiscService, private databaseConnection: DatabaseConnectionService, private overlay: OverlayContainer) {
    this.theme = miscService.getThemeColor();
  }

  linkName?: string;

  editMode: boolean = false;

  theme!: string | null;
  // Code generated when material design schematic was generated
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  ngOnInit() {

    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        this.databaseConnection.fetchUserCollectionNames().then(docs => {
          docs.forEach(doc => {
            this.links.push({ name: doc, url: `/collections/${doc}` });
          });
        }
        );
      }
    }
    );
  }

  collectionNames: string[] = [];

  links: { name: string, url: string }[] = [];



  addLink() {
    // get name from input field
    if (this.linkName) {
      const linkUrl = `/collections/${this.linkName.toLowerCase()}`;
      this.links.push({ name: this.linkName, url: linkUrl });
      //create collection in database
      this.databaseConnection.createCollection(this.linkName.toLowerCase()).then(() => {
        this._snackBar.open("Folder Added sucessfully", "", {
          duration: 2000
        });
      });
      this.linkName = '';
    }
  }

  editLink(link: { name: string; url: string;} ) {
    this.editMode = true;
  }

  deleteLink(link: { name: string; url: string; }) {
    const index = this.links.indexOf(link);
    if (index >= 0) {
      // Remove the link from the array
      this.links.splice(index, 1);

      // Delete the collection from the database
      this.databaseConnection.dropCollection(link.name.toLowerCase()).then(() => {
        this._snackBar.open("Folder deleted successfully", "", {
          duration: 2000
        });
      });

      // Delete also the file in the Collection collections
      this.databaseConnection.deleteDocument(link.name.toLowerCase()).then(() => {
        this._snackBar.open("Folder deleted successfully", "", {
          duration: 2000
        });
      }
      );

    }
  }

  toggleTheme() {
    this.miscService.toggleThemeColor();
    this.theme = this.miscService.getThemeColor();
  }

}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor() { }

  getThemeColor() {
    return localStorage.getItem('theme');
  }

  toggleThemeColor() {
    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') == 'darkMode') {
        localStorage.setItem('theme', 'lightMode')
      }
      else {
        localStorage.setItem('theme', 'darkMode')
      }
    } else {
      localStorage.setItem('theme', 'darkMode')
    }
  }
}

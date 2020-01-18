import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.scss'],

})
export class SideComponent implements OnInit {
  policies: string[];
  timeStatus: boolean;
  isEditable: boolean;
  policyForm = new FormArray([
    new FormControl(''),
    new FormControl(''),
    new FormControl('')
  ]);

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string
  ) { }

  ngOnInit() {
    if (localStorage.getItem('policies')) {
      this.policies = localStorage.getItem('policies').split(',');
      this.policyForm.patchValue(this.policies);
    }

    this.checkTimeStatus();
  }

  checkTimeStatus() {
    const day = new Date().getDay();
    const today = formatDate(new Date(), 'yyyy-MM-dd', this.locale);

    this.http.get('https://holidays-jp.github.io/api/v1/date.json').subscribe(res => {
      let rules = [5, 11, 15, 20];
      let status: boolean;
      const hours = new Date().getHours();

      if (res[today] || day === 0 || day === 6) {
        rules = [8, 12, 14, 16];
      }

      rules.some(rule => {
        status = hours + 1 >= rule && hours - 1 <= rule;
        return status;
      });

      this.timeStatus = status;
    });
  }

  savePolicy() {
    this.policies = this.policyForm.value;
    localStorage.setItem('policies', this.policies.join(','));
    this.isEditable = false;
  }

}


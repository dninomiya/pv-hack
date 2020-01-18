import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {
  type = new FormControl('bullet');

  bulletForm = this.fb.group({
    title: ['', Validators.required],
    lines: ['', Validators.required],
    comment: ['', Validators.required]
  });

  assertionForm = this.fb.group({
    assertion: ['', Validators.required],
    example: ['', Validators.required],
    comment: ['', Validators.required]
  });

  quoteForm = new FormControl('');

  get preview(): string {
    let content: string;
    switch (this.type.value) {
      case 'bullet':
        const value = this.bulletForm.value;
        content = [
          value.title,
          value.lines && value.lines.split('\n').map(line => '・' + line).join('\n'),
          value.comment
        ].filter(text => !!text).join('\n\n');
        break;
      case 'assertion':
        content = Object.values(this.assertionForm.value).reduce(
          (prev, current) => prev + '\n\n' + current
        ) as string;
        break;
      case 'quote':
        content = this.quoteForm.value;
        break;
    }

    return content;
  }

  constructor(
    private fb: FormBuilder,
    private clipboardService: ClipboardService
  ) { }

  ngOnInit() {
  }

  copy() {
    this.clipboardService.copy(this.preview);
  }

}

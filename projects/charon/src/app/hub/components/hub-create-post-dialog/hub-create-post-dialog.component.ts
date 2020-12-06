import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostCategory, PostCreate, PublicProfile } from 'decentr-js';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';

export type HubCreatePostDialogPostAuthor = Pick<PublicProfile, 'avatar' | 'lastName' | 'firstName'>;

export type HubCreatePostDialogPost = Pick<PostCreate, 'title' | 'text' | 'category'>;

export interface HubCreatePostDialogResult {
  create: boolean;
  post: HubCreatePostDialogPost;
}

export interface HubCreatePostDialogData {
  author: HubCreatePostDialogPostAuthor;
  draft: HubCreatePostDialogPost;
}

let formId = 0;

@Component({
  selector: 'app-hub-create-post-dialog',
  templateUrl: './hub-create-post-dialog.component.html',
  styleUrls: ['./hub-create-post-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubCreatePostDialogComponent implements OnInit {
  public form: FormGroup<HubCreatePostDialogPost>;

  public author: HubCreatePostDialogPostAuthor;

  public formId = `hub-create-post-dialog-form-${formId++}`

  constructor(
    private dialogRef: MatDialogRef<HubCreatePostDialogComponent, HubCreatePostDialogResult>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: HubCreatePostDialogData,
  ) {
  }

  public ngOnInit(): void {
    this.author = this.data.author;

    this.form = this.createForm(this.data.draft);

    this.form.valueChanges.subscribe(console.log);
  }

  public close(): void {
    this.dialogRef.close({
      create: false,
      post: this.form.getRawValue(),
    });
  }

  public createPost(): void {
    this.dialogRef.close({
      create: true,
      post: this.form.getRawValue(),
    });
  }

  private createForm(initialValue?: HubCreatePostDialogPost): FormGroup<HubCreatePostDialogPost> {
    return this.formBuilder.group({
      title: [
        initialValue && initialValue.title,
        Validators.required,
      ],
      text: [
        initialValue && initialValue.text,
        Validators.required,
      ],
      category: [
        initialValue && initialValue.category || PostCategory.WorldNews,
        Validators.required,
      ],
    });
  }
}

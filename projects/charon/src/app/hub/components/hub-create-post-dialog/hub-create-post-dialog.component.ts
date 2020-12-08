import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostCategory, PostCreate, PublicProfile } from 'decentr-js';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';

export type HubCreatePostDialogPostAuthor = Pick<PublicProfile, 'avatar' | 'lastName' | 'firstName'>;

export type HubCreatePostDialogPost = Omit<PostCreate, 'previewImage'>;

export interface HubCreatePostDialogResult {
  create: boolean;
  post: PostCreate;
}

export interface HubCreatePostDialogData {
  author: HubCreatePostDialogPostAuthor;
  draft: PostCreate;
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
  }

  public cancel(): void {
    this.close(true);
  }

  public createPost(): void {
    this.close(false);
  }

  private close(byCancel: boolean): void {
    const formValue = this.form.getRawValue();

    this.dialogRef.close({
      create: !byCancel,
      post: {
        ...formValue,
        previewImage: this.extractPreviewImage(formValue.text),
      },
    });
  }

  private createForm(initialValue?: HubCreatePostDialogPost): FormGroup<HubCreatePostDialogPost> {
    return this.formBuilder.group({
      title: [
        initialValue && initialValue.title || '',
        Validators.required,
      ],
      text: [
        initialValue && initialValue.text || '',
        Validators.required,
      ],
      category: [
        initialValue && initialValue.category || PostCategory.WorldNews,
        Validators.required,
      ],
    });
  }

  private extractPreviewImage(html: string): string | undefined {
    const div = document.createElement('div');
    div.innerHTML = html;
    const firstImage = div.querySelector('img');

    if (firstImage) {
      return firstImage.src;
    }

    return '';
  }
}
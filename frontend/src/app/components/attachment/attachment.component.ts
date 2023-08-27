import { Component } from '@angular/core';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss'],
})
export class AttachmentComponent {
  uploadedContent: string | ArrayBuffer | null | undefined = null;
  isImage: boolean = false;
  pdfBlobUrl: string | null = null;

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedContent = e.target?.result;
        this.isImage = file.type.startsWith('image');
        const pdfBlob = new Blob([e.target?.result!], {
          type: 'application/pdf',
        });
        this.pdfBlobUrl = URL.createObjectURL(pdfBlob);
      };
      reader.readAsArrayBuffer(file);
    }
  }
}

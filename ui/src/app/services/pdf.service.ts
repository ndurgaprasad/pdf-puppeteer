import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:5001/api';

  downloadPdf(links?: string[]): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/generate-pdf`,
      { links },
      { responseType: 'blob' }
    );
  }
}

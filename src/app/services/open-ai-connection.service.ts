import { environment } from './../../environments/environment.development';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OpenAiConnectionService {


  private transcriptionApiUrl = 'https://api.openai.com/v1/audio/transcriptions';
  private titleGenerationApiUrl = 'https://api.openai.com/v1/chat/completions';


  constructor(private http: HttpClient) { }

  transcribeAudio(audioBlob: Blob) {

    // Creates the body for the request
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${environment.openAiApiKey}`);

    return this.http.post(this.transcriptionApiUrl, formData, { headers });
  }

  generateTranscriptionTitle(transcription: Blob ) {

    const body = {
      model: "gpt-3.5-turbo",
      // Inserts the prompt below TODO make the prompt slightly modifiable with mood, length, etc.
      messages: [{ "content": `Create a title out of the following text: ${transcription!.text}`, "role": "user" }],
    };

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${environment.openAiApiKey}`).set('Content-Type', 'application/json');

    return this.http.post(this.titleGenerationApiUrl, body, { headers });
  }
}

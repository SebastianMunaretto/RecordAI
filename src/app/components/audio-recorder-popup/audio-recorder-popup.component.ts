import { DatabaseConnectionService } from './../../services/database-connection.service';
import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { OpenAiConnectionService } from 'src/app/services/open-ai-connection.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-audio-recorder-popup',
  templateUrl: './audio-recorder-popup.component.html',
  styleUrls: ['./audio-recorder-popup.component.scss']
})
export class AudioRecorderPopupComponent   {

  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  loading: boolean = false;

  recording: boolean = false;

  paused: boolean = false;

  constructor(private openaiService: OpenAiConnectionService, private databaseService: DatabaseConnectionService, public dialogRef: MatDialogRef<AudioRecorderPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
 
 
  startTime: number =0;
  elapsedTime: number = 0;
  timerInterval: any;
  audioChunks: Blob[] = [];
  audioBlob: Blob = new Blob();
  audioUrl: string  = "";
  seasons: {id: number, url: string, duration: number}[] = [];
  showResumeButton: boolean = false;
  mediaRecorderCounter: number = 0;
  blobForFetch :Blob = new Blob();


  startRecording() {
    if (this.audioUrl) {
      // if there is an existing audio, start a new season
   
      this.audioChunks = [];
      this.audioBlob = new Blob();
      this.audioUrl = "";
      this.startTime = 0;
      this.elapsedTime = 0;
    }

    //if the button is pressed again, stop the recording
    if (this.recording) {
      this.stopRecording();
      return;
    }
    


    this.recording = true;
    this.startTime = Date.now();
    this.elapsedTime = 0;
  
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.start();
        this.mediaRecorderCounter++;
  
        this.mediaRecorder.addEventListener('dataavailable', event => {
          this.audioChunks.push(event.data);
        });
  
        this.mediaRecorder.addEventListener('stop', () => {
          this.audioBlob = new Blob(this.audioChunks);
          this.audioUrl = URL.createObjectURL(this.audioBlob);

          const duration = Math.round(this.elapsedTime / 1000);
          //if season is larger than 5 elements, remove the first one
          if (this.seasons.length > 1) {
            this.seasons.shift();
          }

          this.seasons.push({id: this.mediaRecorderCounter, url: this.audioUrl, duration: this.elapsedTime});
        });
      });

      this.showResumeButton = false;
  
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
    }, 10);
  }

  
  
  stopRecording() {
    this.mediaRecorder!.stop();
  
    clearInterval(this.timerInterval);
    this.recording = false;

    //empty the audio chunks array
    this.audioChunks = [];
  
    this.audioChunks.push(this.audioBlob);

    //only one season with the same id is allowed
    for (let i = 0; i < this.seasons.length; i++) {
      if (this.seasons[i].id === this.mediaRecorderCounter) {
        this.seasons.splice(i, 1);
      }
    }

  
    if (this.seasons.length > 1) {
      this.seasons.shift();
    }

    this.showResumeButton = true;

  }

  resumeRecording() {
    this.mediaRecorder!.start();
    this.showResumeButton = false;
    this.recording = true;
    this.startTime = Date.now() - this.elapsedTime;
    this.timerInterval = setInterval(() => {
      this.elapsedTime = Date.now() - this.startTime;
    }, 10);
    this.paused = false;
  }

  mergeAudio() {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
  }

  playSeason(url: string) {
    console.log(url);
  const audio = new Audio(url);
  audio.play();
}

  getFormattedTime() {
    const minutes = Math.floor(this.elapsedTime / 60000);
    const seconds = ((this.elapsedTime % 60000) / 1000).toFixed(2);
    return `${minutes}:${(+seconds < 10 ? '0' : '')}${seconds}`;
  }

  getFormattedDuration(duration: any) {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(2);
    return `${minutes}:${(+seconds < 10 ? '0' : '')}${seconds}`;
  }

  playRecording() {
    const audioElement = new Audio(this.audioUrl);
    audioElement.play();
  }

  async getBlobFromUrl(url: string) {
    let blob = await fetch(url).then(response => response.blob());
    return blob;
  }



  /*
   After audio was recorded services are called and data gets saved into database
  */
  async transcribeAudio(audioUrlForFetch: string) {
  
    try {

      this.blobForFetch = await this.getBlobFromUrl(audioUrlForFetch);

      //get the blob from the audio url


    
    
      this.loading = true;
      //Service call that work with openai api
      const transcription: any = await this.openaiService.transcribeAudio(this.blobForFetch).toPromise();
      const title: any = await this.openaiService.generateTranscriptionTitle(transcription).toPromise();
      await this.databaseService.saveAudioIntoDB(transcription!.text, title!.choices[0].message.content, this.blobForFetch, this.data.collectionName);
      this.loading = false;
      this.dialogRef.close();
    } catch (error) {
      console.log(error);
    }
  }
}



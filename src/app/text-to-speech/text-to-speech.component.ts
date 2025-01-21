import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { io } from 'socket.io-client';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-text-to-speech',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './text-to-speech.component.html',
  styleUrl: './text-to-speech.component.css'
})
export class TextToSpeechComponent {

  msg: string = '';
  response: string = '';
  audioSrc: string = '';
  drivers: any[] = [];
  success: boolean = false;

  socket: any
  constructor(private db : DatabaseService, private router: Router) {
    this.socket = io();
    this.socket.on('text-to-speech-success', (audioUrl: any) => {
      this.audioSrc = audioUrl;
      this.response = 'Audio generated successfully!';
      this.success = true;

    });


    // fail socket
    this.socket.on('text-to-speech-fail', (error: any) => {
      this.response = error
      this.success = false;

    });

  }

  sendTextToSpeech(text: string) {
    this.msg = text;
    this.socket.emit('text-to-speech', text);
  }

  ngOnInit() {
    this.db.getDriver().subscribe((data: any) => {
      console.log(data);
      this.drivers = data;
    });
  }




}

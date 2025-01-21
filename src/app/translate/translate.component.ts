import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { io } from 'socket.io-client';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-translate',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './translate.component.html',
  styleUrl: './translate.component.css'
})
export class TranslateComponent {

  text: string = '';
  language: string = '';


  languages = [{name: 'English', code: 'en'}, {name: 'Spanish', code: 'es'}, {name: 'French', code: 'fr'}, {name: 'German', code: 'de'}, {name: 'Italian', code: 'it'}, {name: 'Russian', code: 'ru'}, {name: 'Chinese', code: 'zh'}, {name: 'Japanese', code: 'ja'}, {name: 'Korean', code: 'ko'}, {name: 'Arabic', code: 'ar'}, {name: 'Hindi', code: 'hi'}, {name: 'Portuguese', code: 'pt'}, {name: 'Dutch', code: 'nl'}, {name: 'Greek', code: 'el'}, {name: 'Hebrew', code: 'he'}, {name: 'Indonesian', code: 'id'}, {name: 'Polish', code: 'pl'}, {name: 'Thai', code: 'th'}, {name: 'Turkish', code: 'tr'}, {name: 'Vietnamese', code: 'vi'}];
  socket: any;
  packages: any[] = [];


  logTranslatedTexts: any[] = [];

  constructor(private db : DatabaseService, private router: Router) {
    this.socket = io();

    this.socket.on('translate-success', (data: any) => {


      const newTranslation = {
        text: data.originalText,
        translation: data.translatedText,
        target: data.language
      }

      console.log(newTranslation);  
      
      this.logTranslatedTexts.push(newTranslation);
    });

    this.socket.on('translate-fail', (error: any) => {
      console.log(error);
      this.text = error;
    });
  }

  ngOnInit() {
    this.db.getPackage().subscribe((data: any) => {
      console.log(data);
      this.packages = data;
    })
  };



  
  translateText(text: string) {
    console.log(text, "text");
    console.log(this.language);
    this.socket.emit('translate', {text: text, language: this.language});
  }

   
}

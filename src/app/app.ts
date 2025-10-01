import { Component, signal } from '@angular/core';
import { Navbar } from "./navbar/navbar";
import { Background } from "./background/background";
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [Navbar, Background, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ignite-boost-redesign';
  isIgnition = signal<boolean>(true);
}

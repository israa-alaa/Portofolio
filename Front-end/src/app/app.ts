import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { Navbar } from './components/navbar/navbar';
import { HomeComponent } from './components/home/home';
import { ProjectsComponent } from './components/projects/projects';
import { About } from './components/about/about';
import { Skills } from './components/skills/skills';
import { Connect } from './components/connect/connect';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar, HomeComponent, About, Skills, ProjectsComponent, Connect
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {}
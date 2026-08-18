import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Project {
  _id?: string;
  title?: string;
  description?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  image?: string;
  tags?: string[];
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.html',
  styleUrls: ['./projects.css']
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  private handler = () => this.loadProjects();

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProjects();
    window.addEventListener('projects-updated', this.handler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('projects-updated', this.handler);
  }

  loadProjects(): void {
    this.http.get<Project[]>('http://localhost:3000/api/projects').subscribe({
      next: (data) => {
        this.projects = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching projects:', err)
    });
  }
}

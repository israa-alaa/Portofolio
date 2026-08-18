import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Profile {
  name?: string;
  image?: string;
  jobTitle?: string;
  bio?: string;
  aboutParagraphs?: string[];
  contactEmail?: string;
  phone?: string;
  location?: string;
  cvUrl?: string;
}

export interface Project {
  _id?: string;
  title?: string;
  description?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  image?: string;
  tags?: string[];
  newTag?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api';

  profile: Profile = {
    name: '',
    jobTitle: '',
    bio: '',
    contactEmail: '',
    phone: '',
    location: '',
    cvUrl: '',
    image: ''
  };

  projects: Project[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadData();
  }

  private notifyProjects(): void {
    window.dispatchEvent(new Event('projects-updated'));
  }

  loadData(): void {
    this.http.get<Profile>(`${this.apiUrl}/profile`).subscribe({
      next: (data) => {
        if (data) this.profile = data;
      },
      error: (err) => console.error('Error fetching profile:', err)
    });

    this.http.get<Project[]>(`${this.apiUrl}/projects`).subscribe({
      next: (data) => {
        if (data) this.projects = data;
      },
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profile.image = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onProjectImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.projects[index].image = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  saveProfile(): void {
    this.http.put(`${this.apiUrl}/profile`, this.profile).subscribe({
      next: () => alert('Profile Updated Successfully!'),
      error: (err) => {
        console.error('Error saving profile:', err);
        alert('Failed to save profile changes.');
      }
    });
  }

  saveProject(index: number): void {
    const project = this.projects[index];
    const formData = new FormData();

    formData.append('title', project.title || '');
    formData.append('description', project.description || '');
    formData.append('liveDemoUrl', project.liveDemoUrl || '#');
    formData.append('githubUrl', project.githubUrl || '#');
    formData.append('tags', JSON.stringify(project.tags || []));

    if (project.image && project.image.startsWith('data:')) {
      const arr = project.image.split(',');
      const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      const blob = new Blob([u8arr], { type: mime });
      formData.append('image', blob, 'image');
    }

    if (project._id) {
      this.http.put(`${this.apiUrl}/projects/${project._id}`, formData).subscribe({
        next: () => {
          alert(`Project "${project.title}" Updated Successfully!`);
          this.notifyProjects();
        },
        error: (err) => {
          console.error('Error updating project:', err);
          alert('Failed to update project.');
        }
      });
    } else {
      this.http.post<Project>(`${this.apiUrl}/projects`, formData).subscribe({
        next: () => {
          alert(`Project "${project.title}" Added Successfully!`);
          this.loadData();
          this.notifyProjects();
        },
        error: (err) => {
          console.error('Error adding project:', err);
          alert('Failed to add project.');
        }
      });
    }
  }

  addProject(): void {
    this.projects.push({
      title: '',
      description: '',
      liveDemoUrl: '',
      githubUrl: '',
      image: '',
      tags: [],
      newTag: ''
    });
  }

  deleteProject(index: number): void {
    const project = this.projects[index];

    if (project._id) {
      if (!confirm(`Delete project "${project.title}"?`)) return;
      this.http.delete(`${this.apiUrl}/projects/${project._id}`).subscribe({
        next: () => {
          this.projects.splice(index, 1);
          this.notifyProjects();
          alert('Project Deleted Successfully!');
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          alert('Failed to delete project.');
        }
      });
    } else {
      this.projects.splice(index, 1);
    }
  }

  addTag(index: number): void {
    const project = this.projects[index];
    const tag = (project.newTag || '').trim();
    if (!tag) return;
    if (!project.tags) project.tags = [];
    project.tags.push(tag);
    project.newTag = '';
  }

  removeTag(projectIndex: number, tagIndex: number): void {
    this.projects[projectIndex].tags?.splice(tagIndex, 1);
  }
}

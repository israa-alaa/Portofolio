import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Profile {
  name?: string;
  jobTitle?: string;
  bio?: string;
  cvUrl?: string;
  image?: string;
  aboutParagraphs?: string[];
  contactEmail?: string;
  phone?: string;
  location?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  profile: Profile = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Profile>('http://localhost:3000/api/profile').subscribe({
      next: (data) => {
        if (data) this.profile = data;
      },
      error: (err) => console.error('Error fetching profile in Home:', err)
    });
  }
}
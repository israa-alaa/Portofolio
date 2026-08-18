import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Profile {
  contactEmail?: string;
  phone?: string;
  location?: string;
}

@Component({
  selector: 'app-connect',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './connect.html',
  styleUrls: ['./connect.css']
})  
export class Connect implements OnInit {
  profile: Profile = {};

  contactForm!: FormGroup;
  formStatus: string = '';
  isError: boolean = false;
  isSubmitting: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Profile>('http://localhost:3000/api/profile').subscribe({
      next: (data) => {
        if (data) this.profile = data;
      },
      error: (err) => console.error('Error fetching profile in Connect:', err)
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;
    this.formStatus = 'Sending...';

    this.http.post<any>('http://localhost:3000/api/contact', this.contactForm.value)
      .subscribe({
        next: (res) => {
          this.formStatus = 'Message sent successfully!';
          this.isError = false;
          this.contactForm.reset();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.formStatus = 'Failed to send message.';
          this.isError = true;
          this.isSubmitting = false;
        }
      });
  }
}
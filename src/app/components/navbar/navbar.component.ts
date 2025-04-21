import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importa Router
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ RouterModule, CommonModule, NgClass ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  // Ya no necesitamos searchVisible ni toggleSearch si navegamos

  // Inyecta Router
  constructor(private router: Router) { }

  ngOnInit(): void { this.onWindowScroll(); }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollOffset > 10;
  }

  // Método para navegar a la página de búsqueda
  goToSearch(): void {
    this.router.navigate(['/search']);
  }
}

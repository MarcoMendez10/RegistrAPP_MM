import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  fullName: string = '';
  rut: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  rutError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  registerUser() {
    // Validar el tamaño de la contraseña
    if (this.password.length > 6) {
      this.errorMessage = 'La contraseña debe tener un máximo de 6 caracteres.';
      return;
    }

    if (!this.validateRutFormat(this.rut)) {
      this.errorMessage = 'El RUT ingresado no es válido.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Llama al método register y pasa todos los datos necesarios
    this.authService.register(this.email, this.password, this.fullName, this.rut)
      .then(() => {
        // Navega a la página de inicio después del registro exitoso
        this.router.navigate(['/home']);
      })
      .catch(err => {
        this.errorMessage = 'Error al registrar usuario: ' + err.message;
      });
  }

  validateRut() {
    if (!this.validateRutFormat(this.rut)) {
      this.rutError = 'El RUT ingresado no es válido.';
    } else {
      this.rutError = ''; // Limpia el error si el RUT es válido
    }
  }

  validateRutFormat(rut: string): boolean {
    if (!/^\d{7,8}-[kK\d]$/.test(rut)) {
      return false;
    }
    const [body, dv] = rut.split('-');
    const calculatedDv = this.calculateDV(body);
    return calculatedDv === dv.toLowerCase();
  }

  calculateDV(rut: string): string {
    let sum = 0;
    let multiplier = 2;

    for (let i = rut.length - 1; i >= 0; i--) {
      sum += parseInt(rut[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const mod = 11 - (sum % 11);
    if (mod === 11) return '0';
    if (mod === 10) return 'k';
    return mod.toString();
  }
}

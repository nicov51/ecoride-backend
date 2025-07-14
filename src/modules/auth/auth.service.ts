import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Normalisation des inputs
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const normalizedPassword = loginDto.password.trim();

    // 2. Récupération de l'utilisateur
    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      console.log(`Login failed: user ${normalizedEmail} not found`);
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    // 3. Debug approfondi
    console.log('=== DEBUG LOGIN ===');
    console.log(
      `Email input: "${loginDto.email}" → Normalized: "${normalizedEmail}"`,
    );
    console.log(
      `Password input: "${loginDto.password}" → Normalized: "${normalizedPassword}"`,
    );
    console.log(`Hash in DB: ${user.password.substring(0, 15)}...`);

    // 4. Comparaison sécurisée
    const isMatch = await bcrypt.compare(normalizedPassword, user.password);
    console.log(`Password match: ${isMatch}`);

    if (!isMatch) {
      console.log(`Login failed for ${normalizedEmail}: invalid password`);
      throw new UnauthorizedException('Mot de passe incorrect');
    }

    // 5. Génération du token
    const payload = { id: user.id, email: normalizedEmail };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
  }
  // Méthode temporaire pour le AuthService
  async debugHashCompare() {
    const user = await this.usersService.findByEmail('jean.dupont@test.com');
    if (!user) return;

    console.log('Comparaison pour jean.dupont:');
    console.log('Hash en base:', user.password);
    console.log(
      'Compare Test1234!:',
      await bcrypt.compare('Test1234!', user.password),
    );
    console.log(
      'Compare test1234:',
      await bcrypt.compare('test1234', user.password),
    );
  }
}

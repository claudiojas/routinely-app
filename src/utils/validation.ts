// Funções de validação para formulários de autenticação

export interface ValidationError {
  field: string;
  message: string;
}

export interface SignupValidationData {
  name: string;
  email: string;
  password: string;
}

export interface LoginValidationData {
  email: string;
  password: string;
}

// Validação de email
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return 'Email é obrigatório';
  }
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  return null;
};

// Validação de senha
export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return 'Senha é obrigatória';
  }
  if (password.length < 4) {
    return 'Senha deve ter pelo menos 4 caracteres';
  }
  return null;
};

// Validação de nome
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Nome é obrigatório';
  }
  if (name.length > 20) {
    return 'Nome deve ter no máximo 20 caracteres';
  }
  return null;
};

// Validação completa do formulário de signup
export const validateSignup = (data: SignupValidationData): ValidationError[] => {
  const errors: ValidationError[] = [];

  const nameError = validateName(data.name);
  if (nameError) {
    errors.push({ field: 'name', message: nameError });
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  return errors;
};

// Validação completa do formulário de login
export const validateLogin = (data: LoginValidationData): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  return errors;
}; 
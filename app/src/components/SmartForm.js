import React, { useState, useEffect } from 'react';

// Hook para validação de formulários
export const useFormValidation = (initialState, validationRules) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validar campo individual
  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const { test, message } = rule;
      if (!test(value)) {
        return message;
      }
    }
    return '';
  };

  // Validar formulário completo
  const validateForm = (formValues) => {
    const newErrors = {};
    let formIsValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formValues[field]);
      if (error) {
        newErrors[field] = error;
        formIsValid = false;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  };

  // Atualizar valor do campo
  const handleChange = (name, value) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Marcar campo como tocado
  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Resetar formulário
  const resetForm = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
    setIsValid(false);
  };

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues
  };
};

// Componente de input com validação
export const SmartInput = ({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  mask,
  icon,
  required = false 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Aplicar máscara
  const applyMask = (value, maskPattern) => {
    if (!maskPattern) return value;
    
    let maskedValue = '';
    let valueIndex = 0;
    
    for (let i = 0; i < maskPattern.length && valueIndex < value.length; i++) {
      const maskChar = maskPattern[i];
      const valueChar = value[valueIndex];
      
      if (maskChar === '#') {
        if (/\d/.test(valueChar)) {
          maskedValue += valueChar;
          valueIndex++;
        }
      } else if (maskChar === 'A') {
        if (/[a-zA-Z]/.test(valueChar)) {
          maskedValue += valueChar;
          valueIndex++;
        }
      } else {
        maskedValue += maskChar;
        if (valueChar === maskChar) {
          valueIndex++;
        }
      }
    }
    
    return maskedValue;
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value;
    
    if (mask) {
      inputValue = applyMask(inputValue, mask);
    }
    
    onChange(name, inputValue);
  };

  const getInputClass = () => {
    let baseClass = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-gray-900 placeholder-gray-500';
    
    if (error && touched) {
      baseClass += ' border-red-300 focus:border-red-500 focus:ring-red-200';
    } else if (isFocused) {
      baseClass += ' border-blue-500 focus:border-blue-500 focus:ring-blue-200';
    } else {
      baseClass += ' border-gray-300 focus:border-blue-500 focus:ring-blue-200';
    }
    
    if (icon) {
      baseClass += ' pl-12';
    }
    
    return baseClass;
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          onBlur={(e) => {
            onBlur(name);
            setIsFocused(false);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={getInputClass()}
        />
      </div>
      
      {error && touched && (
        <div className="mt-1 flex items-center text-red-600 text-sm">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

// Componente de select inteligente
export const SmartSelect = ({ 
  name, 
  label, 
  options, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  placeholder = 'Selecione uma opção',
  required = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(name, option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 200);
            onBlur(name);
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-left ${
            error && touched
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
          }`}
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="p-2">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />
            </div>
            
            <div className="max-h-48 overflow-auto">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors duration-150 ${
                    option.value === value ? 'bg-red-50 text-red-700' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
              
              {filteredOptions.length === 0 && (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  Nenhuma opção encontrada
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {error && touched && (
        <div className="mt-1 flex items-center text-red-600 text-sm">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

// Componente de textarea inteligente
export const SmartTextarea = ({ 
  name, 
  label, 
  placeholder, 
  value, 
  onChange, 
  onBlur, 
  error, 
  touched, 
  rows = 4,
  required = false 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getTextareaClass = () => {
    let baseClass = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none text-gray-900 placeholder-gray-500';
    
    if (error && touched) {
      baseClass += ' border-red-300 focus:border-red-500 focus:ring-red-200';
    } else if (isFocused) {
      baseClass += ' border-blue-500 focus:border-blue-500 focus:ring-blue-200';
    } else {
      baseClass += ' border-gray-300 focus:border-blue-500 focus:ring-blue-200';
    }
    
    return baseClass;
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={(e) => {
          onBlur(name);
          setIsFocused(false);
        }}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        rows={rows}
        className={getTextareaClass()}
      />
      
      {error && touched && (
        <div className="mt-1 flex items-center text-red-600 text-sm">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

// Componente de checkbox inteligente
export const SmartCheckbox = ({ 
  name, 
  label, 
  checked, 
  onChange, 
  onBlur, 
  error, 
  touched 
}) => {
  return (
    <div className="mb-6">
      <label className="flex items-center">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(name, e.target.checked)}
          onBlur={() => onBlur(name)}
          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
        />
        <span className="ml-2 text-sm text-gray-700">{label}</span>
      </label>
      
      {error && touched && (
        <div className="mt-1 flex items-center text-red-600 text-sm">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

// Regras de validação comuns
export const validationRules = {
  // Validação de email
  email: [
    {
      test: (value) => value.length > 0,
      message: 'Email é obrigatório'
    },
    {
      test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Email inválido'
    }
  ],
  
  // Validação de CPF
  cpf: [
    {
      test: (value) => value.length > 0,
      message: 'CPF é obrigatório'
    },
    {
      test: (value) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value),
      message: 'CPF inválido'
    }
  ],
  
  // Validação de telefone
  phone: [
    {
      test: (value) => value.length > 0,
      message: 'Telefone é obrigatório'
    },
    {
      test: (value) => /^\(\d{2}\) \d{5}-\d{4}$/.test(value),
      message: 'Telefone inválido'
    }
  ],
  
  // Validação de nome
  name: [
    {
      test: (value) => value.length > 0,
      message: 'Nome é obrigatório'
    },
    {
      test: (value) => value.length >= 2,
      message: 'Nome deve ter pelo menos 2 caracteres'
    }
  ],
  
  // Validação de senha
  password: [
    {
      test: (value) => value.length > 0,
      message: 'Senha é obrigatória'
    },
    {
      test: (value) => value.length >= 6,
      message: 'Senha deve ter pelo menos 6 caracteres'
    }
  ]
};

// Máscaras comuns
export const masks = {
  cpf: '###.###.###-##',
  phone: '(##) #####-####',
  cep: '#####-###',
  date: '##/##/####',
  time: '##:##'
};

export default {
  useFormValidation,
  SmartInput,
  SmartSelect,
  SmartTextarea,
  SmartCheckbox,
  validationRules,
  masks
}; 
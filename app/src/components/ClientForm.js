import React from 'react';
import { 
  useFormValidation, 
  SmartInput, 
  SmartSelect, 
  SmartTextarea, 
  SmartCheckbox,
  validationRules, 
  masks 
} from './SmartForm';
import { useNotifications } from './NotificationSystem';

const ClientForm = () => {
  const { showSuccess, showError } = useNotifications();

  // Estado inicial do formulário
  const initialState = {
    name: '',
    email: '',
    cpf: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    notes: '',
    isActive: true,
    category: ''
  };

  // Regras de validação personalizadas
  const customValidationRules = {
    name: validationRules.name,
    email: validationRules.email,
    cpf: validationRules.cpf,
    phone: validationRules.phone,
    address: [
      {
        test: (value) => value.length > 0,
        message: 'Endereço é obrigatório'
      }
    ],
    city: [
      {
        test: (value) => value.length > 0,
        message: 'Cidade é obrigatória'
      }
    ],
    state: [
      {
        test: (value) => value.length > 0,
        message: 'Estado é obrigatório'
      }
    ]
  };

  // Hook de validação
  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    resetForm
  } = useFormValidation(initialState, customValidationRules);

  // Opções para o select de estado
  const stateOptions = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  // Opções para categoria
  const categoryOptions = [
    { value: 'vip', label: 'VIP' },
    { value: 'regular', label: 'Regular' },
    { value: 'premium', label: 'Premium' },
    { value: 'basic', label: 'Básico' }
  ];

  // Ícones SVG inline
  const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  // Função de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm(values)) {
      try {
        // Simular envio para API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        showSuccess('Cliente Cadastrado', 'Cliente foi cadastrado com sucesso!');
        resetForm();
      } catch (error) {
        showError('Erro ao Cadastrar', 'Não foi possível cadastrar o cliente');
      }
    } else {
      showError('Formulário Inválido', 'Por favor, corrija os erros no formulário');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cadastro de Cliente
          </h2>
          <p className="text-gray-600">
            Preencha os dados do cliente abaixo. Campos obrigatórios estão marcados com *
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Pessoais */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SmartInput
                name="name"
                label="Nome Completo"
                placeholder="Digite o nome completo"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.name}
                touched={touched.name}
                icon={<UserIcon />}
                required
              />
              
              <SmartInput
                name="email"
                label="Email"
                type="email"
                placeholder="Digite o email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                icon={<EmailIcon />}
                required
              />
              
              <SmartInput
                name="cpf"
                label="CPF"
                placeholder="000.000.000-00"
                value={values.cpf}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.cpf}
                touched={touched.cpf}
                mask={masks.cpf}
                required
              />
              
              <SmartInput
                name="phone"
                label="Telefone"
                placeholder="(00) 00000-0000"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.phone}
                touched={touched.phone}
                mask={masks.phone}
                icon={<PhoneIcon />}
                required
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Endereço
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <SmartInput
                  name="address"
                  label="Endereço Completo"
                  placeholder="Rua, número, bairro"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.address}
                  touched={touched.address}
                  icon={<LocationIcon />}
                  required
                />
              </div>
              
              <SmartInput
                name="city"
                label="Cidade"
                placeholder="Digite a cidade"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.city}
                touched={touched.city}
                required
              />
              
              <SmartSelect
                name="state"
                label="Estado"
                options={stateOptions}
                value={values.state}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.state}
                touched={touched.state}
                placeholder="Selecione o estado"
                required
              />
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Adicionais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SmartSelect
                name="category"
                label="Categoria"
                options={categoryOptions}
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.category}
                touched={touched.category}
                placeholder="Selecione a categoria"
              />
              
              <div className="flex items-center justify-center">
                <SmartCheckbox
                  name="isActive"
                  label="Cliente Ativo"
                  checked={values.isActive}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.isActive}
                  touched={touched.isActive}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <SmartTextarea
                name="notes"
                label="Observações"
                placeholder="Digite observações sobre o cliente..."
                value={values.notes}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.notes}
                touched={touched.notes}
                rows={4}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
            >
              Limpar
            </button>
            
            <button
              type="submit"
              disabled={!isValid}
              className={`px-6 py-3 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors duration-200 ${
                isValid
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Cadastrar Cliente
            </button>
          </div>
        </form>

        {/* Status do Formulário */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-3 ${isValid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm text-blue-800">
              {isValid ? 'Formulário válido - Pronto para enviar' : 'Formulário incompleto - Verifique os campos obrigatórios'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm; 
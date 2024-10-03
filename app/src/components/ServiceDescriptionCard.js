import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ServiceDescriptionCard = ({ procedimento }) => {
    // Função para formatar a duração em horas
    const formatarDuracao = (duracao) => {
        // Verifica se é um número e se não é NaN
        if (typeof duracao === 'number' && !isNaN(duracao)) {
            const horas = Math.floor(duracao); // Parte inteira das horas
            const minutos = duracao % 1 * 60; // Parte fracionária convertida em minutos
            return `${horas}h${minutos > 0 ? ` ${minutos}min` : ''}`;
        }
        return duracao; // Retorna o valor original se não for um número
    };

    // Função para formatar o valor como moeda brasileira (R$ 0,00)
    const formatarValor = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    {procedimento.name}
                </Typography>
                <Typography variant="body2" paragraph>
                    {procedimento.observation}
                </Typography>
                <Typography variant="body2">
                    Duração: {formatarDuracao(procedimento.duration)}
                </Typography>
                <Typography variant="body2">
                    Valor: {formatarValor(procedimento.value)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ServiceDescriptionCard;

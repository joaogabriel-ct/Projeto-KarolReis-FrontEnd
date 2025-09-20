import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, CircularProgress, Typography, Card, CardContent } from '@mui/material';
import { useRouter } from 'next/router';
import { apiService } from "@/utils/apiService";
import { Container } from '@/components/container';

export default function SelectServices() {
    const [procedures, setProcedures] = useState([]);
    const [selectedProcedures, setSelectedProcedures] = useState([]);
    const [selectedProcedureNames, setSelectedProcedureNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProcedures = async () => {
            setLoading(true);
            try {
                const response = await apiService.getProcedures();
                setProcedures(response);
            } catch (error) {
                console.error('Erro ao buscar procedimentos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProcedures();
    }, []);

    // Função para lidar com a seleção de procedimentos
    const handleProcedureChange = (procedure) => {
        const { id, name } = procedure;

        // Atualiza IDs dos procedimentos selecionados
        setSelectedProcedures((prev) =>
            prev.includes(id) ? prev.filter(procedureId => procedureId !== id) : [...prev, id]
        );

        // Atualiza nomes dos procedimentos selecionados
        setSelectedProcedureNames((prev) =>
            prev.includes(name) ? prev.filter(procedureName => procedureName !== name) : [...prev, name]
        );
    };

    const handleNext = () => {
        // Armazena os procedimentos selecionados (IDs e nomes) e navega para a próxima etapa
        router.push({
            pathname: '/agendamento',
            query: { 
                procedures: selectedProcedures.join(','),    // Passando os IDs dos procedimentos selecionados
                procedureNames: selectedProcedureNames.join(',')  // Passando os nomes dos procedimentos selecionados
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom align="center">
                Escolha seu procedimento
            </Typography>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">
                {procedures.map((procedure) => (
                    <Card key={procedure.id} style={{ margin: '10px', padding: '10px', width: '350px' }}>
                        <CardContent>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedProcedures.includes(procedure.id)}
                                        onChange={() => handleProcedureChange(procedure)}
                                    />
                                }
                                label={
                                    <div>
                                        <Typography variant="h6">{procedure.name}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Valor: R${procedure.value} | Duração: {procedure.duration} hora(s)
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {procedure.observation}
                                        </Typography>
                                    </div>
                                }
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center mt-4">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={selectedProcedures.length === 0}
                >
                    Próximo
                </Button>
            </div>
        </Container>
    );
}

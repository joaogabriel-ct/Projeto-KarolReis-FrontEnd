import * as React from 'react';
import { createTheme, 
    ThemeProvider, 
    AppBar, 
    Box,
    Button, 
    Card, 
    CardActions, 
    CardContent, 
    CardHeader, 
    CssBaseline, 
    Grid, 
    StarIcon, 
    Toolbar, 
    Typography, 
    Link, 
    GlobalStyles, 
    Container} from '@mui/material';


    const tiers = [
        {
          title: 'Sobrancelhas',
          price: '100',
          description: [
            'Sobrancelhas',
            'Você escolhe o seu jeito',
            ,
          ],
          buttonText: 'Agende seu horario',
          buttonVariant: 'outlined',
        },
        {
          title: 'Sobrancelha Plus',
          subheader: 'Mais Popular',
          price: '250',
          description: [
            'Você escolhe o seu jeito',
            'Toma café avontade'
          ],
          buttonText: 'Agende já seu horario',
          buttonVariant: 'contained',
        },
        {
          title: 'Cílios + sombrancelhas',
          price: '750',
          description: [
            'Sobrancelhas',
            'Você escolhe o seu jeito',
            'Toma café avontade',
            'Escolhe seu cílios'
          ],
          buttonText: 'Contate-nos',
          buttonVariant: 'outlined',
        },
      ];
  const defaultTheme = createTheme();

export default function Services(){

        return (
          <>
          <Typography>
            Destinado ao cadastro de serviços realizados, por pessoa e por todas. 
            </Typography>
          <Typography>
            Contador de serviçp realizado
          </Typography>
          </>
        );
}
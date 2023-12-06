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
          <ThemeProvider theme={defaultTheme}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />
            
            {/* Hero unit */}
            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Preços
              </Typography>
              <Typography variant="h5" align="center" color="text.secondary" component="p">
                Este é apenas um teste para te mostrar como está 
              </Typography>
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="main">
              <Grid container spacing={5} alignItems="flex-end">
                {tiers.map((tier) => (
                  // Enterprise card is full width at sm breakpoint
                  <Grid
                    item
                    key={tier.title}
                    xs={12}
                    sm={tier.title === 'Enterprise' ? 12 : 6}
                    md={4}
                  >
                    <Card>
                      <CardHeader
                        title={tier.title}
                        subheader={tier.subheader}
                        titleTypographyProps={{ align: 'center' }}
                        action={tier.title === 'Pro' ? <StarIcon /> : null}
                        subheaderTypographyProps={{
                          align: 'center',
                        }}
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                              ? theme.palette.grey[200]
                              : theme.palette.grey[700],
                        }}
                      />
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'baseline',
                            mb: 2,
                          }}
                        >
                          <Typography component="h2" variant="h3" color="text.primary">
                            ${tier.price}
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                            /mo
                          </Typography>
                        </Box>
                        <ul>
                          {tier.description.map((line) => (
                            <Typography
                              component="li"
                              variant="subtitle1"
                              align="center"
                              key={line}
                            >
                              {line}
                            </Typography>
                          ))}
                        </ul>
                      </CardContent>
                      <CardActions>
                        <Button fullWidth variant={tier.buttonVariant}>
                          {tier.buttonText}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
             {/* Footer */}
            {/* Container
              maxWidth="md"
              component="footer"
              sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                mt: 8,
                py: [3, 6],
              }}
            >
              <Grid container spacing={4} justifyContent="space-evenly">
                {footers.map((footer) => (
                  <Grid item xs={6} sm={3} key={footer.title}>
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      {footer.title}
                    </Typography>
                    <ul>
                      {footer.description.map((item) => (
                        <li key={item}>
                          <Link href="#" variant="subtitle1" color="text.secondary">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Grid>
                ))}
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Container> */}
            {/* End footer */}
          </ThemeProvider>
        );
}
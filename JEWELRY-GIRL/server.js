const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('bienvenida', { titulo: 'Bienvenida a Jewelry Girl 💎' });
});
app.get('/login', (req, res) => {
  res.render('login', { titulo: 'Iniciar Sesión - Jewelry Girl' });
});
app.get('/registro',(req,res)=> {
res.render('registro', { titulo: 'Crear Cuenta - Jewelry Girl' });
});

app.listen(9999, () => {
  console.log('Servidor iniciado en http://localhost:9999');
});

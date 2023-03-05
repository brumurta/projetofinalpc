// importar express

const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const mysql = require('mysql');
var port = 3000;

app.engine('handlebars', engine({defaultLayout : 'main'})); //Essa linha de código define como layout principal para todas as outras paginas
app.set('view engine', 'handlebars');
app.set('views', './views');

//ROTA RAIZ
app.get('/', (req, res) => {
    res.render('home');
});



// ESPECIFICAR ARQUIVOS ESTATICOS
app.use(express.static(__dirname + '/public'));

//ROTAS
app.get('/cadastropet', (req, res) => {
  res.render('cadastropet')
})

//express url
app.use(
  express.urlencoded({
    extended: true

  })
)
//rota para inserir dados
app.post('/controlepet/insertpet', (req, res) => {
  const nome_pet = req.body.nome_pet
  const nome_dono = req.body.nome_dono
  const raca = req.body.raca
  const idade =  req.body.idade
  const peso = req.body.peso

  const sql = `INSERT INTO pets (nome_pet, nome_dono, raca, idade, peso) VALUES ('${nome_pet}', '${nome_dono}', '${raca}', '${idade}', '${peso}' )`

  conn.query(sql, function (err) {
    if (err) {
      console.log(err)
    }

    res.redirect('/')
  })
})

//rota de consulta geral. Aqui irá listar todos os pets cadastrados
app.get('/exibirpet', (req, res) => {
  const sql = 'SELECT * FROM pets'

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }
  
      const listarPet = data
      
      console.log(listarPet)

      res.render('pet', { listarPet })

  })
})


// consulta um registo pelo id (produto.handlebars)
app.get('/controlepet/:id', (req, res) => {
  const id = req.params.id
  
  const sql = `SELECT * FROM pets WHERE id = ${id}`

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }

      const listarPet = data
      res.render('pet', {  layout: false, listarPet } )

  })
})



//rota do buscar
app.get('/buscapet', (req, res) => {
  res.render('buscapet', { layout: false })
})


//rota busc para exibir o resultado do buscar
app.post('/resultadopet/', (req, res) => {
  const nome_pet = req.body.nome_pet
  const sql = `SELECT * FROM pets WHERE nome_pet = '${nome_pet}'`

  conn.query(sql, function(err, data){
     if(err){
     console.log(err)
      return
    }
     const listarPet = data
     res.render('pet', {  layout: false, listarPet } )
     })
    })
  
    // rota para pegar dados para editar registro
app.get('/controlepet/editpet/:id', (req, res) => {
    
  const id = req.params.id

  const sql = `SELECT * FROM pets where id = ${id}`

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }

      const pet = data[0]
      res.render('editpet', { layout: false, pet } )

  })
})


//rota de edicao do registro com post
app.post('/controlepet/updatepet', (req, res) => {

  const id = req.body.id
  const nome_pet = req.body.nome_pet
  const nome_dono = req.body.nome_dono
  const raca = req.body.raca
  const idade =  req.body.idade
  const peso = req.body.peso 
  
  const sql = `UPDATE pets SET nome_pet = '${nome_pet}', nome_dono = '${nome_dono}', raca = '${raca}', idade = '${idade}', peso = '${peso}' WHERE id = '${id}'` 

  conn.query(sql, function(err) {
      if(err){
          console.log(err)
          return
      }

      res.redirect('/controlepet')
  })

})

//rota para deletar um registro
app.get('/controlepet/removepet/:id', (req, res) => {
  const id = req.params.id

  const sql = `DELETE FROM pets WHERE id = '${id}'`

  conn.query(sql, function(err){
      if(err){
          console.log(err)
          return
      }

      res.redirect('/controlepet')
  })
})




// conexao banco de dados
const conn = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'projfinal'

})


conn.connect(function (err) {
  if (err) {
    console.log(err)
  }

  console.log('Conectado com sucesso!')


})


//configurar o servidor

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`)
})
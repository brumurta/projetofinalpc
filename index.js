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
/////tratamento/////////

app.get('/cadastrotratamento', (req, res) => {
  res.render('cadastrotratamento')
})

//rota cliente//
app.get('/cadastrocliente', (req, res) => {
  res.render('cadastrocliente')
})

//rota vet//
app.get('/cadastrovet', (req, res) => {
  res.render('cadastrovet')
})

//express url
app.use(
  express.urlencoded({
    extended: true

  })
)
//////////////////ROTA INSERIR DADOS PET//////////////////////////
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

    res.redirect('/exibirpet')
  })
})

/////////////////INSERIR DADOS EM TRATAMENTO/////////////


app.post('/controletratamento/insert_tratamento', (req, res) => {
  const procedimento = req.body.procedimento
  const especie = req.body.especie
  const preco = req.body.preco
  

  const sql = `INSERT INTO tratamento (procedimento, especie, preco) VALUES ('${procedimento}', '${especie}', '${preco}')`

  conn.query(sql, function (err) {
    if (err) {
      console.log(err)
    }

    res.redirect('/exibirtratamento')
  })
})






//////////////////FIM////////////////

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
/////////////EXIBIR TRATAMENTO/////////////////////////


//rota de consulta geral. Aqui irá listar todos os TRATAMENTOS cadastrados
app.get('/exibirtratamento', (req, res) => {
  const sql = 'SELECT * FROM tratamento'

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }
  
      const listarTratamento = data
      
      console.log(listarTratamento)

      res.render('tratamento', { listarTratamento})

  })
})
/////////////FIM/////////////////////////

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

/////////////EXIBIR TRATAMENTO PELO ID/////////////////////////



app.get('/controletratamento/:id_tratamento', (req, res) => {
  const id_tratamento = req.params.id_tratamento
  
  const sql = `SELECT * FROM tratamento WHERE id_tratamento = ${id_tratamento}`

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }

      const listarTratamento = data
      res.render('tratamento', {  layout: false, listarTratamento } )

  })
})
////////////////////////FIM//////////////////////////////


//////////ROTA DO BUSCAR PET//////////////////////
app.get('/buscapet', (req, res) => {
  res.render('buscapet')
})

///////////////ROTA DO BUSCAR TRATAMENTO/////////////////
app.get('/buscatratamento', (req, res) => {
  res.render('buscatratamento')
})

/////////////////FIMM//////////////////////////

//////////RESULTADO PET/////////////////////////
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
     res.render('pet', { listarPet } )
     })
    })
  ///////////////////////FIM///////////////////////

//////////RESULTADO PET/////////////////////////

app.post('/resultadotratamento/', (req, res) => {
  const procedimento = req.body.procedimento
  const sql = `SELECT * FROM tratamento WHERE procedimento = '${procedimento}'`

  conn.query(sql, function(err, data){
     if(err){
     console.log(err)
      return
    }
     const listarTratamento = data
     res.render('tratamento', { listarTratamento } )
     })
    })
  ///////////////////////FIM///////////////////////








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

///CLIENTES///

//rota para inserir dados CLIENTES - funcionando
app.post('/controlecliente/insertcliente', (req, res) => {
  const nome_cliente = req.body.nome_cliente
  const nome_pet= req.body.nome_pet
  const cpf = req.body.cpf
  const telefone = req.body.telefone

  const sql = `INSERT INTO clientes (nome_cliente, nome_pet, cpf, telefone ) VALUES ('${nome_cliente}', '${nome_pet}', '${cpf}', '${telefone}')`

  conn.query(sql, function(err){
      if (err){
          console.log(err)
      }

      res.redirect('/exibircliente')
  })
})


//rota de consulta geral CLIENTES
app.get('/exibircliente', (req, res) => {
const sql = 'SELECT * FROM clientes'

conn.query(sql, function(err, data){
    if(err){
        console.log(err)
        return
    }

    const listarCliente = data
    
    console.log(listarCliente)

    res.render('cliente', {listarCliente})

})
})

// consulta um registo pelo cpf (produto.handlebars)
app.get('/controlecliente/:cpf', (req, res) => {
const cpf = req.params.cpf

const sql = `SELECT * FROM clientes WHERE cpf = ${cpf}`

conn.query(sql, function(err, data){
    if(err){
        console.log(err)
        return
    }

    const listarCliente = data
    res.render('cliente', { listarCliente } )

})
})

//rota do buscar CLIENTE
app.get('/buscacliente', (req, res) => {
res.render('buscacliente')
})

/////////////////ROTA RESULTADO CLIENTE//////////////////
//rota busc para exibir o resultado do buscar CLIENTE
app.post('/resultadocliente/', (req, res) => {
const nome_cliente = req.body.nome_cliente
const sql = `SELECT * FROM clientes WHERE nome_cliente = '${nome_cliente}'`

conn.query(sql, function(err, data){
   if(err){
   console.log(err)
    return
  }
   const listarCliente = data
   res.render('cliente',{listarCliente})         
   
   })
   
  })
  /////////////////FIM/////////////////////

// rota para pegar dados para editar registro CLIENTE
app.get('/controlecliente/editcliente:cpf', (req, res) => {
  
const cpf = req.params.cpf

const sql = `SELECT * FROM clientes where cpf = ${cpf}`

conn.query(sql, function(err, data){
    if(err){
        console.log(err)
        return
    }

    const cliente = data
    res.render('editcliente', { cliente } )

})
})


//rota de edicao do registro com post
app.post('/controlecliente/updatecliente', (req, res) => {

const nome_cliente = req.body.nome_cliente
const nome_pet = req.body.nome_pet
const cpf = req.body.cpf
const telefone = req.body.telefone

const sql = `UPDATE clientes SET nome_cliente = '${nome_cliente}', nome_pet = '${nome_pet}', telefone = '${telefone}' WHERE cpf = '${cpf}'` 

conn.query(sql, function(err) {
    if(err){
        console.log(err)
        return
    }

    res.redirect('/controlecliente')
})

})

//rota para deletar um registro
app.get('/controlecliente/removecliente/:cpf', (req, res) => {
const cpf = req.params.cpf

const sql = `DELETE FROM clientes WHERE cpf = '${cpf}'`

conn.query(sql, function(err){
    if(err){
        console.log(err)
        return
    }

    res.redirect('/controlecliente')
})
})




//rota para inserir dados PET
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
res.render('buscapet')
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
   res.render('pet', { listarPet } )
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

//rota para inserir dados
app.post('/controlevet/insertvet', (req, res) => {
  const nome = req.body.nome
  const crmv = req.body.crmv
  const telefone = req.body.telefone
  const email =  req.body.email
  

  const sql = `INSERT INTO veterinario (nome, crmv, telefone, email) VALUES ('${nome}', '${crmv}', '${telefone}', '${email}' )`

  conn.query(sql, function (err) {
    if (err) {
      console.log(err)
    }

    res.redirect('/exibirvet')
  })
})

//rota de consulta geral. Aqui irá listar todos os Veterinarios cadastrados
app.get('/exibirvet', (req, res) => {
  const sql = 'SELECT * FROM veterinario'

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }
  
      const listarVeterinario = data
      
      console.log(listarVeterinario)

      res.render('Veterinario', { listarVeterinario})

  })
})


// consulta um registo pelo id (vet.handlebars)
app.get('/controlevet/:crmv', (req, res) => {
  const crmv = req.params.crmv
  
  const sql = `SELECT * FROM veterinario WHERE crmv = ${crmv}`

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }

      const listarVeterinario = data
      res.render('veterinario', { listarVeterinario } )

  })
})



//rota do buscar
app.get('/buscavet', (req, res) => {
  res.render('buscavet')
})


//rota busc para exibir o resultado do buscar
app.post('/resultadovet', (req, res) => {
  const nome  = req.body.nome
  const sql = `SELECT * FROM veterinario WHERE nome = '${nome}'`

  conn.query(sql, function(err, data){
     if(err){
     console.log(err)
      return
    }
     const listarVeterinario = data
     res.render('veterinario', { listarVeterinario} )
     })
    })
  
    // rota para pegar dados para editar registro
app.get('/controlevet/editvet/:crmv', (req, res) => {
    
  const crmv= req.params.crmv

  const sql = `SELECT * FROM veterinario where crmv = ${crmv}`

  conn.query(sql, function(err, data){
      if(err){
          console.log(err)
          return
      }

      const veterinario = data
      res.render('editvet', { veterinario } )

  })
})


//rota de edicao do registro com post
app.post('/controlevet/updatevet', (req, res) => {

  const nome = req.body.nome
  const crmv = req.body.crmv
  const telefone = req.body.telefone
  const email =  req.body.email
  
  
  const sql = `UPDATE veterinario SET nome = '${nome}', telefone  = '${telefone}', email = '${email}', WHERE crmv = '${crmv}'` 

  conn.query(sql, function(err) {
      if(err){
          console.log(err)
          return
      }

      res.redirect('/controlevet')
  })

})

//rota para deletar um registro
app.get('/controlevet/removevet/: crmv', (req, res) => {
  const crmv = req.params.crmv

  const sql = `DELETE FROM veterinario WHERE crmv = '${crmv}'`

  conn.query(sql, function(err){
      if(err){
          console.log(err)
          return
      }

      res.redirect('/controlevet')
  })
})









// conexao banco de dados
const conn = mysql.createConnection({
  host: 'localhost',
  port: '3307',
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
import express from "express";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fs from "fs";
import path from 'path';
const app = express();
const porta = 3000;
const host = "0.0.0.0";
let listaUsuarios = [];
let listaMensagens = [];
app.use(session({
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, //utilizada com http e não somente com https
        httpOnly: true,
        maxAge: 1000 * 60 * 30 //30 minutos
    }
}));

//adicionando o middleware cookieParser
app.use(cookieParser());
// Middleware para processar dados de formulários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'pages/public')));
// Função para salvar mensagens no arquivo
function salvarMensagens() {
    fs.writeFileSync("mensagens.json", JSON.stringify(listaMensagens, null, 2));
}
// Função para carregar mensagens do arquivo
function carregarMensagens() {
    if (fs.existsSync("mensagens.json")) {
        listaMensagens = JSON.parse(fs.readFileSync("mensagens.json"));
    }
}
// Carregar mensagens ao iniciar o servidor
carregarMensagens();
//tentativa de bate papo 
function batepapoView(req,res){
    const optionsUsuarios = listaUsuarios
    .map(user => `<option value="${user.nomeUsuario}">${user.apelido}</option>`)
    .join('');
    res.send(`<!DOCTYPE html>  
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Chat Dinâmico</title>
    <link href="https://netdna.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            margin-top: 20px;
            background: #ebeef0;
        }
        .panel {
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.075);
            border-radius: 0;
            border: 0;
            margin-bottom: 24px;
        }
        .panel-heading {
            height: 50px;
            padding: 0;
            border-bottom: 1px solid #eee;
        }
        .panel-title {
            font-size: 1.416em;
            line-height: 50px;
            padding-left: 20px;
        }
        .nano {
            height: 380px;
            overflow-y: auto;
        }
        .message {
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 10px;
        }
        .message.user {
            background: #b7dcfe;
            color: #317787;
            text-align: left;
        }
        .message.response {
            background: #ffda87;
            color: #a07617;
            text-align: right;
        }
        .form-control {
            border-radius: 0;
            box-shadow: none;
            border: 1px solid #e9e9e9;
        }
        .btn {
            border-radius: 0;
            background-color: #579ddb;
            color: #fff;
        }
    </style>
    

</head>
<body>
<div class="container">
    <div class="col-md-12 col-lg-6">
        <div class="panel">
            <div class="panel-heading">
                <h3 class="panel-title">Chat Dinâmico</h3>
            </div>
            <div class="nano">
                <div id="chat-box" class="nano-content pad-all">
                    <!-- Mensagens serão inseridas aqui dinamicamente -->
                </div>
            </div>
            
            <div class="panel-footer">
                <form id="chat-form">
                    <div class="form-group">
                        <select id="username" class="form-control">
                            <option value="">Selecione um usuário</option>
                            ${optionsUsuarios}
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="text" id="message" class="form-control" placeholder="Digite sua mensagem">
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Enviar</button>
                </form>
            </div>
        </div>
    </div>
</div>

<script src="/script.js"></script>
</body>
</html>`
)

};

    


function cadastroUsuarioView(req, res) {
  res.send(`
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sistema Bate-papo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <h2>Cadastro de Usuarios </h2>
                <form method="POST" action="/cadUsers" id="contactForm" data-sb-form-api-token="API_TOKEN">
                    <div class="mb-3">
                        <label class="form-label" for="nomeUsuario">Nome do Usuário:</label>
                        <input class="form-control" name="nomeUsuario" id="nomeUsuario" type="text" placeholder="Nome do Usuário:"  />
                    </div>
                    <div class="mb-3">
                        <label class="form-label" for="apelido">Apelido:</label>
                        <input class="form-control" name="apelido" id="apelido" type="text" placeholder="Apelido:"  />
                    </div>

                    <div class="mb-3">
                        <label class="form-label" for="dataNascimento">Data de nascimento:</label>
                        <input class="form-control" name="dataNascimento" id="dataNascimento" type="text" placeholder="Data de nascimento:"  />
                    </div>
                    <div class="d-grid">
                        <button class="btn btn-primary btn-lg" id="submitButton" type="submit">Enviar</button>
                    </div>
                </form>
            </div>
        </body>
        </html>
    `);
}

//cadastrar usuario antigo cadastrar musica
function cadastroUsuario(req, res) {
  console.log(req.body); // Para depuração, verificar o conteúdo de req.body
  const nomeUsuario = req.body.nomeUsuario;
  const apelido = req.body.apelido;
  const dataNascimento = req.body.dataNascimento;

   //recuperar informações dos cookies enviado pelo navegador
   const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
   if (!dataHoraUltimoLogin){
       dataHoraUltimoLogin='';
   }
  //validar campos
  //caso os dados não estiverem válidos nós deveremos retornar um feedback para o usuário

  if (nomeUsuario && apelido && dataNascimento) {
    //dados válidos
    const NovosUsuarios = {
      nomeUsuario,
      apelido,
      dataNascimento,
    };
    listaUsuarios.push(NovosUsuarios);

    res.write(`
        <html>
            <head>
                <title>Lista de Usuários</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <meta charset="utf-8">
            </head>
            <body>
            <div class="container">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Nome do Usuário</th>
                        <th scope="col">Apelido</th>
                        <th scope="col">Data de nascimento</th>
                    </tr>
                </thead>
                <tbody>`);

    for (var i = 0; i < listaUsuarios.length; i++) {
      res.write(`<tr>
                                    <td>${listaUsuarios[i].nomeUsuario}</td>
                                    <td>${listaUsuarios[i].apelido}</td>
                                    <td>${listaUsuarios[i].dataNascimento}</td>
                                </tr>`);
    }

    res.write(`</tbody> 
            </table>
            <a class="btn btn-primary" href="/cadUsers">Continuar Cadastrando</a>
            <a class="btn btn-secondary" href="/menucad">Voltar para o Menu</a>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
    `);
  } //fim do if de validação
  else {
    //enviar o formulário contendo mensagem de validação
    res.write(` <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sistema Bate-papo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <h2>Cadastro de Usuário</h2>
                <form method="POST" action="/cadUsers" id="contactForm" data-sb-form-api-token="API_TOKEN">
                    <div class="mb-3">
                        <label class="form-label" for="nomeUsuario">Nome do Usuário:</label>
                        <input class="form-control" name="nomeUsuario" id="nomeUsuario" type="text" placeholder="Nome do Usuário:"  value="${nomeUsuario}" />
                    `); // linha 26 desse cód
    if (!nomeUsuario) {
      res.write(`
        <div class="alert alert-danger" role="alert">
             Por favor você deve informar o nome do Usuário
        </div> `);
    }
    res.write(`</div>
          <div class="mb-3">
            <label class="form-label" for="apelido">Apelido:</label>
            <input class="form-control" name="apelido" id="apelido" type="text" placeholder="Apelido:" value="${apelido}" />
        `);
    if (!apelido) {
      res.write(`
            <div class="alert alert-danger" role="alert">
                 Por favor você deve informar o Apelido 
            </div> `);
    }

   
    res.write(`</div>
                    <div class="mb-3">
                        <label class="form-label" for="dataNascimento">Data de nascimento:</label>
                        <input class="form-control" name="dataNascimento" id="dataNascimento" type="text" placeholder="Data de nascimento:" value="${
                          dataNascimento || ""
                        }" />`);
    if (!dataNascimento) {
      res.write(`
                <div class="alert alert-danger" role="alert">
                 Por favor, informe a data de nascimento.
                 </div>`);
    }
    res.write(` </div>
        <div class="d-grid">
            <button class="btn btn-primary btn-lg" id="submitButton" type="submit">Enviar</button>
        </div>
    </form>
</div>
  <div>
        <p><span>Seu último acesso foi realizado em ${dataHoraUltimoLogin}</span></p>
    </div>
</body>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html>`);
  }

  res.end();
}

function menuView(req, res) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }
  res.send(`
        <html>
            <head>
                <title>Sistema Bate-papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <nav class="navbar bg-body-tertiary">
                    <form class="container-fluid justify-content-start" onsubmit="event.preventDefault(); window.location.href='/cadUsers';">
                        <button class="btn btn-outline-success me-2" type="submit">Cadastrar Usuário</button>
                        
                        <a class="btn btn-outline-success me-2" href="/batepapo"type="submit">Ir ao Bate Papo</a>
                          <a class="btn btn-outline-success me-2"  href="/logout">Sair</a>
                                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                    </form>
                </nav>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
    `);
}
function autenticarUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha   = req.body.senha;

    if (usuario === 'admin' && senha === '123'){
        //criar uma sessão individualmente para cada usuário que faça o login
        req.session.usuarioLogado = true;
        //criar um cookie enviando para o navegador data e hora de acesso do usuário
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
        resp.redirect('/');
    }
    else{
        resp.send(`
                    <html>
                        <head>
                         <meta charset="utf-8">
                         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                               integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container w-25"> 
                                <div class="alert alert-danger" role="alert">
                                    Usuário ou senha inválidos!
                                </div>
                                <div>
                                    <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                                </div>
                            </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous">
                        </script>
                    </html>
                  `
        );
    }
}




function verificarAutenticacao(req, resp, next){
    if (req.session.usuarioLogado){
        next(); //permita acessar os recursos solicitados
    }
    else
    {
        resp.redirect('/login.html');
    }
}

app.get('/login',(req,res)=>{
    res.redirect('/login.html');
})
app.get('/logout', (req, resp) => {
    req.session.destroy(); //eliminar a sessão.
    resp.redirect('/login.html');
});
app.post('/login',autenticarUsuario)
app.get('/', verificarAutenticacao, menuView);
app.get("/menucad", menuView);

app.get("/batepapo",batepapoView);
// Rota para receber mensagens
app.post("/batepapo", (req, res) => {
    const { user, message } = req.body;
    if (user && message) {
        const hora = new Date().toLocaleTimeString(); // Adicionar hora da mensagem
        listaMensagens.push({ user, message, hora });
        salvarMensagens(); // Salvar mensagens no arquivo
        res.status(200).send("Mensagem enviada.");
    } else {
        res.status(400).send("Dados inválidos.");
    }
});

// Rota para fornecer mensagens existentes
app.get("/mensagens", (req, res) => {
    res.json(listaMensagens);
});
app.post("/cadUsers", cadastroUsuario);
app.get("/cadUsers", cadastroUsuarioView);
app.listen(porta, host, () => {
  console.log(
    `Servidor iniciado e em execução no endereço http://localhost:3000`
  );
});

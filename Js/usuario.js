//Fazer Tabela
let listaUser = [],
  listaModulo = [];
//pega o token do login
let meuToken = localStorage.getItem("token");
//organizar os modulos
let modulo = [],
  valorModulo = [];

//Fazer Usuário
let info = {
  "nome": "",
  "email": "",
  "login": "",
  "senha": ""
};

//captura valores do html e coloca no string para enviar
function changer() {
  let a = document.getElementById("nome");
  info.nome = a.value;
  let b = document.getElementById("email");
  info.email = b.value;
  let c = document.getElementById("login");
  info.login = c.value;
  let d = document.getElementById("senha");
  info.senha = d.value;
}

//tratamento de erros
function erros(value) {
  if (value == 400) {
    window.location.replace("./errors/400.html");
  } else if (value == 401) {
    window.location.replace("./errors/401.html");
  } else if (value == 403) {
    window.location.replace("./errors/403.html");
  } else if (value == 404) {
    window.location.replace("./errors/404.html");
  } else if (value == 409) {
    alert("Erro: Usuário já existente.");
  } else if (value == 412) {
    alert("Erro: Informação colocada é incorreta.");
  } else if (value == 422) {
    alert("Erro: Informação incorreta.");
  } else if (value == 500) {
    window.location.replace("./errors/500.html");
  } else if (value == 504) {
    window.location.replace("./errors/504.html");
  } else {
    alert("ERRO DESCONHECIDO");
  }
}


window.onload = function () {
  //função fetch para mandar
  fetch('http://localhost:8080/read/usuario', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //tratamento dos erros
    if (response.status == 200) {
      console.log(response.statusText);
    } else {
      erros(response.status);
    }
    //pegar o json que possui a tabela
    return response.json().then(function (json) {
      listaUser = json;

      let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th scope="col">Cód. Usuario</th>
          <th scope="col">Nome</th>
          <th scope="col">E-mail</th>
          <th scope="col">Login</th>
          <th scope="col">Status</th>
          <th scope="col">Opções</th>
          </tr>
          </thead>`);
      tabela += (`<tbody> <tr>`);

      for (let i = 0; i < json.length; i++) {
        tabela += (`<td>`);
        tabela += json[i]["cod_usuario"];
        tabela += (`</td> <td>`);
        tabela += json[i]["nome"]
        tabela += (`</td> <td>`);
        tabela += json[i]["email"]
        tabela += (`</td> <td>`);
        tabela += json[i]["login"]
        tabela += (`</td> <td>`);
        tabela += json[i]["status"]
        tabela += (`</td> <td> 
              <span class="d-flex">
              <button onclick="editarUsuario(` + i + `)" class="btn btn-success">
              <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
              </button>
              </span> </td>`);
        tabela += (`</tr> <tr>`);
      }

      tabela += (`</tr> </tbody>`);
      document.getElementById("tabela").innerHTML = tabela;
    });
  });



  //Fazer Tabela para Modulos

  //função fetch para mandar itens do modulo
  fetch('http://localhost:8080/read/modulo', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      console.log(response.statusText);
    } else {
      erros(response.status);
    }

    //pegar o json que possui a tabela
    return response.json().then(function (json) {
      //usado para listar os modulos usados na criação do usuario
      listaModulo = json;
      let tabelaMod = (`<thead style="background: #4b5366; color:white; font-size:15px">
              <tr>
              <th> <span class="custom-checkbox">
              <input type="checkbox" id="selectAll" >
              <label for="selectAll"></label>
              </span></th>
              <th scope="col">Cód. Módulo</th>
              <th scope="col">Módulo</th>
              <th scope="col">Sub. Módulo</th>
              <th scope="col">Ação</th>
              </tr>
              </thead>`);
      tabelaMod += (`<tbody> <tr>`);



      for (let i = 0; i < json.length; i++) {
        tabelaMod += (`<td>
              <span class="custom-checkbox">
              <input class="checking" onclick="modulos(` + i + `)" type="checkbox" id="checkbox` + i + `" name="options[]" value="` + json[i]["cod_modulo"] + `">
              <label for="checkbox` + i + `"></label>
              </span>
              </td>`);
        tabelaMod += (`<td>`);
        tabelaMod += json[i]["cod_modulo"];
        tabelaMod += (`</td> <td>`);
        tabelaMod += json[i]["categoria_1"]
        tabelaMod += (`</td> <td>`);
        tabelaMod += json[i]["categoria_2"]
        tabelaMod += (`</td> <td>`);
        tabelaMod += json[i]["categoria_3"]
        tabelaMod += (`</td>`);
        tabelaMod += (`</tr> <tr>`);
      }


      tabelaMod += (`</tr> </tbody>`);
      document.getElementById("tabelaMod").innerHTML = tabelaMod;

      $(document).ready(function () {
        // Select/Deselect checkboxes
        let checkbox = $('table tbody input[type="checkbox"]');
        $("#selectAll").click(function () {
          if (this.checked) {

            checkbox.each(function () {
              this.checked = true;
            });

            for(i=0;i<json.length;i++){  
                let mods = [];
                mods[i] = document.getElementById("checkbox" + i);
                valorModulo[i] = mods[i].value;
            }
          } else {

            checkbox.each(function () {
              this.checked = false;
            });

            for(i=0;i<json.length;i++){
                let mods = [];
                mods[i] = document.getElementById("checkbox" + i);
                valorModulo[i] = null;
            }
          }
        });
        checkbox.click(function () {
          if (!this.checked) {
            $("#selectAll").prop("checked", false);
          }
        });
      });

    });
  });
}

// function check() {
//   let checkbox = document.getElementById("selectAll"),
//     i;
//   if (checkbox.checked == true) {
//     console.log("foi");
//     for (i = 0; i < listaModulo.length; i++) {
//       document.getElementsByClassName("checking").checked == true;
//     }
//   } else if (checkbox.checked == false) {
//     console.log("nao foi");
//     for (i = 0; i < listaModulo.length; i++) {
//       document.getElementsByClassName("checking").checked == false;
//     }
//   }
// }

function editarUsuario(valor) {
  localStorage.setItem("cod_usuario", listaUser[valor]);
  window.location.href = "./gerenciaUsuario.html";
}

//pega os valores de modulo dos checkboxes e coloca na estrutura valorModulo
function modulos(numCod) {
  let mods = [];
  mods[numCod] = document.getElementById("checkbox" + numCod);
  if (mods[numCod].checked) {
    valorModulo[numCod] = mods[numCod].value;
  } else {
    valorModulo[numCod] = null;
  }
}

function enviar() {

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);

  //função fetch para mandar
  fetch('http://localhost:8080/read/usuario/createuser', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    console.log(response);

    //tratamento dos erros
    if (response.status == 201) {
      alert("Usuário criado com sucesso");
      response.json().then(function (json) {
        console.log(json);
      });
    } else {
      //erros(response.status);
    }
  });
}

function enviarMod() {

  let ultimoUser, i, j = 0;
  ultimoUser=listaModulo.length+1;
  for (i = 0; i < listaModulo.length; i++) {
    if (valorModulo[i] != null) {
      modulo[j] = {
        "cod_usuario": parseFloat(ultimoUser),
        "cod_modulo": parseFloat(valorModulo[i])
      }
      j++;
    }
  }
  console.log(j);


  //transforma as informações do token em json
  let enviarModulo = JSON.stringify(modulo);

  //função fetch para mandar
  fetch('http://localhost:8080/read/usuario/' + 1 + '/modulo', {
    method: 'POST',
    body: enviarModulo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      alert("Módulos inseridos com sucesso");
      window.location.reload();
    } else {
      //erros(response.status);
    }
    return response.json().then(function (json) {
      console.log(json);
    });
  });
}
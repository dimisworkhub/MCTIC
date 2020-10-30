//usado para mostrar a cidade selecionada
let meuMunicipio = localStorage.getItem("nome_municipio");
let meuUF = localStorage.getItem("uf");

//pega os valores corretos das variaveis
let meuCodigo = localStorage.getItem("cod_ibge");
let meuLote = localStorage.getItem("cod_lote");

window.onload = function () {

  // inserindo os valores nos campos
  document.getElementById("nome_municipio").value = meuMunicipio + " - " + meuUF;
  document.getElementById("cod_lote").value = meuLote;
  document.getElementById("os_pe").value = localStorage.getItem("os_pe");
  document.getElementById("os_imp").value = localStorage.getItem("os_imp");

  //estes campos precisam de adaptações para utilizar de suas mascaras
  document.getElementById("data_pe").value = arrumaData(localStorage.getItem("data_pe"));
  document.getElementById("data_imp").value = arrumaData(localStorage.getItem("data_imp"));

  mascara();
}


function enviar() {

  //JSON usado para mandar as informações no fetch
  let info = {
    "cod_ibge": parseInt(meuCodigo),
    "cod_lote": parseInt(meuLote),
    "os_pe": document.getElementById("os_pe").value,
    "data_pe": mascaraData(document.getElementById("data_pe").value),
    "os_imp": document.getElementById("os_imp").value,
    "data_imp": mascaraData(document.getElementById("data_imp").value),
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(info);
  //função fetch para mandar
  fetch(servidor + 'read/cd/' + meuCodigo, {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar o status do pedido
    //console.log(response);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      //checar o json
      response.json().then(function (json) {

        //console.log(json);

      });
      window.location.replace("./cd.html");
    } else {
      erros(response.status);
    }
  });
}







//CD acompanhamento

let listaUacom = [],
  listaEdicaoAssunto = [],
  meuData = [];

//usado para fazer o id dos botões de assunto
let idAssunto = 0;

//para remover valores na parte de edição
let valorRemovido = [];

//dataAssunto usado para enviar assuntos após enviar as informações de acompanhamento
let dataAssunto;



function uacom() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarUacom" onclick="pegarAssuntos()">Novo Acompanhamento</button>`);
  document.getElementById("editar2").innerHTML = "";

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/uacom/' + meuCodigo, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        listaUacom = json;

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:20%" scope="col">Data</th>
        <th style="width:20%" scope="col">Assunto</th>
        <th style="width:20%" scope="col">Titulo</th>
        <th style="width:35%" scope="col">Relato</th>
        <th style="width:5%" scope="col">Editar</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        for (i = 0; i < listaUacom.length; i++) {

          meuData[i] = listaUacom[i]["data"];

          tabela += (`<tr>`);
          tabela += (`<td class="data3">`);
          tabela += arrumaData2(listaUacom[i]["data"]);
          tabela += (`</td> <td>`);
          tabela += listaUacom[i]["descricao"];
          tabela += (`</td> <td>`);
          tabela += listaUacom[i]["titulo"];
          tabela += (`</td> <td>`);
          tabela += listaUacom[i]["relato"];
          tabela += (`</td>`);
          tabela += (`<td> 
                  <span class="d-flex">
                  <button onclick="edicaoModal(` + i + `)" class="btn btn-success" data-toggle="modal" data-target="#adicionarUacom">
                  <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                  </button>
                  </span> </td>`);
          tabela += (`</tr>`);
        }

        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();

      });
    } else {
      erros(response.status);
    }
  });
}



//valorPego serve apenas para quando já foi usado um dos assuntos na criação.
function pegarAssuntos() {
  //fetch de assunto
  fetch(servidor + 'read/assunto', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {

        //reseta para usar denovo
        idAssunto = 0;
        document.getElementById("adicoes").innerHTML = "";

        document.getElementById("titulo").value = "";
        document.getElementById("relato").value = "";

        let x = "";
        for (let i = 0; i < json.length; i++) {
          x += "<option value='" + json[i].cod_assunto + "'>" + json[i].descricao + "</option>";
        }

        document.getElementById("assunto").innerHTML = x;

        document.getElementById("botaoFinal").innerHTML = " <button class='btn btn-primary' onclick='novoUacom()' type='button'>Cadastrar</button>";

      });
    } else {
      erros(response.status);
    }
  });
}

function novoUacom() {

  let infoUacom = {
    "cod_ibge": parseInt(meuCodigo),
    "relato": document.getElementById("relato").value,
    "titulo": document.getElementById("titulo").value,
  };

  //transforma as informações em string para mandar
  let corpo = JSON.stringify(infoUacom);
  //console.log(corpo);

  //função fetch para mandar
  fetch(servidor + 'read/uacom', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      //alert('Acompanhamento inserido com sucesso!');

      //pegar a data para enviar no uacomassunto
      response.json().then(function (json) {
        dataAssunto = json.data;
        novoAssunto();
      });

    } else {
      erros(response.status);
    }
  });
}



function anotaAssunto() {

  let valorAssunto = document.getElementById("assunto").value;

  //para garantir que não haja assunto igual
  // let possuiassunto = false;

  // for(let i = 0; i < idAssunto; i++){
  //   if(valorAssunto == document.getElementById("adicoes"+i).value){
  //     possuiassunto = true;
  //   }
  // }

  //se não houver assunto
  // if(possuiassunto == false){
    //o 0 define que é a primeira a ser selecionada, sendo que não há mais de uma seleção nesse select.
    let nomeAssunto = document.querySelector("#assunto").selectedOptions[0].text;

    let assuntoSelecionado = `<button class="btn" id="adicao` + idAssunto + `" value="` + valorAssunto + `"> <a class="btn" id="removedor` + idAssunto + `" type="reset" onclick="removerAssunto(` + idAssunto + `)" title="Deletar">` + nomeAssunto + ` <img src="img/delete-icon.png" width="30px"></a> </button>`;

    document.getElementById("adicoes").innerHTML += assuntoSelecionado;

    idAssunto++;
  // }
  // else{
    // alert("Assunto já inserido.")
  // }
}

function removerAssunto(valor) {

  //para saber qual deletar
  valorRemovido[valor] = document.getElementById("adicao" + valor).value;
  document.getElementById("adicoes").removeChild(document.getElementById("adicao" + valor));

}



function novoAssunto() {

  for (let i = 0; i < idAssunto; i++) {
    if (document.getElementById("adicao" + i) != undefined) {

      let infoAssunto = {
        "cod_ibge": parseInt(meuCodigo),
        "data": dataAssunto,
        "cod_assunto": parseInt(document.getElementById("adicao" + i).value),
      };

      //transforma as informações em string para mandar
      let corpo = JSON.stringify(infoAssunto);
      //console.log(corpo);

      //função fetch para mandar
      fetch(servidor + 'read/uacomassunto', {
        method: 'POST',
        body: corpo,
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {

        //tratamento dos erros
        if (response.status == 200 || response.status == 201) {
          //reseta para usar denovo
          idAssunto = 0;
          document.getElementById("adicoes").innerHTML = "";

          location.reload();
        } else {
          erros(response.status);
        }
      });
    }
  }
}



function edicaoModal(valor) {

  //fetch de assunto
  fetch(servidor + 'read/assunto', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {

        //reseta para usar denovo
        idAssunto = 0;
        document.getElementById("adicoes").innerHTML = "";

        document.getElementById("titulo").value = listaUacom[valor]["titulo"];
        document.getElementById("relato").value = listaUacom[valor]["relato"];

        let x = "";
        for (let i = 0; i < json.length; i++) {
          x += "<option value='" + json[i].cod_assunto + "'>" + json[i].descricao + "</option>";

          //para remoção de itens
          valorRemovido[i] = 0;
        }

        document.getElementById("assunto").innerHTML = x;

        document.getElementById("botaoFinal").innerHTML = "<a><button class='btn btn-primary multi-button ml-auto js-btn-next' onclick='editarUacom(" + valor + ")' type='button'>Cadastrar</button></a>";

        getAssuntos(valor);
      });
    } else {
      erros(response.status);
    }
  });

}

function getAssuntos(valor) {
  //fetch de assuntouacom

  //preenche os assuntos na parte de edição
  fetch(servidor + 'read/uacomassunto/' + meuCodigo + "/" + meuData[valor], {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {

        for (let i = 0; i < json.length; i++) {
          document.querySelector("#assunto").selectedIndex = (json[i].cod_assunto - 1);
          anotaAssunto();
        }

        listaEdicaoAssunto = json;

      });
    } else {
      erros(response.status);
    }
  });
}



function editarUacom(valor) {

  let edicaoUacom = {
    "titulo": document.getElementById("titulo").value,
    "relato": document.getElementById("relato").value,
  };

  //transforma as informações do token em json
  let corpo = JSON.stringify(edicaoUacom);
  
  console.log(corpo);

  fetch(servidor + 'read/uacom/' + meuCodigo + '/' + meuData[valor], {
    method: 'PUT',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //checar o status do pedido
    console.log(response.statusText);

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {

      //pegar a data para enviar no editarUacom2
      response.json().then(function (json) {
        dataAssunto = json.data;
        editarUacom2();
      });

    } else {
      //erros(response.status);
    }
  });

}



function editarUacom2() {
  for (let i = 0; i < idAssunto; i++) {

    //para checar se precisa adicionar
    if (document.getElementById("adicao" + i) != undefined) {

      //caso ainda não esteja lá
      if (listaEdicaoAssunto[i] == undefined) {
        let infoAssunto = {
          "cod_ibge": parseInt(meuCodigo),
          "data": dataAssunto,
          "cod_assunto": parseInt(document.getElementById("adicao" + i).value),
        };

        //transforma as informações em string para mandar
        let corpo = JSON.stringify(infoAssunto);
        //console.log(corpo);

        //função fetch para mandar
        fetch(servidor + 'read/uacomassunto', {
          method: 'POST',
          body: corpo,
          headers: {
            'Authorization': 'Bearer ' + meuToken
          },
        }).then(function (response) {

          //tratamento dos erros
          if (response.status == 200 || response.status == 201) {

            //reseta para usar denovo
            idAssunto = 0;
            document.getElementById("adicoes").innerHTML = "";

          } else {
            erros(response.status);
          }
        });
      } else {
        console.log("Já tem");
      }

    }

    //para checar se precisa deletar
    else {

      //caso tivesse antes
      if (valorRemovido[i] != 0) {

        //função fetch para deletar
        fetch(servidor + 'read/uacomassunto/' + meuCodigo + "/" + dataAssunto + "/" + valorRemovido[i], {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + meuToken
          },
        }).then(function (response) {

          //tratamento dos erros
          if (response.status == 200 || response.status == 201 || response.status == 204) {

            //reseta para usar denovo
            idAssunto = 0;
            document.getElementById("adicoes").innerHTML = "";

          } else {
            erros(response.status);
          }
        });
      }

      //caso não tivesse antes
      else {
        console.log("Já não tava aqui.");
      }

    }

  }

  //recarrega a pagina
  //location.reload();

}




//Processos

let listaProcessos = [];

function processos() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarProcessos" onclick="pegarAssuntos()">Novo Processo</button>`);
  document.getElementById("editar2").innerHTML = "";

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/processos/' + meuCodigo, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        listaProcessos = json;

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:20%" scope="col">Processo</th>
        <th style="width:40%" scope="col">Descrição</th>
        <th style="width:20%" scope="col">Editar</th>
        <th style="width:20%" scope="col">Excluir</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        for (i = 0; i < listaProcessos.length; i++) {

          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaProcessos[i]["cod_processo"];
          tabela += (`</td> <td>`);
          tabela += listaProcessos[i]["descricao"];
          tabela += (`<td> 
                  <span class="d-flex">
                  <button onclick="edicaoProcesso(` + i + `)" class="btn btn-success" data-toggle="modal" data-target="#adicionarProcessos">
                  <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                  </button>
                  </span> </td>`);
          tabela += (`<td> 
                  <span class="d-flex">
                  <button onclick="excluirProcesso(` + i + `)" class="btn btn-success" data-toggle="modal" data-target="#adicionarProcessos">
                  <i class="material-icons"data-toggle="tooltip" title="Edit">&#xE254;</i>
                  </button>
                  </span> </td>`);
          tabela += (`</tr>`);
        }

        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();

      });
    } else {
      erros(response.status);
    }
  });
}





//Contatos

function contatosCD() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarContato">Novo Contato</button>`);

  //função fetch para chamar contatos da tabela
  fetch(servidor + 'read/contato/' + meuCodigo + '/0', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:20%" scope="col">Nome</th>
        <th style="width:20%" scope="col">Função</th>
        <th style="width:20%" scope="col">E-mail</th>
        <th style="width:10%" scope="col">Telefones</th>
        <th style="width:10%" scope="col">Tipo</th>
        <th style="width:30%" scope="col">Opções</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        // console.log(json)

        //cria uma lista apenas com os itens do lote selecionado
        let j = 0;
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_ibge"] == meuCodigo) {
            listaItem[j] = json[i];
            j++;
          }
        }
        for (i = 0; i < listaItem.length; i++) {

          //salva os valores para edição
          meuItem[i] = listaItem[i]["cod_item"];
          meuTipo[i] = listaItem[i]["cod_tipo_item"];

          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += (`<span id="nome style="white-space: pre-line">` + listaItem[i]["nome"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="funcao style="white-space: pre-line">` + listaItem[i]["funcao"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="email style="white-space: pre-line">` + listaItem[i]["email"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="telefone" style="white-space: pre-line">` + listaItem[i].telefone + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="tipo" style="white-space: pre-line">` + listaItem[i].tipo + `</span>`);
          tabela += (`</td><td> 
          <span class="d-flex">
            <button onclick="visualizarContato(` + listaItem[i].cod_contato + `,'` + listaItem[i].nome + `','` + listaItem[i].funcao + `','` + listaItem[i].email + `','` + i + `')" data-toggle="modal" href="#visualizar" class="btn btn-success">
              <i class="material-icons"data-toggle="tooltip" title="Visualizar">content_paste</i>
            </button>
            <button onclick="apagarContatoTelefone(` + listaItem[i].cod_contato + `)" class="btn btn-danger">
              <i class="material-icons"data-toggle="tooltip" title="Apagar">delete</i>
            </button>
          </span>
          </td>`);
          tabela += (`</tr>`);
          // console.log(tabela)
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();

      });
    } else {
      erros(response.status);
    }
  });
}


let id= 0
let codigoTelefone = '';
function visualizarContato(cod_contato,nome,funcao,email,identificador) {
  identificador= parseInt(identificador)
  
  fetch(servidor + 'read/telefone/' + cod_contato, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        // console.log(json)
        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
            <th style="width:20%" scope="col">Nome</th>
            <th style="width:20%" scope="col">Função</th>
            <th style="width:20%" scope="col">E-mail</th>
            <th style="width:30%" scope="col" rowspan="`+ json.length +`">Telefone</th>
            <th style="width:9%" scope="col">Ação</th>
          </tr>
          </thead>
        <tbody>
          <tr>`);
        tabela += (`<td><input value="` + nome + `" id="nome`+identificador+`" type="text" class="nome"></td>`);
        tabela += (`<td><input value="` + funcao + `" id="funcao`+identificador+`" type="text" class="funcao"></td>`);
        tabela += (`<td><input value="` + email + `" id="email`+identificador+`" type="text" class="email"></td>`);
        tabela += (`<td><div id="maisLittleInput">`);

        if(json.length == 0){
          tabela += (`<input value="" id="telefoneNew0" type="text" class="telefone" size="14">`);
            tabela += (`&nbsp&nbsp&nbsp&nbsp
            <select name="tipo" id="tipoNew0">
              <option value=""> Tipo</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Casa">Casa</option>
              <option value="Celular">Celular</option>
              <option value="Trabalho">Trabalho</option>
            </select>
            <br/>
            <br/>
            `);
        }else{
          for (i = 0; i < json.length; i++) {
            // console.log(json)
            if(json.length !=0){
              id = i +1;
            }
            tabela += (`<input value="` + json[i].telefone + `" id="telefone`+ parseInt(1+i) +`" type="text" class="telefone" size="14">`);
            tabela += (`&nbsp&nbsp&nbsp
            <select name="tipo" id="tipo`+ parseInt(1+i) +`">
              <option value="`+json[i].tipo+`">`+json[i].tipo+`</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Casa">Casa</option>
              <option value="Celular">Celular</option>
              <option value="Trabalho">Trabalho</option>
            </select>
            <button id="butaoDelet`+ parseInt(1+i) +`" onclick="apagarTelefone(`+ json[i].cod_telefone+`);lessInput(${id});" class="btn danger">
              <i class="material-icons"data-toggle="tooltip" title="Apagar Telefone">delete</i>
            </button>
            `);
          }
        }
        
        
        // console.log(id)
        tabela += (`</div>
        <siders/>
        </td>`);
        tabela += (`</td>
        <td> 
          <span class="d-flex">
            <button onclick="editarContato(`+ identificador +`,`+cod_contato+`);editarTelefone(`+ identificador +`,`+cod_contato+`);novoTelefone(`+cod_contato+`,${pass=true});" data-toggle="modal" href="#visualizar" class="btn ">
              <i class="material-icons"data-toggle="tooltip" title="Salvar">&#xE254;</i>
            </button>
          </span> 
          <span class="d-flex">
            &nbsp&nbsp&nbsp<a class="js-btn-next" type="reset" id="clicaInput" onclick="litteInput(${true});" title="Adicionar"><img  src="img/add-icon.png" width="25px"></a>
          </span> 
        </td>`);
        tabela += (`</tr></tbody>`);
        // console.log(tabela)

        
        document.getElementById("visualiza").innerHTML = tabela;
        mascara();
      });
    } else {
      erros(response.status);
    }
  });
  // document.getElementById("tabela").innerHTML = tabela;
}

contador=0
function litteInput(passe){
  // console.log(passe)
  if(passe == true){
    $(document).ready(function(){
      mascara();
      $("siders").append(`
      <div id="pequenoInput${contador}">
        <input value="" id="telefoneNew`+ contador +`" type="text" class="telefone" size="14">
        &nbsp&nbsp&nbsp
        <select name="tipo" id="tipoNew`+ contador +`">
          <option value="">Tipo</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Casa">Casa</option>
          <option value="Celular">Celular</option>
          <option value="Trabalho">Trabalho</option>
        </select>
      </div>
      <br>
      `)
      
    });
    console.log(contador)
    contador = contador + 1;
  }
  return contador;
}

function lessInput(identifier){
  document.getElementById('maisLittleInput').removeChild(document.getElementById('telefone'+identifier));
  document.getElementById('maisLittleInput').removeChild(document.getElementById('tipo'+identifier));
  document.getElementById('maisLittleInput').removeChild(document.getElementById('butaoDelet'+identifier));
}

function editarTelefone(id, cod_contato) {

  fetch(servidor + 'read/telefone/' + cod_contato, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        litteInput(false)

        for (let i = 0; i < json.length; i++) {


          // console.log(document.getElementById("telefone2").value)
          edicaoItem[i] = {
            "telefone": document.getElementById("telefone" + parseInt(1 + i)).value,
            "tipo": document.getElementById("tipo" + parseInt(1 + i)).value,
          };


          console.log(edicaoItem[i])
          if (edicaoItem[i]["telefone"] != listaItem[i]["telefone"] || edicaoItem[i]["tipo"] != listaItem[i]["tipo"]) {
            //transforma as informações do token em json
            let corpo = JSON.stringify(edicaoItem[i]);
            //função fetch para mandar
            fetch(servidor + 'read/telefone/' + json[i].cod_telefone, {
              method: 'PUT',
              body: corpo,
              headers: {
                'Authorization': 'Bearer ' + meuToken
              },
            }).then(function (response) {
              //checar o status do pedido
              console.log(response.statusText);

              //tratamento dos erros
              if (response.status == 200 || response.status == 201) {
                setTimeout(function(){
                  location.reload()
                }, 2000);
              } else {
                erros(response.status);
              }
              // window.location.replace("./gerenciaCd.html");
            });
          }
        }
      });


    } else {
      erros(response.status);
    }
  });
}

function editarContato(id, cod_contato) {


  edicaoItem = {
    "nome": document.getElementById("nome" + id).value,
    "email": document.getElementById("email" + id).value,
    "funcao": document.getElementById("funcao" + id).value,
  };

  //console.log(edicaoItem)
  if (edicaoItem["nome"] != listaItem["nome"] || edicaoItem["email"] != listaItem["email"] || edicaoItem["funcao"] != listaItem["funcao"]) {
    //transforma as informações do token em json
    let corpo = JSON.stringify(edicaoItem);
    //função fetch para mandar
    fetch(servidor + 'read/contato/' + cod_contato, {
      method: 'PUT',
      body: corpo,
      headers: {
        'Authorization': 'Bearer ' + meuToken
      },
    }).then(function (response) {
      //checar o status do pedido
      console.log(response.statusText);

      //tratamento dos erros
      if (response.status == 200 || response.status == 201) {
        // location.reload();
      } else {
        erros(response.status);
      }
      // window.location.replace("./gerenciaCd.html");
    });
  }

}

function novoContato() {

  let infoContato = {
    "cod_ibge": parseInt(meuCodigo),
    "nome": document.getElementById("nome").value,
    "email": document.getElementById("email").value,
    "funcao": document.getElementById("funcao").value,
  };

  console.log(infoContato)
  //transforma as informações em string para mandar
  let corpo = JSON.stringify(infoContato);
  //função fetch para mandar
  fetch(servidor + 'read/contato', {
    method: 'POST',
    body: corpo,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      alert('Contato inserido com sucesso!')
      // location.reload();
    } else {
      erros(response.status);
    }
  });
}

function novoTelefone(cod_contato, pass) {

  let meuContato;
  let infoTelefone = [];

  //Pega o numero de inputs do modal de adicionar
  maisInput(false);
  //pega o numero de inputs do modal de editar
  litteInput(false);

  fetch(servidor + 'read/contato/' + meuCodigo + '/0', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    
    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {
        
        //Pega o ultimo contato salvo
        for (let i = 0; i < json.length; i++) {
          meuContato= json[i].cod_contato;
        }
        let tel0 = document.getElementById("telefoneNew0")
        
        if(pass== true && (tel0 != null) ){
          for (let i = 0; i <= contador; i++) {
            infoTelefone[i] = {
              "cod_contato": parseInt(cod_contato),
              "telefone": document.getElementById("telefoneNew"+parseInt(i)).value,
              "tipo": document.getElementById("tipoNew"+parseInt(i)).value,
            };
          
            if(infoTelefone[i].cod_contato != null && infoTelefone[i].telefone != null && infoTelefone[i].tipo != null){
              //transforma as informações em string para mandar
              let corpo = JSON.stringify(infoTelefone[i]);
              console.log(infoTelefone[i]);
              //função fetch para mandar
              fetch(servidor + 'read/telefone', {
                method: 'POST',
                body: corpo,
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {
    
                //tratamento dos erros
                if (response.status == 200 || response.status == 201) {
                  // alert('O telefone: '+ infoTelefone[i].telefone +' do tipo: '+ infoTelefone[i].tipo +' cadastrado com sucesso!');
                } else {
                  erros(response.status);
                }
              });
            }
          }
        }
        else if(pass== true && contador>0 && tel0 == null){
          for (let i = 1; i <= contador; i++) {
            infoTelefone[i] = {
              "cod_contato": parseInt(cod_contato),
              "telefone": document.getElementById("telefoneNew"+parseInt(i)).value,
              "tipo": document.getElementById("tipoNew"+parseInt(i)).value,
            };
          
            if(infoTelefone[i].cod_contato != null && infoTelefone[i].telefone != null && infoTelefone[i].tipo != null){
              //transforma as informações em string para mandar
              let corpo = JSON.stringify(infoTelefone[i]);
              console.log(infoTelefone[i]);
              //função fetch para mandar
              fetch(servidor + 'read/telefone', {
                method: 'POST',
                body: corpo,
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {
    
                //tratamento dos erros
                if (response.status == 200 || response.status == 201) {
                  // alert('O telefone: '+ infoTelefone[i].telefone +' do tipo: '+ infoTelefone[i].tipo +' cadastrado com sucesso!');
                } else {
                  erros(response.status);
                }
              });
            }
          }
        }
        else{

          for (let i = 0; i < indice+1; i++) {
            infoTelefone[i] = {
              "cod_contato": parseInt(meuContato),
              "telefone": document.getElementById("telefone"+i).value,
              "tipo": document.getElementById("tipo"+i).value,
            };
          
            if(infoTelefone[i].cod_contato != null && infoTelefone[i].telefone != null && infoTelefone[i].tipo != null){
              //transforma as informações em string para mandar
              let corpo = JSON.stringify(infoTelefone[i]);
              console.log(infoTelefone[i]);
              //função fetch para mandar
              fetch(servidor + 'read/telefone', {
                method: 'POST',
                body: corpo,
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {
    
                //tratamento dos erros
                if (response.status == 200 || response.status == 201) {
                  // alert('O telefone: '+ infoTelefone[i].telefone +' do tipo: '+ infoTelefone[i].tipo +' cadastrado com sucesso!');
                } else {
                  erros(response.status);
                }
              });
            }
          }
        }
        if(pass != true){
          alert('O(s) telefone(s) foi(ram) cadastrado(s) com sucesso!');
          location.reload();
        }else{
          setTimeout(function(){
            location.reload()
          }, 3000);
        }
      });
    } else {
      erros(response.status);
    }
  });
}

let indice = 0;
function maisInput(passe){
  if(passe == true && indice < 3){
    indice = indice + 1;
    $(document).ready(function(){
      mascara();
      $("side").append('<div id="telTipo'+indice+'" class="form-row mt-4">'+
                          '<div class="col-12 col-sm-6">'+
                            '<input class="multisteps-form__input form-control telefone" type="text" placeholder="Telefone" id="telefone'+indice+'" name="telefone"/>'+
                          '</div>'+
                          '<div class="col-12 col-sm-6">'+
                            '<select class="multisteps-form__input form-control" name="tipo" id="tipo'+ indice +'">'+
                              '<option value="">Tipo</option>'+
                              '<option value="WhatsApp">WhatsApp</option>'+
                              '<option value="Casa">Casa</option>'+
                              '<option value="Celular">Celular</option>'+
                              '<option value="Trabalho">Trabalho</option>'+
                            '</select>'+
                          '</div>'+
                        '</div>')
    });
    // console.log(indice)
  }
  return indice;
}

function menosInput(){
  if(indice>0){
    document.getElementById('maisTelefone').removeChild(document.getElementById('telTipo'+indice));
  }
  indice = indice -1;
  // console.log(indice)
  return indice
}

function apagarContatoTelefone(cod_contato) {

  fetch(servidor + 'read/telefone/' + cod_contato, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {
        console.log(json)

        if (json.length != 0) {

          Swal.fire({
            title: 'Tem certeza?',
            text: "Que deseja excluir todos os telefones?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, tenho certeza!'
          }).then((result) => {

            if (result.value) {

              Swal.fire(
                'Sucesso!',
                'Os telefones foram excluidos com sucesso!',
                'success'
              )

              for (i = 0; i < json.length; i++) {
                fetch(servidor + 'read/telefone/' + json[i].cod_telefone, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': 'Bearer ' + meuToken
                  },
                }).then(function (response) {
                  console.log('telefone deletado com sucesso!')
                });
              }

              Swal.fire({
                title: 'Tem certeza?',
                text: "Que deseja excluir este Contato?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, tenho certeza!'
              }).then((result) => {

                if (result.value) {

                  Swal.fire(
                    'Sucesso!',
                    'O Contato foi excluido com sucesso!',
                    'success'
                  )

                  fetch(servidor + 'read/contato/' + cod_contato, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': 'Bearer ' + meuToken
                    },
                  }).then(function (response) {

                    console.log('Contato deletado com sucesso!')
                  });

                  setTimeout(function () {
                    location.reload()
                  }, 2000);

                } else {

                  location.reload();

                }
              });

            }
          });
        } else {
          Swal.fire({
            title: 'Tem certeza?',
            text: "Que deseja excluir este Contato?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, tenho certeza!'
          }).then((result) => {

            if (result.value) {

              Swal.fire(
                'Sucesso!',
                'O Contato foi excluido com sucesso!',
                'success'
              )
              fetch(servidor + 'read/contato/' + cod_contato, {
                method: 'DELETE',
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {

                console.log('Contato deletado com sucesso!')
              });

              setTimeout(function () {
                location.reload()
              }, 2000);

            }
          });
        }
      })
    }
  });
}

function apagarTelefone(cod_telefone) {

  fetch(servidor + 'read/telefone/' + cod_telefone, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {
    //checar os status de pedidos
    console.log(response)

    //tratamento dos erros
    if (response.status == 204) {
      //console.log(response.statusText);
      alert('Telefone deletado com sucesso!')
    }
  });
}

//Ponto
function ponto() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button class="btn btn-success" data-toggle="modal" data-target="#adicionarPonto">Novo Ponto</button>`);

  //função fetch para chamar contatos da tabela
  fetch(servidor + 'read/ponto/'+meuCodigo, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
        <tr>
        <th style="width:20%" scope="col">Nome</th>
        <th style="width:20%" scope="col">INEP</th>
        <th style="width:20%" scope="col">Categoria</th>
        <th style="width:10%" scope="col">CEP</th>
        <th style="width:10%" scope="col">Bairro</th>
        <th style="width:30%" scope="col">Endereço</th>
        <th style="width:30%" scope="col">Número</th>
        <th style="width:30%" scope="col">Complemento</th>
        <th style="width:30%" scope="col">Latitude</th>
        <th style="width:30%" scope="col">Longitude</th>
        <th style="width:30%" scope="col">Opções</th>
        </tr>
        </thead>`);
        tabela += (`<tbody>`);

        console.log(json)
        
        //cria uma lista apenas com os itens do lote selecionado
        let j = 0;
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_ibge"] == meuCodigo) {
            listaItem[j] = json[i];
            j++;
          }
        }
        for (i = 0; i < listaItem.length; i++) {

          tabela += (`<tr>`);
          tabela += (`<td>`);

          tabela += (`<span id="nome style="white-space: pre-line">` + listaItem[i]["nome"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="funcao style="white-space: pre-line">` + listaItem[i]["inep"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span id="email style="white-space: pre-line">` + listaItem[i]["descricao"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="cep" style="white-space: pre-line">` + listaItem[i]["cep"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="bairro" style="white-space: pre-line">` + listaItem[i]["bairro"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="endereco" style="white-space: pre-line">` + listaItem[i]["endereco"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="numero" style="white-space: pre-line">` + listaItem[i]["numero"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="complemento" style="white-space: pre-line">` + listaItem[i]["complemento"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="latitude" style="white-space: pre-line">` + listaItem[i]["latitude"] + `</span>`);
          tabela += (`</td> <td>`);
          tabela += (`<span class="" id="longitude" style="white-space: pre-line">` + listaItem[i]["longitude"] + `</span>`);
          tabela += (`</td> 
          <td>
            <span class="d-flex">
              <button onclick="visualizarContato(` + listaItem[i].cod_contato + `,'` + listaItem[i].nome + `','` + listaItem[i].funcao + `','` + listaItem[i].email + `','` + i + `')" data-toggle="modal" href="#visualizar" class="btn btn-success">
                <i class="material-icons"data-toggle="tooltip" title="Visualizar">content_paste</i>
              </button>
              <button onclick="apagarPidPonto( ${listaItem[i].cod_ponto}, ${listaItem[i].cod_categoria},  ${listaItem[i].cod_pid} )" class="btn btn-danger">
                <i class="material-icons"data-toggle="tooltip" title="Apagar">delete</i>
              </button>
            </span>
          </td>`);
          tabela += (`</tr>`);
          // console.log(tabela)
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();

      });
    } else {
      erros(response.status);
    }
  });
}

function novoPidPonto() {

  let ultimoPid

  let infoPid = {
    "cod_ibge": parseInt(meuCodigo),
    "nome": document.getElementById("nomePonto").value,
    "inep": document.getElementById("inep").value,
  };

  console.log(infoPid)
  //transforma as informações em string para mandar
  let corpo1 = JSON.stringify(infoPid);
  //função fetch para mandar
  fetch(servidor + 'read/pid', {
    method: 'POST',
    body: corpo1,
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      console.log('Pid inserido com sucesso!')
      
      setTimeout(function () {
      
        //função fetch para buscar o ultimo pid instalado
        fetch(servidor + 'read/pid', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + meuToken
          },
        }).then(function (response) {
  
          if (response.status == 200) {
  
            //pegar o json que possui a tabela
            response.json().then(function (json) {
  
              //ultimo cod_pid
              for (i = 0; i < json.length; i++) {
                ultimoPid = json[i].cod_pid;
              }
              console.log(ultimoPid)
              
              let infoPonto = {
                "cod_categoria": parseInt(document.getElementById("categoria").value),
                "cod_ibge": parseInt(meuCodigo),
                "cod_pid": parseInt(ultimoPid),
                "endereco": document.getElementById("enderecoPonto").value,
                "numero": document.getElementById("numeroPonto").value,
                "complemento": document.getElementById("complementoPonto").value,
                "bairro": document.getElementById("bairroPonto").value,
                "cep": document.getElementById("cepPonto").value,
                "latitude": parseFloat(document.getElementById("latitude").value),
                "longitude": parseFloat(document.getElementById("longitude").value),
              };
            
              console.log(infoPonto)
              //transforma as informações em string para mandar
              let corpo2 = JSON.stringify(infoPonto);
              //função fetch para mandar
              fetch(servidor + 'read/ponto', {
                method: 'POST',
                body: corpo2,
                headers: {
                  'Authorization': 'Bearer ' + meuToken
                },
              }).then(function (response) {
            
                //tratamento dos erros
                if (response.status == 200 || response.status == 201) {
                  alert('Ponto inserido com sucesso!')
                  setTimeout(function () {
                    location.reload()
                  }, 2000);
                } else {
                  erros(response.status);
                }
              });
  
            });
          } else {
            erros(response.status);
          }
        });
      }, 1000);
    } else {
      erros(response.status);
    }
  });
}

function apagarPidPonto(cod_ponto, cod_categoria, cod_pid) {

  Swal.fire({
    title: 'Tem certeza?',
    text: "Que deseja excluir o Ponto?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, tenho certeza!'
  }).then((result) => {

    if (result.value) {

      Swal.fire(
        'Sucesso!',
        'O Ponto foi excluido com sucesso!',
        'success'
      )
        
        
      fetch(servidor + `read/ponto/${cod_ponto}/${cod_categoria}/${meuCodigo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {
        console.log('ponto deletado com sucesso!')

        setTimeout(function () {

          fetch(servidor + 'read/pid/' + cod_pid, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + meuToken
            },
          }).then(function (response) {
    
            console.log('Pid deletado com sucesso!')
          });
    
          setTimeout(function () {
            location.reload()
          }, 1000);

        }, 2000);
      });
      
    }
  });
}

function viaCep(){

  fetch(`http://viacep.com.br/ws/${document.getElementById("cepPonto").value}/json/`, {
    method: 'GET',
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200 || response.status == 201) {
      response.json().then(function (json) {
        console.log(json)
        document.getElementById("enderecoPonto").value = json.logradouro;
        document.getElementById("bairroPonto").value = json.bairro;
        document.getElementById("complementoPonto").value = json.complemento;
      });
    } else {
      erros(response.status);
    }
  });

}